import { Router } from 'express';
import * as postController from '../controllers/posts.controller.js';
import { authenticateToken } from '../auth/index.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - type
 *         - title
 *         - id
 *         - source
 *         - origin
 *         - description
 *         - contentType
 *         - content
 *         - authorId
 *         - visibility
 *         - unlisted
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the post
 *         author:
 *           type: Author
 *           description: The relative author
 *         authorId:
 *           type: string
 *           description: The author id of relative author
 *         source:
 *           type: string
 *           description: The source url of post
 *         origin:
 *           type: string
 *           description: The origin url of post
 *         description:
 *           type: string
 *           description: The description of the post
 *         contentType:
 *           type: string
 *           description: The content type of the post
 *         content:
 *           type: string
 *           description: The content of the post
 *         categories:
 *           type: string
 *           description: The category of the post
 *         count:
 *           type: Int
 *           description: the length of the coutnet
 *         published:
 *           type: DateTime
 *           description: The date time of post published
 *         visibility:
 *           type: string
 *           description: if other user can see the post
 *         unlisted:
 *           type: Boolean
 *           description: if the post is listed
 *         likeCount:
 *           type: Int
 *           description: how many likes post received
 *         Comment:
 *           type: Comment
 *           description: the list of comments of the post
 *         Likes:
 *           type: Like
 *           description: the list of likes of the post
 *       example:
 *         type: post
 *         id: http://localhost:8000/authors/cl1g0f07x0000w4u8054w8pnp/
 *         authorId: cl1g0f07x0000w4u8054w8pnp
 *         title: test
 *         source: test source
 *         origin: http://localhost:8000/authors/cl1g0f07x0000w4u8054w8pnp/posts/
 *         description: this is a test 3
 *         contentType: text/plain
 *         content: test
 *         categories: []
 *         count: 0
 *         published: 2022-04-01T06:33:11.150Z
 *         visibility: PUBLIC
 *         unlisted: false
 *         likeCount: 0
 *         commentsSrc: 
 *           page: 1
 *           size: 1
 *           total: 1
 *           comments: 
 *             id: cl1gmmxit0006l8u84tlgb4xp
 *             authorId: cl1g0f07x0000w4u8054w8pnp
 *             postId: cl1g1uj1p00003wu80hsl5d8b
 *             contentType: text/plain
 *             comment: 135
 *             published: 2022-04-01T16:15:08.598Z
 *             node: null
 *
 *     Posts:
 *       type: object
 *       properties:
 *         items:
 *           type: Post
 *           description: The list of posts
 *       example:
 *         type: post
 *         item: 
 *           id: http://localhost:8000/authors/cl1g0f07x0000w4u8054w8pnp/
 *           authorId: cl1g0f07x0000w4u8054w8pnp
 *           title: test
 *           source: test source
 *           origin: http://localhost:8000/authors/cl1g0f07x0000w4u8054w8pnp/posts/
 *           description: this is a test 3
 *           contentType: text/plain
 *           content: test
 *           categories: []
 *           count: 0
 *           published: 2022-04-01T06:33:11.150Z
 *           visibility: PUBLIC
 *           unlisted: false
 *           likeCount: 0
 *           commentsSrc: 
 *             page: 1
 *             size: 1
 *             total: 1
 *             comments: 
 *               id: cl1gmmxit0006l8u84tlgb4xp
 *               authorId: cl1g0f07x0000w4u8054w8pnp
 *               postId: cl1g1uj1p00003wu80hsl5d8b
 *               contentType: text/plain
 *               comment: 135
 *               published: 2022-04-01T16:15:08.598Z
 *               node: null
 */

/**
 * @swagger
 * tags:
 *   name: Authors
 *   description: The author managing API
 */

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Returns all public posts
 *     tags: [Posts]
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
 *         description: all public posts get
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/Posts'
 */
router.get('/posts', postController.getAllPublicPosts);

/**
 * @swagger
 * /authors/{authorId}/posts/:
 *   get:
 *     summary: Returns all posts of a user
 *     tags: [Posts]
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
 *         description: all public posts get
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/Posts'
 *       404:
 *         description: the author not found
 */
router.get('/authors/:authorId/posts/', postController.getAllPosts);

/**
 * @swagger
 * /authors/{authorId}/posts/{postId}:
 *   get:
 *     summary: Returns a post by id
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: post found
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       404:
 *         description: the post not found; the author not found
 */
router.get('/authors/:authorId/posts/:id', postController.getOnePost);

/**
 * @swagger
 * /authors/{authorId}/posts/{postId}/image:
 *   get:
 *     summary: Returns images of a post
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: images found
 *         content:
 *           application/json:
 *             schema:
 *               image: asdasdi2y386asgd
 *       404:
 *         description: no image found
 */
router.get('/authors/:authorId/posts/:id/image', postController.getImage);

/**
 * @swagger
 * /authors/{authorId}/posts/{postId}:
 *   put:
 *     summary: put post by id
 *     tags: [Posts]
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           $ref: '#/components/schemas/Post'
 *         required: true
 *         description: the content of the post
 *     responses:
 *       201:
 *         description: Post posted
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       400:
 *         description: Missing required property
 *       403:
 *         description: Cannot post on this profile
 */
router.put(
	'/authors/:authorId/posts/:id',
	authenticateToken,
	postController.putPost
);

/**
 * @swagger
 * /authors/{authorId}/posts/{postId}:
 *   delete:
 *     summary: delete a post by id
 *     tags: [Posts]
 *     responses:
 *       204:
 *         description: post deleted
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       400:
 *         description: Missing required property
 */
router.delete(
	'/authors/:authorId/posts/:id',
	authenticateToken,
	postController.deletePost
);

/**
 * @swagger
 * /authors/{authorId}/posts/{postId}:
 *   post:
 *     summary: update post by id
 *     tags: [Posts]
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           $ref: '#/components/schemas/Post'
 *         required: true
 *         description: the content of the post
 *     responses:
 *       200:
 *         description: Post posted
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       400:
 *         description: Missing required property
 *       403:
 *         description: Not allowed
 */
router.post(
	'/authors/:authorId/posts/:id',
	authenticateToken,
	postController.updatePost
);

/**
 * @swagger
 * /authors/{authorId}/posts:
 *   post:
 *     summary: post a post
 *     tags: [Posts]
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           $ref: '#/components/schemas/Post'
 *         required: true
 *         description: the content of the post
 *     responses:
 *       200:
 *         description: Post posted
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       400:
 *         description: Missing required property
 *       403:
 *         description: Cannot post on this profile
 */
router.post(
	'/authors/:authorId/posts/',
	authenticateToken,
	postController.newPost
);

/**
 * @swagger
 * /authors/{authorId}/posts/{postId}/image:
 *   post:
 *     summary: post image to a post
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: images posted
 *         content:
 *           application/json:
 *             schema:
 *               image: asdasdi2y386asgd
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: file to update content path
 */
router.post(
	'/authors/:authorId/posts/:id/image',
	authenticateToken,
	postController.addPostImage
);
router.get('/remote/authors/:authorId/posts', postController.getRemotePosts);
router.get(
	'/remote/authors/:authorId/posts/:id',
	postController.getRemotePostById
);
export { router };
