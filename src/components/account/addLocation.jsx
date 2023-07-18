import React, { useState,useEffect } from 'react';
import { bfaJsonService } from '../../actions/BFAServices/BFAJsonService';
import './company.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from '../loader/loader';
import CompanyDetails from './companyDetails';
import MembershipDetails from './memberShip';
import Form from 'react-bootstrap/Form';
import { fetchCompanyDetails } from '../../actions/accountServices/accountCompanyService';
import { Storage, jsonStringify } from '../../controls/Storage';
import { PropaneSharp } from '@mui/icons-material';
function addLocation(props) {
    const [fetchCompanyData , setFetchCompanyData] = useState(true);
    const [fieldList, setFieldList] = useState([]);
    
    let navigate = useNavigate();
    const {state} = useLocation();
    
    const [companyDetailsData, setCompanyDetailsData] = useState([]);
    let paylod = { 'blobname': 'company.json' }

    const [isBusy, setBusy] = useState(true);
    useEffect(() => {
      bfaJsonService(paylod).then(data => {
        //setJsonData();
          setFieldList(data.data.companyDetailsData)
          //setInitialState(data.data.companyDetailsData);
          setBusy(false);
          setFetchCompanyData(false)
      });
      
  }, []);

  useEffect(() => {
    fetchCompanyDetails({ 'service': 'company', 'organizationName':Storage.getItem('organizationName')}).then((response) => {
        //setAccountHomeData( response.data)
        let responseData = response && response.res
        let data = {
            address1: responseData.address1,
            address2:responseData.address2,
            city:responseData.city,
            country:responseData.country,
            ein:responseData.ein,
            federalTaxExep:responseData.federalTaxExempt,
            name:responseData.organizationName,
            phoneNo:responseData.phoneNumber,
            primaryLocation:responseData.primaryLocation,
            state:responseData.state,
            vatExeID:responseData.vatExempt,
            zip:responseData.zip,
            organizationId:responseData.organizationid,
            membershiptype:responseData.membershipType,  
            membershipfee:responseData.membershipFee,
            serviceFee:responseData.serviceFee,
            mailingAddressLine:responseData.address1
        }
       //Storage.setItem('organizationId',responseData.organizationid)
        setCompanyDetailsData(data)
        //setformDataSet(data)
        //setInitialState(props.fieldList);
        //setCompanyDetailsData(response.res) 
    })
    
 },[fetchCompanyData]);

     /* useEffect(() => {
        //setInitialState(fboSignupList);
        bfaJsonService({"blobname":"addAdminUser.json"}).then(response=>{
            setInitialState(response.data.addAdminUserData);
            setFieldList(response.data.addAdminUserData)
            setBusy(false);
            
            /* setFieldList(fboSignupList.addAdminUserData)
            setBusy(false);
            setInitialState(fboSignupList.addAdminUserData); */
     //   })
   // },[]);  */
    
  return (<>
    {isBusy ? (<Loader />) : (
    <div className='d-flex d-flex-row login-section bf-operator-enrollment-section signup-section'>
      <div className=" login-form d-flex d-flex-column">
        <Form>
          <div className='bf-company-section'>
            <div className="bf-mrgt-0 bf-mrgb-0"><CompanyDetails fieldList = {fieldList} companyData = {companyDetailsData} enableNewCompanyForm = {props.enableNewCompanyForm}></CompanyDetails></div>
            <div className="bf-mrgt-0 bf-mrgb-0"><MembershipDetails fieldList = {fieldList} companyData = {companyDetailsData} enableNewCompanyForm = {props.enableNewCompanyForm}></MembershipDetails></div>
          </div>
        </Form> 
        </div>
        
    </div>)}
    </>
  );
}

export default addLocation;