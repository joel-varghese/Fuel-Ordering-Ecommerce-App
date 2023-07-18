import axios from 'axios';
// const baseUrl = 'http://localhost:8005'
const baseUrl = process.env.REACT_APP_BASE_URL;

const isMultiPodEnabled = process.env.REACT_APP_MULTI_POD_ENABLED;
// let baseUrl = ''
// if( isMultiPodEnabled === 'true' ) {
//     baseUrl = process.env.REACT_APP_FUELPRICE_URL;
// } else {
//     baseUrl = process.env.REACT_APP_BASE_URL;
// }
export const getDiscounts = (payload) => {
  const endpoint = `${baseUrl}/getDiscounts`;
  
  return axios
  .post(endpoint, payload)
  .then(response => response.data)
  .catch(err => console.log(err));		
};
export const getFedTaxes = (payload) => {
  const endpoint = `${baseUrl}/getFedTaxes`
  
  return axios
  .post(endpoint, {})
  .then(response => response.data)
  .catch(err => console.log(err));		
};
export const saveOrder = (payload) => {
  const endpoint = `${baseUrl}/saveOrder`
  
  return axios
  .post(endpoint, payload)
  .then(response => response.data)
  .catch(err => console.log(err));		
};
export const getOperatorsByTailNum = (payload) => {
  const endpoint = `${baseUrl}/getOperatorsByTailNum`
  return axios
  .post(endpoint, payload)
  .then(response => response.data)
  .catch(err => console.log(err));		
};
