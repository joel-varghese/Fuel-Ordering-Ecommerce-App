import axios from 'axios';


export  const getAccountHomeJson = ()=>{
    return(
        axios.get('http://localhost:3000/json/accountHome.json')
        .then(response=>response)
    )
}

export const fetchOperatorCompanyService = (payload) => {

	const baseUrl = process.env.REACT_APP_BASE_URL
	const endpoint = `${baseUrl}/getUserCompanies`;

    return axios
		.post(endpoint, payload )
		//.get(endpoint)
		.then(response => response.data)
        .catch(err => console.error(err));		
};

