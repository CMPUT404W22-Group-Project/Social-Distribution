import {
	postService,
	authorService,
	commentService,
	likeService,
} from '../services/index.service.js';
import { getFollowersJSON } from './followers.controller.js';

import cuid from 'cuid';
import path from 'path';
import axios from 'axios';
import { postToInbox } from '../services/inbox.service.js';

const __dirname = path.resolve();
/**
 * Get all posts that are public
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns All the posts of an author
 */
export async function getAllPublicPosts(req, res) {
	const posts = await postService.getPublicPosts();
	const host = `${req.protocol}://${req.get('host')}`;

	for (const post of posts) {
		//author
		const author = await authorService.getAuthors({ id: post.authorId });
		post.type = 'post';
		author.id = `${host}/authors/${post.authorId}`;
		post.author = {
			type: 'author',
			url: `${host}/authors/${post.authorId}`,
			host: `${host}/`,
			...author,
		};

		//like
		const likeCount = await likeService.getTotal(post.id);
		post.likeCount = likeCount['_count'];
		post.comments = `${host}/authors/${post.authorId}/posts/${post.id}/comments/`;
		//comments
		const page = 1;
		const size = 5;
		const total = await commentService.getTotal(post.id);
		const comments = await commentService.getComments({
			postId: post.id,
			page: page,
			size: size,
		});

		post.commentsSrc = {
			page: page,
			size: size,
			total: total['_count'],
			comments: comments,
		};
		post.id = `${host}/authors/${post.authorId}/posts/${post.id}/`;
	}
	const response = {
		type: 'posts',
		items: posts,
	};

	return res.status(200).json(response);
}
/**
 * Get all posts of a given author
 * TODO: Get public and friend posts only
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns All the posts of an author
 */
export async function getAllPosts(req, res) {
	const posts = await postService.getPosts({
		authorId: req.params.authorId,
		page: parseInt(req.query.page),
		size: parseInt(req.query.size),
	});
	const host = `${req.protocol}://${req.get('host')}`;
	const author = await authorService.getAuthors({ id: req.params.authorId });
	if (!author) {
		return res.status(404).json({ error: 'Author Not Found' });
	}
	author.id = `${host}/authors/${author.id}/`;
	for (const post of posts) {
		//author
		post.type = 'post';
		post.host = `${host}/`;

		post.author = {
			type: 'author',
			url: `${host}/authors/${post.authorId}/`,
			host: `${host}/`,
			...author,
		};
		//like
		const likeCount = await likeService.getTotal(post.id);
		post.likeCount = likeCount['_count'];

		post.comments = `${host}/authors/${post.authorId}/posts/${post.id}/comments`;
		//comments
		const page = 1;
		const size = 5;
		const total = await commentService.getTotal(post.id);
		const comments = await commentService.getComments({
			postId: post.id,
			page: page,
			size: size,
		});

		post.commentsSrc = {
			page: page,
			size: size,
			total: total['_count'],
			comments: comments,
		};
		post.id = `${host}/authors/${post.authorId}/posts/${post.id}/`;
	}

	const response = {
		type: 'posts',
		items: posts,
	};

	return res.status(200).json(response);
}

/**
 * Get one post of a given author (using author id)
 * TODO: Check if user is allowed to see post (public/friend, unlisted)
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns The post information requested
 */
export async function getOnePost(req, res) {
	const post = await postService.getPosts({ id: req.params.id });
	const host = `${req.protocol}://${req.get('host')}`;
	if (!post) {
		return res.status(404).json({ error: 'Post Not Found' });
	}

	const author = await authorService.getAuthors({ id: post.authorId });

	post.id = `${host}/authors/${post.authorId}/posts/${post.id}/`;
	if (!author) {
		return res.status(404).json({ error: 'Author Not Found' });
	}
	//like
	const likeCount = await likeService.getTotal(req.params.id);
	post.likeCount = likeCount['_count'];
	//comments
	const page = 1;
	const size = 5;
	const total = await commentService.getTotal(post.id);
	const comments = await commentService.getComments({
		postId: post.id,
		page: page,
		size: size,
	});

	post.commentsSrc = {
		page: page,
		size: size,
		total: total['_count'],
		comments: comments,
	};
	post.id = `${host}/authors/${post.authorId}/posts/${post.id}/`;
	author.id = `${host}/authors/${post.authorId}/`;
	post.author = {
		type: 'author',
		url: `${host}/authors/${post.authorId}/`,
		host: `${host}/`,
		...author,
	};

	const response = {
		type: 'post',
		...post,
		...author,
	};

	return res.status(200).json(response);
}

/**
 * Create a new post with a specified post ID
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns New post
 */
export async function putPost(req, res) {
	// Check if the user is posting to their own author page
	if (req.user.id !== req.params.authorId) {
		return res.status(403).json({ error: 'Cannot post on this profile' });
	}

	const post = req.body;
	post.id = req.params.id;
	post.authorId = req.user.id;
	post.published = new Date();

	if (!validPost(post))
		return res.status(400).json({ error: 'Missing required property' });

	const newPost = await postService.putPost(post);
	return res.status(201).json(newPost);
}

/**
 * Delete a post given the post ID
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns Deleted post
 */
export async function deletePost(req, res) {
	const id = req.params.id;
	const authorId = req.params.authorId;

	if (!id) {
		return res.status(400).json({ error: 'Missing required property' });
	}

	// Check if the user is allowed to delete the post
	if (authorId !== req.user.id) {
		return res.status(403).json({ error: 'Not allowed' });
	}

	await postService.deletePost(id);
	return res.status(204);
}

/**
 * Update a post given the post ID
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns Updated post
 */
export async function updatePost(req, res) {
	const post = req.body;
	post.id = req.params.id;
	const authorId = req.params.authorId;

	// Check if the user is allowed to update the post
	if (authorId !== req.user.id) {
		return res.status(403).json({ error: 'Not allowed' });
	}

	if (!validPost(post)) {
		return res.status(400).json({ error: 'Missing required property' });
	}

	const updatedPost = await postService.updatePost(post);
	return res.status(200).json(updatedPost);
}

/**
 * Create a new post with a generated ID
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns New post
 */
export async function newPost(req, res) {
	// Check if the user is posting to their own author page
	if (req.user.id !== req.params.authorId) {
		return res.status(403).json({ error: 'Cannot post on this profile' });
	}

	const host = `${req.protocol}://${req.get('host')}`;
	const post = req.body;
	post.authorId = req.user.id;
	post.id = cuid();
	post.published = new Date();
	post.origin = `${host}/authors/${req.user.id}/posts`;

	if (!validPost(post))
		return res.status(400).json({ error: 'Missing required property' });

	const newPost = await postService.newPost(post);

	// TODO: Send posts to friends
	const followers = await getFollowersJSON({
		authorId: req.params.authorId,
		protocol: req.protocol,
		host: req.get('host'),
	});

	followers.items.forEach((follower) => {
		if (follower.host.startsWith(host)) {
			postToInbox({
				type: 'post',
				src: post.id,
				owner: `${host}/authors/${req.user.id}`,
			});
		} else {
			// TODO: Use basic auth
			axios
				.post(`${follower.url}/inbox`, {
					type: 'post',
					owner: `${host}/authors/${req.user.id}`,
					src: `${post.origin}/${post.id}`,
				})
				.catch((err) => {
					console.error(`${err.message} on ${follower.url}/inbox`);
				});
		}
	});

	return res.status(201).json(newPost);
}

/**
 * Upload image to backend folder
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns New post
 */
export async function addPostImage(req, res) {
	if (req.files === null)
		return res.status(400).json({ error: 'No file uploaded' });

	const file = req.files.file;
	const fileName =
		file.mimetype === 'image/png'
			? `${req.params.id}.png`
			: `${req.params.id}.jpeg`;
	console.log(file);
	await file.mv(path.join(__dirname, 'public', 'posts', fileName), (err) => {
		if (err) {
			console.log(err);
			return res.status(500).send(err);
		}
	});
	const host = `${req.protocol}://${req.get('host')}`;
	const content = `${host}/authors/${req.params.authorId}/posts/${req.params.id}/image`;
	const updatedPost = await postService.updatePostContent(
		req.params.id,
		content
	);
	if (updatedPost === null) {
		res.status(500).send({ error: 'file to update content path' });
	}
	return res
		.status(201)
		.json({ filename: fileName, filePath: `/public/posts/${fileName}` });
}

/**
 * Upload image to backend folder
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns Image
 */
export async function getImage(req, res) {
	const postType = await postService.getContentType(req.params.id);
	let fileName;
	if (postType === 'image/png;base64') {
		fileName = `${req.params.id}.png`;
	} else if (postType === 'image/jpeg;base64') {
		fileName = `${req.params.id}.jpeg`;
	} else {
		return res.status(404).json({ error: 'No Image Found' });
	}

	const filePath = path.join(__dirname, 'public', 'posts', fileName);
	res.sendFile(filePath, (err) => {
		if (err) {
			console.log(err);
			return res.status(500).send(err);
		}
	});
}
/**
 * Check if post has all the required arguments
 * @param {Post object} post
 * @returns Boolean
 */
function validPost(post) {
	if (
		!post.id ||
		!post.authorId ||
		!post.title ||
		!post.source ||
		!post.origin ||
		!post.description ||
		!post.contentType ||
		!post.published ||
		!post.visibility ||
		post.unlisted === undefined
	) {
		return false;
	}
	return true;
}
