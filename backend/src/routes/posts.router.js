import { Router } from 'express';
import * as postController from '../controllers/posts.controller';

const postsRouter = Router();

postsRouter.get('/', postController.httpGetAllPost);

export default postsRouter;