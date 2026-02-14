const tmdbService = require('../services/tmdb.service');

// @desc    Get popular movies
// @route   GET /api/movies/popular
// @access  Public
exports.getPopularMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const movies = await tmdbService.getPopularMovies(page);
    res.json(movies);
  } catch (error) {
    console.error('Get popular movies error:', error);
    res.status(500).json({ message: 'Error fetching popular movies' });
  }
};

// @desc    Get top rated movies
// @route   GET /api/movies/top-rated
// @access  Public
exports.getTopRatedMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const movies = await tmdbService.getTopRatedMovies(page);
    res.json(movies);
  } catch (error) {
    console.error('Get top rated movies error:', error);
    res.status(500).json({ message: 'Error fetching top rated movies' });
  }
};

// @desc    Get now playing movies
// @route   GET /api/movies/now-playing
// @access  Public
exports.getNowPlayingMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const movies = await tmdbService.getNowPlayingMovies(page);
    res.json(movies);
  } catch (error) {
    console.error('Get now playing movies error:', error);
    res.status(500).json({ message: 'Error fetching now playing movies' });
  }
};

// @desc    Get upcoming movies
// @route   GET /api/movies/upcoming
// @access  Public
exports.getUpcomingMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const movies = await tmdbService.getUpcomingMovies(page);
    res.json(movies);
  } catch (error) {
    console.error('Get upcoming movies error:', error);
    res.status(500).json({ message: 'Error fetching upcoming movies' });
  }
};

// @desc    Search movies
// @route   GET /api/movies/search
// @access  Public
exports.searchMovies = async (req, res) => {
  try {
    const { query } = req.query;
    const page = parseInt(req.query.page) || 1;

    if (!query) {
      return res.status(400).json({ message: 'Please provide a search query' });
    }

    const movies = await tmdbService.searchMovies(query, page);
    res.json(movies);
  } catch (error) {
    console.error('Search movies error:', error);
    res.status(500).json({ message: 'Error searching movies' });
  }
};

// @desc    Get movie details
// @route   GET /api/movies/:id
// @access  Public
exports.getMovieDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await tmdbService.getMovieDetails(id);
    res.json(movie);
  } catch (error) {
    console.error('Get movie details error:', error);
    res.status(500).json({ message: 'Error fetching movie details' });
  }
};
