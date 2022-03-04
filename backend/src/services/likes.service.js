import PrismaClient from '@prisma/client';

const prisma = new PrismaClient.PrismaClient();

/**
 *
 * @param {*} options
 * @returns
 */
export async function getPosts(options) {
	const { postid, commentid, page, size } = options;

	if (postid && page && size) {
		return await prisma.like.findMany({
			where: {
				postId: postid,
				skip: size * (page - 1),
				take: size,
			},
		});
	}

	if (commentid && page && size) {
		return await prisma.like.findMany({
			where: {
				commentId: commentid,
				skip: size * (page - 1),
				take: size,
			},
		});
	}

	return await prisma.like.findMany();
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
