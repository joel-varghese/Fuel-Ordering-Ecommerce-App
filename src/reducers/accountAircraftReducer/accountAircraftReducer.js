import * as types from '../../actions/actionTypes';
import { initialState } from '../initialState';

export default function aircraftReducer(
	state,
	action
) {
	if (typeof state === 'undefined') {
		state = initialState.aircraftReducer
	}
	switch (action.type) {
		case types.FETCH_AIRCRAFT_JSON_DATA_BEGIN:
			
			return {
				...state,
				loading: true,
				error: null
			};

		case types.FETCH_AIRCRAFT_JSON_DATA_SUCCESS:
			
			return {
				...state,
				loading: false,
				aircraftJson: action.payload
			};

		case types.FETCH_AIRCRAFT_JSON_DATA_FAILURE:
			
			return {
				...state,
				loading: false,
				error: action.payload.error,
				aircraftJson: {}
			};
		case types.FETCH_AIRCRAFT_DATA_FAILURE:
			
			return {
				...state,
				loading: false,
				error: action.payload.error,
				aircraftData: {}
			};
		case types.FETCH_AIRCRAFT_DATA_SUCCESS:
			console.log(action.payload)
			return {
				...state,
				loading: false,
				error: null,
				aircraftData: action.payload
			};

		default:
			// ALWAYS have a default case in a reducer
			return state;
	}
}