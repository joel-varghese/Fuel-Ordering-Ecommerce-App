import * as types from '../../actions/actionTypes';
import { initialState } from '../initialState';

export default function accountCompanyReducer(
	state,
	action
) {
	if (typeof state === 'undefined') {
		state = initialState.accountCompanyReducer
	}
	switch (action.type) {
        case types.FETCH_ACCOUNT_COMPANY_DATA_BEGIN:
            
            return {
                ...state,
                loading: true,
                error: null
            };

        case types.FETCH_ACCOUNT_COMPANY_DATA_SUCCESS:
            return {
                ...state,
                loading: false,
                accountCompanyJson: action.payload
            };

        case types.FETCH_ACCOUNT_COMPANY_DATA_FAILURE:
            
            return {
                ...state,
                loading: false,
                error: action.payload.error,
                accountCompanyJson: {}
            };

         default:
            return state;
	}
}