import { SIGN_IN, SIGN_OUT } from '../actions/types';

const INTIAL_STATE = {
  isSignedIn: null,
  author: {},
};

export default (state = INTIAL_STATE, action) => {
  switch (action.type) {
    case SIGN_IN:
      return { ...state, isSignedIn: true, author: action.payload };
    case SIGN_OUT:
      return { ...state, isSignedIn: false, author: null };
    default:
      return state;
  }
};
