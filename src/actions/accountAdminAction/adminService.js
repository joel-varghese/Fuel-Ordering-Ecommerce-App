import axios from 'axios';

const baseUrl = process.env.REACT_APP_BASE_URL;

// const baseUrl = 'http://localhost:8001/bfdev'

export const getCompaniestoDeactivate=(payload)=>{
	const endpoint = `${baseUrl}/getCompaniestoDeactivate`;
	return axios
		.post(endpoint, payload )
		.then(response => response.data)
		.catch(err => console.error(err));	
}
export const getSystemVariables=(payload)=>{
	const endpoint = `${baseUrl}/getSystemVariables`;
	return axios
		.post(endpoint, payload )
		.then(response => response)
		.catch(err => console.error(err));	
}
export const getEditSystemVariables=(payload)=>{
	const endpoint = `${baseUrl}/getEditSystemVariables`;
	return axios
		.post(endpoint, payload )
		.then(response => response)
		.catch(err => console.error(err));	
}

export const getUserCompanies = (payload)=>{
	const endpoint = `${baseUrl}/getUserCompanies`;
	return axios
		.post(endpoint, payload )
		.then(response => response.data)
		.catch(err => console.error(err));	
}

export const getoperatorusers = (payload)=>{
	const endpoint = `${baseUrl}/getoperatorusers`;
	return axios
		.post(endpoint, payload )
		.then(response => response.data)
		.catch(err => console.error(err));	
}

export const updateCompaniestoDeactivate=(payload)=>{
	const endpoint = `${baseUrl}/updateCompaniestoDeactivate`;
	return axios
		.post(endpoint, payload )
		.then(response => response.data)
		.catch(err => console.error(err));	
}

export const updatecompaniesandusermapping=(payload)=>{
	const endpoint = `${baseUrl}/updatecompaniesandusermapping`;
	return axios
		.post(endpoint, payload )
		.then(response => response.data)
		.catch(err => console.error(err));	
}
