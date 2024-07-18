import express from 'express';
const router = express.Router();

import commentsController from '../controllers/commentsController.js';

//Specific
router.get('/', commentsController.comments_GET);

router.post('/');

//Generic
router.put('/:commentId');

router.delete('/:commentId');

export default router;
