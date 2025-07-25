import express from 'express';
import { check } from 'express-validator';
import { 
  register, 
  login, 
  getMe, 
  logout, 
  updateDetails, 
  updatePassword, 
  forgotPassword, 
  resetPassword 
} from '../controllers/auth.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route    POST api/v1/auth/register
// @desc     Register user
// @access   Public
router.post(
  '/register',
  [
    check('name', 'Please add name').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('username', 'Please include a username').not().isEmpty(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  register
);

// @route    POST api/v1/auth/login
// @desc     Login user and get token
// @access   Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  login
);

// @route    GET api/v1/auth/me
// @desc     Get current logged in user
// @access   Private
router.get('/me', protect, getMe);

// @route    GET api/v1/auth/logout
// @desc     Log user out / clear cookie
// @access   Private
router.get('/logout', logout);

// @route    PUT api/v1/auth/updatedetails
// @desc     Update user details
// @access   Private
router.put(
  '/updatedetails',
  protect,
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
  ],
  updateDetails
);

// @route    PUT api/v1/auth/updatepassword
// @desc     Update password
// @access   Private
router.put(
  '/updatepassword',
  protect,
  [
    check('currentPassword', 'Please enter current password').exists(),
    check('newPassword', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  updatePassword
);

// @route    POST api/v1/auth/forgotpassword
// @desc     Forgot password
// @access   Public
router.post(
  '/forgotpassword',
  [check('email', 'Please include a valid email').isEmail()],
  forgotPassword
);

// @route    PUT api/v1/auth/resetpassword/:resettoken
// @desc     Reset password
// @access   Public
router.put(
  '/resetpassword/:resettoken',
  [
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  resetPassword
);

export default router;
