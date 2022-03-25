import { SIGN_IN, SIGN_OUT, EDIT_PROFILE, GET_NODES } from './types';
import axios from 'axios';
const BACKEND_URL = 'http://localhost:8000';
export const signIn = (author) => {
    return {
        type: SIGN_IN,
        payload: author,
    };
};

export const signOut = () => {
    return {
        type: SIGN_OUT,
    };
};

export const editProfile = (editedAuthor) => {
    return {
        type: EDIT_PROFILE,
        payload: editedAuthor,
    };
};

export const getNodes = () => (dispatch) => {
    axios.get(`${BACKEND_URL}/nodes`).then((response) => {
        dispatch({
            type: GET_NODES,
            payload: response.data,
        });
    });
};
