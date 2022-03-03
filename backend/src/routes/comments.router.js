import { Router } from 'express';
import * as commentController from "../controllers/comments.controller.js";

const router = Router();

router.get('/service/authors/:authorid/posts/:postid/comments/', commentController.httpGetAllComments);
router.post('/service/authors/:authorid/posts/:postid/comments/', commentController.httpGetAllComments);

export { router };