    const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');

// Register user
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const user = await User.create({
      name,
      email,
      password,
      verificationToken,
    });
    // Send verification email
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    const message = `<p>Hi ${name},</p><p>Please verify your email by clicking <a href="${verifyUrl}">here</a>.</p>`;
    await sendEmail({
      email: user.email,
      subject: 'Verify your email',
      message,
    });
    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email for verification.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Email verification
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
    res.json({ success: true, message: 'Email verified successfully' });
  } catch (err) {
    next(err);
  }
};

// Login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
    if (!user.isVerified) {
      return res.status(401).json({ success: false, message: 'Please verify your email before logging in' });
    }
    const token = generateToken(user);
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        isVerified: user.isVerified,
        joinedDate: user.joinedDate,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Get current user profile
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};
