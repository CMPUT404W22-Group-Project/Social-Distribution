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
				postId: postId,
			},
		});
	}

	if (commentId) {
		return await prisma.likes.findMany({
			where: {
				commentId: commentId,
			},
		});
	}

	return await prisma.likes.findMany();
}

export async function postLike(like) {
	return await prisma.likes.create({
		data: {
			postId: like.postId,
			authorId: like.authorId,
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


export async function getTotal(postId) {
    return await prisma.like.aggregate({
        where: {
            postId: postId,
        },
        _count: true,
    });
}