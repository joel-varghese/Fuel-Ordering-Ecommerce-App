import axios from 'axios';

const isMultiPodEnabled = process.env.REACT_APP_MULTI_POD_ENABLED;
let baseUrl = ''
console.log('isMultiPodEnabled ',isMultiPodEnabled)
if( isMultiPodEnabled === 'true' ) {
    baseUrl = process.env.REACT_APP_ACCT_MAINTENANCE_URL;
} else {
    baseUrl = process.env.REACT_APP_BASE_URL;
}

export const getUpdateProfile = (payload,profile,banner) => {
	
	//const baseUrl = process.env.REACT_APP_ACCT_MAINTENANCE_URL
  // const baseUrl = 'http://localhost:8001'
  const endpoint = `${baseUrl}/getUpdateProfile`;
  let form = new FormData()
  form.append('editMyProfileRequest', JSON.stringify(payload))
  if(profile !== undefined){
    form.append('file', profile)
  }
  else{

  }
  if(banner !== undefined){
    form.append('file', banner)
  }
  return axios
  .post(endpoint, form)
  //.get(endpoint)  
  .then(response => response.data)
  .catch(err => console.log(err));		
};

export const saveValidateSecurityCode = (payload, jwtToken) => {
	
	//const baseUrl = process.env.REACT_APP_ACCT_MAINTENANCE_URL
    // const baseUrl = 'http://localhost:8001'
  axios.defaults.headers.post['Authorization'] = `Bearer `+jwtToken
	const endpoint = `${baseUrl}/saveValidateSecurityCode`;
    return axios
		.post(endpoint, payload )
    //.get(endpoint)
		.then(response => response.data)
        .catch(err => console.log(err));		
};