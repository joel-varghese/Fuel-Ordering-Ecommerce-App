import * as types from '../../actions/actionTypes';
import { initialState } from '../initialState';

export default function accountLocationReducer(
	state,
	action
) {
	if (typeof state === 'undefined') {
		state = initialState.accountLocationReducer
	}
	switch (action.type) {
        case types.FETCH_ACCOUNT_LOCATION_DATA_BEGIN:
            
            return {
                ...state,
                loading: true,
                error: null
            };

        case types.FETCH_ACCOUNT_LOCATION_DATA_SUCCESS:
            return {
                ...state,
                loading: false,
                accountLocationJson: action.payload
            };

        case types.FETCH_ACCOUNT_LOCATION_DATA_FAILURE:
            
            return {
                ...state,
                loading: false,
                error: action.payload.error,
                accountLocationJson: {}
            };
            case types.FETCH_ACCOUNT_LOCATION_DATA_DATA_SUCCESS:
                return {
                    ...state,
                    loading: false,
                    accountLocationData: action.payload
                };
    
            case types.FETCH_ACCOUNT_LOCATION_DATA_DATA_FAILURE:
                
                return {
                    ...state,
                    loading: false,
                    error: action.payload.error,
                    accountLocationData: {}
                };

         default:
            return state;
	}
}