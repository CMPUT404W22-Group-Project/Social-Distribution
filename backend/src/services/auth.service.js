import prisma from '../../prisma/client.js';

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
