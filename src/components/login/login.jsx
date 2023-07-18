import { useState, useRef, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Col, Nav } from 'react-bootstrap';
import logo from '../../assets/images/barrel_fuel_logo.png'
import './login.scss';
import Input from '../input/input';
import Checkbox from '../checkbox/checkbox';
import * as types from '../../controls/types';
import CustomModal from '../customModal/customModal';
import { loginService } from '../../actions/loginService/loginService';
import { bfaJsonService } from '../../actions/BFAServices/BFAJsonService';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { Storage, jsonStringify } from '../../controls/Storage';
import Navbar from 'react-bootstrap/Navbar';
import AviationFacts from '../aviationFacts/aviationFacts';
import { ClipboardEvent } from "react"
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getLoggedInCompany, getLoggedInFirstName, getLoggedInUser, getLoggedInUserType } from '../../actions/commonActions/commonActions';
import { fetchJWTTokenFromLogin, fetchLoginData,fetchLoginAccessLevel } from '../../actions/loginService/loginActions';
import { getCompany, getSelectedTab, getSelectedUser } from '../../actions/accountHome/accountHomeActions';
import { overdueEnrollment } from '../onboarding/fboOnboarding';
import {saveAuditLogData } from '../../actions/auditLog/auditLogActions';
import { ContactSupportOutlined } from '@mui/icons-material';
import MobileHeader from '../mobileHeader/mobileHeader';
import {getSelectedTabFuel, getSelectedCompanyFP } from '../../actions/fuelPriceHome/fuelPriceHomeActions';
import Loader from '../loader/loader';
import { getAdminAccess,getSuperAccess } from '../../controls/commanAccessLevel';
import { getSystemVariables } from '../../actions/accountAdminAction/adminService'
import {systemVariablesVal} from '../../actions/accountAdminAction/adminAction'

const Login = (props) => {
    let payload = { 'blobname': process.env.REACT_APP_LOGIN };
    const location = useLocation();
    let navigate = useNavigate();
    const dispatch = useDispatch()
    const [isInvalid, setIsInvalid] = useState(false);
    const [formData, setFormData] = useState({});
    const [formErrors, setFormErrors] = useState({});
    const [jsonData, setJsonData] = useState({});
    const [isFormSubmited, setFormSubmited] = useState(false);
    const [linkBtnDisable, setlinkBtnDisable] = useState(true);
    const [showModel, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [loader,setLoader]=useState(false)
    const externallink = jsonData.content && jsonData.content.loginData && jsonData.content.loginData.content && jsonData.content.loginData.content.externallink;
    const primaryFields = jsonData.content && jsonData.content.loginData && jsonData.content.loginData.content && jsonData.content.loginData.content.primaryFields;
    const loginReducer = useSelector( (state) =>  state.loginReducer)  
    useEffect(() => {
        if(Storage.getItem('jwtToken')){
            fetchJWTTokenFromLogin(dispatch, {})
                Storage.removeItem('jwtToken')
                Storage.removeItem('selectedUserType')
                Storage.removeItem('selectedTab')
                Storage.removeItem('userRoles')
                Storage.removeItem('organizationName')
                Storage.removeItem('organizationId')
                Storage.removeItem('email')
                Storage.removeItem('userType')
                Storage.removeItem('accessLevel')
                getSelectedUser("", dispatch)
                getSelectedTab('',dispatch)
                getLoggedInUserType('',dispatch)
                getCompany('',dispatch)
        }
        bfaJsonService(payload).then(data => {
            setJsonData(data.data);
            setInitialState(data.data);   
        });
    }, []);
    
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
    const setInitialState = (adminSignupData) => {
        const formData = {};
        let formErrors = {};
        let data = {};
        let fields = [];
        const formDataSet = formData;
        const fieldTypeArr = ['input'];
        fields = adminSignupData.content && adminSignupData.content.loginData && adminSignupData.content.loginData.content && adminSignupData.content.loginData.content.primaryFields;
        fields.length && fields.forEach((item) => {

            if (fieldTypeArr.includes(item.fieldType.toLowerCase())) {
                if (item.name == 'emailaddress' || item.name == 'password') {
                    if (Storage.getItem('emailaddress') != undefined || Storage.getItem('password') != undefined) {
                        formData[item.name] = Storage.getItem(item.name);
                    } else {
                        formData[item.name] = formDataSet && formDataSet[item.name] ? formDataSet[item.name] : item.defaultValue;
                    }
                } else {
                    formData[item.name] = formDataSet && formDataSet[item.name] ? formDataSet[item.name] : item.defaultValue;
                }

                formErrors[item.name] = getFormErrorRules(item);
                //formErrors = { ...setPrevActiveValidator(formErrors, item) };
            }
        });

        setFormData(formData);
        setFormErrors(formErrors);
    }
    const handleChange = (e, item) => {
        let formDataSet = {};
        const fields = {};
        /*let formValid = this.state.formValid;
        const fieldValidationErrors = {...this.state.formErrors};*/
        let target = e.target;
        /**
         * Prevent typing if allowed field length is reached.
         */

        let maxLength = 0;
        if (item && item.maxLength) {
            maxLength = parseInt(item.maxLength);
        }
        if (maxLength > 0 && target.value.length > maxLength) {
            target.value = target.value.substring(0, maxLength);
            return;
        }
        let fieldName, fieldValue;
        fieldName = target.name;
        // target.value = target.value.trim();
        fieldValue = target.value;
        fields[fieldName] = fieldValue;
        // validateField(
        //     fieldName, fieldValue, fields, true
        // );
        /* if(fieldName === 'emailAddress')
            validateField(
                fieldName, fieldValue, fields, true
            ); */
        formDataSet = {
            ...formData,
            ...fields
        };
        setFormData(formDataSet);

    }

    const preventCopyPaste = (e) => {
       // alert("Copying and pasting is not allowed!")
        e.preventDefault()
       
      }

    const customErrorSuccesPopup = (btnText) => {
        return (
            <CustomModal
                show={showModel}
                onHide={() => setShowModal(false)}
                modelBodyContent={modalContent}
                buttonText={btnText}
            />
        )
    }

    const getFormFields = (field, index) => {

        switch (field.fieldType.toUpperCase()) {
            case types.INPUT:
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
                            // onPaste={field.dataType == 'password' ? (e) => handlePaste (e,field) : null}
                            // onCopy={field.dataType == 'password' ? (e) => handlePaste (e,field) : null}
                            formDataSet={formData[field.name]}
                            showIcon={field.name === 'password' ? true : false}
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
            default:
                /* istanbul ignore next */
                return null;
        }
    };
    const handlePaste = (e,item) => {
            e.preventDefault();
            return false;
    };
    const handleBlur = (e, item) => {
        let formDataSet = {};
        const fields = {};
        /* let formValid = this.state.formValid;
        const fieldValidationErrors = {...this.state.formErrors}; */
        let target = e.target;
        let fieldName, fieldValue;
        fieldName = target.name;
        target.value = target.value.trim();
        fieldValue = target.value;
        fields[fieldName] = fieldValue;
        if (fieldName === 'emailaddress') {
            validateField(
                fieldName, fieldValue, fields, true
            );
        }
        formDataSet = {
            ...formData,
            ...fields
        };
        setFormData(formDataSet);

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
        validationObj = getFieldIsValid(value, fieldValidationError, fieldName);
        fieldValidationErrors[fieldName] = {
            ...validationObj.fieldValidationError
        };
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

        setFormErrors(fieldValidationErrors);
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
        const validationTypes = ['IsMandatory', 'email', 'password', 'CheckRegex'];
        let errcount = 0;
        let activeValidator = null;
        validationTypes.forEach(validationType => {

            activeValidator = fieldValidationError.validations && fieldValidationError.validations.filter
                (validate => validate.validation === validationType);
            if (activeValidator && activeValidator.length) {
                if (validationType === 'IsMandatory') {
                    if (!value) {
                        errcount++;
                        fieldValidationError
                            .activeValidator = activeValidator[0];
                    }
                }
                else if (validationType === 'CheckRegex') {
                    let check = false;
                    if (!new RegExp(activeValidator[0].validateRule).test(value)) {
                        check = true;
                    }
                    if (fieldName == "emailaddress") {
                        if(value !== '' && value !== undefined) {
                            let splitVal = value.split('@');
                            let replacedVal = splitVal[0].replaceAll('_', '').replaceAll('.', '')
                            if (replacedVal) { }
                            else {
                                check = true
                            }
                        } else {
                            check = true
                        }
                    }
                    if (check) {
                        errcount++;
                        fieldValidationError.activeValidator = activeValidator[0];
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
                    } else {
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
    const validateForm = () => {
        let formValid = true;
        const formErrorKeys = Object.keys(formErrors);
        for (let i = 0; i < formErrorKeys.length; i++) {
            const fieldName = formErrorKeys[i];
            //skiping state validation as it has default value
            if (!formErrors[fieldName].isValid) {
                formValid = formErrors[fieldName].isValid;
                return formValid;
            }
        }
        return formValid;
        /* this.setState({
            formValid: formValid
        }); */
    }
    const handleClick = (e, item) => {
        e.preventDefault();
        const fieldValidationErrors = {
            ...formErrors
        };
        //fieldName, value, fields, subIndex, isTouched
        Object.keys(fieldValidationErrors).forEach((fieldName, index) => {
            validateField(fieldName, formData[fieldName], { [fieldName]: formData[fieldName] });
        });
        // let isFormValid = validateForm();
        checkLoginData();
    }

    const checkLoginData = () => {
        let isValid = validateForm();
        let payload = {
            "username": formData['emailaddress'],
            "password": formData['password']
        }
        if (isValid) {
            setLoader(true)
            loginService(payload).then((data) => {
                let body = jsonStringify(data.body);
                console.log(data)
                //console.log("body",body,JSON.parse(body));
                let jwtToken = JSON.parse(body);
                let company = jwtToken.organizationName ? jwtToken.organizationName : " "
                // code for operator super user
               
                if (data.statusCode == 200) {
                    Storage.setItem('jwtToken', jwtToken.jwtToken);
                    Storage.setItem('userRoles', JSON.stringify(jwtToken.userRole));
                    Storage.setItem('organizationName', jwtToken.organizationName);
                    Storage.setItem('organizationId', jwtToken.organizationId);
                    Storage.setItem('email', jwtToken.loginUserName);
                    
                    getLoggedInUser(jwtToken.loginUserName,dispatch)
                    getLoggedInUserType(jwtToken.userType,dispatch)
                    getLoggedInFirstName(jwtToken.firstName,dispatch)
                    fetchJWTTokenFromLogin(dispatch, data.body)
                    /* jwtToken.userRole.forEach((val) => {
                        if (val === 'BF Admin' || val === 'BF Super Admin' ||
                        val === 'Admin' || val === 'FBO Super Admin' ||
                        val === 'Operator Admin' || val === 'Operator Super Admin') {
                            navigate('/admin')
                        } else {
                            navigate('/otherAdmin');
                        }
                    }); */
                    
                    Storage.setItem('userType', jwtToken.userType);
                    let accessLevel = []
                    if(jwtToken.accessLevel[0]== "Level 1 (Admin)"){
                        accessLevel.push("Super")
                    }
                    else if(jwtToken.accessLevel[0]== "Level 2 (Standard)"){
                        accessLevel.push("Admin")
                    }
                    else{
                        accessLevel.push("Basic")
                    }
                    fetchLoginAccessLevel(dispatch,JSON.stringify(accessLevel))
                    Storage.setItem('accessLevel',JSON.stringify(accessLevel));

                    if(jwtToken.userType == 'Operator' && getAdminAccess(jwtToken.userType,JSON.stringify(accessLevel))){
                        getCompany("", dispatch)
                        getLoggedInCompany("", dispatch)
                    } else {
                        getLoggedInCompany(jwtToken.organizationName ? jwtToken.organizationName : "", dispatch)
                        getCompany(company, dispatch)
                    }
                    
                    let payload = {"ModuleName":"Login",
                    "TabName":"Login",
                    "Activity":jwtToken.loginUserName+" Logged In",
                    "ActionBy":Storage.getItem('email'),
                    "Role":JSON.parse(Storage.getItem('userRoles')),
                    "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
                    saveAuditLogData(payload, dispatch)
                    
                    navigate('/dashboard')
                    let acclevel = jwtToken.accessLevel;
                    /*acclevel.forEach((level,ind)=>{
                        // level.toLowerCase();
                        if (level.toLowerCase()=='admin'|| level.toLowerCase()=='super') {
                            navigate('/admin')
                        } else {
                            if(acclevel.length==1 && level.toLowerCase()=='basic'){
                                navigate('/otherAdmin');
                            }
                        }
                    })*/
                    if(jwtToken.userType == "Barrel Fuel"){
                        overdueEnrollment(jsonData.notifyMessage.msg1,dispatch)
                    }
                    //getSystemVariables
                    let payloadSystem={"Loggedinuser":jwtToken.loginUserName}
                    getSystemVariables(payloadSystem).then((res)=>{
                        //setIsloading(false)
                        let data=res?.data
                        data =  data[0][0]['JSON_UNQUOTE(@JSONResponse)']
                        data=JSON.parse(data)
                        //setsystemVariablesData(data)
                        // setfeildData(data)
                        //setInitialState(data)
                        let systemVariable = {}
                        data && data.map((item, index) => {
                            systemVariable[item.VariableName.replace(/ /g,"_")] = item.value;
                        })
                        systemVariablesVal(systemVariable, dispatch)
                    })
                } else if (data.statusCode == 400) {
                    setModalContent(externallink.serviceMessage.invalidCredentials)
                    setLoader(false)
                    //customErrorSuccesPopup()
                    setShowModal(true);
                } else if (data.statusCode == 500) {
                    setModalContent(externallink.serviceMessage.emailNotFound)
                    //customErrorSuccesPopup()
                    setShowModal(true);
                    setLoader(false)
                }
            }).catch((err) => {
                if(err){
                    setLoader(false)
                    console.log(err)
                    setModalContent(externallink.serviceMessage.invalidCredentials)
                    
                }

            });
        } else {
            setModalContent(externallink.serviceMessage.mandatoryField)
            //customErrorSuccesPopup()
            setShowModal(true);
        }
    }

    const handleCheckboxCheck = (e) => {
        if(e.target.checked){
            if (Object.keys(formData).length > 0 && formData['emailaddress'] && formData['password']) {

                Storage.setItem('emailaddress', formData && formData['emailaddress']);
            }
        }else{
            Storage.removeItem('emailaddress');
        }
        
    }

    return (
        <div className={`d-flex d-flex-row login-section bf-login-mobile-container ${showModel ? 'bf-show-model-blr' : ''}`}>
            <div className="w-50p login-form d-flex align-items-center d-flex-column">
                <Navbar.Brand href={"./"}>
                    <img src={logo} alt="Barrel Fuel Logo" className='login-logo' />
                </Navbar.Brand>
                <Nav.Link href={'./'} className='bf-home-anchor'>Home</Nav.Link>
                <MobileHeader name="Login" />
                <Form className="login-section-form" onSubmit={(e)=>handleClick(e, externallink.loginBtn)}>
                    <div>
                        <h1 className='d-flex align-items-center justify-content-center bf-heading bf-login-welcome-head'>{jsonData && jsonData.content && jsonData.content.loginData && jsonData.content.loginData.content && jsonData.content.loginData.content.loginHeadingOne.headline && jsonData.content.loginData.content.loginHeadingOne.headline.text}</h1>

                        {
                            primaryFields && primaryFields.map((ele, i) => {
                                return getFormFields(ele, i)
                            })
                        }
                        <div className='d-flex justify-content-between bf-remeber'>
                            {
                                externallink && externallink.rememberme &&
                                <Checkbox type={externallink.rememberme.fieldType} Label={externallink.rememberme.fieldLabel} name={externallink.rememberme.name} onClick={handleCheckboxCheck} />

                            }
                            {
                                externallink && externallink.forgotLink &&
                                <a href={externallink.forgotLink.href} className="text-decoration-none mb-3">{externallink.forgotLink.fieldLabel}</a>
                            }
                        </div>
                    </div>
                    <div className='bf-submit-section'>
                        {
                            externallink && externallink.forgotLink &&
                            <Form.Group
                                as={Col}
                                className="d-grid gap-2 mb-3"
                            >
                               { ! loader ?
                                <Button variant="dark"
                                    className="bf-btn-login bf-btn-login-imp"
                                    type="submit"
                                    onClick={(e) => handleClick(e, externallink.loginBtn)}>
                                    {externallink.loginBtn.fieldLabel}
                                </Button>
                                :<Loader height='auto'/>
                                }
                            </Form.Group>
                        }
                        {
                            externallink && externallink.modalContent && customErrorSuccesPopup(externallink.modalContent.modalBtn, externallink.serviceMessage.mandatoryField)
                        }
                        <div className='d-flex justify-content-center bf-font-12 bf-signup-sec'>
                            {externallink && externallink.notRegister && externallink.notRegister.text}
                            <span className='mx-1'> <a href={externallink && externallink.notRegister && externallink.signupLink.link} className="text-decoration-none bf-hyperlink" >{externallink && externallink.notRegister && externallink.signupLink.text}</a></span>
                        </div>
                    </div>
                </Form>
                <div className='bf-mrgb20i bf-copy-right-mt'>{externallink && externallink.copyright && externallink.copyright.text}</div>
            </div>
            <div className='d-flex bg-image-container w-50p'>
                <div className='d-flex d-flex-column bf-login-right-sec'>
                    {
                        externallink && externallink.aviationFacts &&
                        <AviationFacts facts={externallink.aviationFacts} />
                    }
                </div>
            </div>
        </div>
    );
}

export default Login;