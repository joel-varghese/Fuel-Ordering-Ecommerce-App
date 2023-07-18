import axios from 'axios';

export const getStatisticsDataService = (payload) => {

	const baseUrl = process.env.REACT_APP_BASE_URL
	const endpoint = `${baseUrl}/getDashboardStatistice`;

    return axios
		.post(endpoint, payload )
		//.get(endpoint)
		.then(response => response.data)
        .catch(err => console.error(err));		
};