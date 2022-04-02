import prisma from '../../prisma/client.js';

export async function getSharedPosts(receiver) {
	return await prisma.SharedPost.findMany({
		where: {
			receiver: receiver,
		},
	});
}

export async function checkExistsSharedPosts({ id, receiver }) {
	return await prisma.SharedPost.findFirst({
		where: {
			id: id,
			receiver: receiver,

		},
	});
}
export async function createSharedPost(post) {
	return await prisma.SharedPost.create({
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
			unlisted: false,
			likeCount: post.likeCount,
			receiver: post.receiver,
			node: post.node != null ? post.node : undefined,
		},
	});
}

export async function upsertPostOwner(author) {
	return await prisma.PostOwner.upsert({
		where: {
			id: author.id,
		},
		update: {
			displayName: author.displayName,
			github: author.github,
			profileImage: author.profileImage,
			host: author.host,
			url: author.url,
		},
		create: {
			id: author.id,
			displayName: author.displayName,
			github: author.github,
			profileImage: author.profileImage,
			host: author.host,
			url: author.url,
		},
	});
}
