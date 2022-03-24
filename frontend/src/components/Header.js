import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { signOut } from '../actions';
import { NavLink, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';

const BACKEND_URL = 'https://www.socialdisturbutionnetworks.ca'; //process.env.REACT_APP_BACKEND_URL

const Header = (props) => {
    let navigate = useNavigate();
    Header.propTypes = {
        props: PropTypes.object,
        isSignedIn: PropTypes.bool,
        author: PropTypes.object,
        signOut: PropTypes.func,
    };
    const author_id = props.author ? props.author.id : null;
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    //handle logout
    const handleLogOut = () => {
        setAnchorElUser(null);
        axios
            .get(`${BACKEND_URL}/logout`, { withCredentials: true })
            .catch((error) => {
                if (error.response.status == 401) {
                    props.signOut();
                    navigate('/post');
                }
            });
    };
    //user menu
    const renderUserMenu = () => {
        return props.isSignedIn ? (
            <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
            >
                <MenuItem key="profile-page" onClick={handleCloseUserMenu}>
                    <NavLink
                        to={`authors/${author_id}`}
                        style={{ textDecoration: 'none' }}
                    >
                        <Typography textAlign="center">Profile</Typography>
                    </NavLink>
                </MenuItem>
                <MenuItem key="logout-button" onClick={handleLogOut}>
                    <NavLink to="/" style={{ textDecoration: 'none' }}>
                        <Typography textAlign="center">Sign out</Typography>
                    </NavLink>
                </MenuItem>
            </Menu>
        ) : (
            <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
            >
                <MenuItem key="login-button" onClick={handleCloseUserMenu}>
                    <NavLink to="/" style={{ textDecoration: 'none' }}>
                        <Typography textAlign="center">Go To Signin</Typography>
                    </NavLink>
                </MenuItem>
            </Menu>
        );
    };

    //page menu
    const renderPageMenu = () => {
        return props.isSignedIn ? (
            <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                    display: { xs: 'block', md: 'none' },
                }}
            >
                <MenuItem key="my-posts-page" onClick={handleCloseNavMenu}>
                    <NavLink
                        to={`authors/${author_id}/posts`}
                        style={{ textDecoration: 'none' }}
                    >
                        <Typography textAlign="center">My Posts</Typography>
                    </NavLink>
                </MenuItem>
                <MenuItem key="liked-page" onClick={handleCloseNavMenu}>
                    <NavLink
                        to={`authors/${author_id}/liked`}
                        style={{ textDecoration: 'none' }}
                    >
                        <Typography textAlign="center">Liked</Typography>
                    </NavLink>
                </MenuItem>
                <MenuItem key="Inbox" onClick={handleCloseNavMenu}>
                    <NavLink
                        to={`authors/${author_id}/inbox`}
                        style={{ textDecoration: 'none' }}
                    >
                        <Typography textAlign="center">Inbox</Typography>
                    </NavLink>
                </MenuItem>
            </Menu>
        ) : null;
    };
    //click on navlikes
    const onButtonClick = (link) => {
        handleCloseNavMenu();
        navigate(link);
    };
    const renderNavLinks = () => {
        return (
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                {props.isSignedIn ? (
                    <>
                        <Button
                            onClick={() => {
                                onButtonClick(`authors/${author_id}/posts`);
                            }}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            My Post
                        </Button>
                        <Button
                            onClick={() => {
                                onButtonClick(`authors/${author_id}/liked`);
                            }}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            Liked
                        </Button>
                        <Button
                            onClick={() => {
                                onButtonClick(`authors/${author_id}/inbox`);
                            }}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            Inbox
                        </Button>
                    </>
                ) : null}
            </Box>
        );
    };
    return (
        <AppBar position="static">
            <Container maxWidth="false">
                <Toolbar disableGutters>
                    <NavLink to={'/authors'} style={{ textDecoration: 'none' }}>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
                        >
                            Social Distribution
                        </Typography>
                    </NavLink>
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: 'flex', md: 'none' },
                        }}
                    >
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        {renderPageMenu()}
                    </Box>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{
                            flexGrow: 1,
                            display: { xs: 'flex', md: 'none' },
                        }}
                    >
                        Social Distribution
                    </Typography>

                    {renderNavLinks()}

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton
                                onClick={handleOpenUserMenu}
                                sx={{ p: 0 }}
                            >
                                <Avatar
                                    alt="Profile Pic"
                                    src={
                                        props.isSignedIn
                                            ? props.author.profileImage
                                            : ''
                                    }
                                />
                            </IconButton>
                        </Tooltip>
                        {renderUserMenu()}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};
const mapStateToProps = (state) => ({
    isSignedIn: state.auth.isSignedIn,
    author: state.auth.author,
});

export default connect(mapStateToProps, { signOut })(Header);
