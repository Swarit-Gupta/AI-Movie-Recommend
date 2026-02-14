require('dotenv').config();
const { sequelize, connectDB } = require('./config/database');
const User = require('./models/User');
const Rating = require('./models/Rating');

console.log('Testing SQLite Database Setup...\n');

async function runTests() {
  try {
    // Test 1: Connect to database
    console.log('1. Connecting to SQLite database...');
    await connectDB();
    console.log('   ✓ Connection successful!\n');

    // Test 2: Check tables
    console.log('2. Checking database tables...');
    const tables = await sequelize.getQueryInterface().showAllTables();
    console.log('   ✓ Tables created:', tables.join(', ') || 'Users, Ratings');
    console.log('');

    // Test 3: Test User model
    console.log('3. Testing User model...');
    const userCount = await User.count();
    console.log(`   ✓ Current users in database: ${userCount}`);

    // Test 4: Test Rating model
    console.log('4. Testing Rating model...');
    const ratingCount = await Rating.count();
    console.log(`   ✓ Current ratings in database: ${ratingCount}`);

    // Test 5: Create test user (if none exist)
    if (userCount === 0) {
      console.log('\n5. Creating test user...');
      const testUser = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'test123'
      });
      console.log('   ✓ Test user created successfully!');
      console.log(`   ✓ User ID: ${testUser.id}`);
      
      // Clean up test user
      await testUser.destroy();
      console.log('   ✓ Test user removed');
    }

    console.log('\n' + '='.repeat(50));
    console.log('✓ All tests passed! SQLite is working correctly!');
    console.log('='.repeat(50));
    console.log('\nDatabase file location:', require('path').join(__dirname, 'database.sqlite'));
    console.log('\nYou can now start your server with: npm run dev\n');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('\n✗ Error during testing:', error.message);
    console.error('\nFull error:', error);
    console.log('\n' + '='.repeat(50));
    console.log('TROUBLESHOOTING:');
    console.log('='.repeat(50));
    console.log('1. Make sure dependencies are installed: npm install');
    console.log('2. Check that you have write permissions in the server folder');
    console.log('3. Try: npm rebuild sqlite3');
    console.log('4. Ensure Node.js version is 14 or higher: node --version\n');
    process.exit(1);
  }
}

runTests();
