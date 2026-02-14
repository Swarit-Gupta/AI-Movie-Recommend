import api from './api';

const ratingService = {
  // Add or update rating
  addRating: async (movieId, rating, movieTitle, moviePoster, genres) => {
    const response = await api.post('/ratings', {
      movieId,
      rating,
      movieTitle,
      moviePoster,
      genres
    });
    return response.data;
  },

  // Get user's ratings
  getUserRatings: async (page = 1, limit = 20) => {
    const response = await api.get(`/ratings/user?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get ratings for a specific movie
  getMovieRatings: async (movieId) => {
    const response = await api.get(`/ratings/movie/${movieId}`);
    return response.data;
  },

  // Get user's rating for a specific movie
  getUserMovieRating: async (movieId) => {
    const response = await api.get(`/ratings/user/${movieId}`);
    return response.data;
  },

  // Delete rating
  deleteRating: async (movieId) => {
    const response = await api.delete(`/ratings/${movieId}`);
    return response.data;
  }
};

export default ratingService;
