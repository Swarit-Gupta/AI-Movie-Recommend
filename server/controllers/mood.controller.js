const recommendationService = require('../services/recommendation.service');
const moodService = require('../services/mood.service');

// @desc    Get movie recommendations based on detected mood
// @route   POST /api/mood/recommendations
// @access  Private
exports.getMoodRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const { mood, emotions } = req.body;
    const limit = parseInt(req.query.limit) || 20;

    // Validate mood input
    if (!mood) {
      return res.status(400).json({ message: 'Mood is required' });
    }

    console.log(`Getting recommendations for mood: ${mood}`, emotions);

    // Get mood-based recommendations
    const recommendations = await moodService.getMoodBasedRecommendations(
      userId,
      mood,
      emotions,
      limit
    );

    console.log(`Found ${recommendations.length} recommendations for mood: ${mood}`);

    if (recommendations.length === 0) {
      console.warn('No recommendations found! Check TMDB API key and connectivity');
    }

    res.json({
      mood,
      emotions,
      recommendations,
      total: recommendations.length
    });
  } catch (error) {
    console.error('Mood recommendation error:', error);
    res.status(500).json({ message: 'Error fetching mood-based recommendations' });
  }
};

// @desc    Get genre mapping for a specific mood
// @route   GET /api/mood/genres/:mood
// @access  Public
exports.getMoodGenres = async (req, res) => {
  try {
    const { mood } = req.params;
    const genres = moodService.getMoodGenres(mood);

    res.json({
      mood,
      genres,
      description: moodService.getMoodDescription(mood)
    });
  } catch (error) {
    console.error('Get mood genres error:', error);
    res.status(500).json({ message: 'Error fetching mood genres' });
  }
};

// @desc    Get all supported moods
// @route   GET /api/mood/list
// @access  Public
exports.getSupportedMoods = async (req, res) => {
  try {
    const moods = moodService.getSupportedMoods();
    res.json({ moods });
  } catch (error) {
    console.error('Get supported moods error:', error);
    res.status(500).json({ message: 'Error fetching supported moods' });
  }
};
