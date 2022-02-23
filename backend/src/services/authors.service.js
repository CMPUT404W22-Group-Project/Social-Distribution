import PrismaClient from "@prisma/client";

const prisma = new PrismaClient.PrismaClient();

export async function getAuthors(options) {
    const { id, page, size } = options;

    if (id) {
        return await prisma.author.findUnique({
            where: {
                id: id
            }
        });
    }

    if (page && size) {
        return await prisma.author.findMany({
            skip: size * (page - 1),
            take: size
        });
    }

    return await prisma.author.findMany();
}