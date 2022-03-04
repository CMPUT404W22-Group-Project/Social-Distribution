import prisma from '../../prisma/client.js';

/**
 *
 * @param {*} options
 * @returns
 */
export async function getLikes(options) {
	const { postId, commentId } = options;

	if (postId) {
		return await prisma.likes.findMany({
			where: {
				postId: postid,
			},
		});
	}

	if (commentId) {
		return await prisma.likes.findMany({
			where: {
				commentId: commentid,
			},
		});
	}

	return await prisma.likes.findMany();
}

export async function postLike(like) {
	return await prisma.post.create({
		data: {
			postId: like.postId,
			authorId: like.authorId,
			Post: like.Post,
			//Comment: like.Comment
			Author: like.Author,
		},
	});
}

export async function getLiked(options) {
	const { authorid, commentid, page, size } = options;

	if (commentid && page && size) {
		return await prisma.like.findMany({
			where: {
				authorId: authorid,
				skip: size * (page - 1),
				take: size,
			},
		});
	}
}
