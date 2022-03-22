import prisma from '../../prisma/client.js';
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

export async function getFollowers(authorId) {
	const localFollowers = await prisma.author.findMany({
		where: {
			id: authorId,
		},
	});

	const remoteFollowers = await prisma.followers.findMany({
		where: {
			AND: [
				{
					followingId: authorId,
				},
				{
					authorId: {
						startsWith: 'http',
					},
				},
			],
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
