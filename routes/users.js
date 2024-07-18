import express from 'express';
const router = express.Router();

import usersController from '../controllers/usersController.js';

const logger = (req, res, next) => {
  console.log([req.path]);
  next();
};

router.get('/', usersController.users_GET);
router.get('/:userId', usersController.user_GET);

router.post('/', usersController.user_POST);
router.put('/:userId', usersController.user_PUT);

router.delete('/:userId', usersController.user_DELETE);

export default router;
