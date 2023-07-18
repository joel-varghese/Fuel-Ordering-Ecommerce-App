import * as types from '../../actions/actionTypes';
import { initialState } from '../initialState';

export default function AuditLogReducer(
	state,
	action
) {
	if (typeof state === 'undefined') {
		state = initialState.auditLogReducer
	}
	switch (action.type) {
		case types.SAVE_AUDIT_LOG_DATA_BEGIN:
			
			return {
				...state,
				loading: true,
				error: null
			};

		case types.SAVE_AUDIT_LOG_DATA_SUCCESS:
			
			return {
				...state,
				loading: false,
				auditLogSaveJson: action.payload
			};

		case types.SAVE_AUDIT_LOG_DATA_FAILURE:
			
			return {
				...state,
				loading: false,
				error: action.payload.error,
				auditLogJson: {}
			};
			case types.GET_AUDIT_LOG_DATA_BEGIN:
			
			return {
				...state,
				loading: true,
				error: null
			};

		case types.GET_AUDIT_LOG_DATA_SUCCESS:
			
			return {
				...state,
				loading: false,
				auditLogJson: action.payload
			};

		case types.GET_AUDIT_LOG_DATA_FAILURE:
			
			return {
				...state,
				loading: false,
				error: action.payload.error,
				auditLogSaveJson: {}
			};
			case types.GET_CAT_USER_DATA_BEGIN:
			
			return {
				...state,
				loading: true,
				error: null
			};

		case types.GET_CAT_USER_DATA_SUCCESS:
			
			return {
				...state,
				loading: false,
				auditCatUserJson: action.payload
			};

		case types.GET_CAT_USER_DATA_FAILURE:
			
			return {
				...state,
				loading: false,
				error: action.payload.error,
				auditCatUserJson: {}
			};
		default:
			// ALWAYS have a default case in a reducer
			return state;
	}
}