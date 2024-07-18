import express from 'express';
import createError from 'http-errors';
import dbSetup from './config/mongodb-setup.js';
import mongoose from 'mongoose';
import logger from 'morgan';
import cookieParser from 'cookie-parser';

//Routes
import {
  commentsRouter,
  postsRouter,
  usersRouter,
  authRouter,
} from './routes/barrel.js';

//Setup
const app = express();
dbSetup();

//Logging & Parsing
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Routes
app.use('/auth', authRouter);
app.use('/posts', postsRouter);
app.use('/users', usersRouter);

// Resource not found
app.use(function (req, res, next) {
  next(createError(404));
});
app.use(function (err, req, res, next) {
  if (err instanceof mongoose.Error.ValidationError) {
    const validationError = createError(422, err.message);
    next(validationError);
  }
  // Handle other errors
  next(err);
});
app.use((err, req, res, next) => {
  const DEBUG = process.env.DEBUG;

  let status = err.status || 500;
  let message = err.message || 'Internal Server Error';

  if (DEBUG) {
    console.error(err.stack);
  }

  res.status(status).json({ status, message, errors: err.errors });
});

export default app;
