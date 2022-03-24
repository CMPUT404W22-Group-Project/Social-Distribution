import { commentService, inboxService } from '../services/index.service.js';
import axios from 'axios';

/**
 * Get an author's inbox
 * @param {Express.Request} req
 * @param {Express.Response} res
 * TODO: Get posts, comments, likes, and follows from the inbox items
 */
export async function getInbox(req, res) {
	const items = await inboxService.getInbox({
		id: req.params.id,
		page: parseInt(req.query.page),
		size: parseInt(req.query.size),
	});
	const host = `${req.protocol}://${req.get('host')}`;
	const inbox = {
		type: 'inbox',
		author: `${host}/authors/${req.params.id}`,
		items: items,
	};

	return res.status(200).json({ inbox });
}

export async function postToInbox(req, res) {
	// TODO: MAYBE: If remote, add copy of post to posts table

	// TODO: If type is comment, then put comment in comment db
	// NOTE: Author primary key clash
	// if (req.body.type === 'comment') {
	// 	const remoteComment = (await axios.get(req.body.src)).data;
	// 	const comment = {
	// 		authorId: remoteComment.author.id,
	// 		postId: remoteComment.id.split('/posts/')[1].split('/comments')[0],
	// 		...remoteComment,
	// 	};
	// 	commentService.newComment(comment);
	// }
	const post = await inboxService.postToInbox({
		type: req.body.type,
		src: req.body.src,
		owner: req.body.owner,
		likedAuthor: req.body.likedAuthor,
	});
	return res.status(201).json(post);
}

/**
 * Clear the user's inbox
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns
 */
export async function deleteInbox(req, res) {
	await inboxService.clearInbox(req.params.id);
	return res.sendStatus(204);
}
