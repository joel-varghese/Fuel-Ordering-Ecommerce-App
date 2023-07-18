import * as types from '../../actions/actionTypes';
import { initialState } from '../initialState';

export default function orderActiveReducer(
    state,
    action
){
    if (typeof state === 'undefined') {
        state = initialState.orderActiveReducer
    }
    switch (action.type) {
        case types.FETCH_ACTIVE_ORDER_JSON_DATA_BEGIN:
			
			return {
				...state,
				loading: true,
				error: null
			};

		case types.FETCH_ACTIVE_ORDER_JSON_DATA_SUCCESS:
			
			return {
				...state,
				loading: false,
				orderActiveJson: action.payload
			};

		case types.FETCH_ACTIVE_ORDER_JSON_DATA_FAILURE:
			
			return {
				...state,
				loading: false,
				error: action.payload.error,
				orderActiveJson: {}
			};
		
		case types.FETCH_ACTIVE_ORDER_DATA_BEGIN:
		
		return {
			...state,
			loading: true,
			error: null
		};

		case types.FETCH_ACTIVE_ORDER_DATA_SUCCESS:
			
			return {
				...state,
				loading: false,
				orderActiveData: action.payload
			};

		case types.FETCH_ACTIVE_ORDER_DATA_FAILURE:
			
			return {
				...state,
				loading: false,
				error: action.payload.error,
				orderActiveData: {}
			};
        default:
            return state;
    }
}