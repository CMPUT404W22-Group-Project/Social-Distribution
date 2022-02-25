import { commentService } from "../services/index.service.js";

export async function httpGetAllComments(req, res){
    console.log(req.params.postid);
    const comments = await commentService.getComments({postid: parseInt(req.params.postid), page: parseInt(req.query.page), size: parseInt(req.query.size) });
    const host = `${req.protocol}://${req.get('host')}`;

    comments.forEach(comment => {
        comment.type = "comment";
        comment.url = `${host}/authors/${post.authorId}/posts/${post.id}/comments/${comment.id}`;
        comment.id = `${host}/authors/${post.authorId}/posts/${post.id}/comments/${comment.id}`;
        comment.host = `${host}/`;
        if (!comment.post.id){
            error:"404 not found"
        }
    });

    const response = {
        "type": "comments",
        "items": comments
    };
    return res.status(200).json(response);
}
