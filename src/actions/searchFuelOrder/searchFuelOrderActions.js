import * as types from '../actionTypes';
import { bfaJsonService } from '../BFAServices/BFAJsonService';
import { getFuelLocations, getPrefferedFbo } from './searchFuelOrderService';

export const fetchSearchFuelDataBegin = data => ({
    type: types.FETCH_SEARCHFUEL_JSON_DATA_BEGIN,
    payload: { data }
});
export const fetchSearchFuelJsonDataFailure = data => ({
    type: types.FETCH_SEARCHFUEL_JSON_DATA_FAILURE,
    payload: { data }
});
export const fetchSearchFuelJsonDataSuccess = data => ({
    type: types.FETCH_SEARCHFUEL_JSON_DATA_SUCCESS,
    payload: { data }
});

export const fetchSearchFuelDataFailure = data => ({
    type: types.FETCH_SEARCHFUEL_DATA_FAILURE,
    payload: { data }
});
export const fetchSearchFuelDataSuccess = data => ({
    type: types.FETCH_SEARCHFUEL_DATA_SUCCESS,
    payload: { data }
});

export const fetchSearchFuelResultBegin = data => ({
    type: types.FETCH_SEARCHFUEL_RESULT_BEGIN,
    payload: { data }
});
export const fetchSearchFuelResultFailure = data => ({
    type: types.FETCH_SEARCHFUEL_RESULT_FAILURE,
    payload: { data }
});
export const fetchSearchFuelResultSuccess = data => ({
    type: types.FETCH_SEARCHFUEL_RESULT_SUCCESS,
    payload: { data }
});

export const fetchPrefferedFboResultBegin = data => ({
    type: types.FETCH_PREFFEREDFBO_RESULT_BEGIN,
    payload: { data }
});
export const fetchPrefferedFboResultFailure = data => ({
    type: types.FETCH_PREFFEREDFBO_RESULT_FAILURE,
    payload: { data }
});
export const fetchPrefferedFboResultSuccess = data => ({
    type: types.FETCH_PREFFEREDFBO_RESULT_SUCCESS,
    payload: { data }
});

export const fetchJSONData = (dispatch, paylaod) => {
    dispatch(fetchSearchFuelDataBegin())
    return new Promise(resolve => {
        bfaJsonService(paylaod)
            .then(response => {
                dispatch(
                    fetchSearchFuelJsonDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch(/* istanbul ignore next */(error) => {
                dispatch(
                    fetchSearchFuelJsonDataFailure(
                        error
                    )
                );
            });
    });
}

export const fetchFuelLocations = (dispatch, paylaod) => {
    return new Promise(resolve => {
        getFuelLocations(paylaod)
            .then(response => {
                dispatch(
                    fetchSearchFuelDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch(/* istanbul ignore next */(error) => {
                dispatch(
                    fetchSearchFuelDataFailure(
                        error
                    )
                );
            });
    });
}

export const fetchFuelResult = (dispatch, paylaod) => {
    dispatch(fetchSearchFuelResultBegin())
    return new Promise(resolve => {
        getFuelLocations(paylaod)
            .then(response => {
                dispatch(
                    fetchSearchFuelResultSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch(/* istanbul ignore next */(error) => {
                dispatch(
                    fetchSearchFuelResultFailure(
                        error
                    )
                );
            });
    });
}

export const fetchPrefferedFbo = (dispatch, paylaod) => {
    dispatch(fetchPrefferedFboResultBegin())
    return new Promise(resolve => {
        getPrefferedFbo(paylaod)
            .then(response => {
                dispatch(
                    fetchPrefferedFboResultSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch(/* istanbul ignore next */(error) => {
                dispatch(
                    fetchPrefferedFboResultFailure(
                        error
                    )
                );
            });
    });
}

export const getOrderDetails = (data,dispatch)=>{
    dispatch({
        type: types.GET_ORDER_DETAILS,
	    payload: { data }}
    )
}

export const setMobileOrderDetails = (data,dispatch)=>{
    dispatch({
        type: types.GET_MOBILE_ORDER_DETAILS,
	    payload: { data }}
    )
}