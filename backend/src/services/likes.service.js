import prisma from '../../prisma/client.js';

/**
 * get likes from db
 * options depend on post Id or comment Id
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

/**
 * give a like json, create a like to db
 * @param {*} like 
 * @returns 
 */
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

/**
 * get a postId, get the total likes
 * @param {*} postId 
 * @returns 
 */
export async function getTotal(postId) {
    return await prisma.like.aggregate({
        where: {
            postId: postId,
        },
        _count: true,
    });
}