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
			select: {
				admin: true,
			},
		});
	} else if (id) {
		return await prisma.author.findUnique({
			where: {
				id: id,
			},
			select: {
				admin: true,
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
					type: 'receive',
				},
			],
		},
	});
}
