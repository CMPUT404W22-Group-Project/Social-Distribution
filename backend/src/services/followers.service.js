import prisma from '../../prisma/client.js';

export async function getFollowers(authorId, host) {
	const remoteFollowers = [];
	const localFollowersList = [];

	const followers = await prisma.followers.findMany({
		where: {
			followingId: authorId,
		},
	});

	for (const follower of followers) {
		if (
			// If local http URL
			follower.authorId.startsWith(host) ||
			// Or if CUID
			follower.authorId.startsWith('c')
		) {
			localFollowersList.push(
				follower.authorId.split('/').filter(String).slice(-1)[0]
			);
		} else {
			remoteFollowers.push(follower);
		}
	}

	const localFollowers = await prisma.author.findMany({
		where: {
			id: {
				in: localFollowersList,
			},
		},
	});

	return { localFollowers, remoteFollowers };
}

export async function deleteFollower(authorId, followingId) {
	return await prisma.followers.delete({
		where: {
			authorId_followingId: {
				authorId,
				followingId,
			},
		},
	});
}

export async function addFollower(authorId, followingId) {
	return await prisma.followers.create({
		data: {
			authorId: authorId,
			followingId: followingId,
		},
	});
}

export async function checkIsFollower(authorId, followingId) {
	return await prisma.followers.findFirst({
		where: {
			AND: [
				{
					authorId: authorId,
				},
				{
					followingId: followingId,
				},
			],
		},
	});
}
