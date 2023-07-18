import * as types from '../actionTypes';
import { bfaJsonService } from '../BFAServices/BFAJsonService';

export const multiLegSummaryJsonDataBegin = (data)=>({
    type: types. MULTI_LEG_SUMMARY_JSON_BEGIN,
    payload: { data }
})
export const multiLegSummaryJsonDataSuccess = (data)=>({
    type: types. MULTI_LEG_SUMMARY_JSON_SUCCESS,
    payload: { data }
})
export const multiLegSummaryJsonDataFailure = (data)=>({
    type: types. MULTI_LEG_SUMMARY_JSON_FAILURE,
    payload: { data }
})

export const multiLegSummaryJsonData = (dispatch,payload)=>{
    multiLegSummaryJsonDataBegin()
    return new Promise((resolve,reject)=>{
        bfaJsonService(payload).then((response)=>{
            if(response){
                dispatch(
                    multiLegSummaryJsonDataSuccess(response)
                );
                resolve(response);
                return response;
            }
        }).catch((err)=>{
            dispatch(
                multiLegSummaryJsonDataFailure(err)
            );
            reject(err)
        })
    })
}

