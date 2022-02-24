import PrismaClient from "@prisma/client";

const prisma = new PrismaClient.PrismaClient();

export async function getPosts(options){
    const {id, page, size} = options;

    if (id){
        return await prisma.post.findUnique({
            where:{
                id:id
            }
        });
    }

    if (page&&size){
        return await prisma.post.findMany({
            skip: size * (page - 1),
            take: size
        });
    }

    return await prisma.post.findMany();
}

export async function postPost(options){
    const post = await prisma.post.create({
        data: {
        
          author: options.author,
          authorId: options.authorId,
          title: options.title,
          source: options.source,
          origin: options.origin,
          description: options.description,
          contentType: options.contentType,
          content: options.content,
          image: options.image,
          categories: options.categories,
          count: options.count,
          published: options.published,
          visibility: options.visibility,
          unlisted: options.unlisted,
          likeCount: options.likeCount,
          Comment: options.comment,
          Likes: options.Likes

        },
      })
}

export async function updatePost(options){
    const updateUser = await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          name: 'Viola the Magnificent',
        },
      })
}