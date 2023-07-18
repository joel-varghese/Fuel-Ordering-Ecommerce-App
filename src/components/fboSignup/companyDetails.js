import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import ButtonComponent from '../button/button';
import SupportingDocuments from './supportingDocuments';
import logo from '../../assets/images/barrel_fuel_logo.png'
import './FboSignupForm.scss';
import Input from '../input/input';
import Select from '../select/select';
import { bfaJsonService } from '../../actions/BFAServices/BFAJsonService';
import Subheading from '../subHeading/subHeading';
import Checkbox from '../checkbox/checkbox';
import CustomModal from '../customModal/customModal';

import $ from 'jquery'; 

function CompanyDetailsForm() {


    const [operatorSignup, setoperatorSignupForm] = useState({});
    const [formDataSet, setformDataSet] = useState({});
    const [formErrors, setformErrors] = useState({});
    const [isBusy, setBusy] = useState(true);
    const [passwordError , setPasswordError] = useState({});
    const [flightInfo, setflightInfo] = useState({});
    const [modalShow, setModalShow] = useState(false);

    //const payload= {"blobname":process.env.REACT_APP_READ_FBO_SIGNUP_COMPANY_BLOBNAME}
    /* useEffect(() => {
        bfaJsonService(payload).then(response=>{
            console.log("response.data", response.data.operatorSignup)
            setoperatorSignupForm(response.data.operatorSignup)
            setBusy(false);
            setInitialState(response.data.operatorSignup);
        })
        },[]); */

        let paylod = { 'blobname': 'AccountCompanyDetails.json' }
       
    
    useEffect(() => {
      bfaJsonService(paylod).then(data => {
        
          setoperatorSignupForm(data.data.operatorSignup)
            setBusy(false);
            setInitialState(data.data.operatorSignup);
      });
      
  }, []);
        

        const setInitialState =(operatorSigup)=> {
  
            const fields = {};
            const formData = {};
            let formErrors = {};
            const  formDataSet = formData;
            let Error = {};
    
            const fieldTypeArr = ['input','select'];
    
            operatorSigup && operatorSigup.sections[0].subSections[0].fields.forEach((item) => {
                if (fieldTypeArr.includes(item.component.toLowerCase())) {
                    formData[item.name] = formDataSet && formDataSet[item.name] ? formDataSet[item.name] : item.defaultValue;
                    formErrors[item.name] = getFormErrorRules(item);
                }
            })
        for(let i=0;i<4;i++){
            Error[i]=false
        }
        setPasswordError(Error)
            setformErrors(formErrors);
            setformDataSet(formData);
        }
        const getFormErrorRules = (item) => {
            return {
                isValid: item.isRequired ? false : true,
                isTouched: false,
                activeValidator: {},
                validations: item.validations,
                isRequired: item.isRequired,
                minValue: item.minValue,
                maxValue: item.maxValue,
                minLength: item.minLength,
                maxLength: item.maxLength
            };
        }
         const onHandleChecked = (e,field) =>{
            let isChecked = e.target.checked;

            if(isChecked){
            $("#serialNumber").removeAttr('disabled');
            $("#manufactureName").removeAttr('disabled');
            $("#aircrafttype").removeAttr('disabled');
            }else{
                $("#serialNumber").attr('disabled','disabled');
                $("#manufactureName").attr('disabled','disabled');
                $("#aircrafttype").attr('disabled','disabled');
            }
            
         }
        const onHandleChange = (e,field) =>{
            let formData = {};
            const fields = {};
            let target = e.target;
            console.log('onHandleChange', field.label );
            onClickSubmit(e)
            /**
             * Prevent typing if allowed field length is reached.
             */
            let maxLength = 0;
            if (field && field.maxLength) {
                maxLength = parseInt(field.maxLength);
            }
            if (maxLength > 0 && target.value.length > maxLength) {
                target.value = target.value.substring(0, maxLength);
                return;
            }

            fields[field.name]=target.value;
            let value = {
                "tail": "1096E"
             }
            if(field.name == "tailNumber"){
                // useEffect(() => {
                //     flightInformationService(value).then(response=>{
                //         setBusy(false);
                //         console.log("flight.data", response.data)
           
                //     })
                //     },[]);
              
               fetchFunction(value)
            }


             async function fetchFunction(value) {
                 try{
                    //  flightInformationService(value).then(response => {
                    //     console.log(response.data.data)
                    //     document.getElementById('serialNumber').value =response.data.data.serialnumber;
                    //     document.getElementById('manufactureName').value =response.data.data.ManufactureName;         
                    //     document.getElementById('aircrafttype').value =response.data.data.Aircrafttype;
                        
                    //  })
                 }
                 catch(err) {
                   throw err;
                   console.log(err);
                 }
               }
            
            validateField(
                target.name, target.value, fields, true
            );
            formData={
                ...formDataSet,
                ...fields
            }
            
            setformDataSet(formData)
        } 
        const onHandleBlur = (e,field) =>{
            let formData = {};
            const fields = {};
            let target = e.target;
    console.log('field', target.value)
    if(field == 'tailNumber'){


     let value = {
        "tail": "1096E"
     }
     fetchFunction(value)
               async function fetchFunction() {
                 try{

                    
                    //  flightInformationService(value).then(response => {
                    //      if(response.statusCode===200){
                    //          console.log('response', response)
                        
                    //      }
                    //  })
                 }
                 catch(err) {
                   throw err;
                   console.error(err);
                 }
               }
    }
            
            fields[field.name]=target.value;
            
            validateField(
                target.name, target.value, fields, true
            );
            formData={
                ...formDataSet,
                ...fields
            }
            
            setformDataSet(formData)
        } 
        const validateField = (fieldName, value, fields, isTouched) => {
            const fieldValidationErrors = {
                ...formErrors
            };
            let fieldValidationError = null;
           
                fieldValidationError = fieldValidationErrors[fieldName];
            
            if (isTouched !== undefined) {
                fieldValidationError.isTouched = isTouched;
            }
            let validationObj = {};
            validationObj = getFieldIsValid(value, fieldValidationError,fieldName);    
            fieldValidationErrors[fieldName] = {
                ...validationObj.fieldValidationError
            };
    
            let errcount = validationObj.errcount;
          if (!errcount) {
            fieldValidationErrors[fieldName].isValid = true;
            fieldValidationErrors[fieldName].activeValidator = {};
          } else {
            fieldValidationErrors[fieldName].isValid = false;
          }
            setformErrors(fieldValidationErrors)
            customValidation(
                fieldName, value, validationObj
            );
        }

        const customValidation = (
            fieldName, value, validationObj
          ) => {
            const fieldValidationErrors = {
              ...formErrors
            };
            let errcount = validationObj.errcount;
              if (!errcount) {
                fieldValidationErrors[fieldName].isValid = true;
                fieldValidationErrors[fieldName].activeValidator = {};
              } else {
                fieldValidationErrors[fieldName].isValid = false;
              }
              setformErrors(fieldValidationErrors)
          }


        const getFieldIsValid = (value, fieldValidationError, fieldName) => {
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
        }
    
        const checkValidationByValidationTypes = (value, fieldValidationError, fieldName) => {
            const validationTypes = ['IsMandatory', 'IsEmail', 'password',
                'integer', 'characterMismatch','CheckRegex'];
            let errcount = 0;
            let activeValidator = null;
            validationTypes.forEach(validationType => {
                
                activeValidator = fieldValidationError.validations && fieldValidationError.validations.filter
                (validate => validate.type === validationType);
                if (activeValidator && activeValidator.length) {
                    if (validationType === 'IsMandatory') {
                        if (!value) {
                            errcount++;
                            fieldValidationError
                                .activeValidator = activeValidator[0];
                        }
                    }
                    if (!errcount) {
                        if (validationType === 'integer') {
                            if (!new RegExp(activeValidator[0].validateRule)
                                .test(value)) {
                                errcount++;
                                fieldValidationError
                                    .activeValidator = activeValidator[0];
                            } else if (fieldValidationError.minValue &&
                                +value <=
                                fieldValidationError.minValue) {
                                errcount++;
                                fieldValidationError
                                    .activeValidator = activeValidator[0];
                            }
                        }
                    }
                    if (!errcount) {
                        if (validationType === 'IsEmail') {
                            if (!new RegExp(activeValidator[0].validateRule)
                                .test(value)) {
                                errcount++;
                                fieldValidationError
                                    .activeValidator = activeValidator[0];
                            }
                        }
                    }
                }
            });
            return {
                fieldValidationError: fieldValidationError,
                errcount: errcount
            };
        }
        const onClickSubmit = (e) =>{
           // setModalShow(true)
 
            const fieldValidationErrors = {
                ...formErrors
            };
    
            Object.keys(fieldValidationErrors).forEach((fieldName, index) => { 
                    validateField(
                        fieldName,
                        formDataSet[fieldName],
                        { [fieldName]: formDataSet[fieldName] }
                    );
            });
            let isValid=validateForm();
            if(isValid){
                const saveJSON={...formDataSet}
               /*    var html=operatorSignup.emailBody.html
                var loc=html.indexOf(":");
                html=html.substring(0,loc+1)+saveJSON.emailId+html.substring(loc,html.length)
                const emailLoad={
                    "to":"dineshkum@infinite.com",
                    "from":"vijaykrishnan@infinite.com",
                    "subject":operatorSignup.emailBody.title ,
                    "text": operatorSignup.emailBody.paragraph,
                    "html": html
                }*/
    
                
                // operatorFboEnrollemtSave(saveJSON).then(response => {
                //     if(response.data.statusCode===200){
                //         setModalShow(true)
                //         operatorFboSendMail(emailLoad).then(res =>{
                //             //console.log(res)
                //         })
                //     }
                // })
            }else{
    
            }
        }
    
        const validateForm = () => {
            let formValid = true;
            const formErrorKeys = Object.keys(formErrors);
            for (let i = 0; i < formErrorKeys.length; i++) {
                const fieldName = formErrorKeys[i];
    
                if (!formErrors[fieldName].isValid) {
                    formValid = formErrors[fieldName].isValid;
                    return formValid;
                  }
            }
            return formValid;
        }
    
        const getOperatorFields = (item) => {
            switch(item.component.toUpperCase()) {
                case "PARAGRAPH":
                    return (<Row className='mb-3'> 
                   
                    <div><b> {item.label}</b></div>
                    </Row>)

                case "HEADER":
                    return (<Subheading label={item.label}/>)
                    case "CHECKBOX":
            return (<Checkbox Label={item.label} id={item.id} onClick={(e)=>onHandleChecked(e,item)} colWidth={item.styles ? item.styles.colWidth : ''}/>)
             case "BUTTON":
            return (<ButtonComponent       
                    Label={item.label} 
                    Type={item.type} 
                    className={item.styles.className}
                    variant={item.variant}
                    disabled={false}
                    handleClick={(e)=>onClickSubmit(e)}/>)
            case "INPUT":
                return (<Input 
                    disabled = {item.disable}
                    colWidth={item.styles ? item.styles.colWidth : ""} 
                    Type={item.type} 
                    Label={item.label}
                    data-label={item.label}
                    value={item.label}
                    Placeholder={item.placeholder}
                    isRequred={item.isRequired}
                    Name={item.name}
                    handleChange={(e)=>onHandleChange(e,item)}
                    handleBlur={(e)=>onHandleBlur(e,item)}
                    fieldError={
                        formErrors
                        && !formErrors[item.name].isValid
                        //&& (
                        //    formErrors[item.name].isTouched
                        //)
                    }
                    errorMessage={
                        formErrors
                        && formErrors[item.name]
                            .activeValidator
                            .errorMessage
                    }/>)
            case "SELECT":
                return (<Select 
                    colWidth={item.styles ? item.styles.colWidth : ""} 
                    Type={item.type} 
                    Label={item.label}
                    Placeholder={item.placeholder}
                    isRequred={item.isRequired}
                    Options={item.options}
                    Name={item.name}
                    handleChange={(e)=>onHandleChange(e,item)}
                    handleBlur={(e)=>onHandleBlur(e,item)}
                    
                    fieldError={
                        formErrors
                        && !formErrors[item.name].isValid
                       // && (
                       //     formErrors[item.name].isTouched
                        //)
                    }
                    errorMessage={
                        formErrors
                        && formErrors[item.name]
                            .activeValidator
                            .errorMessage
                    }/>)
             case "BUTTON":
                 return (<ButtonComponent 
                         Label={item.label} 
                         Type={item.type} 
                         className={item.styles.className}
                         variant={item.variant}
                         disabled={false}
                         handleClick={(e)=>onClickSubmit(e)}/>)
             };
        }

    return (
        <div >
           
             
                {isBusy?(<p>Loading</p>):(
                <Form>
                         
                  
                    <div id="uploaddocument" >
                    {operatorSignup && operatorSignup.sections.map((section, sectionIndex)=> {
                    return (
             
                     section.subSections.map((item) => (<Row className='mb-3'> 
                         {item.fields.map((field) => (
                             getOperatorFields(field)
                         ))}
                       
          
                         </Row>
                    ))
                )
            }
            )}    </div> 
     
                </Form>)}

        </div>
      );
}

export default CompanyDetailsForm;