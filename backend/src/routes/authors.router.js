import { Router } from 'express';
import * as authorController from "../controllers/authors.controller.js";

const router = Router();

router.get('/authors/', authorController.getAllAuthors);
router.get('/authors/:id', authorController.getOneAuthor);
router.post('/authors/:id', authorController.postAuthor);

export { router };