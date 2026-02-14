const Rating = require('../models/Rating');
const tmdbService = require('./tmdb.service');

class RecommendationService {
  /**
   * Get personalized recommendations for a user
   * Uses hybrid approach: content-based + collaborative filtering + popularity
   */
  async getRecommendations(userId, limit = 20) {
    try {
      // Get user's ratings
      const userRatings = await Rating.find({ userId }).sort({ rating: -1, createdAt: -1 });

      if (userRatings.length === 0) {
        // New user - return popular movies
        return await this.getPopularRecommendations(limit);
      }

      // Get content-based recommendations
      const contentBasedRecs = await this.getContentBasedRecommendations(userRatings, limit);

      // Get collaborative filtering recommendations
      const collaborativeRecs = await this.getCollaborativeRecommendations(userId, userRatings, limit);

      // Merge and deduplicate recommendations
      const mergedRecs = this.mergeRecommendations(contentBasedRecs, collaborativeRecs, limit);

      return mergedRecs;
    } catch (error) {
      console.error('Recommendation error:', error);
      throw error;
    }
  }

  /**
   * Content-based filtering: recommend movies similar to highly rated ones
   */
  async getContentBasedRecommendations(userRatings, limit) {
    try {
      const recommendations = [];
      const movieIds = new Set();

      // Focus on movies rated 4 or 5 stars
      const highlyRatedMovies = userRatings.filter(r => r.rating >= 4).slice(0, 5);

      for (const rating of highlyRatedMovies) {
        try {
          // Get similar movies from TMDB
          const similarMovies = await tmdbService.getSimilarMovies(rating.movieId, 1);
          
          for (const movie of similarMovies.results) {
            if (!movieIds.has(movie.id) && recommendations.length < limit * 2) {
              movieIds.add(movie.id);
              recommendations.push({
                ...movie,
                recommendationScore: this.calculateContentScore(movie, rating),
                recommendationType: 'content-based'
              });
            }
          }
        } catch (error) {
          console.error(`Error getting similar movies for ${rating.movieId}:`, error.message);
        }
      }

      // Also recommend by genre
      if (highlyRatedMovies.length > 0) {
        const genreCount = {};
        highlyRatedMovies.forEach(rating => {
          rating.genres?.forEach(genreId => {
            genreCount[genreId] = (genreCount[genreId] || 0) + 1;
          });
        });

        // Get top genres
        const topGenres = Object.entries(genreCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 2)
          .map(([genreId]) => parseInt(genreId));

        for (const genreId of topGenres) {
          try {
            const genreMovies = await tmdbService.getMoviesByGenre(genreId, 1);
            
            for (const movie of genreMovies.results) {
              if (!movieIds.has(movie.id) && recommendations.length < limit * 2) {
                movieIds.add(movie.id);
                recommendations.push({
                  ...movie,
                  recommendationScore: movie.popularity * 0.7,
                  recommendationType: 'genre-based'
                });
              }
            }
          } catch (error) {
            console.error(`Error getting movies by genre ${genreId}:`, error.message);
          }
        }
      }

      // Sort by recommendation score
      return recommendations
        .sort((a, b) => b.recommendationScore - a.recommendationScore)
        .slice(0, limit);
    } catch (error) {
      console.error('Content-based recommendation error:', error);
      return [];
    }
  }

  /**
   * Collaborative filtering: recommend movies liked by similar users
   */
  async getCollaborativeRecommendations(userId, userRatings, limit) {
    try {
      const recommendations = [];
      const userMovieIds = new Set(userRatings.map(r => r.movieId));

      // Find similar users (users who rated the same movies similarly)
      const similarUsers = await this.findSimilarUsers(userId, userRatings);

      // Get movies rated highly by similar users that current user hasn't seen
      for (const similarUserId of similarUsers.slice(0, 10)) {
        const similarUserRatings = await Rating.find({
          userId: similarUserId,
          rating: { $gte: 4 }
        }).limit(20);

        for (const rating of similarUserRatings) {
          if (!userMovieIds.has(rating.movieId)) {
            recommendations.push({
              id: rating.movieId,
              title: rating.movieTitle,
              poster_path: rating.moviePoster,
              recommendationScore: rating.rating * 20,
              recommendationType: 'collaborative'
            });
          }
        }
      }

      // Deduplicate and aggregate scores
      const movieScores = {};
      recommendations.forEach(rec => {
        if (!movieScores[rec.id]) {
          movieScores[rec.id] = { ...rec, count: 0 };
        }
        movieScores[rec.id].recommendationScore += rec.recommendationScore;
        movieScores[rec.id].count += 1;
      });

      return Object.values(movieScores)
        .map(movie => ({
          ...movie,
          recommendationScore: movie.recommendationScore / movie.count
        }))
        .sort((a, b) => b.recommendationScore - a.recommendationScore)
        .slice(0, limit);
    } catch (error) {
      console.error('Collaborative filtering error:', error);
      return [];
    }
  }

  /**
   * Find users with similar rating patterns
   */
  async findSimilarUsers(userId, userRatings) {
    try {
      const userMovieIds = userRatings.map(r => r.movieId);
      
      // Find users who rated at least 2 of the same movies
      const similarUserRatings = await Rating.find({
        movieId: { $in: userMovieIds },
        userId: { $ne: userId }
      });

      // Calculate similarity scores
      const userScores = {};
      similarUserRatings.forEach(rating => {
        const userRating = userRatings.find(r => r.movieId === rating.movieId);
        if (userRating) {
          const similarityScore = 5 - Math.abs(userRating.rating - rating.rating);
          userScores[rating.userId] = (userScores[rating.userId] || 0) + similarityScore;
        }
      });

      // Return user IDs sorted by similarity
      return Object.entries(userScores)
        .sort((a, b) => b[1] - a[1])
        .map(([userId]) => userId);
    } catch (error) {
      console.error('Find similar users error:', error);
      return [];
    }
  }

  /**
   * Calculate content-based recommendation score
   */
  calculateContentScore(movie, baseRating) {
    let score = movie.popularity || 50;
    
    // Boost score if genres match
    if (movie.genre_ids && baseRating.genres) {
      const matchingGenres = movie.genre_ids.filter(g => baseRating.genres.includes(g));
      score += matchingGenres.length * 20;
    }

    // Factor in movie rating
    if (movie.vote_average) {
      score += movie.vote_average * 10;
    }

    return score;
  }

  /**
   * Merge and deduplicate recommendations from multiple sources
   */
  mergeRecommendations(contentRecs, collaborativeRecs, limit) {
    const movieMap = new Map();

    // Add content-based recommendations (60% weight)
    contentRecs.forEach(rec => {
      movieMap.set(rec.id, {
        ...rec,
        finalScore: rec.recommendationScore * 0.6
      });
    });

    // Add collaborative recommendations (40% weight)
    collaborativeRecs.forEach(rec => {
      if (movieMap.has(rec.id)) {
        const existing = movieMap.get(rec.id);
        existing.finalScore += rec.recommendationScore * 0.4;
        existing.recommendationType = 'hybrid';
      } else {
        movieMap.set(rec.id, {
          ...rec,
          finalScore: rec.recommendationScore * 0.4
        });
      }
    });

    // Sort by final score and return top recommendations
    return Array.from(movieMap.values())
      .sort((a, b) => b.finalScore - a.finalScore)
      .slice(0, limit);
  }

  /**
   * Get popular movies for new users
   */
  async getPopularRecommendations(limit) {
    try {
      const popularMovies = await tmdbService.getPopularMovies(1);
      return popularMovies.results.slice(0, limit).map(movie => ({
        ...movie,
        recommendationScore: movie.popularity,
        recommendationType: 'popular'
      }));
    } catch (error) {
      console.error('Popular recommendations error:', error);
      return [];
    }
  }
}

module.exports = new RecommendationService();
