const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 MongoDB Atlas Setup for Music Collab App\n');

console.log('Please provide your MongoDB Atlas connection details:\n');

rl.question('Enter your MongoDB connection string (from Atlas): ', (mongoUri) => {
  rl.question('Enter a JWT secret (or press Enter for auto-generated): ', (jwtSecret) => {
    
    const finalJwtSecret = jwtSecret || 'music_collab_jwt_secret_' + Math.random().toString(36).substring(2, 15);
    
    const envContent = `PORT=3000
MONGODB_URI=${mongoUri}
JWT_SECRET=${finalJwtSecret}
NODE_ENV=development`;

    try {
      fs.writeFileSync('.env', envContent);
      console.log('\n✅ .env file created successfully!');
      console.log('\nYou can now run:');
      console.log('  npm run seed    # Create test users');
      console.log('  npm run dev     # Start the backend server');
    } catch (error) {
      console.error('\n❌ Error creating .env file:', error.message);
      console.log('\nPlease create a .env file manually with:');
      console.log(envContent);
    }
    
    rl.close();
  });
});
