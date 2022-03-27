import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
const BACKEND_URL = 'http://localhost:8000'; //process.env.REACT_APP_BACKEND_URL
const PostNew = () => {

    useEffect(() => {
      document.title = "New Post";
    }, []);
    
    let navigate = useNavigate();
    let { authorId } = useParams();
    // PostForm.propTypes = {
    //   props: PropTypes.object,
    //   id: PropTypes.string,
    //   source: PropTypes.string,
    //   origin: PropTypes.string,
    //   author: PropTypes.object,
    //   title: PropTypes.string,
    //   published: PropTypes.string,
    //   description: PropTypes.string,
    //   categories: PropTypes.arrayOf(PropTypes.string),
    //   visibility: PropTypes.string,
    //   unlisted: PropTypes.bool,
    //   contentType: PropTypes.string,
    //   content: PropTypes.string,
    //   image: PropTypes.string,
    //   commentsSrc: PropTypes.object,
    // };
    const [file, setFile] = useState('');
    const [fileName, setFileName] = useState('');
    const [category, setCategory] = useState('');
    const [post, setPost] = useState({
        title: '',
        source: '',
        origin: '',
        description: '',
        contentType: 'text/plain',
        content: '',
        categories: [],
        visibility: '',
        unlisted: false,
    });
    //reset every time contentType is changed
    useEffect(() => {
        if (
            post.contentType === 'image/jpeg;base64' ||
            post.contentType === 'image/png;base64'
        ) {
            setPost({ ...post, content: '' });
        }
    }, [post, post.contentType]);

    const getBase64 = async (file, callback) => {
        let reader = new FileReader();
        await reader.readAsDataURL(file);
        reader.onload = function () {
            callback(reader.result);
        };
    };

    // const createPost = async (authorId, post, file) => {
    //     post.authorId = authorId;

    //     axios
    //         .post(`${BACKEND_URL}/authors/${authorId}/posts`, post, {
    //             withCredentials: true,
    //         })
    //         .then((response) => {
    //             console.log(response);
    //             if (response.status === 201) {
    //                 if (
    //                     (post.contentType === 'image/jpeg;base64' &&
    //                         file !== '') ||
    //                     (post.contentType === 'image/png;base64' && file !== '')
    //                 ) {
    //                     const formData = new FormData();
    //                     formData.append('file', file);
    //                     axios
    //                         .post(
    //                             `${BACKEND_URL}/authors/${authorId}/posts/${response.data.id}/image`,
    //                             formData,
    //                             {
    //                                 withCredentials: true,
    //                                 headers: {
    //                                     'Content-Type': 'multipart/form-data',
    //                                 },
    //                             }
    //                         )
    //                         .then((imageRes) => {
    //                             imageRes.status === 201
    //                                 ? navigate(`/authors/${authorId}/posts`)
    //                                 : null;
    //                         });
    //                 }
    //             }
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    //     // upload file with the post id from response object
    // };

    const createPost = async (authorId, post, file) => {
        post.authorId = authorId;
        if (
            post.contentType === 'image/jpeg;base64' ||
            post.contentType === 'image/png;base64'
        ) {
            if (file) {
                try {
                    await getBase64(file, async (result) => {
                        post.content = await result;
                        postRequest(authorId, post);
                    });
                } catch (err) {
                    alert('Something wrong with converting file');
                }
            }
        } else {
            postRequest(authorId, post);
        }
    };
    //make post request
    const postRequest = async (authorId, post) => {
        try {
            const response = await axios.post(
                `${BACKEND_URL}/authors/${authorId}/posts`,
                post,
                {
                    withCredentials: true,
                }
            );
            console.log('req made');
            response.status === 201
                ? navigate(`/authors/${authorId}/posts`)
                : alert(' Post unsucessful');
        } catch (error) {
            // Handle Error Here
            alert(error.response.status);
        }
    };
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
            categories: post.categories.filter(
                (item) => item !== selectedCategory
            ),
        });
    };
    //on file change
    const onFileChange = (event) => {
        setFile(event.target.files[0]);
        setFileName(event.target.value);
    };
    const renderContent = () => {
        if (
            post.contentType === 'text/plain' ||
            post.contentType === 'text/markdown' ||
            post.contentType === 'application/base64'
        ) {
            return (
                <TextField
                    sx={{ my: 1 }}
                    required
                    fullWidth
                    id="post-content"
                    multiline
                    rows={10}
                    label="Content"
                    value={post.content}
                    onChange={handleChange('content')}
                />
            );
        } else if (
            post.contentType === 'image/jpeg;base64' ||
            post.contentType === 'image/png;base64'
        ) {
            return (
                <>
                    <TextField
                        sx={{ my: 1 }}
                        required
                        fullWidth
                        id="post-image-link"
                        label="Image Link"
                        value={post.content}
                        onChange={handleChange('content')}
                    />
                    or
                    <br />
                    <TextField
                        sx={{ my: 1 }}
                        id="post-image-file"
                        type="file"
                        accept=".jpeg,.png"
                        value={fileName}
                        onChange={() => {
                            onFileChange(event);
                        }}
                    />
                </>
            );
        }
    };
    const onOkButtonClick = () => {
        createPost(authorId, post, file);
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
                    value={post.unlisted}
                    label="Unlist"
                    onChange={handleChange('unlisted')}
                >
                    <MenuItem value={true}>Yes</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
                </Select>
            </FormControl>
            <FormControl fullWidth sx={{ my: 1 }}>
                <InputLabel id="post-visibility-select-label">
                    Visibility
                </InputLabel>
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
                {post.categories?.map((category, index) => {
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
                    <MenuItem value={'application/base64'}>
                        Text Base64
                    </MenuItem>
                    <MenuItem value={'image/png;base64'}>PNG Base64</MenuItem>
                    <MenuItem value={'image/jpeg;base64'}>JPEG Base64</MenuItem>
                </Select>
            </FormControl>
            {renderContent()}
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
                        navigate(`/authors/${authorId}/posts`);
                    }}
                >
                    Cancel
                </Button>
            </Stack>
        </Box>
    );
};

export default PostNew;
