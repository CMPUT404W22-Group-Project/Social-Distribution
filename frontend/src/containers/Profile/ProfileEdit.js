import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const BACKEND_URL = 'http://localhost:8000'; //process.env.REACT_APP_BACKEND_URL
const ProfileEdit = () => {
  let { authorId } = useParams();
  let navigate = useNavigate();
  const [author, setAuthor] = useState({
    id: '',
    displayName: '',
    github: '',
    profileImage: '',
  });
  const getAuthorById = async (authorId) => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/service/authors/${authorId}`
      );
      setAuthor(response.data);
    } catch (err) {
      // Handle Error Here
      console.error(err);
    }
  };
  const postAuthor = async (authorId, author) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/service/authors/${authorId}`,
        author
      );
      response.status === 201
        ? navigate(`/authors/${authorId}`)
        : alert('Post unsucessful');
    } catch (err) {
      // Handle Error Here
      console.error(err);
    }
  };
  useEffect(() => {
    getAuthorById(authorId);
  }, []);
  const handleChange = (prop) => (event) => {
    setAuthor({ ...author, [prop]: event.target.value });
  };
  const onOkButtonClick = () => {
    postAuthor(authorId, author);
  };
  return (
    <>
      <TextField
        sx={{ my: 1 }}
        required
        fullWidth
        id="author-display-name"
        label="Name"
        value={author.displayName}
        onChange={handleChange('displayName')}
      />
      <TextField
        sx={{ my: 1 }}
        required
        fullWidth
        id="author-github"
        label="Github"
        value={author.github}
        onChange={handleChange('github')}
      />
      <TextField
        sx={{ my: 1 }}
        required
        fullWidth
        id="author-profile-image"
        label="Profile Image(Link)"
        value={author.profileImage}
        onChange={handleChange('profileImage')}
      />
      <Stack spacing={2} direction="row">
        <Button
          variant="contained"
          onClick={() => {
            onOkButtonClick();
          }}
        >
          Ok
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            navigate(`/authors/${authorId}`);
          }}
        >
          Cancel
        </Button>
      </Stack>
    </>
  );
};

export default ProfileEdit;
