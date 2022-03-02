import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { signIn } from '../../actions';
import './Login.css';

const Login = (props) => {
  let navigate = useNavigate();
  Login.propTypes = {
    props: PropTypes.object,
    isSignedIn: PropTypes.bool,
    author: PropTypes.object,
    signIn: PropTypes.func,
  };

  useEffect(() => {
    props.isSignedIn ? navigate('/posts') : null;
  }, [props.isSignedIn]);
  const handleSignIn = () => {
    const mockAuthor = {
      type: 'author',
      id: 'http://127.0.0.1:5454/authors/1d698d25ff008f7538453c120f581471',
      url: 'http://127.0.0.1:5454/authors/1d698d25ff008f7538453c120f581471',
      host: 'http://127.0.0.1:5454/',
      displayName: 'Greg Johnson',
      github: 'http://github.com/gjohnson',
      profileImage: 'https://i.imgur.com/k7XVwpB.jpeg',
    };
    props.signIn(mockAuthor);
  };
  return (
    <div className="login-container">
      <button
        className="btn-auth btn-github large"
        onClick={() => {
          handleSignIn();
        }}
      >
        Sign in with <b>GitHub</b>
      </button>
    </div>
  );
};
const mapStateToProps = (state) => ({
  isSignedIn: state.auth.isSignedIn,
  author: state.auth.author,
});

export default connect(mapStateToProps, { signIn })(Login);
