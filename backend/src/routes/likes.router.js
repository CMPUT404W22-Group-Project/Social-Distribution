import { Router } from 'express';
import * as likeController from '../controllers/likes.controller.js';

const router = Router();

// FIXME: Post route should be inbox, not like
router.post('/authors/:authorId/posts/:postId/likes', likeController.httpPostNewLikeToPost);
router.get(
	'/authors/:authorId/posts/:postId/likes/',
	likeController.httpGetAllLikesOfPost
);
router.get(
	'/authors/:authorId/posts/:postId/comments/:commentId/likes',
	likeController.httpGetAllLikesOfComment
);
router.get('/authors/:authorId/liked', likeController.httpGetLiked);

export { router };
