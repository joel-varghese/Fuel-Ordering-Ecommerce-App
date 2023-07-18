import React, { useEffect, useState } from 'react'
import { Row, Col, Form } from 'react-bootstrap'
import Errormessage from '../../controls/Errormessage'
import ButtonComponent from '../button/button'
import Input from '../input/input'
import Subheading from '../subHeading/subHeading';
import { validateField, getFormErrorRules, getPasswordStrength, validateForm, isValidEmail, isMandatory, phoneValidation, getFieldIsValid } from '../../controls/validations';
import { useLocation } from 'react-router-dom'
import { data } from 'jquery'
import { validateUserName } from '../../actions/forGotPasswordService/forGotPasswordService'
import { validateMobile } from '../../services/commonServices'
import Loader from '../loader/loader';

function ProfileModal(props) {
    const [hide, setHide] = useState(true);
    const [formData, setFormData] = useState({});
    const [formFieldData, setFormFieldData] = useState([]);
    const [fieldList, setFieldList] = useState([]);
    const [formDataSet, setformDataSet] = useState({});
    const [formErrors, setFormErrors] = useState({});
    const [formFieldErrors, setFormFieldErrors] = useState([]);
    const [errorText, setErrorText] = useState(false);
    const [linkBtnDisable, setlinkBtnDisable] = useState(true);
    const [confirmInputDisable, setConfirmInputDisable] = useState(true);
    const [isFormSubmited, setFormSubmited] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({});
    const [disableSubmit, setDisableSubmit] = useState(true);
    const [disableValidate, setDisableValidate] = useState(true);
    const [validationfailed, setValidationfailed] = useState()
    const [isTouched,setIsTouched]=useState(false);
    const [hideLoader,setHideLoader]=useState(true)
    const [resendCodeSuccess,setResendCodeSuccess]=useState(false);
    const location = useLocation();
    const params = location.search;
    useEffect(()=>{
        setFieldList(props.fieldList)
        setInitialState(props.fieldList);
        if(props.validationfailed){
            setErrorText(props.validationfailed)
        }
        else{
            setErrorText('')
        }
        setHide(props.hide)
    },[props.validationfailed, props.fieldList,props.hide])

    useEffect(()=>{
        setHideLoader(props.feildModal)
    },[props.feildModal])
    
    const handleBlur = (e, item) => {
        let formSaveData = formDataSet
        let fields = {};
        /* let formValid = this.state.formValid;
        const fieldValidationErrors = {...this.state.formErrors}; */
        let target = e.target;
        let fieldName, fieldValue;
        fieldName = target.name;
        fieldValue = target.value;
        fields[fieldName] = fieldValue;
        if (fieldName === 'confirmPassword') {
            if (!formErrors[fieldName].activeValidator.message) {
                setlinkBtnDisable(false)
                setDisableSubmit(false)
            } else {
                setlinkBtnDisable(true)
                setDisableSubmit(true)
            }
        }
        let formdData = {};
        formdData = {
            ...formSaveData,
            ...fields
        }
        setFormData(formdData);
        const errorObj = validateField(
            fieldName, fieldValue, fields, true, formErrors, formData
        );
        setformDataSet(formdData)
        setFormErrors(errorObj)
    }
    const handleClick = (e, item) => {
        e.preventDefault();
        let fldData = formDataSet
        let fieldValue = formDataSet && item.sendTo && formDataSet[item.sendTo]?formDataSet[item.sendTo]:"";
        const fieldValidationErrors = {
                ...formErrors
            };
            setFormSubmited(true);
            setDisableSubmit(true)
            setDisableValidate(true)
            let errorObj = {};
            Object.keys(fieldValidationErrors).forEach((fieldName, index) => {

                errorObj = validateField(
                    fieldName,
                    formData[fieldName],
                    { [fieldName]: formData[fieldName] }
                    , true, formErrors, formData);
                setFormErrors(errorObj)

            });

        let isValid = validateForm(errorObj);
       if(isValid) {
            if(item.name == "emailSubmit" || item.name == "emailResendCode"){
                props.sendMail(item,fieldValue)
                setHide(false)
                fldData["emailSecurityCode"] = ""

            }
            else if(item.name === "mobileSubmit" || item.name === "mobileResendCode"){
                props.sendSMS(item,fieldValue)
                setHide(false)
                fldData["mobileSecurityCode"] = ""
            }
            else if(item.name == "passwordResendCode"){
                props.sendMail('password','',item)
            }
            else {
                props.validatePin(item,fieldValue)
            }
        }
        setFormFieldData(fldData)
        // setHideLoader(data)
        
        
    }
    const handleChange = (e, item, index, flag) => {
        let formSaveData = formDataSet
        let fields = {};
        let passwordData = {};
        let errorObj = {};
        let target = e.target;
        let fieldName, fieldValue;
        fieldName = item.name;
        fieldValue = target.value;
        fieldValue = fieldValue.trim()
        if(item.name === "mobileNumber"){
            if (item.validations) {
                for (var i = 0; i < item.validations.length; i++) {
                    if (item.validations[i].validation === 'CheckUSPhone') {
                        fieldValue = phoneValidation(fieldValue);
                    }
                }
            }
        }
            
        fields[fieldName] = fieldValue;
        let formData = {
            ...formSaveData,
            ...fields
        };
        errorObj = validateField(fieldName, fieldValue, fields, true, formErrors, formData);
        setFormErrors(errorObj)
        setFormFieldData(fields);
        setFormData(formData);
        setformDataSet(formData)
        setFormFieldData(formData)
        setDisableSubmit(true)
        setDisableValidate(true)
        if(errorObj[fieldName].activeValidator.message == undefined){
            
            if(fieldName === 'emailAddress'){
                let payload = {
                    verify_user:fieldValue
                }
                validateUserName(payload).then((data,error)=>{
                    if(data.statusCode == '200'){
                        setDisableSubmit(true)
                        setErrorText(item.userExist)
                    }
                    else if(data.statusCode == '400'){
                        let body = data.body ? JSON.parse(data.body):''
                        if(body && body.errorcode == '113'){
                            setDisableSubmit(false)
                            setErrorText('')
                        }
                    }
                    
                })
                .catch ((error)=>{
                    if (error){
                        let data = error.body? JSON.parse(error.body):''
                        if(data && data.userExists){
                            setDisableSubmit(false)
                            setErrorText('')
                        }
                       
                    }
                })
            }
            else if(fieldName === 'mobileNumber'){
                let payload = {
                    verify_mobile:fieldValue
                }
                if(item.maxLength==fieldValue.length){
                    setDisableSubmit(false)
                    setErrorText('')
                }
                
                // validateMobile(payload).then((data)=>{
                //     if(data.statusCode == '200'){
                //         setDisableSubmit(true)
                //         setErrorText(item.mobileExist)
                //     }
                //     else{
                        
                //     }
                // })
            }
            else if (fieldName === 'newPassword') {
                setIsTouched(true);
                passwordData = getPasswordStrength(fieldName, fieldValue, fields, true, formErrors, passwordStrength);
                setPasswordStrength(passwordData.passwordStrength);
                setFormErrors(passwordData.errorObj);
                passwordStrength && Object.values(passwordStrength).every(item => item == true) ? setConfirmInputDisable(false) : setConfirmInputDisable(true);
            }
            else if (fieldName === 'confirmPassword') {
                if (!errorObj[fieldName].activeValidator.message) {
                    setlinkBtnDisable(false)
                    setDisableSubmit(false)
                } else {
                    setlinkBtnDisable(true)
                    setDisableSubmit(true)
                }
            }
            else{
                if(item.maxLength == fieldValue.length){
                    setDisableValidate(false); 
                    setErrorText("")
                }
            }
        }
    }
    const getFormErrorRules = (item) => {
        return {
            isValid: false,
            isTouched: false,
            activeValidator: {},
            validations: item.validations,
            isRequired: item.isRequired,
            minLength: item.minLength,
            maxLength: item.maxLength
        };
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
    const setInitialState = (fieldList, isClear, isClearSubField) => {
        
        let details = {};
        let errDetails = {};
        let formdetails = [];
        let formFieldError = [];
        const fieldTypeArr = ['input', 'checkbox', 'select', 'multiselectcheckbox', 'radio'];
        fieldList.length && fieldList[0].modal && fieldList[0].modal.length && fieldList[0].modal.forEach((fld, index) => {
            fld.fields.forEach((item) => {
                    if (fieldTypeArr.includes(item.component.toLowerCase())) {
                        errDetails[item.name] = getFormErrorRules(item);
                        errDetails = { ...setPrevActiveValidator(errDetails, item, index) };
                    }
                })
                formdetails = JSON.parse(JSON.stringify(details));
                formFieldError = JSON.parse(JSON.stringify(errDetails));

            
        });

        setFormFieldData(formdetails);
        setFormFieldErrors(formFieldError);
        setFormData(formdetails);
        setformDataSet(formdetails)
        setFormErrors(formFieldError);
    } 
    const handlePaste = (e,item) => {
        e.preventDefault();
        return false;
    };
    
    const getFields = (item, index, flag)=>{
            switch (item.component.toUpperCase()) {
                case "INPUT":
                    return(
                        <Input
                        autoComplete = "off"
                        field = {item}
                        colWidth={item.styles ? item.styles.colWidth : ""}
                        Type={item.dataType}
                        Label={item.label}
                        Name={item.name == "confirmPassword" || item.name == "newPassword" ? item.name : item.name+1}
                        showIcon={item.name == "confirmPassword" || item.name == "newPassword" ? true : false}
                        id={item.id}
                        hideLabel = {item.hideLabel}
                        disabled={item.name == "confirmPassword" ? confirmInputDisable : false}
                        Placeholder={item.placeholder}
                        isRequred={ item.isRequired }
                        maxLength={item.maxLength}
                        minLength={item.minLength}
                        onPaste={item.dataType == 'password' ? (e) => handlePaste (e,item) : null}
                        onCopy={item.dataType == 'password' ? (e) => handlePaste (e,item) : null}
                        handleChange={(e) => handleChange(e, item, index, flag)}
                        handleBlur={(e) => handleBlur(e, item, index, flag)}
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
                                .message
                        }
                         formDataSet={formFieldData ? formFieldData[item.name] : ''}
                    />
                    )
                    case "BUTTON":
                        return (<ButtonComponent
                            Label={item.label}
                            Type={item.type}
                            Name={item.name}
                            className={item.styles.className}
                            disabled={disableSubmit ? item.disabled: !item.disabled}
                            handleClick={(e) => handleClick(e, item, index)}
                        />)
                        case "VALIDATEBUTTON":
                            return (<ButtonComponent
                                Label={item.label}
                                Type={item.type}
                                Name={item.name}
                                className={item.styles.className}
                                disabled={disableValidate ? item.disabled: !item.disabled}
                                handleClick={(e) => handleClick(e, item, index)}
                            />)
                    
                    case "PARAGRAPH":
                        return (<><Subheading 
                            styles={item.styles ? item.styles : ""} label={item.label} /></>)
                    case "TEXT":
                        return(<div className={item.styles.className}>{item.text}</div>)
                    case "LINK":
                        return(<div className={`${item.styles ? (item.styles.colWidth ? 'col-md-'+item.styles.colWidth : ''): ''} bf-resent-sec d-flex d-flex-row align-items-center justify-content-between`}><span className="bf-success-otp">{props.resendOTP ? props.OTPSuccess : ''}</span> <div onClick={(e)=>handleClick(e, item, index)} className={`${item.styles ? item.styles.className : ''}`}>{item.text}</div></div>)
                    case "LIST":
                        return(<Errormessage
                            isTouched={isTouched}
                            styles={item.styles ? item.styles : null}
                            title={item.passwordGuidline.title}
                            {...item.passwordGuidline}
                            errors={passwordStrength}
                        />)
                default:
                    break;
            } 

    }

  return (
    <div>
        <Form autoComplete="off">
        {fieldList.length && fieldList[0].modal && fieldList[0].modal.length && fieldList[0].modal.map((item, index) => (<Row className='bf-mrgb-0'>
            {item.fields.map((val) => {
                 if( hide ? !val.hide : (val.validate ? !val.validate :true) ){
                    return getFields(val, index, true)
                }
            })}
            {<p className='bf-modal-errorText'>{errorText}</p>}
        </Row>))
    }
    </Form>
    {  hideLoader ? <Loader height='auto'/>:""}
    </div>
  )
}

export default ProfileModal