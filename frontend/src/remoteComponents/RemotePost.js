import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import moment from 'moment';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import RemoteProfile from './RemoteProfile';
import RemoteComments from './RemoteComments';

const RemotePost = ({ props }) => {
    RemotePost.propTypes = {
        props: PropTypes.object,
        id: PropTypes.string,
        url: PropTypes.string,
        authorId: PropTypes.string,
        source: PropTypes.string,
        origin: PropTypes.string,
        author: PropTypes.object,
        title: PropTypes.string,
        published: PropTypes.string,
        description: PropTypes.string,
        categories: PropTypes.arrayOf(PropTypes.string),
        likeCount: PropTypes.number,
        visibility: PropTypes.string,
        unlisted: PropTypes.bool,
        contentType: PropTypes.string,
        content: PropTypes.string,
        comments: PropTypes.string,
        commentsSrc: PropTypes.object,
        auth: PropTypes.object,
    };
    //verify isOwnPost?
    const postId = props.url?.split('/').pop();
    //for post menu
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const publishedDate = moment(props.published).format(
        'MMMM Do YYYY, h:mm:ss a'
    );
    //categories
    const renderCategories = () => {
        return (
            <Breadcrumbs aria-label="breadcrumb" separator="|">
                <Typography color="text.primary">Categories</Typography>
                {props.categories?.map((category, index) => {
                    return (
                        <Link
                            key={index}
                            underline="hover"
                            color="inherit"
                            href={`/public/posts?category=${category}`}
                        >
                            {category}
                        </Link>
                    );
                })}
            </Breadcrumbs>
        );
    };
    //content
    const renderContent = () => {
        switch (props.contentType) {
            case 'text/plain':
                return (
                    <Typography variant="body1" color="text.secondary">
                        {props.content}
                    </Typography>
                );
            case 'text/markdown':
                return <ReactMarkdown>{props.content}</ReactMarkdown>;
            case 'application/base64':
                var decodeContent = atob(props.content);
                return (
                    <Typography variant="body1" color="text.secondary">
                        {decodeContent}
                    </Typography>
                );
            case 'image/png;base64':
                return (
                    <CardMedia
                        component="img"
                        image={props.content}
                        alt={`${props.id}.png`}
                        sx={{ maxWidth: 1 / 2, maxHeight: 1 / 2 }}
                    />
                );
            case 'image/jpeg;base64':
                return (
                    <CardMedia
                        component="img"
                        image={props.content}
                        alt={`${props.id}.jepg`}
                        sx={{ maxWidth: 1 / 2, maxHeight: 1 / 2 }}
                    />
                );
        }
    };

    //expand more for commentsSrc

    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    //like post
    const likePost = (author) => {
        axios
            .post(`${props.url}/likes`, {
                author: author,
                object: props.url,
            })
            .then((response) => {
                response.status === 201
                    ? window.location.reload()
                    : alert('You like to this is unsucessful');
            });
    };
    const [disableLiked, setDisableLiked] = useState(false);
    const getAuthorLiked = useCallback(() => {
        axios.get(`${props.url}/likes`).then((response) => {
            response.data.items.map((data) => {
                data.author.id = props.auth.author.url
                    ? setDisableLiked(true)
                    : null;
            });
            props.likeCount = response.data.items.length;
        });
    }, [props]);
    useEffect(() => {
        getAuthorLiked(postId);
    }, [getAuthorLiked, postId]);
    return (
        <>
            <Card>
                <CardHeader
                    avatar={<RemoteProfile props={props.author} />}
                    action={
                        <>
                            <IconButton
                                onClick={handleClick}
                                aria-controls={open ? 'post-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                            >
                                <MoreVertIcon />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                id="post-menu"
                                open={open}
                                onClose={handleClose}
                                onClick={handleClose}
                                elevation={0}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                            >
                                <MenuItem>
                                    <Button
                                        sx={{ minWidth: 100 }}
                                        variant="contained"
                                        onClick={() => {
                                            window.location.assign(
                                                props.source
                                            );
                                        }}
                                    >
                                        Source
                                    </Button>
                                </MenuItem>
                                <MenuItem>
                                    <Button
                                        sx={{ minWidth: 100 }}
                                        variant="contained"
                                        onClick={() => {
                                            window.location.assign(
                                                props.origin
                                            );
                                        }}
                                    >
                                        Origin
                                    </Button>
                                </MenuItem>
                            </Menu>
                        </>
                    }
                    title={props.title}
                    subheader={`Published:${publishedDate}`}
                />

                <CardContent>
                    <Typography variant="title">{`Description:${props.description}`}</Typography>
                    {renderCategories()}
                    {renderContent()}
                </CardContent>
                <CardActions disableSpacing>
                    <IconButton
                        aria-label="like-this-post"
                        onClick={() => {
                            setDisableLiked(true);
                            const author = props.auth.author;
                            author.id = props.auth.author.url;
                            likePost(author);
                        }}
                        disabled={disableLiked ? true : null}
                    >
                        <FavoriteIcon />
                    </IconButton>
                    <Typography>{props.likeCount}</Typography>
                    <IconButton aria-label="share">
                        <ShareIcon />
                    </IconButton>
                    <Button
                        sx={{ marginLeft: 'auto' }}
                        variant="contained"
                        expand={expanded ? 'true' : 'false'}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >
                        View Comments
                    </Button>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <RemoteComments props={props.id} />
                    </CardContent>
                </Collapse>
            </Card>
        </>
    );
};
const mapStateToProps = (state, ownProps) => ({
    props: { ...ownProps.props, auth: state.auth },
});

export default connect(mapStateToProps)(RemotePost);
