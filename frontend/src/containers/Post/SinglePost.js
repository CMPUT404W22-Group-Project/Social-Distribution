import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import PostItem from '../../components/PostItem';

const BACKEND_URL = 'http://localhost:8000'; //process.env.REACT_APP_BACKEND_URL

const SinglePost = () => {
    let { authorId, postId } = useParams();
    const [post, setPost] = useState({});

    useEffect(() => {
        document.title = post.title;
    }, [post]);
    
    const getPost = useCallback(() => {
        axios
            .get(`${BACKEND_URL}/authors/${authorId}/posts/${postId}`, 
            { withCredentials: true })
            .then((response) => {
                response.status === 200 ? setPost({ ...response.data }) : null;
            })
            .catch((error) => {
                console.log(error);
            });
    }, [authorId, postId]);
    useEffect(() => {
        getPost();
    }, [getPost]);
    return post ? <PostItem props={post} /> : null;
};

export default SinglePost;
