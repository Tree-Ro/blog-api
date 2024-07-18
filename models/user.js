import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxLength: [20, 'Name must be less than 20 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    maxLength: [75, 'Email must be less than 75 characters'],
    minLength: [5, 'Email must be at least 5 characters'],
    match: [/\S+@\S+\.\S+/, 'Email is not valid'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  role: {
    type: String,
    enum: {
      values: ['visitor', 'editor', 'admin'],
      message: '{VALUE} is not a valid role',
    },
    default: 'visitor',
  },
});

const User = mongoose.model('User', userSchema);
export default User;
