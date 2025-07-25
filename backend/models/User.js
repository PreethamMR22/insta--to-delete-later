import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please add a username'],
    unique: true,
    trim: true,
    maxlength: [20, 'Username cannot be more than 20 characters']
  },
  email: {
    type: String,
    trim: true,
    // Sparse index to allow multiple null emails but enforce uniqueness for non-null emails
    index: {
      unique: true,
      sparse: true,
      partialFilterExpression: { email: { $type: 'string' } }
    }
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  name: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters']
  },
  website: {
    type: String,
    trim: true
  },
  profilePhoto: {
    type: String,
    default: 'default.jpg'
  },
  followers: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  // Disable validation to prevent any validation errors
  validateBeforeSave: false
});

// Match user entered password to stored password (plain text)
UserSchema.methods.matchPassword = function(enteredPassword) {
  return this.password === enteredPassword;
};

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

export default mongoose.model('User', UserSchema);