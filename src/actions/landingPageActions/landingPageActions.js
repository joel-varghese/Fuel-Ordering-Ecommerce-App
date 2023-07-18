import * as types from '../actionTypes';
import { bfaJsonService } from '../BFAServices/BFAJsonService';

export const fetchLandingDataBegin = data => ({
    type: types.FETCH_LANDING_JSON_DATA_BEGIN,
    payload: { data }
});
export const fetchLandingJsonDataFailure = data => ({
    type: types.FETCH_LANDING_JSON_DATA_FAILURE,
    payload: { data }
});
export const fetchLandingJsonDataSuccess = data => ({
    type: types.FETCH_LANDING_JSON_DATA_SUCCESS,
    payload: { data }
});
// Landing JSon Service 

export const fetchJSONData = (dispatch, paylaod) => {
    dispatch(fetchLandingDataBegin(null))
    return new Promise(resolve => {
        bfaJsonService(paylaod)
            .then(response => {
                dispatch(
                    fetchLandingJsonDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch(/* istanbul ignore next */(error) => {
                dispatch(
                    fetchLandingJsonDataFailure(
                        error
                    )
                );
            });
    });
}