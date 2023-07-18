import * as types from '../../actions/actionTypes';
import { initialState } from '../initialState';

export default function searchHomeReducer(
	state,
	action
) {
	if (typeof state === 'undefined') {
		state = initialState.searchHomeReducer
	}
	switch (action.type) {
        case types.FETCH_SEARCH_HOME_DATA_BEGIN:
            
            return {
                ...state,
                loading: true,
                error: null
            };

        case types.FETCH_SEARCH_HOME_DATA_SUCCESS:
            return {
                ...state,
                searchHomeJson: action.payload
            };

        case types.FETCH_SEARCH_HOME_DATA_FAILURE:
            
            return {
                ...state,
                loading: false,
                error: action.payload.error,
                searchHomeJson: {}
            };
        case types.FETCH_SEARCH_USER_DATA_BEGIN:
        
            return {
                ...state,
                loading: true,
                error: null
            };
        case types.FETCH_SEARCH_USER_DATA_SUCCESS:
            return {
                    ...state,
                    loading: false,
                    searchUserData: action.payload
            };
    
        case types.FETCH_SEARCH_USER_DATA_FAILURE:
                
            return {
                    ...state,
                    loading: false,
                    error: action.payload.error,
                    searchUserData: {}
            };    

        case types.FETCH_SEARCH_AIRCRAFT_DATA_BEGIN:
    
            return {
                ...state,
                loading: true,
                error: null
            };  

        case types.FETCH_SEARCH_AIRCRAFT_DATA_SUCCESS:
                return {
                        ...state,
                        loading: false,
                        searchAircraftData: action.payload
                };
        
        case types.FETCH_SEARCH_AIRCRAFT_DATA_FAILURE:
                    
                return {
                        ...state,
                        loading: false,
                        error: action.payload.error,
                        searchAircraftData: {}
                };    
        
        case types.FETCH_SEARCH_COMPANY_DATA_BEGIN:

            return {
                ...state,
                loading: true,
                error: null
            };        
        case types.FETCH_SEARCH_COMPANY_DATA_SUCCESS:
                    return {
                            ...state,
                            loading: false,
                            searchCompanyData: action.payload
                    };
            
        case types.FETCH_SEARCH_COMPANY_DATA_FAILURE:
                        
                    return {
                            ...state,
                            loading: false,
                            error: action.payload.error,
                            searchCompanyData: {}
                    };        
        case types.GET_SEARCH_SELECTED_USER:
        
            return {
                ...state,
                error: null,
                selectedUser: action.payload
            };
        case types.GET_SEARCH_SELECTED_TAB:
    
            return {
                ...state,
                error: null,
                selectedTab: action.payload
            };

        case types.GET_SEARCH_VALUE:

        return {
            ...state,
            error: null,
            searchValue: action.payload
        };    
    
            
            default:
            return state;
	}
}