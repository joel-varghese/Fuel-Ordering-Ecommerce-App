import * as types from '../actionTypes';
import { getFBOuserdata,getFBOtransactiondata,getBFuserdata,getBFtransactiondata,getOPuserdata,getOPtransactiondata } from './reportService';

export const fetchFboUserDataBegin = data => ({
    type: types.FETCH_FBO_USER_DATA_BEGIN,
    payload: { data }
});
export const fetchFboUserDataFailure = data => ({
    type: types.FETCH_FBO_USER_DATA_FAILURE,
    payload: { data }
});
export const fetchFboUserDataSuccess = data => ({
    type: types.FETCH_FBO_USER_DATA_SUCCESS,
    payload: { data }
});



export const fetchFboUser = (dispatch, paylaod) => {
    dispatch(fetchFboUserDataBegin())
    return new Promise(resolve => {
        getFBOuserdata(paylaod)
            .then(response => {
                dispatch(
                    fetchFboUserDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch(/* istanbul ignore next */(error) => {
                dispatch(
                    fetchFboUserDataFailure(
                        error
                    )
                );
            });
    });
}

export const fetchFboTrans = (dispatch, paylaod) => {
    dispatch(fetchFboUserDataBegin())
    return new Promise(resolve => {
        getFBOtransactiondata(paylaod)
            .then(response => {
                dispatch(
                    fetchFboUserDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch(/* istanbul ignore next */(error) => {
                dispatch(
                    fetchFboUserDataFailure(
                        error
                    )
                );
            });
    });
}

export const fetchBFUser = (dispatch, paylaod) => {
    dispatch(fetchFboUserDataBegin())
    return new Promise(resolve => {
        getBFuserdata(paylaod)
            .then(response => {
                dispatch(
                    fetchFboUserDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch(/* istanbul ignore next */(error) => {
                dispatch(
                    fetchFboUserDataFailure(
                        error
                    )
                );
            });
    });
}

export const fetchBFTrans = (dispatch, paylaod) => {
    dispatch(fetchFboUserDataBegin())
    return new Promise(resolve => {
        getBFtransactiondata(paylaod)
            .then(response => {
                dispatch(
                    fetchFboUserDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch(/* istanbul ignore next */(error) => {
                dispatch(
                    fetchFboUserDataFailure(
                        error
                    )
                );
            });
    });
}

export const fetchOPUser = (dispatch, paylaod) => {
    dispatch(fetchFboUserDataBegin())
    return new Promise(resolve => {
        getOPuserdata(paylaod)
            .then(response => {
                dispatch(
                    fetchFboUserDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch(/* istanbul ignore next */(error) => {
                dispatch(
                    fetchFboUserDataFailure(
                        error
                    )
                );
            });
    });
}

export const fetchOPTrans = (dispatch, paylaod) => {
    dispatch(fetchFboUserDataBegin())
    return new Promise(resolve => {
        getOPtransactiondata(paylaod)
            .then(response => {
                dispatch(
                    fetchFboUserDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch(/* istanbul ignore next */(error) => {
                dispatch(
                    fetchFboUserDataFailure(
                        error
                    )
                );
            });
    });
}