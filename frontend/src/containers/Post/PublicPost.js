import React, { useState, useEffect } from 'react';
import axios from 'axios';

import PostItem from '../../components/PostItem';

const PublicPost = () => {
  useEffect(() => {
    document.title = "Posts";
  }, []);
  const [posts, setPosts] = useState([]);

  const getAllPublicPosts = () => {
    axios
      .get(`/posts`,
      { withCredentials: true })
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
