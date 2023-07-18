import axios from 'axios';

const baseUrl = process.env.REACT_APP_BASE_URL;

//const baseUrl = 'http://localhost:8005'

export const getActiveOrders=(payload)=>{
	const endpoint = `${baseUrl}/getActiveOrders`;
	return axios
		.post(endpoint, payload )
		.then(response => response.data)
		.catch(err => console.error(err));	
}

export const raiseDispute=(payload)=>{
	const endpoint = `${baseUrl}/raiseDispute`;
	return axios
		.post(endpoint,payload)
		.then(response => response.data)
		.catch(err => console.error(err));	
}

export const cancelDeclineOrder=(payload)=>{
	const endpoint = `${baseUrl}/cancelDeclineOrder`;
	return axios
		.post(endpoint, payload)
		.then(response => response.data)
		.catch(err => console.error(err));	
}

export const getFboUsers=(payload)=>{
	const endpoint = `${baseUrl}/getFboUsers`;
	return axios
		.post(endpoint, payload)
		.then(response => response.data)
		.catch(err => console.error(err));	
}

export const getFboLocationServices=(payload)=>{
	const endpoint = `${baseUrl}/getFboLocationServices`;
	return axios
		.post(endpoint, payload)
		.then(response => response.data)
		.catch(err => console.error(err));	
}