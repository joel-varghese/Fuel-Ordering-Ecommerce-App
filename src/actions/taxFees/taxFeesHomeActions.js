import * as types from '../actionTypes';
import { bfaJsonService, bfaJsonLocalService} from '../BFAServices/BFAJsonService';

export const fetchTaxFeesHomeDataBegin = data => ({
	type: types.FETCH_TAX_FEES_DATA_BEGIN,
	payload: { data }
});
export const fetchTaxFeesHomeDataFailure = data => ({
	type: types.FETCH_TAX_FEES_DATA_FAILURE,
	payload: { data }
});
export const fetchTaxFeesHomeDataSuccess = data => (
    {
	type: types.FETCH_TAX_FEES_DATA_SUCCESS,
	payload: { data }
});

export const fetchJSONData = (payload,dispatch)=>{
    // dispatch(fetchTaxFeesHomeDataBegin(null))
    return new Promise(resolve => {
        bfaJsonService(payload)
            .then(response => {
                dispatch(
                    fetchTaxFeesHomeDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch((error) => {
                dispatch(
                    fetchTaxFeesHomeDataFailure(
                        error
                    )
                );
            });
    });
       

}



export const getTaxSelectedUser = (user,dispatch)=>{
    dispatch({
        type: types.GET_SELECTED_USER_TAX,
	    payload: { user }}
    )
};
export const getSelectedCompanyTax = (company,dispatch)=>{
    dispatch({
        type: types.GET_SELECTED_COMPANY_TAX,
	    payload: { company }}
    )
};
export const getSelectedTab1 = (tab,dispatch)=>{
    dispatch({
        type: types.GET_SELECTED_TAB_TAX,
	    payload: { tab }}
    )
}
export const getAllLocationTax = (location,dispatch)=>{
    dispatch({
        type: types.GET_ALL_LOCATIONS_TAX,
	    payload: { location }}
    )
}