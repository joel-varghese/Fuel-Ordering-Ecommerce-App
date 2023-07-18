import * as types from '../actionTypes';
import { notificationlist,saveNotification,notificationUser, bulkNotify } from './notificationService';

export const notificationDataBegin = data => ({
	type: types.NOTIFICATION_DATA_BEGIN,
	payload: { data }
});
export const notificationDataFailure = data => ({
	type: types.NOTIFICATION_DATA_FAILURE,
	payload: { data }
});
export const notificationDataSuccess = data => ({
	type: types.NOTIFICATION_DATA_SUCCESS,
	payload: { data }
});
export const saveNotificationDataFailure = data => ({
	type: types.SAVE_NOTIFICATION_FAILURE,
	payload: { data }
});
export const saveNotificationDataSuccess = data => ({
	type: types.SAVE_NOTIFICATION_SUCCESS,
	payload: { data }
});

export const fetchNotificationList = (paylaod,dispatch)=>{
    return new Promise(resolve => {
        notificationlist(paylaod)
            .then(response => {
                dispatch(
                    notificationDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch((error) => {
                dispatch(
                    notificationDataFailure(
                        error
                    )
                );
            });
    });
}
export const saveNotificationList = (paylaod,dispatch)=>{
    return new Promise(resolve => {
        saveNotification(paylaod)
            .then(response => {
                dispatch(
                    saveNotificationDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch((error) => {
                dispatch(
                    saveNotificationDataFailure(
                        error
                    )
                );
            });
    });
}
export const bulkNotification = (paylaod,dispatch)=>{
    return new Promise(resolve => {
        bulkNotify(paylaod)
            .then(response => {
                dispatch(
                    saveNotificationDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch((error) => {
                dispatch(
                    saveNotificationDataFailure(
                        error
                    )
                );
            });
    });
}