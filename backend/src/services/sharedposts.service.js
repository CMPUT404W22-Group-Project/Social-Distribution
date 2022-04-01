import prisma from '../../prisma/client.js';

export async function getSharedPosts(receiver) {
	return await prisma.sharedpost.findMany({
		where: {
			receiver: receiver,
		},
	});
}

export async function checkExistsSharedPosts({ id, receiver }) {
	return await prisma.sharedpost.findUnique({
		where: {
			id_receiver: {
				id: id,
				receiver: receiver,
			},
		},
	});
}
export async function createSharedPost(post) {
	return await prisma.sharedpost.create({
		data: {
			id: post.id,
			authorId: post.author.id,
			title: post.title,
			source: post.source,
			origin: post.origin,
			description: post.description,
			contentType: post.contentType,
			content: post.content,
			categories: post.categories,
			published: post.published,
			visibility: post.visibility,
			unlisted: post.unlisted,
			likeCount: post.likeCount,
			receiver: post.receiver,
			node: post.node != null ? post.node : undefined,
		},
	});
}

export async function createPostOwner(author) {
	return await prisma.postowner.create({
		data: {
			id: author.id,
			displayName: author.displayName,
			github: author.github,
			profileImage: author.profileImage,
			host: author.host,
			url: author.url,
		},
	});
}

export async function checkOwnerExists(id) {
	return await prisma.postowner.findUnique({
		where: {
			id: id,
		},
	});
}
