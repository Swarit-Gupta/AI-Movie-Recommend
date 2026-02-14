const express = require('express');
const router = express.Router();
const { getRecommendations } = require('../controllers/recommendation.controller');
const { protect } = require('../middleware/auth');
const { userActionLimiter } = require('../middleware/rateLimiter');

router.get('/', protect, userActionLimiter, getRecommendations);

module.exports = router;
