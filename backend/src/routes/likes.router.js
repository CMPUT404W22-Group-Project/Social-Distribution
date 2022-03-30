import { Router } from 'express';
import * as likeController from '../controllers/likes.controller.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Like:
 *       type: object
 *       required:
 *         - id
 *         - postId
 *         - authorId
 *         - post
 *         - author
 *       properties:
 *         id:
 *           type: object
 *           description: The combination of post id and author id
 *         postId:
 *           type: string
 *           description: the post id of relative post
 *         authorId:
 *           type: string
 *           description: The author id of relative author
 *         post:
 *           type: Post
 *           description: the relative Post
 *         author:
 *           type: Author
 *           description: The relative author

 *       example:
 *         id: [dfsE_asz,d5fsE_asz]
 *         postId: dfsE_asz
 *         authorId: d5fsE_asz
 *         post: {}
 *         author: {}
 *     Likes:
 *       type: object
 *       properties:
 *         items:
 *           type: Like
 *           description: The list of likes
 *       example:
 *         type: Like
 *         items: []
 */

/**
 * @swagger
 * tags:
 *   name: Likes
 *   description: The author managing API
 */

// FIXME: Post route should be inbox, not like
router.post(
	'/authors/:authorId/posts/:postId/likes',
	likeController.httpPostNewLikeToPost
);

/**
 * @swagger
 * /authors/:authorId/posts/:postId/likes/:
 *   get:
 *     summary: Returns all likes of a post
 *     tags: [Likes]
 *     responses:
 *       200:
 *         description: likes received
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/Likes'
 */
router.get(
	'/authors/:authorId/posts/:postId/likes',
	likeController.getAllLikesOfPost
);

/**
 * @swagger
 * /authors/:authorId/posts/:postId/comments/:commentId/likes:
 *   get:
 *     summary: Returns all likes of a comment
 *     tags: [Likes]
 *     responses:
 *       200:
 *         description: likes received
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/Likes'
 */
router.get(
	'/authors/:authorId/posts/:postId/comments/:commentId/likes',
	likeController.getAllLikesOfComment
);
router.get('/authors/:authorId/liked', likeController.getLikedByAuthor);

router.get(
	'/remote/authors/:authorId/posts/:postId/likes',
	likeController.getRemoteLikesOfPost
);

router.get(
	'remote/authors/:authorId/posts/:postId/comments/:commentId/likes',
	likeController.getRemoteLikesOfComment
);

export { router };
