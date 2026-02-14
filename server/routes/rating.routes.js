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

router.post('/', protect, addRating);
router.get('/user', protect, getUserRatings);
router.get('/movie/:movieId', getMovieRatings);
router.get('/user/:movieId', protect, getUserMovieRating);
router.delete('/:movieId', protect, deleteRating);

module.exports = router;
