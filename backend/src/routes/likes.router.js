import { Router } from 'express';
import * as likeController from "../controllers/likes.controller.js";

const router = Router();

router.post('/service/authors/:authorId/inbox/', likeController.httpPostNewLike);
router.get('/service/authors/:authorId/posts/:postId/likes/', likeController.httpGetAllLikesOfPost);
router.get('/service/authors/:authorId/posts/:postId/comments/:commentId/likes', likeController.httpGetAllLikesOfComment);
router.get('/service/authors/:authorId/liked')

export { router };