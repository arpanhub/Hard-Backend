const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');

// Public
router.get('/post/:postId', commentController.getCommentsByPost);

// Authenticated
router.post('/', auth, commentController.createComment);
router.put('/:id', auth, commentController.updateComment);
router.delete('/:id', auth, commentController.deleteComment);
router.put('/:id/like', auth, commentController.likeComment);

module.exports = router;
