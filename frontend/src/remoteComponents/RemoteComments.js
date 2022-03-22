import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Pagination from '@mui/material/Pagination';
import List from '@mui/material/List';

import RemoteComment from './RemoteComment';

const RemoteComments = ({ props }) => {
    RemoteComments.propTypes = {
        props: PropTypes.object,
        comments: PropTypes.string,
    };
    const size = 5;
    const [page, setPage] = useState(1);
    const [comments, setComments] = useState(props.comments);
    //use useEffect to fetch comments upon page change

    const getComments = (page, size) => {
        axios.get(`${props}?page=${page}&size=${size}`).then((response) => {
            response.status === 200
                ? setComments(response.data.comments)
                : null;
        });
    };
    useEffect(() => {
        getComments(props.comments, page, size);
    }, [page]);
    const handlePageChange = (event, value) => {
        setPage(value);
    };
    //for dialog for posting comment
    return (
        <div>
            <List sx={{ broder: 1, margin: 2, broderColor: 'black' }}>
                {comments?.map((comment, i) => {
                    return comment ? (
                        <RemoteComment key={i} props={comment} />
                    ) : null;
                })}
            </List>
            <Pagination
                count={10}
                page={page}
                color="primary"
                onChange={handlePageChange}
            />
        </div>
    );
};

export default RemoteComments;
