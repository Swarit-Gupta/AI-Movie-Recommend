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
const { userActionLimiter } = require('../middleware/rateLimiter');

router.post('/', protect, userActionLimiter, addRating);
router.get('/user', protect, userActionLimiter, getUserRatings);
router.get('/movie/:movieId', getMovieRatings);
router.get('/user/:movieId', protect, userActionLimiter, getUserMovieRating);
router.delete('/:movieId', protect, userActionLimiter, deleteRating);

module.exports = router;
