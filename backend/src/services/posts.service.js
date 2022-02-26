import PrismaClient from "@prisma/client";

const prisma = new PrismaClient.PrismaClient();

export async function getPosts(options){
    const {authorid, id, page, size} = options;

    if (id){
        return await prisma.post.findUnique({
            where:{
                id:id
            }
        });
    }

    if (page&&size){
        return await prisma.post.findMany({
          where:{
            authorId: authorid,
            skip: size * (page - 1),
            take: size
          }
        });
    }

    return await prisma.post.findMany();
}

export async function postPost(post){
    return await prisma.post.create({
        data: {
          author: post.author,
          authorId: post.authorId,
          title: post.title,
          source: post.source,
          origin: post.origin,
          description: post.description,
          contentType: post.contentType,
          content: post.content,
          categories: post.categories,
          count: post.count,
          published: post.published,
          visibility: post.visibility,
          unlisted: post.unlisted,
          likeCount: post.likeCount,
          
        },
      });
    
}

export async function updatePost(post){
    const updateUser = await prisma.post.update({
        where: {
          id: post.id,
        },
        data: {
          author: post.author,
          authorId: post.authorId,
          title: post.title,
          source: post.source,
          origin: post.origin,
          description: post.description,
          contentType: post.contentType,
          content: post.content,
          categories: post.categories,
          count: post.count,
          published: post.published,
          visibility: post.visibility,
          unlisted: post.unlisted,
          likeCount: post.likeCount,
        },
      });
}

export async function deletePost(id){
  return await prisma.post.delete({
    where: {
      id: id,
    },
  });
}

