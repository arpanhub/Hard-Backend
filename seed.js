require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    isVerified: true
  },
  {
    name: 'Demo User 1',
    email: 'demo1@example.com',
    password: 'password123',
    role: 'user',
    isVerified: true
  },
  {
    name: 'Demo User 2',
    email: 'demo2@example.com',
    password: 'password123',
    role: 'user',
    isVerified: true
  },
  {
    name: 'Demo User 3',
    email: 'demo3@example.com',
    password: 'password123',
    role: 'user',
    isVerified: true
  },
  {
    name: 'Demo User 4',
    email: 'demo4@example.com',
    password: 'password123',
    role: 'user',
    isVerified: true
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  await User.deleteMany({});
  for (const user of users) {
    await User.create({ ...user});
  }
  console.log('Seeded users!');
  mongoose.disconnect();
}

seed();
