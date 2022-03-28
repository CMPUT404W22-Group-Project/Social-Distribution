import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

import RemotePost from './RemotePost';

const RemotePosts = () => {
    const [posts, setPosts] = useState([]);
    let location = useLocation();
    const node = location.state.postLink;
    const authorId = location.state.authorId;
    const getPosts = useCallback(async (node, authorId) => {
        try {
            const response = axios.get(`/remote/authors/${authorId}`, {
                params: { node: node },
            });
            setPosts(response.data.items);
        } catch (error) {
            console.error(error);
        }
    }, []);
    useEffect(() => {
        getPosts(node, authorId);
    }, [node, authorId, getPosts]);
    return (
        <>
            {posts?.map((post, i) => {
                return post !== undefined ? (
                    <RemotePost key={i} props={post} />
                ) : null;
            })}
        </>
    );
};

export default RemotePosts;
