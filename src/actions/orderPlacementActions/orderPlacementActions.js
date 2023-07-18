import * as types from '../actionTypes';
import { bfaJsonService } from '../BFAServices/BFAJsonService';
import { saveOrder } from './orderPlacementService';

export const fetchOrderJsonDataBegin = (data)=>({
    type: types. FETCH_ORDER_HOME_JSON_BEGIN,
    payload: { data }
})
export const fetchOrderJsonDataSuccess = (data)=>({
    type: types. FETCH_ORDER_HOME_JSON_SUCCESS,
    payload: { data }
})
export const fetchOrderJsonDataFailure = (data)=>({
    type: types. FETCH_ORDER_HOME_JSON_FAILURE,
    payload: { data }
})
export const saveOrderBegin = (data)=>({
    type: types. SAVE_ORDER_DATA_BEGIN,
    payload: { data }
})
export const saveOrderSuccess = (data)=>({
    type: types. SAVE_ORDER_DATA_SUCCESS,
    payload: { data }
})
export const saveOrderFailure = (data)=>({
    type: types. SAVE_ORDER_DATA_FAILURE,
    payload: { data }
})

export const fetchOrderJsonData = (dispatch,payload)=>{
    fetchOrderJsonDataBegin()
    return new Promise((resolve,reject)=>{
        bfaJsonService(payload).then((response)=>{
            if(response){
                dispatch(
                    fetchOrderJsonDataSuccess(response)
                );
                resolve(response);
                return response;
            }
        }).catch((err)=>{
            dispatch(
                fetchOrderJsonDataFailure(err)
            );
            reject(err)
        })
    })
}
export const saveOrderData = (dispatch,payload)=>{
    saveOrderBegin()
    return new Promise((resolve,reject)=>{
        saveOrder(payload).then((response)=>{
            if(response){
                dispatch(
                    saveOrderSuccess(response)
                );
                resolve(response);
                return response;
            }
        }).catch((err)=>{
            dispatch(
                saveOrderFailure(err)
            );
            reject(err)
        })
    })
}
export const getLegType = (dispatch,data)=>{
    dispatch({
        type: types.IS_MULTILEG,
	    payload: { data }}
    )
}
export const getUUID = (dispatch,data)=>{
    dispatch({
        type: types.ORDER_ID,
	    payload: { data }}
    )
}
export const getLegLevel = (dispatch,data)=>{
    dispatch({
        type: types.LEG_LEVEL,
	    payload: { data }}
    )
}
export const getFromLocation = (dispatch,data)=>{
    dispatch({
        type: types.FROM_LOCATION,
	    payload: { data }}
    )
}
export const getPreviousDate = (dispatch,data)=>{
    dispatch({
        type: types.FROM_LOCATION,
	    payload: { data }}
    )
}
export const getLegData = (dispatch,data)=>{
    dispatch({
        type: types.LEG_DATA,
	    payload: { data }}
    )
}
export const getMultipleLeg = (dispatch,data)=>{
    dispatch({
        type: types.MULTIPLE_LEG,
	    payload: { data }}
    )
}
export const getIsSummary = (dispatch,data)=>{
    dispatch({
        type: types.IS_SUMMARY,
	    payload: { data }}
    )
}
export const getIsPricePending = (dispatch,data)=>{
    dispatch({
        type: types.IS_PRICE_PENDING,
	    payload: { data }}
    )
}
export const getFuelInfo = (dispatch,data)=>{
    dispatch({
        type: types.FUEL_INFO,
	    payload: { data }}
    )
}
export const getIsReorder = (dispatch,data)=>{
    dispatch({
        type: types.IS_REORDER,
	    payload: { data }}
    )
}
export const getIsEditSingle = (dispatch,data)=>{
    dispatch({
        type: types.IS_EDIT_SINGLE,
	    payload: { data }}
    )
}

export const getIsEditMultiple = (dispatch,data)=>{
    dispatch({
        type: types.IS_EDIT_MULTIPLE,
	    payload: { data }}
    )
}

export const getIsOrderAccept = (dispatch,data)=>{
    dispatch({
        type: types.IS_ORDER_ACCEPT,
	    payload: { data }}
    )
}

export const getIsMultiSummary = (dispatch,data)=>{
    dispatch({
        type: types.IS_MULTI_SUMMARY,
	    payload: { data }}
    )
}

export const getIsPreviousScreen = (dispatch,data)=>{
    dispatch({
        type: types.IS_PREVIOUS_SCREEN,
	    payload: { data }}
    )
}

export const getIsOrderClose = (dispatch,data)=>{
    dispatch({
        type: types.IS_ORDER_CLOSE,
	    payload: { data }}
    )
}
export const clearAll = (dispatch,data)=>{
    dispatch({
        type: types.CLEAR_ALL,
	    payload: { data }}
    )
}
export const getMultiLegPricePending = (dispatch,data)=>{
    dispatch({
        type: types.IS_MULTI_LEG_PRICE_PENDING,
	    payload: { data }}
    )
}
