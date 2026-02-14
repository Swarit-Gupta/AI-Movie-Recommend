const express = require('express');
const router = express.Router();
const {
  addRating,
  getUserRatings,
  getMovieRatings,
  getUserMovieRating,
  deleteRating
} = require('../controllers/rating.controller');
const { protect } = require('../middleware/auth');
const { userActionLimiter, apiLimiter } = require('../middleware/rateLimiter');

router.post('/', userActionLimiter, protect, addRating);
router.get('/user', userActionLimiter, protect, getUserRatings);
router.get('/movie/:movieId', apiLimiter, getMovieRatings);
router.get('/user/:movieId', userActionLimiter, protect, getUserMovieRating);
router.delete('/:movieId', userActionLimiter, protect, deleteRating);

module.exports = router;
