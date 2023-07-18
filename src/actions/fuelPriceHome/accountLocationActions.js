import * as types from '../actionTypes';
import { bfaJsonService } from '../BFAServices/BFAJsonService';

import {fetchCompanyDetails} from '../accountServices/accountCompanyService'

export const fetchAccountLocationDataBegin = data => ({
	type: types.FETCH_ACCOUNT_LOCATION_DATA_BEGIN,
	payload: { data }
});
export const fetchAccountLocationDataFailure = data => ({
	type: types.FETCH_ACCOUNT_LOCATION_DATA_FAILURE,
	payload: { data }
});
export const fetchAccountLocationDataSuccess = data => ({
	type: types.FETCH_ACCOUNT_LOCATION_DATA_SUCCESS,
	payload: { data }
});

export const fetchAccountLocationDataDataFailure = data => ({
	type: types.FETCH_ACCOUNT_LOCATION_DATA_DATA_FAILURE,
	payload: { data }
});
export const fetchAccountLocationDataDataSuccess = data => ({
	type: types.FETCH_ACCOUNT_LOCATION_DATA_DATA_SUCCESS,
	payload: { data }
});

export const fetchJSONData = (paylaod,dispatch)=>{
   
    return new Promise(resolve => {

        bfaJsonService(paylaod)
            .then(response => {
                 dispatch(
                    fetchAccountLocationDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch((error) => {
                dispatch(
                    fetchAccountLocationDataFailure(
                        error
                    )
                );
            });
    });
       

}

export const fetchLocationNData = (paylaod,dispatch)=>{
   
    return new Promise(resolve => {

        fetchCompanyDetails(paylaod)
            .then(response => {
                 dispatch(
                    fetchAccountLocationDataDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch((error) => {
                dispatch(
                    fetchAccountLocationDataDataSuccess(
                        error
                    )
                );
            });
    });
       

}
