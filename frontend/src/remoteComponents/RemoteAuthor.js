import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import GithubActivity from '../components/GithubActivity';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const BACKEND_URL = 'http://localhost:8000'; //process.env.REACT_APP_BACKEND_URL

const RemoteAuthor = () => {
    let navigate = useNavigate();
    let location = useLocation();

    const node = location.state.node;
    const authorId = location.state.authorId;
    console.log(node, authorId);
    const [GHActivity, setGHActivity] = useState([]);
    const [author, setAuthor] = useState({
        id: '',
        displayName: '',
        github: '',
        profileImage: '',
        host: '',
        url: '',
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
    const getAuthorById = async (node, authorId) => {
        const requestUrl = `${BACKEND_URL}/remote/authors/${authorId}/`;

        try {
            const response = await axios.get(`${requestUrl}`, {
                params: { node: node },
            });
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
    };

    useEffect(() => {
        getAuthorById(node, authorId);
    }, []);
    return (
        <>
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
                <Button variant="contained">Follow</Button>
                <Button
                    variant="contained"
                    onClick={() => {
                        navigate('/follwers', {
                            state: {
                                node: node,
                                authorId: authorId,
                            },
                        });
                    }}
                >
                    Followers
                </Button>
            </Stack>
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

const mapStateToProps = (state) => ({
    nodes: state.node.nodes,
});
export default connect(mapStateToProps)(RemoteAuthor);
