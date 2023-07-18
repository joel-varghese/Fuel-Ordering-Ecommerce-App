import axios from 'axios';

const isMultiPodEnabled = process.env.REACT_APP_MULTI_POD_ENABLED;
let baseUrl = ''
if( isMultiPodEnabled === 'true' ) {
    baseUrl = process.env.REACT_APP_FUELPRICE_URL;
} else {
    baseUrl = process.env.REACT_APP_BASE_URL;
}

//const baseUrl = 'http://localhost:8001'

export const getDiscountDetails = (payload) => {
	
	const endpoint = `${baseUrl}/getDiscountDetails`;
	console.log(' endpoint in getDiscount details ',endpoint,' isMultiPodEnabled ',isMultiPodEnabled)
    return axios
		.post(endpoint, payload )
		.then(response => response.data)
        .catch(err => console.error(err));		
};

export const deleteDiscount = (payload) => {
	  const endpoint = `${baseUrl}/deactivateDiscount`;
	  return axios
		  .post(endpoint, payload )
		  .then(response => response.data)
		  .catch(err => console.error(err));		
};

export const addDiscount = (payload) => {
	  const endpoint = `${baseUrl}/addDiscountData`;
	  return axios
		  .post(endpoint, payload )
		  .then(response => response.data)
		  .catch(err => console.error(err));		
};

export const getTailNumbers=(payload)=>{
	const url = '?'+'Operator='+payload.Operator+'&&'+'TailNumber='+payload.TailNumber+'&&'+'IsRequestedFor='+payload.IsRequestedFor;
	const endpoint = `${baseUrl}/getTailNumbers`+url;
	return axios
		.get(endpoint, payload )
		.then(response => response.data)
		.catch(err => console.error(err));	
}

export const getOperatorsForBulkupload=(payload)=>{
    const endpoint = `${baseUrl}/getOperatorsForBulkupload`;
		return axios
			.post(endpoint, payload )
			.then(response => response.data)
			.catch(err => console.error(err));	
}