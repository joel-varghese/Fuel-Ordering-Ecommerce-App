import React, {useState, useEffect}from 'react';
import Menubar from '../menubar/menubar';

//import {BFAJsonService} from '../../actions/bfaJsonService/bfaJsonService';
import Footer from '../footer/footer';
import ContactDetails from './contactDetails';

import './contact.scss';

import { useDispatch, useSelector } from 'react-redux';
import { fetchJSONData} from '../../../actions/contactActions/contactActions';
const Contact = () => {
    const [contactData, setContactData] = useState();
    const payload = {'blobname': "contact.json"};
    const dispatch = useDispatch();
    const contactReducer = useSelector(state => state.contactReducer);
    const jsonData = contactReducer ?.contactJson;

    useEffect(() => {
        fetchJSONData(dispatch, payload)
    },[]);

    useEffect(() => {
         if(jsonData.data)
            setContactData(jsonData.data.data.contactData);
    },[jsonData])

    return (
        <div className='bf-contact'>
            {contactData && jsonData &&
                <>
                {
                    <Menubar />
                }
                {
                    <ContactDetails landingScreen={contactData}/>
                }
                {
                    <Footer />
                }
                </>
            }
        </div>
    )
}

export default Contact