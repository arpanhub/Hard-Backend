const Post = require('../models/Post');
const User = require('../models/User');


exports.getPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, tag, search } = req.query;
    const query = { status: 'published' };
    if (tag) query.tags = tag;
    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } }
    ];
    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate('author', 'name avatar')
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({
      success: true,
      count: posts.length,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      data: posts.map(post => ({
        id: post._id,
        title: post.title,
        excerpt: post.excerpt,
        slug: post.slug,
        author: post.author,
        featuredImage: post.featuredImage,
        tags: post.tags,
        status: post.status,
        views: post.views,
        likes: post.likes.length,
        readTime: post.readTime,
        publishedAt: post.publishedAt,
      }))
    });
  } catch (err) {
    next(err);
  }
};

// Get single post by slug (public)
exports.getPostBySlug = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug, status: 'published' })
      .populate('author', 'name avatar bio');
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    // Increment views
    post.views += 1;
    await post.save();
    res.json({
      success: true,
      data: {
        id: post._id,
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        slug: post.slug,
        author: post.author,
        featuredImage: post.featuredImage,
        tags: post.tags,
        views: post.views,
        likes: post.likes.length,
        readTime: post.readTime,
        publishedAt: post.publishedAt,
        // comments: to be populated in comment controller
      }
    });
  } catch (err) {
    next(err);
  }
};

// Create new post (admin only)
exports.createPost = async (req, res, next) => {
  try {
    const { title, content, excerpt, featuredImage, tags, status } = req.body;
    const post = await Post.create({
      title,
      content,
      excerpt,
      featuredImage,
      tags,
      status,
      author: req.user._id
    });
    res.status(201).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

// Update post (admin only)
exports.updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    Object.assign(post, req.body);
    await post.save();
    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

// Delete post (admin only)
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    await post.deleteOne();
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
};


exports.publishPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    post.status = post.status === 'published' ? 'draft' : 'published';
    await post.save();
    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};


exports.likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    const userId = req.user._id;
    const liked = post.likes.includes(userId);
    if (liked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }
    await post.save();
    res.json({ success: true, isLiked: !liked, likesCount: post.likes.length });
  } catch (err) {
    next(err);
  }
};


exports.getPostsByUser = async (req, res, next) => {
  try {
    const posts = await Post.find({ author: req.params.userId })
      .sort({ createdAt: -1 });
    res.json({ success: true, data: posts });
  } catch (err) {
    next(err);
  }
};
