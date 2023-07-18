import * as types from '../../actions/actionTypes';
import { initialState } from '../initialState';

export default function footerReducer(
	state,
	action
) {
	if (typeof state === 'undefined') {
		state = initialState.footerReducer
	}
	switch (action.type) {
		case types.FETCH_FOOTER_JSON_DATA_BEGIN:
			
			return {
				...state,
				loading: true,
				error: null
			};

		case types.FETCH_FOOTER_JSON_DATA_SUCCESS:
			
			return {
				...state,
				loading: false,
				footerJson: action.payload
			};

		case types.FETCH_FOOTER_JSON_DATA_FAILURE:
			
			return {
				...state,
				loading: false,
				error: action.payload.error,
				footerJson: {}
			};
		default:
			// ALWAYS have a default case in a reducer
			return state;
	}
}