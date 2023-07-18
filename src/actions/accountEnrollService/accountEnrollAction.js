import * as types from '../actionTypes';
import { enrollmentNew,enrollmentPending,enrollmentComplete,enrollmentSave } from './accountEnrollService';


export const enrollmentNewFailure = data => ({
	type: types.ENROLLMENT_NEW_FAILURE,
	payload: { data }
});
export const enrollmentNewSuccess = data => ({
	type: types.ENROLLMENT_NEW_SUCCESS,
	payload: { data }
});
export const enrollmentPendingFailure = data => ({
	type: types.ENROLLMENT_PENDING_FAILURE,
	payload: { data }
});
export const enrollmentPendingSuccess = data => ({
	type: types.ENROLLMENT_PENDING_SUCCESS,
	payload: { data }
});
export const enrollmentCompleteFailure = data => ({
	type: types.ENROLLMENT_COMPLETE_FAILURE,
	payload: { data }
});
export const enrollmentCompleteSuccess = data => ({
	type: types.ENROLLMENT_COMPLETE_SUCCESS,
	payload: { data }
});
export const getOnboardingView = (data,dispatch)=>{
    dispatch({
        type: types.ONBOARDING_VIEW,
	    payload: { data }}
    )
};

export const newEnrollmentList = (dispatch)=>{
    return new Promise(resolve => {
        enrollmentNew()
            .then(response => {
                dispatch(
                    enrollmentNewSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch((error) => {
                dispatch(
                    enrollmentNewFailure(
                        error
                    )
                );
            });
    });
}
export const pendingEnrollmentList = (dispatch)=>{
    return new Promise(resolve => {
        enrollmentPending()
            .then(response => {
                dispatch(
                    enrollmentPendingSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch((error) => {
                dispatch(
                    enrollmentPendingFailure(
                        error
                    )
                );
            });
    });
}
export const completeEnrollmentList = (dispatch)=>{
    return new Promise(resolve => {
        enrollmentComplete()
            .then(response => {
                dispatch(
                    enrollmentCompleteSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch((error) => {
                dispatch(
                    enrollmentCompleteFailure(
                        error
                    )
                );
            });
    });
}