import prisma from '../../prisma/client.js';

export async function getAuthors(options) {
	const { id, page, size } = options;

	if (id) {
		return await prisma.author.findUnique({
			where: {
				id: id,
			},
		});
	}

	if (page && size) {
		return await prisma.author.findMany({
			skip: size * (page - 1),
			take: size,
		});
	}

	return await prisma.author.findMany();
}

/**
 * Create an author
 * @param {Author object} author
 * @returns
 */
export async function newAuthor(author) {
	return await prisma.author.create({
		data: {
			id: author.id, // Required
			email: author.email, // Required
			password: author.password, // Required
			displayName: author.displayName != null ? author.displayName : '',
			github: author.github != null ? author.github : '',
			profileImage: author.profileImage != null ? author.profileImage : '',
		},
	});
}

/**
 * Update an author
 * @param {Author object} author
 * @returns
 */
export async function updateAuthor(author) {
	return await prisma.author.update({
		where: {
			id: author.id,
		},
		data: {
			email: author.email != null ? author.email : undefined,
			password: author.password != null ? author.password : undefined,
			displayName: author.displayName != null ? author.displayName : '',
			github: author.github != null ? author.github : '',
			profileImage: author.profileImage != null ? author.profileImage : '',
		},
	});
}

/**
 * Check if user email already exists in the database
 * @param {String} email
 * @returns email
 */
export async function checkUserExists(email) {
	return await prisma.author.findFirst({
		where: {
			email: email,
		},
		select: {
			password: false,
			id: true,
			email: false,
			displayName: true,
			github: true,
			profileImage: true,
		},
	});
}
