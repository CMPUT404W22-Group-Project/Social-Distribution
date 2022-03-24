import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import PostItem from '../../components/PostItem';

const BACKEND_URL = 'https://www.socialdisturbutionnetworks.ca'; //process.env.REACT_APP_BACKEND_URL

const SinglePost = () => {
    let { authorId, postId } = useParams();
    const [post, setPost] = useState({});
    const getPost = () => {
        axios
            .get(`${BACKEND_URL}/authors/${authorId}/posts/${postId}`)
            .then((response) => {
                response.status === 200 ? setPost({ ...response.data }) : null;
            })
            .catch((error) => {
                console.log(error);
            });
    };
    useEffect(() => {
        getPost();
    }, []);
    return post ? <PostItem props={post} /> : null;
};

export default SinglePost;
