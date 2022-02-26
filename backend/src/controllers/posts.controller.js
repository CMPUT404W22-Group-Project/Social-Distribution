import { postService, authorService } from "../services/index.service.js";

export async function httpGetAllPosts(req, res) {
    const posts = await postService.getPosts({ authorid: parseInt(req.params.authorid), page: parseInt(req.query.page), size: parseInt(req.query.size) });
    const host = `${req.protocol}://${req.get('host')}`;

    posts.forEach(post => {
        post.type = "post";
        post.url = `${host}/authors/${post.authorId}/posts/${post.id}`;
        post.id = `${host}/authors/${post.authorId}/posts/${post.id}`;
        post.host = `${host}/`;
    });

    const response = {
        "type": "posts",
        "items": posts
    };

    return res.status(200).json(response);
}

export async function httpGetOnePost(req, res) {
    const post = await postService.getPosts({ id: req.params.id });
    const host = `${req.protocol}://${req.get('host')}`;
    
    if (!post) {
        return res.status(404).json({ error: "Not Found" });
    }
    
    const author = await authorService.getAuthors({ id: post.authorId });
    post.url = `${host}/authors/${post.authorId}/posts/${post.id}`;
    post.id = `${host}/authors/${post.authorId}/posts/${post.id}`;
    post.host = `${host}/`;

    const response = {
        "type": "post",
        ...post,
        author
    };

    return res.status(200).json(response);
}

export async function httpPutPost(req, res) {
    const post = req.body;
    if (
        !post.author ||
        !post.authorId ||
        !post.title ||
        !post.content ||
        !post.visibility
    ) {
        return res.status(400).json({
            error: 'Missing required property',
        });
    }

    const newPost = await postService.postPost(post);
    return res.status(201).json(newPost);
}

export async function httpDeletePost(req, res) {
    const id = req.body.id;
    if (!id) {
        return res.status(400).json({
            error: 'Missing required property',
        });
    }
    const deletedPost = await postService.deletePost(id);
    return res.status(204).json(deletedPost);
}

export async function httpUpdatePost(req, res) {
    const post = req.body;
    if (
        !post.author ||
        !post.authorId ||
        !post.title ||
        !post.content ||
        !post.visibility
    ) {
        return res.status(400).json({
            error: 'Missing required property',
        });
    }
    const newPost = await postService.updatePost(post);
    return res.status(201).json(newPost);
}