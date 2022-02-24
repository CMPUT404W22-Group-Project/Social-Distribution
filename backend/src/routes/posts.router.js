import { Router } from 'express';
import * as postController from "../controllers/posts.controller.js";

const router = Router();

router.get('/service/authors/:authorid/posts/', postController.httpGetAllPosts);
router.get('/service/authors/:authorid/posts/:id', postController.httpGetOnePost);

router.put('/service/authors/:authorid/posts/:id', postController.putPost);
//router.post('/service/posts/:id', postController.getOnePost);
export { router };