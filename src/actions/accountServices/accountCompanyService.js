import axios from 'axios';
import { Storage } from '../../controls/Storage';

const isMultiPodEnabled = process.env.REACT_APP_MULTI_POD_ENABLED;
let baseUrl = ''
if( isMultiPodEnabled === 'true' ) {
    baseUrl = process.env.REACT_APP_ACCT_MAINTENANCE_URL;
} else {
    baseUrl = process.env.REACT_APP_BASE_URL;
}

export const companyService = (payload) => {
	
	//const baseUrl = process.env.REACT_APP_BASE_URL
	const endpoint = `${baseUrl}/update-company-details`;
    return axios
		.post(endpoint, payload )
		//.get(endpoint)
		.then(response => response.data)
        .catch(err => console.log(err));		
};
/**
 * Save comapny data after edit
 * @param {
 * } payload 
 * @returns 
 */
export const accountCompanyEditService = (payload) => {
	
	//const baseUrl = process.env.REACT_APP_ACCT_MAINTENANCE_URL
	const endpoint = `${baseUrl}/updateCompanyDetails`;
	payload.loginUserName = Storage.getItem('email')
	//const endpoint = "http://localhost:8001/updateCompanyDetails";
    return axios
		.post(endpoint, payload )
		//.get(endpoint)
		.then(response => response.data)
        .catch(err =>err);		
};

export const accountCompanyDeactivateService = (payload) => {
	
	//const baseUrl = process.env.REACT_APP_ACCT_MAINTENANCE_URL
	const endpoint = `${baseUrl}/deactivateCompanyDetails`;
	payload.loginUserName = Storage.getItem('email')
	//const endpoint = "http://localhost:8001/deactivateCompanyDetails";
    return axios
		.post(endpoint, payload )
		//.get(endpoint)
		.then(response => response.data)
        .catch(err => console.log(err));		
};
export const accountUserDelete = (payload) => {
	
	//const baseUrl = process.env.REACT_APP_ACCT_MAINTENANCE_URL;
	const endpoint = `${baseUrl}/deleteInactiveUser`;
	payload.loginUserName = Storage.getItem('email')
	//const endpoint = "http://localhost:8001/deactivateUserDetails";
    return axios
		.post(endpoint, payload )
		//.get(endpoint)
		.then(response => response.data)
        .catch(err => err.response.data);		
};
export const accountUserDeactivateService = (payload) => {
	
	//const baseUrl = process.env.REACT_APP_ACCT_MAINTENANCE_URL;
	const endpoint = `${baseUrl}/deactivateUserDetails`;
	payload.loginUserName = Storage.getItem('email')
	//const endpoint = "http://localhost:8001/deactivateUserDetails";
    return axios
		.post(endpoint, payload )
		//.get(endpoint)
		.then(response => response.data)
        .catch(err => console.log(err));		
};

export const fetchCompanyDetails = (payload) => {
	payload.loginUserName = Storage.getItem('email')
	payload.userType = Storage.getItem('userType')
	//const baseUrl = process.env.REACT_APP_ACCT_MAINTENANCE_URL
	const endpoint = `${baseUrl}/fetchCompanyDetails`;
	//const endpoint = "http://localhost:8001/fetchCompanyDetails";
    return axios
		.post(endpoint, payload )
		//.get(endpoint)
		.then(response => response.data)
        .catch(err => console.log(err));		
};

export const deleteAircraft = (payload) => {
	
	//const baseUrl = process.env.REACT_APP_ACCT_MAINTENANCE_URL
	const endpoint = `${baseUrl}/deleteAircraft`;
	payload.loginUserName = Storage.getItem('email')
	//const endpoint = "http://localhost:8001/deleteAircraft";
    return axios
		.post(endpoint, payload )
		//.get(endpoint)
		.then(response => response.data)
        .catch(err => console.log(err));		
};

export const uploadDocument = (payload,file) => {
	payload.saveJSON.loginUserName = Storage.getItem('email')
	let formData = new FormData();
  	formData.append("uploadRequest",JSON.stringify(payload.saveJSON))
	formData.append('file', file)
	//const baseUrl = process.env.REACT_APP_ACCT_MAINTENANCE_URL
	const endpoint = `${baseUrl}/uploadNewDoc`;
	//const endpoint = "http://localhost:8001/uploadNewDoc";
    return axios
		.post(endpoint, formData)
		//.get(endpoint)
		.then(response => response.data)
        .catch(err => console.log(err));		
};

export const deleteDocuments = (payload) => {
	payload.loginUserName = Storage.getItem('email')
	//const baseUrl = process.env.REACT_APP_ACCT_MAINTENANCE_URL
	const endpoint = `${baseUrl}/deleteDocuments`;
	//const endpoint = "http://localhost:8001/deleteDocuments";
    return axios
		.post(endpoint, payload )
		//.get(endpoint)
		.then(response => response.data)
        .catch(err => console.log(err));		
};