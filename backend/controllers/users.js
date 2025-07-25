import ErrorResponse from '../utils/errorResponse.js';
import User from '../models/User.js';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

// Get directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private/Admin
export const getUsers = async (req, res, next) => {
  try {
    res.status(200).json(res.advancedResults);
  } catch (err) {
    next(err);
  }
};

// @desc    Get single user
// @route   GET /api/v1/users/:id
// @access  Private
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(
        new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Follow a user
// @route   PUT /api/v1/users/follow/:id
// @access  Private
export const followUser = async (req, res, next) => {
  try {
    if (req.user.id === req.params.id) {
      return next(new ErrorResponse('You cannot follow yourself', 400));
    }

    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow) {
      return next(new ErrorResponse('User not found', 404));
    }

    // Check if already following
    if (userToFollow.followers.includes(req.user.id)) {
      return next(new ErrorResponse('Already following this user', 400));
    }

    // Add to following list
    currentUser.following.push(userToFollow._id);
    await currentUser.save();

    // Add to followers list
    userToFollow.followers.push(req.user.id);
    await userToFollow.save();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Unfollow a user
// @route   PUT /api/v1/users/unfollow/:id
// @access  Private
export const unfollowUser = async (req, res, next) => {
  try {
    if (req.user.id === req.params.id) {
      return next(new ErrorResponse('You cannot unfollow yourself', 400));
    }

    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToUnfollow) {
      return next(new ErrorResponse('User not found', 404));
    }

    // Check if already not following
    if (!userToUnfollow.followers.includes(req.user.id)) {
      return next(new ErrorResponse('You are not following this user', 400));
    }

    // Remove from following list
    currentUser.following = currentUser.following.filter(
      id => id.toString() !== req.params.id
    );
    await currentUser.save();

    // Remove from followers list
    userToUnfollow.followers = userToUnfollow.followers.filter(
      id => id.toString() !== req.user.id
    );
    await userToUnfollow.save();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's followers
// @route   GET /api/v1/users/followers/:id
// @access  Private
export const getFollowers = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate({
      path: 'followers',
      select: 'name username profilePhoto'
    });

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    res.status(200).json({
      success: true,
      count: user.followers.length,
      data: user.followers
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get users that the user is following
// @route   GET /api/v1/users/following/:id
// @access  Private
export const getFollowing = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate({
      path: 'following',
      select: 'name username profilePhoto'
    });

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    res.status(200).json({
      success: true,
      count: user.following.length,
      data: user.following
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Upload photo for user
// @route   PUT /api/v1/users/updatephoto
// @access  Private
// @desc    Upload photo for user
// @route   PUT /api/v1/users/updatephoto
// @access  Private
export const uploadUserPhoto = async (req, res, next) => {
  if (!req.files) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse('Please upload an image file', 400));
  }

  // Check filesize (max 5MB)
  const maxSize = process.env.MAX_FILE_UPLOAD || 5 * 1024 * 1024; // Default 5MB
  if (file.size > maxSize) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${maxSize / (1024 * 1024)}MB`,
        400
      )
    );
  }

  // Store file data in req.file for the next middleware
  req.file = {
    buffer: file.data,
    originalname: file.name,
    mimetype: file.mimetype,
    size: file.size
  };

  next();

};

// @desc    Update user photo
// @route   PUT /api/v1/users/updatephoto
// @access  Private
// @desc    Resize user photo
// @route   - (middleware)
// @access  Private
export const resizeUserPhoto = async (req, res, next) => {
  try {
    if (!req.file) return next();

    // Create directory if it doesn't exist
    const uploadPath = path.join(__dirname, '../public/uploads/users');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    // Create filename
    const filename = `user-${req.user.id}-${Date.now()}.jpeg`;
    const filepath = path.join(uploadPath, filename);

    // Resize and save the image
    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(filepath);

    // Update the filename in the request for the next middleware
    req.file.filename = `uploads/users/${filename}`;
    next();
  } catch (err) {
    console.error('Error resizing user photo:', err);
    return next(new ErrorResponse('Error processing image', 500));
  }
};

// @desc    Update user photo
// @route   PUT /api/v1/users/updatephoto
// @access  Private
export const updatePhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ErrorResponse('Please upload a file', 400));
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    // Delete old photo if exists and it's not the default one
    if (user.profilePhoto && user.profilePhoto !== 'default.jpg') {
      const oldPhotoPath = path.join(__dirname, '../public', user.profilePhoto);
      if (fs.existsSync(oldPhotoPath)) {
        try {
          fs.unlinkSync(oldPhotoPath);
        } catch (err) {
          console.error('Error deleting old photo:', err);
          // Continue even if deletion fails
        }
      }
    }

    // Update user with new photo path (stored in req.file.filename by resizeUserPhoto)
    user.profilePhoto = req.file.filename;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      data: user.profilePhoto
    });
  } catch (err) {
    console.error('Error updating user photo:', err);
    next(new ErrorResponse('Error updating profile photo', 500));
  }
};

// @desc    Deactivate user account
// @route   DELETE /api/v1/users/deactivate
// @access  Private
export const deactivateAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    // In a real app, you might want to anonymize the data instead of deleting
    // or move to a separate collection
    await user.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete user (admin only)
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(
        new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
      );
    }

    // Delete user's photo if exists
    if (user.profilePhoto !== 'default.jpg') {
      const photoPath = `${__dirname}/../public/uploads/${user.profilePhoto}`;
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }

    await user.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};
