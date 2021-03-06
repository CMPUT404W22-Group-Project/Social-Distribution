import { Router } from 'express';
import * as authorController from '../controllers/authors.controller.js';
import { authenticateToken, isAdmin } from '../auth/index.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Author:
 *       type: object
 *       required:
 *         - id
 *         - email
 *         - password
 *         - displayName
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the author
 *         email:
 *           type: string
 *           description: The user's email
 *         password:
 *           type: string
 *           description: The author's password
 *         displayName:
 *           type: string
 *           description: The author's user name
 *         github:
 *           type: string
 *           description: The author's github adress
 *         profileImage:
 *           type: string
 *           description: The author's profile image
 *         host:
 *           type: string
 *           description: The author's host adress
 *         url:
 *           type: string
 *           description: url to the author
 *       example:
 *         type: author
 *         host: http://127.0.0.1:5454/
 *         id: d5fE_asz
 *         displauName: Jack
 *         github: http://github.com/laracroft
 *         url: http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e
 *         profileImage: https://i.imgur.com/k7XVwpB.jpeg
 *     AuthorCreate:
 *       type: object
 *       required:
 *         - id
 *         - email
 *         - password
 *         - displayName
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the author
 *         email:
 *           type: string
 *           description: The user's email
 *         password:
 *           type: string
 *           description: The author's password
 *         displayName:
 *           type: string
 *           description: The author's user name
 *         github:
 *           type: string
 *           description: The author's github adress
 *         profileImage:
 *           type: string
 *           description: The author's profile image
 *         host:
 *           type: string
 *           description: The author's host adress
 *         url:
 *           type: string
 *           description: url to the author
 *       example:
 *         type: author
 *         host: http://127.0.0.1:5454/
 *         id: d5fE_asz
 *         displauName: Jack
 *         github: http://github.com/laracroft
 *         url: http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e
 *         profileImage: https://i.imgur.com/k7XVwpB.jpeg
 *         email: abc@gmail.com
 *         password: 123456
 *     Authors:
 *       type: object
 *       properties:
 *         items:
 *           type: author
 *           description: The list of authors
 *       example:
 *         type: authors
 *         items:
 *           type: author
 *           host: http://127.0.0.1:5454/
 *           id: d5fE_asz
 *           displauName: Jack
 *           github: http://github.com/laracroft
 *           url: http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e
 *           profileImage: https://i.imgur.com/k7XVwpB.jpeg
 */

/**
 * @swagger
 * tags:
 *   name: Authors
 *   description: The author managing API
 */

/**
 * @swagger
 * /authors:
 *   get:
 *     summary: Returns the list of all the authors
 *     tags: [Authors]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: int
 *         required: true
 *         description: The number of pages
 *       - in: query
 *         name: size
 *         schema:
 *           type: int
 *         required: true
 *         description: The size of a page
 *     responses:
 *       200:
 *         description: The list of the authors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Authors'
 */
router.get('/authors/', authorController.getAllAuthors);

/**
 * @swagger
 * /authors/{id}:
 *   get:
 *     summary: Returns a specific user by id
 *     tags: [Authors]
 *     responses:
 *       200:
 *         description: a specific user
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/Author'
 *       404:
 *         description: The user is not found
 */
router.get('/authors/:id', authorController.getOneAuthor);

/**
 * @swagger
 * /authors/{id}:
 *   post:
 *     summary: update a existing user
 *     tags: [Authors]
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           $ref: '#/components/schemas/Author'
 *         required: true
 *         description: The body of the request
 *     responses:
 *       200:
 *         description: The list of the authors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Author'
 *       401:
 *         description: Can't modify others' email
 *       409:
 *         description: The email is already in use
 */
router.post('/authors/:id', authenticateToken, authorController.updateAuthor);

/**
 * @swagger
 * /register:
 *   post:
 *     summary: resister a new user
 *     tags: [Authors]
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           $ref: '#/components/schemas/AuthorCreate'
 *         required: true
 *         description: The body of the request
 *     responses:
 *       201:
 *         description: The list of the authors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AuthorCreate'
 *       400:
 *         description: missing required properties
 */
router.post('/register', authorController.newAuthor);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: user login in
 *     tags: [Authors]
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           $ref: '#/components/schemas/Author'
 *         required: true
 *         description: The body of the request
 *     responses:
 *       200:
 *         description: The list of the authors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Author'
 *       401:
 *         description: Mismatch the password
 *       409:
 *         description: User does not exist
 */
router.post('/login', authorController.login);

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: user log out
 *     tags: [Authors]
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           $ref: '#/components/schemas/Author'
 *         required: true
 *         description: The body of the request
 *     responses:
 *       401:
 *         description: Usr log out
 */
router.get('/logout', authorController.logout);


router.put(
	'/authors/:id',
	authenticateToken,
	isAdmin,
	authorController.adminUpdateAuthor
);
router.delete('/authors/:id', isAdmin, authorController.adminDeleteAuthor);

router.get('/remote/authors', authorController.getRemoteAuthors);
router.get('/remote/authors/:id', authorController.getRemoteAuthorById);

export { router };
