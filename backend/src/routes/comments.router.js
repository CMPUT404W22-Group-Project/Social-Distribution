import { Router } from 'express';
import * as commentController from '../controllers/comments.controller.js';

const router = Router();

router.get(
	'/authors/:authorId/posts/:postId/comments/',
	commentController.getAllComments
);
router.post(
	'/authors/:authorId/posts/:postId/comments/',
	commentController.newComment
);

export { router };
