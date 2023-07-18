import * as types from '../actionTypes';
import { bfaJsonService } from '../BFAServices/BFAJsonService';

export const fetchFuelTireLabelDataBegin = data => ({
	type: types.FETCH_FUEL_TIRE_LABEL_DATA_BEGIN,
	payload: { data }
});
export const fetchFuelTireLabelDataFailure = data => ({
	type: types.FETCH_FUEL_TIRE_LABEL_DATA_FAILURE,
	payload: { data }
});
export const fetchFuelTireLabelDataSuccess = data => ({
	type: types.FETCH_FUEL_TIRE_LABEL_DATA_SUCCESS,
	payload: { data }
});

export const fetchFuelTireDataBegin = data => ({
	type: types.FETCH_FUEL_TIRE_DATA_BEGIN,
	payload: { data }
});
export const fetchFuelTireDataFailure = data => ({
	type: types.FETCH_FUEL_TIRE_DATA_FAILURE,
	payload: { data }
});
export const fetchFuelTireDataSuccess = data => ({
	type: types.FETCH_FUEL_TIRE_DATA_SUCCESS,
	payload: { data }
});

export const fetchJSONData = (paylaod,dispatch)=>{
     return new Promise(resolve => {
        bfaJsonService(paylaod)
            .then(response => {
                
                dispatch(
                    fetchFuelTireLabelDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch((error) => {
                dispatch(
                    fetchFuelTireLabelDataFailure(
                        error
                    )
                );
            });
    });
       

}


