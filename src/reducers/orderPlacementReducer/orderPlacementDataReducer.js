import * as types from '../../actions/actionTypes';
import { initialState } from '../initialState';

export default function orderPlacementDataReducer(
	state,
	action
) {
	if (typeof state === 'undefined') {
		state = initialState.orderPlacementDataReducer
	}
	switch (action.type) {
		case types.FETCH_ORDER_DATA_JSON_BEGIN:
			
			return {
				...state,
				loading: true,
				error: null
			};

		case types.FETCH_ORDER_DATA_JSON_SUCCESS:
			
			return {
				...state,
				loading: false,
				orderPlacementJson: action.payload
			};

		case types.FETCH_ORDER_DATA_JSON_FAILURE:
			
			return {
				...state,
				loading: false,
				error: action.payload.error,
				orderPlacementJson: {}
			};

		
				
		default:
			// ALWAYS have a default case in a reducer
			return state;
	}
}