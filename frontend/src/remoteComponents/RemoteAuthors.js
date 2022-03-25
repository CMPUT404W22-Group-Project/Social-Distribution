import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getNodes } from '../actions/index';
import Grid from '@mui/material/Grid';
import RemoteProfile from './RemoteProfile';
import axios from 'axios';

const RemoteAuthors = (props) => {
    RemoteAuthors.propTypes = {
        props: PropTypes.object,
        getNodes: PropTypes.func,
        nodes: PropTypes.arrayOf(PropTypes.object),
    };
    //placeholder, get nodes when admin is done
    // const nodes = [
    //     'http://localhost:8000',
    //     // 'https://project-socialdistribution.herokuapp.com/api',
    // ];
    let temp = [];
    const [authors, setAuthors] = useState([]);

    const getAuthors = async (node) => {
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
        const response = await axios.get(`${node.url}/authors/`, {
            auth: {
                username: node.username,
                password: node.password,
            },
        });
        temp = [...temp, ...response.data.items];
        setAuthors([...temp]);
    };

    useEffect(() => {
        props.getNodes();
    }, []);
    useEffect(() => {
        if (props.nodes) {
            props.nodes.forEach(async function (node) {
                await getAuthors(node);
            });
        }
    }, [props.nodes]);

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
const mapStateToProps = (state) => ({
    nodes: state.node.nodes,
});
export default connect(mapStateToProps, { getNodes })(RemoteAuthors);
