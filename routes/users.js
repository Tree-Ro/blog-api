import express from 'express';
const router = express.Router();

import usersController from '../controllers/usersController.js';

router.get('/', usersController.users_GET);
router.get('/:userId', usersController.user_GET);
export default router;
