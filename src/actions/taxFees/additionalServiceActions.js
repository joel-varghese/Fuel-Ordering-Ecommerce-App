import * as types from '../actionTypes';
import { bfaJsonService, bfaJsonLocalService } from '../BFAServices/BFAJsonService';
import { getAddServiceDetails } from './additionalServices';

export const fetchTaxFeesHomeDataBegin = data => ({
    type: types.FETCH_ADDITIONALSERVICES_DATA_BEGIN,
    payload: { data }
});
export const fetchTaxFeesHomeDataFailure = data => ({
    type: types.FETCH_ADDITIONALSERVICES_FAILURE,
    payload: { data }
});
export const fetchTaxFeesHomeDataSuccess = data => (
    {
        type: types.FETCH_ADDITIONALSERVICES_DATA_SUCCESS,
        payload: { data }
    });
export const getAddServiceDataBegin = data => ({
    type: types.FETCH_ADDITIONALSERVICES_DETAILS_BEGIN,
    payload: { data }
});
export const getAddServiceDataFailure = data => ({
    type: types.FETCH_ADDITIONALSERVICES_DETAILS_FAILURE,
    payload: { data }
});
export const getAddServiceDataSuccess = data => (
    {
        type: types.FETCH_ADDITIONALSERVICES_DETAILS_SUCCESS,
        payload: { data }
    });
export const additionalServicefetchJSONData = (payload, dispatch) => {
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

//  Fetch Company Details Service 

export const fetchAddServiceData = (dispatch, paylaod) => {
    dispatch(getAddServiceDataBegin())
    return new Promise(resolve => {
        getAddServiceDetails(paylaod)
            .then(response => {
                dispatch(
                    getAddServiceDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch(/* istanbul ignore next */(error) => {
                dispatch(
                    getAddServiceDataFailure(
                        error
                    )
                );
            });
    });
    }



