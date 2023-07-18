import * as types from '../actionTypes';
import { bfaJsonService } from '../BFAServices/BFAJsonService';
import { getActiveOrders } from './activeOrderService';

export const fetchActiveOrderJsonDataBegin = data => ({
    type: types.FETCH_ACTIVE_ORDER_JSON_DATA_BEGIN,
    payload: { data }
});
export const fetchActiveOrderJsonDataFailure = data => ({
    type: types.FETCH_ACTIVE_ORDER_JSON_DATA_FAILURE,
    payload: { data }
});
export const fetchActiveOrderJsonDataSuccess = data => ({
    type: types.FETCH_ACTIVE_ORDER_JSON_DATA_SUCCESS,
    payload: { data }
});

export const fetchActiveOrderDataBegin = data => ({
    type: types.FETCH_ACTIVE_ORDER_DATA_BEGIN,
    payload: { data }
});
export const fetchActiveOrderDataFailure = data => ({
    type: types.FETCH_ACTIVE_ORDER_DATA_FAILURE,
    payload: { data }
});
export const fetchActiveOrderDataSuccess = data => ({
    type: types.FETCH_ACTIVE_ORDER_DATA_SUCCESS,
    payload: { data }
});

export const getActiveJSONData = (dispatch, paylaod) => {
    dispatch(fetchActiveOrderJsonDataBegin())
    return new Promise(resolve => {
        bfaJsonService(paylaod)
            .then(response => {
                dispatch(
                    fetchActiveOrderJsonDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch(/* istanbul ignore next */(error) => {
                dispatch(
                    fetchActiveOrderJsonDataFailure(
                        error
                    )
                );
            });
    });
}

export const fetchActiveOrder = (dispatch, paylaod) => {
    dispatch(fetchActiveOrderDataBegin())
    return new Promise(resolve => {
        getActiveOrders(paylaod)
            .then(response => {
                dispatch(
                    fetchActiveOrderDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch(/* istanbul ignore next */(error) => {
                dispatch(
                    fetchActiveOrderDataFailure(
                        error
                    )
                );
            });
    });
}

export const getOrderDates = (data,dispatch)=>{
    dispatch({
        type: types.GET_ORDER_DATES,
	    payload: { data }}
    )
}