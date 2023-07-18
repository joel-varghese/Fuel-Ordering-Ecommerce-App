import * as types from '../actionTypes';
import { bfaJsonService } from '../BFAServices/BFAJsonService';

import {fetchCompanyDetails} from '../accountServices/accountCompanyService'
import {fetchDefaultTireService} from '../fuelPriceHome/fuelPriceService'

export const fetchAddNewFuelDataBegin = data => ({
	type: types.FETCH_ADD_NEW_FUEL_DATA_BEGIN,
	payload: { data }
});
export const fetchAddNewFuelDataFailure = data => ({
	type: types.FETCH_ADD_NEW_FUEL_DATA_FAILURE,
	payload: { data }
});
export const fetchAddNewFuelDataSuccess = data => ({
	type: types.FETCH_ADD_NEW_FUEL_DATA_SUCCESS,
	payload: { data }
});

export const fetchAddNewFuelDataDataFailure = data => ({
	type: types.FETCH_ADD_NEW_FUEL_DATA_DATA_FAILURE,
	payload: { data }
});
export const fetchAddNewFuelDataDataSuccess = data => ({
	type: types.FETCH_ADD_NEW_FUEL_DATA_DATA_SUCCESS,
	payload: { data }
});

export const fetchDefaultTiresDataFailure = data => ({
	type: types.FETCH_DEFAULT_TIRE_DATA_FAILURE,
	payload: { data }
});
export const fetchDefaultTiresDataSuccess = data => ({
	type: types.FETCH_DEFAULT_TIRE_DATA_SUCCESS,
	payload: { data }
});

export const fetchJSONData = (paylaod,dispatch)=>{
   
    return new Promise(resolve => {

        bfaJsonService(paylaod)
            .then(response => {
                 dispatch(
                    fetchAddNewFuelDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch((error) => {
                dispatch(
                    fetchAddNewFuelDataFailure(
                        error
                    )
                );
            });
    });
       

}

export const fetchLocationNData = (paylaod,dispatch)=>{
   
    return new Promise(resolve => {

        fetchCompanyDetails(paylaod)
            .then(response => {
                 dispatch(
                    fetchAddNewFuelDataDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch((error) => {
                dispatch(
                    fetchAddNewFuelDataDataSuccess(
                        error
                    )
                );
            });
    });
       

}

export const fetchDefaultTires = (paylaod,dispatch)=>{
   
    return new Promise(resolve => {

        fetchDefaultTireService(paylaod)
            .then(response => {
                 dispatch(
                    fetchDefaultTiresDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch((error) => {
                dispatch(
                    fetchDefaultTiresDataSuccess(
                        error
                    )
                );
            });
    });
       

}
