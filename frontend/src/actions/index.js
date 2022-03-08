import { SIGN_IN, SIGN_OUT, EDIT_PROFILE } from './types';

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
