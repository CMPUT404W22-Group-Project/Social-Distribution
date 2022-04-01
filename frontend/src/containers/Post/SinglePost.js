import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import PostItem from '../../components/PostItem';

const SinglePost = () => {
    let { authorId, postId } = useParams();
    const [post, setPost] = useState({});

    useEffect(() => {
        document.title = post.title;
    }, [post]);

    const getPost = useCallback((authorId, postId) => {
        axios
            .get(`/authors/${authorId}/posts/${postId}`, {
                withCredentials: true,
            })
            .then((response) => {
                response.status === 200 ? setPost(response.data) : null;
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);
    useEffect(() => {
        getPost(authorId, postId);
    }, [getPost, authorId, postId]);
    return post.id ? <PostItem props={post} /> : null;
};

export default SinglePost;
