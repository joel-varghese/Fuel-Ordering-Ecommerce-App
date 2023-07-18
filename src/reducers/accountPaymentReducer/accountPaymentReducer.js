import * as types from '../../actions/actionTypes';
import { initialState } from '../initialState';

export default function paymentReducer(
	state,
	action
) {
	if (typeof state === 'undefined') {
		state = initialState.paymentReducer
	}
	switch (action.type) {
		case types.FETCH_PAYMENT_JSON_DATA_BEGIN:
			
			return {
				...state,
				loading: true,
				error: null
			};

		case types.FETCH_PAYMENT_JSON_DATA_SUCCESS:
			
			return {
				...state,
				loading: false,
				paymentJson: action.payload
			};

		case types.FETCH_PAYMENT_JSON_DATA_FAILURE:
			
			return {
				...state,
				loading: false,
				error: action.payload.error,
				paymentJson: {}
			};
		case types.FETCH_PAYMENT_DATA_FAILURE:
			
			return {
				...state,
				loading: false,
				error: action.payload.error,
				paymentData: {}
			};
		case types.FETCH_PAYMENT_DATA_SUCCESS:
			console.log(action.payload)
			return {
				...state,
				loading: false,
				error: null,
				paymentData: action.payload
			};

		default:
			// ALWAYS have a default case in a reducer
			return state;
	}
}