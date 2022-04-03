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
			follower.authorId.startsWith('c') ||
			!follower.node
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

export async function deleteFollower({ authorId, followingId }) {
	return await prisma.followers.delete({
		where: {
			authorId_followingId: {
				authorId,
				followingId,
			},
		},
	});
}

export async function addFollower({ authorId, followingId, node }) {
	return await prisma.followers.create({
		data: {
			authorId: authorId,
			followingId: followingId,
			node: node != null ? node : undefined,
		},
	});
}

export async function checkIsFollower({ authorId, followingId }) {
	return await prisma.followers.findUnique({
		where: {
			authorId_followingId: {
				authorId,
				followingId,
			},
		},
	});
}

export async function getFollowRequest({ authorId, friendReqId }) {
	return await prisma.friendRequest.findMany({
		where: {
			AND: [
				{
					authorId: authorId,
				},
				{
					friendReqId: friendReqId,
				},
			],
		},
	});
}

export async function createFollowRequest(followRequest) {
	return await prisma.FriendRequest.create({
		data: {
			authorId: followRequest.authorId,
			friendReqId: followRequest.friendReqId,
			accept: false,
			node: followRequest.node != null ? followRequest.node : undefined,
		},
	});
}

export async function checkFollowRequestExist({ authorId, friendReqId }) {
	return await prisma.FriendRequest.findFirst({
		where: {
			AND: [
				{
					authorId: authorId,
				},
				{
					friendReqId: friendReqId,
				},
			],
		},
	});
}

export async function acceptFollowRequest({ authorId, friendReqId }) {
	return await prisma.FriendRequest.update({
		where: {
			authorId_friendReqId: {
				authorId: authorId,
				friendReqId: friendReqId,
			},
		},
		data: {
			accept: true,
		},
	});
}
