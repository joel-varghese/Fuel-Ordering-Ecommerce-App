import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import ButtonComponent from '../button/button';
import $ from 'jquery';
import logo from '../../assets/images/barrel_fuel_logo.png'
import './FboSignupForm.scss';
import Input from '../input/input';
import Select from '../select/select';
import { bfaJsonService } from '../../actions/BFAServices/BFAJsonService';
import Subheading from '../subHeading/subHeading';
import Checkbox from '../checkbox/checkbox';


const UploadDocument = (props) => {

    const [operatorSignup, setoperatorSignupForm] = useState({});
    const [formDataSet, setformDataSet] = useState({});
    const [formErrors, setformErrors] = useState({});
    const [isBusy, setBusy] = useState(true);
    const payload= {"blobname":process.env.REACT_APP_READ_FBO_SIGNUP_AIRPORT_BLOBNAME}
    const [flightInfo, setflightInfo] = useState({});
    const dataValue =[] ;

    useEffect(() => {
        bfaJsonService(payload).then(response=>{
            setoperatorSignupForm(response.data.operatorSignup)
            setBusy(false);
            setInitialState(response.data.operatorSignup);

        })
        },[]);

        const setInitialState =(operatorSigup)=> {
            const fields = {};
            const formData = {};
            let formErrors = {};
           // const { formDataSet } = formDataSet;
    
            const fieldTypeArr = ['input','select'];
    
            operatorSigup && operatorSigup.sections[0].subSections[0].fields.forEach((item) => {
                if (fieldTypeArr.includes(item.component.toLowerCase())) {
                    formData[item.name] = formDataSet && formDataSet[item.name] ? formDataSet[item.name] : item.defaultValue;
                    formErrors[item.name] = getFormErrorRules(item);
                }
            })
        

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
        

    const handleAddFormSubmit = (event) => {
        event.preventDefault();

        const addNewFiled = operatorSignup.sections[0].subSections[0].fields;

        //change only arr2
        let filedLenght = operatorSignup.sections[0].subSections[0].fields.length
        let addNewFiledLenght = addNewFiled.length
        for (let i = 0; i <= addNewFiledLenght; i++) {
            addNewFiled[0].Id = 2
        }
//         let result =  addNewFiled[0].Id
//         console.log("result",result)
//         addNewFiled[0].Id = 2
// console.log("result",addNewFiled[0].Id)
        
        for (let i = 0; i <addNewFiledLenght; i++) {
            operatorSignup.sections[0].subSections[0].fields[filedLenght + i] = addNewFiled[i]

        }
        setoperatorSignupForm(operatorSignup)

        setInitialState(operatorSignup)
        event.preventDefault();
    };
        
        const onHandleChange = (e,field) =>{
            let formData = {};
            const fields = {};
            let target = e.target;
      
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
            /*customValidation(
                fieldName, value, validationObj
            );*/
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
        const onClickSubmit = (e) =>{
 

        const node = document.getElementById("aircraft");
        const clone = node.cloneNode(true);
        document.getElementById("aircraft").appendChild(clone);

          
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
    
            case "INPUT":
                return (<Input 
                    colWidth={item.styles ? item.styles.colWidth : ""} 
                    Type={item.type} 
                    disabled = {item.disable}
                    Label={item.label}
                    data-label={item.label}
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
                                handleClick={(e)=>handleAddFormSubmit(e)}/>)
            };
        }

    return (
        <div >
           
             
                {isBusy?(<p>Loading</p>):(
                <Form>
                         
                  
                    <div id="aircraft" >
                    {operatorSignup && operatorSignup.sections.map((section, sectionIndex)=> {
                    return (
             
                     section.subSections.map((item) => (<Row className='mb-3'> 
                     {/* <div>
                     {item.heading.map((field) => (
                                       
                                       getOperatorFields(field)
                                        ))}
                     </div> */}
     
                         {item.fields.map((field) => (
                             getOperatorFields(field)
                         ))}
                       

                         </Row>
                    ))
                )
            }
            )}    </div> 
            <div id="addAircraft"></div>
                </Form>)}

        </div>
      );
}
export default UploadDocument;

