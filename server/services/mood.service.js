const tmdbService = require('./tmdb.service');
const Rating = require('../models/Rating');
const { Op } = require('sequelize');

class MoodService {
  constructor() {
    // Map moods to TMDB genre IDs
    this.moodGenreMap = {
      happy: {
        genres: [35, 10751, 16, 10402], // Comedy, Family, Animation, Music
        keywords: ['feel-good', 'uplifting', 'fun', 'cheerful'],
        description: 'Feel-good movies to enhance your happiness'
      },
      sad: {
        genres: [18, 10749, 10402], // Drama, Romance, Music
        keywords: ['emotional', 'touching', 'heartfelt', 'moving'],
        description: 'Emotional stories that resonate with your feelings'
      },
      angry: {
        genres: [28, 80, 53], // Action, Crime, Thriller
        keywords: ['intense', 'action-packed', 'revenge', 'justice'],
        description: 'High-energy films to channel your intensity'
      },
      fearful: {
        genres: [27, 9648, 53], // Horror, Mystery, Thriller
        keywords: ['suspense', 'thrilling', 'mysterious', 'scary'],
        description: 'Thrilling movies that embrace the tension'
      },
      disgusted: {
        genres: [99, 36, 878], // Documentary, History, Sci-Fi
        keywords: ['thought-provoking', 'eye-opening', 'revealing'],
        description: 'Films that provoke thought and discussion'
      },
      surprised: {
        genres: [878, 14, 9648, 12], // Sci-Fi, Fantasy, Mystery, Adventure
        keywords: ['unexpected', 'mind-bending', 'plot-twist', 'surprising'],
        description: 'Movies full of surprises and unexpected turns'
      },
      neutral: {
        genres: [35, 18, 28, 12], // Comedy, Drama, Action, Adventure
        keywords: ['popular', 'acclaimed', 'trending'],
        description: 'Popular and highly-rated movies across genres'
      },
      excited: {
        genres: [28, 12, 878, 14], // Action, Adventure, Sci-Fi, Fantasy
        keywords: ['thrilling', 'adventurous', 'epic', 'spectacular'],
        description: 'Epic adventures and spectacular films'
      },
      calm: {
        genres: [10749, 36, 99, 10751], // Romance, History, Documentary, Family
        keywords: ['peaceful', 'relaxing', 'gentle', 'soothing'],
        description: 'Gentle and peaceful films for relaxation'
      },
      romantic: {
        genres: [10749, 35, 18], // Romance, Comedy, Drama
        keywords: ['love', 'romantic', 'heartwarming', 'relationship'],
        description: 'Love stories and romantic tales'
      }
    };

    // Map face-api.js emotions to our mood categories
    this.emotionToMoodMap = {
      happy: 'happy',
      sad: 'sad',
      angry: 'angry',
      fearful: 'fearful',
      disgusted: 'disgusted',
      surprised: 'surprised',
      neutral: 'neutral'
    };
  }

  /**
   * Get movie recommendations based on mood
   */
  async getMoodBasedRecommendations(userId, mood, emotions = null, limit = 20) {
    try {
      const moodData = this.moodGenreMap[mood.toLowerCase()] || this.moodGenreMap.neutral;
      const recommendations = [];
      const movieIds = new Set();

      // Get user's rating history to avoid duplicates
      let userRatedMovies = [];
      if (userId) {
        try {
          const ratings = await Rating.findAll({
            where: { userId },
            attributes: ['movieId']
          });
          userRatedMovies = ratings.map(r => r.movieId);
        } catch (error) {
          console.log('Could not fetch user ratings:', error.message);
        }
      }

      // Get movies from each genre associated with the mood
      for (const genreId of moodData.genres) {
        try {
          // Get multiple pages for variety
          const pages = Math.min(2, Math.ceil(limit / moodData.genres.length / 10));
          
          for (let page = 1; page <= pages; page++) {
            const movies = await tmdbService.getMoviesByGenre(genreId, page);
            
            if (!movies || !movies.results || movies.results.length === 0) {
              console.log(`No movies found for genre ${genreId}, page ${page}`);
              continue;
            }
            
            for (const movie of movies.results) {
              // Skip if already in user's ratings
              if (userRatedMovies.includes(movie.id)) continue;
              
              // Skip if already added
              if (movieIds.has(movie.id)) continue;

              // Calculate mood match score
              const moodScore = this.calculateMoodScore(movie, moodData, emotions);
              
              movieIds.add(movie.id);
              recommendations.push({
                ...movie,
                moodScore,
                moodMatch: mood,
                recommendationType: 'mood-based'
              });

              if (recommendations.length >= limit * 2) break;
            }
            
            if (recommendations.length >= limit * 2) break;
          }
        } catch (error) {
          console.error(`Error fetching movies for genre ${genreId}:`, error.message);
        }
      }

      // If no recommendations found, try to get popular movies as fallback
      if (recommendations.length === 0) {
        console.log('No mood-based recommendations found, using popular movies as fallback');
        try {
          const popularMovies = await tmdbService.getPopularMovies();
          if (popularMovies && popularMovies.results) {
            for (const movie of popularMovies.results.slice(0, limit)) {
              recommendations.push({
                ...movie,
                moodScore: this.calculateMoodScore(movie, moodData, emotions),
                moodMatch: mood,
                recommendationType: 'popular-fallback'
              });
            }
          }
        } catch (fallbackError) {
          console.error('Fallback to popular movies failed:', fallbackError.message);
        }
      }

      // Sort by mood score and return top recommendations
      return recommendations
        .sort((a, b) => b.moodScore - a.moodScore)
        .slice(0, limit);
    } catch (error) {
      console.error('Mood-based recommendation error:', error);
      throw error;
    }
  }

  /**
   * Calculate how well a movie matches the mood
   */
  calculateMoodScore(movie, moodData, emotions) {
    let score = 0;

    // Base score from popularity
    score += (movie.popularity || 0) * 0.3;

    // Vote average (rating) - higher is better
    score += (movie.vote_average || 0) * 10;

    // Genre matching - boost if movie genres match mood genres
    if (movie.genre_ids && moodData.genres) {
      const matchingGenres = movie.genre_ids.filter(g => moodData.genres.includes(g));
      score += matchingGenres.length * 25;
    }

    // Emotion intensity matching (if provided)
    if (emotions) {
      // If strong emotions detected, prefer higher-rated movies
      const maxEmotion = Math.max(...Object.values(emotions));
      if (maxEmotion > 0.7) {
        score += movie.vote_average * 5;
      }
    }

    // Release date recency (prefer newer movies slightly)
    if (movie.release_date) {
      const year = new Date(movie.release_date).getFullYear();
      const currentYear = new Date().getFullYear();
      const yearDiff = currentYear - year;
      if (yearDiff < 5) {
        score += (5 - yearDiff) * 2;
      }
    }

    return score;
  }

  /**
   * Get genres for a specific mood
   */
  getMoodGenres(mood) {
    const moodData = this.moodGenreMap[mood.toLowerCase()];
    return moodData ? moodData.genres : this.moodGenreMap.neutral.genres;
  }

  /**
   * Get description for a specific mood
   */
  getMoodDescription(mood) {
    const moodData = this.moodGenreMap[mood.toLowerCase()];
    return moodData ? moodData.description : this.moodGenreMap.neutral.description;
  }

  /**
   * Get all supported moods
   */
  getSupportedMoods() {
    return Object.keys(this.moodGenreMap).map(mood => ({
      mood,
      description: this.moodGenreMap[mood].description,
      genres: this.moodGenreMap[mood].genres
    }));
  }

  /**
   * Map face-api emotion to mood category
   */
  mapEmotionToMood(emotions) {
    // Find the dominant emotion
    let dominantEmotion = 'neutral';
    let maxValue = 0;

    for (const [emotion, value] of Object.entries(emotions)) {
      if (value > maxValue) {
        maxValue = value;
        dominantEmotion = emotion;
      }
    }

    // If feeling romantic (look at combination of happy and neutral)
    if (emotions.happy > 0.3 && emotions.neutral > 0.3) {
      return 'romantic';
    }

    // If calm (high neutral, low other emotions)
    if (emotions.neutral > 0.5 && maxValue < 0.7) {
      return 'calm';
    }

    // If excited (high happy with some surprise)
    if (emotions.happy > 0.5 && emotions.surprised > 0.2) {
      return 'excited';
    }

    return this.emotionToMoodMap[dominantEmotion] || 'neutral';
  }
}

module.exports = new MoodService();
