import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import LikeItem from '../../components/LikeItem';

const BACKEND_URL = 'http://localhost:8000'; //process.env.REACT_APP_BACKEND_URL

const PostLikes = () => {
    let { authorId, postId } = useParams();
    const [likes, setLikes] = useState([]);
    useEffect(() => {
        getLikes(postId);
    }, []);
    const getLikes = (postId) => {
        axios
            .get(`${BACKEND_URL}/authors/${authorId}/posts/${postId}/likes`)
            .then((response) => {
                setLikes([...response.data.items]);
            });
    };
    return likes?.map((like, i) => {
        return <LikeItem key={i} props={like} />;
    });
};

export default PostLikes;
