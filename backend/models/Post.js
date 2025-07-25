import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  caption: {
    type: String,
    maxlength: [2200, 'Caption cannot be more than 2200 characters'],
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Please add an image']
  },
  likes: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    }
  ],
  comments: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
      },
      text: {
        type: String,
        required: [true, 'Please add some text'],
        maxlength: [1000, 'Comment cannot be more than 1000 characters']
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index for better query performance
PostSchema.index({ user: 1, createdAt: -1 });

// Static method to get avg of course tuitions
PostSchema.statics.getAverageLikes = async function(userId) {
  const obj = await this.aggregate([
    {
      $match: { user: userId }
    },
    {
      $project: {
        likesCount: { $size: '$likes' }
      }
    },
    {
      $group: {
        _id: null,
        averageLikes: { $avg: '$likesCount' }
      }
    }
  ]);

  try {
    await this.model('User').findByIdAndUpdate(userId, {
      averageLikes: Math.ceil(obj[0].averageLikes || 0)
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageLikes after save
PostSchema.post('save', function() {
  this.constructor.getAverageLikes(this.user);
});

// Call getAverageLikes before remove
PostSchema.pre('remove', function() {
  this.constructor.getAverageLikes(this.user);
});

export default mongoose.model('Post', PostSchema);
