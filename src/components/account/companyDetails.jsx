import React, { useState, useEffect, useRef } from 'react';
import Row from 'react-bootstrap/Row';
import Input from '../input/input';
import Select from '../select/select';
import Radio from '../radio/radio';
import { bfaJsonService } from '../../actions/BFAServices/BFAJsonService';
import ButtonComponent from '../button/button';
import MultiSelectCheckbox from '../multiSelect/multiSelectCheckbox';
import { ButtonGroup } from 'react-bootstrap';
import './company.scss';
import * as xlsx from "xlsx";
import { useLocation, useNavigate } from 'react-router-dom';
import CustomModal from '../customModal/customModal';
import CustomFormModal from '../customModal/customFormModal';
import { accountCompanyEditService, accountCompanyDeactivateService, fetchCompanyDetails } from '../../actions/accountServices/accountCompanyService';
import Subheading from '../subHeading/subHeading';
import { SendMailToUsers } from '../../services/commonServices';
import Loader from '../loader/loader';
import { searchAddress } from '../../actions/searchService/search'
import { addressValidationService } from '../../actions/searchService/search';
import { validateField, phoneValidation, einValidation, zipValidation,getFormErrorRules, getPasswordStrength, matchPassword, validateForm } from '../../controls/validations';
import { Storage, jsonStringify } from '../../controls/Storage';
import CompanyDetailsForm from './companyDetailForm';
import { getAccessLevel,getSuperAccess } from '../../controls/commanAccessLevel';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { stateMapper } from '../stateMapper';
import { sender_Email } from '../../controls/commonConstants';
import { getCompany } from '../../actions/accountHome/accountHomeActions';
import { saveNotificationList } from '../../actions/notificationService/notificationAction';
import {saveAuditLogData } from '../../actions/auditLog/auditLogActions';
import { isDeactivate, updateCompanies } from '../../actions/accountAdminAction/adminAction';

function CompanyDetails(props) {
    const [formData, setFormData] = useState({});
    const [formDataSet, setformDataSet] = useState({});
    const [formFieldData, setFormFieldData] = useState([]);
    const [fieldList, setFieldList] = useState([]);
    const [formErrors, setFormErrors] = useState({});
    const [formFieldErrors, setFormFieldErrors] = useState([]);
    const [isEditable, setIsEditable] = useState(false);
    const [disable, setdisable] = useState(true);
    const [enableSave, setenableSave] = useState(true);
    const [operatorSignup, setoperatorSignupForm] = useState({});
    const [modalShow, setModalShow] = useState(false);
    const [deactiveShow, setDeactiveShow] = useState(false)
    const [deactiveText,setDeactiveText] = useState('')
    const [updateReq,setUpdateReq] = useState({})
    const [results, setResults] = useState({});
    const [fullresults, setFullResults] = useState({});
    const [companyDetailsData, setCompanyDetailsData] = useState([]);
    const [address1Selected, setAddress1Selected] = useState([]);
    const [isAddress1Loading, setAddress1Loading] = useState(false);
    let [resetvalue,setResetValue] = useState(); 
    const [showDeactivate, setShowDeactivate] = useState(false);
    const typeaheadRef = useRef(null);
    let navigate = useNavigate();
    const { state } = useLocation();
    const dispatch = useDispatch();
    const { currentUserRole, storageOrgName } = state ? state : {};
    const restrictedFields = ['organizationName', 'userType'];
    const [isLoading, setIsLoading] = useState(false);
    const [editname,seteditname] = useState(null)
    const orgName = Storage.getItem('organizationName')
    const loginName = Storage.getItem('email')
    const access = JSON.parse(Storage.getItem('accessLevel'))[0]
    const type = Storage.getItem('userType')

    let addressdata = []
    let fulladdressdata = []
    let isaddressvalid = true;
    let paylod = { 'blobname': 'AccountCompanyDetails.json' }
    const accountHomeReducer = useSelector((state) => state.accountHomeReducer);
    const adminReducer = useSelector((state) => state.AdminReducer)
    const deactivateScreen = adminReducer && adminReducer.isDeactivate && adminReducer.isDeactivate.data 
    const inactiveStatus = adminReducer && adminReducer.inactive && adminReducer.inactive.data 
    const selectedCompany = accountHomeReducer && accountHomeReducer.selectedCompany && accountHomeReducer.selectedCompany.company;
    const selectedUser = accountHomeReducer && accountHomeReducer.selectedUser && accountHomeReducer.selectedUser;
    const [isBusy, setBusy] = useState(true);

    let melissaEndpointURI = process.env.REACT_APP_MELISSA_ENDPOINT
    let melissaTopRecords = process.env.REACT_APP_MELISSA_TOP_RECORDS
    
    useEffect(() => {
        // bfaJsonService(paylod).then(data => {
        //setJsonData();
        setFieldList(props.fieldList)
        setCompanyDetailsData(props.companyData)
        setInitialState(props.fieldList);
        setBusy(false);
        setResults(addressdata)
        if(Storage.getItem('userType') ===  "Barrel Fuel"){
            setIsEditable(true)
          } else {
            setIsEditable(false)
          }
          setdisable(true)

        // });
    }, [props.companyData]);

    useEffect(() => {
        // bfaJsonService(paylod).then(data => {
        //setJsonData();
        
        setInitialState(props.fieldList);

        // });
    }, [companyDetailsData]);
    const getFormErrorRules = (item) => {
        return {
            isValid: item.name === "name" ? true : item.isRequired  ? true : false,
            isTouched: false,
            activeValidator: {},
            validations: item.validations,
            isRequired: item.isRequired,
            minLength: item.minLength,
            maxLength: item.maxLength
        };
    }
    const setInitialState = (adminAddUserData, isClear, isClearSubField) => {
        
        let details = {};
        let errDetails = {};
        //const formDataSet = {};
        let formdetails = [];
        let formFieldError = [];
        const fieldTypeArr = ['input', 'select', 'asynctypeahead'];
        adminAddUserData && adminAddUserData.length && adminAddUserData[0].sections.subSections.forEach((items) => {

            items.companyFieldsArray && items.companyFieldsArray.forEach((item, index) => {
                item.fields.forEach((item) => {
                    if (fieldTypeArr.includes(item.component.toLowerCase())) {
                        //details[item.name] = item.name === 'name' ? "Infinite Pvt Ltd" : formFieldData && formFieldData.length > index ? formFieldData[item.name] : item.defaultValue ? item.defaultValue : "";
                        if(item.name === "membershiptype"){
                            details[item.name] = companyDetailsData && companyDetailsData[item.name] && companyDetailsData[item.name] !== null ?  companyDetailsData[item.name]:"Premium";
                        }else {
                            details[item.name] = companyDetailsData && companyDetailsData[item.name] &&  companyDetailsData[item.name] !== null ?  companyDetailsData[item.name]:"";
                        }
                        
                        errDetails[item.name] = getFormErrorRules(item);

                        errDetails = { ...setPrevActiveValidator(errDetails, item, index) };
                    }
                })
                formdetails = JSON.parse(JSON.stringify(details));
                formFieldError = JSON.parse(JSON.stringify(errDetails));
                setAddress1Selected('');
                try { 
                let melissaTempArr = [];
                let address1Data = formdetails && formdetails.address1 ? formdetails.address1 : '';
                console.log(' addresss1Data ::: ', address1Data)
                melissaTempArr.push(address1Data)
                setAddress1Selected(melissaTempArr);
                } catch (err) {
                    console.error(' Error while setting initial melissa ',err)
                }
               
                     //typeaheadRef.current.cle

            })
        });
        setdisable(true)
        setFormFieldData(formdetails);
        setFormFieldErrors(formFieldError);
        setFormData(formdetails);
        setformDataSet(formdetails)
        setFormErrors(formFieldError);
    }

    const setPrevActiveValidator = (curFormErrors, item, index) => {
        //const { formErrors } = this.state;
        if (formFieldErrors[index]) {
            curFormErrors[item.name].isValid = formFieldErrors[index][item.name].isValid;
            curFormErrors[item.name].isTouched = formFieldErrors[index][item.name].isTouched;
            if (formFieldErrors[index][item.name].activeValidator !== {} && formFieldErrors[index][item.name].activeValidator.validation) {
                const activeValidator = curFormErrors[item.name].validations.filter((elem) => elem.validation === formFieldErrors[index][item.name].activeValidator.validation);
                if (activeValidator.length) {
                    curFormErrors[item.name].activeValidator = activeValidator[0];
                }
            }
        }
        return curFormErrors;
    }
    const updateResultJsonNames = (uploadData) => {
        let resultArray = [];
        let fieldArray = { "Email": "additionalUserMail", "Role": "additionalUserRole", "Level of Access": "additionalUserLevelAccess", "Location": "location" };

        uploadData.forEach(item => {
            let dummyOb = {};
            for (const property in item) {
                dummyOb[fieldArray[property]] = item[property]
            }
            resultArray.push(dummyOb);
        });

        let res = cancatinateRows(resultArray);
        return res;//resultArray //abc; 
    }

    const cancatinateRows = (data) => {
        const ObjecDataAt = {};
        for (let i = 0; i < data.length; i++) {
            let ObjKey = '';
            let value = [];
            let dummyOb = {}
            for (const property in data[i]) {
                if (property != 'location') {
                    ObjKey = ObjKey + `${property}|${data[i][property]}|`;
                } else {
                    dummyOb["value"] = data[i][property];
                    dummyOb["label"] = data[i][property];
                    value.push(dummyOb);

                }
            }
            if (ObjecDataAt[ObjKey]) {
                ObjecDataAt[ObjKey] = [...ObjecDataAt[ObjKey], ...value]
            } else {
                ObjecDataAt[ObjKey] = value;
            }
        }

        const updatedArray = []
        for (const property in ObjecDataAt) {
            let data = property.split('|');
            const updatedObj = {};
            for (let j = 0; j < data.length - 1; j++) {
                updatedObj[data[j]] = data[j + 1];
                j++;

            }
            updatedObj['location'] = ObjecDataAt[property];
            updatedArray.push(updatedObj);

        }

        return updatedArray;
    }
    const handleChange = (e, field, index, flag) => {
        //let formDataSet = {};
        let fields;
        let target = e.target;
        let fieldName, fieldValue;
        if(field.name != null){
            setenableSave(false)
        }
        /*if (field.name == "address1") {

            setIsLoading(true);

            let value = {
                "ff": target.value
            }


            fetchaddressFunction(value)
        }*/
        if(field.name == 'name'){
            seteditname(true)
        }
        if (field.validations) {
            for (var i = 0; i < field.validations.length; i++) {
                if (field.validations[i].validation === 'CheckUSPhone') {
                    e.target.value = phoneValidation(e.target.value);
                } else if (field.validations[i].validation === 'CheckEIN') {
                    e.target.value = einValidation(e.target.value);
                } else if (field.validations[i].validation === 'CheckZIP') {
                    if (!(new RegExp(field.validations[i].validateRule)
                        .test(e.target.value))) {
                        e.target.value = zipValidation(e.target.value)
                    }
                }
            }
        }
        
           if (flag) {
            let fields = [];
            fields = JSON.parse(JSON.stringify(formFieldData));
            let formData = {}
            fieldName = target.name;
            fieldValue = target.value;
            fieldValue = fieldValue
            fields[fieldName] = fieldValue;


            
            formData = {
                ...formDataSet,
                ...fields
            };

            setFormData(formData);
            //setformDataSet(formData) 
            setformDataSet(formData)
            setFormFieldData(formData)
        }
        else {
            //if (field.name != "DocumentUpload") {
            fieldName = target.name;
            fieldValue = target.value;
            let fields = {};
            fieldValue = fieldValue.trim()

            fields[fieldName] = fieldValue;
            validateField(fieldName, fieldValue, fields, index, flag);
            formData = {
                ...formDataSet,
                ...fields
            };
            setFormFieldData(fields);
            setFormData(formData);
            setformDataSet(formData)
            setFormFieldData(formData)
            //}

        }



        //validateField(fieldName, fieldValue, fields, true);

    }
    const handleBlur = (e, item, index) => {
        let formdData = {};
        let fields = {};
        /* let formValid = this.state.formValid;*/
        //const fieldValidationErrors = {...this.state.formErrors}; 

        let target = e.target;
        let fieldName, fieldValue;
        fieldName = target.name;
        fieldValue = target.value;
        fieldValue = fieldValue.trim()
        fields[fieldName] = fieldValue;
        const errorObj = validateField(
            fieldName, fieldValue, fields, true, formErrors, formData
        );

        setFormErrors(errorObj);
        formdData = {
            ...formDataSet,
            ...fields
        }
        setFormData(formdData);
        setformDataSet(formdData)
        setFormFieldData(formdData)

    }



    const validateForm = () => {
        let formValid = true;
        // const formErrorKeys = Object.keys(formErrors);
        // for (let i = 0; i < formErrorKeys.length; i++) {
        //     const fieldName = formErrorKeys[i];
        //     if (!formErrors[fieldName].isValid) {
        //         formValid = formErrors[fieldName].isValid;
        //         return formValid;
        //       }

        // }

        // formFieldErrors.map((val,index)=>{
        Object.keys(formFieldErrors).forEach((fieldname) => {
            if (!formFieldErrors[fieldname].isValid) {
                formValid = formFieldErrors[fieldname].isValid;
                return formValid;
            }
        })
        //})
        return formValid;
    }
    
    const formSaveData = () => {
        let saveJson = {};
        let finalJson = {};
        let fieldData = JSON.parse(JSON.stringify(formFieldData));
        
        saveJson = {
            "service": "company",
            "loginUserName": Storage.getItem('email')?Storage.getItem('email'):null,
            "json": {

                "state": fieldData.state,

                "country": fieldData.country,

                "city": fieldData.city,

                "organizationId": Storage.getItem("organizationId"),

                "organizationName":Storage.getItem('userType') !="Barrel Fuel"? Storage.getItem("organizationName"):fieldData.name,

                "fedralTaxExemptId": fieldData.federalTaxExep,

                "addressLine1": fieldData.address1,

                "addressLine2": fieldData.address2,

                "companyPrimaryLocation": fieldData.primaryLocation,

                "zip": fieldData.zip,

                "contactNumber": parseInt(fieldData.phoneNo.replace(/\D/g, '')),

                "ein": parseInt(fieldData.ein.replace(/\D/g, '')),

                "vatExemptId": fieldData.vatExeID,

                "serviceFee": fieldData.serviceFee,

                "membershipFee": fieldData.membershipfee,

                "fboMembershipName": fieldData.membershiptype,

                "mailingAddressLine": fieldData.mailingAddressLine,
               

                "deActivationId": Storage.getItem("organizationId")
            }
        }




        return saveJson;
    }
    const sendmail = () => { 
        let companyName=Storage.getItem("organizationName")
        companyName = companyName.charAt(0).toUpperCase() + companyName.slice(1);
        const emailBody = fieldList[0].emailBody
        companyDetailsData.superUsers && companyDetailsData.superUsers.forEach((val)=>{
          
            let name = val.firstName
            name = name.charAt(0).toUpperCase() + name.slice(1);
            let paragraph = `${emailBody.paragraph} ${name},`
            let body = `${paragraph} <br> <br>${emailBody.text}${companyName} ${emailBody.html}`
            const emailPayload = {
                "to": [val.email],
                "from": sender_Email,
                "subject": emailBody.title,
                "text": paragraph,
                "html": body
            }
            SendMailToUsers(emailPayload)
        })
        
    }   
        
    const clickDeactivate = (data,item) => { 
        if(item.name=='deactive'){
            setModalText(fieldList.length && fieldList[0].sections.modal[0].deactivate.text)
        }else if(item.name=='requestdeactive'){
            setModalText(fieldList.length && fieldList[0].sections.modal[0].requestdeactivate.text)
        }
        setShowDeactivate(true);
        document.getElementById('root').style.filter = 'blur(5px)';
        //setDeactivateData(data)
      }
    
    const handleClick = (e, item, index) => {
        
        if (item.name === "deactive") {
            if(modalText==fieldList[0].sections.modal[0].deactivate.text){
                let saveData = formSaveData()
          
                accountCompanyDeactivateService(saveData).then(res => {
                    let selectedType = Storage.getItem('userType')
                    if (res.statusCode) {
                        if (res.statusCode == 200) {
                            if(type != "Barrel Fuel"){
                            let payload = {}
                            payload.type = "delete"
                            payload.notificationMessage = "Oh no! "+loginName+" has requested to deactivate ("+saveData.json.organizationName+")."
                            payload.organizationName = orgName
                            payload.loginUserName = loginName
                            payload.sendNotificationTo = "BF Internal"
                            payload.access_levels = ["Level 1 (Admin)","Level 2 (Standard)","Level 3 (Basic)"]
                            payload.levelOfAccess = access == "Super" ? "Level 1 (Admin)" : access == "Admin" ? "Level 2 (Standard)" : "Level 3 (Basic)"
                            payload.isActionable = false
                            payload.actionTaken = ""
                            payload.category = "account"
                            payload.readInd = false
                            saveNotificationList(payload,dispatch).then((res)=>{
                  
                            })
                            let auditPayload = {"ModuleName":"Account",
                                    "TabName":"Company",
                                    "Activity":orgName+" Deactivated",
                                    "ActionBy":Storage.getItem('email'),
                                    "Role":JSON.parse(Storage.getItem('userRoles')),
                                    "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
                                saveAuditLogData(auditPayload, dispatch)
                            }
                            setIsSuccess(true);
                            sendmail();
                            getCompany('',dispatch)
                            document.getElementById('root').style.filter = 'none';
                            setShowDeactivate(false);
                            setdisable(true)
                        }
                        else {
                            setModalText(res.data.accountRegister);
                            setShow(true);
                            document.getElementById('root').style.filter = 'blur(5px)';
                        }
                    }
                    else {
                        setModalText("server error");
                        setShow(true);
                        document.getElementById('root').style.filter = 'blur(5px)';
                    }
                    //setShow(true);
                    

                })
            }else if(modalText==fieldList[0].sections.modal[0].requestdeactivate.text){
                document.getElementById('root').style.filter = 'none';
                let saveData = formSaveData()
                accountCompanyDeactivateService(saveData).then(res => {
                let payload = {}
                payload.type = "delete"
                payload.notificationMessage = "Oh no! "+loginName+" has requested to deactivate ("+saveData.json.organizationName+")."
                payload.organizationName = orgName
                payload.loginUserName = loginName
                payload.sendNotificationTo = "BF Internal"
                payload.access_levels = ["Level 1 (Admin)","Level 2 (Standard)","Level 3 (Basic)"]
                payload.levelOfAccess = access == "Super" ? "Level 1 (Admin)" : access == "Admin" ? "Level 2 (Standard)" : "Level 3 (Basic)"
                payload.isActionable = false
                payload.actionTaken = ""
                payload.category = "account"
                payload.readInd = false
                saveNotificationList(payload,dispatch).then((res)=>{
      
                })
                
                setShowDeactivate(false);
                setdisable(true)

                })

            }
            let auditPayload = {"ModuleName":"Account",
                                    "TabName":"Company",
                                    "Activity":orgName+" Deactivated",
                                    "ActionBy":Storage.getItem('email'),
                                    "Role":JSON.parse(Storage.getItem('userRoles')),
                                    "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
                saveAuditLogData(auditPayload, dispatch)
            
        }
        else {
            
            let isFormValid
            const fieldValidationErrors = {
                ...formErrors
            };

           
            //formFieldData.forEach((val,index)=>{
            Object.keys(formFieldData).forEach((fieldName) => {
                validateField(
                    fieldName,
                    formFieldData[fieldName],
                    { [fieldName]: formFieldData[fieldName] },
                    true,
                    formErrors, formData
                );
            })
            //})
            isFormValid = validateForm();

            if (isFormValid) {
                let saveData = formSaveData();
               
                setdisable(true)
                accountCompanyEditService(saveData).then(res => {
                    if (res.statusCode) {
                        if (res.statusCode == 200) {
                            setenableSave(true)
                            // if(editname){
                            //     let payload = {}
                            //     payload.type = "update"
                            //     payload.notificationMessage = "Hold on! "+loginName+" needs your approval to modify "+saveData.json.organizationName+"."
                            //     payload.organizationName = saveData.json.organizationName
                            //     payload.loginUserName = loginName
                            //     payload.sendNotificationTo = "ORG Internal"
                            //     payload.access_levels = ["Level 1 (Admin)"]
                            //     payload.levelOfAccess = access == "Super" ? "Level 1 (Admin)" : access == "Admin" ? "Level 2 (Standard)" : "Level 3 (Basic)"
                            //     payload.isActionable = true
                            //     payload.actionTaken = ""
                            //     payload.category = "account"
                            //     payload.readInd = false
                            //     saveNotificationList(payload).then((res)=>{
                            //         seteditname(null)
                            //     })
                            // }else{
                                let payload = {}
                                payload.type = "update"
                                payload.notificationMessage = "Company details have been edited by "+loginName+"."
                                payload.organizationName = orgName
                                payload.loginUserName = loginName
                                payload.sendNotificationTo = "ORG Internal"
                                payload.access_levels = ["Level 1 (Admin)","Level 2 (Standard)"]
                                payload.levelOfAccess = access == "Super" ? "Level 1 (Admin)" : access == "Admin" ? "Level 2 (Standard)" : "Level 3 (Basic)"
                                payload.isActionable = false
                                payload.actionTaken = ""
                                payload.category = "account"
                                payload.readInd = false
                                saveNotificationList(payload,dispatch).then((res)=>{

                                })
                                let auditPayload = {"ModuleName":"Account",
                                    "TabName":"Company",
                                    "Activity":orgName+" Updated",
                                    "ActionBy":Storage.getItem('email'),
                                    "Role":JSON.parse(Storage.getItem('userRoles')),
                                    "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
                                saveAuditLogData(auditPayload, dispatch)
                            //}
                            setIsSuccess(true);
                            document.getElementById('root').style.filter = 'blur(5px)';
                            setModalText(fieldList.length && fieldList[0].sections.modal[0].successModal.paragraph)
                            //sendEmails();
                            setdisable(true)
                        }
                        else {
                            setModalText(res.data.accountRegister);
                        }
                    }
                    else {
                        setModalText("server error");
                    }
                    setShow(true);
                    document.getElementById('root').style.filter = 'blur(5px)';

                })
            }
            else {
                document.getElementById('root').style.filter = 'blur(5px)';
                setModalText(fieldList.length && fieldList[0].sections.modal[0].mandatoryModal.paragraph)
                setShow(true);
            }
        }


    }
   
    const [show, setShow] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [modalText, setModalText] = useState();
    const handleClose = () => {
        setShow(false);
        document.getElementById('root').style.filter = 'none';
        if (isSuccess) {
            setIsSuccess(false);
            //navigate('/admin');
        }
    }

    const renderModal = (modal) => {
        let modalData = modalText;
        return (
            <CustomModal
                show={show}
                onHide={handleClose}
                modelBodyContent={modalData}
                buttonText={fieldList.length && fieldList[0].sections.modal[0].mandatoryModal.primaryButton.text}
            />
        );
    };
    const renderDeactivateModal = (modal) => {
        let modalData = modalText;
        return (
            <CustomModal
                show={showDeactivate}
                close ={(e) => closeModal(e)}
                hide={(e) => closeModal(e)}
                onHide = {(e) => handleClick(e, {name:"deactive"})}
                modelBodyContent={modalData}
                buttonText={modalText== fieldList[0].sections.modal[0].deactivate.text?fieldList[0].sections.modal[0].deactivate.button1:fieldList[0].sections.modal[0].requestdeactivate.button1}
                secondbutton={modalText== fieldList[0].sections.modal[0].deactivate.text?fieldList[0].sections.modal[0].deactivate.button2:''}
            />
        );
    };
        
    const onHandleSelect = (field, index) => {
        //alert("sdfas")
        //setindexvalue(index)

       /* let formData = { ...formDataSet };

        document.getElementsByName("address2").value = fullresults[index].Address2
        document.getElementsByName("address1").value = fullresults[index].Address1
        document.getElementsByName("zip").value = fullresults[index].PostalCode
        document.getElementsByName("city").value = fullresults[index].Locality
        document.getElementsByName("state").value = fullresults[index].AdministrativeArea
        document.getElementsByName("country").value = fullresults[index].CountryName


        document.getElementsByName("address1")[0].callback = false
        //  setformDataSet(formData);
        document.getElementsByClassName('dropdown-menu show')[0].style.display = 'none';

        formData["address2"] = fullresults[index].Address2
        formData["address1"] = fullresults[index].Address1
        formData["zip"] = fullresults[index].PostalCode
        formData["city"] = fullresults[index].Locality
        formData["state"] = fullresults[index].AdministrativeArea
        formData["country"] = fullresults[index].CountryName
        formData["name"] = formDataSet.name;


        Object.keys(formData).map((fieldName) => {
            validateField(
                fieldName,
                formData[fieldName],
                { [fieldName]: formData[fieldName] },
                true,
                formErrors, formData
            );
        })

        //formData["callback"] = false
        setFormData(formData)
        setformDataSet(formData)
        setFormFieldData(formData)
        isaddressvalid = true*/


    }
    const searchHandler = (items) => { 
        let formData = { ...formDataSet };
        let errorData = { ...formErrors };
       try {
        let address = items[0];
        let addressArr = address.split(',')
        let stateAndzip = addressArr[2].split(' ')
        let cityName = addressArr[1].trim();
        let fullAddress = fullresults.filter((item) => item.Address == address)[0];
        let country = fullAddress.CountryName == '' ? 'United States' : fullAddress.CountryName.replace(' Of America', '')
        setAddress1Selected([fullAddress.Address1])
        document.getElementsByName("zip").value = stateAndzip[2]//fullresults[0].PostalCode
        document.getElementsByName("city").value = cityName; //fullresults[0].Locality
        document.getElementsByName("state").value = stateMapper[stateAndzip[1]]//fullresults[0].AdministrativeArea
        document.getElementsByName("country").value = country

        //formData["addressLine2"] = fullresults[0].Address2
        formData["address1"] = addressArr[0].trim()//fullresults[0].Address1
        formData["zip"] = stateAndzip[2]//fullresults[0].PostalCode
        formData["city"] = cityName // fullresults[0].Locality
        formData["state"] = stateAndzip[1] //fullresults[0].AdministrativeArea
        formData["country"] = country
        let fields = ['address1', 'zip', 'city', 'state', 'country'];
        fields.forEach(item => {
            errorData[item].isTouched = true;
            errorData[item].isValid = true;
            validateField(item, formData[item], null, true,
                formErrors,formData)
        })

        setFormErrors(errorData);
        setFormFieldErrors(errorData);
        setFormData(formData);
        setformDataSet(formData)
        setFormFieldData(formData)
        document.getElementsByName('address1')[0].blur();
       } catch(err) {
        console.error('Caught error in melissa')
       }
    }
    const searchAPI = (e) => {
        setAddress1Loading(true)
        setenableSave(false)
        fetch(melissaEndpointURI + e + melissaTopRecords)
            .then((resp) => resp.json())
            .then(({ d }) => {
                for (let i = 0; i < d.Results.length; i++) {
                    addressdata.push(d.Results[i].Address.Address)
                    fulladdressdata.push(d.Results[i].Address)                    
                }
                setResults(addressdata);
                setFullResults(fulladdressdata);
                //setAddress1Selected(d.Results[i].Address);        
                setAddress1Loading(false);
            })
            .catch((error) => {
                setAddress1Loading(false);
            });
    }
    const onAddressSearchBlur = (evt) => { 
        let formData = { ...formDataSet };
        let errorData = { ...formErrors };
        if(evt.target.value != '') {
            if(!Array.isArray(address1Selected)) {
                if(address1Selected == '' && (resetvalue != '' && evt.target.value == resetvalue[0])) {
                        setAddress1Selected(resetvalue)
                } else {
                    setAddress1Selected([evt.target.value]);
                    formData["address1"] = evt.target.value;
                }
            }
            errorData['address1'].isTouched = true;
            errorData['address1'].isValid = true;
            
        } else {
            setAddress1Selected('');
            console.log("helloooo",evt.target.value)
            errorData['address1'].isTouched = true;
            errorData['address1'].isValid = false;
            formData["address1"] = evt.target.value;
            console.log("input by name",document.getElementsByName('address1')[0].value)
            document.getElementsByName('address1')[0].value = evt.target.value
        }
        setFormErrors(errorData); 
        setformDataSet(formData);
        setFormFieldData(formData)
        if(formErrors['address1'] && formErrors['address1'].activeValidator.errorMessage != null) {
            validateField('address1', evt.target.value, 
                { ['address1']: evt.target.value },true,errorData)
        }
}
    const filterBy = () => true;
    const adminClick = (e,item) =>{
        if(item.label == "Back"){
            navigate('/dashboard/admin/deactivate')
        }else if(item.label == "Deactivate"){
            document.getElementById('root').style.filter = 'blur(5px)';
            setDeactiveShow(true)
            let request = {
                "Loggedinuser": loginName,
                "Organization":selectedCompany,
                "DeactivateReason": "",
                "TransType":"Deactivate"
              }
              setUpdateReq(request)
              setDeactiveText(fieldList.length && fieldList[0].sections.modal[0].deactivate.text)
        }else if(item.label == "Activate"){
            document.getElementById('root').style.filter = 'blur(5px)';
            setDeactiveShow(true)
            let request = {
                "Loggedinuser": loginName,
                "Organization":selectedCompany,
                "DeactivateReason": "",
                "TransType":"Activate"
              }
              setUpdateReq(request)
              setDeactiveText(fieldList.length && fieldList[0].sections.modal[0].deactivate.text2)
        }
    }
    const SuccessModal = () =>{
        setDeactiveShow(false)
        document.getElementById('root').style.filter = 'none';
        updateCompanies(dispatch,updateReq).then(res=>{

        })
        navigate('/dashboard/admin/deactivate')
      }
      const closeDeactive = () =>{
        setDeactiveShow(false)
        document.getElementById('root').style.filter = 'none';
      }
    const getOperatorFields2 = (item, index, flag) => {
       
        switch (item.component.toUpperCase()) {
        
            case "INPUT":
            
                return (<Input
                    colWidth={item.styles ? item.styles.colWidth : ""}
                    Type={item.type}
                    Label={item.label}
                    data-label={item.label}
                    Name={item.name}
                    id={item.id}
                    disabled={item.name === 'name' &&Storage.getItem('userType') !="Barrel Fuel"? true : item.disabled && disable ? true : false}
                    Placeholder={item.placeholder}
                    isRequred={item.isRequired}
                    maxLength={item.maxLength}
                    minLength={item.minLength}
                    handleChange={(e) => handleChange(e, item, index, flag)}
                    handleBlur={(e) => handleBlur(e, item, index, flag)}
                    styles = {item.styles}
                    tooltip={item.tooltip}
                    fieldError={
                        formErrors &&
                        formErrors[item.name] && !formErrors[item.name].isValid
                        && (
                            formErrors[item.name].isTouched
                        )
                    }
                    errorMessage={
                        formErrors
                        && formErrors[item.name]
                            .activeValidator
                            .errorMessage
                    }
                    formDataSet={formFieldData ? formFieldData[item.name] : ''}
                />)
                case "SELECT":
                   
                    return (<Select
                        colWidth={3}
                        Type={item.type}
                        Label={item.label}
                        Placeholder={item.placeholder}
                        disabled={item.disabled&& disable?true:false}
                        dynamicSelect={item.dynamicSelect}
                        lookupReference={item.dynamicSelect ? item.lookupReference : null}
                        isRequred={item.isRequired}
                        Options={item.options}
                        Name={item.name}
                        handleChange={(e) => handleChange(e, item, index, flag)}
                        handleBlur={(e) => handleBlur(e, item, index, flag)}
                        dependentField={item.dependentField}
                        dependentFieldVal={item.dependentFieldVal}
                        fieldError={
                            formErrors &&
                            formErrors[item.name] && !formErrors[item.name].isValid/* 
                        && (
                            formErrors[item.name].isTouched
                        ) */
                        }
                        errorMessage={
                            formErrors &&
                            formErrors[item.name] && formErrors[item.name]
                                .activeValidator
                                .errorMessage
                        }
                        formDataSet={formFieldData && formFieldData[item.name] ? formFieldData[item.name] : item.defaultValue ? item.defaultValue : ''}
                    />)

            case "BUTTON":
                if(deactivateScreen){
                    if(item.isAdmin){
                        if(item.name == "admindeactive"){
                            inactiveStatus ? item.label = item.labels[1] : item.label = item.labels[0]
                        }
                        return(<ButtonComponent
                    Label={item.label}
                    Type={item.type}
                    Name={item.name}
                    className={item.styles.className}
                    disabled={false}
                    handleClick={(e) => adminClick(e, item)} />)
                    }else{
                        return('')
                    }
                }else{
                if(item.label === "Deactivate" && !item.isAdmin){
                    let userType = Storage.getItem("userType") ? Storage.getItem("userType") : '';
                return (userType === "Barrel Fuel"?<ButtonComponent
                    Label={item.label}
                    Type={item.type}
                    Name={item.name}
                    className={item.styles.className}
                    disabled={selectedCompany? false:true }
                    handleClick={(e) => clickDeactivate(e, item, index)} />:null)
                } else {
                    return (!item.isAdmin ? <ButtonComponent
                        Label={item.label}
                        Type={item.type}
                        Name={item.name}
                        className={item.styles.className}
                        disabled={item.disabled && enableSave ? true : false}
                        handleClick={item.name === 'addNew'?(e) => showNewCompanyPopup(e, item, index):(e) => handleClick(e, item, index)} /> : '')  
                }
            }
            case "PARAGRAPH":
                let array = []
                return (<>
                <Subheading label={item.label} 
                    isEditable={deactivateScreen ? false : !selectedCompany?false:item.isEditable ?item.isEditable:false} 
                    EnableEdit={makeEditable} 
                    isAccessAble = {getAccessLevel(Storage.getItem('userType'), 
                                    Storage.getItem('accessLevel'))}
                    /></>
                    
                    )
                    case "ASYNCTYPEAHEAD":
                        return (
                            <Form.Group as={Col} md={item.styles.colWidth} className={`${ formErrors &&
                                formErrors[item.name] && formErrors[item.name]
                                    .activeValidator
                                    .errorMessage != null ? 'bf-error-class' : ''
                            } mb-4`} controlId={item.name}
                            >
                                <Form.Label>{item.label} {item.isRequired ? <span className='bf-required'>*</span> : ''}</Form.Label>
                                <AsyncTypeahead
                                    filterBy={filterBy}
                                    isLoading={isAddress1Loading}
                                    minLength={3}
                                    id={item.id}
                                    label={item.label}
                                    name={item.name}
                                    disabled={item.disabled && disable ? true : false}
                                    inputProps={{
                                        name: item.name
                                    }}
                                    onSearch={searchAPI}
                                    onChange={(items) => searchHandler(items)}
                                    options={results}
                                    useCache={false}
                                    placeholder={item.placeholder}
                                    onBlur={onAddressSearchBlur}
                                    selected={address1Selected}
                                    onFocus={handleFocus}
                                    defaultInputValue={formFieldData && formFieldData[item.name] ? formFieldData[item.name] : ''}
                                    {...formErrors &&
                                        formErrors[item.name] && !formErrors[item.name].isValid &&
                                            <div className='d-flex justify-content-end '>
                                                <small class="bf-error-message form-text"><span>
                                                {formErrors[item.name]
                                                    .activeValidator
                                                    .errorMessage}
                                                    </span></small>
                                                </div>
                                        }
                                />
                            </Form.Group>
                        )
        };
    }
    const getOperatorFields3 = (item, index, flag) => {
       
        switch (item.component.toUpperCase()) {
        
            case "INPUT":
            
                return (<Input
                    colWidth={item.styles ? item.styles.colWidth : ""}
                    Type={item.type}
                    Label={item.label}
                    data-label={item.label}
                    Name={item.name}
                    id={item.id}
                    disabled={item.disabled && flag ? true : false}
                    Placeholder={item.placeholder}
                    isRequred={item.isRequired}
                    maxLength={item.maxLength}
                    minLength={item.minLength}
                    handleChange={(e) => handleChange(e, item, index, true)}
                    handleBlur={(e) => handleBlur(e, item, index, true)}
                    styles = {item.styles}
                    tooltip={item.tooltip}
                    fieldError={
                        formErrors &&
                        formErrors[item.name] && !formErrors[item.name].isValid
                        && (
                            formErrors[item.name].isTouched
                        )
                    }
                    errorMessage={
                        formErrors
                        && formErrors[item.name]
                            .activeValidator
                            .errorMessage
                    }
                    formDataSet={formFieldData ? formFieldData[item.name] : ''}
                />)

            case "PARAGRAPH":
                let array = []
                return (<>
                <Subheading label={item.label} 
                    isEditable={item.isEditable ?item.isEditable:false} 
                    EnableEdit={makeEditable} 
                    isAccessAble = {getAccessLevel(Storage.getItem('userType'), 
                                    Storage.getItem('accessLevel'))}
                    /></>
                    
                    )
                    
        };
    }
    const handleFocus = () => {
        setResetValue(address1Selected);
        setAddress1Selected('');
    }
    const getOperatorFields = (item, index, flag) => {
        let accessable = null;
        if(Storage.getItem('userType') ===  "Barrel Fuel"){
            accessable =true
          } else {
            accessable = getAccessLevel(Storage.getItem('userType'), 
                                    Storage.getItem('accessLevel'))
          }
        
        switch (item.component.toUpperCase()) {
           case "BUTTON":
                return (<ButtonComponent
                    Label={item.label}
                    Type={item.type}
                    Name={item.name}
                    className={item.styles.className}
                    disabled={accessable ? false : true}
                    handleClick={item.name === 'addNew'?(e) => showNewCompanyPopup(e, item, index):(e) => handleClick(e, item, index)} />)

            case "PARAGRAPH":
                return (<><Subheading label={item.label} isEditable={true} EnableEdit={makeEditable}
                    isAccessAble = {accessable}
                    
                    /></>)
        };
    }

    const makeEditable = () => {
        //alert("ll")
        setenableSave(false)
        setdisable(false)
    }
    const closeModal = (e) => {
        setModalShow(false)
        setShowDeactivate(false)
        document.getElementById('root').style.filter = 'none';
    }
    const accept = () => {
        if (modalText === operatorSignup.modal[0].termsmodal.paragraph) {
            //setbtnDisable(false)
        }
        setModalShow(false)
    }

    const showNewCompanyPopup = () =>{
        let selectedUserType = Storage.getItem('selectedUserType')
        let rowdata = {

            "firstName":"",
      
            "lastName":"",
      
            "emailId":"",
      
            "mobileNumber":""
      
          }
        //setModalShow(true)
        //props.enableNewCompanyForm()
        //console.log("props", props)

        if (selectedUser.user === 'operator') {
            //return (<OperatorSignupForm rowdata={rowdata} addNewCompany={true} />)
            navigate("/dashboard/operator-signup",{state:{rowdata:rowdata,addNewCompany:true}})
          } else {
            //return (<FboSignupForm addNewCompany={true} rowdata={rowdata}/>)
            navigate("/dashboard/fbo-signup", {state:{rowdata:rowdata,addNewCompany:true}})
          }
    }

    return (<>
        {isBusy ? (<Loader />) : (
            <div className='d-flex d-flex-row'>
                {   Storage.getItem('userType') ==="Barrel Fuel" ?
                        fieldList && fieldList.length > 0 && fieldList[0].sections && fieldList[0].sections.subSections.map((item) => (
                            <div className={`${item.addNewCompany ? item.addNewCompany.styles.colWidth : ''} bf-absolute`}>
                                {deactivateScreen ? '' : item.addNewCompany ? getOperatorFields(item.addNewCompany) : ''}
                            </div>)) : null
                    }
                <div className={`login-form bf-company-tab d-flex d-flex-column ${Storage.getItem('userType') !==  "Barrel Fuel" ? "bf-nobf" : ""}`}>
                    <div className='bf-company-input-container-section'>
                    { 
                        fieldList && fieldList.length > 0 && fieldList[0].sections && fieldList[0].sections.subSections.map((item) => (<Row className='bf-mrgb-0'>

                            {item.companyFieldsArray && item.companyFieldsArray.map((item, index) => (<Row className='bf-mrgb-0'>
                                {
                                    item.fields.map((val) => {
                                        //if(val.type != "button")
                                        let array = ['serviceFee', 'membershipDetails', 'membershiptype','membershipfee']
                                        let array2 = ['serviceFee', 'membershipfee']
                                        if(array.includes(val.name)){
                                            let accessable = null;
                                            let flag = true;
                                            if(Storage.getItem('userType') ===  "Barrel Fuel"){
                                                if(selectedUser.user ==="operator") {
                                                    accessable =false
                                                } else {
                                                    accessable =true
                                                    flag = disable;
                                                    
                                                }
                                              }
                                              else if(Storage.getItem('userType') ===  "Operator"){
                                                accessable = false;

                                              } else {
                                                if(array2.includes(val.name)){
                                                    accessable = false
                                                    
                                                } else{
                                                    flag = true;
                                                    accessable = getSuperAccess(Storage.getItem('userType'), 
                                                    Storage.getItem('accessLevel'))
                                                }
                                              }
                                              if(accessable){
                                                return getOperatorFields3(val, index, flag)
                                              }
                                        } else {
                                            return getOperatorFields2(val, index, true)
                                        }
                                        
                                        
                                    })
                                }
                                

                            </Row>))}
                        </Row>
                        ))
                    }
                    {fieldList && fieldList.length > 0 && fieldList[0].sections.subSections.map((item) => (

                        <ButtonGroup>
                            {item.buttons && item.buttons.map((item) => (<>
                                {getOperatorFields2(item)}</>
                            ))}
                        </ButtonGroup>

                    ))}
                    </div>
                    {Storage.getItem('userType') !=="Barrel Fuel" && getSuperAccess(Storage.getItem('userType'),Storage.getItem('accessLevel'))?
                    <Row className={`bf-deactivate-company bf-buttons-section bf-operator-merber-details`}>
                        <a href="javascript:void(0);"  onClick={(e)=>clickDeactivate(e,{name:"requestdeactive"})}>
                            <span className='bf-desktop-show'>{fieldList && fieldList.length > 0 && fieldList[0].sections.deactivationLink}</span>
                            <span className='bf-mobile-show'>Deactivate</span>
                        </a>
                    </Row>
                    :null}
                    {show ? renderModal() : null}
                    {showDeactivate?renderDeactivateModal():null}




                </div>

            </div>)}
        { <CustomFormModal
        show={modalShow}
        onHide={() => accept()}
        hide={() => closeModal()}
        title={"company details"}
        size={"lg"}
        modelBodyContent={<CompanyDetailsForm />}
        buttonText={"Save"}
        secondbutton={()=>closeModal()}
                            />}
                  {deactiveShow && <CustomModal
        show={deactiveShow}
        onHide={() => SuccessModal()}
        close={() => closeModal()}
        hide={() => closeDeactive()}
        size={''}
        isPrompt={true}
        modelBodyContent={deactiveText}
        buttonText={"Yes"}
        secondbutton={"Cancel"}
    />}
    </>
    );
}

export default CompanyDetails;