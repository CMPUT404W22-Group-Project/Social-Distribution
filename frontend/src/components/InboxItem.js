import React, { useState } from 'react';
import Button from '@mui/material/Button';
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
// const mockInbox = {
//     src: 'id',
//     type: 'Like/Follow/comment/post',
//     message: 'This is a comment',
//     owner: 'cuserId',
//     //only for follow
//     accept: false || true.valueOf,
//     node: 'url',
// };
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
    };
    const [disableAccept, setDisableAccept] = useState(props.accept);

    const handleAccept = (src, node) => {
        const foreignAuthorId = src.split('/authors/')[1].split('/')[0];
        axios.put(
            `/authors/${props.auth.author.id}/followers/${foreignAuthorId}`,
            { node: node },
            {
                withCredentials: true,
            }
        );
    };

    const renderFollowItem = () => {
        <ListItem
            sx={{ my: 1 }}
            secondaryAction={
                <Button
                    variant="contained"
                    disabled={disableAccept ? disableAccept : null}
                    onClick={() => {
                        setDisableAccept(true);
                        handleAccept(props.src, props.node);
                    }}
                >
                    Accept
                </Button>
            }
        >
            <ListItemText primary={`${props.message}`} />
        </ListItem>;
    };

    return props.type === 'Follow' ? (
        renderFollowItem()
    ) : (
        <ListItem sx={{ my: 1 }}>
            <ListItemButton>
                <ListItemText primary={`${props.message}`} />
            </ListItemButton>
        </ListItem>
    );
};

const mapStateToProps = (state, ownProps) => ({
    props: { ...ownProps.props, auth: state.auth },
});

export default connect(mapStateToProps)(InboxItem);
