import express from 'express';
const router = express.Router();
import usersController from '../controllers/usersController.js';

import authenticateToken from '../middleware/authenticateToken.js';
import authorizeRoles from '../middleware/authorizeRoles.js';

const authorizeAdmin = authorizeRoles('admin');

router.post('/', usersController.user_POST);

//Protected Route: Admin
router.use(authenticateToken, authorizeAdmin);

router.get('/', usersController.users_GET);
router.get('/:userId', usersController.user_GET);
router.put('/:userId', usersController.user_PUT);

router.delete('/:userId', usersController.user_DELETE);

export default router;
