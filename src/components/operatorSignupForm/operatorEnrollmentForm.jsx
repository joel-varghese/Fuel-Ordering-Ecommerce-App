import React, { useState,useEffect } from 'react';
import { operatorFboSave, operatorFboSendMail } from '../../actions/OperatorFboService/operatorFboService';
import CustomModal from '../customModal/customModal';
import { GoogleCaptcha } from '../../controls/GoogleCaptchaV3'
import { useSearchParams,useLocation , useNavigate} from 'react-router-dom';
import logo from '../../assets/images/barrel_fuel_logo.png'
import Nav from 'react-bootstrap/Nav';
import './operatorSignupForm.scss';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Input from '../input/input';
import Select from '../select/select';
import Checkbox from '../checkbox/checkbox';
import ButtonComponent from '../button/button';
import Subheading from '../subHeading/subHeading';
import { phoneValidation } from '../../controls/validations';
import { bfaJsonService } from '../../actions/BFAServices/BFAJsonService';
import { verifyCaptcha } from '../../services/commonServices';
import Loader from '../loader/loader';
import { Storage } from '../../controls/Storage';
import AviationFacts from '../aviationFacts/aviationFacts';
import { saveNotificationList } from '../../actions/notificationService/notificationAction';
import { useDispatch } from 'react-redux';
import {saveAuditLogData } from '../../actions/auditLog/auditLogActions';
import MobileHeader from '../mobileHeader/mobileHeader';
import CollapseMenuIcon from '../../assets/images/collapse_arrow.svg';

function OperatorEnrollmentForm(){


    const [fetchoperatordata, setfetchoperatordata] = useState({})
    const [isBusy, setBusy] = useState(true)
    const [modalShow, setModalShow] = React.useState(false);
    const [count, setCount] = React.useState(true);
    const [modalText, setModalText] = React.useState('');
    const [formData , setFormData] = useState({});
    const [formErrors , setFormErrors] = useState({});
    const [isBtnBusy,setbtnBusy]=useState(false);
    const [hideNext,setHideNext]=useState(false);
    const [nextDisable,setNextDisable]=useState(true);

    const dispatch = useDispatch()
    const [isBtnValidate,setbtnValidate]=useState(false);
    let navigate = useNavigate();
    const params = {"blobname":process.env.REACT_APP_READ_OPERATOR_ENROLLMENT_BLOBNAME}

    const recaptcha = new GoogleCaptcha("login");

    useEffect(() => {
        bfaJsonService(params).then(response => {
            setBusy(false)
            setfetchoperatordata(response.data.operatorEnroll)
            setInitialState(response.data.operatorEnroll);
        })
    }, [])

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

    const setInitialState= (operatorData)=> {
        const formData = {};
        let formErrors = {};
        let data = {};
        let fields = [];
        const  formDataSet = formData;
        const fieldTypeArr = ['input', 'radio', 'select'];
        fields = operatorData && operatorData.content.primaryFields;
        fields && fields.forEach( (item) => {
            if (fieldTypeArr.includes(item.fieldType.toLowerCase())) {
                formData[item.name] = formDataSet && formDataSet[item.name] ? formDataSet[item.name] : item.defaultValue? item.defaultValue:"";
                formErrors[item.name] = getFormErrorRules(item);
            }
        })
        
        setFormData(formData);
        setFormErrors(formErrors);
    }

    const renderField= (render)=> {
        fetchoperatordata.content.primaryFields.map( (item) => {
            if (item.name !== 'numberOfAircrafts') {
                if(item.shouldNotRender === true){item.shouldNotRender = render}
            }
        })
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
        const validationTypes = ['empty', 'email','onlyspecial','onlydigit',
            'CheckUSPhone', 'characterMismatch'];
        let errcount = 0;
    let activeValidator = null;
        validationTypes.forEach(validationType => {
            
            activeValidator = fieldValidationError.validations && fieldValidationError.validations.filter
            (validate => validate.type === validationType);
            if (activeValidator && activeValidator.length) {
                if (validationType === 'empty') {
                    if (!value) {
                        errcount++;
                        fieldValidationError
                            .activeValidator = activeValidator[0];
                    }
                }
                if (!errcount) {
                    if (validationType === 'email' || validationType === 'isEmail') {
                        let check=false;
                        if (!new RegExp(activeValidator[0].validationRule)
                            .test(value)) {
                                check = true   
                        }
                        if (fieldName == "emailaddress" || fieldName == "emailId") {
                            let splitVal = value.split('@');
                            // let replacedVal = splitVal[0].replaceAll('_', '').replaceAll('.', '')
                            let replacedVal =  !new RegExp('.*[^a-zA-Z0-9._+].*').test(splitVal[0]);
                            if (replacedVal) { }
                            else {
                                check = true
                            }
                        }
                        if(check){
                            errcount++;
                            fieldValidationError
                                .activeValidator = activeValidator[0];
                        }
                    }
                }
                if (!errcount) {
                    if(validationType === 'CheckUSPhone'){
                        let number = value ? value.match(/\d/g) :[]
                        if(value && (number.length !== 10)){
                            errcount++;
                            fieldValidationError
                                .activeValidator = activeValidator[0];
                        }
                        // else if(value && (number.length == 10)){
                       
                        //     let data = value.replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, '')
                        //     data = data.replace("-", '')
                        //     data =parseInt( data.replace(" ",""))
                        //     if (data<10){
                        //         errcount++;
                        //         fieldValidationError
                        //             .activeValidator = activeValidator[0];
                        //     }
                            
                        // }
                    }else {
                        if (!new RegExp(activeValidator[0].validationRule)
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
        customValidation(
            fieldName, value, validationObj
        );
    }

    const handleBlur= (e, item) => {
        let formDataSet = {};
        const fields = {};
        /* let formValid = this.state.formValid;
        const fieldValidationErrors = {...this.state.formErrors}; */
        let target = e.target;
        target.value = target.value.trim() 
        let fieldName, fieldValue;
        fieldName = item.name;
        fieldValue = target.value;
        fields[fieldName] = fieldValue;
        // if(item.name === 'emailId'){
            validateField(
                fieldName, fieldValue, fields, true
            );
        // }
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
    const closed = () => {
        setModalShow(false)
        // document.getElementById('operatorTitleID').innerText = fetchoperatordata.content.headers[0].operator_roles
    }
    const showModal = () => {
        return(
            <CustomModal
            show={modalShow}
            onHide={() => closeModal()}
            hide={() => assistedSignUp()}
            size={modalText===fetchoperatordata.content.operatorModal[4].paragraph ? "lg":''}
            close={() => closed()}
            modelBodyContent={modalText}
            buttonText={modalText===fetchoperatordata.content.operatorModal[4].paragraph ? fetchoperatordata.content.operatorModal[4].button : fetchoperatordata.content.operatorModal[0].button}
            secondbutton={modalText===fetchoperatordata.content.operatorModal[4].paragraph ? fetchoperatordata.content.operatorModal[4].button2 : ''}
          />
        )
    }
    const onClickEnter = (event)=>{
        // if(event.keyCode === 13){
            if(parseInt(formData['numberOfAircrafts'])>0){
                if(formData['numberOfAircrafts'] != 0){
                    Storage.setItem('noOfAircrafts',formData['numberOfAircrafts'])
                    if(parseInt(formData['numberOfAircrafts']) < 5  ){
                        navigate('/operator')
                        setHideNext(true)
                    }else{
                        if(count){
                            setModalShow(true)
                            setModalText(fetchoperatordata.content.operatorModal[4].paragraph)
                        }  
                    }
                }
            }
            
        // }
    }
    const closeModal = () =>{
        setModalShow(false)
        if(modalText===fetchoperatordata.content.operatorModal[0].paragraph){
            navigate('/')
            setHideNext(true)

        }
        if(modalText===fetchoperatordata.content.operatorModal[4].paragraph){
            document.getElementById('operatorTitleID').innerText = fetchoperatordata.content.headers[0].label;
            renderField(false)
            setHideNext(true)
            setCount(false)
        }
    }
    const assistedSignUp = () =>{
        setModalShow(false)
        setHideNext(true)
        navigate('/operator')
    }
    const handleChange= (e, item) => {
        let formDataSet = {};
        const fields = {};
        /*let formValid = this.state.formValid;
        const fieldValidationErrors = {...this.state.formErrors};*/
        let target = e.target; 
        let fieldName, fieldValue;
        fieldName = item.name;
        
        let maxLength = 0;
		if (item && item.maxLength) {
			maxLength = parseInt(item.maxLength);
		}
		if (maxLength > 0 && target.value.length > maxLength) {
			target.value = target.value.substring(0, maxLength);
			return;
		}
        
        if((item.name == 'firstName')||(item.name =='lastName')){
            target.value = target.value.replace(/[^a-z]/gi,'')
        }
        if(item.dataType==='numeric'){
            target.value=target.value.replace(/\D/g,'')
        }
        if(item.name === 'contact_number'){
            for(var i=0;i<item.validations.length; i++){
                if(item.validations[i].type === 'CheckUSPhone'){
                    target.value=phoneValidation(e.target.value);
                }
            }
        }
        if(item.name == "numberOfAircrafts"){
            let val = parseInt(target.value)
            if(val>0){
                setNextDisable(false)
            }
        }
        fieldValue = target.value;
        fields[fieldName] = fieldValue;
        // if(item.name==='emailId'||isBtnValidate){
        //     validateField(
        //         fieldName, fieldValue, fields, true
        //     );
        // }
        

        formDataSet = {
            ...formData,
            ...fields
          };
          setFormData(formDataSet);
    }
    const onClickSubmit = async (e, item) =>{
        e.preventDefault();
        if(item.name == 'next'){
            if(formData['numberOfAircrafts'] != 0){
                Storage.setItem('noOfAircrafts',formData['numberOfAircrafts'])
                if(parseInt(formData['numberOfAircrafts']) < 5  ){
                    navigate('/operator')
                    setHideNext(true)

                }else{
                    if(count){
                        setModalShow(true)
                        setModalText(fetchoperatordata.content.operatorModal[4].paragraph)
                    }  
                }
            }
        }else {
            setbtnValidate(true)
            let token = await recaptcha.getToken().then(data => data);

            const param = { 'token': token }
            verifyCaptcha(param)
            .then(data => {
                return data.data;
            }).catch(err => console.error("err",err));

            const fieldValidationErrors = {
                ...formErrors
            };

            Object.keys(fieldValidationErrors).forEach((fieldName, index) => { 
                    validateField(
                        fieldName,
                        formData[fieldName],
                        { [fieldName]: formData[fieldName] }
                    );
            });


            let isValid=validateForm();
            if(isValid){
                setbtnBusy(true)
                const saveJSON={...formData}
                saveJSON.contact_number=parseInt(saveJSON.contact_number.replace(/\D/g,''))
                saveJSON.numberOfAircrafts=parseInt(saveJSON.numberOfAircrafts)
                saveJSON.userType="Operator"
                var html=fetchoperatordata.content.operatorEmail.html
                let nameString = saveJSON.firstName;
                let name = nameString.charAt(0).toUpperCase() + nameString.slice(1);
                var firstString = fetchoperatordata.content.operatorEmail.text +' '+ name + ',';
                html=firstString + html
                const emailData={}
                emailData.to = [saveJSON.emailId]
                emailData.from = "vijay.krishnan@barrelfuel.com"
                emailData.subject = fetchoperatordata.content.operatorEmail.subject
                emailData.text = fetchoperatordata.content.operatorEmail.text
                emailData.html = html
                
                operatorFboSave(saveJSON).then(response => {
                    let errorObj = formErrors
                    if( response === undefined ){
                        setbtnBusy(false);
                        setModalText(fetchoperatordata.content.operatorModal[3].paragraph)
                        setModalShow(true)
                    }
                    if(response.data.accountRegister==="SUCCESS"){
                        setModalShow(true)
                        setbtnBusy(false);
                        setModalText(fetchoperatordata.content.operatorModal[0].paragraph)
                        operatorFboSendMail(emailData)
                        let payload = {}
                        payload.type = "create"
                        payload.notificationMessage = fetchoperatordata.notifyMessage.msg1+saveJSON.companyName
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

                        let auditPayload = {"ModuleName":"Operator SignUp",
                        "TabName":"Operator SignUp",
                        "Activity":"Operator Enrollment of "+nameString,
                        "ActionBy":Storage.getItem('email'),
                        "Role":JSON.parse(Storage.getItem('userRoles')),
                        "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
                        saveAuditLogData(auditPayload, dispatch)

                    }else if(response.data.message.includes(saveJSON.emailId)){
                        setModalShow(true)
                        setbtnBusy(false);
                        errorObj.emailId.isValid = false
                        errorObj.emailId.activeValidator.errorMessage = " "
                        setModalText(fetchoperatordata.content.operatorModal[2].paragraph)
                    }else if(response.data.message.includes('companyName_duplicate')){
                        setModalShow(true)
                        setbtnBusy(false);
                        errorObj.companyName.isValid = false
                        errorObj.companyName.activeValidator.errorMessage = " "
                        setModalText(fetchoperatordata.content.operatorModal[3].paragraph)
                    } else {
                        setbtnBusy(false);
                        setModalText(fetchoperatordata.content.operatorModal[1].paragraph)
                        setModalShow(true)
                    }
                }).catch(error => {
                    console.log('dkdk test ',error)
                    setbtnBusy(false);
                    setModalText(fetchoperatordata.content.operatorModal[1].paragraph)
                    setModalShow(true)
                })
            }else{
                setModalShow(true)
                setModalText(fetchoperatordata.content.operatorModal[1].paragraph)
            }
        }
    }

    const getOperatorFields = (item) => {
        if(!item.shouldNotRender){ 
        switch(item.displayType.toUpperCase()) {
        case "INPUT":
            return (<Input 
                colWidth={item.styles ? item.styles.colWidth : ""} 
                Type={item.fieldType} 
                Label={item.fieldLabel}
                Placeholder={item.placeHolder}
                onkeyDown={true}
                isEnter = {item.name== 'numberOfAircrafts'? true:false}
                clickEnter={(e)=>onClickEnter(e)}
                isRequred={item.isRequired}
                handleChange={(e) => handleChange(e, item)}
                handleBlur={(e) => handleBlur(e, item)}
                errorMessage={
                    formErrors  &&
                    formErrors[item.name] && formErrors[item.name]
                        .activeValidator
                        .errorMessage
                }
                fieldError={
                    formErrors && 
                    formErrors[item.name] && !formErrors[item.name].isValid
                    /*&& (
                        formErrors[item.name].isTouched
                    )*/
                }/>)
        case "SELECT":
            return (<Select 
                colWidth={item.styles ? item.styles.colWidth : ""} 
                Type={item.fieldType}
                Options={item.options ? item.options : null}
                Label={item.fieldLabel}
                Placeholder={item.placeHolder}
                isRequred={item.isRequired}
                dynamicSelect={item.dynamicSelect}
                lookupReference={item.dynamicSelect ? item.lookupReference : null}
                handleChange={(e) => handleChange(e, item)}
                handleBlur={(e) => handleBlur(e, item)}
                formDataSet={formData && formData[item.name] ? formData[item.name] : item.defaultValue ? item.defaultValue : ''}
                errorMessage={
                    formErrors  &&
                    formErrors[item.name] && formErrors[item.name]
                        .activeValidator
                        .errorMessage
                }
                fieldError={
                    formErrors && 
                    formErrors[item.name] && !formErrors[item.name].isValid
                   /* && (
                        formErrors[item.name].isTouched
                    )*/
                }/>)
        case "ROWSELECT":
            return (<Row className='mb-3'><Select 
                colWidth={item.styles ? item.styles.colWidth : ""} 
                Type={item.fieldType}
                Options={item.options ? item.options : null}
                Label={item.fieldLabel}
                Placeholder={item.placeHolder}
                isRequred={item.isRequired}
                dynamicSelect={item.dynamicSelect}
                lookupReference={item.dynamicSelect ? item.lookupReference : null}
                handleChange={(e) => handleChange(e, item)}
                handleBlur={(e) => handleBlur(e, item)}
                errorMessage={
                    formErrors  &&
                    formErrors[item.name] && formErrors[item.name]
                        .activeValidator
                        .errorMessage
                }
                fieldError={
                    formErrors && 
                    formErrors[item.name] && !formErrors[item.name].isValid
                   /* && (
                        formErrors[item.name].isTouched
                    )*/
                }/></Row>)
        case "CHECKBOX":
            return (<Checkbox Label={item.fieldLabel} colWidth={item.styles ? item.styles.colWidth : ''}/>)
        case "HEADER":
                return (<Subheading label={item.label}/>)
        case "BUTTON":
            return (<>{item.name == 'next' && hideNext? "":<Row className='mb-3'><ButtonComponent 
                    Label={item.fieldLabel} 
                    Type={item.type}
                    className={item.className}
                    disabled = {item.name=='next'?nextDisable:false}
                    variant = {item.variant}
                    handleClick = {(e) => onClickSubmit(e, item)} /></Row>}</>)
        case "PARAGRAPH":
            return (<div>{item.fieldLabel}</div> )
        };}

    }

  return (<>
    {isBusy ? (
        (<Loader/>)
      ) : ( 
    <div className={`d-flex d-flex-row login-section bf-operator-enrollment-section bf-operator-enrollment signup-section ${modalShow ? 'bf-show-model-blr':''}`}>
        <div className="w-70p login-form d-flex d-flex-column">
            <div className="d-flex d-flex-row align-item-center justify-content-between bf-menu-header">
                <Nav.Link href={"./"}>
                    <img src={logo} alt="Barrel Fuel Logo" className='login-logo'/>
                </Nav.Link>
                <Nav.Link href={"./"}>Home</Nav.Link> 
            </div>
            <MobileHeader name="Sign Up" />
        {modalShow ? showModal() : ''}

        <Form autoComplete='off'>
            <h1 className='d-flex bf-heading bf-relative'>
                <Nav.Link href="./signup" className='bf-mobile-back-nav-acc'>
                    <img src={CollapseMenuIcon} />
                </Nav.Link> 
                <span id="operatorTitleID">{fetchoperatordata.content.headers[0].operator_role}</span>
            </h1>
            
            
        <Row className='mb-3 bf-enrollment-details-section bf-mobile-enrollment-section'>
                {fetchoperatordata.content.primaryFields.map((item) => (
                    item.name==='submitButton'?
                    isBtnBusy ? (<Loader height='auto' />) : (
                        getOperatorFields(item) ):  getOperatorFields(item)                                                  
                ))}
        </Row>      
        </Form>         
            
        
        
        
        </div>
        <div className='d-flex bg-image-container w-30p'>
                <div className='d-flex d-flex-column bf-login-right-sec'>
                {fetchoperatordata && fetchoperatordata.content && fetchoperatordata.content.aviationFacts &&
                        <AviationFacts facts={fetchoperatordata.content.aviationFacts}/>
                    }
                </div>
            </div>
    
    </div>)}
    
    </>  
  );
}

export default OperatorEnrollmentForm;