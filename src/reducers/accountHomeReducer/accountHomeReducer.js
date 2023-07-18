import * as types from '../../actions/actionTypes';
import { initialState } from '../initialState';

export default function accountHomeReducer(
	state,
	action
) {
	if (typeof state === 'undefined') {
		state = initialState.accountHomeReducer
	}
	switch (action.type) {
        case types.FETCH_ACCOUNT_HOME_DATA_BEGIN:
            
            return {
                ...state,
                loading: true,
                error: null
            };

        case types.FETCH_ACCOUNT_HOME_DATA_SUCCESS:
            return {
                ...state,
                loading: false,
                accountHomeJson: action.payload
            };

        case types.FETCH_ACCOUNT_HOME_DATA_FAILURE:
            
            return {
                ...state,
                loading: false,
                error: action.payload.error,
                accountHomeJson: {}
            };

        case types.GET_SELECTED_USER:
        
            return {
                ...state,
                selectedUser: action.payload
            };
            case types.GET_SELECTED_TAB:
        
                return {
                    ...state,
                    selectedTab: action.payload
                };
    
            
            case types.GET_SELECTED_COMPANY:
    
                return {
                    ...state,
                    selectedCompany: action.payload
                };

                case types.FETCH_OPERATOR_COMPANY_DATA_BEGIN:
            
                return {
                    ...state,
                    loading: true,
                    error: null
                };
    
            case types.FETCH_OPERATOR_COMPANY_DATA_SUCCESS:
                return {
                    ...state,
                    loading: false,
                    operatorCompanyData: action.payload
                };
    
            case types.FETCH_OPERATOR_COMPANY_DATA_FAILURE:
                
                return {
                    ...state,
                    loading: false,
                    error: action.payload.error,
                    operatorCompanyData: {}
                };
    
            
            default:
            return state;
	}
}