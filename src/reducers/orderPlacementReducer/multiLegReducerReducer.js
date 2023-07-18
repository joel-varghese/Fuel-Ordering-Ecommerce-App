import * as types from '../../actions/actionTypes';
import { initialState } from '../initialState';

export default function multiLegSummaryReducer(
	state,
	action
) {
	if (typeof state === 'undefined') {
		state = initialState.multiLegSummaryReducer
	}
	switch (action.type) {
		case types.MULTI_LEG_SUMMARY_JSON_BEGIN:
			
			return {
				...state,
				loading: true,
				error: null
			};

		case types.MULTI_LEG_SUMMARY_JSON_SUCCESS:
			
			return {
				...state,
				loading: false,
				multiLegSummaryJson: action.payload
			};

		case types.MULTI_LEG_SUMMARY_JSON_FAILURE:
			
			return {
				...state,
				loading: false,
				error: action.payload.error,
				multiLegSummaryJson: {}
			};
		
		default:
			// ALWAYS have a default case in a reducer
			return state;
	}
}