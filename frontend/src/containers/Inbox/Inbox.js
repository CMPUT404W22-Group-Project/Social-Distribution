import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import List from '@mui/material/List';
import Button from '@mui/material/Button';
import InboxItem from '../../components/InboxItem';

const Inbox = ({ props }) => {
    Inbox.propTypes = {
        props: PropTypes.object,
        auth: PropTypes.object,
    };
    const authorId = props ? props.auth.author.id : null;
    const [inbox, setInbox] = useState([]);
    const getLikes = useCallback((authorId) => {
        axios
            .get(`/authors/${authorId}/inbox`, {
                withCredentials: true,
            })
            .then((response) => {
                setInbox([...response.data.items]);
            });
    }, []);

    useEffect(() => {
        getLikes(authorId);
    }, [getLikes, authorId]);

    return (
        <>
            <Button
                sx={{
                    minWidth: 100,
                    my: 5,
                    left: '80%',
                    position: 'relative',
                }}
                variant="contained"
                onClick={() => {
                    null;
                }}
            >
                Clear
            </Button>
            <List
                sx={{
                    maxWidth: 4 / 5,
                    mt: 10,
                }}
            >
                {inbox?.map((item, i) => {
                    return <InboxItem key={i} props={item} />;
                })}
            </List>
        </>
    );
};

const mapStateToProps = (state, ownProps) => ({
    props: { ...ownProps.props, auth: state.auth },
});

export default connect(mapStateToProps)(Inbox);
