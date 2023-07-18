import * as types from '../../actions/actionTypes';
import { initialState } from '../initialState';

export default function initConfigReducer(
	state,
	action
) {
	if (typeof state === 'undefined') {
		state = initialState.initConfigReducer
	}
	switch (action.type) {
		case types.FETCH_INIT_CONFIG_DATA_BEGIN:
			
			return {
				...state,
				loading: true,
				error: null
			};

		case types.FETCH_CSRF_TOKEN:
			
			return {
				...state,
				loading: false,
				loginData: action.payload
			};

		case types.FETCH_LOGIN_DATA_FAILURE:
			
			return {
				...state,
				loading: false,
				error: action.payload.error,
				loginData: {}
			};

		case types.FETCH_LOGIN_DETAILS:
			
			return {
				...state,
				loading: false,
				error: null,
				loginDetails: action.payload
			};

		default:
			// ALWAYS have a default case in a reducer
			return state;
	}
}