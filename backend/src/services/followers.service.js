import prisma from '../../prisma/client.js';
// import { PrismaClient } from "@prisma/client";
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
