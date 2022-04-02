import {
	inboxService,
	likeService,
	nodesService,
	commentService,
	sharedpostsService,
	followersService,
} from '../services/index.service.js';
import axios from 'axios';
import cuid from 'cuid';
/**
 * Get an author's inbox
 * @param {Express.Request} req
 * @param {Express.Response} res
 * TODO: Get posts, comments, likes, and follows from the inbox items
 */
export async function getInbox(req, res) {
	const items = await inboxService.getInbox({
		id: req.params.id,
	});

	for (const item of items) {
		if (item.type === 'Follow') {
			const request = await followersService.get(item.owner);
			item.request = request;
		}
	}

	const host = `${req.protocol}://${req.get('host')}`;
	const inbox = {
		type: 'inbox',
		author: `${host}/authors/${req.params.id}`,
		items: items,
	};
	return res.status(200).json(inbox);
}

export async function postToInbox(req, res) {
	//check if remote
	const host = `${req.protocol}://${req.get('host')}`;
	let node;
	if (req.headers.authorization) {
		const auth = req.headers.authorization.split(' ');
		const credentials = new Buffer.from(auth[1], 'base64').toString();
		const username = credentials.split(':')[0];
		const password = credentials.split(':')[1];
		node = await nodesService.getNodeByUserPass(username, password);
	}

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
	if (!req.body.type) {
		return res.status(400).json({ error: 'Missing required property' });
	}
	const type = req.body.type;
	if (type === 'Like') {
		//valid like
		if (
			!req.body.author ||
			!req.body.author.id ||
			!req.body.summary ||
			!req.body['@context'] ||
			!req.body.object
		) {
			return res.status(400).json({ error: 'Missing required property' });
		}
		const exist = await likeService.checkLikeExist({
			object: req.body.object,
			authorId: req.body.author.id,
		});
		if (exist) {
			return res
				.status(409)
				.json({ error: 'Author Already Liked this object' });
		}
		const like = {
			object: req.body.object,
			authorId: req.body.author.id,
			summary: req.body.summary,
			context: req.body['@context'],
			node: node ? node : null,
		};
		const result = await likeService.postLike(like);
		if (!result) {
			return res.status(400).json({ error: 'Bad Request' });
		}
		const inbox = await inboxService.postToInbox({
			type: req.body.type,
			src: `${req.body.object}/likes/`,
			owner: req.params.id,
			message: req.body.summary,
		});
		if (!inbox) {
			return res.status(400).json({ error: 'Error Posting to Inbox' });
		}
		return res.status(201).json(req.body);
	} else if (type === 'comment') {
		if (
			!req.body.author ||
			!req.body.author.id ||
			!req.body.comment ||
			!req.body.contentType ||
			!req.body.post
		) {
			return res.status(400).json({ error: 'Missing required property' });
		}

		const postId = req.body.post.split('/posts/')[1].split('/')[0];

		const comment = {
			id: cuid(),
			postId: postId,
			authorId: req.body.author.id,
			comment: req.body.comment,
			contentType: req.body.contentType,
			published: new Date(),
			node: node ? node : null,
		};
		const result = await commentService.newComment(comment);
		if (!result) {
			return res.status(400).json({ error: 'Error on creating comment' });
		}
		const inbox = await inboxService.postToInbox({
			type: req.body.type,
			src: `${req.body.object}comments/${result.id}/`,
			owner: req.params.id,
			message: 'Your Post Received a New Comment',
		});
		if (!inbox) {
			return res.status(400).json({ error: 'Error Posting to Inbox' });
		}
		return res.status(201).json(req.body);
	} else if (type === 'post') {
		if (
			!req.body.author ||
			!req.body.author.id ||
			req.body.author.displayName == undefined ||
			req.body.author.github == undefined ||
			req.body.author.profileImage == undefined ||
			req.body.author.host == undefined ||
			req.body.author.url == undefined ||
			!req.body.id ||
			!req.body.title ||
			!req.body.origin ||
			!req.body.source ||
			!req.body.description ||
			!req.body.content ||
			req.body.categories == undefined ||
			!req.body.published ||
			!req.body.contentType ||
			!req.body.visibility ||
			!req.body.likeCount ||
			req.body.unlisted == undefined
		) {
			return res.status(400).json({ error: 'Post Missing required property' });
		}
		const postExist = await sharedpostsService.checkExistsSharedPosts({
			id: req.body.id,
			receiver: req.params.id,
		});
		if (postExist) {
			return res
				.status(409)
				.json({ error: 'Author Already have this post in their inbox' });
		}
		const post = req.body;
		post.receiver = req.params.id;
		if (!post.author.id.includes(host)) {
			post.author.node = post.author.id.split('/authors/')[0];
		}
		if (!post.id.includes(host)) {
			post.node = post.id.split('/authors/')[0];
		}
		const postOwner = await sharedpostsService.upsertPostOwner(post.author);
		const sharedPost = await sharedpostsService.createSharedPost(post);

		if (!sharedPost && !postOwner) {
			return res.status(400).json({ error: 'Unable to share Post' });
		}
		const inbox = await inboxService.postToInbox({
			type: req.body.type,
			src: req.body.id,
			owner: req.params.id,
			message: 'A New post is shared to You',
		});
		if (!inbox) {
			return res.status(400).json({ error: 'Error Posting to Inbox' });
		}
		return res.status(201).json(req.body);
	} else if (type === 'Follow') {
		if (!req.body.summary || !req.body.actor || !req.body.actor.id) {
			return res.status(400).json({ error: 'Missing required property' });
		}
		const friendReqId = req.params.id;

		const exist = await followersService.checkFollowRequestExist({
			authorId: req.body.actor.id,
			friendReqId: friendReqId,
		});
		if (exist) {
			return res.status(409).json({
				error: 'Your follow request is already pending approval or approved',
			});
		}

		const followRequest = {
			authorId: req.body.actor.id,
			friendReqId: friendReqId,
			node: node ? node : null,
		};
		const result = await followersService.createFollowRequest(followRequest);
		if (!result) {
			return res.status(400).json({ error: 'Bad Request' });
		}
		const inbox = await inboxService.postToInbox({
			type: req.body.type,
			src: req.body.actor.id,
			owner: req.params.id,
			message: 'Follow Request',
		});
		if (!inbox) {
			return res.status(400).json({ error: 'Error Posting to Inbox' });
		}
		return res.status(201).json(req.body);
	}
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

async function httpPostToInbox({ url, id, item }) {
	const node = await nodesService.getNodeByUrl(url);
	const response = await axios.post(`${node.url}/authors/${id}/inbox`, item, {
		auth: { username: node.username, password: node.password },
	});

	return response.status;
}

export async function postRemoteInbox(req, res) {
	if (!req.body.type || !req.body.node) {
		return res.status(400).json({ error: 'Missing required property' });
	}

	if (req.body.type === 'Like') {
		if (
			!req.body.author ||
			!req.body.author.id ||
			!req.body.summary ||
			!req.body['@context'] ||
			!req.body.object
		) {
			return res.status(400).json({ error: 'Missing required property' });
		}
		const authorId = req.body.author.id.split('/authors/')[1].split('/')[0];
		const exist = await likeService.checkLikeExist({
			object: req.body.object,
			authorId: authorId,
		});
		if (exist) {
			return res
				.status(409)
				.json({ error: 'Author Already Liked this object' });
		}
		const like = {
			object: req.body.object,
			authorId: req.body.author.id,
			summary: req.body.summary,
			context: req.body['@context'],
			node: null,
		};
		const result = await likeService.postLike(like);
		if (!result) {
			return res.status(400).json({ error: 'Error while creating like' });
		}
	}

	const status = await httpPostToInbox({
		url: req.body.node,
		id: req.params.id,
		item: req.body,
	});
	if (status === 201) {
		return res.status(201).json(req.body);
	} else {
		return res.status(503).json({ error: 'Error while post to remote inbox' });
	}
}
