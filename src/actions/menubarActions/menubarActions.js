import * as types from '../actionTypes';
import { bfaJsonService } from '../BFAServices/BFAJsonService';

export const fetchMenubarDataBegin = data => ({
    type: types.FETCH_MENUBAR_JSON_DATA_BEGIN,
    payload: { data }
});
export const fetchMenubarJsonDataFailure = data => ({
    type: types.FETCH_MENUBAR_JSON_DATA_FAILURE,
    payload: { data }
});
export const fetchMenubarJsonDataSuccess = data => ({
    type: types.FETCH_MENUBAR_JSON_DATA_SUCCESS,
    payload: { data }
});
// Menubar JSon Service 

export const fetchJSONData = (dispatch, paylaod) => {
    dispatch(fetchMenubarDataBegin(null))
    return new Promise(resolve => {
        bfaJsonService(paylaod)
            .then(response => {
                dispatch(
                    fetchMenubarJsonDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch(/* istanbul ignore next */(error) => {
                dispatch(
                    fetchMenubarJsonDataFailure(
                        error
                    )
                );
            });
    });
}