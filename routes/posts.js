import express from 'express';
const router = express.Router();

import postController from '../controllers/postsContoller.js';
import commentsController from '../controllers/commentsController.js';

import authenticateToken from '../middleware/authenticateToken.js';
import authorizeRoles from '../middleware/authorizeRoles.js';

const authorizeAdminOrEditor = authorizeRoles('admin', 'editor');

//Get All Posts
router.get('/', postController.posts_GET);

//Get A Post
router.get('/:postId', postController.post_GET);

//Get all comments
router.get('/:postId/comments', commentsController.comments_GET);

//Get a comment

//Create a comment
router.post('/:postId/comments', commentsController.comments_POST);

//Modify an existing comment
router.put('/:postId/comments/:commentId', commentsController.comments_PUT);

//Delete an existing comment
router.delete(
  '/:postId/comments/:commentId',
  commentsController.comments_DELETE
);

//PROTECTED ROUTE BELOW:

router.use(authenticateToken, authorizeAdminOrEditor);
//Create a Post
router.post('/', postController.posts_POST);

//Modify an existing Post
router.put('/:postId', postController.posts_PUT);

//Delete an existing Post
router.delete('/:postId', postController.post_DELETE);

export default router;
