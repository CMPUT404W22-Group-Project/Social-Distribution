import React, { useState, useEffect } from 'react';
import axios from 'axios';

import PostItem from '../../components/PostItem';

const BACKEND_URL = 'http://localhost:8000'; //process.env.REACT_APP_BACKEND_URL

const PublicPost = () => {
  const [posts, setPosts] = useState([]);

  const getAllPublicPosts = () => {
    axios
      .get(`${BACKEND_URL}/posts`)
      .then((response) => {
        response.status === 200 ? setPosts([...response.data.items]) : null;
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getAllPublicPosts();
  }, []);
  return (
    <>
      {posts?.map((post, i) => {
        return post !== undefined ? <PostItem key={i} props={post} /> : null;
      })}
    </>
  );
};

export default PublicPost;
