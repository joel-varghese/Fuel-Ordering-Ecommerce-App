import * as types from '../../actions/actionTypes';
import { initialState } from '../initialState';

export default function activeOrderReducer(
    state,
    action
){
    if (typeof state === 'undefined') {
        state = initialState.activeOrderReducer
    }
    switch (action.type) {
        case types.GET_ORDER_DATES:
            return {
                ...state,
                orderDates: {...action.payload}
            };
        default:
            return state;
    }
}