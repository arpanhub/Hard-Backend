// MongoDB connection setup
const mongoose = require('mongoose');
const { sanitizeError } = require('../utils/security');

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    // Sanitize database connection error to prevent information disclosure
    const sanitizedError = sanitizeError(error);
    console.error('❌ MongoDB connection failed:', sanitizedError.message);
    
    // In development, show more details
    if (process.env.NODE_ENV !== 'production') {
      console.error('Full error details:', error);
    }
    
    process.exit(1);
  }
};

module.exports = dbConnect;
