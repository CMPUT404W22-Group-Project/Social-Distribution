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

export async function isAdmin(options) {
	const { id, email } = options;
	if (email) {
		return await prisma.author.findUnique({
			where: {
				email: email,
			},
		});
	} else if (id) {
		return await prisma.author.findUnique({
			where: {
				id: id,
			},
		});
	}
}

export async function authenticateNode(origin, username, password) {
	return await prisma.nodes.findFirst({
		where: {
			AND: [
				{
					username: username,
				},
				{
					password: password,
				},
				{
					url: origin,
				},
				{
					type: 'receive',
				},
			],
		},
	});
}
