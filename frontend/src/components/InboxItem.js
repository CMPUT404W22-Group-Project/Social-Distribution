import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import FriendRequestItem from './FriendRequestItem';

const InboxItem = ({ props }) => {
    InboxItem.propTypes = {
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
    const receiveDate = moment(props.dateTime).format(
        'MMMM Do YYYY, h:mm:ss a'
    );

    return props.type === 'Follow' ? (
        <FriendRequestItem props={props} />
    ) : (
        <ListItem sx={{ my: 1, ml: 1 }}>
            <ListItemText
                primary={`${props.message}`}
                secondary={`${receiveDate}`}
            />
        </ListItem>
    );
};

export default InboxItem;
