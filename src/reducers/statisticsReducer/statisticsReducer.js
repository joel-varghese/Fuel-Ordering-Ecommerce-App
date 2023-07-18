import * as types from '../../actions/actionTypes';
import { initialState } from '../initialState';

export default function statisticsReducer(
	state,
	action
) {
	if (typeof state === 'undefined') {
		state = initialState.statisticsReducer
	}
	switch (action.type) {
		case types. FETCH_STATISTICS_DATA_BEGIN:
			
			return {
				...state,
				loading: true,
				error: null
			};

		case types. FETCH_STATISTICS_DATA_SUCCESS:
			
			return {
				...state,
				loading: false,
				statisticsData: action.payload
			};

		case types. FETCH_STATISTICS_DATA_FAILURE:
			
			return {
				...state,
				loading: false,
				error: action.payload.error,
				statisticsData: {}
			};
				default:
			// ALWAYS have a default case in a reducer
			return state;
	}
}