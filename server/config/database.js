const { Sequelize } = require('sequelize');
const path = require('path');

// Initialize SQLite database
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'database.sqlite'),
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: false,
  },
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('SQLite Database Connected Successfully');
    console.log(`Database Location: ${path.join(__dirname, '..', 'database.sqlite')}`);
    
    // Sync all models with database (use force:false to prevent data loss)
    // Only creates tables if they don't exist
    await sequelize.sync({ force: false });
    console.log('Database synchronized');
    
  } catch (error) {
    console.error('SQLite Connection Error:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
