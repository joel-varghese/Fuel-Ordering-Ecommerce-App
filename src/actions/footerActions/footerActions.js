import * as types from '../actionTypes';
import { bfaJsonService } from '../BFAServices/BFAJsonService';

export const fetchFooterDataBegin = data => ({
    type: types.FETCH_FOOTER_JSON_DATA_BEGIN,
    payload: { data }
});
export const fetchFooterJsonDataFailure = data => ({
    type: types.FETCH_FOOTER_JSON_DATA_FAILURE,
    payload: { data }
});
export const fetchFooterJsonDataSuccess = data => ({
    type: types.FETCH_FOOTER_JSON_DATA_SUCCESS,
    payload: { data }
});
// Footer JSon Service 

export const fetchJSONData = (dispatch, paylaod) => {
    dispatch(fetchFooterDataBegin(null))
    return new Promise(resolve => {
        bfaJsonService(paylaod)
            .then(response => {
                dispatch(
                    fetchFooterJsonDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch(/* istanbul ignore next */(error) => {
                dispatch(
                    fetchFooterJsonDataFailure(
                        error
                    )
                );
            });
    });
}