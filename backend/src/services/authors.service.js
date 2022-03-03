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

/**
 * post a author to database, if it already
 * exist, then update it.
 * @param {author} author 
 * @returns 
 */
export async function newAuthor(author){
    return await prisma.author.upsert({
        where:{
            id:author.id,
        },
        update:{
            displayName:author.displayName,
            github:author.github,
            profileImage:author.profileImage,
            Post:author.Post,
            Comment:author.Comment,
            Likes:author.Comment
        },
        create:{
            id:author.id,
            displayName:author.displayName,
            github:author.github,
            profileImage:author.profileImage,
            Post:author.Post,
            Comment:author.Comment,
            Likes:author.Comment
        }
    })
}