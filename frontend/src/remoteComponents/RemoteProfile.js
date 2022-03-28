import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const RemoteProfile = ({ props }) => {
    let navigate = useNavigate();
    RemoteProfile.propTypes = {
        props: PropTypes.object,
        displayName: PropTypes.string,
        profileImage: PropTypes.string,
        id: PropTypes.string,
        github: PropTypes.string,
        type: PropTypes.string,
        url: PropTypes.string,
        node: PropTypes.any,
    };
    const authorId = props ? props.id.split('/').at(-2) : null;
    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    return props ? (
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
                            <Button
                                variant="contained"
                                onClick={() => {
                                    props.node
                                        ? navigate('/author', {
                                              state: {
                                                  node: props.node,
                                                  authorId: authorId,
                                              },
                                          })
                                        : navigate(`/authors/${authorId}`);
                                }}
                            >
                                Profile
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    props.node
                                        ? navigate('/posts', {
                                              state: {
                                                  node: props.node,
                                                  authorId: authorId,
                                              },
                                          })
                                        : navigate(
                                              `/authors/${authorId}/posts`
                                          );
                                }}
                            >
                                Posts
                            </Button>
                        </Stack>
                    </CardActions>
                </Card>
            </Popover>
        </div>
    ) : (
        <div>loading</div>
    );
};

export default RemoteProfile;
