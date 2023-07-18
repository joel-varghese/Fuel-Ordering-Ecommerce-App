import * as types from '../actionTypes';
import { bfaJsonService } from '../BFAServices/BFAJsonService';

export const fetchAccountCompanyDataBegin = data => ({
	type: types.FETCH_ACCOUNT_COMPANY_DATA_BEGIN,
	payload: { data }
});
export const fetchAccountCompanyDataFailure = data => ({
	type: types.FETCH_ACCOUNT_COMPANY_DATA_FAILURE,
	payload: { data }
});
export const fetchAccountCompanyDataSuccess = data => ({
	type: types.FETCH_ACCOUNT_COMPANY_DATA_SUCCESS,
	payload: { data }
});

export const fetchJSONData = (paylaod,dispatch)=>{
     return new Promise(resolve => {
        bfaJsonService(paylaod)
            .then(response => {
                
                dispatch(
                    fetchAccountCompanyDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch((error) => {
                dispatch(
                    fetchAccountCompanyDataFailure(
                        error
                    )
                );
            });
    });
       

}
