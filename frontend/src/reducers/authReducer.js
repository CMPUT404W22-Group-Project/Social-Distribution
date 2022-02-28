import { SIGN_IN, SIGN_OUT } from '../actions/types';

const INTIAL_STATE = {
  isSignedIn: null,
  author: {
    type: 'author',
    id: 'http://127.0.0.1:5454/authors/1d698d25ff008f7538453c120f581471',
    url: 'http://127.0.0.1:5454/authors/1d698d25ff008f7538453c120f581471',
    host: 'http://127.0.0.1:5454/',
    displayName: 'Greg Johnson',
    github: 'http://github.com/gjohnson',
    profileImage: 'https://i.imgur.com/k7XVwpB.jpeg',
  },
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
