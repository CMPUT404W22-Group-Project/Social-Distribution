import { Router } from 'express';
import * as authorController from '../controllers/authors.controller.js';
import { authenticateToken } from '../auth/index.js';

const router = Router();

router.get('/authors/', authorController.getAllAuthors);
router.get('/authors/:id', authorController.getOneAuthor);
router.post('/authors/:id', authenticateToken, authorController.updateAuthor);
router.post('/register', authorController.newAuthor);
router.post('/login', authorController.login);
router.get('/logout', authorController.logout);

export { router };
