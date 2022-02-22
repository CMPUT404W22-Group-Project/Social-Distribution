import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Popover from '@mui/material/Popover';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import GitHubIcon from '@mui/icons-material/GitHub';

const ProfilePictureCard = ({ props }) => {
  ProfilePictureCard.propTypes = {
    props: PropTypes.object,
    displayName: PropTypes.any,
    profileImage: PropTypes.any,
    id: PropTypes.any,
    github: PropTypes.any,
    type: PropTypes.any,
    url: PropTypes.any,
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const [requestSent, setRequestSent] = useState(false);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFollow = () => {
    setRequestSent(true);
  };

  const open = Boolean(anchorEl);
  return (
    <div>
      <Avatar
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        alt={props.displayName}
        src={props.profileImage}
      />
      <Popover
        id={props.id}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handleClose}
      >
        <Card sx={{ maxWidth: 300 }}>
          <CardHeader
            action={
              <IconButton aria-label="github" href={props.github}>
                <GitHubIcon />
              </IconButton>
            }
            title={props.displayName}
            subheader={props.type}
          />
          <CardActions disableSpacing>
            <Stack spacing={2} direction="row">
              <Button variant="contained" href={props.url}>
                Profile
              </Button>
              <Button
                variant="contained"
                disabled={requestSent}
                onClick={handleFollow}
              >
                Follow
              </Button>
            </Stack>
          </CardActions>
        </Card>
      </Popover>
    </div>
  );
};

export default ProfilePictureCard;
