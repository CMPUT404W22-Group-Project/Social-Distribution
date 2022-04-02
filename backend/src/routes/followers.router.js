import { Router } from 'express';
import * as followersController from '../controllers/followers.controller.js';
import { authenticateToken } from '../auth/index.js';

const router = Router();




/**
 * @swagger
 * components:
 *   schemas:
 *     Follower:
 *       type: object
 *       required:
 *         - type
 *         - summary
 *         - actor
 *         - object
 *       properties:
 *         type:
 *           type: string
 *           description: type "Follow"
 *         summary:
 *           type: string
 *           description: the summary of this following
 *         actor:
 *           type: author
 *           description: the user who follow other
 *         object:
 *           type: author
 *           description: the user who get followed
 *       example:
 *         type: Follow
 *         summary: GregwantstofollowLara
 *         actor: 
 *           type: author
 *           id:http: //127.0.0.1:5454/authors/1d698d25ff008f7538453c120f581471
 *           url:http: //127.0.0.1:5454/authors/1d698d25ff008f7538453c120f581471
 *           host:http: //127.0.0.1:5454/
 *           displayName: GregJohnson
 *           github:http: //github.com/gjohnson
 *           profileImage: https://i.imgur.com/k7XVwpB.jpeg
 *         object: 
 *           type: author
 *           id:http: //127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e
 *           host:http: //127.0.0.1:5454/
 *           displayName: LaraCroft
 *           url:http: //127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e
 *           github:http: //github.com/laracroft
 *           profileImage: https://i.imgur.com/k7XVwpB.jpeg
 *     Followers:
 *       type: object
 *       properties:
 *         items:
 *           type: Object
 *           description: The list of followers
 *       example:
 *         type: followers
 *         item: 
 *           type: Follow
 *           summary: GregwantstofollowLara
 *           actor: 
 *             type: author
 *             id:http: //127.0.0.1:5454/authors/1d698d25ff008f7538453c120f581471
 *             url:http: //127.0.0.1:5454/authors/1d698d25ff008f7538453c120f581471
 *             host:http: //127.0.0.1:5454/
 *             displayName: GregJohnson
 *             github:http: //github.com/gjohnson
 *             profileImage: https://i.imgur.com/k7XVwpB.jpeg
 *           object: 
 *             type: author
 *             id:http: //127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e
 *             host:http: //127.0.0.1:5454/
 *             displayName: LaraCroft
 *             url:http: //127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e
 *             github:http: //github.com/laracroft
 *             profileImage: https://i.imgur.com/k7XVwpB.jpeg
 */


 /**
  * @swagger
  * tags:
  *   name: Followers
  *   description: The follower managing API
  */

/**
 * @swagger
 * /authors/:authorId/followers:
 *   get:
 *     summary: get all followers
 *     tags: [Followers]
 *     responses:
 *       200:
 *         description: the followers found
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/Followers'
 */
router.get('/authors/:authorId/followers', followersController.getFollowers);


/**
 * @swagger
 * /authors/:authorId/followers/:foreignAuthorId:
 *   delete:
 *     summary: get all followers
 *     tags: [Followers]
 *     responses:
 *       204:
 *         description: the followers deleted
 */
router.delete(
	'/authors/:authorId/followers/:foreignAuthorId',
	followersController.deleteFollower
);

/**
 * @swagger
 * /authors/:authorId/followers/:foreignAuthorId:
 *   put:
 *     summary: add a foreign followers
 *     tags: [Followers]
 *     responses:
 *       201:
 *         description: the followers added
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/Follower'
 */
router.put(
	'/authors/:authorId/followers/:foreignAuthorId',
	authenticateToken,
	followersController.addFollower
);


/**
 * @swagger
 * /authors/:authorId/followers/:foreignAuthorId:
 *   get:
 *     summary: get a foreign followers
 *     tags: [Followers]
 *     responses:
 *       200:
 *         description: the followers get
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/Follower'
 */
router.get(
	'/authors/:authorId/followers/:foreignAuthorId',
	followersController.checkIsFollower
);

export { router };
