import * as types from '../../actions/actionTypes';
import { initialState } from '../initialState';

export default function dashboardReducer(
	state,
	action
) {
	if (typeof state === 'undefined') {
		state = initialState.dashboardReducer
	}
	switch (action.type) {
		case types.FETCH_DASHBOARD_DATA_BEGIN:
			
			return {
				...state,
				loading: true,
				error: null
			};

		case types.FETCH_DASHBOARD_DATA_SUCCESS:
			
			return {
				...state,
				loading: false,
				dashboardJson: action.payload
			};

		case types.FETCH_DASHBOARD_DATA_FAILURE:
			
			return {
				...state,
				loading: false,
				error: action.payload.error,
				dashboardJson: {}
			};

		case types.GET_UPDATE_PROFILE_BEGIN:
			return {
				...state,
				loading: true,
				error: null
			};

		case types.GET_UPDATE_PROFILE_SUCCESS:
			return {
				...state,
				loading: false,
				profileData: action.payload
			};

		case types.GET_UPDATE_PROFILE_FAILURE:
			return {
				...state,
				loading: false,
				error: action.payload.error,
				profileData: {}
			};
		default:
			// ALWAYS have a default case in a reducer
			return state;
	}
}