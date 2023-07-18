import * as types from '../actionTypes';
import { bfaJsonService, bfaJsonLocalService} from '../BFAServices/BFAJsonService';

export const fetchTaxFeesHomeDataBegin = data => ({
	type: types.FETCH_TAX_DATA_BEGIN,
	payload: { data }
});
export const fetchTaxFeesHomeDataFailure = data => ({
	type: types.FETCH_TAX_DATA_FAILURE,
	payload: { data }
});
export const fetchTaxFeesHomeDataSuccess = data => (
    {
	type: types.FETCH_TAX_DATA_SUCCESS,
	payload: { data }
});

export const fetchJSONData1 = (payload, dispatch)=>{
    // console.log('payload - action1', payload)

    return new Promise(resolve => {
        bfaJsonLocalService(payload)
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

// Fetch Company Details Service 

// export const fetchUserData = (dispatch, paylaod) => {
//     dispatch(getUserDataBegin())
//     return new Promise(resolve => {
//         fetchCompanyDetails(paylaod)
//             .then(response => {
//                 dispatch(
//                     getUserDataSuccess(
//                         response
//                     )
//                 );
//                 resolve(response);
//                 return response;
//             })
//             .catch(/* istanbul ignore next */(error) => {
//                 dispatch(
//                     getUserDataFailure(
//                         error
//                     )
//                 );
//             });
//     });
//     }

export const getSelectedUser = (user,dispatch)=>{
    dispatch({
        type: types.GET_SELECTED_USER,
	    payload: { user }}
    )
};

export const getSelectedTab = (tab,dispatch)=>{
    dispatch({
        type: types.GET_TAXHOME_SELECTED_TAB,
	    payload: { tab }}
    )
}