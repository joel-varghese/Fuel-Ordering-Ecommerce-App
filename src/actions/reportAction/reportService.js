import axios from 'axios';

// const baseUrl = process.env.REACT_APP_BASE_URL;

const baseUrl = 'http://localhost:8001/bfdev'

export const getFBOuserdata=(payload)=>{
	const endpoint = `${baseUrl}/getFBOuserdata`;
	return axios
		.post(endpoint, payload )
		.then(response => response.data)
		.catch(err => console.error(err));	
}

export const getFBOtransactiondata=(payload)=>{
	const endpoint = `${baseUrl}/getFBOtransactiondata`;
	return axios
		.post(endpoint, payload )
		.then(response => response.data)
		.catch(err => console.error(err));	
}

export const getBFuserdata=(payload)=>{
	const endpoint = `${baseUrl}/getBFuserdata`;
	return axios
		.post(endpoint, payload )
		.then(response => response.data)
		.catch(err => console.error(err));	
}

export const getBFtransactiondata=(payload)=>{
	const endpoint = `${baseUrl}/getBFtransactiondata`;
	return axios
		.post(endpoint, payload )
		.then(response => response.data)
		.catch(err => console.error(err));	
}

export const getOPuserdata=(payload)=>{
	const endpoint = `${baseUrl}/getOPuserdata`;
	return axios
		.post(endpoint, payload )
		.then(response => response.data)
		.catch(err => console.error(err));	
}

export const getOPtransactiondata=(payload)=>{
	const endpoint = `${baseUrl}/getOPtransactiondata`;
	return axios
		.post(endpoint, payload )
		.then(response => response.data)
		.catch(err => console.error(err));	
}