import { combineReducers } from 'redux';
import authReducer from './authReducer';
import nodeReducer from './nodeReducer';

export default combineReducers({
    auth: authReducer,
    node: nodeReducer,
});
