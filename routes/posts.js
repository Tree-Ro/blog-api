import express from 'express';
const router = express.Router();

import postController from '../controllers/postsContoller.js';

//Generic
router.get('/', postController.posts_GET);

router.post('/', postController.posts_POST);

router.put('/', postController.posts_PUT);

router.delete('/', postController.post_DELETE);

//Specific
router.get('/:id', postController.post_GET);

export default router;
