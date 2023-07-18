import * as types from '../actionTypes';
import {saveAuditLog, getAuditLog, getCategoryAndUser} from '../auditLog/auditLogService'

export const saveAuditLogDataBegin = data => ({
	type: types.SAVE_AUDIT_LOG_DATA_BEGIN,
	payload: { data }
});
export const saveAuditLogDataFailure = data => ({
	type: types.SAVE_AUDIT_LOG_DATA_FAILURE,
	payload: { data }
});
export const saveAuditLogDataSuccess = data => ({
	type: types.SAVE_AUDIT_LOG_DATA_SUCCESS,
	payload: { data }
});

export const getAuditLogDataBegin = data => ({
	type: types.GET_AUDIT_LOG_DATA_BEGIN,
	payload: { data }
});
export const getAuditLogDataFailure = data => ({
	type: types.GET_AUDIT_LOG_DATA_FAILURE,
	payload: { data }
});
export const getAuditLogDataSuccess = data => ({
	type: types.GET_AUDIT_LOG_DATA_SUCCESS,
	payload: { data }
});
export const getCategoryAndUserDataBegin = data => ({
	type: types.GET_CAT_USER_DATA_BEGIN,
	payload: { data }
});
export const getCategoryAndUserDataFailure = data => ({
	type: types.GET_CAT_USER_DATA_FAILURE,
	payload: { data }
});
export const getCategoryAndUserDataSuccess = data => ({
	type: types.GET_CAT_USER_DATA_SUCCESS,
	payload: { data }
});


export const saveAuditLogData = (paylaod,dispatch)=>{
   
    return new Promise(resolve => {

        saveAuditLog(paylaod)
            .then(response => {
                 dispatch(
                    saveAuditLogDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch((error) => {
                dispatch(
                    saveAuditLogDataFailure(
                        error
                    )
                );
            });
    });
       

}

export const getAuditLogData = (paylaod,dispatch)=>{
   
    return new Promise(resolve => {

        getAuditLog(paylaod)
            .then(response => {
                 dispatch(
                    getAuditLogDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch((error) => {
                dispatch(
                    getAuditLogDataFailure(
                        error
                    )
                );
            });
    });
       

}
export const getCategoryAndUserData = (paylaod,dispatch)=>{
   
    return new Promise(resolve => {

        getCategoryAndUser(paylaod)
            .then(response => {
                 dispatch(
                    getCategoryAndUserDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch((error) => {
                dispatch(
                    getCategoryAndUserDataFailure(
                        error
                    )
                );
            });
    });
       

}
