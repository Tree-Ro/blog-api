import { body, param, validationResult } from 'express-validator';
import createError from 'http-errors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const authController = {};

// Handle user Login
authController.log_in_POST = [authenticateUser, signJWT];

// Handle user logout
authController.log_out_POST = (req, res, next) => {
  // No need to handle cookies for logout with bearer tokens
  res.json({ message: 'Logout successful' });
};

// Middleware: Authenticates user credentials
async function authenticateUser(req, res, next) {
  try {
    const { email, password } = req.body;
    const standardError = 'Incorrect email or password';

    const foundUser = await User.findOne({ email });
    if (!foundUser) throw createError(403, standardError);

    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) throw createError(403, standardError);

    req.user = foundUser;
    next();
  } catch (err) {
    next(err);
  }
}

// Middleware: Sign and respond with JWT in response body
function signJWT(req, res, next) {
  const { name, email, role } = req.user;
  const user = { name, email, role };

  try {
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '1h',
    });

    res.json({ message: 'Authentication successful', token: accessToken });
  } catch (err) {
    next(createError(500, 'Could not create token'));
  }
}

export default authController;
