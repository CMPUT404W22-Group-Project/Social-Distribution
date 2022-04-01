import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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

import RemoteProfile from './RemoteProfile';

const RemoteComment = ({ props }) => {
    let navigate = useNavigate();
    RemoteComment.propTypes = {
        props: PropTypes.object,
        id: PropTypes.string,
        author: PropTypes.object,
        published: PropTypes.string,
        comment: PropTypes.string,
        contentType: PropTypes.string,
        likeCount: PropTypes.number,
        auth: PropTypes.object,
    };
    const publishedDate = moment(props.published).format(
        'MMMM Do YYYY, h:mm:ss a'
    );
    const url = props.id.endsWith('/') ? props.id : `${props.id}/`;
    const node = props.id.split('/authors/')[0];
    const [likeCount, setLikeCount] = useState(
        props.likeCount ? props.likeCount : 0
    );

    const likeComment = (inbox, author) => {
        author.id = author.url;
        const authorId = inbox.split('/authors/')[1].split('/')[0];
        const node = node.split('/authors/')[0];
        axios
            .post(`remote/author/${authorId}/inbox`, {
                node: node,
                type: 'Like',
                author: author,
                object: url,
                '@context': 'https://www.w3.org/ns/activitystreams',
                summary: `${author.displayName} Likes Your Comment`,
            })
            .then((response) => {
                response.status === 201 ? setLikeCount(likeCount + 1) : null;
            });
    };
    const [disableLiked, setDisableLiked] = useState(false);

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
                    avatar={<RemoteProfile props={props.author} />}
                    title={renderContent()}
                    subheader={`Published:${publishedDate}`}
                />
                <CardActions disableSpacing>
                    <IconButton
                        aria-label="like this comment"
                        onClick={() => {
                            setDisableLiked(true);
                            const author = props.auth.author;
                            author.id = props.auth.author.url;
                            const inbox = url.split('/posts/')[0];
                            likeComment(inbox, author);
                        }}
                        disabled={disableLiked ? true : null}
                    >
                        <FavoriteIcon />
                    </IconButton>
                    <Typography
                        onClick={() => {
                            navigate('/likes', {
                                state: {
                                    node: node,
                                    object: url,
                                },
                            });
                        }}
                    >
                        {likeCount}
                    </Typography>
                </CardActions>
            </Card>
        </ListItem>
    );
};

const mapStateToProps = (state, ownProps) => ({
    props: { ...ownProps.props, auth: state.auth },
});

export default connect(mapStateToProps)(RemoteComment);
