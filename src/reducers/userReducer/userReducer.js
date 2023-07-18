import * as types from '../../actions/actionTypes';
import { initialState } from '../initialState';

export default function userReducer(
	state,
	action
) {
	if (typeof state === 'undefined') {
		state = initialState.userReducer
	}
	switch (action.type) {
		case types.FETCH_USER_JSON_DATA_BEGIN:
			
			return {
				...state,
				loading: true,
				error: null
			};

		case types.FETCH_USER_JSON_DATA_SUCCESS:
			
			return {
				loading: false,
				...state,
				userJson: action.payload
			};

		case types.FETCH_USER_JSON_DATA_FAILURE:
			
			return {
				...state,
				loading: false,
				error: action.payload.error,
				userJson: {}
			};
		case types.FETCH_USER_DATA_BEGIN:
		
			return {
				...state,
				loading: true,
				error: null
			};
		case types.FETCH_USER_DATA_FAILURE:
			
			return {
				...state,
				loading: false,
				error: action.payload.error,
				userData: {}
			};
		case types.FETCH_USER_DATA_SUCCESS:
			// console.log(action.payload)
			return {
				...state,
				loading: false,
				error: null,
				userData: action.payload
			};

		default:
			// ALWAYS have a default case in a reducer
			return state;
	}
}