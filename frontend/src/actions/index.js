import { SIGN_IN, SIGN_OUT } from './types';

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
