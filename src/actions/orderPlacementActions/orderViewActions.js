
import * as types from '../actionTypes';
import { bfaJsonService } from '../BFAServices/BFAJsonService';

export const fetchOrderViewJsonBegin = (data)=>({
    type: types. FETCH_ORDER_VIEW_JSON_BEGIN,
    payload: { data }
})
export const fetchOrderViewJsonSuccess = (data)=>({
    type: types. FETCH_ORDER_VIEW_JSON_SUCCESS,
    payload: { data }
})
export const fetchOrderViewJsonFailure = (data)=>({
    type: types. FETCH_ORDER_VIEW_JSON_FAILURE,
    payload: { data }
})

export const fetchOrderViewJson = (dispatch,payload)=>{
    fetchOrderViewJsonBegin()
    return new Promise((resolve,reject)=>{
        bfaJsonService(payload).then((response)=>{
            if(response){
                dispatch(
                    fetchOrderViewJsonSuccess(response)
                );
                resolve(response);
                return response;
            }
        }).catch((err)=>{
            dispatch(
                fetchOrderViewJsonFailure(err)
            );
            reject(err)
        })
    })
}