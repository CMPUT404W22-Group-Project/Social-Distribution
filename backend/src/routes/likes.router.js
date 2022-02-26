import { Router } from 'express';
import * as likeController from "../controllers/likes.controller.js";

const router = Router();

router.post('/service/authors/:authorid/inbox/', likeController.httpPostNewLike);
router.get('/service/authors/:authorid/posts/:postid/likes/', likeController.httpGetAllLikesOfPost);
router.get('/service/authors/:authorid/posts/:postid/comments/:commentid/likes', likeController.httpGetAllLikesOfComment);
router.get('/service/authors/:authorid/liked')

export { router };