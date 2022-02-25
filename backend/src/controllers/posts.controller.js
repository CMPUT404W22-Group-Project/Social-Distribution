import { postService } from "../services/index.service.js";

export async function httpGetAllPosts(req, res) {
    console.log(req.params.authorid);
    const posts = await postService.getPosts({authorid: parseInt(req.params.authorid), page: parseInt(req.query.page), size: parseInt(req.query.size)})
    const host = `${req.protocol}://${req.get('host')}`;

    posts.forEach(post => {
        post.type = "post";
        post.url = `${host}/authors/${post.authorId}/posts/${post.id}`;
        post.id = `${host}/authors/${post.authorId}/posts/${post.id}`;
        post.host = `${host}/`;
        if (!post.author.id){
            error:"404 not found"
        }
    });


    const response = {
        "type": "posts",
        "items": posts
    };
    return res.status(200).json(response);
}

export async function httpGetOnePost(req, res) {
    console.log(req.params.id)
    const post = await postService.getPosts({ id: req.params.id });

    const host = `${req.protocol}://${req.get('host')}`;

    post.url = `${host}/authors/${post.authorId}/posts/${post.id}`;
    post.id = `${host}/authors/${post.authorId}/posts/${post.id}`;
    post.host = `${host}/`;


    if (!post.author.id){
        error:"404 not found"
    }
    const response = {
        "type": "post",
        post
    };
    return res.status(200).json(response);
}

export async function httpPutPost(req, res){
    const post =req.body;
    if (
        !post.author ||
        !post.authorId ||
        !post.title ||
        !post.content ||
        !post.visibility
    ){
        return res.status(400).json({
            error: 'Missing required property',
          });
    }
    
    const newPost = await postService.postPost(post);
    return res.status(201).json(newPost);
}

export async function httpDeletePost(req, res){
    id = req.id;
    if (!id){
        return res.status(400).json({
            error: 'Missing required property',
          });
    }
    const deletedPost = await postService.deletePost(id);
    return res.status(204).json(deletePost);
}

export async function httpUpdatePost(req, res){
    post =req.body;
    if (
        !post.author ||
        !post.authorId ||
        !post.title ||
        !post.content ||
        !post.visibility
    ){
        return res.status(400).json({
            error: 'Missing required property',
          });
    }
    const newPost = await postService.updatePost(post);
    return res.status(201).json(newPost);
}