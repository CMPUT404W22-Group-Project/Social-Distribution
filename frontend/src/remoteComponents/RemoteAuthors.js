import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { getNodes } from '../actions/index';
import Grid from '@mui/material/Grid';
import RemoteProfile from './RemoteProfile';
import axios from 'axios';
const RemoteAuthors = () => {
    useEffect(() => {
        document.title = 'Authors';
    }, []);

    //placeholder, get nodes when admin is done
    // const nodes = [
    //     ,
    //     // 'https://project-socialdistribution.herokuapp.com/api',
    // ];
    const [authors, setAuthors] = useState([]);

    const getAuthors = useCallback(async () => {
        // const token = btoa(`${node.username}:${node.password}`);
        // const config = {
        //     headers: {
        //         Authorization: `Basic ${token}`,
        //         'Access-Control-Allow-Origin': 'http://localhost:3000',
        //         'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE',
        //         'Access-Control-Allow-Headers':
        //             'Access-Control-Allow-Headers, Origin,Accept, Content-Type, ',
        //     },
        // };
        //
        const remoteResponse = await axios.get(`/remote/authors`);
        const localResponse = await axios.get(`/authors`);
        let temp = [
            ...temp,
            ...remoteResponse.data.items,
            ...localResponse.data.items,
        ];
        setAuthors([...temp]);
    }, []);

    useEffect(() => {
        getAuthors();
    }, [getAuthors]);

    return (
        <Grid container spacing={2}>
            {authors?.map((author, index) => {
                return author ? (
                    <Grid key={index} item xs={1} sx={{ mx: 1, my: 1 }}>
                        <RemoteProfile props={author} />
                    </Grid>
                ) : null;
            })}
        </Grid>
    );
};
const mapStateToProps = (state) => ({
    nodes: state.node.nodes,
});
export default connect(mapStateToProps, { getNodes })(RemoteAuthors);
