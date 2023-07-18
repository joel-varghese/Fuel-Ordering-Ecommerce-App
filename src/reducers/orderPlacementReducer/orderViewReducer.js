import * as types from '../../actions/actionTypes';
import { initialState } from '../initialState';

export default function orderViewDataReducer(
	state,
	action
) {
	if (typeof state === 'undefined') {
		state = initialState.orderViewDataReducer
	}
	switch (action.type) {
		case types.FETCH_ORDER_VIEW_JSON_BEGIN:
			
			return {
				...state,
				loading: true,
				error: null
			};

		case types.FETCH_ORDER_VIEW_JSON_SUCCESS:
			
			return {
				...state,
				loading: false,
				orderviewJson: action.payload
			};

		case types.FETCH_ORDER_VIEW_JSON_FAILURE:
			
			return {
				...state,
				loading: false,
				error: action.payload.error,
				orderviewJson: {}
			};
		
			
		default:
			// ALWAYS have a default case in a reducer
			return state;
	}
}