import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const ProfileEdit = () => {

    useEffect(() => {
      document.title = "Edit Profile";
    }, []);

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
                `/authors/${authorId}`
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
                `/authors/${authorId}`,
                author,
                { withCredentials: true }
            );
            if (response.status === 200) {
                navigate(`/authors/${authorId}`);
            }
        } catch (error) {
            // Handle Error Here
            console.error(error);
            alert(error.response.data.error);
        }
    };
    useEffect(() => {
        getAuthorById(authorId);
    }, [authorId]);
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
