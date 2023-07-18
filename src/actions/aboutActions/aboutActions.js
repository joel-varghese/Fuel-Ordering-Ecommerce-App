import * as types from '../actionTypes';
import { bfaJsonService } from '../BFAServices/BFAJsonService';

export const fetchAboutDataBegin = data => ({
    type: types.FETCH_ABOUT_JSON_DATA_BEGIN,
    payload: { data }
});
export const fetchAboutJsonDataFailure = data => ({
    type: types.FETCH_ABOUT_JSON_DATA_FAILURE,
    payload: { data }
});
export const fetchAboutJsonDataSuccess = data => ({
    type: types.FETCH_ABOUT_JSON_DATA_SUCCESS,
    payload: { data }
});
// About JSon Service 

export const fetchJSONData = (dispatch, paylaod) => {
    dispatch(fetchAboutDataBegin(null))
    return new Promise(resolve => {
        bfaJsonService(paylaod)
            .then(response => {
                dispatch(
                    fetchAboutJsonDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch(/* istanbul ignore next */(error) => {
                dispatch(
                    fetchAboutJsonDataFailure(
                        error
                    )
                );
            });
    });
}