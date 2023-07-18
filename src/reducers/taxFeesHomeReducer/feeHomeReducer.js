import * as types from '../../actions/actionTypes';
import { initialState } from '../initialState';

export default function feeHomeReducer(
    state,
    action
) {
    if (typeof state === 'undefined') {
        state = initialState.feeHomeReducer
    }
    switch (action.type) {

        case types.FETCH_FEE_DATA_BEGIN:
            return {
                ...state,
                loading: true,
                error: null
            };

        case types.FETCH_FEE_DATA_SUCCESS:
            return {
                ...state,
                // loading: false,
                feeHomeJson: action.payload && action.payload.data && action.payload.data.data
            };

        case types.FETCH_FEE_DATA_FAILURE:

            return {
                ...state,
                loading: false,
                error: action.payload.error,
                feeHomeJson: {}
            };
        case types.FETCH_FEE_DETAILS_BEGIN:
            return {
                ...state,
                loading: true,
                error: null
            };

        case types.FETCH_FEE_DETAILS_SUCCESS:
            return {
                ...state,
                loading: false,
                feeDetails: action.payload 
            };

        case types.FETCH_FEE_DETAILS_FAILURE:

            return {
                ...state,
                loading: false,
                error: action.payload.error,
                feeDetails: {}
            };

        default:
            return state;
    }
}