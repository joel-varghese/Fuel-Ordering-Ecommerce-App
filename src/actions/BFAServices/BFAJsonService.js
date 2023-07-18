
import axios from 'axios';

export const bfaJsonService = (payload) => {
	const baseUrl = process.env.REACT_APP_BASE_URL
	const endpoint = `${baseUrl}/readJSONFromBlob`;
	return axios
		// .post(endpoint, payload)
		.get(`http://localhost:3000/json/${payload.blobname}`)
		.then(response => response);
};

//  export const bfaJsonService = (payload) => {
// 	const baseUrl = process.env.REACT_APP_BASE_URL
// 	const endpoint = `${baseUrl}/readJSONFromBlob`;\
// 	return axios
// 		.get(`http://localhost:3000/json/${payload.blobname}`)
// 		.then(response => response);
	  
// }; 
