import {
	inboxService,
	likeService,
	nodesService,
	commentService,
	sharedpostsService,
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
	console.log(req.body['@context']);
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
			return res.status(400).json({ error: 'Bad Request' });
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
			req.body.author.url == undefined  ||
			!req.body.id ||
			!req.body.title ||
			!req.body.origin ||
			!req.body.source ||
			!req.body.description ||
			!req.body.content ||
			req.body.categories == undefined||
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
