import axios from 'axios';

export const searchAddress = (payload) => {

	const baseUrl = process.env.REACT_APP_BASE_URL
	const endpoint = `${baseUrl}/searchAddress`;
	return axios
		.post(endpoint, payload
		)
		.then(response =>  response).catch(err=>{console.error(err)});
};
export const addressValidationService = (payload) => {
		const baseUrl = process.env.REACT_APP_BASE_URL
		const endpoint = `${baseUrl}/addressValidationService`;
	
		return axios
			.post(endpoint, payload
			)
			.then(response =>  response).catch(err=>{console.error(err)});
	};