import * as types from '../actionTypes';
import { bfaJsonService } from '../BFAServices/BFAJsonService';
import { getUpdateProfile } from './dashboardServices';

export const fetchDashboardDataBegin = data => ({
	type: types.FETCH_DASHBOARD_DATA_BEGIN,
	payload: { data }
});
export const fetchDashboardDataFailure = data => ({
	type: types.FETCH_DASHBOARD_DATA_FAILURE,
	payload: { data }
});
export const fetchDashboardDataSuccess = data => ({
	type: types.FETCH_DASHBOARD_DATA_SUCCESS,
	payload: { data }
});

export const getUpdateProfileBegin = data => ({
	type: types.GET_UPDATE_PROFILE_BEGIN,
	payload: { data }
});
export const getUpdateProfileFailure = data => ({
	type: types.GET_UPDATE_PROFILE_FAILURE,
	payload: { data }
});
export const getUpdateProfileSuccess = data => ({
	type: types.GET_UPDATE_PROFILE_SUCCESS,
	payload: { data }
});


// dashboard JSon Service 

export const fetchJSONData = (dispatch,paylaod)=>{
        return new Promise(resolve => {
            bfaJsonService(paylaod)
                .then(response => {
                    dispatch(
                        fetchDashboardDataSuccess(
                            response
                        )
                    );
                    resolve(response);
                    return response;
                })
                .catch(/* istanbul ignore next */(error) => {
                    dispatch(
                        fetchDashboardDataFailure(
                            error
                        )
                    );
                });
        });
}
export const getUpdateProfileData = (dispatch,paylaod,profile,banner)=>{
    return new Promise(resolve => {
        getUpdateProfile(paylaod,profile,banner)
            .then(response => {
                dispatch(
                    getUpdateProfileSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch(error => {
                dispatch(
                    getUpdateProfileFailure(error)
                );
            });
    });
}