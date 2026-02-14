const axios = require('axios');

class TMDBService {
  constructor() {
    this.apiKey = process.env.TMDB_API_KEY;
    this.baseUrl = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';
  }

  async getPopularMovies(page = 1) {
    try {
      const response = await axios.get(`${this.baseUrl}/movie/popular`, {
        params: {
          api_key: this.apiKey,
          page,
          language: 'en-US'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`TMDB API Error: ${error.message}`);
    }
  }

  async getTopRatedMovies(page = 1) {
    try {
      const response = await axios.get(`${this.baseUrl}/movie/top_rated`, {
        params: {
          api_key: this.apiKey,
          page,
          language: 'en-US'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`TMDB API Error: ${error.message}`);
    }
  }

  async getNowPlayingMovies(page = 1) {
    try {
      const response = await axios.get(`${this.baseUrl}/movie/now_playing`, {
        params: {
          api_key: this.apiKey,
          page,
          language: 'en-US'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`TMDB API Error: ${error.message}`);
    }
  }

  async getUpcomingMovies(page = 1) {
    try {
      const response = await axios.get(`${this.baseUrl}/movie/upcoming`, {
        params: {
          api_key: this.apiKey,
          page,
          language: 'en-US'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`TMDB API Error: ${error.message}`);
    }
  }

  async searchMovies(query, page = 1) {
    try {
      const response = await axios.get(`${this.baseUrl}/search/movie`, {
        params: {
          api_key: this.apiKey,
          query,
          page,
          language: 'en-US'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`TMDB API Error: ${error.message}`);
    }
  }

  async getMovieDetails(movieId) {
    try {
      const response = await axios.get(`${this.baseUrl}/movie/${movieId}`, {
        params: {
          api_key: this.apiKey,
          language: 'en-US',
          append_to_response: 'credits,videos'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`TMDB API Error: ${error.message}`);
    }
  }

  async getMoviesByGenre(genreId, page = 1) {
    try {
      const response = await axios.get(`${this.baseUrl}/discover/movie`, {
        params: {
          api_key: this.apiKey,
          with_genres: genreId,
          page,
          language: 'en-US',
          sort_by: 'popularity.desc'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`TMDB API Error: ${error.message}`);
    }
  }

  async getSimilarMovies(movieId, page = 1) {
    try {
      const response = await axios.get(`${this.baseUrl}/movie/${movieId}/similar`, {
        params: {
          api_key: this.apiKey,
          page,
          language: 'en-US'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`TMDB API Error: ${error.message}`);
    }
  }
}

module.exports = new TMDBService();
