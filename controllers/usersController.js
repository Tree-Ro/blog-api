import { body, param, validationResult } from 'express-validator';
import createError from 'http-errors';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';

const usersController = {};

const validateCreateUser = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 20 })
    .withMessage('Name must be less than 20 characters'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isLength({ min: 5 })
    .withMessage('Email must be at least 5 characters')
    .isLength({ max: 75 })
    .withMessage('Email must be less than 75 characters')
    .isEmail()
    .withMessage('Email is not valid'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .isLength({ max: 30 })
    .withMessage('Password must not be longer than 30 characthers')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain at least one special character'),

  body('role')
    .optional()
    .isIn(['visitor', 'editor', 'admin'])
    .withMessage('Role is not valid'),
];

const validateUpdateUser = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 20 })
    .withMessage('Name must be less than 20 characters'),

  body('email')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isLength({ min: 5 })
    .withMessage('Email must be at least 5 characters')
    .isLength({ max: 75 })
    .withMessage('Email must be less than 75 characters')
    .isEmail()
    .withMessage('Email is not valid'),

  body('password')
    .optional()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .isLength({ max: 30 })
    .withMessage('Password must not be longer than 30 characthers')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain at least one special character'),

  body('role')
    .optional()
    .isIn(['visitor', 'editor', 'admin'])
    .withMessage('Role is not valid'),
];

const validateuserIdParam = [
  param('userId')
    .exists()
    .withMessage('User ID is required')
    .isMongoId()
    .withMessage('User ID must be a valid Mongo ID'),
];

usersController.users_GET = [
  async (req, res, next) => {
    try {
      const users = await User.find({}).sort({ createdAt: -1 }).exec();

      res.json(users);
    } catch (err) {
      next(err);
    }
  },
];

usersController.user_GET = [
  validateuserIdParam,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw createError(400, { errors: errors.array() });
      }

      const { userId } = req.params;

      const user = await User.findById(userId).exec();

      if (!user) {
        throw createError(404, 'User not found');
      }

      res.json(user);
    } catch (err) {
      next(err);
    }
  },
];

usersController.user_POST = [
  validateCreateUser,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw createError(400, { errors: errors.array() });
      }

      const { name, email, password } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        name,
        email,
        password: hashedPassword,
      });
      await user.save();

      res.json(user);
    } catch (err) {
      next(err);
    }
  },
];

usersController.user_PUT = [
  validateUpdateUser,
  validateuserIdParam,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw createError(400, { errors: errors.array() });
      }

      const { name, email, password, role } = req.body;
      const { userId } = req.params;

      const update = {};
      if (name) update.name = name;
      if (email) update.email = email;
      if (password) update.password = await bcrypt.hash(password, 10);
      if (role) update.role = role;

      const updatedUser = await User.findByIdAndUpdate(userId, update, {
        new: true,
      });

      if (!updatedUser) {
        throw createError(404, 'User not found');
      }

      res.json(updatedUser);
    } catch (err) {
      next(err);
    }
  },
];

usersController.user_DELETE = [
  validateuserIdParam,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw createError(400, { errors: errors.array() });
      }

      const { userId } = req.params;

      const deletedUser = await User.findByIdAndDelete(userId);

      res.json(deletedUser);
    } catch (err) {
      next(err);
    }
  },
];

export default usersController;
