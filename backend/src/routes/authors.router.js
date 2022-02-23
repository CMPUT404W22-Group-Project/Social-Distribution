import { Router } from 'express';
import * as authorController from "../controllers/authors.controller.js";

const router = Router();

router.get('/service/authors/', authorController.getAllAuthors);
router.get('/service/authors/:id', authorController.getOneAuthor);

export { router };