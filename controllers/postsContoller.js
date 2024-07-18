import Post from '../models/post.js';
import { body, param, validationResult } from 'express-validator';
import createError from 'http-errors';

const postController = {};

const validatePost = [
  body('title')
    .exists()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be a string')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters')
    .isLength({ max: 50 })
    .withMessage('Title must be less than 50 characters')
    .notEmpty()
    .withMessage('Title cannot be empty')
    .escape(),

  body('author')
    .exists()
    .withMessage('Author is required')
    .isMongoId()
    .withMessage('Author must be a valid Mongo ID')
    .escape(),

  body('textContent')
    .exists()
    .withMessage('Text content is required')
    .isString()
    .withMessage('Text content must be a string')
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Content must be less than 2000 characters')
    .notEmpty()
    .withMessage('Content cannot be empty')
    .escape(),

  body('status')
    .optional()
    .isString()
    .withMessage('Status must be a string')
    .isIn(['draft', 'published', 'removed'])
    .withMessage('Invalid status value')
    .escape(),
];

postController.posts_GET = async (req, res, next) => {
  try {
    const query = { status: 'published' };

    const posts = await Post.find(query).sort({ createdAt: -1 }).exec();
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

postController.post_GET = async (req, res, next) => {
  try {
    const query = { status: 'published' };
    const { postId } = req.params;

    const post = await Post.findById(postId);

    res.json(post);
  } catch (err) {
    next(err);
  }
};

postController.posts_POST = [
  validatePost,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw createError(400, { errors: errors.array() });
      }

      const { title, author, textContent, status } = req.body;
      const post = new Post({
        title,
        author,
        textContent,
        status,
      });

      const savedPost = await post.save();

      return res.status(200).json(savedPost);
    } catch (err) {
      next(err);
    }
  },
];

postController.posts_PUT = [
  validatePost,
  param('postId').exists().withMessage('Missing ID value'),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw createError(400, { errors: errors.array() });
      }

      const { title, author, textContent, status } = req.body;
      const { postId } = req.params;

      const existingPost = await Post.findById(postId);
      if (!existingPost) {
        throw createError(404, 'Post not found');
      }

      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { title, author, textContent, status },
        { new: true }
      );

      res.status(200).json(updatedPost);
    } catch (err) {
      next(err);
    }
  },
];

postController.post_DELETE = [
  param('id').exists().withMessage('Missing ID value'),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw createError(400, { errors: errors.array() });
      }

      const { postId } = req.params;

      const deletedPost = await Post.findByIdAndDelete(postId);

      res.json(deletedPost);
    } catch (err) {
      next(err);
    }
  },
];

export default postController;
