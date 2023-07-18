import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import React, { useState, useEffect } from 'react';
import { useSearchParams,useLocation , useNavigate } from 'react-router-dom';
import { GoogleCaptcha } from '../../controls/GoogleCaptchaV3'
import Row from 'react-bootstrap/Row';
import ButtonComponent from '../button/button';
import logo from '../../assets/images/barrel_fuel_logo.png'
import './fboSignup.scss';
import Input from '../input/input';
import Select from '../select/select';
import { bfaJsonService } from '../../actions/BFAServices/BFAJsonService';
import { operatorFboSave, operatorFboSendMail } from '../../actions/OperatorFboService/operatorFboService';
import CustomModal from '../customModal/customModal';
import Header from '../header/header';
import { verifyCaptcha } from '../../services/commonServices';
import Loader from '../loader/loader';
import { phoneValidation } from '../../controls/validations';
import AviationFacts from '../aviationFacts/aviationFacts';
import { saveNotificationList } from '../../actions/notificationService/notificationAction';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { useDispatch } from 'react-redux';
import { getFBONamesList } from '../../actions/fboCompany/companyNameAction';
import {saveAuditLogData } from '../../actions/auditLog/auditLogActions';
import MobileHeader from '../mobileHeader/mobileHeader';
import Nav from 'react-bootstrap/Nav';
import CollapseMenuIcon from '../../assets/images/collapse_arrow.svg';

function FboSignup() {

    let navigate = useNavigate();
    const [fboEnrollData, setfboEnrollData] = useState({});
    const [formDataSet, setformDataSet] = useState({});
    const [formErrors, setformErrors] = useState({});
    const [modalShow, setModalShow] = useState(false);
    const [modalText, setModalText] = useState("");
    const [isBusy, setBusy] = useState(true);
    const [isBtnBusy,setbtnBusy]=useState(false);
    const [isBtnValidate,setbtnValidate]=useState(false);
    const [isAddress1Loading, setAddress1Loading] = useState(false);
    const [companyVal,setcompanyval] = useState('')
    const [results, setResults] = useState({});
    let companyData = [];
    const dispatch = useDispatch()
    const recaptcha = new GoogleCaptcha("fboSignup");
    const payload = { "blobname": process.env.REACT_APP_READ_FBO_ENROLLMENT_BLOBNAME }
    useEffect(() => {
        bfaJsonService(payload).then(response => {
            setfboEnrollData(response.data.fboEnrollData)
            setBusy(false);
            setInitialState(response.data.fboEnrollData);
        })
        setResults(companyData)
    }, []);

    const setInitialState = (fboData) => {
        const formData = {};
        let formErrors = {};

        const fieldTypeArr = ['input', 'select',  'asynctypeahead'];

        fboData && fboData.sections[0].subSections[0].fields.forEach((item) => {
            if (fieldTypeArr.includes(item.component.toLowerCase())) {
                formData[item.name] = formDataSet && formDataSet[item.name] ? formDataSet[item.name] : item.defaultValue? item.defaultValue:"";
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

    const onHandleChange = (e, field) => {
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
        // if(field.name==='companyName'){
        //     if(new RegExp(/(^[0-9]*$)|([^a-zA-Z0-9]+)/).test(target.value)){
        //         console.log('invalid')
        //     }
        // }
        if(field.name==='firstName'||field.name==='lastName'){
            target.value=target.value.replace(/[^a-z]/gi,'')
        }
        if(field.name === 'contact_number'){
            for(var i=0;i<field.validations.length; i++){
                if(field.validations[i].type === 'CheckUSPhone'){
                    e.target.value=phoneValidation(e.target.value);
                }
            }
        }
        fields[field.name] = target.value;
        if(field.name === 'companyName'){
            setcompanyval(target.value?target.value:'')
            validateField(
                field.name, target.value, fields, true
            );
        }
        
        // if(field.name==='emailId' || isBtnValidate){
        //     validateField(
        //         target.name, target.value, fields, true
        //     );
        // }
            
        formData = {
            ...formDataSet,
            ...fields
        }

        setformDataSet(formData)
    }

    const onHandleBlur = (e, field) => {
        let formData = {};
        const fields = {};
        let target = e.target;

        target.value = target.value.trim()
        fields[field.name] = target.value;
    //    if (target.name === 'emailId') {
            validateField(
                target.name, target.value, fields, true
            );
        // }
        if(field.component == 'select') {
            fields[field.name] = target.value == '' && formDataSet[field.name] != '' ? formDataSet[field.name] : target.value
        }

        formData = {
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
        validationObj = getFieldIsValid(value, fieldValidationError, fieldName);
        // fieldValidationErrors[fieldName] = {
        //     ...validationObj.fieldValidationError
        // };

        let errcount = validationObj.errcount;
        if (!errcount) {
            fieldValidationErrors[fieldName].isValid = true;
            fieldValidationErrors[fieldName].activeValidator = {};
        } else {
            fieldValidationErrors[fieldName].isValid = false;
            fieldValidationErrors[fieldName].activeValidator = validationObj.fieldValidationError.activeValidator;
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
        const validationTypes = ['IsMandatory', 'IsEmail', 'CheckRegex','CheckUSPhone','onlyspecial','onlydigit'];
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
                    if (validationType === 'onlyspecial') {
                        if (!new RegExp(activeValidator[0].validateRule)
                            .test(value)) {
                            errcount++;
                            fieldValidationError
                                .activeValidator = activeValidator[0];
                        }
                    }
                }
                if (!errcount) {
                    if (validationType === 'onlydigit') {
                        if (!new RegExp(activeValidator[0].validateRule)
                            .test(value)) {
                            errcount++;
                            fieldValidationError
                                .activeValidator = activeValidator[0];
                        }
                    }
                }
                if (!errcount) {
                    if (validationType === 'CheckUSPhone') {
                        if (value && ((value.match(/\d/g) || []).length !== 10)){
                            errcount++;
                            fieldValidationError
                                .activeValidator = activeValidator[0];
                        }
                    }
                }
                if (!errcount) {
                    if (validationType === 'IsEmail') {
                        let check=false;
                        if (!new RegExp(activeValidator[0].validateRule)
                            .test(value)) {
                                check = true   
                        }
                        let splitVal = value.split('@');
                        let replacedVal = splitVal[0].replaceAll('_','').replaceAll('.','')
                        if(replacedVal){}
                        else {
                          check = true
                        }
                        if(check){
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

    const onClickSubmit = async (e) => {

        //setModalShow(true)
        setbtnValidate(true)
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
        let token = await recaptcha.getToken().then(data => data);
            const param = { 'token': token }
            const data =verifyCaptcha(param)
            .then(data => {
                //console.log("data", data.data.body)
                return data.data;
            })
            .catch(err => console.error("err",err));
        let isValid=validateForm();
        //setbtnValidate(false);
        if(isValid){
            //setbtnDisable(true);
            setbtnBusy(true);
            

            const saveJSON={...formDataSet}
            var html=fboEnrollData.emailBody.html
            let nameString = saveJSON.firstName;
            let name = nameString.charAt(0).toUpperCase() + nameString.slice(1);
            var firstString = fboEnrollData.emailBody.paragraph +' '+ name + ',';
            html=firstString + html
            const emailLoad={
                "to":[saveJSON.emailId],
                "from":fboEnrollData.emailBody.fromEmailId,
                "subject":fboEnrollData.emailBody.title ,
                "text": fboEnrollData.emailBody.paragraph,
                "html": html
            }

            //saveJSON.numberOfLocations=parseInt(saveJSON.numberOfLocations)
            saveJSON.userType="FBO"
            saveJSON.contact_number=saveJSON.contact_number.replace(/\D/g,'')
            saveJSON.numberOfAircrafts=""
            
            operatorFboSave(saveJSON).then(response => {
                let errorObj  = formErrors
                if(response.data.accountRegister==="SUCCESS"){
                    setModalText(fboEnrollData.modal[0].submitModal.paragraph)
                    setModalShow(true)
                    operatorFboSendMail(emailLoad)
                    setbtnBusy(false);
                    let payload = {}
                    payload.type = "create"
                    payload.notificationMessage = fboEnrollData.notifyMessage.msg1+saveJSON.companyName
                    payload.organizationName = null
                    payload.loginUserName = null
                    payload.sendNotificationTo = "BF Internal"
                    payload.access_levels = ["Level 1 (Admin)","Level 2 (Standard)","Level 3 (Basic)"]
                    payload.isActionable = false
                    payload.actionTaken = ""
                    payload.category = "account"
                    payload.readInd = false
                    saveNotificationList(payload,dispatch).then((res)=>{
                        
                    })

                    let auditPayload = {"ModuleName":"Account",
                    "TabName":"FBO SignUp",
                    "Activity":"FBO Account Creation of "+saveJSON.firstName,
                    "ActionBy":Storage.getItem('email'),
                    "Role":JSON.parse(Storage.getItem('userRoles')),
                    "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
                    saveAuditLogData(auditPayload, dispatch)

                }else if(response.data.message.includes(saveJSON.emailId)){
                    setModalText(fboEnrollData.modal[0].errorModal.paragraph)
                    errorObj.emailId.isValid = false
                    errorObj.emailId.activeValidator.errorMessage = " "
                    setformErrors(errorObj)
                    console.log(errorObj)
                    setModalShow(true)
                    setbtnBusy(false);
                }else if(response.data.message.includes('companyName_duplicate')){
                    setModalText(fboEnrollData.modal[0].errorModal2.paragraph)
                    console.log(formErrors)
                    errorObj.companyName.isValid = false
                    errorObj.companyName.activeValidator.errorMessage = " "
                    setformErrors(errorObj)
                    setModalShow(true)
                    setbtnBusy(false);
                } else {
                    setModalText(fboEnrollData.modal[0].validateModal.paragraph)
                    console.log(formErrors)
                    setModalShow(true)
                    setbtnBusy(false);
                }
            })
        }else{
            setModalText(fboEnrollData.modal[0].validateModal.paragraph)
            setModalShow(true)
        }
        //}
    }

    const closeModal = () => {
        setModalShow(false)
        if(modalText===fboEnrollData.modal[0].submitModal.paragraph){
            navigate('/')
        }
    }

    const filterBy = () => true;

    const searchAPI =(e,isSearch)=>{
        setAddress1Loading(true)
        let payload ={}
        // if(isSearch){
        //   payload={
        //     "FBOName" : companyVal?companyVal:'' ,
        //   }
        // }else{
          payload={
            "FBOName" :  e&&e?e.toUpperCase():'' ,
          }
        //}
         getCompanyName(payload);
         setAddress1Loading(false)
      }
      
    const getCompanyName = (payload) => {
        getFBONamesList(payload,dispatch).then((res)=>{
            let companyList = [];
            let data = res && res.length>0 && res[0]&& res[0].length>0&&res[2][0]&&res[2][0]['@JSONResponse']?JSON.parse(res[2][0]['@JSONResponse']):[];
            if(data.length>0){
              data.map((i) =>{
                let compName = Array.isArray(payload.FBOName)?payload.FBOName[0]:payload.FBOName
                if(compName !="" && compName !=undefined && i.FBOName != compName){
                  companyList.push(compName)
                }
                companyList.push(i.FBOName);
              })
            }
            // else{
            //   let compName = Array.isArray(payload.FBOName)?payload.FBOName[0]:payload.FBOName
            //   if(compName.length>0)
            //    companyList.push(compName);
            // }
             let arr = companyList&&companyList.filter((item,index) => companyList.indexOf(item) === index)
             setResults(arr);
        })
    }

    const onAddressSearchBlur = (evt) => {
        let formData = { ...formDataSet };
        let errorData = { ...formErrors };
        if (evt.target.value != '') {
            formData["companyName"] = evt.target.value;
            errorData['companyName'].isTouched = true;
            errorData['companyName'].isValid = true;

        } else {
           // setAddress1Selected('');
            errorData['companyName'].isTouched = true;
            errorData['companyName'].isValid = false;
            formData["companyName"] = evt.target.value;
        }
        setformErrors(errorData);
        setformDataSet(formData);
        if (formErrors['companyName'] && formErrors['companyName'].activeValidator.errorMessage != null) {
            validateField('companyName', evt.target.value,
                { ['companyName']: evt.target.value })
        }
    }

    const searchHandler =(items)=>{
        let formData = {...formDataSet};
        const fields = {};
        let errorData = { ...formErrors };

          try {
            formData["companyName"] = items[0];
             errorData["companyName"].isTouched = true;
             errorData["companyName"].isValid = true;
            validateField("companyName",formData["companyName"] ,fields, true)
            setformErrors(errorData);
            setformDataSet(formData)
          } catch(err) {
            console.error('Caught error in search')
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
        switch (item.component.toUpperCase()) {
            case "INPUT":
                return (<Input
                    colWidth={item.styles ? item.styles.colWidth : ""}
                    Type={item.type}
                    Label={item.label}
                    Placeholder={item.placeholder}
                    isRequred={item.isRequired}
                    Name={item.name}
                    handleChange={(e) => onHandleChange(e, item)}
                    handleBlur={(e) => onHandleBlur(e, item)}
                        
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
                    } />)
            case "SELECT":
                return (<Select
                    colWidth={item.styles ? item.styles.colWidth : ""}
                    Type={item.type}
                    Label={item.label}
                    Placeholder={item.placeholder}
                    dynamicSelect={item.dynamicSelect}
                    lookupReference={item.dynamicSelect ? item.lookupReference : null}
                    isRequred={item.isRequired}
                    Options={item.options}
                    Name={item.name}
                    handleChange={(e) => onHandleChange(e, item)}
                    handleBlur={(e) => onHandleBlur(e, item)}
                    formDataSet={formDataSet && formDataSet[item.name] ? formDataSet[item.name] : item.defaultValue ? item.defaultValue : ''}
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
                    } />)
            case "BUTTON":
                return (<ButtonComponent
                    Label={item.label}
                    Type={item.type}
                    className={item.styles.className}
                    variant={item.variant}
                    disabled={false}
                    handleClick={(e) => onClickSubmit(e)} />)
            case "ASYNCTYPEAHEAD":
                        return(
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
                                id={item.id}
                                minLength={3}
                                defaultInputValue={formDataSet && formDataSet[item.name] ? formDataSet[item.name] : item.defaultValue ? item.defaultValue : ''}
                                label={item.label}
                                useCache={false}
                                onSearch={(items)=>searchAPI(items)}
                                inputProps={{
                                    name: item.name,
                                    maxLength: item.maxLength
                                  }} 
                                // ref={typeaheadRef}
                                onChange={(e) => searchHandler(e)}
                                options={results}
                                placeholder = {item.placeholder}
                                onBlur={onAddressSearchBlur}
                                // selected={address1Selected}
                                //   onFocus={handleFocus}
                                // renderMenuItemChildren={(option) => (
                                //     <>
                                //     <span>{option}</span>
                                //     </>
                                // )}
                                />
                                {formErrors &&
                                    formErrors[item.name] && !formErrors[item.name].isValid &&
                                        <div className='d-flex justify-content-end '>
                                            <small class="bf-error-message form-text"><span>
                                            {formErrors[item.name]
                                                .activeValidator
                                                .errorMessage}
                                                </span></small>
                                            </div>
                                    }
                            </Form.Group> 
                        )
        };
    }


    return (<>
        {isBusy ? (<Loader />) : (
            <div className={`d-flex d-flex-row login-section bf-fbo-signup-section bf-fbo-enrollment-section ${modalShow ? 'bf-show-model-blr' : ''}`}>
                <div className="w-50p login-form bf-fbo-signup d-flex align-items-center d-flex-column">
                    <div className='bf-fbo-enrollement-header'>
                        <Header isLoggedIn={false}  styleClass="bf-no-links"/>
                        <Nav.Link href={'./'} className='bf-mrgl15n'>Home</Nav.Link>
                    </div>
                    <MobileHeader name="Sign Up" />
                    <Form autoComplete='off'>
                        <h1 className='d-flex align-items-center justify-content-center bf-heading bf-relative'>
                        <Nav.Link href="./signup" className='bf-mobile-back-nav-acc'>
                            <img src={CollapseMenuIcon} />
                        </Nav.Link> 
                        {fboEnrollData && fboEnrollData.headline.label}
                        </h1>

                        {fboEnrollData && fboEnrollData.sections.map((section, sectionIndex) => {
                            return (
                                section.subSections.map((item) => (<Row className='mb-3'>
                                    <div className='row'>
                                    {item.fields.map((field) => (
                                        getOperatorFields(field)
                                    ))}
                                    </div>
                                    <div>
                                    {isBtnBusy ? (<Loader height='auto' />) : (
                                    <div className="d-grid gap-2 bf-mrg-20px">
                                        {item.primaryButton.map((field) => (
                                            getOperatorFields(field)
                                        ))}
                                    </div>)}</div>
                                </Row>
                                ))
                            )
                        }
                        )}


                        <CustomModal
                            show={modalShow}
                            onHide={() => closeModal()}
                            modelBodyContent={modalText}
                            buttonText={fboEnrollData.modal[0].submitModal.primaryButton.text}
                        />
                    <div className='copy-rights bf-show-mobile'>Copyright © 2022 Barrel Fuel</div>
                    </Form>
                    <div className='copy-rights bf-hide-mobile'>Copyright © 2022 Barrel Fuel</div>
                </div>
                <div className='d-flex bg-image-container w-50p'>
                    <div className='d-flex d-flex-column bf-login-right-sec'>
                        {
                            fboEnrollData && fboEnrollData.aviationFacts &&
                            <AviationFacts facts={fboEnrollData.aviationFacts} />
                        }
                    </div>
                </div>

            </div>)}
    </>);
}

export default FboSignup;