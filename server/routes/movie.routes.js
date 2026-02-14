const express = require('express');
const router = express.Router();
const {
  getPopularMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  searchMovies,
  getMovieDetails
} = require('../controllers/movie.controller');
const { apiLimiter } = require('../middleware/rateLimiter');

router.get('/popular', apiLimiter, getPopularMovies);
router.get('/top-rated', apiLimiter, getTopRatedMovies);
router.get('/now-playing', apiLimiter, getNowPlayingMovies);
router.get('/upcoming', apiLimiter, getUpcomingMovies);
router.get('/search', apiLimiter, searchMovies);
router.get('/:id', apiLimiter, getMovieDetails);

module.exports = router;
