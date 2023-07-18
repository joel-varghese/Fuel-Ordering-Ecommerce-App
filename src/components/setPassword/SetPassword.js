import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Col } from 'react-bootstrap';
import logo from '../../assets/images/barrel_fuel_logo.png'
import './setPassword.scss';
import Input from '../input/input';
//import GuideLines from '../../controls/GuideLines';
import Errormessage from '../../controls/Errormessage';
import { validateField, getFormErrorRules, getPasswordStrength, validateForm, isValidEmail, isMandatory } from '../../controls/validations';
import { blobService } from '../../actions/blobService';
import * as types from '../../controls/types';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { setPasswordService } from '../../actions/setPasswordService/setPasswordService';
import { bfaJsonService } from '../../actions/BFAServices/BFAJsonService';
import CustomModal from '../customModal/customModal';
import Navbar from 'react-bootstrap/Navbar';
import Checkbox from '../checkbox/checkbox';
import AviationFacts from '../aviationFacts/aviationFacts';
import Loader from '../loader/loader';
import { decryptData, verifyUserRegisteration } from '../../services/commonServices';
import { useDispatch } from 'react-redux';
import {saveAuditLogData } from '../../actions/auditLog/auditLogActions';
import MobileHeader from '../mobileHeader/mobileHeader';

const SetPassword = (props) => {

    const [isUserRegistered, setUserRegistered] = useState(false);
    const location = useLocation();
    let navigate = useNavigate();
    let paylod = { 'blobname': process.env.REACT_APP_SET_PASSWORD }
    const params = location.search;

    let userType = '';
    let username = params.split('?').join('');
    //let userType = params.split('&');
    if (params.includes('&')) {
        // user
        let userData = params.split('&');
        userType = userData[1];
        username = userData[0].split('?').join('');
    }
    username = decryptData(username);
    console.log('user name after decrypting ', username)
    const [formData, setFormData] = useState({});
    const [formErrors, setFormErrors] = useState({});
    const [jsonData, setJsonData] = useState({});
    const [isBtnBusy,setbtnBusy]=useState(false);
    const [isTouched,setIsTouched]=useState(false);
    const [linkBtnDisable, setlinkBtnDisable] = useState(true);
    const [confirmInputDisable, setConfirmInputDisable] = useState(true)
    const [isFormSubmited, setFormSubmited] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({})
    const [showModel, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [termsCondition, setTermsCondition] = useState(false);
    const [reset, setReset] = useState(false);
    const [acceptTerms, setacceptTerms] = useState(false);
    const [flagkey, setflagkey] = useState(false);
    const [errorPopup, setErrorPopup] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        bfaJsonService(paylod).then(data => {
            setJsonData(data.data);
            setInitialState(data.data); 
        });
  
        const jsonDataObj = jsonData.content && jsonData.content.passwordData && jsonData.content.passwordData.content && jsonData.content.passwordData.content.externallink;
       
       verifyUserRegisteration(username).then( data => {
        console.log('data is ', JSON.parse(data.data.body).userRegistered)
        if( data && data.data && data.data.body && data.data.body) {
            let result = JSON.parse(data.data.body).userRegistered;
           // let uname = username.split('=')
            console.log('result ', result)
            if( result === 'Yes' ) {
                console.log('user exists')
                setModalContent('The link is no longer valid or has expired.' )
                setShowModal(true);
                setUserRegistered(true);
                setTermsCondition(false);
                setReset(false);
            }else {
                console.log('user does not exist')
                setUserRegistered(false);
            }
           // console.log('data is ', data.data.body.message)
        }
       
       })

        if (userType && (userType.toLowerCase() === 'fbo' || userType.toLowerCase() === 'operator')) {
            setTermsCondition(true);
        }else if(userType && (userType.toLowerCase() === 'reset')){
            setReset(true);
        } 
    }, []);

    const externallink = jsonData.content && jsonData.content.passwordData && jsonData.content.passwordData.content && jsonData.content.passwordData.content.externallink;
    const primaryFields = jsonData.content && jsonData.content.passwordData && jsonData.content.passwordData.content && jsonData.content.passwordData.content.primaryFields;
    const setInitialState = (adminSignupData) => {
        const formData = {};
        let formErrors = {};
        let data = {};
        let fields = [];
        let Error = {};
        const formDataSet = formData;
        const fieldTypeArr = ['input'];
        fields = adminSignupData.content && adminSignupData.content.passwordData && adminSignupData.content.passwordData.content && adminSignupData.content.passwordData.content.primaryFields;
        fields.length && fields.forEach((item) => {
            if (fieldTypeArr.includes(item.fieldType.toLowerCase())) {
                formData[item.name] = formDataSet && formDataSet[item.name] ? formDataSet[item.name] : item.defaultValue;
                formErrors[item.name] = getFormErrorRules(item);
               // formErrors = { ...setPrevActiveValidator(formErrors, item) };
            }
        });

        setFormData(formData);
        setFormErrors(formErrors);
    }
    const handleBlur = (e, item) => {
        let formDataSet = {};
        const fields = {};
        // /* let formValid = this.state.formValid;
        // let errorObj = {}
        // const fieldValidationErrors = {...formErrors}; 
        // Object.keys(fieldValidationErrors).forEach((fieldName, index) => {

        //     errorObj = validateField(
        //         fieldName,
        //         formData[fieldName],
        //         { [fieldName]: formData[fieldName] }
        //         , true, formErrors, formData);
        //     setFormErrors(errorObj)

        // });
        let target = e.target;
        let fieldName, fieldValue;
        fieldName = target.name;
        fieldValue = target.value;
        fields[fieldName] = fieldValue;
        if (fieldName === 'confirmPassword') {
            if (termsCondition) {
                if (!formErrors[fieldName].activeValidator.message) {
                    if(acceptTerms){
                        setlinkBtnDisable(false)
                    }else{
                        setflagkey(true)
                    }
                }
            }else{
                if (!formErrors[fieldName].activeValidator.message) {
                    setlinkBtnDisable(false)
                }else{
                    setlinkBtnDisable(true)
                }
            }
        }
        // const errorObj = validateField(
        //     fieldName, fieldValue, fields, true, formErrors, formData
        // );
        // setFormErrors(errorObj)
    }
    const handleClick = (e, item) => {
        e.preventDefault();
        const fieldValidationErrors = {
            ...formErrors
        };
        setFormSubmited(true);
        //fieldName, value, fields, subIndex, isTouched
        let errorObj = {};
        Object.keys(fieldValidationErrors).forEach((fieldName, index) => {

            errorObj = validateField(
                fieldName,
                formData[fieldName],
                { [fieldName]: formData[fieldName] }
                , true, formErrors, formData);
            setFormErrors(errorObj)

        });

        let isValid = validateForm(formErrors);
        //let username = params.get('username');

        if (username == '') {
            setModalContent(externallink.serviceMessage.invalidEmail)
            setShowModal(true);
        } else {
            username = username.replace(/["']/g, '');
        }

        let payload = {
            "username": username,
            "password": formData['newPassword']
        }

        if(termsCondition){ // 
            payload['termsAndCondition'] = true;
            let auditPayload = {"ModuleName":"Account",
                                                "TabName":"Account",
                                                "Activity":username+" Accepted Terms and Conditions",
                                                "ActionBy":username,
                                                "Role": "null",
                                                "Organization":"null"}
                            saveAuditLogData(auditPayload, dispatch)
            
        }else{
            payload['termsAndCondition'] = false;
        }
        
        
        if (isValid) {
            setbtnBusy(true)
            setPasswordService(payload).then((data) => {
                setbtnBusy(false)
                if (data.statusCode == 200) {
                    //navigate('/login')
                    if(reset){
                        setModalContent(externallink.serviceMessage.resetMsg);
                        setErrorPopup(true);
                        setShowModal(true); 
                    }else{
                        setModalContent(externallink.serviceMessage.successMsg);
                        setErrorPopup(true);
                        setShowModal(true);
                    }

                    let auditPayload = {"ModuleName":"Account",
                                                "TabName":"Account",
                                                "Activity":reset?"Password Reset for "+username:"Password Set for "+username,
                                                "ActionBy":username,
                                                "Role":"null",
                                                "Organization":"null"}
                            saveAuditLogData(auditPayload, dispatch)
                   
                } else if (data.statusCode == 500 || data.statusCode == 400) {
                    setModalContent(externallink.serviceMessage.emailNotFound);
                    setErrorPopup(true);
                    setShowModal(true);
                    
                }
            }).catch((e) => console.error(e));
        }
    }
    const handleChange = (e, item) => {
        let formDataSet = {};
        const fields = {};
        let passwordData = {}, errorObj = {};
        /*let formValid = this.state.formValid;
        const fieldValidationErrors = {...this.state.formErrors};*/
        let target = e.target;
        let fieldName, fieldValue;
        fieldName = target.name;
        fieldValue = target.value;
        fields[fieldName] = fieldValue;
        if (fieldName === 'newPassword') {
            setIsTouched(true);
            passwordData = getPasswordStrength(fieldName, fieldValue, fields, true, formErrors, passwordStrength);
            setPasswordStrength(passwordData.passwordStrength);
            setFormErrors(passwordData.errorObj);
            passwordStrength && Object.values(passwordStrength).every(item => item == true) ? setConfirmInputDisable(false) : setConfirmInputDisable(true);
        }
        if (fieldName === 'confirmPassword') {
            if (termsCondition) {
                if (!formErrors[fieldName].activeValidator.message && formErrors[fieldName].activeValidator.type == 'passwordMatch') {
                    if(acceptTerms){
                        setlinkBtnDisable(false)
                    }else{
                        setflagkey(true)
                    } 
                }
            }else{
                if (!formErrors[fieldName].activeValidator.message && formErrors[fieldName].activeValidator.type == 'passwordMatch') {
                    setlinkBtnDisable(false)
                }
            }
        }
        errorObj = validateField(
            fieldName, fieldValue, fields, true, formErrors, formData
        );
        setFormErrors(errorObj)
        formDataSet = {
            ...formData,
            ...fields
        };
        setFormData(formDataSet);
    }
    const closeModal = () => {
        document.getElementById('termsAndCondition').checked=false;
        setShowModal(false)
        setlinkBtnDisable(true)
        setacceptTerms(false);      
    }
    const closeSuccessModal = () => {
        if(modalContent==externallink.serviceMessage.resetMsg||modalContent==externallink.serviceMessage.successMsg){
            navigate('/login');
        }
        if(isUserRegistered) {
            navigate('/login')
        }
        setShowModal(false)
    }
    const acceptTermsConditionBtn = () => {
        setacceptTerms(true);
        setShowModal(false);
        if(flagkey){
            setlinkBtnDisable(false)
        }
        document.getElementById('termsAndCondition').checked=true;
    }
    const closed = () => {
        setShowModal(false)
    }
    const customErrorSuccesPopup = (btnText) => {
        return (
            <CustomModal
                show={showModel}
                close={() => closed()}
                title={termsCondition && !errorPopup ? externallink.modalContent.modalTitle : ''}
                onHide={termsCondition && !errorPopup ? () => acceptTermsConditionBtn() : () => closeSuccessModal()}
                hide={() => closeModal()}
                modelBodyContent={modalContent}
                buttonText={termsCondition && !errorPopup ? externallink.modalContent.termAcceptBtn : btnText}
                secondbutton={termsCondition && !errorPopup ? externallink.modalContent.termDeckinetBtn : ''}
            />
        )
    }
    const onHandleChecked = (e) => {
        
        if (e.target.checked) {
            setacceptTerms(true);
            if(flagkey){
                setlinkBtnDisable(false);
            }
        } else {
            setlinkBtnDisable(true)
            setacceptTerms(false);
        }
    }
    const handlePaste = (e,item) => {
        e.preventDefault();
        return false;
    };
    const onHandlelink = (e) => {
        e.preventDefault();
            setModalContent(externallink.modalContent.modalContent)
            setShowModal(true)
    }
    const getFormFields = (field, index) => {

        switch (field.fieldType.toUpperCase()) {
            case "INPUT":
                return (
                    <Form.Group
                        key={index}
                        as={Col}
                        type={field.fieldType}
                        placeholder={field.placeholder}
                    >
                        <Input
                            field={field}
                            handleChange={(e) => handleChange(e, field)}
                            handleBlur={(e) => handleBlur(e, field)}
                            Type={field.dataType}
                            isRequred={field.isRequired}
                            Label={field.fieldLabel}
                            Placeholder={field.placeHolder}
                            Name={field.name}
                            showIcon={true}
                            value={formData[field.name]}
                            onPaste={field.dataType == 'password' ? (e) => handlePaste (e,field) : null}
                            onCopy={field.dataType == 'password' ? (e) => handlePaste (e,field) : null}
                            formDataSet={formData[field.name]}
                            maxLength={field.maxLength}
                            minLength={field.minLength}
                            disabled={field.name == 'confirmPassword' ? confirmInputDisable : ''}
                            fieldError={
                                formErrors &&
                                formErrors[field.name] && !formErrors[field.name].isValid
                                && (
                                    formErrors[field.name].isTouched
                                )
                            }
                            errorMessage={
                                formErrors
                                && formErrors[field.name]
                                    .activeValidator
                                    .message
                            }
                        />
                    </Form.Group>
                );
            case "LIST":
                return (
                    <>
                        {field.passwordGuidline && Object.keys(field.passwordGuidline.guidelines).length ? (
                            <Form.Group
                                as={Col}
                                md={12}
                                className="p-root"
                            >
                                <Errormessage
                                    isTouched={isTouched}
                                    title={field.title}
                                    {...field.passwordGuidline}
                                    errors={passwordStrength}
                                />
                            </Form.Group>
                        ) : ''}
                    </>
                );
            default:
                /* istanbul ignore next */
                return null;
        }
    };
    return (<>
        {jsonData &&
        <div className={`d-flex d-flex-row login-section bf-set-password-section bf-set-password-container ${showModel ? 'bf-show-model-blr' : ''}`}>
            <div className="w-50p login-form d-flex align-items-center d-flex-column">
                <Navbar.Brand href={"./"}>
                    <img src={logo} alt="Barrel Fuel Logo" className='login-logo' />
                </Navbar.Brand>
                <MobileHeader name={"Create Password"}/>
                <Form autoComplete='off'>
                    <div className='bf-set-password-feilds'>
                        <h1 className='d-flex align-items-center justify-content-center bf-heading'>{jsonData && jsonData.content && jsonData.content.passwordData && jsonData.content.passwordData.content && jsonData.content.passwordData.content.passwordHeadingOne && jsonData.content.passwordData.content.passwordHeadingOne.headline && jsonData.content.passwordData.content.passwordHeadingOne.headline.text}</h1>

                        {
                            primaryFields && primaryFields.map((ele, i) => {
                                return getFormFields(ele, i)
                            })
                        }
                    </div>
                    <div>
                        {
                            termsCondition ? <span className='d-flex justify-content-start chkbox-trms bf-set-password-checkbox'><Checkbox id={externallink && externallink.modalContent && externallink.modalContent.checkboxId} onClick={(e) => onHandleChecked(e)} /><span className='mx-2'>{externallink && externallink.modalContent && externallink.modalContent.label}</span><a className='bf-trems-link' href='' onClick={(e) => onHandlelink(e)}>{externallink && externallink.modalContent && externallink.modalContent.termsCheckbox}</a></span>
                                : ''
                        }
                        {
                            externallink && externallink.loginBtn &&
                            <Form.Group
                                as={Col}
                            className="d-grid gap-2"
                            >
                                {isBtnBusy ? (<Loader height='auto' />) : (
                                <Button variant="dark"
                                    className="bf-btn-login bf-btn-login-imp"
                                    type="submit"
                                    disabled={linkBtnDisable}
                                    onClick={(e) => handleClick(e, externallink.loginBtn)}>
                                    {externallink.loginBtn.fieldLabel}
                                </Button>)}
                            </Form.Group>
                        }
                    </div>
                </Form>
                {
                    externallink && externallink.modalContent && customErrorSuccesPopup(externallink.modalContent.modalBtn, externallink.serviceMessage.mandatoryField)
                }

                <div className='copy-right'>{externallink && externallink.copyright && externallink.copyright.text}</div>
            </div>
            <div className='d-flex bg-image-container w-50p'>
                <div className='d-flex d-flex-column bf-login-right-sec'>
                    {
                        jsonData && jsonData.content && jsonData.content && jsonData.content.passwordData.content.aviationFacts &&
                        <AviationFacts facts={jsonData.content.passwordData.content.aviationFacts} />
                    }
                </div>
            </div>
        </div>
        }</>
    )
}

export default SetPassword