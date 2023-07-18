import * as types from '../../actions/actionTypes';
import { initialState } from '../initialState';

export default function orderCompletedReducer(
    state,
    action
){
    if (typeof state === 'undefined') {
        state = initialState.orderCompletedReducer
    }
    switch (action.type) {
        case types.FETCH_COMPLETED_ORDER_JSON_DATA_BEGIN:
			
			return {
				...state,
				loading: true,
				error: null
			};

		case types.FETCH_COMPLETED_ORDER_JSON_DATA_SUCCESS:
			
			return {
				...state,
				orderCompletedJson: action.payload
			};

		case types.FETCH_COMPLETED_ORDER_JSON_DATA_FAILURE:
			
			return {
				...state,
				loading: false,
				error: action.payload.error,
				orderCompletedJson: {}
			};
		
		case types.FETCH_COMPLETED_ORDER_DATA_BEGIN:
		
		return {
			...state,
			loading: true,
			error: null
		};

		case types.FETCH_COMPLETED_ORDER_DATA_SUCCESS:
			
			return {
				...state,
				loading: false,
				orderCompletedData: action.payload
			};

		case types.FETCH_COMPLETED_ORDER_DATA_FAILURE:
			
			return {
				...state,
				loading: false,
				error: action.payload.error,
				orderCompletedData: {}
			};

		case types.GET_SEARCH_ORDER_TABLE:
		
		return {
			...state,
			error: null,
			searchValue: action.payload
		};
		
		case types.GET_ORDER_ROW_DATA:
		
		return {
			...state,
			error: null,
			orderRowData: action.payload
		};	

		case types.GET_ORDER_MULTIROW_DATA:
		
		return {
			...state,
			error: null,
			orderMultiRowData: action.payload
		};

		case types.GET_IS_RESOLVE_DISPUTE:
		
		return {
			...state,
			error: null,
			isResolveDispute: action.payload
		};	

		case types.GET_IS_MINDATE:
		
		return {
			...state,
			error: null,
			isMinDate: action.payload
		};

		case types.GET_IS_MAXDATE:
		
		return {
			...state,
			error: null,
			isMaxDate: action.payload
		};

		case types.GET_SELECTED_TAB_ORDER:
		
		return {
			...state,
			error: null,
			selectedTabOrder: action.payload
		};
        default:
            return state;
    }
}