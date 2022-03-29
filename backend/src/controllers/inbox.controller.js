import {
	inboxService,
	likeService,
	nodesService,
} from '../services/index.service.js';
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
	//check if remote

	const auth = req.headers.authorization.split(' ');
	const credentials = new Buffer.from(auth[1], 'base64').toString();
	const username = credentials.split(':')[0];
	const password = credentials.split(':')[1];
	const node = await nodesService.getNodeByUserPass(username, password);

	// TODO: MAYBE: If remote, add copy of post to posts table

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

	//valid type
	if (!req.body.type) {
		return res.status(400).json({ error: 'Missing required property' });
	}
	console.log(req.body['@context']);
	const type = req.body.type;
	if (type === 'Like') {
		//valid like
		if (
			!req.body.author ||
			!req.body.summary ||
			!req.body['@context'] ||
			!req.body.object
		) {
			return res.status(400).json({ error: 'Missing required property' });
		}
		const like = {
			object: req.body.object,
			authorId: req.body.author.id,
			receiver: req.params.id,
			summary: req.body.summary,
			context: req.body['@context'],
			node: node ? node : null,
		};
		const result = await likeService.postLike(like);
		if (!result) {
			return res.status(400).json({ error: 'Bad Request' });
		}
		return res.status(201).json(req.body);
	}
	switch (req.body.type) {
		case 'Like':

		case 'Follow':

		case 'post':

		case 'comment':
	}
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
