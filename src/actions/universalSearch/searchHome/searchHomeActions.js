import { fetchCompanyDetails } from '../../accountServices/accountCompanyService';
import * as types from '../../actionTypes';
import { bfaJsonService } from '../../BFAServices/BFAJsonService';

export const fetchSearchHomeDataBegin = data => ({
	type: types.FETCH_SEARCH_HOME_DATA_BEGIN,
	payload: { data }
});
export const fetchSearchHomeDataFailure = data => ({
	type: types.FETCH_SEARCH_HOME_DATA_FAILURE,
	payload: { data }
});
export const fetchSearchHomeDataSuccess = data => ({
	type: types.FETCH_SEARCH_HOME_DATA_SUCCESS,
	payload: { data }
});
export const fetchSearchUserDataBegin = data => ({
	type: types.FETCH_SEARCH_USER_DATA_BEGIN,
	payload: { data }
});
export const fetchSearchUserDataFailure = data => ({
	type: types.FETCH_SEARCH_USER_DATA_FAILURE,
	payload: { data }
});
export const fetchSearchUserDataSuccess = data => ({
	type: types.FETCH_SEARCH_USER_DATA_SUCCESS,
	payload: { data }
});

export const fetchSearchAircraftDataBegin = data => ({
	type: types.FETCH_SEARCH_AIRCRAFT_DATA_BEGIN,
	payload: { data }
});
export const fetchSearchAircraftDataFailure = data => ({
	type: types.FETCH_SEARCH_AIRCRAFT_DATA_FAILURE,
	payload: { data }
});
export const fetchSearchAircraftDataSuccess = data => ({
	type: types.FETCH_SEARCH_AIRCRAFT_DATA_SUCCESS,
	payload: { data }
});

export const fetchSearchCompanyDataBegin = data => ({
	type: types.FETCH_SEARCH_COMPANY_DATA_BEGIN,
	payload: { data }
});
export const fetchSearchCompanyDataFailure = data => ({
	type: types.FETCH_SEARCH_COMPANY_DATA_FAILURE,
	payload: { data }
});
export const fetchSearchCompanyDataSuccess = data => ({
	type: types.FETCH_SEARCH_COMPANY_DATA_SUCCESS,
	payload: { data }
});

export const fetchJSONData = (paylaod,dispatch)=>{
    return new Promise(resolve => {
        bfaJsonService(paylaod)
            .then(response => {
                dispatch(
                    fetchSearchHomeDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch((error) => {
                dispatch(
                    fetchSearchHomeDataFailure(
                        error
                    )
                );
            });
    });
       

}

export const fetchUserData = (paylaod,dispatch)=>{
    dispatch(fetchSearchUserDataBegin())
    return new Promise(resolve => {
        fetchCompanyDetails(paylaod)
            .then(response => {
                dispatch(
                    fetchSearchUserDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch((error) => {
                dispatch(
                    fetchSearchUserDataFailure(
                        error
                    )
                );
            });
    });
       

}

export const fetchAircraftData = (paylaod,dispatch)=>{
    dispatch(fetchSearchAircraftDataBegin())
    return new Promise(resolve => {
        fetchCompanyDetails(paylaod)
            .then(response => {
                dispatch(
                    fetchSearchAircraftDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch((error) => {
                dispatch(
                    fetchSearchAircraftDataFailure(
                        error
                    )
                );
            });
    });
       

}

export const fetchCompanyData = (paylaod,dispatch)=>{
    dispatch(fetchSearchCompanyDataBegin())
    return new Promise(resolve => {
        fetchCompanyDetails(paylaod)
            .then(response => {
                dispatch(
                    fetchSearchCompanyDataSuccess(
                        response
                    )
                );
                resolve(response);
                return response;
            })
            .catch((error) => {
                dispatch(
                    fetchSearchCompanyDataFailure(
                        error
                    )
                );
            });
    });
}

export const getSearchSelectedUser = (user,dispatch)=>{
    dispatch({
        type: types.GET_SEARCH_SELECTED_USER,
	    payload: { user }}
    )
};

export const getSearchSelectedTab = (tab,dispatch)=>{
    dispatch({
        type: types.GET_SEARCH_SELECTED_TAB,
	    payload: { tab }}
    )
}

export const getSearchValue = (tab,dispatch)=>{
    dispatch({
        type: types.GET_SEARCH_VALUE,
	    payload: { tab }}
    )
}