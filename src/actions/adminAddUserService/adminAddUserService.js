import axios from 'axios';

export const adminAddUserSave = (payload) => {

	const baseUrl = process.env.REACT_APP_BASE_URL;
    const endpoint= `${baseUrl}/add-additional-user`;
	return axios
		.post(endpoint, payload
		)
		.then(response =>  response).catch(err=>err.response);
};