import * as types from '../actionTypes';
import { bfaJsonService } from '../BFAServices/BFAJsonService';
import { fetchCompanyDetails } from '../accountServices/accountCompanyService';

export const fetchUserDataBegin = data => ({
    type: types.FETCH_USER_JSON_DATA_BEGIN,
    payload: { data }
});
export const fetchUserJsonDataFailure = data => ({
    type: types.FETCH_USER_JSON_DATA_FAILURE,
    payload: { data }
});
export const fetchUserJsonDataSuccess = data => ({
    type: types.FETCH_USER_JSON_DATA_SUCCESS,
    payload: { data }
});
export const getUserDataSuccess = data => ({
    type: types.FETCH_USER_DATA_SUCCESS,
    payload: { data }
});
export const getUserDataFailure = data => ({
    type: types.FETCH_USER_DATA_FAILURE,
    payload: { data }
});
export const getUserDataBegin = data => ({
    type: types.FETCH_USER_DATA_BEGIN,
    payload: { data }
});
// User JSon Service 

export const fetchJSONData = (dispatch, paylaod) => {
    dispatch(fetchUserDataBegin(null))
    return new Promise(resolve => {
        bfaJsonService(paylaod)
            .then(response => {
                dispatch(
                    fetchUserJsonDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch(/* istanbul ignore next */(error) => {
                dispatch(
                    fetchUserJsonDataFailure(
                        error
                    )
                );
            });
    });
}

// Fetch Company Details Service 

export const fetchUserData = (dispatch, paylaod) => {
dispatch(getUserDataBegin())
return new Promise(resolve => {
    fetchCompanyDetails(paylaod)
        .then(response => {
            dispatch(
                getUserDataSuccess(
                    response
                )
            );
            resolve(response);
            return response;
        })
        .catch(/* istanbul ignore next */(error) => {
            dispatch(
                getUserDataFailure(
                    error
                )
            );
        });
});
}