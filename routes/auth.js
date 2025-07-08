const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authControllerExtra = require('../controllers/authController.extra');
const auth = require('../middleware/auth');
const { 
  loginLimiter, 
  passwordResetLimiter, 
  emailVerificationLimiter, 
  registrationLimiter,
  authLimiter 
} = require('../middleware/rateLimiter');

// Apply general auth rate limiting to all routes
router.use(authLimiter);

// @route   POST /api/auth/register
router.post('/register', registrationLimiter, authController.register);

// @route   POST /api/auth/login
router.post('/login', loginLimiter, authController.login);

// @route   GET /api/auth/verify-email/:token
router.get('/verify-email/:token', emailVerificationLimiter, authController.verifyEmail);

// @route   GET /api/auth/me
router.get('/me', auth, authController.getMe);

// Forgot password - with specific rate limiting
router.post('/forgot-password', passwordResetLimiter, authControllerExtra.forgotPassword);

// Reset password - with specific rate limiting
router.post('/reset-password/:token', passwordResetLimiter, authControllerExtra.resetPassword);

// Update profile
router.put('/profile', auth, authControllerExtra.updateProfile);

module.exports = router;
