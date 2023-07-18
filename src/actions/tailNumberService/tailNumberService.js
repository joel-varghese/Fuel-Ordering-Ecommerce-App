import axios from 'axios';

const isMultiPodEnabled = process.env.REACT_APP_MULTI_POD_ENABLED;
let baseUrl = ''
if (isMultiPodEnabled === 'true') {
	baseUrl = process.env.REACT_APP_ACCT_MAINTENANCE_URL;
} else {
	baseUrl = process.env.REACT_APP_BASE_URL;
}
export const flightInformationService = (payload) => {

	//console.log(' payload in flightInfo ::: '+payload)
	//const baseUrl = process.env.REACT_APP_ACCT_MAINTENANCE_URL
	const endpoint = `${baseUrl}/aircraftDetails`;

	return axios
		.post(endpoint, payload
		)
		.then(response => response).catch(err => err.response);
};

