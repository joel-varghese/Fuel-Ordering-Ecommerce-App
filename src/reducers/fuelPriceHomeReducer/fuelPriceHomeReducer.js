import * as types from '../../actions/actionTypes';
import { initialState } from '../initialState';

export default function fuelPriceHomeReducer(
	state,
	action
) {
	if (typeof state === 'undefined') {
		state = initialState.fuelPriceHomeReducer
	}
	switch (action.type) {
        case types.FETCH_FUEL_PRICE_DATA_BEGIN:
            
            return {
                ...state,
                loading: true,
                error: null
            };

        case types.FETCH_FUEL_PRICE_DATA_SUCCESS:
            return {
                ...state,
                fuelPriceHomeJson: action.payload
            };

        case types.FETCH_FUEL_PRICE_DATA_FAILURE:
            
            return {
                ...state,
                error: action.payload.error,
                fuelPriceHomeJson: {}
            };

        case types.GET_SELECTED_FUEL_USER:
        
            return {
                ...state,
                loading: false,
                error: null,
                selectedUser: action.payload
            };
            case types.GET_SELECTED_TAB_FUEL_PRICE:
        
                return {
                    ...state,
                    loading: false,
                    error: null,
                    selectedFuelPriceTab: action.payload
                };
    
            case types.FETCH_ADD_NEW_FUEL_DATA_BEGIN:
        
                return {
                    ...state,
                    loading: true,
                    error: null
                };
    
            case types.FETCH_ADD_NEW_FUEL_DATA_SUCCESS:
                return {
                    ...state,
                    loading: false,
                    adNewFuelJson: action.payload
                };
    
            case types.FETCH_ADD_NEW_FUEL_DATA_FAILURE:
                    
                    return {
                        ...state,
                        loading: false,
                        error: action.payload.error,
                        adNewFuelJson: {}
                    };
            case types.FETCH_FUEL_TIRE_DATA_BEGIN:

                return {
                    ...state,
                    loading: true,
                    error: null
                };
    
            case types.FETCH_FUEL_TIRE_DATA_SUCCESS:
                return {
                    ...state,
                    loading: false,
                    fuelTireData: action.payload
                };
    
            case types.FETCH_FUEL_TIRE_DATA_FAILURE:
                    
                    return {
                        ...state,
                        loading: false,
                        error: action.payload.error,
                        fuelTireData: {}
                    };
            case types.FETCH_FUEL_ACTIVE_DATA_BEGIN:

                return {
                    ...state,
                    loading: true,
                    error: null
                };
    
            case types.FETCH_FUEL_ACTIVE_DATA_SUCCESS:
                return {
                    ...state,
                    loading: false,
                    fuelActiveData: action.payload
                };
    
            case types.FETCH_FUEL_ACTIVE_DATA_FAILURE:
                    
                    return {
                        ...state,
                        loading: false,
                        error: action.payload.error,
                        fuelActiveData: {}
                    };
            case types.FETCH_SAVE_FUEL_TIRE_DATA_BEGIN:

                return {
                    ...state,
                    loading: true,
                    error: null
                };
    
            case types.FETCH_SAVE_FUEL_TIRE_DATA_SUCCESS:
                return {
                    ...state,
                    loading: false,
                    saveFuelData: action.payload
                };
    
            case types.FETCH_SAVE_FUEL_TIRE_DATA_FAILURE:
                    
                    return {
                        ...state,
                        loading: false,
                        error: action.payload.error,
                        saveFuelData: {}
                    };
            case types.FETCH_DEFAULT_TIRE_DATA_BEGIN:

                    return {
                        ...state,
                        loading: true,
                        error: null
                    };
            case types.FETCH_DEFAULT_TIRE_DATA_SUCCESS:
                return {
                    ...state,
                    loading: false,
                    getDefaultTireData: action.payload
                };
    
            case types.FETCH_DEFAULT_TIRE_DATA_FAILURE:
                    
                    return {
                        ...state,
                        loading: false,
                        error: action.payload.error,
                        getDefaultTireData: {}
                    };
            case types.FETCH_FUEL_ARCHIVE_DATA_SUCCESS:
                return {
                    ...state,
                    loading: false,
                    fuelArchiveData: action.payload
                };
    
            case types.FETCH_FUEL_ARCHIVE_DATA_FAILURE:
                    
                    return {
                        ...state,
                        loading: false,
                        error: action.payload.error,
                        fuelArchiveData: {}
                    };
            case types.GET_SELECTED_COMPANY_FUEL:

                        return {
                            ...state,
                            loading: false,
                            selectedCompany: action.payload
                        };
            case types.SAVE_SELECTED_FUEL_DATA:

            return {
                ...state,
                loading: false,
                selectedFuelData: action.payload
            };
            default:
            return state;
	}
}