import * as types from '../../actions/actionTypes';
import { initialState } from '../initialState';

export default function AboutReducer(
	state,
	action
) {
	if (typeof state === 'undefined') {
		state = initialState.aboutReducer
	}
	switch (action.type) {
		case types.FETCH_ABOUT_JSON_DATA_BEGIN:
			
			return {
				...state,
				loading: true,
				error: null
			};

		case types.FETCH_ABOUT_JSON_DATA_SUCCESS:
			
			return {
				...state,
				loading: false,
				aboutJson: action.payload
			};

		case types.FETCH_ABOUT_JSON_DATA_FAILURE:
			
			return {
				...state,
				loading: false,
				error: action.payload.error,
				aboutJson: {}
			};
		default:
			// ALWAYS have a default case in a reducer
			return state;
	}
}