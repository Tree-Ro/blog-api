import express from 'express';
const router = express.Router();
import authController from '../controllers/authController.js';

router.post('/login', authController.log_in_POST);

router.post('/logout', authController.log_out_POST);

export default router;
