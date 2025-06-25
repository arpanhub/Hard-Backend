const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// Public
router.get('/', postController.getPosts);
router.get('/:slug', postController.getPostBySlug);
router.get('/user/:userId', postController.getPostsByUser);

// Authenticated
router.put('/:id/like', auth, postController.likePost);

// Admin only
router.post('/', auth, authorize('admin'), postController.createPost);
router.put('/:id', auth, authorize('admin'), postController.updatePost);
router.delete('/:id', auth, authorize('admin'), postController.deletePost);
router.put('/:id/publish', auth, authorize('admin'), postController.publishPost);

module.exports = router;
