import * as types from '../../actions/actionTypes';
import { initialState } from '../initialState';

export default function disputeReducer(
    state,
    action
){
    if (typeof state === 'undefined') {
        state = initialState.disputeReducer
    }
    switch (action.type) {
        case types.DISPUTE_DATA:
            return {
                ...state,
                disputeData: action.payload
            };
        case types.DISPUTE_ORDER_DATA:
            return {
                ...state,
                disputeOrder: action.payload
            };
        case types.DISPUTE_VIEW_SCREEN:
            return {
                ...state,
                viewScreen: action.payload
                };
        case types.DISPUTE_INVOICE_SCREEN:
            return {
                ...state,
                invoiceScreen: action.payload
                };
        case types.DISPUTE_PREVIOUS_SCREEN:
            return {
                ...state,
                prevScreen: action.payload
                };
        case types.DISPUTE_ROW_DATA:
            return {
                ...state,
                DispData: action.payload
                };
        case types.DISPUTE_REVIEW_SCREEN:
            return {
                ...state,
                ReviewScreen: action.payload
                };
        default:
            return state;
    }
}