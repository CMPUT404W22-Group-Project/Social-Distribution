import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

import RemotePost from './RemotePost';

const RemotePosts = () => {
    const [posts, setPosts] = useState([]);
    let location = useLocation();
    const postLink = location.state.postLink;

    const getPosts = (postLink) => {
        axios
            .get(`${postLink}`)
            .then((response) => {
                response.status === 200
                    ? setPosts([...response.data.items])
                    : null;
            })
            .catch((error) => {
                console.log(error);
            });
    };
    useEffect(() => {
        getPosts(postLink);
    }, []);
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
