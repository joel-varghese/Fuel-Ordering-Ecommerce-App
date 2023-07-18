import axios from 'axios';
import { Storage } from '../../controls/Storage';

export const initConfigService = () => {

	const baseUrl = process.env.REACT_APP_BASE_URL
	const endpoint = `${baseUrl}/getCSRFToken`;
    return axios
		.get(endpoint)
		.then(response => {
			axios.defaults.headers.post['X-CSRF-Token'] = response.data.CSRFToken;
			return response.data.CSRFToken;
		 	
		})
        .catch(err => console.log('Error while setting CSRF ',err))	
};