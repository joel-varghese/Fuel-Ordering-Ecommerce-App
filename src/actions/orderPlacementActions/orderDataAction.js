import * as types from '../actionTypes';
import { bfaJsonService } from '../BFAServices/BFAJsonService';

export const fetchOrderDataJsonBegin = (data)=>({
    type: types. FETCH_ORDER_DATA_JSON_BEGIN,
    payload: { data }
})
export const fetchOrderDataJsonSuccess = (data)=>({
    type: types. FETCH_ORDER_DATA_JSON_SUCCESS,
    payload: { data }
})
export const fetchOrderDataJsonFailure = (data)=>({
    type: types. FETCH_ORDER_DATA_JSON_FAILURE,
    payload: { data }
})

export const fetchOrderDataJson = (dispatch,payload)=>{
    fetchOrderDataJsonBegin()
    return new Promise((resolve,reject)=>{
        bfaJsonService(payload).then((response)=>{
            if(response){
                dispatch(
                    fetchOrderDataJsonSuccess(response)
                );
                resolve(response);
                return response;
            }
        }).catch((err)=>{
            dispatch(
                fetchOrderDataJsonFailure(err)
            );
            reject(err)
        })
    })
}