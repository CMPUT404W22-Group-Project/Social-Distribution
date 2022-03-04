import { Router } from 'express';
import * as authorController from '../controllers/authors.controller.js';

const router = Router();

router.post('/authors/:id', authorController.postAuthor);
router.get('/authors/', authorController.getAllAuthors);
router.get('/authors/:id', authorController.getOneAuthor);


export { router };
