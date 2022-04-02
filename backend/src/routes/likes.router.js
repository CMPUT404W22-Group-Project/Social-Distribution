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
 *         - context
 *         - summary
 *         - type
 *         - author
 *         - object
 *       properties:
 *         context:
 *           type: object
 *           description: the context of the id
 *         summary:
 *           type: string
 *           description: the summary of the like
 *         type:
 *           type: string
 *           description: type "like"
 *         author:
 *           type: Author
 *           description: the object of author contains only authour ID
 *         object:
 *           type: string
 *           description: the url of corresponding post or comment

 *       example:
 *         object: http://localhost:8000/authors/cl1g0f07x0000w4u8054w8pnp/posts/cl1g1uj1p00003wu80hsl5d8b/
 *         authorId: cl1g0f07x0000w4u8054w8pnp
 *         summary: ZezhouLikesyourpost
 *         context: https://www.w3.org/ns/activitystreams
 *         node: null
 *         type: Like
 *         author: 
 *            admin: null
 *            id: http://localhost:8000/authors/cl1g0f07x0000w4u8054w8pnp/
 *            displayName: Zezhou
 *            github: asdasdasd
 *            profileImage: adasdasfdas
 *            type: author
 *            url: http://localhost:8000/authors/cl1g0f07x0000w4u8054w8pnp/
 *            host: http://localhost:8000/
 * 
 *     Likes:
 *       type: object
 *       properties:
 *         items:
 *           type: Like
 *           description: The list of likes
 *       example:
 *         items: 
 *           object: http://localhost:8000/authors/cl1g0f07x0000w4u8054w8pnp/posts/cl1g1uj1p00003wu80hsl5d8b/
 *           authorId: cl1g0f07x0000w4u8054w8pnp
 *           summary: ZezhouLikesyourpost
 *           context: https://www.w3.org/ns/activitystreams
 *           node: null
 *           author: 
 *             admin: null
 *             id: http://localhost:8000/authors/cl1g0f07x0000w4u8054w8pnp/
 *             displayName: Zezhou
 *             github: 
 *             profileImage: 
 *             type: author
 *             url: http://localhost:8000/authors/cl1g0f07x0000w4u8054w8pnp/
 *             host: http://localhost:8000/
 *         
 *           type: Like
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
