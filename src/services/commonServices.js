
import axios from 'axios';
import { Storage } from '../controls/Storage';
import  CryptoJS  from 'crypto-js'

export const fetchBlobDataService = (jsonName) => {

  const baseUrl = process.env.REACT_APP_BASE_URL;
  const endpoint = `${baseUrl}/readJSONFromBlob?`;
  axios.defaults.headers.post['X-CSRF-Token'] = Storage.getItem('csrfToken');
  const params = {
    blobname: jsonName
  }
  return axios.post(
    endpoint, params
  ).then(response => response.data
  )
    .catch(() => {
    });
}



export const lookupService = (requestData) => {

  const baseUrl = process.env.REACT_APP_BASE_URL;
  const endpoint = `${baseUrl}/getLookupDetails?`;

  let serviceName = requestData.serviceName;
  let reqHeaders = requestData.headers;
  let headers = {};
  axios.defaults.headers.post['X-CSRF-Token'] = Storage.getItem('csrfToken');
  if (serviceName === "fuelserviceoffered") {
    let fuelService = ["Jet Fuel",
      "AV Gas",
      "Sustainable Aviation Fuel (SAF)"];
    return fuelService;
  }

  if (serviceName === "country") {
    let country = ["United States"];
    return country;
  }

  const params = {
    "lookupServiceName": serviceName
  }
  if (reqHeaders)
    params["headers"] = reqHeaders;
  return axios.post(
    endpoint, params, {
    headers: headers
  }
  ).then(response => response.data
  )
    .catch(() => {
    });
}
export const SendMailToUsers = (payload) => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const endpoint = `${baseUrl}/sendEmailToRegistrars`;
  axios.defaults.headers.post['X-CSRF-Token'] = Storage.getItem('csrfToken');
  return axios.post(
    endpoint, payload
  ).then(response => response);
};
export const SendSMSToUsers = (payload) => {
  const isMultiPodEnabled = process.env.REACT_APP_MULTI_POD_ENABLED;
  let baseUrl = ''
  if (isMultiPodEnabled === 'true') {
    baseUrl = process.env.REACT_APP_ACCT_MAINTENANCE_URL;
  } else {
    baseUrl = process.env.REACT_APP_BASE_URL;
  }
  const endpoint = `${baseUrl}/sendSMS`;
  return axios.post(
    endpoint, payload
  ).then(response => response);
};
export const validateMobile = (payload) => {

  const isMultiPodEnabled = process.env.REACT_APP_MULTI_POD_ENABLED;
  let baseUrl = ''
  if (isMultiPodEnabled === 'true') {
    baseUrl = process.env.REACT_APP_ACCT_MAINTENANCE_URL;
  } else {
    baseUrl = process.env.REACT_APP_BASE_URL;
  }
  const endpoint = `${baseUrl}/verifyMobile`;
  return axios
    .post(endpoint, payload)
    //.get(endpoint)
    .then(response => response.data)
    .catch(err => console.error(err));
};
export const verifyCaptcha = (payload) => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const endpoint = `${baseUrl}/verifyRecaptcha`;
  axios.defaults.headers.post['X-CSRF-Token'] = Storage.getItem('csrfToken');
  return axios.post(
    endpoint, payload
  ).then(response => response);
};

export const encryptData = (emailId) => {
  let encryptKey = process.env.REACT_APP_ENCRYPTION_SECRETKEY;
  const data = CryptoJS.AES.encrypt(
    JSON.stringify(emailId),
    encryptKey
  ).toString();
  console.log('encrypt data ',data)
  return data;
};

export const decryptData = (userName) => {
  console.log('username before decrypt ',userName)
  let encryptKey = process.env.REACT_APP_ENCRYPTION_SECRETKEY;
  const bytes = CryptoJS.AES.decrypt(userName, encryptKey);
  const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  console.log('decrypt data ',data)
  return data;
};

export const verifyUserRegisteration = (payload) => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const endpoint = `${baseUrl}/verifyUserRegistration?`;
  return axios.get(
    endpoint,
    {
    params: {
      username:payload
    }
  }
  ).then(response => response).catch(err => err.response);
};

export const updateDeclineOrder = (payload) => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  // const baseUrl = 'http://localhost:8001/bfdev'
  const endpoint = `${baseUrl}/updateDeclineOrder`;
  return axios.post(
    endpoint, payload
  ).then(response => response).catch(err => err.response);
};