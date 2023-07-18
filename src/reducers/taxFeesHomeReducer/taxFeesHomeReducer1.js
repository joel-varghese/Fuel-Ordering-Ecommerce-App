import * as types from '../../actions/actionTypes';
import { initialState } from '../initialState';

export default function taxFeesHomeReducer1(
	state,
	action
) {
	if (typeof state === 'undefined') {
		state = initialState.taxFeesHomeReducer1
	}
	switch (action.type) {
        
        case types.FETCH_TAX_DATA_BEGIN:
            return {
                ...state,
                loading: true,
                error: null
            };

        case types.FETCH_TAX_DATA_SUCCESS:
            // console.log('action.payload', action.payload)
            return {
                ...state,
                loading: false,
                taxFeesHomeJson1: action.payload && action.payload.data && action.payload.data.data
            };

        case types.FETCH_TAX_DATA_FAILURE:
            
            return {
                ...state,
                loading: false,
                error: action.payload.error,
                taxFeesHomeJson1: {}
            };

        case types.GET_SELECTED_USER:
        
            return {
                ...state,
                loading: false,
                error: null,
                selectedUser: action.payload
            };
            case types.GET_SELECTED_TAB:
        
                return {
                    ...state,
                    loading: false,
                    error: null,
                    selectedTab: action.payload
                };
    
            
            default:
            return state;
	}
}