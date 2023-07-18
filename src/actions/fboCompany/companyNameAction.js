import * as types from '../actionTypes';
import { getFBONames } from './companyNameService';

export const getFBONameSuccess = data => ({
	type: types.FETCH_FBO_NAME_SUCCESS,
	payload: { data }
});

export const getFBONameFailure = data => ({
	type: types.FETCH_FBO_NAME_FAILURE,
	payload: { data }
});

export const getFBONamesList =(payload,dispatch)=>{
    return new Promise(resolve => {
        getFBONames(payload)
            .then(response => {
                 dispatch(
                    getFBONameSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch((error) => {
                dispatch(
                    getFBONameFailure(
                        error
                    )
                );
            });
      });
}