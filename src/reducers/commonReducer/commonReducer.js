import * as types from '../../actions/actionTypes';
import { initialState } from '../initialState';

export default function commonReducer(
	state,
	action
) {
	if (typeof state === 'undefined') {
		state = initialState.commonReducer
	}
	switch (action.type) {
        case types.ENABLE_POPUP:
            return {
                ...state,
                enableModal: action.payload
            };

        case types.LOGGED_IN_USER:
            return {
                ...state,
                loggedInUser: action.payload
            };
        case types.LOGGED_IN_USERTYPE:
            return {
                ...state,
                loggedInUserType: action.payload
            };    
        case types.LOGGED_IN_FIRSTNAME:
            return {
                ...state,
                loggedInFirstName: action.payload
            };     
        case types.CLIENT_SCREEN:
            return {
                ...state,
                clientScreen: action.payload
            };
            
        case types.LOGGED_IN_COMPANY:
            return {
                ...state,
                loggedInCompany: action.payload
            };
        case types.MOBILE_HEADER_TEXT:
            return {
                ...state,
                mobileHeaderText: action.payload
            };
        case types.MOBILE_FAVORITE_FBO:
            return {
                ...state,
                mobileFavoriteFbo: action.payload
            };
            
        default:
        return state;
	}
}