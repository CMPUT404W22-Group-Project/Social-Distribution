import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

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

    return <div>Inbox</div>;
};

const mapStateToProps = (state, ownProps) => ({
    props: { ...ownProps.props, auth: state.auth },
});

export default connect(mapStateToProps)(Inbox);
