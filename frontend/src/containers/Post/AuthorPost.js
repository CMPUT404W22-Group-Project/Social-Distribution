import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import PostItem from '../../components/PostItem';

const AuthorPost = ({ props }) => {
    useEffect(() => {
        document.title = 'Posts';
    }, []);

    AuthorPost.propTypes = {
        props: PropTypes.object,
        auth: PropTypes.object,
    };
    const [posts, setPosts] = useState([]);
    let { authorId } = useParams();
    const isOwnPost = props.auth.author.id === authorId;
    let navigate = useNavigate();
    const getAllPosts = useCallback(() => {
        axios
            .get(`/authors/${authorId}/posts`, { withCredentials: true })
            .then((response) => {
                response.status === 200
                    ? setPosts([...response.data.items])
                    : null;
            })
            .catch((error) => {
                console.log(error);
            });
    }, [authorId]);
    useEffect(() => {
        getAllPosts();
    }, [getAllPosts]);
    return (
        <>
            {isOwnPost ? (
                <Button
                    sx={{
                        minWidth: 100,
                        my: 5,
                        left: '80%',
                        position: 'relative',
                    }}
                    variant="contained"
                    onClick={() => {
                        navigate(`/authors/${authorId}/post/new`);
                    }}
                >
                    New Post
                </Button>
            ) : null}
            {posts?.map((post, i) => {
                return post !== undefined ? (
                    <PostItem key={i} props={post} />
                ) : null;
            })}
            <Typography variant="h6">Shared With Me</Typography>
        </>
    );
};

const mapStateToProps = (state, ownProps) => ({
    props: { ...ownProps.props, auth: state.auth },
});

export default connect(mapStateToProps)(AuthorPost);
