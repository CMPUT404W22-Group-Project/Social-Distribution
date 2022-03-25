import { GET_NODES } from '../actions/types';

const INTIAL_STATE = {
    nodes: [],
};

export default (state = INTIAL_STATE, action) => {
    switch (action.type) {
        case GET_NODES:
            return { ...state, nodes: action.payload };
        default:
            return state;
    }
};
