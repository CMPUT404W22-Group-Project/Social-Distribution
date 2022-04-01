import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import LikeItem from '../../components/LikeItem';

const PostLikes = () => {
    let { authorId, postId } = useParams();
    const [likes, setLikes] = useState([]);
    const getLikes = useCallback((authorId, postId) => {
        axios
            .get(`/authors/${authorId}/posts/${postId}/likes`, {
                withCredentials: true,
            })
            .then((response) => {
                setLikes([...response.data.items]);
            });
    }, []);

    useEffect(() => {
        getLikes(authorId, postId);
    }, [getLikes, authorId, postId]);

    return likes?.map((like, i) => {
        return <LikeItem key={i} props={like} />;
    });
};

export default PostLikes;
