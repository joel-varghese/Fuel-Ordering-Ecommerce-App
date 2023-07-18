import axios from 'axios';

const baseUrl = process.env.REACT_APP_BASE_URL;

// const baseUrl = 'http://localhost:8005'

export const getFuelLocations=(payload)=>{
	// const url = '?'+'searchString='+payload.searchString+'&&SearchType='+payload.SearchType+'&&LoggedinUser='+payload.LoggedinUser;
	const endpoint = `${baseUrl}/getFuelLocations`;
	return axios
		.post(endpoint, payload )
		.then(response => response.data)
		.catch(err => console.error(err));	
}

export const setFavouriteFbo=(payload)=>{
	const endpoint = `${baseUrl}/setFavouriteFbo`;
	return axios
		.post(endpoint, payload )
		.then(response => response.data)
		.catch(err => console.error(err));	
}

export const requestPartnerFbo=(payload)=>{
	const endpoint = `${baseUrl}/requestPartnerFbo`;
	return axios
		.post(endpoint, payload )
		.then(response => response.data)
		.catch(err => console.error(err));	
}

export const getPrefferedFbo=(payload)=>{
	const endpoint = `${baseUrl}/getPrefferedFbo`;
	return axios
		.post(endpoint, payload )
		.then(response => response.data)
		.catch(err => console.error(err));	
}
