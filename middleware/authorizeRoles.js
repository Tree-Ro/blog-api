import createError from 'http-errors';

const authorizeRoles =
  (...allowedRoles) =>
  (req, res, next) => {
    const role = req.user?.role;
    console.log(role);

    if (!allowedRoles.includes(role))
      return next(createError(403, 'Invalid permissions'));

    next();
  };

export default authorizeRoles;
