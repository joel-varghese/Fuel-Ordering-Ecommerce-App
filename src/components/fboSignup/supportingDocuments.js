import React, { useState, useEffect } from 'react';
import UploadDocument from './uploadDocument';
import AirportInformation from './airportInformation';
import CompanyDetailsForm from './companyDetails';
import BankDetailsForm from  './BankDetailsForm';
import AdministratorDetailsForm from  './administratorDetails'
import CardPayment from './cardPayment';
import './FboSignupForm.scss';
import '../../assets/styles/accordion-styles.scss';
import Accordion from 'react-bootstrap/Accordion';

const SupportingDocuments = (props) => {
    return (
      <div className='supportDoc' >
   <Accordion defaultActiveKey={['0']} alwaysOpen>
   <Accordion.Item eventKey="0">
        <Accordion.Header><span>Administrator Details</span></Accordion.Header>
        <Accordion.Body>
        <AdministratorDetailsForm/>    
        </Accordion.Body>
      </Accordion.Item>
   <Accordion.Item eventKey="2">
        <Accordion.Header><span>Company Details</span></Accordion.Header>
        <Accordion.Body>
        <CompanyDetailsForm/>    
        </Accordion.Body>
      </Accordion.Item>
    <Accordion.Item eventKey="3">
        <Accordion.Header><span>Airport Location Information</span></Accordion.Header>
        <Accordion.Body>
        <AirportInformation/>    
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header><span>Banking Information</span></Accordion.Header>
        <Accordion.Body>
        <BankDetailsForm/>    
        </Accordion.Body>
      </Accordion.Item>
   <Accordion.Item eventKey="4">
        <Accordion.Header><span>FBO Membership</span></Accordion.Header>
        <Accordion.Body>
        <UploadDocument/> 
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="5">
        <Accordion.Header><span>Payment Information</span></Accordion.Header>
        <Accordion.Body>
        <CardPayment/>
        </Accordion.Body> 
      </Accordion.Item>
    </Accordion>
          </div>
         
         
      );
}


export default SupportingDocuments;

