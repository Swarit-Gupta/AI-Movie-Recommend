const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  movieId: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  movieTitle: {
    type: String,
    required: true
  },
  moviePoster: {
    type: String
  },
  genres: [{
    type: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create compound index for userId and movieId
ratingSchema.index({ userId: 1, movieId: 1 }, { unique: true });

// Update the updatedAt timestamp before saving
ratingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Rating', ratingSchema);
