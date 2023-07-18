import * as types from '../actionTypes';
import { getCompaniestoDeactivate,updateCompaniestoDeactivate,getUserCompanies,getoperatorusers,updatecompaniesandusermapping } from './adminService';

export const fetchAdminDataBegin = data => ({
    type: types.FETCH_ADMIN_DATA_BEGIN,
    payload: { data }
});
export const fetchAdminDataFailure = data => ({
    type: types.FETCH_ADMIN_DATA_FAILURE,
    payload: { data }
});
export const fetchAdminDataSuccess = data => ({
    type: types.FETCH_ADMIN_DATA_SUCCESS,
    payload: { data }
});


export const getAdminTab = (data,dispatch)=>{
    dispatch({
        type: types.GET_SELECTED_TAB_ADMIN,
	    payload: { data }}
    )
}

export const isDeactivate = (data,dispatch)=>{
    dispatch({
        type: types.GET_IS_DEACTIVATE,
	    payload: { data }}
    )
}

export const inactiveStatus = (data,dispatch)=>{
    dispatch({
        type: types.GET_INACTIVE_STATUS,
	    payload: { data }}
    )
}

export const systemVariablesVal = (data,dispatch)=>{
    dispatch({
        type: types.GET_SYSTEM_VARIABLES,
	    payload: { data }}
    )
}

export const fetchCompanies = (dispatch, paylaod) => {
    dispatch(fetchAdminDataBegin())
    return new Promise(resolve => {
        getCompaniestoDeactivate(paylaod)
            .then(response => {
                dispatch(
                    fetchAdminDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch(/* istanbul ignore next */(error) => {
                dispatch(
                    fetchAdminDataFailure(
                        error
                    )
                );
            });
    });
}

export const updateCompanies = (dispatch, paylaod) => {
    dispatch(fetchAdminDataBegin())
    return new Promise(resolve => {
        updateCompaniestoDeactivate(paylaod)
            .then(response => {
                dispatch(
                    fetchAdminDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch(/* istanbul ignore next */(error) => {
                dispatch(
                    fetchAdminDataFailure(
                        error
                    )
                );
            });
    });
}

export const mapCompany = (dispatch, paylaod) => {
    dispatch(fetchAdminDataBegin())
    return new Promise(resolve => {
        updatecompaniesandusermapping(paylaod)
            .then(response => {
                dispatch(
                    fetchAdminDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch(/* istanbul ignore next */(error) => {
                dispatch(
                    fetchAdminDataFailure(
                        error
                    )
                );
            });
    });
}

export const userCompanies = (dispatch, paylaod) => {
    dispatch(fetchAdminDataBegin())
    return new Promise(resolve => {
        getUserCompanies(paylaod)
            .then(response => {
                dispatch(
                    fetchAdminDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch(/* istanbul ignore next */(error) => {
                dispatch(
                    fetchAdminDataFailure(
                        error
                    )
                );
            });
    });
}

export const getOperators = (dispatch, paylaod) => {
    dispatch(fetchAdminDataBegin())
    return new Promise(resolve => {
        getoperatorusers(paylaod)
            .then(response => {
                dispatch(
                    fetchAdminDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch(/* istanbul ignore next */(error) => {
                dispatch(
                    fetchAdminDataFailure(
                        error
                    )
                );
            });
    });
}

