import PrismaClient from "@prisma/client";

const prisma = new PrismaClient.PrismaClient();

/**
 * Get posts with given options
 * @param {*} options 
 * @returns Posts
 */
export async function getPosts(options) {
    const { authorId, id, page, size } = options;

    if (id) {
        return await prisma.post.findUnique({
            where: {
                id: id
            }
        });
    }

    if (page && size) {
        return await prisma.post.findMany({
            where: {
                authorId: authorId,
            },
            skip: size * (page - 1),
            take: size
        });
    }

    return await prisma.post.findMany();
}

/**
 * Create a new post with a generated ID
 * @param {Post object} post 
 * @returns 
 */
export async function newPost(post) {
    return await prisma.post.create({
        data: {
            id: post.id,
            authorId: post.authorId,
            title: post.title,
            source: post.source,
            origin: post.origin,
            description: post.description,
            contentType: post.contentType,
            content: post.content,
            categories: post.categories,
            count: 0,
            published: new Date(post.published),
            visibility: post.visibility,
            unlisted: post.unlisted,
            likeCount: 0,
        }
    });
}

/**
 * Create an new post with a specified ID
 * @param {Post object} post 
 * @returns 
 */
export async function putPost(post) {
    return await prisma.post.create({
        data: {
            id: post.id,
            authorId: post.authorId,
            title: post.title,
            source: post.source,
            origin: post.origin,
            description: post.description,
            contentType: post.contentType,
            content: post.content,
            categories: post.categories,
            count: 0,
            published: new Date(post.published),
            visibility: post.visibility,
            unlisted: post.unlisted,
            likeCount: 0,
        },
    });

}

/**
 * Update a post
 * @param {Post object} post 
 * @returns 
 */
export async function updatePost(post) {
    return await prisma.post.update({
        where: {
            id: post.id,
        },
        data: {
            authorId: post.authorId,
            title: post.title,
            source: post.source,
            origin: post.origin,
            description: post.description,
            contentType: post.contentType,
            content: post.content,
            categories: post.categories,
            published: new Date(post.published),
            visibility: post.visibility,
            unlisted: post.unlisted,
        },
    });
}

/**
 * Delete a post by id
 * @param {String} id 
 * @returns 
 */
export async function deletePost(id) {
    return await prisma.post.delete({
        where: {
            id: id,
        },
    });
}

