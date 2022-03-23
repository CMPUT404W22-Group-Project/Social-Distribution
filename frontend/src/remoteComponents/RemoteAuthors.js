import React, { useState, useEffect } from 'react';

import Grid from '@mui/material/Grid';
import RemoteProfile from './RemoteProfile';
import axios from 'axios';

const RemoteAuthors = () => {
    //placeholder, get nodes when admin is done
    // const nodes = [
    //     'http://localhost:8000',
    //     // 'https://project-socialdistribution.herokuapp.com/api',
    // ];
    let temp = [];
    const [authors, setAuthors] = useState([]);
    const [nodes, setNodes] = useState([
        'https://project-socialdistribution.herokuapp.com/api',
        'http://localhost:8000',
    ]);
    const getAuthors = async (node) => {
        const response = await axios.get(`${node}/authors/`);
        temp = [...temp, ...response.data.items];
        setAuthors([...temp]);
    };

    useEffect(() => {
        setNodes([
            'https://project-socialdistribution.herokuapp.com/api',
            'http://localhost:8000',
            'http://localhost:8000',
        ]);
        nodes.forEach(async function (node) {
            await getAuthors(node);
        });
    }, []);

    return (
        <Grid container spacing={2}>
            {authors.map((author, index) => {
                return (
                    <Grid key={index} item xs={1} sx={{ mx: 1, my: 1 }}>
                        <RemoteProfile props={author} />
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default RemoteAuthors;
