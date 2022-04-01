import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
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
    let navigate = useNavigate();
    CommentItem.propTypes = {
        props: PropTypes.object,
        id: PropTypes.string,
        likeCount: PropTypes.number,
        author: PropTypes.object,
        published: PropTypes.string,
        comment: PropTypes.string,
        contentType: PropTypes.string,
        auth: PropTypes.object,
    };
    //likeCount
    const [likeCount, setLikeCount] = useState(props.likeCount);
    console.log(props);
    const authorId = props
        ? props.id.split('/authors/')[1].split('/')[0]
        : null;
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
    //like Comment
    const [disableLiked, setDisableLiked] = useState(false);
    const likeComment = (authorId) => {
        const likeObject = {
            '@context': 'https://www.w3.org/ns/activitystreams',
            type: 'Like',
            author: props.auth.author,
            object: props.id,
            summary: `${props.auth.author.displayName} Likes your Comment`,
        };
        axios
            .post(`/authors/${authorId}/inbox`, likeObject, {
                withCredentials: true,
            })
            .then((response) => {
                response.status === 201 ? setLikeCount(likeCount + 1) : null;
            });
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
                    <IconButton
                        aria-label="like this post"
                        onClick={() => {
                            setDisableLiked(true);
                            likeComment(authorId);
                        }}
                        disabled={disableLiked ? true : null}
                    >
                        <FavoriteIcon />
                    </IconButton>
                    <Typography
                        onClick={() => {
                            navigate(`${props.id}likes`);
                        }}
                    >
                        {props.likeCount}
                    </Typography>
                </CardActions>
            </Card>
        </ListItem>
    );
};

const mapStateToProps = (state, ownProps) => ({
    props: { ...ownProps.props, auth: state.auth },
});

export default connect(mapStateToProps)(CommentItem);
