const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');
const { authLimiter, userActionLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/profile', userActionLimiter, protect, getProfile);

module.exports = router;
