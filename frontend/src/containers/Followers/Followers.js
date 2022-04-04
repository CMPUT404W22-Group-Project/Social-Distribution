import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import RemoteProfile from "../../remoteComponents/RemoteProfile";
import axios from "axios";

const Followers = () => {
    useEffect(() => {
        document.title = "Followers";
    }, []);

    let { authorId } = useParams();

    const [followers, setFollowers] = useState([]);

    const getFollowers = useCallback(async () => {
        const response = await axios.get(`/authors/${authorId}/followers`);
        setFollowers(response.data.items);
    }, [authorId]);

    useEffect(() => {
        getFollowers();
    }, [getFollowers]);

    return (
        <Grid container spacing={2}>
            {followers?.map((follower, index) => {
                return follower ? (
                    <Grid key={index} item xs={1} sx={{ mx: 1, my: 1 }}>
                        <RemoteProfile props={follower} />
                    </Grid>
                ) : null;
            })}
        </Grid>
    );
};

export default Followers;
