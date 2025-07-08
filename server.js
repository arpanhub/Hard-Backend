require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const { validateEnvironmentSecurity } = require('./utils/security');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const adminRoutes = require('./routes/admin');

const app = express();

// Validate environment security before starting server
const envValidation = validateEnvironmentSecurity();
if (!envValidation.isValid) {
  console.error('❌ Environment security validation failed:');
  envValidation.issues.forEach(issue => console.error(`  - ${issue}`));
  process.exit(1);
}

if (envValidation.warnings.length > 0) {
  console.warn('⚠️  Environment security warnings:');
  envValidation.warnings.forEach(warning => console.warn(`  - ${warning}`));
}

console.log('✅ Environment security validation passed');

connectDB();


app.use(cors({
  origin: 'https://hard-blogs.vercel.app',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Enhanced security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Prevent information disclosure
app.disable('x-powered-by');

app.use(morgan('dev'));


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
});
app.use(limiter);


app.get('/', (req, res) => res.send('API is running'));
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin', adminRoutes);



app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
