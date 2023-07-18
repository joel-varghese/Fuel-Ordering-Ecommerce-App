import * as types from '../actionTypes';

export const getDisputeData = (data,dispatch)=>{
    dispatch({
        type: types.DISPUTE_DATA,
	    payload: { data }}
    )
};

export const getDisputeOrder = (data,dispatch)=>{
    dispatch({
        type: types.DISPUTE_ORDER_DATA,
	    payload: { data }}
    )
};

export const viewScreen = (data,dispatch)=>{
    dispatch({
        type: types.DISPUTE_VIEW_SCREEN,
	    payload: { data }}
    )
};

export const invoiceScreen = (data,dispatch)=>{
    dispatch({
        type: types.DISPUTE_INVOICE_SCREEN,
	    payload: { data }}
    )
};

export const prevScreen = (data,dispatch)=>{
    dispatch({
        type: types.DISPUTE_PREVIOUS_SCREEN,
	    payload: { data }}
    )
};

export const DispData = (data,dispatch)=>{ 
    dispatch({
        type: types.DISPUTE_ROW_DATA,
	    payload: { data }}
    )
};

export const ReviewScreen = (data,dispatch)=>{
    dispatch({
        type: types.DISPUTE_REVIEW_SCREEN,
	    payload: { data }}
    )
};