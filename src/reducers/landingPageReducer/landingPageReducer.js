import * as types from '../../actions/actionTypes';
import { initialState } from '../initialState';

export default function LandingPageReducer(
	state,
	action
) {
	if (typeof state === 'undefined') {
		state = initialState.landingReducer
	}
	switch (action.type) {
		case types.FETCH_LANDING_JSON_DATA_BEGIN:
			
			return {
				...state,
				loading: true,
				error: null
			};

		case types.FETCH_LANDING_JSON_DATA_SUCCESS:
			
			return {
				...state,
				loading: false,
				landingJson: action.payload
			};

		case types.FETCH_LANDING_JSON_DATA_FAILURE:
			
			return {
				...state,
				loading: false,
				error: action.payload.error,
				landingJson: {}
			};
		default:
			// ALWAYS have a default case in a reducer
			return state;
	}
}