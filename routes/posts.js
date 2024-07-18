import express from 'express';
const router = express.Router();

import postController from '../controllers/postsContoller.js';
import commentsController from '../controllers/commentsController.js';

//Generic
router.get('/', postController.posts_GET);

router.post('/', postController.posts_POST);

//Specific
router.get('/:postId', postController.post_GET);

router.put('/:postId', postController.posts_PUT);

router.delete('/:postId', postController.post_DELETE);

//Comments Generic
router.get('/:postId/comments', commentsController.comments_GET);

router.post('/:postId/comments', commentsController.comments_POST);

//Comments Specific
router.put('/:postId/comments/:commentId', commentsController.comments_PUT);

router.delete(
  '/:postId/comments/:commentId',
  commentsController.comments_DELETE
);

export default router;
