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

router.get('/popular', getPopularMovies);
router.get('/top-rated', getTopRatedMovies);
router.get('/now-playing', getNowPlayingMovies);
router.get('/upcoming', getUpcomingMovies);
router.get('/search', searchMovies);
router.get('/:id', getMovieDetails);

module.exports = router;
