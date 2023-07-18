import axios from 'axios';
import { Storage } from '../../controls/Storage';

const isMultiPodEnabled = process.env.REACT_APP_MULTI_POD_ENABLED;
let baseUrl = ''
if( isMultiPodEnabled === 'true' ) {
    baseUrl = process.env.REACT_APP_FUELPRICE_URL;
} else {
    baseUrl = process.env.REACT_APP_BASE_URL;
}

export const fetchFuelTireDetails = (payload) => {
	
	//const baseUrl = process.env.REACT_APP_FUELPRICE_URL
	const endpoint = `${baseUrl}/getFuelPrice`;
	//const endpoint = "http://localhost:8001/fetchCompanyDetails";
    return axios
		.post(endpoint, payload )
		//.get(endpoint)
		.then(response => response.data)
        .catch(err => console.log(err));		
};
export const fetchFuelActiveDetails = (payload) => {
	
	//const baseUrl = process.env.REACT_APP_FUELPRICE_URL
	const endpoint = `${baseUrl}/getActiveFuelPrice`;
	//const endpoint = "http://localhost:8001/fetchCompanyDetails";
    return axios
		.post(endpoint, payload )
		//.get(endpoint)
		.then(response => response.data)
        .catch(err => console.log(err));		
};
export const saveFuelTirePriceService = (payload) => {
	
	//const baseUrl = process.env.REACT_APP_FUELPRICE_URL
	const endpoint = `${baseUrl}/saveFuelTirePrice`;
	//const endpoint = "http://localhost:8001/fetchCompanyDetails";
    return axios
		.post(endpoint, payload )
		//.get(endpoint)
		.then(response => response.data)
        .catch(err => console.log(err));		
};

export const fetchDefaultTireService = (payload) => {
	
	//const baseUrl = process.env.REACT_APP_FUELPRICE_URL
	const endpoint = `${baseUrl}/getdefaulttiersforfuelpricing`;
	//const endpoint = "http://localhost:8001/fetchCompanyDetails";
    return axios
		.post(endpoint, payload )
		//.get(endpoint)
		.then(response => response.data)
        .catch(err => console.log(err));		
};

export const addNewFuelPriceService = (payload) => {
	
	//const baseUrl = process.env.REACT_APP_FUELPRICE_URL
	const endpoint = `${baseUrl}/addEditFuelPricing`;
	//const endpoint = "http://localhost:8001/fetchCompanyDetails";
    return axios
		.post(endpoint, payload )
		//.get(endpoint)
		.then(response => response.data)
        .catch(err => console.log(err));		
};

export const saveRetailPrice = (payload) => {
	
	//const baseUrl = process.env.REACT_APP_FUELPRICE_URL
	const endpoint = `${baseUrl}/saveRetailPrice`;
	//const endpoint = "http://localhost:8001/bfdev/saveRetailPrice";
    return axios
		.post(endpoint, payload )
		//.get(endpoint)
		.then(response => response.data)
        .catch(err => console.log(err));		
};

export const fetchArchiveDataService = (payload) => {
	
	//const baseUrl = process.env.REACT_APP_FUELPRICE_URL
	const endpoint = `${baseUrl}/getArchiveFuelPrice`;
	//const endpoint = "http://localhost:8001/fetchCompanyDetails";
    return axios
		.post(endpoint, payload )
		//.get(endpoint)
		.then(response => response.data)
        .catch(err => console.log(err));		
};

