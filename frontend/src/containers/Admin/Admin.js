import React, { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import BackspaceIcon from '@mui/icons-material/Backspace';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { connect } from 'react-redux';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
const BACKEND_URL = 'http://localhost:8000';
const Admin = () => {
    
    useEffect(() => {
      document.title = "Admin";
    }, []);

    const [nodes, setNodes] = useState([]);

    //TODO: IMPLEMENT all manage Admin
    const [authors, setAuthors] = useState([]);

    const [newNode, setNewNode] = useState({
        url: '',
        type: 'send',
        username: '',
        password: '',
    });
    const [selectedAuthor, setSelectedAuthor] = useState({
        id: '',
        displayName: '',
        github: '',
        profileImage: '',
        activate: '',
    });
    useEffect(() => {
        axios
            .get(`${BACKEND_URL}/nodes/all`, { withCredentials: true })
            .then((response) => {
                response.status === 200 ? setNodes(response.data) : null;
            })
            .catch((error) => {
                alert(error.response.status);
            });
        axios
            .get(`${BACKEND_URL}/authors`)
            .then((response) => {
                response.status === 200
                    ? setAuthors(response.data.items)
                    : null;
            })
            .catch((error) => {
                alert(error.response.status);
            });
    }, []);
    //Form for Selected Author

    const adminPutAuthor = (author) => {
        const authorId = author.id.split('/')[4];
        axios
            .put(`${BACKEND_URL}/authors/${authorId}`, author, {
                withCredentials: true,
            })
            .then((response) => {
                if (response.status === 200) {
                    window.location.reload();
                    //not working
                    // let authorList = authors.filter(
                    //     (author) => author.id !== authorId
                    // );
                    // setAuthors([...authorList, response.data]);
                }
            })
            .catch((error) => {
                alert(error.response.status);
            });
    };

    const adminDeleteAuthor = (id) => {
        const authorId = id.split('/')[4];

        axios
            .delete(`${BACKEND_URL}/authors/${authorId}`, {
                withCredentials: true,
            })
            .then((response) => {
                response.status === 204
                    ? setAuthors(authors.filter((author) => author.id !== id))
                    : null;
            })
            .catch((error) => {
                alert(error.response.status);
            });
    };

    const handleAuthorChange = (prop) => (event) => {
        setSelectedAuthor({ ...selectedAuthor, [prop]: event.target.value });
    };

    const renderAuthorForm = () => {
        return (
            <Box component="div" sx={{ mx: 10 }}>
                <Typography
                    sx={{ my: 1 }}
                    variant="h4"
                    gutterBottom
                    component="div"
                >
                    Edit Author Form
                </Typography>
                <FormControl fullWidth sx={{ mx: 1, my: 1 }}>
                    <InputLabel id="post-visibility-select-label">
                        Activate?
                    </InputLabel>
                    <Select
                        labelId="select-active"
                        id="node-select-active"
                        value={selectedAuthor.activate}
                        label="activate-author"
                        onChange={handleAuthorChange('activate')}
                    >
                        <MenuItem value={true}>Yes</MenuItem>
                        <MenuItem value={false}>No</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    fullWidth
                    sx={{ my: 1, mx: 1 }}
                    required
                    id="display-name"
                    label="Display Name"
                    value={selectedAuthor.displayName}
                    onChange={handleAuthorChange('displayName')}
                />
                <TextField
                    fullWidth
                    sx={{ my: 1, mx: 1 }}
                    required
                    id="author-github"
                    label="Github"
                    value={selectedAuthor.github}
                    onChange={handleAuthorChange('github')}
                />
                <TextField
                    fullWidth
                    sx={{ my: 1, mx: 1 }}
                    required
                    id="author-profile-image"
                    label="Profile Image"
                    value={selectedAuthor.profileImage}
                    onChange={handleAuthorChange('profileImage')}
                />
                <Button
                    variant="outlined"
                    onClick={() => {
                        adminPutAuthor(selectedAuthor);
                    }}
                    sx={{ ml: 1, my: 2 }}
                >
                    Sumbit
                </Button>
            </Box>
        );
    };
    // add node form button
    const handleNodeChange = (prop) => (event) => {
        setNewNode({ ...newNode, [prop]: event.target.value });
    };

    const postNode = (node) => {
        axios
            .post(`${BACKEND_URL}/nodes`, node, { withCredentials: true })
            .then((response) => {
                if (response.status === 201) {
                    setNodes([...nodes, response.data]);
                    setNewNode({
                        type: 'send',
                        url: '',
                        username: '',
                        password: '',
                    });
                }
            })
            .catch((error) => {
                alert(error.response.status);
            });
    };
    const deleteNode = (node) => {
        axios
            .delete(`${BACKEND_URL}/nodes`, {
                data: { ...node },
                withCredentials: true,
            })
            .then((response) => {
                if (response.status === 204) {
                    window.location.reload();
                    //not working for some reason
                    // setNodes(
                    //     nodes.filter((item) => {
                    //         item.url !== node.url&& item.type !==node.type;
                    //     })
                    // );
                }
            })
            .catch((error) => {
                alert(error.status);
            });
    };

    const renderAddNodeForm = () => {
        return (
            <Box component="div" sx={{ mx: 10 }}>
                <Typography
                    sx={{ my: 1 }}
                    variant="h4"
                    gutterBottom
                    component="div"
                >
                    Add Node Form
                </Typography>
                <FormControl fullWidth sx={{ mx: 1, my: 1 }}>
                    <InputLabel id="post-visibility-select-label">
                        Type
                    </InputLabel>
                    <Select
                        labelId="select-type"
                        id="node-select-type"
                        value={newNode.type}
                        label="Visibility"
                        onChange={handleNodeChange('type')}
                    >
                        <MenuItem value={'send'}>Send</MenuItem>
                        <MenuItem value={'receive'}>Receive</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    fullWidth
                    sx={{ my: 1, mx: 1 }}
                    required
                    id="new-node-url"
                    label="url"
                    value={newNode.url}
                    onChange={handleNodeChange('url')}
                />
                <TextField
                    fullWidth
                    sx={{ my: 1, mx: 1 }}
                    required
                    id="new-node-username"
                    label="username"
                    value={newNode.username}
                    onChange={handleNodeChange('username')}
                />
                <TextField
                    fullWidth
                    sx={{ my: 1, mx: 1 }}
                    required
                    id="new-node-password"
                    label="password"
                    value={newNode.password}
                    onChange={handleNodeChange('password')}
                />
                <Button
                    variant="outlined"
                    onClick={() => {
                        postNode(newNode);
                    }}
                    sx={{ ml: 1, my: 2 }}
                >
                    Sumbit
                </Button>
            </Box>
        );
    };

    return (
        <div>
            <Typography
                sx={{ ml: 10 }}
                variant="h2"
                gutterBottom
                component="div"
            >
                Nodes
            </Typography>
            <List sx={{ mx: 10 }}>
                {nodes.map((node, index) => {
                    return (
                        <ListItem
                            key={index}
                            secondaryAction={
                                <IconButton
                                    edge="end"
                                    aria-label="delete-node"
                                    onClick={() => {
                                        deleteNode(node);
                                    }}
                                >
                                    <BackspaceIcon />
                                </IconButton>
                            }
                        >
                            <ListItemText
                                primary={node.type}
                                secondary={node.url}
                            />
                        </ListItem>
                    );
                })}
            </List>
            {renderAddNodeForm()}
            <Typography
                sx={{ ml: 10 }}
                variant="h2"
                gutterBottom
                component="div"
            >
                Authors
            </Typography>
            <List sx={{ mx: 10 }}>
                {authors.map((author, index) => {
                    if (!author.admin) {
                        return (
                            <ListItem
                                key={index}
                                secondaryAction={
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        onClick={() => {
                                            adminDeleteAuthor(author.id);
                                        }}
                                    >
                                        <BackspaceIcon />
                                    </IconButton>
                                }
                            >
                                <ListItemButton
                                    onClick={() => {
                                        setSelectedAuthor(author);
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Avatar
                                            alt={author.displayName}
                                            src={author.profileImage}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={`${author.displayName} ${
                                            author.activate
                                                ? '(Active)'
                                                : '(Not Active)'
                                        }`}
                                        secondary={author.github}
                                    />
                                </ListItemButton>
                            </ListItem>
                        );
                    }
                })}
            </List>
            {renderAuthorForm()}
        </div>
    );
};

const mapStateToProps = (state, ownProps) => ({
    props: { ...ownProps.props, auth: state.auth },
});

export default connect(mapStateToProps)(Admin);
