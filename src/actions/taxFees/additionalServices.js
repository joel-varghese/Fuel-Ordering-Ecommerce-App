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


export const getAddServiceDetails = (payload) => {
	
  // const baseUrl = url
  const endpoint = `${baseUrl}/getAddServices`;
  const form = {
    "role":payload
  }
  return axios
  .post(endpoint, form)
  .then(response => response.data)
  .catch(err => console.log(err));		
};
export const createAddService = (payload) => {
	// const baseUrl = process.env.REACT_APP_BASE_URL
  //const baseUrl = url
  const endpoint = `${baseUrl}/createAddService`;
  const form = payload
  return axios
  .post(endpoint, form)
  .then(response => response.data)
  .catch(err => console.log(err));		
};
export const updateAddService = (payload) => {
	//const baseUrl = process.env.REACT_APP_FUELPRICE_URL
  // const baseUrl = url
  const endpoint = `${baseUrl}/updateAddService`;
  const form = payload
  return axios
  .post(endpoint, form)
  .then(response => response.data)
  .catch(err => console.log(err));		
};
export const deleteAddService = (payload) => {
	
	//const baseUrl = process.env.REACT_APP_FUELPRICE_URL
  // const baseUrl = url
  const endpoint = `${baseUrl}/deleteAddService`;
  const form = {
    "role":payload
  }
  return axios
  .post(endpoint, form)
  .then(response => response.data)
  .catch(err => console.log(err));		
};
