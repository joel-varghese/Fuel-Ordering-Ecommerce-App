import * as types from '../actionTypes';
import { bfaJsonService } from '../BFAServices/BFAJsonService';

export const fetchOrderSummaryJsonBegin = (data)=>({
    type: types. FETCH_ORDER_SUMMARY_JSON_BEGIN,
    payload: { data }
})
export const fetchOrderSummaryJsonSuccess = (data)=>({
    type: types. FETCH_ORDER_SUMMARY_JSON_SUCCESS,
    payload: { data }
})
export const fetchOrderSummaryJsonFailure = (data)=>({
    type: types. FETCH_ORDER_SUMMARY_JSON_FAILURE,
    payload: { data }
})

export const fetchOrderSummaryJson = (dispatch,payload)=>{
    fetchOrderSummaryJsonBegin()
    return new Promise((resolve,reject)=>{
        bfaJsonService(payload).then((response)=>{
            if(response){
                dispatch(
                    fetchOrderSummaryJsonSuccess(response)
                );
                resolve(response);
                return response;
            }
        }).catch((err)=>{
            dispatch(
                fetchOrderSummaryJsonFailure(err)
            );
            reject(err)
        })
    })
}