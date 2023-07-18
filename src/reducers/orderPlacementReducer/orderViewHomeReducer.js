import * as types from '../../actions/actionTypes';
import { initialState } from '../initialState';

export default function orderViewHomeReducer(
	state,
	action
) {
	if (typeof state === 'undefined') {
		state = initialState.orderViewHomeReducer
	}
	switch (action.type) {
		case types.FETCH_ORDER_VIEW_HOME_JSON_BEGIN:
			
			return {
				...state,
				loading: true,
				error: null
			};

		case types.FETCH_ORDER_VIEW_HOME_JSON_SUCCESS:
			
			return {
				...state,
				loading: false,
				orderviewHomeJson: action.payload
			};

		case types.FETCH_ORDER_VIEW_HOME_JSON_FAILURE:
			
			return {
				...state,
				loading: false,
				error: action.payload.error,
				orderviewHomeJson: {}
			};
		case types.IS_CLICK_VIEW_ORDER:
			return {
				...state,
				loading: false,
				isClickViewOrder: action.payload?.data
			};
		
			
		default:
			// ALWAYS have a default case in a reducer
			return state;
	}
}