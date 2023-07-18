import { useEffect, useState } from 'react';
import { Button, Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import ButtonComponent from '../../../components/button/button';
import { getFieldIsValid, phoneValidation } from '../../../controls/validations';
import Input from '../../../components/input/input';
import CustomModal from '../../../components/customModal/customModal';
import { bfaImageService, saveContactDetails } from '../../../actions/BFAServices/BFAImageService';
import { operatorFboSendMail, } from '../../../actions/OperatorFboService/operatorFboService';
const ContactDetails = (props) => {
    let contactScreenDetails = props.landingScreen;
    const [contactDetails, setContactDetails] = useState({})
    const [formErrors, setformErrors] = useState({});
    const [formdata, setformdata] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);
    const [modalText, setModalText] = useState("");
    const [modalShow, setModalShow] = useState(false);
    const [imageURL, setImageURL] = useState([]);
    const [loading, setLoading] = useState(true);
    let payload = [];

    useEffect(() => {
        payload.push(contactScreenDetails.landingScreen[0].imageDetails)
        bfaImageService(payload).then(response => {
            contactScreenDetails.landingScreen[0].imageDetails = response.data[0].url;
            setImageURL(response.data[0].url);
            setLoading(false)
            setContactDetails(contactScreenDetails)
        })
    }, []);

    useEffect(() => {
        if (Object.keys(contactDetails).length !== 0)
            setInitialState()
    }, [contactDetails])

    const setInitialState = () => {
        const contactData = contactDetails.contactFormDetails
        const formData = {};
        let formErrors = {};
        const fieldTypeArr = ['input'];

        contactData && contactData.forEach((item) => {
            if (fieldTypeArr.includes(item.type.toLowerCase())) {
                formData[item.name] = "";
                formErrors[item.name] = getFormErrorRules(item);
            }
        })
        setformErrors(formErrors);
        setformdata(formData);
        console.log("formErrors", formErrors)
        setIsLoaded(true)
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
    const onClickSubmit = (e, item) => {
        const fieldValidationErrors = {
            ...formErrors
        };

        Object.keys(fieldValidationErrors).forEach((fieldName, index) => {
            validateField(
                fieldName,
                formdata[fieldName],
                { [fieldName]: formdata[fieldName] }
            );
        });
        let isValid = validateForm();
        console.log('name value ', document.getElementsByName('name')[0].value);
        let name = document.getElementsByName('name')[0].value;
        let emailAddress = document.getElementsByName('emailaddress')[0].value;
        let phoneNo = document.getElementsByName('phoneNo')[0].value;
        let msgText = document.getElementsByName('msgTxt')[0].value;

        const emailLoad = {
            "to": [emailAddress],
            "from": contactScreenDetails.emailBody.fromEmailId,
            "subject": contactScreenDetails.emailBody.title,
            "text": msgText,
            "html": msgText
        }

        if (isValid) {
            let payload = {
                "name": name,
                "email": emailAddress,
                "phoneNumber": phoneNo,
                "message": msgText
            }
            saveContactDetails(payload).then(response => {
                if (response != undefined) {
                    operatorFboSendMail(emailLoad);
                }
            });

            setModalText(contactDetails.modal.Success.text)
            document.getElementsByName('msgTxt')[0].value = ''
            document.getElementById('root').style.filter = 'blur(5px)'
            setModalShow(true);
        }
    }
    const closeModal = () => {
        setModalShow(false)
        document.getElementById('root').style.filter = 'none';
        setModalText("");
        setInitialState();
    }
    const successModal = () => {
        setModalShow(false)
        setModalText("")
        document.getElementById('root').style.filter = 'none';
        setInitialState();
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
        console.log(fieldValidationErrors)
    }
    const onHandleChange = (e, field, index, flag) => {
        //let formDataSet = {};
        let target = e.target;
        let fieldName, fieldValue;
        if (field.name =="name") {
            target.value = target.value.replace(/[^a-z]/gi, '')
          }
        if (field.validations) {
            for (var i = 0; i < field.validations.length; i++) {
                if (field.validations[i].validation === 'CheckUSPhone') {
                    e.target.value = phoneValidation(e.target.value);
                }
            }
        }

        //if (field.name != "DocumentUpload") {
        fieldName = target.name;
        fieldValue = target.value;
        let fields = {};
        fieldValue = fieldValue.trim()

        fields[fieldName] = fieldValue;
        validateField(fieldName, fieldValue, fields, index, true);
        let formData = {
            ...formdata,
            ...fields
        };
        setformdata(formData);
        //}
    }
    const onHandleBlur = (e, field) => {
        let target = e.target
        let formdataset = { ...formdata }
        const fields = {};
        const errorData = {
            ...formErrors
        };
        formdataset[field.name] = e.target.value;
        setformdata(formdataset)
        // setTimeout(()=>{
        //setformdata(formdataset) 
        // },1500)  
    }
    const getDetails = item => {
        switch (item.type.toUpperCase()) {
            case 'HEADING':
                return (
                    <div className='bf-contact-details-data'>
                        <span className='bf-contact-heading'>{item.text}</span>
                    </div>
                );
            case 'INFO':
                return (
                    <div className='bf-contact-details-data'>
                        <span className='bf-contact-info'>{item.text}</span>
                    </div>
                );
            case 'INPUT':
                return (<Input
                    disabled={item.disable && props.disable}
                    colWidth={item.styles ? item.styles.colWidth : ""}
                    Type={item.type}
                    Label={item.label}
                    data-label={item.label}
                    value={item.label}
                    onkeyDown={true}
                    styles={item.styles}
                    Placeholder={item.placeholder}
                    isRequred={item.isRequired}
                    Name={item.name}
                    handleChange={(e) => onHandleChange(e, item)}
                    handleBlur={(e) => onHandleBlur(e, item)}
                    formDataSet={formdata ? formdata[item.name] : ""}
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
                    }
                />);
            case 'TEXTAREA':
                return (
                    <InputGroup>
                        <Form.Control
                            as="textarea"
                            aria-label="With textarea"
                            name={item.name}
                            placeholder={item.placeholder}
                        />
                    </InputGroup>
                );
            case 'BUTTON':
                return (
                    <div className='d-flex align-items-center justify-content-center bf-submit-button'>
                        <ButtonComponent
                            Label={item.label}
                            Type={item.type}
                            className={item.styles.className}
                            variant={item.variant}
                            handleClick={(e) => onClickSubmit(e, item)} />
                    </div>
                );
        }
    }

    return (<>{isLoaded && <>
        <div className='bf-contact-landing-screen'>
            {
                <img src={contactDetails.landingScreen[0].imageDetails} loading={"lazy"} alt="" />
            }
        </div>
        <div className='bf-contact-details d-flex d-flex-column align-items-center justify-content-center'>
            {
                contactDetails.contactDetails.map((item) =>
                    getDetails(item)
                )
            }
        </div>
        <Row className='d-flex d-flex-column align-items-center justify-content-center bf-contact-details'>
            <div className='bf-contact-details col-md-5'>
                {
                    contactDetails.contactFormDetails.map((item) =>
                        getDetails(item)
                    )
                }
            </div>
        </Row>
        <CustomModal
            show={modalShow}
            onHide={() => successModal()}
            close={() => closeModal()}
            hide={() => closeModal()}
            size="lg"
            modelBodyContent={modalText}
            buttonText={contactDetails.modal.Success.button}
        />
    </>
    }
    </>
    )
}

export default ContactDetails;