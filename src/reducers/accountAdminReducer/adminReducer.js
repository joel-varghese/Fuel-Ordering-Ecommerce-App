import * as types from '../../actions/actionTypes';
import { initialState } from '../initialState';

export default function AdminReducer(
    state,
    action
){
    if (typeof state === 'undefined') {
        state = initialState.AdminReducer
    }
    switch (action.type) {
        case types.GET_SELECTED_TAB_ADMIN:
		
        return {
            ...state,
            error: null,
            selectedTabAdmin: action.payload
        };

        case types.GET_IS_DEACTIVATE:
		
        return {
            ...state,
            error: null,
            isDeactivate: action.payload
        };

        case types.GET_INACTIVE_STATUS:
		
        return {
            ...state,
            error: null,
            inactive: action.payload
        };
        case types.GET_SYSTEM_VARIABLES:
		
        return {
            ...state,
            error: null,
            systemVariables: action.payload
        };
        default:
            return state;
}
}