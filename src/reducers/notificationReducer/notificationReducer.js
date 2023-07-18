import * as types from '../../actions/actionTypes';
import { initialState } from '../initialState';

export default function notificationReducer(
	state,
	action
) {
	if (typeof state === 'undefined') {
		state = initialState.notificationReducer
	}
	switch (action.type) {
		case types.NOTIFICATION_DATA_BEGIN:
			
			return {
				...state,
				loading: true,
				error: null
			};

		case types.NOTIFICATION_DATA_SUCCESS:
			
			return {
				...state,
				loading: false,
				notificationData: action.payload
			};

		case types.NOTIFICATION_DATA_FAILURE:
			
			return {
				...state,
				loading: false,
				error: action.payload.error,
				notioficationData: {}
			};

		case types.SAVE_NOTIFICATION_SUCCESS:
			
				return {
					...state,
					loading: false,
					saveNotification: action.payload
				};
	
		case types.SAVE_NOTIFICATION_FAILURE:
			
				return {
					...state,
					loading: false,
					saveNotification: action.payload
				};
		default:
			// ALWAYS have a default case in a reducer
			return state;
	}
}