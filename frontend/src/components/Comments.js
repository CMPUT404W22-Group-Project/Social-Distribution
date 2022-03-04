import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import List from '@mui/material/List';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import CommentItem from './CommentItem';
const Comments = ({ props }) => {
  Comments.propTypes = {
    props: PropTypes.object,
    total: PropTypes.number,
    size: PropTypes.number,
    page: PropTypes.number,
    comments: PropTypes.arrayOf(PropTypes.object),
  };
  const total = props.total;
  const size = props.size;
  const [page, setPage] = useState(props.page || 1);
  const [comments, setComments] = useState(props.comments);
  //use useEffect to fetch comments upon page change
  useEffect(() => {
    //axios
    setComments(props.comments);
  }, [page]);
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  //for dialog for posting comment
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  //handle change in select
  const [contentType, setContentType] = useState('text/plain');
  const [comment, setComment] = useState('');
  return (
    <div>
      <Typography variant="subtitle">Comments:</Typography>
      <Button sx={{ ml: 18 }} variant="contained" onClick={handleClickOpen}>
        New Comment
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Comment</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ my: 1 }}>
            <InputLabel id="post-content-type-select-label">
              Content Type
            </InputLabel>
            <Select
              defaultValue={'text/plain'}
              labelId="select-content-type"
              id="post-select-content-type"
              value={contentType}
              label="content type"
              onChange={(event) => {
                setContentType(event.target.value);
              }}
            >
              <MenuItem value={'text/plain'}>Plain Text</MenuItem>
              <MenuItem value={'text/markdown'}>Markdown</MenuItem>
            </Select>
          </FormControl>
          <TextField
            autoFocus
            margin="dense"
            id="comment"
            label="Comment"
            multiline
            rows={4}
            type="text"
            fullWidth
            variant="outlined"
            value={comment}
            onChange={(event) => {
              setComment(event.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Confirm</Button>
        </DialogActions>
      </Dialog>
      <List sx={{ broder: 1, margin: 2, broderColor: 'black' }}>
        {comments?.map((comment) => {
          return <CommentItem key={comment.id} props={comment}></CommentItem>;
        })}
      </List>
      <Pagination
        count={Math.ceil(total / size)}
        page={page}
        color="primary"
        onChange={handlePageChange}
      />
    </div>
  );
};

export default Comments;
