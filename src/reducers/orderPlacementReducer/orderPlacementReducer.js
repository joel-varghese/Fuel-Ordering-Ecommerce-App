import * as types from '../../actions/actionTypes';
import { initialState } from '../initialState';

export default function orderPlacementReducer(
	state,
	action
) {
	if (typeof state === 'undefined') {
		state = initialState.orderPlacementReducer
	}
	switch (action.type) {
		case types.FETCH_ORDER_HOME_JSON_BEGIN:
			
			return {
				...state,
				loading: true,
				error: null
			};

		case types.FETCH_ORDER_HOME_JSON_SUCCESS:
			
			return {
				...state,
				loading: false,
				orderPlacementJson: action.payload
			};

		case types.FETCH_ORDER_HOME_JSON_FAILURE:
			
			return {
				...state,
				loading: false,
				error: action.payload.error,
				orderPlacementJson: {}
			};
		case types.SAVE_ORDER_DATA_BEGIN:
			
			return {
				...state,
				loading: false,
				error: null
			};

		case types.SAVE_ORDER_DATA_SUCCESS:
			
			return {
				...state,
				loading: false,
				orderedData: action.payload
			};

		case types.SAVE_ORDER_DATA_FAILURE:
			
			return {
				...state,
				loading: false,
				error: action.payload.error,
				orderedData: {}
			};

		case types.IS_MULTILEG:	
		
			return {
				...state,
				loading: false,
				isMultileg: action.payload
			};
		case types.FROM_LOCATION:	
		
			return {
				...state,
				loading: false,
				fromLocation: action.payload
			};
		case types.MULTIPLE_LEG:
		
			return {
				...state,
				loading: false,
				multipleLeg: action.payload
			};
		case types.IS_SUMMARY:
		
			return {
				...state,
				loading: false,
				isSummary: action.payload
			};
		case types.ORDER_ID:
			return {
				...state,
				loading: false,
				orderID: action.payload
			};
		case types.LEG_LEVEL:
			return {
				...state,
				loading: false,
				legLevel: action.payload
			};
		case types.IS_PRICE_PENDING:
			return {
				...state,
				loading: false,
				isPricePending: action.payload
			};
		case types.LEG_LEVEL:
			return {
				...state,
				loading: false,
				legLevel: action.payload
			};
		case types.LEG_DATA:
		
			return {
				...state,
				loading: false,
				multiLegData: action.payload
			};
		case types.FUEL_INFO:
		
			return {
				...state,
				loading: false,
				fuelInfo: action.payload
			};

		case types.IS_REORDER:
	
		return {
			...state,
			loading: false,
			isReorder: action.payload
		};	
	
		case types.IS_EDIT_SINGLE:
	
		return {
			...state,
			loading: false,
			isEditSingle: action.payload
		};

		case types.IS_EDIT_MULTIPLE:
	
		return {
			...state,
			loading: false,
			isEditMultiple: action.payload
		};

		case types.IS_PREVIOUS_SCREEN:
	
		return {
			...state,
			loading: false,
			isPreviousScreen: action.payload
		};

		case types.IS_ORDER_ACCEPT:
	
		return {
			...state,
			loading: false,
			isOrderAccept: action.payload
		};

		case types.IS_ORDER_CLOSE:
	
		return {
			...state,
			loading: false,
			isOrderClose: action.payload
		};

		case types.IS_MULTI_SUMMARY:
	
		return {
			...state,
			loading: false,
			isMultiSummary: action.payload
		};

		case types.CLEAR_ALL:
			return {
				...state,
				loading: false,
				clearAll: action.payload
			};
		case types.IS_MULTI_LEG_PRICE_PENDING:
			return {
				...state,
				loading: false,
				isMultiLedPricePending: action.payload
			};
		default:
			// ALWAYS have a default case in a reducer
			return state;
	}
}