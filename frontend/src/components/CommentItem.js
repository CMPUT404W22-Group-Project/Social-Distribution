import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import ListItem from '@mui/material/ListItem';
import ReactMarkdown from 'react-markdown';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';

import ProfilePictureCard from './ProfilePictureCard';

const CommentItem = ({ props }) => {
    CommentItem.propTypes = {
        props: PropTypes.object,
        author: PropTypes.object,
        published: PropTypes.string,
        comment: PropTypes.string,
        contentType: PropTypes.string,
    };
    const publishedDate = moment(props.published).format(
        'MMMM Do YYYY, h:mm:ss a'
    );

    const renderContent = () => {
        switch (props.contentType) {
            case 'text/plain':
                return (
                    <Typography variant="body1" color="text.secondary">
                        {props.comment}
                    </Typography>
                );
            case 'text/markdown':
                return <ReactMarkdown>{props.comment}</ReactMarkdown>;
        }
    };

    return (
        <ListItem>
            <Card>
                <CardHeader
                    avatar={<ProfilePictureCard props={props.author} />}
                    title={renderContent()}
                    subheader={`Published:${publishedDate}`}
                />
                <CardActions disableSpacing>
                    <IconButton aria-label="add to favorites">
                        <FavoriteIcon />
                    </IconButton>
                </CardActions>
            </Card>
        </ListItem>
    );
};

export default CommentItem;
