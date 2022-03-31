import {
	authorService,
	commentService,
	inboxService,
	postService,
	nodesService,
	likeService,
} from '../services/index.service.js';
import cuid from 'cuid';
import axios from 'axios';

async function httpGetAuthorById({ url, id }) {
	const node = await nodesService.getNodeByUrl(url);

	const response = await axios.get(`${node.url}/authors/${id}`, {
		auth: { username: node.username, password: node.password },
	});

	return response.data;
}

async function httpGetComments({ url, authorId, postId }) {
	const node = await nodesService.getNodeByUrl(url);
	const response = await axios.get(
		`${node.url}/authors/${authorId}/posts/${postId}/comments/`,
		{
			auth: { username: node.username, password: node.password },
		}
	);
	return response.data.comments;
}

export async function getRemoteComments(req, res) {
	if (!req.query.node) {
		return res.status(400).json({ error: 'request do not contain node' });
	}
	try {
		const comments = await httpGetComments({
			url: req.query.node,
			authorId: req.params.authorId,
			id: req.params.id,
		});

		for (const comment of comments) {
			const node = comment.author.id.split('/authors/')[0];
			comment.author.node = node;
		}

		if (comments === 503) {
			return res.status(503);
		}
		return res.status(200).json({ type: 'comments', comments: comments });
	} catch (error) {
		return res.status(503);
	}
}
/**
 * Get all comments from a post
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns List of comments
 */
export async function getAllComments(req, res) {
	const comments = await commentService.getComments({
		postId: req.params.postId,
		page: parseInt(req.query.page),
		size: parseInt(req.query.size),
	});
	const host = `${req.protocol}://${req.get('host')}`;
	//TODO make this hanlde remote user
	for (const comment of comments) {
		comment.type = 'comment';
		comment.id = `${host}/authors/${req.params.authorId}/posts/${req.params.postId}/comments/${comment.id}/`;
		const likeCount = await likeService.getTotal(comment.id);
		comment.likeCount = likeCount['_count'];

		let author;
		if (comment.node) {
			//author id
			const id = comment.authorId.split('/author/')[0].split('/')[0];
			author = await httpGetAuthorById({ url: comment.node, id: id });
		} else {
			author = await authorService.getAuthors({ id: comment.authorId });
			if (author) {
				author.type = 'author';
				author.url = `${host}/authors/${comment.authorId}/`;
				author.id = `${host}/authors/${comment.authorId}/`;
				author.host = `${host}/`;
				delete author.email;
				delete author.password;
			} else {
				res.status(404).json({ error: 'Author Not Found' });
			}
		}

		comment.author = author;
		delete comment.receiver;
	}

	const response = {
		type: 'comments',
		page: req.query.page,
		size: req.query.size,
		post: `${host}/authors/${req.params.authorId}/posts/${req.params.postId}/`,
		id: `${host}/authors/${req.params.authorId}/posts/${req.params.postId}/comments/`,
		comments: comments,
	};
	return res.status(200).json(response);
}

/**
 * Get one comment
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns Comment object
 */
export async function getOneComment(req, res) {
	const comment = await commentService.getComments({
		id: req.params.commentId,
	});
	const author = await authorService.getAuthors({
		id: comment.authorId,
	});
	const host = `${req.protocol}://${req.get('host')}`;
	comment.type = 'comment';
	comment.id = `${host}/authors/${req.params.authorId}/posts/${req.params.postId}/comments/${comment.id}`;
	comment.author = {
		type: 'author',
		url: `${host}/authors/${comment.authorId}`,
		id: `${host}/authors/${comment.authorId}`,
		host: host,
		displayName: author.displayName,
		github: author.github,
		profileImage: author.profileImage,
	};
	delete comment.authorId;
	delete comment.postId;

	return res.status(200).json(comment);
}

/**
 * Create a new comment on a post
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns New comment
 */
export async function newComment(req, res) {
	const comment = req.body;
	comment.authorId = req.user.id;
	comment.postId = req.params.postId;
	comment.id = cuid();
	comment.published = new Date();

	if (!comment.type === 'comment')
		return res.status(400).json({ error: 'Not a comment' });
	if (!validComment(comment))
		return res.status(400).json({ error: 'Missing required property' });

	const newComment = await commentService.newComment(comment);
	const author = await authorService.getAuthors({ id: newComment.authorId });
	const post = await postService.getPosts({ id: comment.postId });

	newComment.id = `${req.protocol}://${req.get('host')}/authors/${
		post.authorId
	}/posts/${post.id}/comments/${comment.id}/`;
	newComment.author = author;

	// Send to inbox
	inboxService.postToInbox({
		type: 'comment',
		src: newComment.id,
		owner: post.authorId,
	});

	return res.status(201).json(newComment);
}

/**
 * Check if a comment has the required parameters
 * @param {Comment object} comment
 * @returns
 */
function validComment(comment) {
	if (
		!comment.id ||
		!comment.authorId ||
		!comment.postId ||
		!comment.contentType ||
		!comment.comment ||
		!comment.published
	) {
		return false;
	}
	return true;
}
