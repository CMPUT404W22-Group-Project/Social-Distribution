import { Router } from 'express';
import * as postController from '../controllers/posts.controller.js';

const router = Router();

router.get('/posts', postController.getAllPublicPosts);
router.get('/authors/:authorId/posts/', postController.getAllPosts);
router.get('/authors/:authorId/posts/:id', postController.getOnePost);

router.put('/authors/:authorId/posts/:id', postController.putPost);
router.delete('/authors/:authorId/posts/:id', postController.deletePost);
router.post('/authors/:authorId/posts/:id', postController.updatePost);
router.post('/authors/:authorId/posts/', postController.newPost);
export { router };
