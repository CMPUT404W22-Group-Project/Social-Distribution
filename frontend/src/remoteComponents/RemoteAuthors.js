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
    const [authors, setAuthors] = useState([]);

    const getAuthors = async (node) => {
        const response = await axios.get(`${node}/authors`);
        response.status === 200
            ? setAuthors([...authors, ...response.data.items])
            : null;
    };
    useEffect(() => {
        const nodes = [
            'http://localhost:8000',
            // 'https://project-socialdistribution.herokuapp.com/api',
        ];
        // for (const node of nodes) {
        //     getAuthors(node);
        // }
        nodes.forEach(async (node) => {
            getAuthors(node);
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
