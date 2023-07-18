import * as types from '../actionTypes';
import { bfaJsonService } from '../BFAServices/BFAJsonService';
import {getDiscountDetails,getTailNumbers,getOperatorsForBulkupload} from './discountService';

export const fetchDiscountJsonDataFailure = data => ({
    type: types.FETCH_DISCOUNT_JSON_DATA_FAILURE,
    payload: { data }
});

export const fetchDiscountJsonDataSuccess = data => ({
    type: types.FETCH_DISCOUNT_JSON_DATA_SUCCESS,
    payload: { data }
});

export const fetchDiscountJSONBegin = data => ({
    type: types.FETCH_DISCOUNT_JSON_DATA_BEGIN,
    payload: { data }
});

export const fetchDiscountDataFailure = data => ({
	type: types.FETCH_DISCOUNT_DATA_FAILURE,
	payload: { data }
});

export const fetchDiscountDataSuccess = data => ({
	type: types.FETCH_DISCOUNT_DATA_SUCCESS,
	payload: { data }
});

export const fetchDiscountDataBegin = data => ({
	type: types.FETCH_DISCOUNT_DATA_BEGIN,
	payload: { data }
});

export const getTailNumbersSuccess = data => ({
	type: types.FETCH_TAIL_NUMBERS_FAILURE,
	payload: { data }
});

export const getTailNumbersFailure = data => ({
	type: types.FETCH_TAIL_NUMBERS_SUCCESS,
	payload: { data }
});

export const fetchBUlkUploadJsonDataFailure = data => ({
    type: types.FETCH_BULK_UPLOAD_JSON_DATA_FAILURE,
    payload: { data }
});

export const fetchBUlkUploadJsonDataSuccess = data => ({
    type: types.FETCH_BULK_UPLOAD_JSON_DATA_SUCCESS,
    payload: { data }
});

export const getOperatorForBulkuploadFailure = data => ({
    type: types.FETCH_OPERATOR_FOR_BULK_UPLOAD_FAILURE,
    payload: { data }
});

export const getOperatorForBulkuploadSuccess = data => ({
    type: types.FETCH_OPERATOR_FOR_BULK_UPLOAD_SUCCESS,
    payload: { data }
});

export const getDiscountSelectedCompany = (company,dispatch)=>{
    dispatch({
        type: types.GET_DISCOUNT_SELECTED_COMPANY,
	    payload: { company }}
    )
}

export const fetchJSONData = (paylaod,dispatch)=>{
    dispatch(fetchDiscountJSONBegin())
    return new Promise(resolve => {
        bfaJsonService(paylaod)
            .then(response => {
                dispatch(
                    fetchDiscountJsonDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch((error) => {
                dispatch(
                    fetchDiscountJsonDataFailure(
                        error
                    )
                );
            });
    });
}

export const fetchDiscountData = (payload,dispatch)=>{
    dispatch(fetchDiscountDataBegin())
    return new Promise(resolve => {
        getDiscountDetails(payload)
            .then(response => {
                 dispatch(
                    fetchDiscountDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch((error) => {
                dispatch(
                    fetchDiscountDataFailure(
                        error
                    )
                );
            });
    });     
}

export const getTailNumbersList =(payload,dispatch)=>{
    return new Promise(resolve => {
        getTailNumbers(payload)
            .then(response => {
                 dispatch(
                    getTailNumbersSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch((error) => {
                dispatch(
                    getTailNumbersFailure(
                        error
                    )
                );
            });
      });
}

export const fetchBulkUploadJSONData = (paylaod,dispatch)=>{
    return new Promise(resolve => {
        bfaJsonService(paylaod)
            .then(response => {
                dispatch(
                    fetchBUlkUploadJsonDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch((error) => {
                dispatch(
                    fetchBUlkUploadJsonDataFailure(
                        error
                    )
                );
            });
    });
}

export const getOperatorForBulkupload =(payload,dispatch)=>{
    return new Promise(resolve => {
        getOperatorsForBulkupload(payload)
            .then(response => {
                 dispatch(
                    getOperatorForBulkuploadSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch((error) => {
                dispatch(
                    getOperatorForBulkuploadFailure(
                        error
                    )
                );
            });
      });
}
