const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authControllerExtra = require('../controllers/authController.extra');
const auth = require('../middleware/auth');

// @route   POST /api/auth/register
router.post('/register', authController.register);

// @route   POST /api/auth/login
router.post('/login', authController.login);

// @route   GET /api/auth/verify-email/:token
router.get('/verify-email/:token', authController.verifyEmail);

// @route   GET /api/auth/me
router.get('/me', auth, authController.getMe);

// Forgot password
router.post('/forgot-password', authControllerExtra.forgotPassword);
// Reset password
router.post('/reset-password/:token', authControllerExtra.resetPassword);
// Update profile
router.put('/profile', auth, authControllerExtra.updateProfile);

module.exports = router;
