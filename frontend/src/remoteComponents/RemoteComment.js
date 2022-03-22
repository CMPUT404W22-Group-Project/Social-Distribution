import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import ListItem from '@mui/material/ListItem';
import ReactMarkdown from 'react-markdown';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';

import RemoteProfile from './RemoteProfile';

const RemoteComment = ({ props }) => {
    RemoteComment.propTypes = {
        props: PropTypes.object,
        author: PropTypes.object,
        published: PropTypes.string,
        comment: PropTypes.string,
        contentType: PropTypes.string,
    };
    const publishedDate = moment(props.published).format(
        'MMMM Do YYYY, h:mm:ss a'
    );

    const renderContent = () => {
        switch (props.contentType) {
            case 'text/plain':
                return (
                    <Typography variant="body1" color="text.secondary">
                        {props.comment}
                    </Typography>
                );
            case 'text/markdown':
                return (
                    <Typography variant="body1" color="text.secondary">
                        <ReactMarkdown>{props.comment}</ReactMarkdown>
                    </Typography>
                );
        }
    };

    return (
        <ListItem>
            <Card>
                <CardHeader
                    avatar={<RemoteProfile props={props.author} />}
                    title={renderContent()}
                    subheader={`Published:${publishedDate}`}
                />
                <CardActions disableSpacing>
                    <IconButton aria-label="add to favorites">
                        <FavoriteIcon />
                    </IconButton>
                </CardActions>
            </Card>
        </ListItem>
    );
};

const mapStateToProps = (state, ownProps) => ({
    props: { ...ownProps.props, auth: state.auth },
});

export default connect(mapStateToProps)(RemoteComment);
