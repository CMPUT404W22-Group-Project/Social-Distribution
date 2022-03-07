import PrismaClient from '@prisma/client';

const prisma = new PrismaClient.PrismaClient();

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
 * post a author to database, if it already
 * exist, then update it.
 * @param {Author object} author
 * @returns
 */
export async function newAuthor(author) {
	return await prisma.author.upsert({
		where: {
			id: author.id,
		},
		update: {
			email: author.email != null ? author.email : undefined,
			password: author.password != null ? author.password : undefined,
			displayName: author.displayName != null ? author.displayName : undefined,
			github: author.github != null ? author.github : undefined,
			profileImage: author.profileImage != null ? author.profileImage : undefined,
		},
		create: {
			id: author.id, // Required
			email: author.email, // Required
			password: author.password, // Required
			displayName: author.displayName != null ? author.displayName : undefined,
			github: author.github != null ? author.github : undefined,
			profileImage: author.profileImage != null ? author.profileImage : undefined,
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
			email: true,
			id: true
		}
	});
}
