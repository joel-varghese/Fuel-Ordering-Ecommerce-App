import axios from 'axios';

export const loginService = (payload) => {

	const baseUrl = process.env.REACT_APP_BASE_URL
	const endpoint = `${baseUrl}/authenticate_users`;

    return axios
		.post(endpoint, payload )
		//.get(endpoint)
		.then(response => response.data)
        .catch(err => err.response.data );		
};