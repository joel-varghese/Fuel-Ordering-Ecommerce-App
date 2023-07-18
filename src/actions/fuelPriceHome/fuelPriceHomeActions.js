import * as types from '../actionTypes';
import { bfaJsonService } from '../BFAServices/BFAJsonService';
import {fetchFuelTireDetails, fetchFuelActiveDetails, saveFuelTirePriceService, fetchArchiveDataService} from './fuelPriceService'

export const fetchFuelPriceDataBegin = data => ({
	type: types.FETCH_FUEL_PRICE_DATA_BEGIN,
	payload: { data }
});
export const fetchFuelPriceDataFailure = data => ({
	type: types.FETCH_FUEL_PRICE_DATA_FAILURE,
	payload: { data }
});
export const fetchFuelPriceDataSuccess = data => ({
	type: types.FETCH_FUEL_PRICE_DATA_SUCCESS,
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

export const fetchFuelActiveDataBegin = data => ({
	type: types.FETCH_FUEL_ACTIVE_DATA_BEGIN,
	payload: { data }
});
export const fetchFuelActiveDataFailure = data => ({
	type: types.FETCH_FUEL_ACTIVE_DATA_FAILURE,
	payload: { data }
});
export const fetchFuelActiveDataSuccess = data => ({
	type: types.FETCH_FUEL_ACTIVE_DATA_SUCCESS,
	payload: { data }
});
export const fetchSaveFuelTireDataBegin = data => ({
	type: types.FETCH_SAVE_FUEL_TIRE_DATA_BEGIN,
	payload: { data }
});
export const fetchSaveFuelTireDataFailure = data => ({
	type: types.FETCH_SAVE_FUEL_TIRE_DATA_FAILURE,
	payload: { data }
});
export const fetchSaveFuelTireDataSuccess = data => ({
	type: types.FETCH_SAVE_FUEL_TIRE_DATA_SUCCESS,
	payload: { data }
});

export const fetchFuelArchiveDataBegin = data => ({
	type: types.FETCH_FUEL_ARCHIVE_DATA_BEGIN,
	payload: { data }
});
export const fetchFuelArchiveDataFailure = data => ({
	type: types.FETCH_FUEL_ARCHIVE_DATA_FAILURE,
	payload: { data }
});
export const fetchFuelArchiveDataSuccess = data => ({
	type: types.FETCH_FUEL_ARCHIVE_DATA_SUCCESS,
	payload: { data }
});


export const fetchJSONData = (paylaod,dispatch)=>{
    dispatch(fetchFuelPriceDataBegin(''))
    return new Promise(resolve => {
        bfaJsonService(paylaod)
            .then(response => {
                dispatch(
                    fetchFuelPriceDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch((error) => {
                dispatch(
                    fetchFuelPriceDataFailure(
                        error
                    )
                );
            });
    });
       

}
export const getSelectedUser = (user,dispatch)=>{
    dispatch({
        type: types.GET_SELECTED_FUEL_USER,
	    payload: { user }}
    )
};

export const getSelectedTabFuel = (tab,dispatch)=>{
    dispatch({
        type: types.GET_SELECTED_TAB_FUEL_PRICE,
	    payload: { tab }}
    )
}

export const fetchFuelTireData = (paylaod,dispatch)=>{
    return new Promise(resolve => {
        fetchFuelTireDetails(paylaod)
           .then(response => {
               
               dispatch(
                   fetchFuelTireDataSuccess(
                       response
                   )
               );
               resolve(response);
               return response;
           })
           .catch((error) => {
               dispatch(
                   fetchFuelTireDataFailure(
                       error
                   )
               );
           });
   });
      

}

export const fetchFuelActiveData = (paylaod,dispatch)=>{ 
    dispatch(fetchFuelActiveDataBegin(''))
    return new Promise(resolve => {
        fetchFuelActiveDetails(paylaod)
           .then(response => {
               
               dispatch(
                   fetchFuelActiveDataSuccess(
                       response
                   )
               );
               resolve(response);
               return response;
           })
           .catch((error) => {
               dispatch(
                   fetchFuelActiveDataFailure(
                       error
                   )
               );
           });
   });
      

}
export const saveFuelTirePrice = (paylaod,dispatch)=>{
    return new Promise(resolve => {
        saveFuelTirePriceService(paylaod)
           .then(response => {
               
               dispatch(
                   fetchSaveFuelTireDataSuccess(
                       response
                   )
               );
               resolve(response);
               return response;
           })
           .catch((error) => {
               dispatch(
                   fetchSaveFuelTireDataFailure(
                       error
                   )
               );
           });
   });
      

}

export const fetchFuelArchiveData = (paylaod,dispatch)=>{ 
    return new Promise(resolve => {
        fetchArchiveDataService(paylaod)
           .then(response => {
               
               dispatch(
                   fetchFuelArchiveDataSuccess(
                       response
                   )
               );
               resolve(response);
               return response;
           })
           .catch((error) => {
               dispatch(
                   fetchFuelArchiveDataFailure(
                       error
                   )
               );
           });
   });
      

}
export const getSelectedCompanyFP = (company,dispatch)=>{
    dispatch({
        type: types.GET_SELECTED_COMPANY_FUEL,
	    payload: { company }}
    )
};
export const getSelectedFuelPriceData = (data,dispatch)=>{
    dispatch({
        type: types.SAVE_SELECTED_FUEL_DATA,
	    payload: { data }}
    )
};