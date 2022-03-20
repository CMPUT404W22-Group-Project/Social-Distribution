import { Router } from 'express';
import * as postController from '../controllers/posts.controller.js';
import { authenticateToken } from '../auth/index.js';

const router = Router();

router.get('/posts', postController.getAllPublicPosts);
router.get('/authors/:authorId/posts/', postController.getAllPosts);
router.get('/authors/:authorId/posts/:id', postController.getOnePost);
router.get('/authors/:authorId/posts/:id/image', postController.getImage);

router.put(
	'/authors/:authorId/posts/:id',
	authenticateToken,
	postController.putPost
);
router.delete(
	'/authors/:authorId/posts/:id',
	authenticateToken,
	postController.deletePost
);
router.post(
	'/authors/:authorId/posts/:id',
	authenticateToken,
	postController.updatePost
);
router.post(
	'/authors/:authorId/posts/',
	authenticateToken,
	postController.newPost
);
router.post(
	'/authors/:authorId/posts/:id/image',
	authenticateToken,
	postController.addPostImage
);
export { router };
