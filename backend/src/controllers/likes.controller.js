import { likeService } from '../services/index.service.js';

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

// TODO: Create get likes
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

export async function httpPostNewLikeToPost(req, res) {
	const like = req.body;
	console.log(like);
	if (!like.postId || !like.authorId) {
		return res.status(400).json({
			error: 'Missing required property',
		});
	}

	const newLike = await likeService.postLike(like);
	return res.status(201).json(newLike);
}

export async function httpGetLiked(req, res) {
	if (!req.params.authorId) {
		return res.status(400).json({
			error: 'Missing required property',
		});
	}

	const liked = await likeService.getLiked({
		authorid: parseInt(req.params.commentid),
		page: parseInt(req.query.page),
		size: parseInt(req.query.size),
	});
	return res.status(200).json(liked);
}
