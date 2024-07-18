import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxLength: [50, 'Title must be less than 50 characters'],
      minLength: [3, 'Title must be at least 3 characters'],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
    textContent: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
      maxLength: [2000, 'Content must be less than 2000 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['draft', 'published', 'removed'],
        message: '{VALUE} is not a valid status',
      },
      default: 'draft',
    },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model('Post', postSchema);
export default Post;
