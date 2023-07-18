import * as types from '../../actions/actionTypes';
import { initialState } from '../initialState';

export default function taxHomeReducer(
    state,
    action
) {
    if (typeof state === 'undefined') {
        state = initialState.taxHomeReducer
    }
    switch (action.type) {

        case types.FETCH_TAX_DATA_BEGIN:
            return {
                ...state,
                loading: true,
                error: null
            };

        case types.FETCH_TAX_DATA_SUCCESS:
            return {
                ...state,
                // loading: false,
                taxHomeJson: action.payload && action.payload
            };

        case types.FETCH_TAX_DATA_FAILURE:

            return {
                ...state,
                loading: false,
                error: action.payload.error,
                taxHomeJson: {}
            };

        case types.FETCH_TAX_DETAILS_BEGIN:
            return {
                ...state,
                loading: true,
                error: null,
                taxDetails: {}
            };

        case types.FETCH_TAX_DETAILS_SUCCESS:
            return {
                ...state,
                loading: false,
                taxDetails: action.payload
            };

        case types.FETCH_TAX_DETAILS_FAILURE:

            return {
                ...state,
                loading: false,
                error: action.payload.error,
                taxDetails: {}
            };
        
        case types.GET_SELECTED_USER_TAX:

            return {
                ...state,
                loading: false,
                selectedUser: action.payload
            };
        case types.GET_SELECTED_TAB_TAX:

            return {
                ...state,
                loading: false,
                selectedTab: action.payload
            };
        case types.GET_ALL_LOCATIONS_TAX:

                return {
                    ...state,
                    loading: false,
                    allLocationForTax: action.payload
                };
        default:
            return state;
    }
}