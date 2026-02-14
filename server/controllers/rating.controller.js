const Rating = require('../models/Rating');
const tmdbService = require('../services/tmdb.service');

// @desc    Add or update a movie rating
// @route   POST /api/ratings
// @access  Private
exports.addRating = async (req, res) => {
  try {
    const { movieId, rating, movieTitle, moviePoster, genres } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!movieId || !rating || !movieTitle) {
      return res.status(400).json({ message: 'Please provide movieId, rating, and movieTitle' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if rating already exists
    let existingRating = await Rating.findOne({ userId, movieId });

    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      existingRating.movieTitle = movieTitle;
      existingRating.moviePoster = moviePoster;
      existingRating.genres = genres;
      await existingRating.save();

      res.json({
        message: 'Rating updated successfully',
        rating: existingRating
      });
    } else {
      // Create new rating
      const newRating = await Rating.create({
        userId,
        movieId,
        rating,
        movieTitle,
        moviePoster,
        genres
      });

      res.status(201).json({
        message: 'Rating added successfully',
        rating: newRating
      });
    }
  } catch (error) {
    console.error('Add rating error:', error);
    res.status(500).json({ message: 'Error adding rating' });
  }
};

// @desc    Get user's ratings
// @route   GET /api/ratings/user
// @access  Private
exports.getUserRatings = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const ratings = await Rating.find({ userId })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Rating.countDocuments({ userId });

    res.json({
      ratings,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalRatings: total
    });
  } catch (error) {
    console.error('Get user ratings error:', error);
    res.status(500).json({ message: 'Error fetching user ratings' });
  }
};

// @desc    Get ratings for a specific movie
// @route   GET /api/ratings/movie/:movieId
// @access  Public
exports.getMovieRatings = async (req, res) => {
  try {
    const { movieId } = req.params;

    const ratings = await Rating.find({ movieId }).select('rating createdAt');

    if (ratings.length === 0) {
      return res.json({
        averageRating: 0,
        totalRatings: 0,
        ratings: []
      });
    }

    const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / ratings.length;

    res.json({
      averageRating: averageRating.toFixed(1),
      totalRatings: ratings.length,
      ratings
    });
  } catch (error) {
    console.error('Get movie ratings error:', error);
    res.status(500).json({ message: 'Error fetching movie ratings' });
  }
};

// @desc    Get user's rating for a specific movie
// @route   GET /api/ratings/user/:movieId
// @access  Private
exports.getUserMovieRating = async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user._id;

    const rating = await Rating.findOne({ userId, movieId: parseInt(movieId) });

    if (!rating) {
      return res.json({ rating: null });
    }

    res.json({ rating });
  } catch (error) {
    console.error('Get user movie rating error:', error);
    res.status(500).json({ message: 'Error fetching user movie rating' });
  }
};

// @desc    Delete a rating
// @route   DELETE /api/ratings/:movieId
// @access  Private
exports.deleteRating = async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user._id;

    const rating = await Rating.findOneAndDelete({ userId, movieId: parseInt(movieId) });

    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    res.json({ message: 'Rating deleted successfully' });
  } catch (error) {
    console.error('Delete rating error:', error);
    res.status(500).json({ message: 'Error deleting rating' });
  }
};
