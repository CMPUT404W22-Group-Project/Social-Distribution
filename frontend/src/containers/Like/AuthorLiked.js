import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import LikeItem from '../../components/LikeItem';

const AuthorLiked = () => {
    let { authorId } = useParams();
    const [likes, setLikes] = useState([]);
    const getLikes = useCallback((authorId) => {
        axios
            .get(`/authors/${authorId}/liked`, {
                withCredentials: true,
            })
            .then((response) => {
                setLikes([...response.data.items]);
            });
    }, []);

    useEffect(() => {
        getLikes(authorId);
    }, [getLikes, authorId]);

    return likes?.map((like, i) => {
        return <LikeItem key={i} props={like} />;
    });
};

export default AuthorLiked;
