import PrismaClient from "@prisma/client";

const prisma = new PrismaClient.PrismaClient();

export async function getComments(options){
    const {postid, id, page, size} = options;

    if (id){
        return await prisma.comment.findUnique({
            where:{
                id:id
            }
        });
    }

    if (page && size){
        return await prisma.comment.findMany({
          where:{
            postid: postid,
            skip: size * (page - 1),
            take: size
          }
        });
    }

    return await prisma.comment.findMany();
}

export async function postComment(comment){
    return await prisma.comment.create({
        data: {
          author: comment.author,
          authorId: comment.authorId,
          post:comment.post,
          postId:comment.postId,
          contentType: comment.contentType,
          comment: comment.comment,
          published: comment.published,
        },
      })
    
}