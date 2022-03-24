import {
	authorService,
	commentService,
	inboxService,
	postService,
} from '../services/index.service.js';
import cuid from 'cuid';

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

	comments.forEach((comment) => {
		comment.type = 'comment';
		comment.id = `${host}/authors/${req.params.authorId}/posts/${req.params.postId}/comments/${comment.id}/`;
		comment.author = {
			type: 'author',
			url: `${host}/authors/${comment.authorId}/`,
			id: `${host}/authors/${comment.authorId}/`,
			host: `${host}/`,
			...comment.author,
		};
	});

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
