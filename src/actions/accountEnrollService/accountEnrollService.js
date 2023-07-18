import axios from 'axios';

const isMultiPodEnabled = process.env.REACT_APP_MULTI_POD_ENABLED;
let baseUrl = ''
if( isMultiPodEnabled === 'true' ) {
    baseUrl = process.env.REACT_APP_ACCT_MAINTENANCE_URL;
} else {
    baseUrl = process.env.REACT_APP_BASE_URL;
}

console.log('base url in enrollment ::: ',baseUrl)

export const accountEnrolljson = ()=>{
    return(
        axios.get('http://localhost:3000/json/accountEnrollment.json')
        .then(response=>response)
    )
}

export const enrollmentNew = ()=>{
    const endpoint = `${baseUrl}/enrollmentNew`;
    return(
        //axios.get('http://localhost:8001/enrollmentNew')
        axios.get(endpoint)
        .then(response=>response)
    )
}

export const enrollmentPending = ()=>{
   
    const endpoint = `${baseUrl}/enrollmentPending`;
    console.log(' endpoint in enrollmentPending details ',endpoint,' isMultiPodEnabled ',isMultiPodEnabled)
    return(
        //axios.get('http://localhost:8001/enrollmentPending')
        axios.get(endpoint)
        .then(response=>response)
    )
}

export const enrollmentComplete = ()=>{
    const endpoint = `${baseUrl}/enrollmentComplete`;
    return(
        //axios.get('http://localhost:8001/enrollmentComplete')
        axios.get(endpoint)
        .then(response=>response)
    )
}

export const enrollmentSave = (payload)=>{
    const endpoint = `${baseUrl}/saveEnrollment`;
    return(
        //axios.post('http://localhost:8001/saveEnrollment',payload)
        axios.post(endpoint,payload)
        .then(response=>response)
        .catch(err=>err.response)
    )
}

export const duplicatePending = (payload)=>{
    const endpoint = `${baseUrl}/duplicatePend`;
    return(
        //axios.post('http://localhost:8001/duplicatePend',payload)
        axios.post(endpoint,payload)
        .then(response=>response)
    )
}