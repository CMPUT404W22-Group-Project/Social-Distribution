import {
	authorService,
	inboxService,
	likeService,
} from '../services/index.service.js';
import axios from 'axios';

/**
 * get all like of post, given a post id
 * @param {*} req
 * @param {*} res
 * @returns
 */
export async function httpGetAllLikesOfPost(req, res) {
	const host = `${req.protocol}://${req.get('host')}`;
	console.log(req.params.postId);
	const likes = await likeService.getLikes({
		postId: parseInt(req.params.postid),
	});
	for (const like of likes) {
		const author = await authorService.getAuthors({ id: like.authorId });
		const object = `${host}/authors/${like.authorId}/posts/${like.postId}/likes`;
		like.summary = `${author.displayName} Likes Your Post`;
		like.author = author;
		like.type = 'Like';
		like.object = object;
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
export async function httpGetAllLikesOfComment(req, res) {
	console.log(req.params.commentId);
	const likes = await likeService.getLikes({
		commentId: parseInt(req.params.commentid),
	});
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

export async function httpGetLiked(req, res) {
	const host = `${req.protocol}://${req.get('host')}`;
	if (!req.params.authorId) {
		return res.status(400).json({
			error: 'Missing required property',
		});
	}
	const liked = await likeService.getLiked(req.params.authorId);
	const author = await authorService.getAuthors({ id: req.params.authorId });
	liked.forEach((like) => {
		const object = `${host}/authors/${like.authorId}/posts/${like.postId}/likes`;
		like.summary = `${author.displayName} Likes Your Post`;
		like.type = 'Like';
		like.object = object;
		like.author = author;
	});

	return res.status(200).json(liked);
}
