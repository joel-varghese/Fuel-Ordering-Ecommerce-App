import React, { useState,useEffect } from 'react';
import CustomModal from '../customModal/customModal';
import logo from '../../assets/images/barrel_fuel_logo.png'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Input from '../input/input';
import Errormessage from '../../controls/Errormessage';
import Select from '../select/select';
import './registration.scss'
import ButtonComponent from '../button/button';
import Subheading from '../subHeading/subHeading';
import { useLocation,useNavigate} from 'react-router-dom';
import { bfaJsonService } from '../../actions/BFAServices/BFAJsonService';
import { updateRegisterationService } from '../../actions/updateRegisteration/updateRegisterationService';
import { phoneValidation } from '../../controls/validations';
import Loader from '../loader/loader';
import AviationFacts from '../aviationFacts/aviationFacts';

function RegistrationForm(){

    const [fetchUserdata, setfetchUserdata] = useState({})
    const [isBusy, setBusy] = useState(true)
    const [modalShow, setModalShow] = React.useState(false);
    const [modalText, setModalText] = React.useState('');
    const [isBtnValidate,setbtnValidate]=useState(false);
    const [formData , setFormData] = useState({});
    const [formErrors , setFormErrors] = useState({});
    const [confirm , setconfirm] = useState(true);
    const [button , setbutton] = useState(true);
    const [passwordError , setPasswordError] = useState({});
    const location = useLocation();
    const url = location.search;
    let navigate = useNavigate();
    const params = {"blobname":"userRegistration.json"}

    useEffect(() => {
        bfaJsonService(params).then(response => {
            setBusy(false)
            setfetchUserdata(response.data.userRegister)
            setInitialState(response.data.userRegister);
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
        let Error = {};
        let fields = [];
        const  formDataSet = formData;
        const fieldTypeArr = ['input', 'radio', 'select'];
        fields = operatorData && operatorData.content.primaryFields;
        fields && fields.forEach( (item) => {
            if (fieldTypeArr.includes(item.fieldType.toLowerCase())) {
                formData[item.name] = formDataSet && formDataSet[item.name] ? formDataSet[item.name] : item.defaultValue;
                formErrors[item.name] = getFormErrorRules(item);
            }
        })
        fields.forEach((item)=>{
            if(item.name === "password"){
                item.validations.forEach((val,index)=>{
                    if(val.validationRule)
                        {Error[index-1]=false}
                })
            }
        })
        setPasswordError(Error)
        setFormData(formData);
        setFormErrors(formErrors);
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
        const validationTypes = ['empty','length','upper','digit','special',
        'CheckUSPhone','characterMismatch','passwordMatch'];
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
                    if(validationType === 'passwordMatch'){
                        if(formData['password'] !== value){
                            errcount++;
                            fieldValidationError
                                .activeValidator = activeValidator[0];
                        }
                    }else if(validationType === 'CheckUSPhone'){
                        if(value && ((value.match(/\d/g) || []).length !== 10)){
                            errcount++;
                            fieldValidationError
                                .activeValidator = activeValidator[0];
                        }
                    } else {
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
        let fieldName, fieldValue;
        fieldName = item.name;
        fieldValue = target.value;
        fields[fieldName] = fieldValue;
        // validateField(
        //     fieldName, fieldValue, fields, true
        // );
          
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

    const confirmError = (Errors) => {
        let confirmError=true;
        Object.values(Errors).map((value, index) => {
            confirmError = confirmError && value
        })
        if(confirmError){
            setconfirm(false)
        }else{
            setconfirm(true)
        }
    }
    const showError = () => {
        return(
            <CustomModal
            show={modalShow}
            onHide={() => closeModal()}
            modelBodyContent={modalText}
            buttonText={fetchUserdata.content.userModal[1].button}
          />
        )
    }

    const closeModal = () =>{
        setModalShow(false)
        if(modalText === fetchUserdata.content.userModal[0].paragraph){
            navigate('/login')
        }
    }

    const onClickSubmit = (e) =>{
        setbtnValidate(true);
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
            let username = url.split('?').join('');
            username = username.replace(/["']/g, '');
            if(username ===''){username='dummyemail@1234.567'}
            const saveJSON={...formData}
            saveJSON.username = username
            saveJSON.mobileNumber = saveJSON.mobileNumber.replace(/\D/g,'')
            delete saveJSON.confirmPassword
            updateRegisterationService(saveJSON).then(response => {
                if(response.accountRegister == 'SUCCESS'){
                    setModalShow(true)
                    setModalText(fetchUserdata.content.userModal[0].paragraph)
                }else{
                    setModalShow(true)
                    setModalText('User does not exist!')
                }
            })
        }else{
            setModalShow(true)
            setModalText(fetchUserdata.content.userModal[1].paragraph)
        }
    }
    const handleChange= (e, item) => {
        let formDataSet = {};
        const fields = {};
        /*let formValid = this.state.formValid;
        const fieldValidationErrors = {...this.state.formErrors};*/
        let target = e.target; 
        let fieldName, fieldValue;
        fieldName = item.name;
        fieldValue = target.value;
        fields[fieldName] = fieldValue;
        let maxLength = 0;
		if (item && item.maxLength) {
			maxLength = parseInt(item.maxLength);
		}
		if (maxLength > 0 && e.target.value.length > maxLength) {
			e.target.value = e.target.value.substring(0, maxLength);
			return;
		}
        if(fieldName == "firstName" || fieldName == "middleName" || fieldName == "lastName"){
            target.value=target.value.replace(/[^a-z]/gi,'')
          }
        if(item.validations){
            for(var i=0;i<item.validations.length; i++){
                if(item.validations[i].type === 'CheckUSPhone'){
                    e.target.value=phoneValidation(e.target.value);
                }
            }
        }
        if(item.name === 'password'){
            let Errors = {};
            item && item.validations.forEach( (err,index) => {
                if (err.validationRule) {
                    if(new RegExp(err.validationRule)
                    .test(fieldValue)){
                        Errors[index-1] = true;}else{
                            Errors[index-1]=false;
                        }
                }
            })
            setPasswordError(Errors)
            confirmError(Errors)
        }
        if(isBtnValidate){
            validateField(
                fieldName, fieldValue, fields, true
            );
        }
        
        if(item.name === 'confirmPassword'){
            if(!formErrors[item.name].activeValidator.errorMessage && formErrors[item.name].activeValidator.type !== 'empty'){
                setbutton(false)
            }else{
                setbutton(true)
            }
        }
        formDataSet = {
            ...formData,
            ...fields
          };
          setFormData(formDataSet);
    }


    const getUserFields = (item) => {
        switch(item.fieldType.toUpperCase()) {
        case "INPUT":
            return (<Input 
                colWidth={item.styles ? item.styles.colWidth : ""} 
                Type={item.dataType} 
                Label={item.fieldLabel}
                Placeholder={item.placeHolder}
                isRequred={item.isRequired}
                className="mb-3"
                showIcon={item.name == 'password' || item.name == 'confirmPassword'? true : false }
                disabled={item.name === 'confirmPassword' ? confirm : false}
                handleChange={(e) => handleChange(e, item)}
                handleBlur={(e) => handleBlur(e, item)}
                Name={item.name}
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
        case "BUTTON":
            return (<Row className='mb-3'><ButtonComponent 
                    Label={item.fieldLabel} 
                    Type={item.type}
                    className={item.className}
                    disabled={item.name === 'submitButton' ? button : false}
                    variant = {item.variant}
                    handleClick = {(e) => onClickSubmit(e)} /></Row>)
        case "LIST":
            return (
                    <>
                    {item.passwordGuidline && item.passwordGuidline.guidelines.length ? (
                    <Form.Group
                        as={Col}
                        md={12}
                        className="p-root bf-pwrd-rules"
                    >
                    <Errormessage
                        errors={passwordError}
                        title={item.title}
                        { ...item.passwordGuidline}
                    />
                    </Form.Group>
                    ) : ''}
                    </>
                    );
        case "PARAGRAPH":
            return (<div>
                        <p className='bf-b600' >{item.heading}</p>
                        <div className='bf-password-rules'>
                            {/*item.guidelines.map((rule)=>(
                            <p>{rule}</p>
                            ))*/}
                        </div>
                    </div>)
        };

    }


    return (<>
        {isBusy ? (
            <Loader/>
          ) : ( 
        <div className={`d-flex d-flex-row login-section bf-user-registration-section bf-register-user ${modalShow?'bf-show-model-blr':''}`}>
            <div className="w-50p login-form d-flex align-items-center d-flex-column">
                <div className="d-flex d-flex-row align-item-center justify-content-between bf-menu-header">
                    <img src={logo} alt="Barrel Fuel Logo" className='login-logo'/>
                </div>
            {modalShow ? showError(): ''}
            
            <Form autoComplete='off'>
                <h1 className='d-flex bf-heading d-flex justify-content-center'>{fetchUserdata.content.headers[0].label}</h1>
                
                
            
                    {fetchUserdata.content.primaryFields.map((item) => (<Row className="bf-user-register">
                            {getUserFields(item)  }
                            </Row>                                     
                    ))}
                    <div className='d-flex justify-content-center bf-copy-right'>Copyright © 2022 Barrel Fuel</div>
                 
            </Form>         
                
            
            
            
            </div>
            <div className='d-flex bg-image-container w-50p'>
                    <div className='d-flex d-flex-column bf-login-right-sec'>
                    {fetchUserdata && fetchUserdata.content && fetchUserdata.content.aviationFacts &&
                        <AviationFacts facts={fetchUserdata.content.aviationFacts}/>
                    }
                    </div>
                </div>
        
        </div>
        
        
        )} </> );

}

export default RegistrationForm