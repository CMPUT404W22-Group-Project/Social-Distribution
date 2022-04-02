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
 *         - type
 *         - likeCount
 *         - id
 *         - author
 *         - authorId
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
 *         node:
 *           type: string
 *           description: the node relates to remote
 *         type:
 *           type: string
 *           description: type "comment"
 *         likeCount:
 *           type: int
 *           description: the number of likes received
 *       example:
 *         id: http://localhost:8000/authors/cl1g0f07x0000w4u8054w8pnp/posts/cl1g1uj1p00003wu80hsl5d8b/comments/cl1h0ua1p00015su81bja5cum/
 *         authorId: cl1g0f07x0000w4u8054w8pnp
 *         postId: cl1g1uj1p00003wu80hsl5d8b
 *         contentType: text/markdown
 *         comment: SickOldeEnglish
 *         published: 2022-04-01T22:52:46.045Z
 *         node: null
 *         type: comment
 *         likeCount: 0
 *         author: 
 *           admin: null
 *           id: http://localhost:8000/authors/cl1g0f07x0000w4u8054w8pnp/
 *           displayName: Zezhou
 *           github: asdasdasdasd
 *           profileImage: dasdasdasdasd
 *           type: author
 *           url: http://localhost:8000/authors/cl1g0f07x0000w4u8054w8pnp/
 *           host: http://localhost:8000/
 *
 *     Comments:
 *       type: object
 *       properties:
 *         items:
 *           type: comment
 *           description: The list of comment
 *       example:
 *         type: comments
 *         post: http://localhost:8000/authors/cl1g0f07x0000w4u8054w8pnp/posts/cl1g1uj1p00003wu80hsl5d8b/
 *         id: http://localhost:8000/authors/cl1g0f07x0000w4u8054w8pnp/posts/cl1g1uj1p00003wu80hsl5d8b/comments/
 *         comments: 
 *           id: http://localhost:8000/authors/cl1g0f07x0000w4u8054w8pnp/posts/cl1g1uj1p00003wu80hsl5d8b/comments/cl1h0ua1p00015su81bja5cum/
 *           authorId: cl1g0f07x0000w4u8054w8pnp
 *           postId: cl1g1uj1p00003wu80hsl5d8b
 *           contentType: text/markdown
 *           comment: SickOldeEnglish
 *           published: 2022-04-01T22:52:46.045Z
 *           node: null
 *           type: comment
 *           likeCount: 0
 *           author: 
 *             admin: null
 *             id: http://localhost:8000/authors/cl1g0f07x0000w4u8054w8pnp/
 *             displayName: Zezhou
 *             github: asdasdasdasd
 *             profileImage: dasdasdasdasd
 *             type: author
 *             url: http://localhost:8000/authors/cl1g0f07x0000w4u8054w8pnp/
 *             host: http://localhost:8000/
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
 *         description: the comments found
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/Comments'
 */
router.get(
	'/authors/:authorId/posts/:postId/comments/:commentId',
	commentController.getOneComment
);
router.get(
	'/authors/:authorId/posts/:postId/comments',
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
 *         description: post comment in a post
 *     responses:
 *       201:
 *         description: comments posted
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
