import PrismaClient from "@prisma/client";

const prisma = new PrismaClient.PrismaClient();

export async function getComments(options) {
    const { postId, id, page, size } = options;

    if (id) {
        return await prisma.comment.findUnique({
            where: {
                id: id
            }
        });
    }

    if (page && size) {
        return await prisma.comment.findMany({
            where: {
                postId: postId,
            },
            skip: size * (page - 1),
            take: size,
            include: {
                author: {
                    select: {
                        displayName: true,
                        github: true,
                        profileImage: true
                    }
                }
            },
            orderBy: {
                published: 'desc'
            }
        });
    }

    return await prisma.comment.findMany({
        where: {
            postId: postId
        },
        include: {
            author: {
                select: {
                    displayName: true,
                    github: true,
                    profileImage: true
                }
            }
        },
        orderBy: {
            published: 'desc'
        }
    });
}

export async function newComment(comment) {
    return await prisma.comment.create({
        data: {
            id: comment.id,
            authorId: comment.authorId,
            postId: comment.postId,
            contentType: comment.contentType,
            comment: comment.comment,
            published: new Date(comment.published),
        },
    });

}