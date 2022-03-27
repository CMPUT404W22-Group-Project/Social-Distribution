import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import GithubActivity from '../../components/GithubActivity';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
const BACKEND_URL = 'http://localhost:8000'; //process.env.REACT_APP_BACKEND_URL
const Profile = ({ props }) => {

    useEffect(() => {
      document.title = "Profile";
    }, []);

    Profile.propTypes = {
        props: PropTypes.object,
        auth: PropTypes.object,
    };
    let navigate = useNavigate();
    let { authorId } = useParams();
    const isOwnProfile = props.auth.author.id === authorId;
    const isAdmin = props.auth.author.admin;
    const [GHActivity, setGHActivity] = useState([]);
    const [author, setAuthor] = useState({
        id: '',
        displayName: '',
        github: '',
        profileImage: '',
    });
    const getGHEvents = async (user) => {
        try {
            const response = await axios.get(
                `https://api.github.com/users/${user}/events`
            );
            setGHActivity(response.data);
        } catch (err) {
            // Handle Error Here
            console.error(err);
        }
    };
    const getAuthorById = useCallback(async (authorId) => {
        try {
            const response = await axios.get(
                `${BACKEND_URL}/authors/${authorId}`
            );
            setAuthor(response.data);
            //follow up request
            let ghUserName;
            response.data.github
                ? (ghUserName = response.data.github.split('/').pop())
                : null;
            response.status === 200 && ghUserName
                ? getGHEvents(ghUserName)
                : null;
        } catch (err) {
            // Handle Error Here
            console.error(err);
        }
    }, []);

    useEffect(() => {
        getAuthorById(authorId);
    }, [authorId, getAuthorById]);

    const renderedButton = () => {
        return (
            <Stack
                spacing={2}
                direction="column"
                sx={{
                    right: 100,
                    top: 200,
                    width: 100,
                    height: 100,
                    position: 'absolute',
                }}
            >
                {isAdmin ? (
                    <Button
                        variant="contained"
                        onClick={() => {
                            navigate(`/admin`);
                        }}
                    >
                        Admin
                    </Button>
                ) : null}
                {isOwnProfile ? (
                    <Button
                        variant="contained"
                        onClick={() => {
                            navigate(`/authors/${authorId}/edit`);
                        }}
                    >
                        Edit
                    </Button>
                ) : null}
                {isOwnProfile ? null : (
                    <Button variant="contained">Follow</Button>
                )}
                <Button
                    variant="contained"
                    onClick={() => {
                        navigate(`/authors/${authorId}/followers`);
                    }}
                >
                    Followers
                </Button>
            </Stack>
        );
    };

    return (
        <>
            {renderedButton()}
            <Avatar
                alt="Profile-image"
                src={author.profileImage}
                sx={{
                    ml: 10,
                    mt: 10,
                    minWidth: 240,
                    minHeight: 240,
                }}
            />
            <Typography
                sx={{ ml: 10 }}
                variant="h2"
                gutterBottom
                component="div"
            >
                {author.type}
            </Typography>
            <Typography
                sx={{ ml: 10 }}
                variant="h4"
                gutterBottom
                component="div"
            >
                {`Name:${author.displayName}`}
            </Typography>
            <Typography
                sx={{ ml: 10 }}
                variant="h4"
                gutterBottom
                component="div"
            >
                {`GitHub:${author.github}`}
            </Typography>
            <Typography
                sx={{ ml: 10 }}
                variant="h4"
                gutterBottom
                component="div"
            >
                GitHub Activities:
            </Typography>
            <List
                sx={{
                    width: '100%',
                    maxWidth: 360,
                    bgcolor: 'background.paper',
                }}
            >
                {GHActivity.map((activity, i) => {
                    return (
                        <GithubActivity
                            key={i}
                            user={activity.actor.display_login}
                            dateTime={activity.created_at}
                            eventType={activity.type}
                            repo={activity.repo.name}
                        />
                    );
                })}
            </List>
        </>
    );
};

const mapStateToProps = (state, ownProps) => ({
    props: { ...ownProps.props, auth: state.auth },
});

export default connect(mapStateToProps)(Profile);
