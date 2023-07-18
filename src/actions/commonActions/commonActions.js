import * as types from '../actionTypes';

export const enablePopUp = (data,dispatch)=>{
    dispatch({
        type: types.ENABLE_POPUP,
	    payload: { data }}
    )
};
export const getLoggedInUser = (data,dispatch)=>{
    dispatch({
        type: types.LOGGED_IN_USER,
	    payload: { data }}
    )
};
export const getLoggedInUserType = (data,dispatch)=>{
    dispatch({
        type: types.LOGGED_IN_USERTYPE,
	    payload: { data }}
    )
};
export const getLoggedInFirstName = (data,dispatch)=>{
    dispatch({
        type: types.LOGGED_IN_FIRSTNAME,
	    payload: { data }}
    )
};
export const showClientscreen = (data,dispatch)=>{
    dispatch({
        type: types.CLIENT_SCREEN,
	    payload: { data }}
    )
};
export const getLoggedInCompany = (data,dispatch)=>{
    dispatch({
        type: types.LOGGED_IN_COMPANY,
	    payload: { data }}
    )
};
export const getMobileHeaderText = (dispatch,data)=>{
    dispatch({
        type: types.MOBILE_HEADER_TEXT,
	    payload: { data }}
    )
};
export const getMobileFavoriteFbo = (dispatch,data)=>{
    dispatch({
        type: types.MOBILE_FAVORITE_FBO,
	    payload: { data }}
    )
};
