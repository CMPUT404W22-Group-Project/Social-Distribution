import { Router } from 'express';
import * as postController from "../controllers/posts.controller.js";

const router = Router();

router.get('/service/authors/:authorid/posts/', postController.httpGetAllPosts);
router.get('/service/authors/:authorid/posts/:id', postController.httpGetOnePost);

router.put('/service/authors/:authorid/posts/:id', postController.httpPutPost);
router.delete('/service/authors/:authorid/posts/:id', postController.httpDeletePost);
router.post('/service/authors/:authorid/posts/:id', postController.httpUpdatePost);
router.post('/service/authors/:authorid/posts/', postController.httpUpdatePost);
export { router };