
import * as types from '../actionTypes';
import { bfaJsonService } from '../BFAServices/BFAJsonService';

export const fetchOrderViewHomeJsonBegin = (data)=>({
    type: types. FETCH_ORDER_VIEW_HOME_JSON_BEGIN,
    payload: { data }
})
export const fetchOrderViewHomeJsonSuccess = (data)=>({
    type: types. FETCH_ORDER_VIEW_HOME_JSON_SUCCESS,
    payload: { data }
})
export const fetchOrderViewHomeJsonFailure = (data)=>({
    type: types. FETCH_ORDER_VIEW_HOME_JSON_FAILURE,
    payload: { data }
})

export const fetchOrderViewHomeJson = (dispatch,payload)=>{
    fetchOrderViewHomeJsonBegin()
    return new Promise((resolve,reject)=>{
        bfaJsonService(payload).then((response)=>{
            if(response){
                dispatch(
                    fetchOrderViewHomeJsonSuccess(response)
                );
                resolve(response);
                return response;
            }
        }).catch((err)=>{
            dispatch(
                fetchOrderViewHomeJsonFailure(err)
            );
            reject(err)
        })
    })
}
export const getClickViewOrder = (dispatch,data)=>{
    dispatch({
        type: types.IS_CLICK_VIEW_ORDER,
	    payload: { data }}
    )
}