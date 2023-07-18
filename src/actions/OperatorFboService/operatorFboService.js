import axios from 'axios';

export const operatorFboSave = (payload) => {

	const baseUrl = process.env.REACT_APP_BASE_URL
	const endpoint = `${baseUrl}/operatorFBOEnrollment`;
	return axios
		.post(endpoint, payload
		)
		.then(response => response).catch(err => err.response);
};

export const registerFBOService = (payload) => {

	const baseUrl = process.env.REACT_APP_BASE_URL
	const endpoint = `${baseUrl}/registerFBO`;
	return axios
		.post(endpoint, payload
		)
		.then(response => response).catch(err => err.response);
};

export const operatorFboSendMail = (payload) => {

	const baseUrl = process.env.REACT_APP_BASE_URL
	const endpoint = `${baseUrl}/sendEmailToRegistrars`;
	return axios
		.post(endpoint, payload
		)
		.then(response => response);
};

export const searchAddress = (payload) => {

	const baseUrl = process.env.REACT_APP_BASE_URL
	const endpoint = `${baseUrl}/searchAddress`;

	return axios
		.post(endpoint, payload
		)
		.then(response => response).catch(err => { console.error(err) });
};

export const insertFBODefaultFuelPrice = (payload) => {

	const isMultiPodEnabled = process.env.REACT_APP_MULTI_POD_ENABLED;
	let baseUrl = ''
	if (isMultiPodEnabled === 'true') {
		baseUrl = process.env.REACT_APP_ACCT_MAINTENANCE_URL;
	} else {
		baseUrl = process.env.REACT_APP_BASE_URL;
	}
	//const baseUrl = process.env.REACT_APP_ACCT_MAINTENANCE_URL
	const endpoint = `${baseUrl}/insertFBODefaultFuelPricing`;

	return axios
		.post(endpoint, payload
		)
		.then(response => response).catch(err => { console.error(err) });
};

export const getAddressFromAcukwik = (payload) => {

	let baseUrl = process.env.REACT_APP_BASE_URL
	//const baseUrl = process.env.REACT_APP_ACCT_MAINTENANCE_URL
	const url = '?'+'FBOName='+payload.FBOName+'&&'+'ICAO='+payload.ICAO;
	const endpoint = `${baseUrl}/getAddressFromAcukwik`+url;
	console.log('endpoint in operatorservice ::: ', endpoint)

	return axios
		.get(endpoint, payload
		)
		.then(response => response).catch(err => { console.error(err) });
};
