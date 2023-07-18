import * as types from '../actionTypes';
import { bfaJsonService } from '../BFAServices/BFAJsonService';

export const multiLegJsonDataBegin = (data)=>({
    type: types. MULTI_LEG_JSON_BEGIN,
    payload: { data }
})
export const multiLegJsonDataSuccess = (data)=>({
    type: types. MULTI_LEG_JSON_SUCCESS,
    payload: { data }
})
export const multiLegJsonDataFailure = (data)=>({
    type: types. MULTI_LEG_JSON_FAILURE,
    payload: { data }
})
export const getEditLegData = (dispatch,data)=>(
    dispatch( {
        type: types. EDIT_LEG_DATA,
        payload: { data }
    })
)
export const getIsEdit = (dispatch,data)=>(
    dispatch({
        type: types. IS_EDIT,
        payload: { data }
    })
)

export const multiLegJsonData = (dispatch,payload)=>{
    multiLegJsonDataBegin()
    return new Promise((resolve,reject)=>{
        bfaJsonService(payload).then((response)=>{
            if(response){
                dispatch(
                    multiLegJsonDataSuccess(response)
                );
                resolve(response);
                return response;
            }
        }).catch((err)=>{
            dispatch(
                multiLegJsonDataFailure(err)
            );
            reject(err)
        })
    })
}

