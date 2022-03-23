import { Router } from 'express';
import * as authorController from '../controllers/authors.controller.js';
import { authenticateToken } from '../auth/index.js';

const router = Router();


/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - author
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         title:
 *           type: string
 *           description: The book title
 *         author:
 *           type: string
 *           description: The book author
 *       example:
 *         id: d5fE_asz
 *         title: The New Turing Omnibus
 *         author: Alexander K. Dewdney
 */

router.get('/authors/', authorController.getAllAuthors);
router.get('/authors/:id', authorController.getOneAuthor);
router.post('/authors/:id', authenticateToken, authorController.updateAuthor);
router.post('/register', authorController.newAuthor);
router.post('/login', authorController.login);
router.get('/logout', authorController.logout);

export { router };
