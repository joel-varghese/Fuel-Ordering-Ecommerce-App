import * as types from '../../actions/actionTypes';
import { initialState } from '../initialState';

export default function orderPlacementSummaryReducer(
	state,
	action
) {
	if (typeof state === 'undefined') {
		state = initialState.orderPlacementSummaryReducer
	}
	switch (action.type) {
		case types.FETCH_ORDER_SUMMARY_JSON_BEGIN:
			
			return {
				...state,
				loading: true,
				error: null
			};

		case types.FETCH_ORDER_SUMMARY_JSON_SUCCESS:
			
			return {
				...state,
				loading: false,
				orderPlacementSummaryJson: action.payload
			};

		case types.FETCH_ORDER_SUMMARY_JSON_FAILURE:
			
			return {
				...state,
				loading: false,
				error: action.payload.error,
				orderPlacementSummaryJson: {}
			};

		case types.SAVE_NOTIFICATION_SUCCESS:
			
				return {
					...state,
					loading: false,
					saveNotification: action.payload
				};
	
		case types.SAVE_NOTIFICATION_FAILURE:
			
				return {
					...state,
					loading: false,
					saveNotification: action.payload
				};
		default:
			// ALWAYS have a default case in a reducer
			return state;
	}
}