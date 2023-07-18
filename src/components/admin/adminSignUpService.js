
import axios from 'axios';
import {Storage} from '../../controls/Storage';

export const registerAdminSign = (formData) => {
    const baseUrl = process.env.REACT_APP_BASE_URL
    const endpoint = `${baseUrl}/registerBarrelfuelAdmin?`;
    axios.defaults.headers.post['X-CSRF-Token'] = Storage.getItem('csrfToken');
    const params = formData
    return axios.post(
      endpoint ,params
    ).then(response =>  response.data.body
        )
    .catch((err) =>err.response.data.body);
  }