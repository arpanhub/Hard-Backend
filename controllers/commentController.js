const Comment = require('../models/Comment');
const Post = require('../models/Post');

// Get all comments for a specific post (public)
exports.getCommentsByPost = async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'name avatar')
      .sort({ createdAt: 1 });
    res.json({
      success: true,
      data: comments.map(comment => ({
        id: comment._id,
        content: comment.content,
        author: comment.author,
        createdAt: comment.createdAt,
        likes: comment.likes.length,
        // isLiked: to be handled in frontend
      }))
    });
  } catch (err) {
    next(err);
  }
};

// Add comment to a post (authenticated users)
exports.createComment = async (req, res, next) => {
  try {
    const { content, post } = req.body;
    const comment = await Comment.create({
      content,
      post,
      author: req.user._id
    });
    res.status(201).json({ success: true, data: comment });
  } catch (err) {
    next(err);
  }
};

// Update own comment (comment author only)
exports.updateComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    comment.content = req.body.content;
    await comment.save();
    res.json({ success: true, data: comment });
  } catch (err) {
    next(err);
  }
};

// Delete comment (comment author or admin only)
exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }
    if (
      comment.author.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await comment.deleteOne();
    res.json({ success: true, message: 'Comment deleted' });
  } catch (err) {
    next(err);
  }
};

// Like/unlike comment (authenticated users)
exports.likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }
    const userId = req.user._id;
    const liked = comment.likes.includes(userId);
    if (liked) {
      comment.likes.pull(userId);
    } else {
      comment.likes.push(userId);
    }
    await comment.save();
    res.json({ success: true, isLiked: !liked, likesCount: comment.likes.length });
  } catch (err) {
    next(err);
  }
};
