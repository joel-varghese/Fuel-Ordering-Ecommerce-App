import * as types from '../../actions/actionTypes';
import { initialState } from '../initialState';

export default function multiLegReducer(
	state,
	action
) {
	if (typeof state === 'undefined') {
		state = initialState.multiLegReducer
	}
	switch (action.type) {
		case types.MULTI_LEG_JSON_BEGIN:
			
			return {
				...state,
				loading: true,
				error: null
			};

		case types.MULTI_LEG_JSON_SUCCESS:
			
			return {
				...state,
				loading: false,
				multiLegJson: action.payload
			};

		case types.MULTI_LEG_JSON_FAILURE:
			
			return {
				...state,
				loading: false,
				error: action.payload.error,
				multiLegJson: {}
			};
		case types.EDIT_LEG_DATA:
			
			return {
				...state,
				loading: false,
				editLegData: action.payload
			};
		case types.IS_EDIT:
			
			return {
				...state,
				loading: false,
				isEdit: action.payload
			};
		
		default:
			// ALWAYS have a default case in a reducer
			return state;
	}
}