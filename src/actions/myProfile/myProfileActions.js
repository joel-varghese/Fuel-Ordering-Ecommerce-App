import * as types from '../actionTypes';
import { bfaJsonService } from '../BFAServices/BFAJsonService';

export const fetchProfileDataBegin = data => ({
	type: types.FETCH_PROFILE_DATA_BEGIN,
	payload: { data }
});
export const fetchProfileDataFailure = data => ({
	type: types.FETCH_PROFILE_DATA_FAILURE,
	payload: { data }
});
export const fetchProfileDataSuccess = data => ({
	type: types.FETCH_PROFILE_DATA_SUCCESS,
	payload: { data }
});

// dashboard JSon Service 

export const fetchJSONData = (dispatch,paylaod)=>{
        return new Promise(resolve => {
            bfaJsonService(paylaod)
                .then(response => {
                    dispatch(
                        fetchProfileDataSuccess(
                            response
                        )
                    );
                    resolve(response);
                    return response;
                })
                .catch(/* istanbul ignore next */(error) => {
                    dispatch(
                        fetchProfileDataFailure(
                            error
                        )
                    );
                });
        });
}