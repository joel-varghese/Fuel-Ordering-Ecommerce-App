import * as types from '../actionTypes';
import { bfaJsonService } from '../BFAServices/BFAJsonService';
import { fetchCompanyDetails } from '../accountServices/accountCompanyService';

export const fetchPaymentDataBegin = data => ({
    type: types.FETCH_PAYMENT_JSON_DATA_BEGIN,
    payload: { data }
});
export const fetchPaymentJsonDataFailure = data => ({
    type: types.FETCH_PAYMENT_JSON_DATA_FAILURE,
    payload: { data }
});
export const fetchPaymentJsonDataSuccess = data => ({
    type: types.FETCH_PAYMENT_JSON_DATA_SUCCESS,
    payload: { data }
});
export const getPaymentDataSuccess = data => ({
    type: types.FETCH_PAYMENT_DATA_SUCCESS,
    payload: { data }
});
export const getPaymentDataFailure = data => ({
    type: types.FETCH_PAYMENT_DATA_FAILURE,
    payload: { data }
});

// Payment JSon Service 

export const fetchJSONData = (dispatch, paylaod) => {
    return new Promise(resolve => {
        bfaJsonService(paylaod)
            .then(response => {
                dispatch(
                    fetchPaymentJsonDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch(/* istanbul ignore next */(error) => {
                dispatch(
                    fetchPaymentJsonDataFailure(
                        error
                    )
                );
            });
    });
}

// Fetch Company Details Service 

export const fetchPaymentData = (dispatch, paylaod) => {
// 
return new Promise(resolve => {
    fetchCompanyDetails(paylaod)
        .then(response => {
            dispatch(
                getPaymentDataSuccess(
                    response
                )
            );
            resolve(response);
            return response;
        })
        .catch(/* istanbul ignore next */(error) => {
            dispatch(
                getPaymentDataFailure(
                    error
                )
            );
        });
});
}