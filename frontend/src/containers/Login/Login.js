import React, { useEffect } from 'react';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { signIn } from '../../actions';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();
const BACKEND_URL = 'https://www.socialdisturbutionnetworks.ca'; //process.env.REACT_APP_BACKEND_URL
function Copyright(props) {
    return (
        <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            {...props}
        >
            {'Copyright © '}
            <Link color="inherit" href="http://localhost:3000">
                Social Distribution
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const Login = (props) => {
    let navigate = useNavigate();
    Login.propTypes = {
        props: PropTypes.object,
        isSignedIn: PropTypes.bool,
        author: PropTypes.object,
        signIn: PropTypes.func,
    };

    useEffect(() => {
        props.isSignedIn ? navigate('/public/posts') : null;
    }, [props.isSignedIn]);

    //sumbit form
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        logIn(data.get('email'), data.get('password'));
    };

    //sign in
    const logIn = (email, password) => {
        axios
            .post(
                `${BACKEND_URL}/login`,
                {
                    email: email,
                    password: password,
                },
                { withCredentials: true }
            )
            .then((response) => {
                console.log(response);
                if (response.status === 200) {
                    props.signIn(response.data);
                    navigate('/public/posts');
                }
            })
            .catch((error) => {
                alert(error.response.data.error);
            });
    };
    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{ mt: 1 }}
                    >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs></Grid>
                            <Grid item>
                                <NavLink to="/signup">
                                    {"Don't have an account? Sign Up"}
                                </NavLink>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider>
    );
};
const mapStateToProps = (state) => ({
    isSignedIn: state.auth.isSignedIn,
    author: state.auth.author,
});

export default connect(mapStateToProps, { signIn })(Login);
