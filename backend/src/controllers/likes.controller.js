import { authorService, likeService } from '../services/index.service.js';

/**
 * get all like of post, given a post id
 * @param {*} req
 * @param {*} res
 * @returns
 */
export async function httpGetAllLikesOfPost(req, res) {
	console.log(req.params.postId);
	const likes = await likeService.getLikes({
		postId: parseInt(req.params.postid),
	});
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
export async function httpPostNewLikeToPost(req, res) {
	const like = req.body;
	const host = `${req.protocol}://${req.get('host')}`;
	console.log(like);
	if (!like.postId || !like.authorId) {
		return res.status(400).json({
			error: 'Missing required property',
		});
	}

	const newLike = await likeService.postLike(like);
	const author = await authorService.getAuthors({ id: like.authorId });
	const object = `${host}/authors/${like.authorId}/posts/${like.postId}/likes`;
	newLike.summary = `${author.displayName} Likes Your Post`;
	newLike.author = author;
	newLike.type = 'Like';
	newLike.object = object;
	return res.status(201).json(newLike);
}

export async function httpGetLiked(req, res) {
	console.log(req.params.authorId);
	if (!req.params.authorId) {
		return res.status(400).json({
			error: 'Missing required property',
		});
	}

	const liked = await likeService.getLiked(req.params.authorId);
	return res.status(200).json(liked);
}
