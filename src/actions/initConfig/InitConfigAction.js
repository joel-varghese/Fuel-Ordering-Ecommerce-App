import * as types from '../actionTypes';
import { initConfigService } from './InitConfigService';

export const loginDataBegin = data => ({
	type: types.FETCH_LOGIN_DATA_BEGIN,
	payload: { data }
});
export const loginDataFailure = data => ({
	type: types.FETCH_LOGIN_DATA_FAILURE,
	payload: { data }
});
export const loginDataSuccess = data => ({
	type: types.FETCH_LOGIN_DATA_SUCCESS,
	payload: { data }
});

export const fetchLoginDetails = data => ({
	type: types.FETCH_LOGIN_DETAILS,
	payload: { data }
});

export const fetchCSRFToken = data => ({
	type: types.FETCH_CSRF_TOKEN,
	payload: { data }
});

// export const fetchCSRFTokenData = (dispatch, payload ) => {
//     dispatch(
//         fetchCSRFToken(
//             payload
//         )
//     );
// }

export const fetchJWTTokenFromLogin = (dispatch, payload ) => {
    dispatch(
        fetchLoginDetails(
            payload
        )
    );
}

// login data

export const fetchCSRFTokenData = (dispatch)=>{
        return new Promise(resolve => {
            initConfigService()
                .then(response => {
                    dispatch(
                        fetchCSRFToken(
                            response
                        )
                    );
                    resolve(response);
                    return response;
                })
                .catch(/* istanbul ignore next */(error) => {
                    dispatch(
                        loginDataFailure(
                            error
                        )
                    );
                });
        });
}
