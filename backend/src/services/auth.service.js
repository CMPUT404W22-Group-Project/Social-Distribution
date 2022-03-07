import PrismaClient from '@prisma/client';

const prisma = new PrismaClient.PrismaClient();

export async function getHashedPassword(email) {
	return await prisma.author.findUnique({
		select: {
			password: true,
		},
		where: {
			email: email,
		},
	});
}
