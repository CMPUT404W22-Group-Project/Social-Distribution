import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import List from '@mui/material/List';
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
  return (
    <div>
      <Typography variant="subtitle">Comments:</Typography>
      <List sx={{ broder: 1, margin: 2, broderColor: 'black' }}>
        {comments.map((comment) => {
          return <CommentItem key={comment.id} props={comment}></CommentItem>;
        })}
      </List>
      <Pagination
        count={Math.ceil(total / size)}
        page={page}
        color="primary"
        onChange={handlePageChange}
      />
      ;
    </div>
  );
};

export default Comments;
