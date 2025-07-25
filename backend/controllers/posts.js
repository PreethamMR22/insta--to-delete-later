import ErrorResponse from '../utils/errorResponse.js';
import Post from '../models/Post.js';
import User from '../models/User.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Get all posts
// @route   GET /api/v1/posts
// @route   GET /api/v1/users/:userId/posts
// @access  Private
export const getPosts = async (req, res, next) => {
  try {
    if (req.params.userId) {
      const posts = await Post.find({ user: req.params.userId })
        .sort({ createdAt: -1 })
        .populate('user', 'name username profilePhoto');
      
      return res.status(200).json({
        success: true,
        count: posts.length,
        data: posts
      });
    } else {
      res.status(200).json(res.advancedResults);
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Get posts from followed users
// @route   GET /api/v1/posts/feed
// @access  Private
export const getFeed = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    const posts = await Post.find({
      user: { $in: [...user.following, user._id] }
    })
    .sort({ createdAt: -1 })
    .populate('user', 'name username profilePhoto')
    .populate('comments.user', 'name username profilePhoto');

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single post
// @route   GET /api/v1/posts/:id
// @access  Private
export const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'name username profilePhoto')
      .populate('comments.user', 'name username profilePhoto');

    if (!post) {
      return next(
        new ErrorResponse(`Post not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new post
// @route   POST /api/v1/posts
// @access  Private
export const createPost = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    const post = await Post.create(req.body);

    // Populate user data
    await post.populate('user', 'name username profilePhoto');

    res.status(201).json({
      success: true,
      data: post
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete post
// @route   DELETE /api/v1/posts/:id
// @access  Private
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(
        new ErrorResponse(`Post not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is post owner or admin
    if (post.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to delete this post`,
          401
        )
      );
    }

    // Delete post image if exists
    if (post.image) {
      const imagePath = `${__dirname}/../public/uploads/posts/${post.image}`;
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await post.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Like a post
// @route   PUT /api/v1/posts/like/:id
// @access  Private
export const likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if the post has already been liked
    if (
      post.likes.some(like => like.user.toString() === req.user.id)
    ) {
      return next(new ErrorResponse('Post already liked', 400));
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();

    res.status(200).json({
      success: true,
      data: post.likes
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Unlike a post
// @route   PUT /api/v1/posts/unlike/:id
// @access  Private
export const unlikePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if the post has not yet been liked
    if (
      !post.likes.some(like => like.user.toString() === req.user.id)
    ) {
      return next(new ErrorResponse('Post has not yet been liked', 400));
    }

    // Remove the like
    post.likes = post.likes.filter(
      ({ user }) => user.toString() !== req.user.id
    );

    await post.save();

    res.status(200).json({
      success: true,
      data: post.likes
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add comment to a post
// @route   POST /api/v1/posts/comment/:id
// @access  Private
export const addComment = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const post = await Post.findById(req.params.id);

    const newComment = {
      text: req.body.text,
      user: req.user.id
    };

    post.comments.unshift(newComment);

    await post.save();

    // Populate the user data in the comment
    await post.populate('comments.user', 'name username profilePhoto');

    res.status(200).json({
      success: true,
      data: post.comments
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete comment
// @route   DELETE /api/v1/posts/comment/:id/:comment_id
// @access  Private
export const deleteComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    // Pull out comment
    const comment = post.comments.find(
      comment => comment.id === req.params.comment_id
    );

    // Make sure comment exists
    if (!comment) {
      return next(new ErrorResponse('Comment does not exist', 404));
    }

    // Check user is comment owner or post owner or admin
    if (
      comment.user.toString() !== req.user.id &&
      post.user.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return next(
        new ErrorResponse('User not authorized to delete this comment', 401)
      );
    }

    // Get remove index
    const removeIndex = post.comments
      .map(comment => comment.id)
      .indexOf(req.params.comment_id);

    post.comments.splice(removeIndex, 1);

    await post.save();

    res.status(200).json({
      success: true,
      data: post.comments
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Upload photo for post
// @route   PUT /api/v1/posts/photo
// @access  Private
export const uploadPostPhoto = (req, res, next) => {
  if (!req.files) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse('Please upload an image file', 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `post_${Date.now()}${path.parse(file.name).ext}`;

  file.mv(
    `${__dirname}/../public/uploads/posts/${file.name}`,
    async err => {
      if (err) {
        console.error(err);
        return next(new ErrorResponse('Problem with file upload', 500));
      }

      req.body.image = file.name;
      next();
    }
  );
};

// @desc    Resize post photo
// @route   - (middleware)
// @access  Private
export const resizePostPhoto = (req, res, next) => {
  // Skip if no file was uploaded
  if (!req.file) return next();
  
  // In a real app, you would use a library like sharp to resize the image
  // For now, we'll just pass through
  next();
};
