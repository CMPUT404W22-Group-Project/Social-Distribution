import prisma from '../../prisma/client.js';

export async function getComments(options) {
	const { postId, id, page, size } = options;

	if (id) {
		return await prisma.comment.findUnique({
			where: {
				id: id,
			},
		});
	}

	if (page && size && postId) {
		return await prisma.comment.findMany({
			where: {
				postId: postId,
			},
			skip: size * (page - 1),
			take: size,
			orderBy: {
				published: 'desc',
			},
		});
	}

	return await prisma.comment.findMany({
		where: {
			postId: postId,
		},
		orderBy: {
			published: 'desc',
		},
	});
}

export async function newComment(comment) {
	return await prisma.comment.create({
		data: {
			id: comment.id,
			authorId: comment.authorId,
			postId: comment.postId,
			receiver: comment.receiver,
			contentType: comment.contentType,
			comment: comment.comment,
			published: new Date(comment.published),
			node: comment.node != null ? comment.node : undefined,
		},
	});
}

export async function getTotal(postId) {
	return await prisma.comment.aggregate({
		where: {
			postId: postId,
		},
		_count: true,
	});
}
