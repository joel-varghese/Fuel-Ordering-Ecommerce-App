import * as types from '../../actions/actionTypes';
import { initialState } from '../initialState';

export default function loginReducer(
	state,
	action
) {
	if (typeof state === 'undefined') {
		state = initialState.loginReducer
	}
	switch (action.type) {
		case types.FETCH_LOGIN_DATA_BEGIN:
			
			return {
				...state,
				loading: true,
				error: null
			};

		case types.FETCH_LOGIN_DATA_SUCCESS:
			
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

		case types.GET_LOGGEDIN_ACCESS_LEVEL:
				return {
					...state,
					loading: false,
					error: null,
					loginAccessLevel: action.payload
				};
		default:
			// ALWAYS have a default case in a reducer
			return state;
	}
}