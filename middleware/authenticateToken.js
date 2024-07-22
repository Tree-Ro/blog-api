import jwt from 'jsonwebtoken';
import createError from 'http-errors';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) return next(createError(401, 'No credentials provided'));

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return next(createError(403, 'Invalid credentials'));

    req.user = user;
    next();
  });
}

export default authenticateToken;
