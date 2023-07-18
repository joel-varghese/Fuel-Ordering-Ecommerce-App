import axios from 'axios';

export const operatorSignupSave = (payload, selectedFile) => {

	const baseUrl = process.env.REACT_APP_BASE_URL
	const endpoint = `${baseUrl}/operatorSignUpForm`;
	let formData = new FormData();
  	formData.append("operatorSignupRequest",JSON.stringify(payload))
	for (let i = 0; i < selectedFile.length; i++) {
		formData.append('file', selectedFile[i])
	  }
	
	return axios
		.post(endpoint, formData
		)
		.then( response => response ).catch(err=> err.response);
};
export const operatorSendMail = (payload) => {

	const baseUrl = process.env.REACT_APP_BASE_URL
	const endpoint = `${baseUrl}/sendEmailToRegistrars`;

	return axios
		.post(endpoint, payload
		)
		.then(response =>  response);
};