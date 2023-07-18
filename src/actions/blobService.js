import axios from 'axios';

export const blobService = (payload) => {
	
	const baseUrl = process.env.REACT_APP_BASE_URL
	const endpoint = `${baseUrl}/readJSONFromBlob`;
    return axios
		.post(endpoint, payload )
		//.get(endpoint)
		.then(response => response.data)
        .catch(err => console.error(err));		
};