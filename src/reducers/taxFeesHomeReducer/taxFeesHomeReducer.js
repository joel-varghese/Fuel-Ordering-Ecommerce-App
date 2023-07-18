import * as types from '../../actions/actionTypes';
import { initialState } from '../initialState';

export default function taxFeesHomeReducer(
	state,
	action
) {
	if (typeof state === 'undefined') {
		state = initialState.taxFeesHomeReducer
	}
	switch (action.type) {
        
        case types.FETCH_TAX_FEES_DATA_BEGIN:
            return {
                ...state,
                loading: true,
                error: null
            };

        case types.FETCH_TAX_FEES_DATA_SUCCESS:
            // console.log('action.payload', action.payload)
            return {
                ...state,
                loading: false,
                taxFeesHomeJson: action.payload && action.payload.data && action.payload.data.data
            };

        case types.FETCH_TAX_FEES_DATA_FAILURE:
            
            return {
                ...state,
                loading: false,
                error: action.payload.error,
                taxFeesHomeJson: {}
            };

        case types.GET_SELECTED_USER_TAX:
        
            return {
                ...state,
                loading: false,
                error: null,
                selectedUser: action.payload
            };
        case types.GET_SELECTED_COMPANY_TAX:

            return {
                ...state,
                loading: false,
                selectedCompany: action.payload
            };
        case types.GET_SELECTED_TAB_TAX:
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