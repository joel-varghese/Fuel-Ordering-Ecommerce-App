
import axios from 'axios';

export const bfaImageService = (payload) => {
	const baseUrl = process.env.REACT_APP_BASE_URL;
	const endpoint = `${baseUrl}/downloadImageFromBlob`;
	return axios
	    .post(endpoint,payload)
		.then(response => response);	  
}; 

export const saveContactDetails = (payload) => {
	const baseUrl = process.env.REACT_APP_BASE_URL;
	const endpoint = `${baseUrl}/saveContactDetails`;
	return axios
	    .post(endpoint,payload)
		.then(response => response);	  
}; 