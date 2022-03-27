import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import RemoteProfile from './RemoteProfile';
import axios from 'axios';

const RemoteFollowers = () => {
    let location = useLocation();
    const followerLink = location.state.followerLink;
    const [followers, setFollowers] = useState([]);

    const getFollowers = async (followerLink) => {
        const response = await axios.get(`${followerLink}`);
        response.status === 200 ? setFollowers(response.data.items) : null;
    };
    useEffect(() => {
        getFollowers(followerLink);
    }, [followerLink]);

    return (
        <Grid container spacing={2}>
            {followers.map((follower, index) => {
                return (
                    <Grid key={index} item xs={1} sx={{ mx: 1, my: 1 }}>
                        <RemoteProfile props={follower} />
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default RemoteFollowers;
