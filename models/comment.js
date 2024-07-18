import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    textContent: {
      type: String,
      required: [true, 'Text content is required'],
      trim: true,
      maxLength: [500, 'Text content must be less than 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
