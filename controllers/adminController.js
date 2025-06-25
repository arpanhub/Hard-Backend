const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { Stats } = require('fs');

// get post Stats for admin only
exports.getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const publishedPosts = await Post.countDocuments({ status: 'published' });
    const draftPosts = await Post.countDocuments({ status: 'draft' });
    const totalViews = await Post.aggregate([
      { $group: { _id: null, views: { $sum: '$views' } } }
    ]);
    const totalComments = await Comment.countDocuments();
    res.json({
      success: true,
      data: {
        totalUsers,
        totalPosts,
        publishedPosts,
        draftPosts,
        totalViews: totalViews[0] ? totalViews[0].views : 0,
        totalComments
      }
    });
  } catch (err) {
    next(err);
  }
};

// Get all users (admin only)
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').lean();
    const usersWithCounts = await Promise.all(users.map(async user => {
      const postsCount = await Post.countDocuments({ author: user._id });
      const commentsCount = await Comment.countDocuments({ author: user._id });
      return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        joinedDate: user.joinedDate,
        postsCount,
        commentsCount
      };
    }));
    res.json({ success: true, data: usersWithCounts });
  } catch (err) {
    next(err);
  }
};

// Change user role (admin only)
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    await user.deleteOne();
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    next(err);
  }
};

// Get all posts including drafts (admin only)
exports.getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().populate('author', 'name email');
    res.json({ success: true, data: posts });
  } catch (err) {
    next(err);
  }
};
