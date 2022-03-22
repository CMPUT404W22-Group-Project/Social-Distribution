import prisma from '../../prisma/client.js';
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

/**
 * Get inbox items
 * @param {Options} options 
 * @returns Inbox items
 * 
 * TODO: Get posts, comments, likes, and follows from the inbox items
 */
export async function getInbox(options) {
    const { id, page, size } = options;
    if (id && page && size) {
        return await prisma.inbox.findMany({
            where: {
                authorId: id,
            },
            skip: size * (page - 1),
            take: size,
            orderBy: {
                dateTime: 'desc'
            }
        });
        // console.log(inbox);

    }
}

/**
 * Clear the inbox for a user
 * @param {String} id Author id
 * @returns 
 */
export async function clearInbox(id) {
    return await prisma.inbox.deleteMany({
        where: {
            authorId: id,
        },
    });
}