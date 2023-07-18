import * as types from '../actionTypes';
import { bfaJsonService } from '../BFAServices/BFAJsonService';
import { fetchCompanyDetails } from '../accountServices/accountCompanyService';

export const fetchDocumentDataBegin = data => ({
    type: types.FETCH_DOCUMENT_JSON_DATA_BEGIN,
    payload: { data }
});
export const fetchDocumentJsonDataFailure = data => ({
    type: types.FETCH_DOCUMENT_JSON_DATA_FAILURE,
    payload: { data }
});
export const fetchDocumentJsonDataSuccess = data => ({
    type: types.FETCH_DOCUMENT_JSON_DATA_SUCCESS,
    payload: { data }
});
export const getDocumentDataSuccess = data => ({
    type: types.FETCH_DOCUMENT_DATA_SUCCESS,
    payload: { data }
});
export const getDocumentDataFailure = data => ({
    type: types.FETCH_DOCUMENT_DATA_FAILURE,
    payload: { data }
});
export const getDocumentDataBegin = data => ({
    type: types.FETCH_DOCUMENT_DATA_BEGIN,
    payload: { data }
});
// Document JSon Service 

export const fetchJSONData = (dispatch, paylaod) => {
    dispatch(fetchDocumentDataBegin())
    return new Promise(resolve => {
        bfaJsonService(paylaod)
            .then(response => {
                dispatch(
                    fetchDocumentJsonDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch(/* istanbul ignore next */(error) => {
                dispatch(
                    fetchDocumentJsonDataFailure(
                        error
                    )
                );
            });
    });
}

// Fetch Company Details Service 

export const fetchDocumentData = (dispatch, paylaod) => {
    dispatch(getDocumentDataBegin())
return new Promise(resolve => {
    fetchCompanyDetails(paylaod)
        .then(response => {
            dispatch(
                getDocumentDataSuccess(
                    response
                )
            );
            resolve(response);
            return response;
        })
        .catch(/* istanbul ignore next */(error) => {
            dispatch(
                getDocumentDataFailure(
                    error
                )
            );
        });
});
}