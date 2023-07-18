import * as types from '../actionTypes';
import { getDisputeOrders,getDisputeDetails,resolveDispute,addCaseNotes,updateDisputeStatus, getOrderHistory } from './disputeOrderService';

export const fetchDisputeOrderDataBegin = data => ({
    type: types.FETCH_DISPUTE_ORDER_DATA_BEGIN,
    payload: { data }
});
export const fetchDisputeOrderDataFailure = data => ({
    type: types.FETCH_DISPUTE_ORDER_DATA_FAILURE,
    payload: { data }
});
export const fetchDisputeOrderDataSuccess = data => ({
    type: types.FETCH_DISPUTE_ORDER_DATA_SUCCESS,
    payload: { data }
});

export const fetchDisputeDetailsBegin = data => ({
    type: types.FETCH_DISPUTE_DETAILS_BEGIN,
    payload: { data }
});
export const fetchDisputeDetailsFailure = data => ({
    type: types.FETCH_DISPUTE_DETAILS_FAILURE,
    payload: { data }
});
export const fetchDisputeDetailsSuccess = data => ({
    type: types.FETCH_DISPUTE_DETAILS_SUCCESS,
    payload: { data }
});

export const fetchResolveBegin = data => ({
    type: types.FETCH_RESOLVE_BEGIN,
    payload: { data }
});
export const fetchResolveFailure = data => ({
    type: types.FETCH_RESOLVE_FAILURE,
    payload: { data }
});
export const fetchResolveSuccess = data => ({
    type: types.FETCH_RESOLVE_SUCCESS,
    payload: { data }
});

export const fetchCaseNotesBegin = data => ({
    type: types.FETCH_CASE_NOTES_BEGIN,
    payload: { data }
});
export const fetchCaseNotesFailure = data => ({
    type: types.FETCH_CASE_NOTES_FAILURE,
    payload: { data }
});
export const fetchCaseNotesSuccess = data => ({
    type: types.FETCH_CASE_NOTES_SUCCESS,
    payload: { data }
});

export const updateDisputeBegin = data => ({
    type: types.UPDATE_DISPUTE_BEGIN,
    payload: { data }
});
export const updateDisputeFailure = data => ({
    type: types.UPDATE_DISPUTE_FAILURE,
    payload: { data }
});
export const updateDisputeSuccess = data => ({
    type: types.UPDATE_DISPUTE_SUCCESS,
    payload: { data }
});

export const fetchHistoryBegin = data => ({
    type: types.FETCH_HISTORY_BEGIN,
    payload: { data }
});
export const fetchHistoryFailure = data => ({
    type: types.FETCH_HISTORY_FAILURE,
    payload: { data }
});
export const fetchHistorySuccess = data => ({
    type: types.FETCH_HISTORY_SUCCESS,
    payload: { data }
});

export const fetchDisputeOrder = (dispatch, paylaod) => {
    dispatch(fetchDisputeDetailsBegin())
    return new Promise(resolve => {
        getDisputeOrders(paylaod)
            .then(response => {
                dispatch(
                    fetchDisputeDetailsSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch(/* istanbul ignore next */(error) => {
                dispatch(
                    fetchDisputeDetailsFailure(
                        error
                    )
                );
            });
    });
}

export const fetchDisputeDetails = (dispatch, paylaod) => {
    dispatch(fetchDisputeDetailsBegin())
    return new Promise(resolve => {
        getDisputeDetails(paylaod)
            .then(response => {
                dispatch(
                    fetchDisputeOrderDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch(/* istanbul ignore next */(error) => {
                dispatch(
                    fetchDisputeOrderDataFailure(
                        error
                    )
                );
            });
    });
}

export const fetchResolveDetails = (dispatch, paylaod) => {
    dispatch(fetchResolveBegin())
    return new Promise(resolve => {
        resolveDispute(paylaod)
            .then(response => {
                dispatch(
                    fetchResolveSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch(/* istanbul ignore next */(error) => {
                dispatch(
                    fetchResolveFailure(
                        error
                    )
                );
            });
    });
}

export const fetchCaseNotesDetails = (dispatch, paylaod) => {
    dispatch(fetchCaseNotesBegin())
    return new Promise(resolve => {
        addCaseNotes(paylaod)
            .then(response => {
                dispatch(
                    fetchCaseNotesSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch(/* istanbul ignore next */(error) => {
                dispatch(
                    fetchCaseNotesFailure(
                        error
                    )
                );
            });
    });
}

export const updateDispute = (dispatch, paylaod) => {
    dispatch(updateDisputeBegin())
    return new Promise(resolve => {
        updateDisputeStatus(paylaod)
            .then(response => {
                dispatch(
                    updateDisputeSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch(/* istanbul ignore next */(error) => {
                dispatch(
                    updateDisputeFailure(
                        error
                    )
                );
            });
    });
}

export const fetchHistory = (dispatch, paylaod) => {
    dispatch(fetchHistoryBegin())
    return new Promise(resolve => {
        getOrderHistory(paylaod)
            .then(response => {
                dispatch(
                    fetchHistorySuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch(/* istanbul ignore next */(error) => {
                dispatch(
                    fetchHistoryFailure(
                        error
                    )
                );
            });
    });
}