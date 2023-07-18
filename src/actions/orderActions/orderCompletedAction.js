import * as types from '../actionTypes';
import { bfaJsonService } from '../BFAServices/BFAJsonService';
import { getActiveOrders } from './activeOrderService';

export const fetchCompletedOrderJsonDataBegin = data => ({
    type: types.FETCH_COMPLETED_ORDER_JSON_DATA_BEGIN,
    payload: { data }
});
export const fetchCompletedOrderJsonDataFailure = data => ({
    type: types.FETCH_COMPLETED_ORDER_JSON_DATA_FAILURE,
    payload: { data }
});
export const fetchCompletedOrderJsonDataSuccess = data => ({
    type: types.FETCH_COMPLETED_ORDER_JSON_DATA_SUCCESS,
    payload: { data }
});

export const fetchCompletedOrderDataBegin = data => ({
    type: types.FETCH_COMPLETED_ORDER_DATA_BEGIN,
    payload: { data }
});
export const fetchCompletedOrderDataFailure = data => ({
    type: types.FETCH_COMPLETED_ORDER_DATA_FAILURE,
    payload: { data }
});
export const fetchCompletedOrderDataSuccess = data => ({
    type: types.FETCH_COMPLETED_ORDER_DATA_SUCCESS,
    payload: { data }
});

export const getJSONData = (dispatch, paylaod) => {
    dispatch(fetchCompletedOrderJsonDataBegin())
    return new Promise(resolve => {
        bfaJsonService(paylaod)
            .then(response => {
                dispatch(
                    fetchCompletedOrderJsonDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch(/* istanbul ignore next */(error) => {
                dispatch(
                    fetchCompletedOrderJsonDataFailure(
                        error
                    )
                );
            });
    });
}

export const getCompletedOrderData = (dispatch, paylaod) => {
    dispatch(fetchCompletedOrderDataBegin())
    return new Promise(resolve => {
        getActiveOrders(paylaod)
            .then(response => {
                dispatch(
                    fetchCompletedOrderDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch(/* istanbul ignore next */(error) => {
                dispatch(
                    fetchCompletedOrderDataFailure(
                        error
                    )
                );
            });
    });
}

export const getSearchValue = (data,dispatch)=>{
    dispatch({
        type: types.GET_SEARCH_ORDER_TABLE,
	    payload: { data }}
    )
}

export const getOrderRowData = (data,dispatch)=>{
    dispatch({
        type: types.GET_ORDER_ROW_DATA,
	    payload: { data }}
    )
}

export const getOrderMultiRowData = (data,dispatch)=>{
    dispatch({
        type: types.GET_ORDER_MULTIROW_DATA,
	    payload: { data }}
    )
}

export const getIsResolveDispute = (data,dispatch)=>{
    dispatch({
        type: types.GET_IS_RESOLVE_DISPUTE,
	    payload: { data }}
    )
}

export const getOrderTab = (data,dispatch)=>{
    dispatch({
        type: types.GET_SELECTED_TAB_ORDER,
	    payload: { data }}
    )
}

export const getIsMinDate = (data,dispatch)=>{
    dispatch({
        type: types.GET_IS_MINDATE,
	    payload: { data }}
    )
}

export const getIsMaxDate = (data,dispatch)=>{
    dispatch({
        type: types.GET_IS_MAXDATE,
	    payload: { data }}
    )
}