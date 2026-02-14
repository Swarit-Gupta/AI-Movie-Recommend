const recommendationService = require('../services/recommendation.service');

// @desc    Get personalized recommendations for user
// @route   GET /api/recommendations
// @access  Private
exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;
    const limit = parseInt(req.query.limit) || 20;

    const recommendations = await recommendationService.getRecommendations(userId, limit);

    res.json({
      recommendations,
      total: recommendations.length
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ message: 'Error fetching recommendations' });
  }
};
