import {
	authorService,
	inboxService,
	likeService,
	nodesService,
} from '../services/index.service.js';
import axios from 'axios';
async function httpGetRemoteCommentLikes({ url, authorId, postId, commentId }) {
	const node = await nodesService.getNodeByUrl(url);

	const response = await axios.get(
		`${node.url}/authors/${authorId}/posts/${postId}/comments/${commentId}/likes`,
		{
			auth: { username: node.username, password: node.password },
		}
	);

	return response.data;
}

async function httpGetRemotePostLikes({ url, authorId, postId }) {
	const node = await nodesService.getNodeByUrl(url);

	const response = await axios.get(
		`${node.url}/authors/${authorId}/posts/${postId}/likes`,
		{
			auth: { username: node.username, password: node.password },
		}
	);

	return response.data;
}

async function httpGetAuthorById({ url, id }) {
	const node = await nodesService.getNodeByUrl(url);

	const response = await axios.get(`${node.url}/authors/${id}`, {
		auth: { username: node.username, password: node.password },
	});

	return response.data;
}

/**
 * get all like of post, given a post id
 * @param {*} req
 * @param {*} res
 * @returns
 */
export async function getAllLikesOfPost(req, res) {
	const host = `${req.protocol}://${req.get('host')}`;
	const object = `${host}/authors/${req.params.authorId}/posts/${req.params.postId}/`;
	const likes = await likeService.getLikes(object);
	for (const like of likes) {
		let author;
		if (like.node) {
			//author id
			const id = like.authorId.split('/author/')[0].split('/')[0];
			author = await httpGetAuthorById({ url: like.node, id: id });
		} else {
			author = await authorService.getAuthors({ id: like.authorId });
			author.type = 'author';
			author.url = `${host}/authors/${like.authorId}/`;
			author.id = `${host}/authors/${like.authorId}/`;
			author.host = `${host}/`;
			delete author.email;
			delete author.password;
		}
		like.author = author;
		like.type = 'Like';
		like['@context'] = like.context;
	}
	const response = {
		type: 'likes',
		items: likes,
	};
	return res.status(200).json(response);
}

/**
 * get all like of comment, given a comment id
 * @param {*} req
 * @param {*} res
 * @returns
 */
export async function getAllLikesOfComment(req, res) {
	const host = `${req.protocol}://${req.get('host')}`;
	const object = `${host}/authors/${req.params.authorId}/posts/${req.params.postId}/comments/${req.params.commentId}/`;

	const likes = await likeService.getLikes(object);

	for (const like of likes) {
		let author;
		if (like.node) {
			//author id
			const id = like.authorId.split('/authors/')[0].split('/')[0];
			author = await httpGetAuthorById({ like: like.node, id: id });
		} else {
			author = await authorService.getAuthors({ id: like.authorId });
			delete author.email;
			delete author.password;
		}
		like.author = author;
		like.type = 'Like';
		like['@context'] = like.context;
	}
	const response = {
		type: 'likes',
		items: likes,
	};
	return res.status(200).json(response);
}

/**
 * create a new post, given a post request
 * @param {*} req
 * @param {*} res
 * @returns
 */
// FIXME: Post route should be inbox, not likes
export async function httpPostNewLikeToPost(req, res) {
	const like = req.body;
	const host = `${req.protocol}://${req.get('host')}`;
	like.authorId = like.object.split('/authors/')[1].split('/posts/')[0];
	like.postId = like.object.split('/authors/')[1].split('/posts/')[1];

	if (!like.postId || !like.authorId) {
		return res.status(400).json({
			error: 'Missing required property',
		});
	}

	const newLike = await likeService.postLike({
		authorId: like.author.id,
		postId: like.postId,
	});

	let author;
	if (like.author.id.startsWith(host)) {
		author = await authorService.getAuthors({ id: like.author.id });
	} else {
		// TODO: Basic auth
		author = (await axios.get(like.author.id)).data;
	}

	newLike.summary = `${author.displayName} Likes Your Post`;
	newLike.author = author;
	newLike.type = 'Like';
	newLike.object = like.object;

	// TODO: Send like to inbox
	inboxService.postToInbox({
		type: 'like',
		src: like.object,
		owner: `${host}/authors/${like.authorId}/`,
		likedAuthor: `${host}/authors/${like.author.id}/`,
	});

	return res.status(201).json(newLike);
}

export async function getLikedByAuthor(req, res) {
	const host = `${req.protocol}://${req.get('host')}`;
	if (!req.params.authorId) {
		return res.status(400).json({
			error: 'Missing required property',
		});
	}
	const liked = await likeService.getLiked(req.params.authorId);
	const author = await authorService.getAuthors({ id: req.params.authorId });
	author.host = host;
	author.id = `${host}/authors/${req.params.authorId}`;
	author.url = `${host}/authors/${req.params.authorId}`;
	delete author.email;
	delete author.password;
	liked.forEach((like) => {
		// const object = `${host}/authors/${like.authorId}/posts/${like.postId}/likes`;
		like.type = 'Like';
		like['@context'] = like.context;
		like.author = author;
	});

	return res.status(200).json({ type: 'liked', items: liked });
}

export async function getRemoteLikesOfPost(req, res) {
	if (!req.query.node) {
		return res.status(400).json({ error: 'request do not contain node' });
	}
	try {
		const likes = await httpGetRemotePostLikes({
			url: req.query.node,
			authorId: req.params.authorId,
			postId: req.params.postId,
		});

		if (likes === 503) {
			return res.status(503);
		}
		return res.status(200).json({ type: 'likes', items: likes });
	} catch (error) {
		return res.status(503);
	}
}

export async function getRemoteLikesOfComment(req, res) {
	if (!req.query.node) {
		return res.status(400).json({ error: 'request do not contain node' });
	}
	try {
		const likes = await httpGetRemoteCommentLikes({
			url: req.query.node,
			authorId: req.params.authorId,
			postId: req.params.postId,
			commentId: req.params.commentId,
		});

		if (likes === 503) {
			return res.status(503);
		}
		return res.status(200).json({ type: 'likes', items: likes });
	} catch (error) {
		return res.status(503);
	}
}
