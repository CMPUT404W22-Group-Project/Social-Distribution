import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

import RemotePost from './RemotePost';

const RemotePosts = () => {
    const [posts, setPosts] = useState([]);
    let location = useLocation();
    const node = location.state.node;
    const authorId = location.state.authorId;
    const getPosts = useCallback(async (node, authorId) => {
        try {
            const response = await axios.get(
                `/remote/authors/${authorId}/posts`,
                {
                    params: { node: node },
                }
            );
            console.log(response);
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
