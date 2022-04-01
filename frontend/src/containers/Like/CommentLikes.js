import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import LikeItem from '../../components/LikeItem';

const CommentLikes = () => {
    let { authorId, postId, commentId } = useParams();
    const [likes, setLikes] = useState([]);
    const getLikes = useCallback((authorId, postId, commentId) => {
        axios
            .get(
                `/authors/${authorId}/posts/${postId}/comments/${commentId}/likes`,
                {
                    withCredentials: true,
                }
            )
            .then((response) => {
                setLikes([...response.data.items]);
            });
    }, []);

    useEffect(() => {
        getLikes(authorId, postId, commentId);
    }, [getLikes, authorId, postId, commentId]);

    return likes?.map((like, i) => {
        return <LikeItem key={i} props={like} />;
    });
};

export default CommentLikes;
