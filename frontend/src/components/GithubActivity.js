import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import Link from '@mui/material/Link';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
const GithubActivity = ({ user, dateTime, eventType, repo }) => {
    GithubActivity.propTypes = {
        props: PropTypes.object,
        user: PropTypes.string,
        dateTime: PropTypes.string,
        eventType: PropTypes.string,
        repo: PropTypes.string,
    };
    return (
        <ListItem alignItems="flex-start">
            <ListItemAvatar>
                <Avatar
                    alt={user}
                    src={`https://avatars.githubusercontent.com/${user}`}
                    onClick={() => {
                        window.location.href = `https://github.com/${user}`;
                    }}
                />
            </ListItemAvatar>
            <ListItemText
                primary={`${user}  ${moment(dateTime).fromNow()}`}
                secondary={
                    <>
                        <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                        >
                            {`${eventType} on `}
                        </Typography>

                        <Link
                            sx={{ display: 'inline' }}
                            component="span"
                            href={`https://github.com/${repo}`}
                        >
                            {repo}
                        </Link>
                    </>
                }
            />
        </ListItem>
    );
};

export default GithubActivity;
