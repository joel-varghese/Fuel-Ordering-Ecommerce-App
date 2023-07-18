import * as types from '../actionTypes';
import { bfaJsonService } from '../BFAServices/BFAJsonService';
import { fetchCompanyDetails } from '../accountServices/accountCompanyService';

export const fetchAircraftDataBegin = data => ({
    type: types.FETCH_AIRCRAFT_JSON_DATA_BEGIN,
    payload: { data }
});
export const fetchAircraftJsonDataFailure = data => ({
    type: types.FETCH_AIRCRAFT_JSON_DATA_FAILURE,
    payload: { data }
});
export const fetchAircraftJsonDataSuccess = data => ({
    type: types.FETCH_AIRCRAFT_JSON_DATA_SUCCESS,
    payload: { data }
});
export const getAircraftDataSuccess = data => ({
    type: types.FETCH_AIRCRAFT_DATA_SUCCESS,
    payload: { data }
});
export const getAircraftDataFailure = data => ({
    type: types.FETCH_AIRCRAFT_DATA_FAILURE,
    payload: { data }
});

// Aircraft JSon Service 

export const fetchJSONData = (dispatch, paylaod) => {
    return new Promise(resolve => {
        bfaJsonService(paylaod)
            .then(response => {
                dispatch(
                    fetchAircraftJsonDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch(/* istanbul ignore next */(error) => {
                dispatch(
                    fetchAircraftJsonDataFailure(
                        error
                    )
                );
            });
    });
}

// Fetch Company Details Service 

export const fetchAircraftData = (dispatch, paylaod) => {
// 
return new Promise(resolve => {
    fetchCompanyDetails(paylaod)
        .then(response => {
            dispatch(
                getAircraftDataSuccess(
                    response
                )
            );
            resolve(response);
            return response;
        })
        .catch(/* istanbul ignore next */(error) => {
            dispatch(
                getAircraftDataFailure(
                    error
                )
            );
        });
});
}