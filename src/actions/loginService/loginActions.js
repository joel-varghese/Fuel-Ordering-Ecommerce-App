import * as types from '../actionTypes';
import { loginService } from './loginService';

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

export const getLoginAccessLevel = data => ({
	type: types.GET_LOGGEDIN_ACCESS_LEVEL,
	payload: { data }
});

export const fetchJWTTokenFromLogin = (dispatch, payload ) => {
    dispatch(
        fetchLoginDetails(
            payload
        )
    );
}

export const fetchLoginAccessLevel = (dispatch, payload ) => {
    dispatch(
        getLoginAccessLevel(payload)
    );
}
// login data

export const fetchLoginData = (dispatch,paylaod)=>{
        return new Promise(resolve => {
            loginService(paylaod)
                .then(response => {
                    dispatch(
                        loginDataSuccess(
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
