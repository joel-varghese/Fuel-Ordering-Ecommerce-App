import * as types from '../actionTypes';
import { bfaJsonService, bfaJsonLocalService } from '../BFAServices/BFAJsonService';
import { getTaxDetails } from './taxService';

export const fetchTaxFeesHomeDataBegin = data => ({
    type: types.FETCH_TAX_DATA_BEGIN,
    payload: { data }
});
export const fetchTaxFeesHomeDataFailure = data => ({
    type: types.FETCH_TAX_DATA_FAILURE,
    payload: { data }
});
export const fetchTaxFeesHomeDataSuccess = data => (
    {
        type: types.FETCH_TAX_DATA_SUCCESS,
        payload: { data }
    });

export const getTaxDataBegin = data => ({
    type: types.FETCH_TAX_DETAILS_BEGIN,
    payload: { data }
});
export const getTaxDataFailure = data => ({
    type: types.FETCH_TAX_DETAILS_FAILURE,
    payload: { data }
});
export const getTaxDataSuccess = data => (
    {
        type: types.FETCH_TAX_DETAILS_SUCCESS,
        payload: { data }
    });


export const taxfetchJSONData = (payload, dispatch) => {
    return new Promise(resolve => {
        bfaJsonService(payload)
            .then(response => {
                dispatch(
                    fetchTaxFeesHomeDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch((error) => {
                dispatch(
                    fetchTaxFeesHomeDataFailure(
                        error
                    )
                );
            });
    });
}

// Fetch Tax Details Service 

export const fetchTaxData = (dispatch, paylaod) => {
    dispatch(getTaxDataBegin())
    return new Promise(resolve => {
        getTaxDetails(paylaod)
            .then(response => {
                if (response) {
                    dispatch(
                        getTaxDataSuccess(
                            response
                        )
                    );
                }
                resolve(response);
                return response;
            })
            .catch((error) => {
                dispatch(
                    getTaxDataFailure(
                        error
                    )
                );
            });
    });
}

