import * as types from '../actionTypes';
import { bfaJsonService, bfaJsonLocalService } from '../BFAServices/BFAJsonService';
import { getFeeDetails } from './feeService';

export const fetchTaxFeesHomeDataBegin = data => ({
    type: types.FETCH_FEE_DATA_BEGIN,
    payload: { data }
});
export const fetchTaxFeesHomeDataFailure = data => ({
    type: types.FETCH_FEE_DATA_FAILURE,
    payload: { data }
});
export const fetchTaxFeesHomeDataSuccess = data => (
    {
        type: types.FETCH_FEE_DATA_SUCCESS,
        payload: { data }
    });
export const getFeeDataBegin = data => ({
    type: types.FETCH_FEE_DETAILS_BEGIN,
    payload: { data }
});
export const getFeeDataFailure = data => ({
    type: types.FETCH_FEE_DETAILS_FAILURE,
    payload: { data }
});
export const getFeeDataSuccess = data => (
    {
        type: types.FETCH_FEE_DETAILS_SUCCESS,
        payload: { data }
    });

    
export const feefetchJSONData = (payload, dispatch) => {
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

// Fetch Company Details Service 

export const fetchFeeData = (dispatch, paylaod) => {
    dispatch(getFeeDataBegin())
    return new Promise(resolve => {
        getFeeDetails(paylaod)
            .then(response => {
                dispatch(
                    getFeeDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch(/* istanbul ignore next */(error) => {
                dispatch(
                    getFeeDataFailure(
                        error
                    )
                );
            });
    });
    }



