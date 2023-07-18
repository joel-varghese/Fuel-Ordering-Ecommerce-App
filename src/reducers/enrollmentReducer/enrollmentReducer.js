import * as types from '../../actions/actionTypes';
import { initialState } from '../initialState';

export default function enrollmentReducer(
	state,
	action
) {
	if (typeof state === 'undefined') {
		state = initialState.notificationReducer
	}
	switch (action.type) {
		case types.ENROLLMENT_NEW_SUCCESS:
			
			return {
				...state,
				loading: false,
				enrollmentNewData: action.payload
			};

		case types.ENROLLMENT_NEW_FAILURE:
			
			return {
				...state,
				loading: false,
				error: action.payload.error,
				enrollmentNewData: {}
			};
        case types.ENROLLMENT_PENDING_SUCCESS:
			
                return {
                    ...state,
                    loading: false,
                    enrollmentPendingData: action.payload
                };
    
        case types.ENROLLMENT_PENDING_FAILURE:
                
                return {
                    ...state,
                    loading: false,
                    error: action.payload.error,
                    enrollmentPendingData: {}
                };
        case types.ENROLLMENT_COMPLETE_SUCCESS:
			
                    return {
                        ...state,
                        loading: false,
                        enrollmentCompleteData: action.payload
                    };
        
        case types.ONBOARDING_VIEW:
                    return {
                        ...state,
                        loading: false,
                        onboardingView: action.payload
                    };
        
        case types.ENROLLMENT_COMPLETE_FAILURE:
                    
                    return {
                        ...state,
                        loading: false,
                        error: action.payload.error,
                        enrollmentCompleteData: {}
                    };
		default:
			// ALWAYS have a default case in a reducer
			return state;
	}
}