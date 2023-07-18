import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';

import logo from '../../assets/images/barrel_fuel_logo.png'
import Row from 'react-bootstrap/Row';
import Input from '../input/input';
import Select from '../select/select';
import Checkbox from '../checkbox/checkbox';
import ButtonComponent from '../button/button';
import { ButtonGroup, Modal } from 'react-bootstrap';
import './admin.scss';
import { useEffect } from 'react';
import { registerAdminSign } from './adminSignUpService';
import { fetchBlobDataService, SendMailToUsers } from '../../services/commonServices';
import CustomModal from '../customModal/customModal';
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from '../loader/loader';
import { phoneValidation } from '../../controls/validations';
import AviationFacts from '../aviationFacts/aviationFacts';
import { Storage } from '../../controls/Storage';
import { saveNotificationList } from '../../actions/notificationService/notificationAction';
import { encryptData } from '../../services/commonServices';
import { useDispatch } from 'react-redux';
import {saveAuditLogData } from '../../actions/auditLog/auditLogActions';

import { useSelector } from 'react-redux';
const AdminSignupForm = (props)=> {
    const {state} = useLocation()
    const [formData , setFormData] = useState([]);
    const [formErrors , setFormErrors] = useState([]);
    const [operatorSignupList, setOperatorSignupList] = useState([]);
    const [isBtnBusy,setbtnBusy]=useState(false);
    const [isBtnValidate,setbtnValidate]=useState(false);
    const loggedInUser = Storage.getItem('email')
    const orgName = Storage.getItem('organizationName')
    const dispatch = useDispatch()
    const jwtToken = Storage.getItem('jwtToken')
    const AccountReducer = useSelector((state) => state.accountHomeReducer);
    const selectedUser = AccountReducer && AccountReducer.selectedUser && AccountReducer.selectedUser.user && AccountReducer.selectedUser.user;
    let navigate = useNavigate();
    const operatorSignupListmock = [
      {
        "pageName": "Admin Sign Up Form",
        "sections": [
          {
            "name": "adminSignup",
            "header": "User Details",
            "fields": [
              {
                "component": "input",
                "type": "text",
                "label": "First name",
                "placeholder": "First Name",
                "isRequired": true,
                "styles": {
                  "colWidth": "4",
                  "className": ""
                },
                "maxLength": "35",
                "name": "firstName",
                "validations": [
                  {
                    "validation": "IsMandatory",
                    "errorMessage": ""
                  }
                ]
              },
              {
                "component": "input",
                "type": "text",
                "label": "Middle Name",
                "placeholder": "Middle Name",
                "styles": {
                  "colWidth": "4",
                  "className": ""
                },
                "maxLength": "25",
                "name": "middleName"
              },
              {
                "component": "input",
                "type": "text",
                "label": "Last Name",
                "placeholder": "Last Name",
                "isRequired": true,
                "styles": {
                  "colWidth": "4",
                  "className": ""
                },
                "maxLength": "35",
                "name": "lastName",
                "validations": [
                  {
                    "validation": "IsMandatory",
                    "errorMessage": ""
                  }
                ]
              },
              {
                "component": "input",
                "type": "email",
                "label": "Email",
                "placeholder": "Email",
                "isRequired": true,
                "styles": {
                  "colWidth": "4",
                  "className": ""
                },
                "maxLength": "50",
                "name": "emailId",
                "validations": [
                  {
                    "validation": "IsMandatory",
                    "errorMessage": ""
                  },
                  {
                    "validation": "CheckRegex",
                    "validateRule": "^([A-Za-z0-9_\\-\\.])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,4})$",
                    "errorMessage": "Enter a valid Email"
                  },
                  {
                    "validation": "CheckBFDomain",
                    "errorMessage": "Email should contain @barrelfuel"
                  }
                ]
              },
              {
                "component": "input",
                "type": "text",
                "label": "Contact Number",
                "placeholder": "Contact Number",
                "maxLength": "10",
                "minLength": "10",
                "name": "mobileNumber",
                "isRequired": true,
                "styles": {
                  "colWidth": "4",
                  "className": ""
                },
                "validations": [
                  {
                    "validation": "IsMandatory",
                    "errorMessage": ""
                  },
                  {
                    "validation": "CheckRegex",
                    "validateRule": "^\\d{10}$",
                    "errorMessage": "Enter a valid Mobile Number"
                  }
                ]
              },
              {
                "component": "select",
                "dynamicSelect": true,
                "lookupReference": {
                  "name": "accessLevels"
                },
                "tooltip": {
                  "text": "Administrator - Administrator rights to Add/view/Edit FBO/Operator/ Internal Company details, Fuel Pricing, Taxes and Fees, and Users.Basic - All Admin rights except adding New Internal Users."
                },
    
                "type": "select",
                "name": "accessLevel",
                "label": "Level of Access",
                "placeholder": "Level of Access",
                "styles": {
                  "colWidth": "4",
                  "className": ""
                }
              }
            ],
            "buttons": [
              {
                "component": "button",
                "type": "button",
                "label": "Create User",
                "name": "createUser"
              },
              {
                "component": "button",
                "type": "button",
                "label": "Clear",
                "name": "clear"
              }
            ],
            "modal": [
              {
                "successModal": {
                            "title": "",
                            "paragraph": "Success! User created. Activation link will be emailed",
                            "primaryButton": {
                                "id": "17678",
                                "href": "#",
                                "name": "okButton",
                                "text": "OK",
                                "target": "_self"
                            }
                        },
                "failModal": {
                            "title": "",
                            "paragraph": "Oops! This E-mail Already Exists",
                            "primaryButton": {
                                "id": "17678",
                                "href": "#",
                                "name": "okButton",
                                "text": "OK",
                                "target": "_self"
                            }
                        },
                "mandatoryModal": {
                            "title": "",
                            "paragraph": "Please verify. A required field is missing information",
                            "primaryButton": {
                                "id": "17678",
                                "href": "#",
                                "name": "okButton",
                                "text": "OK",
                                "target": "_self"
                            }
                        }
              }
            ],
            "emailBody": {
                "title": "Admin Signup Verification Email",
                "paragraph": "Hello",
                "html":"You're Almost Done… A verification email was sent to : . Open this email and click the link to complete the process."
            }
          }
        ]
      }
    ]
    useEffect(() => {
        fetchAdminSignupForm();
        //setInitialState();
    },[]);
    const [isBusy, setBusy] = useState(true);
    const fetchAdminSignupForm = () => {
      fetchBlobDataService("adminSignup.json").then((res) => {

            setOperatorSignupList(res);
            setInitialState(res);
            setBusy(false);
        });
    }
    const getFormErrorRules = (item) => {
        return {
          isValid: item.isRequired ? item.defaultValue ? true : false : true,
          isTouched: false,
          activeValidator: {},
          validations: item.validations,
          isRequired: item.isRequired,
          minLength: item.minLength,
          maxLength: item.maxLength
        };
      }
     const setInitialState= (adminSignupData)=> {
        let formErrors = [];
        let fielddata = {};
        let fielderrors = {};
        let fields = [];
        const  formDataSet = [];
        const fieldTypeArr = ['input', 'radio', 'select'];
        fields = adminSignupData.length && adminSignupData[0].sections[0].fieldsArray;
        fields.length && fields.forEach( (item,index) => {
          item.fields.forEach((item)=>{
            if (fieldTypeArr.includes(item.component.toLowerCase())) {
              fielddata[item.name] =formData && formData.length>index?formData[index][item.name]: item.defaultValue ? item.defaultValue : '';
              fielderrors[item.name] = getFormErrorRules(item);
              fielderrors = { ...setPrevActiveValidator(fielderrors, item,index) };
            }
          })
          formDataSet.push(JSON.parse(JSON.stringify(fielddata)))
          formErrors.push(JSON.parse(JSON.stringify(fielderrors)))
        })
        
        setFormData(formDataSet);
        setFormErrors(formErrors);
    }

    const setPrevActiveValidator = (curFormErrors, item,index) => {
      //const { formErrors } = this.state;
      if (formErrors[index]) {
        curFormErrors[item.name].isValid = formErrors[index][item.name].isValid;
        curFormErrors[item.name].isTouched = formErrors[index][item.name].isTouched;
        if (formErrors[index][item.name].activeValidator !== {} && formErrors[index][item.name].activeValidator.validation) {
          const activeValidator = curFormErrors[item.name].validations.filter((elem) => elem.validation === formErrors[index][item.name].activeValidator.validation);
          if (activeValidator.length) {
            curFormErrors[item.name].activeValidator = activeValidator[0];
          }
        }
      }
      return curFormErrors;
    }
  
    const addMore = ()=>{
      let usedField=operatorSignupList[0].sections[0].fieldsArray
      const  addNewFiled ={}
      const temp = JSON.parse(JSON.stringify(operatorSignupList[0].sections[0].fieldsArray[usedField.length-1].fields));       
      
      addNewFiled['fields'] = temp
      let list=operatorSignupList
      list[0].sections[0].fieldsArray.push(addNewFiled);

      setOperatorSignupList(list)
      setInitialState(list)
  }

  const removeButton = (e, item,index) => {
    let fieldArr = operatorSignupList;
    fieldArr[0].sections[0].fieldsArray.splice(index,1);
    setOperatorSignupList(fieldArr);
    let updatedFormFieldData = formData;
    updatedFormFieldData.splice(index,1)
    setFormData(updatedFormFieldData);
    let updatedFormFieldErrors = formErrors;
    updatedFormFieldErrors.splice(index,1)
    setFormErrors(updatedFormFieldErrors);
    setInitialState(fieldArr);
  }

const handleChange= (e, item,index) => {
    let formDataSet = {};
    let fields = [];
    /*let formValid = this.state.formValid;
    const fieldValidationErrors = {...this.state.formErrors};*/
    let target = e.target; 
    let fieldName, fieldValue;
    fieldName = target.name;
    if(fieldName == "firstName" || fieldName == "middleName" || fieldName == "lastName"){
      target.value=target.value.replace(/[^a-z]/gi,'')
      /* let flag = new RegExp("/^[A-Za-z]+$").test(target.value);
        e.target.value = flag ? e.target.value : e.target.defaultValue */
    }
    if(item.validations){
      for(var i=0;i<item.validations.length; i++){
          if(item.validations[i].validation === 'CheckUSPhone'){
              e.target.value=phoneValidation(e.target.value);
          }
      }
  }
  fields = JSON.parse(JSON.stringify(formData));
  fieldValue = target.value;
  fields[index][fieldName] = fieldValue;
    // if(fieldName == "emailId"||isBtnValidate)
    //   validateField(
    //     fieldName, fieldValue,index, fields, true
    //   );
  setFormData(fields);
}
const handleBlur= (e, item,index) => {
    let formDataSet = formData
    let fields = [];
    /* let formValid = this.state.formValid;
    const fieldValidationErrors = {...this.state.formErrors}; */
    let target = e.target; 
    let fieldName, fieldValue;
    fieldName = target.name;
    e.target.value = e.target.value.trim();
    fieldValue = target.value;
    fields[index][fieldName] = fieldValue;
    if(fieldName == "emailId")
      validateField(
        fieldName, fieldValue,index, fields, true
      );
    formDataSet = {
      ...formData,
      ...fields
    };
    setFormData(formDataSet);
      
}
const validateField = (fieldName, value,index, fields, isTouched,isDuplicate) => {
    const fieldValidationErrors = [
        ...formErrors
    ];
    let fieldValidationError = null;
    fieldValidationError = fieldValidationErrors[index][fieldName];
    
    if (isTouched !== undefined) {
        fieldValidationError.isTouched = isTouched;
    }

    let validationObj = {};
    validationObj = checkValidationByValidationTypes(value, fieldValidationError,fieldName,isDuplicate);    
    fieldValidationErrors[index][fieldName] = {
        ...validationObj.fieldValidationError
    };
    customValidation(
        fieldName, value, validationObj,index
    );
}
/* const getFieldIsValid = (value, fieldValidationError, fieldName) => {
    let validationObj = {
      fieldValidationError: fieldValidationError,
      errcount: 0
    };
    if (fieldValidationError.isRequired === true) {
      validationObj =
        checkValidationByValidationTypes(value, fieldValidationError, fieldName);
    } else {
      if (value) {
        validationObj =
          checkValidationByValidationTypes(value, fieldValidationError, fieldName);
      }
    }
    return validationObj;
  } */

  const checkValidationByValidationTypes = (value, fieldValidationError, fieldName,isDuplicate) => {

    let fieldValidations = fieldValidationError.validations;
    let errcount = 0;
    if(fieldValidations && fieldValidations.length){
      for(let i=0;i<fieldValidations.length;i++){
    
        let validationType = fieldValidationError.validations[i].validation;
        if(validationType === 'IsMandatory') {
          if (!value) {
              errcount++;
              fieldValidationError.activeValidator = fieldValidationError.validations[i];
          }
        }
        else if(validationType === 'CheckRegex'){
          let check = false;
          if (!new RegExp(fieldValidationError.validations[i].validateRule).test(value)) {
              check = true;
          }
          if(fieldName == "emailId"){
              let splitVal = value.split('@');
              let replacedVal = splitVal[0].replaceAll('_','').replaceAll('.','')
              if(replacedVal){}
              else {
                check = true
              }
          }
          if(check){
            errcount++;
            fieldValidationError.activeValidator = fieldValidationError.validations[i];
          }
        }
        else if(validationType === 'CheckBFDomain'){
          if(new RegExp(fieldValidationError.validations[i].validateRule).test(value)){
            let eSplit = value.split('@');
            if(eSplit.length && eSplit[1]){
              let convertToLower = eSplit[1].toLowerCase();
              if(convertToLower == "barrelfuel.com"){
                
              }
              else {
                errcount++;
                fieldValidationError.activeValidator = fieldValidationError.validations[i];
              }
            }
          }
        }else if (validationType === 'CheckUSPhone') {
          if (value && ((value.match(/\d/g) || []).length !== 10)){
              errcount++;
              fieldValidationError
                  .activeValidator = fieldValidationError.validations[i];
          }
        }else if (validationType === 'IsDuplicated') {
          if( isDuplicate === true ) {
            errcount++;
            fieldValidationError.activeValidator = fieldValidationError.validations[i];
          }
      }
        if(errcount > 0){
          return {
              fieldValidationError: fieldValidationError,
              errcount: errcount
            };
        }
      }
    }
    return {
      fieldValidationError: fieldValidationError,
      errcount: errcount
    };
}
const customValidation = (
    fieldName, value, validationObj,index
  ) => {
    const fieldValidationErrors = [
      ...formErrors
    ];
    let errcount = validationObj.errcount;
      if (!errcount) {
        fieldValidationErrors[index][fieldName].isValid = true;
        fieldValidationErrors[index][fieldName].activeValidator = {};
      } else {
        fieldValidationErrors[index][fieldName].isValid = false;
      }
      setFormErrors(fieldValidationErrors);
  }
  const validateForm = () => {
    let formValid = true;
    formErrors.map((val,index)=>{
      Object.keys(val).forEach((fieldname)=>{
            if (!formErrors[index][fieldname].isValid) {
                formValid = formErrors[index][fieldname].isValid;
                return formValid;
              }
          })    
      })
    return formValid;
}
const checkDuplicate = () =>{
  let dupInd = [];
  formData.forEach((ob,index) => {
    let email = ob.emailId;
    let flagIndex = [];
    for(let i = index+1;i<formData.length;i++){
      if(formData[i]["emailId"] == email){
          flagIndex.push(i);
          flagIndex.push(index);
      }
    }
    dupInd = new Set([...dupInd, ...flagIndex])
  })
  let convertArr = [...dupInd];
  if(convertArr.length) {
    convertArr.forEach(dup => {
      Object.keys(formData[dup]).forEach((fieldName)=> {
        if(fieldName == 'emailId'){
          validateField(
            fieldName,
            formData[dup][fieldName],
            dup,
            { [fieldName]: formData[dup][fieldName] },
            true,
            true
          );
        }
      })
    })
    return false;
  }
  else return true;
}
const handleClick = (e, item,index) => {
    if(item.name === "clear"){
      navigate('/dashboard/account/user');
    }else if(item.name=='addNew'){
      addMore()
    }else if(item.name === "remove"){
      removeButton(e, item,index);
    }
    else{
      setbtnValidate(true);
      let isFormValid
      const fieldValidationErrors = {
        ...formErrors
      };
		//fieldName, value, fields, subIndex, isTouched
		formData.forEach((val,index)=>{
      Object.keys(val).forEach((fieldName) => {
              validateField(
                  fieldName,
                  formData[index][fieldName],
                  index,
                  { [fieldName]: formData[index][fieldName] },
                  true
              );
          })
  })
        isFormValid = validateForm();
        
        
        if(isFormValid){
          let noDuplicate=checkDuplicate();
          if(noDuplicate){
            let saveJSON={}
          saveJSON['bfAdminRequestList']=JSON.parse(JSON.stringify(formData))
          saveJSON.bfAdminRequestList.forEach((val)=>{
            val.mobileNumber = val.mobileNumber.replace(/\D/g,'')
          })
          
          registerAdminSign(saveJSON).then(res =>{
            res= JSON.parse(res);
            if(res.accountRegister){
              if(res.accountRegister == "SUCCESS"){
                if(loggedInUser != ""){
                  let msg = ""
                  formData.forEach((item)=>{
                    msg = msg+item.emailId+" "
                  })
                  let payload = {}
                  payload.type = "create"
                  payload.notificationMessage = "Success! "+loggedInUser+" has added new users "+msg+"to the account."
                  payload.organizationName = orgName
                  payload.loginUserName = loggedInUser
                  payload.sendNotificationTo = "ORG Internal"
                  payload.isActionable = false
                  payload.actionTaken = ""
                  payload.category = "account"
                  payload.readInd = false
                  saveNotificationList(payload).then((res)=>{
      
                  })
                }
                setIsSuccess(true);
                setModalText(operatorSignupList.length && operatorSignupList[0].sections[0].modal[0].successModal.paragraph)
                //props.history.push('/admin')
                let sendEmailObj = operatorSignupList.length && operatorSignupList[0].sections[0].emailBody;
                var html = sendEmailObj.html;
                var loc = html.indexOf(":");
                formData.forEach((val)=>{
                  let nameString = val.firstName;
                  let name = nameString.charAt(0).toUpperCase() + nameString.slice(1);
                  var firstString = "Hi " + name + ',';
                  let emailId = encryptData(val.emailId);
                  var activeLink = process.env.REACT_APP_DOMAIN_URL+"/"+sendEmailObj.redirectURI + emailId;
                  let html1 = firstString + html.substring(0, loc) + activeLink + html.substring(loc+1, html.length)
                  let allEmailId = [];
                  allEmailId.push(val.emailId);
                  
                  let data = {
                    to: allEmailId,
                    from: sendEmailObj.fromEmailId,
                    subject: sendEmailObj.title,
                    text: sendEmailObj.paragraph,
                    html: html1
                  }
                  SendMailToUsers(data);
                  let auditPayload = {"ModuleName":"Account",
                                                "TabName":"Admin SignUp",
                                                "Activity":sendEmailObj.fromEmailId+" Created",
                                                "ActionBy":Storage.getItem('email'),
                                                "Role":JSON.parse(Storage.getItem('userRoles')),
                                                "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
                            saveAuditLogData(auditPayload, dispatch)
                })
                
              }
              else{
                setModalText(res.accountRegister);
              }
            }
            else if(res.errorcode){
                if(res.errorcode == 113){
                  let mail = res.message.split(":")[1]
                            let userData = formData
                            let index = 0
                            let error = formErrors
                            userData.forEach((user,i)=>{
                                if(user.emailId == mail){
                                    index = i
                                }
                            })
                            error[index].emailId.isValid = false
                            error[index].emailId.activeValidator.errorMessage = " "
                            console.log(formErrors)
                            setFormErrors(error)
                            setModalText(operatorSignupList.length && operatorSignupList[0].sections[0].modal[0].failModal.paragraph);
                  // if(formData.length==1){
                    
                  // }else{
                  //   formData.forEach((val)=>{
                  //     if(res.message.includes(val.emailId)){
                  //       setModalText('Oops! ' + val.emailId + ' already exists')
                  //     }
                  //   })
                  // }
                  
                }
            }
            else if(res.message){
              setModalText(res.message);
            }
            setShow(true);
            document.getElementById('root').style.filter = 'blur(5px)';
          })
          }else{
            setModalText(operatorSignupList.length && operatorSignupList[0].sections[0].modal[0].duplicateModal.paragraph)
            setShow(true);
            document.getElementById('root').style.filter = 'blur(5px)';
          }
        }
        else{
          setModalText(operatorSignupList.length && operatorSignupList[0].sections[0].modal[0].mandatoryModal.paragraph)
          setShow(true);
          document.getElementById('root').style.filter = 'blur(5px)';
          
        }
    }
    
}
const [show, setShow] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);
const [modalText, setModalText] = useState();
const handleClose = () => {
  setShow(false);
  document.getElementById('root').style.filter = 'none';
  if(isSuccess){
    setIsSuccess(false);
    navigate('/dashboard/account/user');
  }
}

const renderModal = (modal) => {
    let modalData = modalText;
     return (
      <CustomModal
        show={show}
        onHide={handleClose}
        modelBodyContent= {modalData}
        buttonText={operatorSignupList.length && operatorSignupList[0].sections[0].modal[0].mandatoryModal.primaryButton.text}
      />		
    );
};
    const getOperatorFields = (item,index,flag) => {
        switch(item.component.toUpperCase()) {
        case "INPUT":
            return (<Input 
                colWidth={item.styles ? item.styles.colWidth : ""} 
                Name={item.name}
                Type={item.type} 
                Label={item.label}
                Placeholder={item.placeholder}
                isRequred={item.isRequired}
                maxLength={item.maxLength}
                minLength={item.minLength}
                handleChange={(e) => handleChange(e, item,index,flag)}
                handleBlur={(e) => handleBlur(e, item,index,flag)}
                fieldError={
                    formErrors && formErrors.length &&
                    formErrors[index][item.name] && !formErrors[index][item.name].isValid/* 
                    && (
                        formErrors[item.name].isTouched
                    ) */
                }
                errorMessage={
                    formErrors  && formErrors.length &&
                    formErrors[index][item.name] && formErrors[index][item.name]
                        .activeValidator
                        .errorMessage
                }
                formDataSet={formData.length ? formData[index][item.name] : null}/>)
        case "SELECT":
            return (<Select 
                colWidth={item.styles ? item.styles.colWidth : ""} 
                Type={item.type} 
                Name={item.name}
                Label={item.label}
                dynamicSelect={item.dynamicSelect}
                lookupReference={item.dynamicSelect ? item.lookupReference : null}
                tooltip={item.tooltip}
                Options={item.options ? item.options : null}
                Placeholder={item.placeholder}
                isRequred={item.isRequired}
                isAdmin = {item.isAdmin}
                handleChange={(e) => handleChange(e, item,index,flag)}
                handleBlur={(e) => handleBlur(e, item,index,flag)}
                accessLevel ={item.accessLevel}
                fieldError={
                  formErrors && formErrors.length &&
                  formErrors[index][item.name] && !formErrors[index][item.name].isValid/* 
                  && (
                      formErrors[item.name].isTouched
                  ) */
              }
              errorMessage={
                  formErrors  && formErrors.length &&
                  formErrors[index][item.name] && formErrors[index][item.name]
                      .activeValidator
                      .errorMessage
              }
                formDataSet={formData && formData[index][item.name] ? formData[index][item.name] : item.defaultValue ? item.defaultValue : ''}/>)
        case "CHECKBOX":
            return (<Checkbox Label={item.label} colWidth={item.styles ? item.styles.colWidth : ''}/>)
        case "BUTTON":
            return (<ButtonComponent
                    Name={item.name}
                    Label={item.label} 
                    Type={item.type}
                    variant="primary"
                    className={item.styles && item.styles.className} 
                    handleClick = {(e) => handleClick(e, item,index)}/>)
        case "PARAGRAPH":
            return (<div>{item.label}</div> )
        };
    }
  return (<>
    {isBusy ? (<Loader />) : (
    <div className={`d-flex d-flex-row login-section bf-operator-enrollment-section signup-section ${show ? 'bf-show-model-blr' : ''} 
    ${selectedUser ? 'bf-dashboard-signup bf-dashboard-fbo-signup' : ''}`}>
        <div className={`${selectedUser ? '' : "w-70p"} login-form d-flex d-flex-column`}>
        {selectedUser ? null :<div className="d-flex d-flex-row align-item-center justify-content-between bf-menu-header">
                <Nav.Link href={'./admin'}><img src={logo} alt="Barrel Fuel Logo" className='login-logo'/></Nav.Link>
                <Nav.Link href={'./admin'}>Home</Nav.Link>
            </div>}
            <Form autoComplete='off'>
                <h1 className='d-flex bf-heading'>{operatorSignupList.length && operatorSignupList[0].pageName}</h1>
                <div className={`${selectedUser ? 'bf-dashboard-signup-body' : ''}`}>
                  <div>
                <div class  = "d-flex bf-heading bf-subheading"><span>{operatorSignupList.length && operatorSignupList[0].sections[0].header}</span></div>
                          <Row >
                            {operatorSignupList.length && operatorSignupList[0].sections[0].fieldsArray.map((item,index) => (
                             <Row className='bf-mrgb-0'>
                             { 
                               item.fields.map((val)=>{
                                 if(val.type != "button")
                                 return getOperatorFields(val,index,true)
                               })
                             }
                             <Row className='bf-buttons-section'>{ 
                               item.fields.map((val)=>{
                                 if(val.type == "button"){
                                   if((operatorSignupList[0].sections[0].fieldsArray && operatorSignupList[0].sections[0].fieldsArray.length==1 && index == 0 && val.name == "remove") ||
                                       (operatorSignupList[0].sections[0].fieldsArray && ((operatorSignupList[0].sections[0].fieldsArray.length-1) != index) && val.name == "addNew"))
                                   {}
                                   else return getOperatorFields(val,index,true)
                                 }
                               })
                             }</Row>
                             
                         </Row>
                            ))}
                          </Row>
                </div>
                </div>
                <div className={`${selectedUser ? 'bf-dashboard-signup-buttons bf-signup-admin-signup' : '' } d-grid gap-2 mb-5`}>
                    <ButtonGroup className='bf-buttons-contanier'>
                    {operatorSignupList.length && operatorSignupList[0].sections[0].buttons.map((field) => (
                                getOperatorFields(field)
                            ))}
                        {show ? renderModal():null}
                    </ButtonGroup>
                </div>
            </Form>
        </div>
        {selectedUser ? null :<div className='d-flex bg-image-container w-30p'>
          <div className='d-flex d-flex-column bf-login-right-sec'>
          {operatorSignupList[0] && operatorSignupList[0].sections[0] && operatorSignupList[0].sections[0].aviationFacts &&
                        <AviationFacts facts={operatorSignupList[0].sections[0].aviationFacts}/>
                    }  
          </div>
        </div>}
    </div>
    )}</>
  );
}

export default AdminSignupForm;