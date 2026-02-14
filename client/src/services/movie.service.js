import api from './api';

const movieService = {
  // Get popular movies
  getPopularMovies: async (page = 1) => {
    const response = await api.get(`/movies/popular?page=${page}`);
    return response.data;
  },

  // Get top rated movies
  getTopRatedMovies: async (page = 1) => {
    const response = await api.get(`/movies/top-rated?page=${page}`);
    return response.data;
  },

  // Get now playing movies
  getNowPlayingMovies: async (page = 1) => {
    const response = await api.get(`/movies/now-playing?page=${page}`);
    return response.data;
  },

  // Get upcoming movies
  getUpcomingMovies: async (page = 1) => {
    const response = await api.get(`/movies/upcoming?page=${page}`);
    return response.data;
  },

  // Search movies
  searchMovies: async (query, page = 1) => {
    const response = await api.get(`/movies/search?query=${encodeURIComponent(query)}&page=${page}`);
    return response.data;
  },

  // Get movie details
  getMovieDetails: async (movieId) => {
    const response = await api.get(`/movies/${movieId}`);
    return response.data;
  }
};

export default movieService;
