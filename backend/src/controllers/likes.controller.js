import { likeService } from '../services/index.service.js';

export async function httpGetAllLikesOfPost(req, res) {
	console.log(req.params.postid);
	const likes = await likeService.getLikes({
		postid: parseInt(req.params.postid),
		page: parseInt(req.query.page),
		size: parseInt(req.query.size),
	});
	const response = {
		type: 'likes',
		items: likes,
	};
	return res.status(200).json(response);
}

// TODO: Create get likes
export async function httpGetAllLikesOfComment(req, res) {
	console.log(req.params.commentid);
	const likes = await likeService.getLikes({
		commentid: parseInt(req.params.commentid),
		page: parseInt(req.query.page),
		size: parseInt(req.query.size),
	});
	const response = {
		type: 'likes',
		items: likes,
	};
	return res.status(200).json(response);
}

export async function httpPostNewLike(req, res) {
	const like = req.body;
	if (!like.postId || !like.authorId || !like.post || !like.author) {
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
