# RBAC Blog Platform - Backend API

A secure Node.js/Express.js backend API for a Role-Based Access Control blog platform with JWT authentication, email verification, and Google OAuth integration.

## 🚀 Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin/User)
  - Email verification for new users
  - Google OAuth integration
  - Password reset functionality

- **Blog Management**
  - Full CRUD operations for blog posts (Admin only)
  - Rich text content support
  - Image upload and management
  - Post publishing workflow
  - Like/unlike functionality

- **User Management**
  - User registration and profile management
  - Admin user management panel
  - Comment system with moderation

- **Security Features**
  - Password hashing with bcrypt (12 salt rounds)
  - JWT secret validation and strength checking
  - Input validation and sanitization
  - Rate limiting with IP-based tracking
  - CORS protection with strict policies
  - XSS protection with comprehensive security headers
  - Error sanitization to prevent information disclosure
  - Environment variable validation at startup
  - Secure token generation for all auth flows

## 🛠 Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + Passport.js (Google OAuth)
- **Email Service**: Nodemailer
- **File Upload**: Multer + Cloudinary
- **Validation**: express-validator
- **Security**: helmet, cors, express-rate-limit

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js (v18.0.0 or higher)
- MongoDB (v5.0 or higher) or MongoDB Atlas account
- Gmail account for email services
- Google Cloud Console project for OAuth
- Cloudinary account for image storage

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd rbac-blog-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory using the provided example:

```bash
# Copy the example environment file
cp .env.example .env
```

**Important Security Notes:**
- Generate a cryptographically secure JWT secret (at least 32 characters)
- Use strong, unique passwords for production
- Never commit your `.env` file to version control
- The application validates environment variables at startup

**Required Environment Variables:**
```env
# Database
MONGODB_URI=mongodb://localhost:27017/rbac-blog

# JWT Configuration (CRITICAL - Generate secure random secret)
JWT_SECRET=your-super-secure-jwt-secret-key-min-32-characters
JWT_EXPIRE=7d

# Email Configuration (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Server Configuration
PORT=5000
NODE_ENV=development
```

**Optional Environment Variables:**
```env
# Seed Data Passwords (for development only)
SEED_ADMIN_PASSWORD=secure-admin-password
SEED_USER_PASSWORD=secure-user-password

# Google OAuth (if using OAuth)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Cloudinary (if using image upload)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

**Generate a secure JWT secret:**
```bash
# Use Node.js to generate a secure random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Database Setup

#### Local MongoDB:
```bash
# Start MongoDB service
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
# Or run MongoDB in Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### MongoDB Atlas:
1. Create a cluster at [MongoDB Atlas](https://cloud.mongodb.com)
2. Get your connection string
3. Replace the MONGODB_URI in your .env file

### 5. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback` (development)
   - `https://yourdomain.com/api/auth/google/callback` (production)

### 6. Gmail App Password Setup

1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account settings
3. Security → App passwords
4. Generate app password for "Mail"
5. Use this password in EMAIL_PASS environment variable


## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```


## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/          # Route controllers
│   │   ├── authController.js
│   │   ├── postController.js
│   │   ├── userController.js
│   │   ├── adminController.js
│   │   └── commentController.js
│   ├── middleware/           # Custom middleware
│   │   ├── auth.js          # JWT authentication
│   │   ├── authorize.js     # Role-based authorization
│   │   ├── validation.js    # Input validation
│   │   └── upload.js        # File upload handling
│   ├── models/              # Database models
│   │   ├── User.js
│   │   ├── Post.js
│   │   └── Comment.js
│   ├── routes/              # API routes
│   │   ├── auth.js
│   │   ├── posts.js
│   │   ├── users.js
│   │   ├── admin.js
│   │   ├── comments.js
│   │   └── upload.js
│   ├── utils/               # Utility functions
│   │   ├── email.js         # Email sending utilities
│   │   ├── cloudinary.js    # Image upload utilities
│   │   ├── generateToken.js # JWT token generation
│   │   └── seedAdmin.js     # Admin user seeding
│   ├── config/              # Configuration files
│   │   ├── database.js      # MongoDB connection
│   │   ├── passport.js      # Passport strategies
│   │   └── cloudinary.js    # Cloudinary configuration
│   └── app.js              # Express app configuration
├── uploads/                 # Local file uploads (if not using Cloudinary)
├── tests/                   # Test files
├── .env.example            # Environment variables example
├── .gitignore
├── package.json
├── server.js               # Server entry point
└── README.md
```

## 🔗 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/register` | User registration | Public |
| POST | `/verify-email/:token` | Email verification | Public |
| POST | `/login` | User login | Public |
| POST | `/google` | Google OAuth login | Public |
| POST | `/logout` | User logout | Private |
| GET | `/me` | Get current user | Private |
| PUT | `/profile` | Update user profile | Private |
| POST | `/forgot-password` | Password reset request | Public |
| POST | `/reset-password/:token` | Reset password | Public |

### Blog Post Routes (`/api/posts`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get all published posts | Public |
| GET | `/:slug` | Get single post by slug | Public |
| POST | `/` | Create new post | Admin only |
| PUT | `/:id` | Update post | Admin only |
| DELETE | `/:id` | Delete post | Admin only |
| PUT | `/:id/publish` | Publish/unpublish post | Admin only |
| PUT | `/:id/like` | Like/unlike post | Private |

### Comment Routes (`/api/comments`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/post/:postId` | Get comments for post | Public |
| POST | `/` | Add comment | Private |
| PUT | `/:id` | Update own comment | Private |
| DELETE | `/:id` | Delete comment | Private/Admin |

### Admin Routes (`/api/admin`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/users` | Get all users | Admin only |
| PUT | `/users/:id/role` | Change user role | Admin only |
| DELETE | `/users/:id` | Delete user | Admin only |
| GET | `/posts` | Get all posts (including drafts) | Admin only |
| GET | `/stats` | Get platform statistics | Admin only |



## 🔐 Authentication Flow

### Registration Process
1. User submits registration form
2. Server validates input and checks for existing email
3. Password is hashed using bcrypt
4. Verification token is generated
5. User is saved with `isVerified: false`
6. Verification email is sent
7. User clicks email link to verify account

### Login Process
1. User submits login credentials
2. Server validates email and password
3. Checks if user is verified
4. Generates JWT access token
5. Returns user data and token

### Google OAuth Process
1. User clicks "Login with Google"
2. Redirected to Google OAuth consent screen
3. Google returns authorization code
4. Server exchanges code for user information
5. Creates user account or logs in existing user
6. Returns JWT token

## 🛡️ Security Measures

### Password Security
- Passwords hashed with bcrypt (12 salt rounds)
- Minimum password requirements enforced
- Secure password reset with time-limited tokens

### JWT Security
- Secure random secrets (256-bit recommended)
- Short-lived access tokens (7 days)
- HTTP-only cookies for token storage (optional)
- Token blacklisting for logout

### Input Validation
- All inputs validated using express-validator
- SQL injection prevention
- XSS protection with helmet
- CORS configuration

### Rate Limiting
```javascript
// Login rate limiting
const loginLimiter = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many login attempts, please try again later'
}

// General API rate limiting
const apiLimiter = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
}
```

## 📊 Database Schema

### User Model
```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  googleId: String,
  avatar: String,
  bio: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

### Post Model
```javascript
{
  title: { type: String, required: true },
  content: { type: String, required: true },
  excerpt: String,
  slug: { type: String, unique: true },
  author: { type: ObjectId, ref: 'User', required: true },
  featuredImage: String,
  tags: [String],
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  likes: [{ type: ObjectId, ref: 'User' }],
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}

### Development Logging
```bash
# View logs in development
npm run dev
# Logs will show in console with Winston logger
```

### Production Logging
- Use PM2 for process management
- Configure log rotation
- Set up error tracking (Sentry recommended)

## 🚀 Deployment

### Using PM2 (Recommended)
```bash
# Install PM2 globally
npm install -g pm2

# Start application with PM2
pm2 start server.js --name "rbac-blog-api"

# View logs
pm2 logs rbac-blog-api

# Restart application
pm2 restart rbac-blog-api
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Environment-Specific Configurations

#### Production Environment Variables
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/rbac-blog
JWT_SECRET=your-production-jwt-secret
FRONTEND_URL=https://yourdomain.com
# ... other production values
```

## 🔍 Troubleshooting

### Common Issues

**Database Connection Failed**
```bash
# Check MongoDB status
sudo systemctl status mongod
# Or check if MongoDB Atlas IP is whitelisted
```

**Email Not Sending**
```bash
# Verify Gmail app password
# Check if 2FA is enabled
# Ensure correct SMTP settings
```

**Google OAuth Not Working**
```bash
# Verify client ID and secret
# Check authorized redirect URIs
# Ensure Google+ API is enabled
```

**Environment Security Validation Failed**
```bash
# Check that all required environment variables are set
# Ensure JWT_SECRET is at least 32 characters long
# Verify JWT_SECRET is cryptographically secure
# Check that no weak or common secrets are used
```

**Rate Limiting Issues**
```bash
# Check if rate limits are being exceeded
# Review IP-based rate limiting configuration
# Verify rate limiting is properly configured for your use case
```

## 🛡️ Security

This application implements comprehensive security measures to protect against common vulnerabilities:

### Authentication & Authorization
- JWT-based authentication with secure token generation
- Role-based access control (Admin/User)
- Email verification for new user accounts
- Secure password reset functionality

### Secret Management
- JWT secret validation and strength checking at startup
- No hardcoded passwords or secrets in codebase
- Secure random password generation for seed data
- Environment variable validation

### Rate Limiting
- IP-based rate limiting for all authentication endpoints
- Specific limits for login attempts, password resets, and registrations
- Configurable rate limiting thresholds

### Data Protection
- Password hashing with bcrypt (12 salt rounds)
- Input validation and sanitization
- Error message sanitization to prevent information disclosure
- Secure token generation for all authentication flows

### Security Headers
- Comprehensive security headers using Helmet.js
- Content Security Policy (CSP) implementation
- HSTS, XSS protection, and other security headers
- Server fingerprinting prevention

### Additional Security Measures
- CORS configuration with strict origin policies
- Request size limits to prevent DoS attacks
- Comprehensive error handling with security considerations
- Security validation at application startup

**For detailed security information, see [SECURITY.md](SECURITY.md)**

**File Upload Issues**
```bash
# Check Cloudinary credentials
# Verify file size limits
# Check network connectivity
```

## 📝 API Documentation

For detailed API documentation with request/response examples, visit:
- Development: `http://localhost:5000/api-docs`
- Production: `https://yourdomain.com/api-docs`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

