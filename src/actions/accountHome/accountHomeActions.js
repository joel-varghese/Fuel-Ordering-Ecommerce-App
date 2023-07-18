import * as types from '../actionTypes';
import { bfaJsonService } from '../BFAServices/BFAJsonService';
import { fetchOperatorCompanyService } from '../accountServices/accountHomeService';

export const fetchAccountHomeDataBegin = data => ({
	type: types.FETCH_ACCOUNT_HOME_DATA_BEGIN,
	payload: { data }
});
export const fetchAccountHomeDataFailure = data => ({
	type: types.FETCH_ACCOUNT_HOME_DATA_FAILURE,
	payload: { data }
});
export const fetchAccountHomeDataSuccess = data => ({
	type: types.FETCH_ACCOUNT_HOME_DATA_SUCCESS,
	payload: { data }
});

export const fetchOperatorCompanyDataBegin = data => ({
	type: types.FETCH_OPERATOR_COMPANY_DATA_BEGIN,
	payload: { data }
});
export const fetchOperatorCompanyDataFailure = data => ({
	type: types.FETCH_OPERATOR_COMPANY_DATA_FAILURE,
	payload: { data }
});
export const fetchOperatorCompanyDataSuccess = data => ({
	type: types.FETCH_OPERATOR_COMPANY_DATA_SUCCESS,
	payload: { data }
});

export const fetchJSONData = (paylaod,dispatch)=>{
    return new Promise(resolve => {
        bfaJsonService(paylaod)
            .then(response => {
                dispatch(
                    fetchAccountHomeDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch((error) => {
                dispatch(
                    fetchAccountHomeDataFailure(
                        error
                    )
                );
            });
    });
       

}
export const getSelectedUser = (user,dispatch)=>{
    dispatch({
        type: types.GET_SELECTED_USER,
	    payload: { user }}
    )
};

export const getSelectedTab = (tab,dispatch)=>{
    dispatch({
        type: types.GET_SELECTED_TAB,
	    payload: { tab }}
    )
}
export const getCompany = (company,dispatch)=>{
    dispatch({
        type: types.GET_SELECTED_COMPANY,
	    payload: { company }}
    )
}

export const fetchOperatorCompany = (paylaod,dispatch)=>{
    return new Promise(resolve => {
        fetchOperatorCompanyService(paylaod)
            .then(response => {
                dispatch(
                    fetchOperatorCompanyDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch((error) => {
                dispatch(
                    fetchOperatorCompanyDataFailure(
                        error
                    )
                );
            });
    });
       

}