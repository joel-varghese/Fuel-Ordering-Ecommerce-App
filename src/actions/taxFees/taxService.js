import axios from 'axios';
//const url = process.env.REACT_APP_FUELPRICE_URL
//const baseUrl = 'http://localhost:8001'
const isMultiPodEnabled = process.env.REACT_APP_MULTI_POD_ENABLED;
let baseUrl = ''
if( isMultiPodEnabled === 'true' ) {
    baseUrl = process.env.REACT_APP_FUELPRICE_URL;
} else {
    baseUrl = process.env.REACT_APP_BASE_URL;
}
export const getTaxDetails = (payload) => {
	
	//const baseUrl = url
  // const baseUrl = 'http://localhost:8001'
  const endpoint = `${baseUrl}/getTaxes`;
  const form = {
    "role":payload
  }
  return axios
  .post(endpoint, form)
  .then(response => response.data)
  .catch(err => console.log(err));		
};
export const getTaxTemplates = () => {
	
	//const baseUrl = url
  // const baseUrl = 'http://localhost:8001'
  const endpoint = `${baseUrl}/getTaxTemplates`;
  // const form = {
  //   "role":payload
  // }
  return axios
  .post(endpoint)
  .then(response => response.data)
  .catch(err => console.log(err));		
};
export const createTax = (payload) => {
	//const baseUrl = url
  // const baseUrl = 'http://localhost:8001'
  const endpoint = `${baseUrl}/createTax`;
  const form = payload
  return axios
  .post(endpoint, form)
  .then(response => response.data)
  .catch(err => console.log(err));		
};
export const updateTax = (payload) => {
	//const baseUrl = url
  // const baseUrl = 'http://localhost:8001'
  const endpoint = `${baseUrl}/updateTax`;
  const form = payload
  return axios
  .post(endpoint, form)
  .then(response => response.data)
  .catch(err => console.log(err));		
};
export const deleteTax = (payload) => {
	
	//const baseUrl = url
  // const baseUrl = 'http://localhost:8001'
  const endpoint = `${baseUrl}/deleteTax`;
  const form = {
    "role":payload
  }
  return axios
  .post(endpoint, form)
  .then(response => response.data)
  .catch(err => console.log(err));		
};
