import * as types from '../../actions/actionTypes';
import { initialState } from '../initialState';

export default function documentReducer(
	state,
	action
) {
	if (typeof state === 'undefined') {
		state = initialState.documentReducer
	}
	switch (action.type) {
		case types.FETCH_DOCUMENT_JSON_DATA_BEGIN:
			
			return {
				...state,
				loading: true,
				error: null
			};

		case types.FETCH_DOCUMENT_JSON_DATA_SUCCESS:
			
			return {
				...state,
				loading: false,
				documentJson: action.payload
			};

		case types.FETCH_DOCUMENT_JSON_DATA_FAILURE:
			
			return {
				...state,
				loading: false,
				error: action.payload.error,
				documentJson: {}
			};
		case types.FETCH_DOCUMENT_DATA_BEGIN:
		
			return {
				...state,
				fileData: true,
				error: null
			};
	
		case types.FETCH_DOCUMENT_DATA_FAILURE:
			
			return {
				...state,
				fileData: false,
				error: action.payload.error,
				documentData: {}
			};
		case types.FETCH_DOCUMENT_DATA_SUCCESS:
			console.log(action.payload)
			return {
				...state,
				fileData: false,
				error: null,
				documentData: action.payload
			};

		default:
			// ALWAYS have a default case in a reducer
			return state;
	}
}