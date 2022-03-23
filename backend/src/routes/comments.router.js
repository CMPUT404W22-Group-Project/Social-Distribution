import { Router } from 'express';
import * as commentController from '../controllers/comments.controller.js';
import { authenticateToken } from '../auth/index.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - id
 *         - author
 *         - authorId
 *         - post
 *         - postId
 *         - contentType
 *         - comment
 *         - published
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the comment
 *         author:
 *           type: Author
 *           description: The relative author of the comment
 *         authorId:
 *           type: string
 *           description: The author's id of relative author
 *         post:
 *           type: Post
 *           description: The relative post of the comment
 *         postId:
 *           type: string
 *           description: The post's id of relative post
 *         contentType:
 *           type: string
 *           description: the type of content (text/plain, text/markdown, application/base64)
 *         comment:
 *           type: string
 *           description: The content of the comment
 *         published:
 *           type: DateTime
 *           description: the time of this comment published
 *       example:
 *         id: d4fE_asz
 *         Author: {}
 *         authorId: ds4fE_asz
 *         Post: {}
 *         postId: d4fsE_asz
 *         contentType: text
 *         comment: i like it
 *         published: 2022-03-21
 * 
 *     Comments:
 *       type: object
 *       properties:
 *         items:
 *           type: comment
 *           description: The list of comment
 *       example:
 *         type: comments
 *         items: []
 */

 /**
  * @swagger
  * tags:
  *   name: Comments
  *   description: The comment managing API
  */

/**
 * @swagger
 * /authors/{authorId}/posts/{postId}/comments:
 *   get:
 *     summary: Returns all comments by id
 *     tags: [Comments]
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
 *         description: a specific user
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/Comments'
 */
router.get(
	'/authors/:authorId/posts/:postId/comments/',
	commentController.getAllComments
);

/**
 * @swagger
 * /authors/{authorId}/posts/{postId}/comments:
 *   post:
 *     summary: Returns all comments by id
 *     tags: [Comments]
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           $ref: '#/components/schemas/Comment'
 *         required: true
 *         description: The number of pages
 *     responses:
 *       201:
 *         description: a specific user
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Invalid input, missing properties
 */
router.post(
	'/authors/:authorId/posts/:postId/comments/',
	authenticateToken,
	commentController.newComment
);

export { router };
