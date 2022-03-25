import React, { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import BackspaceIcon from '@mui/icons-material/Backspace';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
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
    const [nodes, setNodes] = useState([]);
    const [authors, setAuthors] = useState([]);
    console.log(authors);
    const [newNode, setNewNode] = useState({
        url: '',
        type: 'send',
        username: '',
        password: '',
    });
    useEffect(() => {
        axios
            .get(`${BACKEND_URL}/nodes/all`, { withCredentials: true })
            .then((response) => {
                setNodes(response.data);
                console.log(response.data);
            });
        axios.get(`${BACKEND_URL}/authors`).then((response) => {
            setAuthors(response.data);
        });
    }, []);
    //dialog for adding user

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const renderDialog = () => {
        return (
            <>
                <Button
                    variant="outlined"
                    onClick={handleClickOpen}
                    sx={{ ml: 10 }}
                >
                    Add Author
                </Button>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>New Author</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Email Address"
                            type="email"
                            fullWidth
                            variant="standard"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleClose}>Add</Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    };
    // add node form button
    const handleChange = (prop) => (event) => {
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
                        onChange={handleChange('type')}
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
                    onChange={handleChange('url')}
                />
                <TextField
                    fullWidth
                    sx={{ my: 1, mx: 1 }}
                    required
                    id="new-node-username"
                    label="username"
                    value={newNode.username}
                    onChange={handleChange('username')}
                />
                <TextField
                    fullWidth
                    sx={{ my: 1, mx: 1 }}
                    required
                    id="new-node-password"
                    label="password"
                    value={newNode.password}
                    onChange={handleChange('password')}
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
            {renderDialog()}
        </div>
    );
};

const mapStateToProps = (state, ownProps) => ({
    props: { ...ownProps.props, auth: state.auth },
});

export default connect(mapStateToProps)(Admin);
