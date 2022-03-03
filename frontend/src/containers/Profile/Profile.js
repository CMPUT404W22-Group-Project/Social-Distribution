import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import GithubActivity from '../../components/GithubActivity';
const Profile = () => {
  const [GHActivity, setGHActivity] = useState([]);
  const getGHEvents = async () => {
    const response = await axios.get(
      'https://api.github.com/users/Codyle212/events'
    );
    setGHActivity(response.data);
  };
  useEffect(() => {
    getGHEvents();
  }, []);
  return (
    <>
      <Avatar
        alt="Profile-image"
        src="/static/images/avatar/1.jpg"
        sx={{
          ml: 10,
          mt: 10,
          minWidth: 240,
          minHeight: 240,
        }}
      />
      <Typography sx={{ ml: 10 }} variant="h2" gutterBottom component="div">
        Author
      </Typography>
      <Typography sx={{ ml: 10 }} variant="h4" gutterBottom component="div">
        Name:
      </Typography>
      <Typography sx={{ ml: 10 }} variant="h4" gutterBottom component="div">
        GitHub:
      </Typography>
      <Typography sx={{ ml: 10 }} variant="h4" gutterBottom component="div">
        GitHub Activities:
      </Typography>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
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

export default Profile;
