import * as types from '../actionTypes';
import { bfaJsonService } from '../BFAServices/BFAJsonService';

export const fetchDemoDataBegin = data => ({
    type: types.FETCH_DEMO_JSON_DATA_BEGIN,
    payload: { data }
});
export const fetchDemoJsonDataFailure = data => ({
    type: types.FETCH_DEMO_JSON_DATA_FAILURE,
    payload: { data }
});
export const fetchDemoJsonDataSuccess = data => ({
    type: types.FETCH_DEMO_JSON_DATA_SUCCESS,
    payload: { data }
});
// Demo JSon Service 

export const fetchJSONData = (dispatch, paylaod) => {
    dispatch(fetchDemoDataBegin(null))
    return new Promise(resolve => {
        bfaJsonService(paylaod)
            .then(response => {
                dispatch(
                    fetchDemoJsonDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch(/* istanbul ignore next */(error) => {
                dispatch(
                    fetchDemoJsonDataFailure(
                        error
                    )
                );
            });
    });
}