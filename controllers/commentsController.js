import Comment from '../models/comment.js';
import Post from '../models/post.js';
import { body, validationResult } from 'express-validator';
import createError from 'http-errors';

const commentsController = {};

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

commentsController.comments_POST = async (req, res, next) => {};

commentsController.comments_PUT = async (req, res, next) => {};

commentsController.comments_DELETE = async (req, res, next) => {};

export default commentsController;
