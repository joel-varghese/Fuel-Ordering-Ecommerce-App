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
import { fetchJSONData} from '../../actions/accountHome/accountCompanyActions';
import { useDispatch, useSelector } from 'react-redux';
import { validateField, phoneValidation, einValidation, zipValidation,getFormErrorRules, getPasswordStrength, matchPassword, validateForm } from '../../controls/validations';
import { getSystemVariables } from '../../actions/accountAdminAction/adminService'
import {systemVariables} from '../../actions/accountAdminAction/adminAction'

function Company(props) {
    const [fetchCompanyData , setFetchCompanyData] = useState(true);
    const [fieldList, setFieldList] = useState([]);
    
    let navigate = useNavigate();
    const {state} = useLocation();
    
    const [companyDetailsData, setCompanyDetailsData] = useState([]);
    let paylod = { 'blobname': 'company.json' }
    const dispatch = useDispatch()
    const accountCompanyReducer = useSelector((state) => state.accountCompanyReducer);
    const jsonData = accountCompanyReducer && accountCompanyReducer.accountCompanyJson && accountCompanyReducer.accountCompanyJson;
    const accountHomeReducer = useSelector((state) => state.accountHomeReducer);
    const selectedCompany = accountHomeReducer && accountHomeReducer.selectedCompany && accountHomeReducer.selectedCompany.company;
    const [isBusy, setBusy] = useState(true);
    const adminReducer = useSelector((state) => state.AdminReducer)
    const systemVariables = adminReducer && adminReducer.systemVariables && adminReducer.systemVariables.data 
    useEffect(() => {
      fetchJSONData(paylod, dispatch)
      setBusy(true);
  }, []);


  useEffect(()=>{
    setFieldList(jsonData && jsonData.data && jsonData.data.data && jsonData.data.data.companyDetailsData)
    //setInitialState(data.data.companyDetailsData);
    let payloadSystem={"Loggedinuser":selectedCompany}
                    getSystemVariables(payloadSystem).then((res)=>{
                        let data=res?.data
                        data =  data[0][0]['JSON_UNQUOTE(@JSONResponse)']
                        data=JSON.parse(data)
                        let systemVariable = {}
                        data && data.map((item, index) => {
                            systemVariable[item.VariableName.replace(/ /g,"_")] = item.value;
                        })
                        systemVariables(systemVariable, dispatch)
                        
                    })
    setFetchCompanyData(Math.random())
  },[jsonData && jsonData])

  useEffect(() => {
    fetchCompanyDetails({ 'service': 'company', 'organizationName': selectedCompany}).then((response) => {
        //setAccountHomeData( response.data)
        let responseData = response && response.res
        let data = {}
        if(responseData){
          data = {
              address1: responseData.address1,
              address2:responseData.address2,
              city:responseData.city,
              country:responseData.country,
              ein:responseData.ein !== null ?einValidation(responseData.ein): null,
              federalTaxExep:responseData.federalTaxExempt !== null?einValidation(responseData.federalTaxExempt): null,
              name:responseData.organizationName,
              phoneNo:responseData.phoneNumber !== null ? phoneValidation(responseData.phoneNumber.toString()): null,
              primaryLocation:responseData.primaryLocation,
              state:responseData.state,
              vatExeID:responseData.vatExempt,
              zip:responseData.zip,
              organizationId:responseData.organizationId,
              membershiptype:responseData.membershipType,  
              membershipfee:responseData.membershipFee?responseData.membershipFee:systemVariables['FBO_Subscription_Fee_/_Year_'],
              serviceFee:responseData.serviceFee ?responseData.serviceFee :systemVariables.BF_Service_Charge,
              mailingAddressLine:responseData.address1,
              superUsers:responseData.superUserDetails

          }
          Storage.setItem('organizationId', responseData.organizationId);
        }
        //Storage.setItem('organizationId',responseData.organizationid)
        setCompanyDetailsData(data)
        setBusy(false);

        //setformDataSet(data)
        //setInitialState(props.fieldList);
        //setCompanyDetailsData(response.res) 
    })
    
 },[fetchCompanyData,selectedCompany]);

         
  return (<>
    {isBusy ? (<Loader />) : (
    <div className='d-flex d-flex-row login-section bf-operator-enrollment-section signup-section'>
      <div className=" login-form d-flex d-flex-column">
        <Form>
          <div className='bf-company-section'>
            <div className="bf-mrgt-0 bf-mrgb-0"><CompanyDetails fieldList = {fieldList} companyData = {companyDetailsData} enableNewCompanyForm = {props.enableNewCompanyForm}></CompanyDetails></div>
           {/* <div className="bf-mrgt-0 bf-mrgb-0"><MembershipDetails fieldList = {fieldList} companyData = {companyDetailsData} enableNewCompanyForm = {props.enableNewCompanyForm}></MembershipDetails></div>*/}
          </div>
        </Form> 
        </div>
        
    </div>)}
    </>
  );
}

export default Company;