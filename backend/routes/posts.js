import express from 'express';
import { check } from 'express-validator';
import { 
  getPosts, 
  getFeed, 
  getPost, 
  createPost, 
  deletePost, 
  likePost, 
  unlikePost, 
  addComment, 
  deleteComment, 
  uploadPostPhoto, 
  resizePostPhoto 
} from '../controllers/posts.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Apply protect middleware to all routes below
router.use(protect);

// @route    POST api/v1/posts
// @desc     Create a post
// @access   Private
router.post(
  '/',
  uploadPostPhoto,
  resizePostPhoto,
  [
    check('caption', 'Caption is required').not().isEmpty(),
  ],
  createPost
);

// @route    GET api/v1/posts
// @desc     Get all posts
// @access   Private
router.get('/', getPosts);

// @route    GET api/v1/posts/feed
// @desc     Get posts from followed users
// @access   Private
router.get('/feed', getFeed);

// @route    GET api/v1/posts/:id
// @desc     Get post by ID
// @access   Private
router.get('/:id', getPost);

// @route    PUT api/v1/posts/like/:id
// @desc     Like a post
// @access   Private
router.put('/like/:id', likePost);

// @route    PUT api/v1/posts/unlike/:id
// @desc     Unlike a post
// @access   Private
router.put('/unlike/:id', unlikePost);

// @route    POST api/v1/posts/comment/:id
// @desc     Comment on a post
// @access   Private
router.post(
  '/comment/:id',
  [
    check('text', 'Text is required').not().isEmpty()
  ],
  addComment
);

// @route    DELETE api/v1/posts/comment/:id/:comment_id
// @desc     Delete comment
// @access   Private
router.delete('/comment/:id/:comment_id', deleteComment);

// @route    DELETE api/v1/posts/:id
// @desc     Delete a post
// @access   Private
router.delete('/:id', deletePost);

export default router;
