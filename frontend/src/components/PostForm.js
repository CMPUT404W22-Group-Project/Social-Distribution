import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';

const PostForm = () => {
  PostForm.propTypes = {
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
    image: PropTypes.string,
    commentsSrc: PropTypes.object,
  };
  const [category, setCategory] = useState('');
  const [post, setPost] = useState({
    title: '',
    source: '',
    origin: '',
    description: '',
    contentType: 'text/plain',
    content: '',
    image: '',
    categories: [],
    visibility: '',
    unlisted: false,
  });
  const handleChange = (prop) => (event) => {
    setPost({ ...post, [prop]: event.target.value });
  };
  const handleOnEnterPress = () => {
    setPost({ ...post, categories: [...post.categories, category] });
    setCategory('');
  };
  const handleDeleteCategory = (selectedCategory) => {
    setPost({
      ...post,
      categories: post.categories.filter((item) => item !== selectedCategory),
    });
  };
  return (
    <Box
      sx={{
        mx: 10,
        my: 5,
      }}
    >
      <h1 style={{ fontSize: 28, marginBottom: 5 }}>Post Form</h1>
      <TextField
        sx={{ my: 1 }}
        required
        fullWidth
        id="post-title"
        label="Title"
        value={post.title}
        onChange={handleChange('title')}
      />
      <TextField
        sx={{ my: 1 }}
        required
        fullWidth
        id="post-source"
        label="Source"
        value={post.source}
        onChange={handleChange('source')}
      />
      <TextField
        sx={{ my: 1 }}
        required
        fullWidth
        id="post-origin"
        label="Origin"
        value={post.origin}
        onChange={handleChange('origin')}
      />
      <TextField
        sx={{ my: 1 }}
        required
        fullWidth
        id="post-description"
        label="Description"
        value={post.description}
        onChange={handleChange('description')}
      />
      <FormControl fullWidth sx={{ my: 1 }}>
        <InputLabel id="post-unlist-select-label">Unlist</InputLabel>
        <Select
          defaultValue={false}
          labelId="select-unlist"
          id="post-select-unlist"
          value={post.unlist}
          label="Unlist"
          onChange={handleChange('unlist')}
        >
          <MenuItem value={true}>Yes</MenuItem>
          <MenuItem value={false}>No</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ my: 1 }}>
        <InputLabel id="post-visibility-select-label">Visibility</InputLabel>
        <Select
          labelId="select-visibility"
          id="post-select-visibility"
          value={post.visibility}
          label="Visibility"
          onChange={handleChange('visibility')}
        >
          <MenuItem value={'PUBLIC'}>Publicly available</MenuItem>
          <MenuItem value={'FRIENDS'}>Friends only</MenuItem>
        </Select>
      </FormControl>
      <TextField
        sx={{ my: 1 }}
        fullWidth
        id="post-categories-input"
        label="Category"
        value={category}
        onChange={(event) => {
          setCategory(event.target.value);
        }}
        onKeyPress={(event) => {
          if (event.key === 'Enter') {
            handleOnEnterPress();
          }
        }}
      />
      <Breadcrumbs sx={{ my: 1 }} aria-label="breadcrumb" separator="|">
        <Typography color="text.primary">Categories</Typography>
        {post.categories.map((category, index) => {
          return (
            <Chip
              key={index}
              label={category}
              variant="outlined"
              onClick={() => {
                handleDeleteCategory(category);
              }}
            />
          );
        })}
      </Breadcrumbs>
      <FormControl fullWidth sx={{ my: 1 }}>
        <InputLabel id="post-content-type-select-label">
          Content Type
        </InputLabel>
        <Select
          defaultValue={'text/plain'}
          labelId="select-content-type"
          id="post-select-content-type"
          value={post.contentType}
          label="content type"
          onChange={handleChange('contentType')}
        >
          <MenuItem value={'text/plain'}>Plain Text</MenuItem>
          <MenuItem value={'text/markdown'}>Markdown</MenuItem>
          <MenuItem value={'application/base64'}>Text Base64</MenuItem>
          <MenuItem value={'image/png;base64'}>PNG Base64</MenuItem>
          <MenuItem value={'image/jpeg:base64'}>JPEG Base64</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default PostForm;
