import axios from 'axios';

const isMultiPodEnabled = process.env.REACT_APP_MULTI_POD_ENABLED;
// let baseUrl = ''
// if( isMultiPodEnabled === 'true' ) {
//     baseUrl = process.env.REACT_APP_FUELPRICE_URL;
// } else {
//     baseUrl = process.env.REACT_APP_BASE_URL;
// }

//const baseUrl = 'http://localhost:8001'
const baseUrl = process.env.REACT_APP_BASE_URL;

export const saveAuditLog=(payload)=>{
	//const url = '?'+'FBOName='+payload.FBOName;
	const endpoint = `${baseUrl}/saveAuditLog`;
	return axios
		.post(endpoint, payload )
		.then(response => response.data)
		.catch(err => console.error(err));	
}

export const getAuditLog=(payload)=>{
	//const url = '?'+'FBOName='+payload.FBOName;
	const endpoint = `${baseUrl}/getAuditLog`;
	return axios
		.post(endpoint, payload )
		.then(response => response.data)
		.catch(err => console.error(err));	
}

export const getCategoryAndUser=(payload)=>{
	//const url = '?'+'FBOName='+payload.FBOName;
	const endpoint = `${baseUrl}/getCategoryAndUser`;
	return axios
		.post(endpoint, payload )
		.then(response => response.data)
		.catch(err => console.error(err));	
}