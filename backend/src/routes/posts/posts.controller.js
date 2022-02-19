const {getAllPostByAuthor} = require('../../models/posts.model')

async function httpGetAllPost(req,res){
   const posts = await getAllPostByAuthor();
   return res.status(200).json(posts)
}

module.exports = {
    httpGetAllPost
}