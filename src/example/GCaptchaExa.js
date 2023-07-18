import React from 'react'
import { GoogleCaptcha } from '../controls/GoogleCaptchaV3'
import {Storage} from '../controls/Storage';
import axios from 'axios';
const GCaptchaExa = () => {
    let recaptcha = new GoogleCaptcha("login");

    async function handleClick() {
        let token = await recaptcha.getToken().then(data => data);
        const param = { 'token': token }
        const baseUrl = process.env.REACT_APP_BASE_URL
	    const endpoint = `${baseUrl}/verifyRecaptcha`;
        axios.defaults.headers.post['X-CSRF-Token'] = Storage.getItem('csrfToken');
        axios.post(endpoint, param)
          .then(data => {
            return data.data;
        })
          .catch(err => console.error("err",err));
    }

    return (
        <div>
            <button onClick={handleClick}>Submit</button>
        </div>
    )
}

export default GCaptchaExa