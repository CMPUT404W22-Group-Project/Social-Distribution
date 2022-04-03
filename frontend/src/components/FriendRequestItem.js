import React, { useState } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import Button from '@mui/material/Button';
import axios from 'axios';
import PropTypes from 'prop-types';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
const FriendRequestItem = ({ props }) => {
    FriendRequestItem.propTypes = {
        props: PropTypes.object,
        auth: PropTypes.object,
        src: PropTypes.string,
        type: PropTypes.string,
        message: PropTypes.string,
        owner: PropTypes.string,
        accept: PropTypes.bool,
        node: PropTypes.string,
        dateTime: PropTypes.string,
    };
    console.log(props);
    const [disableAccept, setDisableAccept] = useState(props.accept);
    const receiveDate = moment(props.dateTime).format(
        'MMMM Do YYYY, h:mm:ss a'
    );
    const handleAccept = (src, node) => {
        const foreignAuthorId = src.includes('/')
            ? src.split('/authors/')[1].split('/')[0]
            : src;
        console.log(foreignAuthorId);
        axios.put(
            `/authors/${props.auth.author.id}/followers/${foreignAuthorId}`,
            { node: node },
            {
                withCredentials: true,
            }
        );
    };
    console.log(disableAccept);
    return (
        <ListItem
            sx={{ my: 1, ml: 1 }}
            secondaryAction={
                <Button
                    variant="contained"
                    disabled={disableAccept}
                    onClick={() => {
                        setDisableAccept(true);
                        const node = props.node ? props.node : null;
                        handleAccept(props.src, node);
                    }}
                >
                    Accept
                </Button>
            }
        >
            <ListItemText
                primary={`${props.message}`}
                secondary={`${receiveDate}`}
            />
        </ListItem>
    );
};

const mapStateToProps = (state, ownProps) => ({
    props: { ...ownProps.props, auth: state.auth },
});

export default connect(mapStateToProps)(FriendRequestItem);
