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
 *         - authorId
 *         - followingId
 *         - id
 *       properties:
 *         id:
 *           type: object
 *           description: The combined id of authorId and followingId
 *         authorId:
 *           type: string
 *           description: The author id of relative author
 *         followingId:
 *           type: string
 *           description: The author id of the one being followed
 *       example:
 *         id: dfsE_asz
 *         authorId: dfssE_asz
 *         followingId: [dfsE_asz,dfssE_asz]
 *     Followers:
 *       type: object
 *       properties:
 *         items:
 *           type: Object
 *           description: The list of followers
 *       example:
 *         type: Object
 *         items: []
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
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: int
 *         required: true
 *         description: id of the author
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
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: int
 *         required: true
 *         description: id of the author
 *       - in: path
 *         name: foreignAuthorId
 *         schema:
 *           type: int
 *         required: true
 *         description: id of the foreign author
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
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: int
 *         required: true
 *         description: id of the author
 *       - in: path
 *         name: foreignAuthorId
 *         schema:
 *           type: int
 *         required: true
 *         description: id of the foreign author
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
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: int
 *         required: true
 *         description: id of the author
 *       - in: path
 *         name: foreignAuthorId
 *         schema:
 *           type: int
 *         required: true
 *         description: id of the foreign author
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
