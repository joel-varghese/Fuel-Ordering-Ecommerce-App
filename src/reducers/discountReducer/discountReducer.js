import * as types from '../../actions/actionTypes';
import { initialState } from '../initialState';

export default function discountReducer(state,action) { 
	if (typeof state === 'undefined') {
		state = initialState.discountReducer;
	}
	switch (action.type) {
		case types.FETCH_DISCOUNT_JSON_DATA_BEGIN:
			
			return {
				...state,
				loading: true,
				error: null
			};

		case types.FETCH_DISCOUNT_JSON_DATA_SUCCESS:
			
			return {
				...state,
				discountJson: action.payload
			};

		case types.FETCH_DISCOUNT_JSON_DATA_FAILURE:
			
			return {
				...state,
				error: action.payload.error,
				discountJson: {}
			};
			
        case types.FETCH_DISCOUNT_DATA_BEGIN:
			return {
				...state,
				loading: true,
				error: null
			};

		case types.FETCH_DISCOUNT_DATA_SUCCESS:
			return {
				...state,
				loading: false,
				discountData: action.payload
			};

		case types.FETCH_DISCOUNT_DATA_FAILURE:
			return {
				...state,
				loading: false,
				error: action.payload.error,
				discountData: {}
			};
			
	    case types.FETCH_BULK_UPLOAD_JSON_DATA_SUCCESS:
			return {
				...state,
				loading: false,
				bulkUploadJson: action.payload
			};

		case types.FETCH_BULK_UPLOAD_JSON_DATA_FAILURE:
			return {
				...state,
				loading: false,
				error: action.payload.error,
				bulkUploadJson: {}
			};

		case types.FETCH_OPERATOR_FOR_BULK_UPLOAD_SUCCESS:
			return {
				...state,
				loading: false,
				error: action.payload.error,
				bulkUploadData: action.payload
			};

		case types.FETCH_OPERATOR_FOR_BULK_UPLOAD_FAILURE:
			return {
				...state,
				loading: false,
				error: action.payload.error,
				bulkUploadData: {}
			};
		case types.GET_DISCOUNT_SELECTED_COMPANY:
                return {
                    ...state,
                    selectedCompany: action.payload
                };
		default:
			return state;
	}
}