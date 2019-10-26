import * as types from '../actions/types';
const initialState = [];



export default (state =initialState,action) =>{
    const {type,payload} =  action;
    switch (type) {
        case types.SET_ALERT:
            return [...state,payload];
            break;
        case types.REMOVE_ALERT:
             return state.filter(alert => alert.id !== payload );
            break;
        default:
            return state;
    }
}