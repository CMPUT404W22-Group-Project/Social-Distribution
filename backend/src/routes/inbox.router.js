import { Router } from 'express';
import * as inboxController from '../controllers/inbox.controller.js';
import { authenticateToken } from '../auth/index.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Inbox:
 *       type: object
 *       required:
 *         - type
 *         - src
 *         - owner
 *         - author
 *       properties:
 *         id:
 *           type: object
 *           description: The combined id of src and owner
 *         type:
 *           type: string
 *           description: The type of this element
 *         src:
 *           type: string
 *           description: If post, then post id, If following, then following author id If like, then liked post id.  If comment, then comment id.  (URL if remote)
 *         likedAuthor:
 *           type: string
 *           description: Contains the author id that liked the post.
 *         owner:
 *           type: string
 *           description: the woner of the inbox
 *         dateTime:
 *           type: DayTime
 *           description: Timestamp the event
 *         author:
 *           type: Author
 *           description: the relative author
 *       example:
 *         type: post
 *         src: dfsE_asz
 *         likedAuthor: d5fsE_asz
 *         owner: d5fsE_asz
 *         dateTime: 2022-03-22
 *         author: [dfsE_asz, d5fsE_asz]
 *         id: {}
 *     Inboxs:
 *       type: object
 *       properties:
 *         items:
 *           type: Object
 *           description: The list of elements
 *       example:
 *         type: Object
 *         items: []
 */

/**
 * @swagger
 * tags:
 *   name: Inbox
 *   description: The inbox managing API
 */

/**
 * @swagger
 * /authors/:id/inbox:
 *   get:
 *     summary: Returns the inbox
 *     tags: [Inbox]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: int
 *         required: true
 *         description: id of the author
 *     responses:
 *       200:
 *         description: the inbox found
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/Inboxs'
 */
router.get('/authors/:id/inbox', authenticateToken, inboxController.getInbox);
// TODO: Basic auth

/**
 * @swagger
 * /authors/:id/inbox:
 *   post:
 *     summary: Returns the inbox
 *     tags: [Inbox]
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           oneOf:
 *             - $ref: '#/components/schemas/Comment'
 *             - $ref: '#/components/schemas/Post'
 *             - $ref: '#/components/schemas/Like'
 *     responses:
 *       201:
 *         description: the element listed emelents in inbox
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/Comment'
 *                 - $ref: '#/components/schemas/Post'
 *                 - $ref: '#/components/schemas/Like'
 *       400:
 *         description: Missing required property
 *       409:
 *         description: Author Already Liked this object
 */
router.post(
	'/authors/:id/inbox',
	authenticateToken,
	inboxController.postToInbox
);
router.post(
	'remote/authors/:id/inbox',
	authenticateToken,
	inboxController.postRemoteInbox
);

/**
 * @swagger
 * /authors/:id/inbox:
 *   delete:
 *     summary: Returns the inbox
 *     tags: [Inbox]
 *     responses:
 *       204:
 *         description: the element deleted
 */
router.delete(
	'/authors/:id/inbox',
	authenticateToken,
	inboxController.deleteInbox
);

export { router };
