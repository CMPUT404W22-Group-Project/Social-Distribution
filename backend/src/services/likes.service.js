import prisma from '../../prisma/client.js';

/**
 * get likes from db
 * options depend on post Id or comment Id
 * @param {*} options
 * @returns
 */
export async function getLikes(object) {
	return await prisma.likes.findMany({
		where: {
			object: object,
		},
	});
}

/**
 * give a like json, create a like to db
 * @param {*} like
 * @returns
 */
//have node if remote author

export async function postLike(like) {
	return await prisma.likes.create({
		data: {
			object: like.object,
			authorId: like.authorId,
			receiver: like.receiver,
			summary: like.summary,
			context: like.context,
			node: like.node != null ? like.node : undefined,
		},
	});
}

export async function getLiked(authorId) {
	if (authorId) {
		return await prisma.likes.findMany({
			where: {
				authorId: authorId,
			},
		});
	}
}

/**
 * get a postId, get the total likes
 * @param {*} postId
 * @returns
 */
export async function getTotal(object) {
	return await prisma.likes.aggregate({
		where: {
			object: object,
		},
		_count: true,
	});
}
