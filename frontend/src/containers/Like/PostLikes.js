import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import LikeItem from '../../components/LikeItem';

const BACKEND_URL = 'http://localhost:8000'; //process.env.REACT_APP_BACKEND_URL

const PostLikes = () => {
    let { authorId, postId } = useParams();
    const [likes, setLikes] = useState([]);
    const getLikes = useCallback((postId) => {
        axios
            .get(`${BACKEND_URL}/authors/${authorId}/posts/${postId}/likes`,
            { withCredentials: true })
            .then((response) => {
                setLikes([...response.data.items]);
            });
    }, [authorId]);

    useEffect(() => {
        getLikes(postId);
    }, [getLikes, postId]);
    
    return likes?.map((like, i) => {
        return <LikeItem key={i} props={like} />;
    });
};

export default PostLikes;
