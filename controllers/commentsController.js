import Comment from '../models/comment.js';
import Post from '../models/post.js';
import { body, param, validationResult } from 'express-validator';
import createError from 'http-errors';

const commentsController = {};

const validateComment = [
  body('author')
    .isMongoId()
    .withMessage('User reference must be a valid Mongo ID')
    .notEmpty()
    .withMessage('User reference is required'),

  body('textContent')
    .isString()
    .withMessage('Text content must be a string')
    .trim()
    .notEmpty()
    .withMessage('Text content is required')
    .isLength({ max: 500 })
    .withMessage('Text content must be less than 500 characters')
    .escape(),
];

const validatePostId = [
  param('postId')
    .exists()
    .withMessage('Post ID is required')
    .isMongoId()
    .withMessage('Post ID must be a valid Mongo ID'),
];

const validateCommentId = [
  param('commentId')
    .exists()
    .withMessage('Comment ID is required')
    .isMongoId()
    .withMessage('Comment ID must be a valid Mongo ID'),
];

commentsController.comments_GET = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const query = { _id: postId, status: 'published' };

    const comments = await Post.find(query, 'comments')
      .populate('comments')
      .sort({ createdAt: -1 })
      .exec();

    res.json(comments);
  } catch (err) {
    next(err);
  }
};

commentsController.comments_POST = [
  validateComment,
  validatePostId,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw createError(400, { errors: errors.array() });
      }

      const { author, textContent } = req.body;
      const { postId } = req.params;

      const existingPost = await Post.findById(postId);
      if (!existingPost) {
        throw createError(404, 'Post not found');
      }

      const newComment = new Comment({
        author,
        textContent,
      });
      await newComment.save();

      existingPost.comments.push(newComment.id);
      await existingPost.save();

      res.json(newComment);
    } catch (err) {
      next(err);
    }
  },
];

commentsController.comments_PUT = [
  validateComment,
  validatePostId,
  validateCommentId,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw createError(400, { errors: errors.array() });
      }

      const { author, textContent } = req.body;
      const { commentId, postId } = req.params;

      const [existingPost, updatedComment] = await Promise.all([
        Post.findById(postId),
        Comment.findByIdAndUpdate(
          commentId,
          { author, textContent },
          { new: true }
        ),
      ]);

      if (!existingPost) {
        throw createError(404, 'Post not found');
      }
      if (!updatedComment) {
        throw createError(404, 'Comment not found');
      }

      res.json(updatedComment);
    } catch (err) {
      next(err);
    }
  },
];

commentsController.comments_DELETE = [
  validatePostId,
  validateCommentId,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError(400, { errors: errors.array() });
    }

    const { commentId } = req.params;

    const deletedComment = await Comment.findByIdAndDelete(commentId);

    res.json(deletedComment);
  },
];

export default commentsController;
