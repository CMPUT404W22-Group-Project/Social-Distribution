import { Router } from 'express';

const authorRouter = Router();

authorRouter.get('/service/authors');

export default authorRouter;