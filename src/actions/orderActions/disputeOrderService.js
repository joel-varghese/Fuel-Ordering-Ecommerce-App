import axios from 'axios';

const baseUrl = process.env.REACT_APP_BASE_URL;

// const baseUrl = 'http://localhost:8001/bfdev'

export const getDisputeOrders=(payload)=>{
	const endpoint = `${baseUrl}/getDisputes`;
	return axios
		.post(endpoint, payload )
		.then(response => response.data)
		.catch(err => console.error(err));	
}

export const getDisputeDetails=(payload)=>{
	const endpoint = `${baseUrl}/getDisputeDetails`;
	return axios
		.post(endpoint, payload )
		.then(response => response.data)
		.catch(err => console.error(err));	
}

export const resolveDispute=(payload)=>{
	const endpoint = `${baseUrl}/resolveDispute`;
	return axios
		.post(endpoint, payload )
		.then(response => response.data)
		.catch(err => console.error(err));	
}

export const addCaseNotes=(payload)=>{
	const endpoint = `${baseUrl}/addCaseNotes`;
	return axios
		.post(endpoint, payload )
		.then(response => response.data)
		.catch(err => console.error(err));	
}

export const updateDisputeStatus=(payload)=>{
	const endpoint = `${baseUrl}/updateDisputeStatus`;
	return axios
		.post(endpoint, payload )
		.then(response => response.data)
		.catch(err => console.error(err));	
}

export const getOrderHistory=(payload)=>{
	const endpoint = `${baseUrl}/getOrderHistory`;
	return axios
		.post(endpoint, payload )
		.then(response => response.data)
		.catch(err => console.error(err));	
}