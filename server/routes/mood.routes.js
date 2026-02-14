const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getMoodRecommendations,
  getMoodGenres,
  getSupportedMoods
} = require('../controllers/mood.controller');

// Public routes
router.get('/list', getSupportedMoods);
router.get('/genres/:mood', getMoodGenres);

// Protected routes
router.post('/recommendations', protect, getMoodRecommendations);

module.exports = router;
