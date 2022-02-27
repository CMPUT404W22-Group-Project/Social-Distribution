import { Router } from 'express';
import * as postController from "../controllers/posts.controller.js";

const router = Router();

router.get('/service/authors/:authorId/posts/', postController.getAllPosts);
router.get('/service/authors/:authorId/posts/:id', postController.getOnePost);

router.put('/service/authors/:authorId/posts/:id', postController.putPost);
router.delete('/service/authors/:authorId/posts/:id', postController.deletePost);
router.post('/service/authors/:authorId/posts/:id', postController.updatePost);
router.post('/service/authors/:authorId/posts/', postController.newPost);
export { router };