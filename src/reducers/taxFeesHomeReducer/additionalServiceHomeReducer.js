import * as types from '../../actions/actionTypes';
import { initialState } from '../initialState';

export default function additionalServiceHomeReducer(
    state,
    action
) {
    if (typeof state === 'undefined') {
        state = initialState.additionalServiceHomeReducer
    }
    switch (action.type) {

        case types.FETCH_ADDITIONALSERVICES_DATA_BEGIN:
            return {
                ...state,
                loading: true,
                error: null
            };

        case types.FETCH_ADDITIONALSERVICES_DATA_SUCCESS:
            return {
                ...state,
                // loading: false,
                additionalServiceHomeJson: action.payload && action.payload.data && action.payload.data.data
            };

        case types.FETCH_ADDITIONALSERVICES_FAILURE:

            return {
                ...state,
                loading: false,
                error: action.payload.error,
                additionalServiceHomeJson: {}
            };
        case types.FETCH_ADDITIONALSERVICES_DETAILS_BEGIN:
            return {
                ...state,
                loading: true,
                error: null
            };

        case types.FETCH_ADDITIONALSERVICES_DETAILS_SUCCESS:
            return {
                ...state,
                loading: false,
                additionalServiceDetails: action.payload 
            };

        case types.FETCH_ADDITIONALSERVICES_DETAILS_FAILURE:

            return {
                ...state,
                loading: false,
                error: action.payload.error,
                additionalServiceDetails: {}
            };
    
        
        default:
            return state;
    }
}