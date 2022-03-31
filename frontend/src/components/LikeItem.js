import React from 'react';
import PropTypes from 'prop-types';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import ProfilePictureCard from './ProfilePictureCard';
const LikeItem = ({ props }) => {
    LikeItem.propTypes = {
        props: PropTypes.object,
        summary: PropTypes.string,
        object: PropTypes.string,
        author: PropTypes.object,
        postId: PropTypes.string,
        commentId: PropTypes.string,
    };
    return (
        <ListItem alignItems="flex-start">
            <ListItemAvatar>
                <ProfilePictureCard props={props.author} />
            </ListItemAvatar>
            <ListItemText
                primary={props.author.displayName}
                secondary={
                    <>
                        <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                        >
                            <Link href={props.object} underline="hover">
                                {props.summary}
                            </Link>
                        </Typography>
                    </>
                }
            />
        </ListItem>
    );
};

export default LikeItem;
