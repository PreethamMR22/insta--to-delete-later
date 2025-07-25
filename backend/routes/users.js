import express from 'express';
import { check } from 'express-validator';
import { 
  getUsers, 
  getUser, 
  followUser, 
  unfollowUser, 
  getFollowers, 
  getFollowing, 
  uploadUserPhoto, 
  resizeUserPhoto, 
  updatePhoto, 
  deactivateAccount, 
  deleteUser 
} from '../controllers/users.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Apply protect middleware to all routes below
router.use(protect);

// @route    GET api/v1/users
// @desc     Get all users
// @access   Private/Admin
router.get(
  '/',
  authorize('admin'),
  getUsers
);

// @route    GET api/v1/users/:id
// @desc     Get user by ID
// @access   Private
router.get('/:id', getUser);

// @route    PUT api/v1/users/follow/:id
// @desc     Follow a user
// @access   Private
router.put('/follow/:id', followUser);

// @route    PUT api/v1/users/unfollow/:id
// @desc     Unfollow a user
// @access   Private
router.put('/unfollow/:id', unfollowUser);

// @route    GET api/v1/users/followers/:id
// @desc     Get user's followers
// @access   Private
router.get('/followers/:id', getFollowers);

// @route    GET api/v1/users/following/:id
// @desc     Get users that the user is following
// @access   Private
router.get('/following/:id', getFollowing);

// @route    PUT api/v1/users/updatephoto
// @desc     Update user photo
// @access   Private
router.put(
  '/updatephoto',
  uploadUserPhoto,
  resizeUserPhoto,
  updatePhoto
);

// @route    DELETE api/v1/users/deactivate
// @desc     Deactivate user account
// @access   Private
router.delete('/deactivate', deactivateAccount);

// Apply admin middleware to all routes below
router.use(authorize('admin'));

// @route    DELETE api/v1/users/:id
// @desc     Delete user (admin only)
// @access   Private/Admin
router.delete('/:id', deleteUser);

export default router;
