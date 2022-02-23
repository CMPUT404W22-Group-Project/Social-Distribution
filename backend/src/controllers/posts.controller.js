import getAllPostByAuthor from '../models/posts.model.js';

export async function httpGetAllPost(req, res) {
    const posts = await getAllPostByAuthor();
    return res.status(200).json(posts);
}