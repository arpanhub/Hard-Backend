require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('./models/User');

// Generate secure random passwords for seeding
const generateSecurePassword = () => {
  return crypto.randomBytes(16).toString('hex');
};

// Use environment variables for seed passwords or generate secure random ones
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: process.env.SEED_ADMIN_PASSWORD || generateSecurePassword(),
    role: 'admin',
    isVerified: true
  },
  {
    name: 'Demo User 1',
    email: 'demo1@example.com',
    password: process.env.SEED_USER_PASSWORD || generateSecurePassword(),
    role: 'user',
    isVerified: true
  },
  {
    name: 'Demo User 2',
    email: 'demo2@example.com',
    password: process.env.SEED_USER_PASSWORD || generateSecurePassword(),
    role: 'user',
    isVerified: true
  },
  {
    name: 'Demo User 3',
    email: 'demo3@example.com',
    password: process.env.SEED_USER_PASSWORD || generateSecurePassword(),
    role: 'user',
    isVerified: true
  },
  {
    name: 'Demo User 4',
    email: 'demo4@example.com',
    password: process.env.SEED_USER_PASSWORD || generateSecurePassword(),
    role: 'user',
    isVerified: true
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB');
    
    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');
    
    // Create new users with secure passwords
    const createdUsers = [];
    for (const user of users) {
      const createdUser = await User.create({ ...user});
      createdUsers.push({
        email: createdUser.email,
        role: createdUser.role,
        password: user.password // Show generated password for development
      });
    }
    
    console.log('✅ Seeded users successfully!');
    
    // Only show generated passwords in development
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔑 Generated passwords for development:');
      createdUsers.forEach(user => {
        console.log(`   ${user.email} (${user.role}): ${user.password}`);
      });
    } else {
      console.log('🔑 Secure passwords generated for production users');
    }
    
    mongoose.disconnect();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
