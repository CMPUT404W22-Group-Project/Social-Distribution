import { Router } from 'express';
import * as postController from '../controllers/posts.controller.js';

const router = Router();

router.get('/service/authors/:authorId/posts', postController.httpGetAllPost);

export { router };