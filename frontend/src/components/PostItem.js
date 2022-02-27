import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import moment from 'moment';
import { styled } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import ProfilePictureCard from './ProfilePictureCard';
import Comments from './Comments';

const PostItem = ({ props }) => {
  PostItem.propTypes = {
    props: PropTypes.object,
    id: PropTypes.string,
    source: PropTypes.string,
    origin: PropTypes.string,
    author: PropTypes.object,
    title: PropTypes.string,
    published: PropTypes.string,
    description: PropTypes.string,
    categories: PropTypes.arrayOf(PropTypes.string),
    visibility: PropTypes.string,
    unlisted: PropTypes.bool,
    contentType: PropTypes.string,
    content: PropTypes.string,
    commentsSrc: PropTypes.object,
  };
  //verify isOwnPost?
  const isOwnPost = true;
  //for post menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const publishedDate = moment(props.published).format(
    'MMMM Do YYYY, h:mm:ss a'
  );
  //categories
  const renderCategories = () => {
    return (
      <Breadcrumbs aria-label="breadcrumb" separator="|">
        <Typography color="text.primary">Categories</Typography>
        {props.categories.map((category, index) => {
          return (
            <Link
              key={index}
              underline="hover"
              color="inherit"
              href={`/?category=${category}`}
            >
              {category}
            </Link>
          );
        })}
      </Breadcrumbs>
    );
  };
  //content
  const renderContent = () => {
    switch (props.contentType) {
      case 'text/plain':
        return (
          <Typography variant="body1" color="text.secondary">
            {props.content}
          </Typography>
        );
      case 'text/markdown':
        return (
          <Typography variant="body1" color="text.secondary">
            <ReactMarkdown>{props.content}</ReactMarkdown>
          </Typography>
        );
      case 'application/base64':
        var decodeContent = atob(props.content);
        return (
          <Typography variant="body1" color="text.secondary">
            {decodeContent}
          </Typography>
        );
      case 'image/png;base64':
        return (
          <CardMedia
            component="img"
            image={`data:image/png;base64,${props.content}`}
            alt={`${props.id}.png`}
            sx={{ maxWidth: 1 / 2, maxHeight: 1 / 2 }}
          />
        );
      case 'image/jpeg;base64':
        return (
          <CardMedia
            component="img"
            image={`data:image/jpeg;base64,${props.content}`}
            alt={`${props.id}.jepg`}
          />
        );
    }
  };
  //delete button
  const DeleteButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(red[500]),
    backgroundColor: red[500],
    '&:hover': {
      backgroundColor: red[700],
    },
  }));
  //expand more for commentsSrc

  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  return (
    <Card>
      <CardHeader
        avatar={<ProfilePictureCard props={props.author} />}
        action={
          <>
            <IconButton
              onClick={handleClick}
              aria-controls={open ? 'post-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              id="post-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              elevation={0}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              {isOwnPost ? (
                <MenuItem disabled={isOwnPost ? false : true}>
                  <Button sx={{ minWidth: 100 }} variant="contained">
                    Edit
                  </Button>
                </MenuItem>
              ) : null}
              <MenuItem>
                <Button
                  sx={{ minWidth: 100 }}
                  variant="contained"
                  onClick={() => {
                    window.location.href = props.source;
                  }}
                >
                  Source
                </Button>
              </MenuItem>
              <MenuItem>
                <Button
                  sx={{ minWidth: 100 }}
                  variant="contained"
                  onClick={() => {
                    window.location.href = props.origin;
                  }}
                >
                  Origin
                </Button>
              </MenuItem>
              {isOwnPost ? (
                <MenuItem disabled={isOwnPost ? false : true}>
                  <DeleteButton sx={{ minWidth: 100 }} variant="contained">
                    Delete
                  </DeleteButton>
                </MenuItem>
              ) : null}
            </Menu>
          </>
        }
        title={props.title}
        subheader={`Published:${publishedDate}`}
      />

      <CardContent>
        <Typography variant="title">{`Description:${props.description}`}</Typography>
        {renderCategories()}
        {renderContent()}
        {/* <CardMedia
          component="img"
          height="194"
          image="/static/images/cards/paella.jpg"
          alt="Paella dish"
        />
        <Typography variant="body1" color="text.secondary">
          This impressive paella is a perfect party dish and a fun meal to cook
          together with your guests. Add 1 cup of frozen peas along with the
          mussels, if you like.
        </Typography> */}
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <Typography variant="body1">{}</Typography>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <Button
          sx={{ marginLeft: 'auto' }}
          variant="contained"
          expand={expanded ? 'true' : 'false'}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          View Comments
        </Button>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Comments props={props.commentsSrc} />
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default PostItem;
