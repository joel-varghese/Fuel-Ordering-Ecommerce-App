import * as types from '../../actions/actionTypes';
import { initialState } from '../initialState';

export default function searchFuelOrderReducer(
	state,
	action
) {
	if (typeof state === 'undefined') {
		state = initialState.searchFuelOrderReducer
	}
	switch (action.type) {
		case types.FETCH_SEARCHFUEL_JSON_DATA_BEGIN:
			
			return {
				...state,
				loading: false,
				error: null
			};

		case types.FETCH_SEARCHFUEL_JSON_DATA_SUCCESS:
			
			return {
				...state,
				loading: false,
				searchFuelOrderJson: action.payload
			};

		case types.FETCH_SEARCHFUEL_JSON_DATA_FAILURE:
			
			return {
				...state,
				loading: false,
				error: action.payload.error,
				searchFuelOrderJson: {}
			};
		case types.FETCH_SEARCHFUEL_DATA_SUCCESS:
		
			return {
				...state,
				loading: false,
				searchFuelOrderData: action.payload
			};

		case types.FETCH_SEARCHFUEL_DATA_FAILURE:
			
			return {
				...state,
				loading: false,
				error: action.payload.error,
				searchFuelOrderData: {}
			};	

		case types.FETCH_SEARCHFUEL_RESULT_BEGIN:

			return {
				...state,
				loading: true,
				searchFuelResult: {},
				error: null
			};	
		case types.FETCH_SEARCHFUEL_RESULT_SUCCESS:
	
			return {
				...state,
				loading: false,
				searchFuelResult: action.payload
			};

		case types.FETCH_SEARCHFUEL_RESULT_FAILURE:
			
			return {
				...state,
				loading: false,
				error: action.payload.error,
				searchFuelResult: {}
			};	

		case types.FETCH_PREFFEREDFBO_RESULT_BEGIN:

		return {
			...state,
			loading: true,
			error: null
		};	
		case types.FETCH_PREFFEREDFBO_RESULT_SUCCESS:
	
			return {
				...state,
				loading: false,
				prefferedFboResult: action.payload
			};

		case types.FETCH_PREFFEREDFBO_RESULT_FAILURE:
			
			return {
				...state,
				loading: false,
				error: action.payload.error,
				prefferedFboResult: {}
			};	

		case types.GET_ORDER_DETAILS:
		
			return {
				...state,
				error: null,
				orderDetails: action.payload
			};	
		case types.GET_MOBILE_ORDER_DETAILS:
			return {
				...state,
				error: null,
				orderMobileDetails: action.payload
			};	
		default:
			// ALWAYS have a default case in a reducer
			return state;
	}
}