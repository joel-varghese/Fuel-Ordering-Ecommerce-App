import axios from 'axios';

export const updateRegisterationService = (payload) => {
	
	const baseUrl = process.env.REACT_APP_BASE_URL
	const endpoint = `${baseUrl}/updateRegisteration`;
    return axios
		.post(endpoint, payload )
		//.get(endpoint)
		.then(response => response.data)
        .catch(err => console.error(err));		
};