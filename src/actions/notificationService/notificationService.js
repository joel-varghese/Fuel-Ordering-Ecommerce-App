import axios from 'axios';
import {Storage} from '../../controls/Storage';

const isMultiPodEnabled = process.env.REACT_APP_MULTI_POD_ENABLED;
let baseUrl = ''
if( isMultiPodEnabled === 'true' ) {
    baseUrl = process.env.REACT_APP_ACCT_MAINTENANCE_URL;
} else {
    baseUrl = process.env.REACT_APP_BASE_URL;
}

// const baseUrl = 'http://localhost:8001';
export const notificationJson = ()=>{
    
    return(
        axios.get('http://localhost:3000/json/notifications.json')
        .then(response=>response)
    )
}

export const notificationlist = (payload)=>{
    const endpoint = `${baseUrl}/fetchNotification`;
    axios.defaults.headers.post['X-CSRF-Token'] = Storage.getItem('csrfToken');
    return(
        //axios.post('http://localhost:8001/fetchNotification',payload)
        axios.post(endpoint,payload)
        .then(response=>response)
    )
}

export const notificationUser = (payload)=>{
    const endpoint = `${baseUrl}/getuserdetails`;
    //const endpoint= `http://localhost:8001/getuserdetails`;
    return(
        axios.post(endpoint,payload)
        .then(response=>response)
    )
}

export const saveNotification = (payload)=>{
    const endpoint = `${baseUrl}/saveNotification`;
    axios.defaults.headers.post['X-CSRF-Token'] = Storage.getItem('csrfToken');
    return(
        //axios.post('http://localhost:8001/saveNotification',payload)
        axios.post(endpoint,payload)
        .then(response=>response)
    )
}

export const updateNotification = (payload)=>{
    const endpoint = `${baseUrl}/updateNotification`;
    axios.defaults.headers.post['X-CSRF-Token'] = Storage.getItem('csrfToken');
    return(
        //axios.post('http://localhost:8001/updateNotification',payload)
        axios.post(endpoint,payload)
        .then(response=>response)
    )
}

export const updateAction = (payload)=>{
    const endpoint = `${baseUrl}/updateActionNotify`;
    axios.defaults.headers.post['X-CSRF-Token'] = Storage.getItem('csrfToken');
    return(
        //axios.post('http://localhost:8001/updateActionNotify',payload)
        axios.post(endpoint,payload)
        .then(response=>response)
    )
}

export const bulkNotify = (payload)=>{
    const endpoint = `${baseUrl}/bulkNotify`;
    axios.defaults.headers.post['X-CSRF-Token'] = Storage.getItem('csrfToken');
    return(
        //axios.post('http://localhost:8001/updateActionNotify',payload)
        axios.post(endpoint,payload)
        .then(response=>response)
    )
}
