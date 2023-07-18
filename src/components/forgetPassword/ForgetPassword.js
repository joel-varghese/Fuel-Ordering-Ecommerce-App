import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Col, Nav } from 'react-bootstrap';
import logo from '../../assets/images/barrel_fuel_logo.png'
import Input from '../input/input';
import { validateField, getFormErrorRules, getPasswordStrength, matchPassword, validateForm } from '../../controls/validations';
import { bfaJsonService } from '../../actions/BFAServices/BFAJsonService';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { validateUserName } from '../../actions/forGotPasswordService/forGotPasswordService';
import CustomModal from '../customModal/customModal';
import { operatorFboSendMail } from '../../actions/OperatorFboService/operatorFboService';
import Navbar from 'react-bootstrap/Navbar';
import AviationFacts from '../aviationFacts/aviationFacts';
import {encryptData} from '../../services/commonServices';
import { useDispatch } from 'react-redux';
import {saveAuditLogData } from '../../actions/auditLog/auditLogActions';
import MobileHeader from '../mobileHeader/mobileHeader';
import CollapseMenuIcon from '../../assets/images/collapse_arrow.svg';
import Loader from '../loader/loader';

const ForgetPassword = ({ props }) => {
    let paylod = { 'blobname': process.env.REACT_APP_FORGOT_PASSWORD }
    const [formData, setFormData] = useState({});
    const [formErrors, setFormErrors] = useState({});
    const [linkBtnDisable, setlinkBtnDisable] = useState(true);
    const [jsonData, setJsonData] = useState({});
    const [isFormSubmited, setFormSubmited] = useState(false);
    const [showModel, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [successPop, setSuccessPopup] = useState(false);
    const [loader,setLoader]=useState(false);
    const location = useLocation();
    const dispatch = useDispatch()
    let navigate = useNavigate();
    useEffect(() => {
        bfaJsonService(paylod).then(data => {
            setJsonData(data.data);
            setInitialState(data.data);
        });
    }, []);

    const externallink = jsonData.content && jsonData.content.forgotData && jsonData.content.forgotData.content && jsonData.content.forgotData.content.externallink;
    const primaryFields = jsonData.content && jsonData.content.forgotData && jsonData.content.forgotData.content && jsonData.content.forgotData.content.primaryFields;


    const setInitialState = (adminSignupData) => {
        const formData = {};
        let formErrors = {};
        let data = {};
        let fields = [];
        let Error = {};
        const formDataSet = formData;
        const fieldTypeArr = ['input'];
        fields = adminSignupData.content && adminSignupData.content.forgotData && adminSignupData.content.forgotData.content && adminSignupData.content.forgotData.content.primaryFields;
        fields.length && fields.forEach((item) => {
            if (fieldTypeArr.includes(item.fieldType.toLowerCase())) {
                formData[item.name] = formDataSet && formDataSet[item.name] ? formDataSet[item.name] : item.defaultValue;
                formErrors[item.name] = getFormErrorRules(item);
                //formErrors = { ...setPrevActiveValidator(formErrors, item) };
            }
        });
        setFormData(formData);
        setFormErrors(formErrors);
    }
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
            let errorObj = validateField(
                fieldName, fieldValue, fields, true, formErrors, formData
            );
            if (!errorObj[fieldName].activeValidator.message && errorObj[fieldName].isValid) {
                setlinkBtnDisable(false)
            } else {
                setlinkBtnDisable(true)
            }
            setFormErrors(errorObj)
            // if (!formErrors[fieldName].activeValidator.message && formErrors[fieldName].isValid) {
            //     setlinkBtnDisable(false)
            // } else {
            //     setlinkBtnDisable(true)
            // }

        }
        formDataSet = {
            ...formData,
            ...fields
        };
        setFormData(formDataSet);

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

        });
        setFormErrors(errorObj)
        // let isFormValid = validateForm();
        //checkLoginData();

        submitEmail();
    }

    const submitEmail = () => {
        let isValid = validateForm(formErrors);
        if (isValid) {
            setLoader(true)
            const saveJSON = { ...formData }
            validateUserName({ "verify_user": saveJSON.emailaddress }).then(data => {
                if (data.statusCode === 200) {
                    var html = externallink.emailBody.html
                    var loc = html.indexOf(":");
                    var hashLoc = html.indexOf("#");
                    let emailId = encryptData(saveJSON.emailaddress);
                    var link = process.env.REACT_APP_DOMAIN_URL+'/'+externallink.emailBody.redirectURI + "?" + emailId+ "&reset";

                    html = html.substring(0, loc) + `<a  style="padding: 8px 12px; border: 1px solid grey; background-color: #A9A9B0; font-size: 14px; color: #000;text-decoration: none;font-weight:bold;display: inline-block;" href=${link}>Reset Password</a><br>` + html.substring(hashLoc + 1, html.length) + link;

                    const emailLoad = {
                        "to": [saveJSON.emailaddress],
                        "from": "vijay.krishnan@barrelfuel.com",
                        "subject": externallink.emailBody.title,
                        "text": externallink.emailBody.paragraph,
                        "html": html
                    }

                    operatorFboSendMail(emailLoad).then(res => {

                        if (res.data[0].statusCode == 202) {
                            setLoader(false)
                            setModalContent(externallink.serviceMessage.successContent)
                            let auditPayload = {"ModuleName":"Account",
                                                "TabName":"Account",
                                                "Activity":"Sent forget password link to "+saveJSON.emailaddress,
                                                "ActionBy":saveJSON.emailaddress,
                                                "Role":"null",
                                                "Organization":"null"
                                            }
                            saveAuditLogData(auditPayload, dispatch)
                            setShowModal(true);
                            setSuccessPopup(true);
                        }
                    });
                } else {
                    setModalContent(externallink.serviceMessage.emailNotFound)
                    setShowModal(true);
                    setSuccessPopup(false);
                    setLoader(false)

                }
            })


        } else {
            setModalContent(externallink.serviceMessage.mandatoryField)
            setShowModal(true);
            setLoader(false)
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
        // errorObj = validateField(
        //     fieldName, fieldValue, fields, true, formErrors, formData
        // );
        // if (!errorObj[fieldName].activeValidator.message && errorObj[fieldName].isValid) {
        //     setlinkBtnDisable(false)
        // } else {
        //     setlinkBtnDisable(true)
        // }
        // setFormErrors(errorObj)
        formDataSet = {
            ...formData,
            ...fields
        };
        setFormData(formDataSet);
    }
    const handleRedirect = () => {
        setShowModal(false)
        navigate('/login');
    }
    const customErrorSuccesPopup = (btnText) => {

        return (
            <CustomModal
                show={showModel}
                onHide={!successPop ? () => setShowModal(false) : () => handleRedirect()}
                modelBodyContent={modalContent}
                buttonText={btnText}
            />
        )
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
                            value={formData[field.name]}
                            maxLength={field.maxLength}
                            minLength={field.minLength}
                            /* ShowLink={true}
                            HelpText={externallink.helpLink} */
                            ShowToolTip={true}
                            passTooltip={externallink.helpLink}
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
    return (
        <div className={`d-flex d-flex-row login-section bf-login-mobile-container ${showModel ? 'bf-show-model-blr' : ''}`}>
            <div className="w-50p login-form d-flex align-items-center d-flex-column">
                <Navbar.Brand href={"./"}>
                    <img src={logo} alt="Barrel Fuel Logo" className='login-logo' />
                </Navbar.Brand>
                <Nav.Link href={'./'} className='bf-home-anchor'>Home</Nav.Link>
                <MobileHeader name="Password Reset" />
                <Form className='bf-forgot-password'>
                    <h1 className='d-flex align-items-center justify-content-center bf-heading bf-relative'>
                        <Nav.Link href="./login" className='bf-mobile-back-nav-acc'>
                            <img src={CollapseMenuIcon} />
                        </Nav.Link> 
                        {jsonData && jsonData.content && jsonData.content.forgotData && jsonData.content.forgotData.content && jsonData.content.forgotData.content.passwordHeadingOne && jsonData.content.forgotData.content.passwordHeadingOne.headline && jsonData.content.forgotData.content.passwordHeadingOne.headline.text}
                    </h1>

                    {
                        primaryFields && primaryFields.map((ele, i) => {
                            return getFormFields(ele, i)
                        })
                    }
                    {
                        externallink && externallink.loginBtn &&
                        <Form.Group
                            as={Col}
                            className="d-grid gap-2 mb-5 bf-forgotpw-buttons"
                        >
                            {! loader ?
                            <Button variant="dark"
                                className="bf-btn-login bf-btn-login-imp"
                                type="submit"
                                disabled={linkBtnDisable}
                                onClick={(e) => handleClick(e, externallink.loginBtn)}>
                                {externallink.loginBtn.fieldLabel}
                            </Button>:<Loader height='auto'/>
                            }
                        </Form.Group>
                    }
                    {
                        externallink && externallink.modalContent && customErrorSuccesPopup(externallink.modalContent.modalBtn)
                    }
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
    )
}

export default ForgetPassword;