import axios from 'axios';
//const url = process.env.REACT_APP_FUELPRICE_URL
// const url = 'http://localhost:8001'

const isMultiPodEnabled = process.env.REACT_APP_MULTI_POD_ENABLED;
let baseUrl = ''
if( isMultiPodEnabled === 'true' ) {
    baseUrl = process.env.REACT_APP_FUELPRICE_URL;
} else {
    baseUrl = process.env.REACT_APP_BASE_URL;
}

export const getFeeDetails = (payload) => {
	
	//const baseUrl = url
  //const baseUrl = 'http://localhost:8001'
  const endpoint = `${baseUrl}/getFees`;
  const form = {
    "role":payload
  }
  return axios
  .post(endpoint, form)
  .then(response => response.data)
  .catch(err => console.log(err));		
};
export const createFee = (payload) => {
	//const baseUrl = url
  //const baseUrl = 'http://localhost:8001'
  const endpoint = `${baseUrl}/createFee`;
  const form = payload
  return axios
  .post(endpoint, form)
  .then(response => response.data)
  .catch(err => console.log(err));		
};
export const updateFee = (payload) => {
	//const baseUrl = url
  //const baseUrl = 'http://localhost:8001'
  const endpoint = `${baseUrl}/updateFee`;
  const form = payload
  return axios
  .post(endpoint, form)
  .then(response => response.data)
  .catch(err => console.log(err));		
};
export const deleteFee = (payload) => {
	
	//const baseUrl = url
  //const baseUrl = 'http://localhost:8001'
  const endpoint = `${baseUrl}/deleteFee`;
  const form = {
    "role":payload
  }
  return axios
  .post(endpoint, form)
  .then(response => response.data)
  .catch(err => console.log(err));		
};
export const getFeesTiers = (payload) => {
	
	//const baseUrl = url
  //const baseUrl = 'http://localhost:8001'
  const endpoint = `${baseUrl}/getFeesTiers`;
  const form = {
    "role":payload
  }
  return axios
  .post(endpoint, form)
  .then(response => response.data)
  .catch(err => console.log(err));		
};
