import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import LikeItem from '../components/LikeItem';
import { useLocation } from 'react-router-dom';

const RemoteLikes = () => {
    const [likes, setLikes] = useState([]);
    let location = useLocation();
    const node = location.state.node;
    const object = location.state.object;
    const url = object.split('/authors/')[1];
    const getLikes = useCallback(async (node, url) => {
        try {
            const response = await axios.get(`/remote/authors/${url}likes`, {
                params: { node: node },
            });
            setLikes(response.data.items);
        } catch (error) {
            console.error(error);
        }
    }, []);
    useEffect(() => {
        getLikes(node, url);
    }, [node, url, getLikes]);

    return (
        <>
            {likes?.map((like, i) => {
                return like !== undefined ? (
                    <LikeItem key={i} props={like} />
                ) : null;
            })}
        </>
    );
};

export default RemoteLikes;
