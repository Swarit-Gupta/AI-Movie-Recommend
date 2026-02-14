const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Rating = sequelize.define('Rating', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  movieId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Movie ID is required'
      }
    }
  },
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    allowNull: false,
    validate: {
      min: {
        args: [1],
        msg: 'Rating must be at least 1'
      },
      max: {
        args: [5],
        msg: 'Rating must be at most 5'
      },
      notNull: {
        msg: 'Rating is required'
      }
    }
  },
  movieTitle: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Movie title is required'
      }
    }
  },
  moviePoster: {
    type: DataTypes.STRING,
    allowNull: true
  },
  genres: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('genres');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('genres', JSON.stringify(value || []));
    }
  }
}, {
  tableName: 'ratings',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'movieId']
    },
    {
      fields: ['userId']
    },
    {
      fields: ['movieId']
    }
  ]
});

// Define association
Rating.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Rating, { foreignKey: 'userId', as: 'ratings' });

module.exports = Rating;
