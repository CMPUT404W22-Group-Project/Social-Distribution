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

export async function putPost(req, res){
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
    //post.published = current date
    //post.count = post.content.length
    const newPost = await postService.postPost(post);
    return res.status(201).json(newPost);
}

//export async function update(req, res){

//}