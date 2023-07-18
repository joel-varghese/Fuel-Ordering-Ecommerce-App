import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Input from '../input/input';
import ButtonComponent from '../button/button';
import { ButtonGroup } from 'react-bootstrap';
import '../../components/account/company.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import CustomModal from '../customModal/customModal';
import Subheading from '../subHeading/subHeading';
import Loader from '../loader/loader';
import { validateField, getFormErrorRules, getPasswordStrength, matchPassword, validateForm } from '../../controls/validations';
import { Storage } from '../../controls/Storage';
import { useSelector } from 'react-redux';
import Select from '../select/select';
  
function ProfileDetails(props) {
    const [formData, setFormData] = useState({});
    const [formDataSet, setformDataSet] = useState({});
    const [formFieldData, setFormFieldData] = useState({});
    const [fieldList, setFieldList] = useState([]);
    const [formErrors, setFormErrors] = useState({});
    const [formFieldErrors, setFormFieldErrors] = useState([]);
    const [disable, setdisable] = useState(true);
    const [enable, setEnable] = useState(props.disableFields)
    const [modalShow, setModalShow] = useState(false);
    const [profileData, setProfileData] = useState();
    const [isBusy, setBusy] = useState(true);
    const [show, setShow] = useState(false);
    const [userType, setUserType]=useState('')
    const [isSuccess, setIsSuccess] = useState(false);
    const [modalText, setModalText] = useState();
    let navigate = useNavigate();
    const { state } = useLocation();
    const accountHomeReducer = useSelector((state) => state.accountHomeReducer);
    const selectedUser = accountHomeReducer && accountHomeReducer.selectedUser && accountHomeReducer.selectedUser.user ? accountHomeReducer.selectedUser.user : Storage.getItem('userType').toLowerCase();
    const dashboardReducer = useSelector((state) => state.dashboardReducer)
    const profileD = dashboardReducer && dashboardReducer.profileData && dashboardReducer.profileData.data
    const commonReducer = useSelector(state => state.commonReducer);
    const loggedInUserType = commonReducer && commonReducer.loggedInUserType && commonReducer.loggedInUserType.data;
    useEffect(() => {
        let userType = Storage.getItem('userType')? Storage.getItem('userType'): ""
        setUserType(userType)
        setFieldList(props.fieldList)
        let profileDetails = props.profileData
        // let fieldData = {
        //     firstName: profileData && profileData.firstName && profileData.firstName,
        //     middleName: profileData && profileData.middleName && profileData.middleName,
        //     lastName: profileData && profileData.lastName && profileData.lastName,
        //     roleType: profileData && profileData.roleType && profileData.roleType,
        //     levelOfAccess: profileData && profileData.levelOfAccess && profileData.levelOfAccess,
        //     location: profileData && profileData.location && profileData.location,
        //     companyName: profileData && profileData.companyName && profileData.companyName
        // }
        setEnable(props.disableFields)
        setProfileData(profileD && profileD)
        setInitialState(props.fieldList);
        setBusy(false);
        setdisable(true)
    }, [profileD]);

    const getFormErrorRules = (item) => {
        return {
            isValid: item.isRequired ?  (item.defaultValue ? true : false): true,
            isTouched: false,
            activeValidator: {},
            validations: item.validations,
            isRequired: item.isRequired,
            minLength: item.minLength,
            maxLength: item.maxLength
        };
    }
    const setInitialState = (adminAddUserData, isClear, isClearSubField) => {
        let details = {};
        let errDetails = {};
        let formdetails = [];
        let formFieldError = [];
        let response = profileD && profileD
        const fieldTypeArr = ['input', 'checkbox', 'select', 'multiselectcheckbox', 'radio'];
        adminAddUserData.length && adminAddUserData[0].sections.subSections.forEach((items) => {
            items.companyFieldsArray && items.companyFieldsArray.forEach((item, index) => {
                item.fields.forEach((item) => {
                    if (fieldTypeArr.includes(item.component.toLowerCase())) {
                        if(item.name == "levelOfAccess"){
                            if(loggedInUserType == "Barrel Fuel"){
                                if(response && response[item.name][0] === "Level 3 (Basic)"){
                                    details[item.name] =  "Basic"
                                }
                                else{
                                    details[item.name] =  "Admin"
                                }
                            } else {
                                details[item.name] = response && response[item.name][0].split("(")[0];
                            }
                        }else {
                            details[item.name] = response && response[item.name] !== 'null'? response[item.name]:"";
                        }
                        errDetails[item.name] = getFormErrorRules(item);
                        errDetails = { ...setPrevActiveValidator(errDetails, item, index) };
                        
                    }
                })
                formdetails = {...details}
                formFieldError = {...errDetails};

            })
        });

        setFormFieldData(formdetails);
        setFormFieldErrors(formFieldError);
        setFormData(formdetails);
        setformDataSet(formdetails)
        setFormErrors(formFieldError);
    }
    
    const setPrevActiveValidator = (curFormErrors, item, index) => {
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
    const handleChange = (e, field, index, flag) => {
        let target = e.target;
        let fieldName, fieldValue;
        let formData = {}
        let errorObj = {}
        props.enableSave()
        if (field.name === 'firstName' || field.name === 'lastName' || field.name === 'middleName' || field.name === 'homeBaseAirport') {
            target.value = target.value.replace(/[^a-z]/gi, '')
        }
        if (flag) {
            let fields = [];
            fields = JSON.parse(JSON.stringify(formFieldData));
            fieldName = target.name;
            fieldValue = target.value;
            fields[fieldName] = fieldValue;
            formData = {
                ...formDataSet,
                ...fields
            };
            setFormData(formData);
            setformDataSet(formData)
            setFormFieldData(formData)
            setProfileData(formData)

        }
        else {
            fieldName = target.name;
            fieldValue = target.value;
            let fields = {};
            fieldValue = fieldValue.trim()

            fields[fieldName] = fieldValue;
            errorObj = validateField(fieldName, fieldValue, fields, true, formErrors, flag);
            formData = {
                ...formDataSet,
                ...fields
            };
            setFormFieldData(fields);
            setFormData(formData);
            setformDataSet(formData)
            setFormFieldData(formData)
            setProfileData(formData)
            setFormErrors(errorObj);

            
        }
        props.getProfileDetails(formData,errorObj)
    }
    const handleBlur = (e, item, index) => {
        let formdData = {};
        let fields = {};
        let target = e.target;
        let fieldName, fieldValue;
        fieldName = target.name;
        fieldValue = target.value;
        fields[fieldName] = fieldValue;
        const errorObj = validateField(
            fieldName, fieldValue, fields, true, formErrors, formData
        );

        setFormErrors(errorObj);
        formdData = {
            ...formDataSet,
            ...fields
        }
        setFormData(formdData);
        setformDataSet(formdData)
        setProfileData(formData)
        props.getProfileDetails(formData,errorObj)
    }
    const validateForm = () => {
        let formValid = true;
        Object.keys(formFieldErrors).forEach((fieldname) => {
            if (!formFieldErrors[fieldname].isValid) {
                formValid = formFieldErrors[fieldname].isValid;
                // return formValid;
            }
        })
        return formValid;
    }
    
    const formSaveData = () => {
        let saveJson = {};
        let finalJson = {};
        let fieldData = JSON.parse(JSON.stringify(formFieldData));

        saveJson = {
            "service": "company",
        }
        return saveJson;
    }
    const handleClick = (e, item, index) => {
        if (item.name === "deactive") {
        }
        else {
            let isFormValid
            const fieldValidationErrors = {
                ...formErrors
            };
            Object.keys(formFieldData).forEach((fieldName) => {
                validateField(
                    fieldName,
                    formFieldData[fieldName],
                    { [fieldName]: formFieldData[fieldName] },
                    true,
                    formErrors, formData
                );
            })
            isFormValid = validateForm();
            if (isFormValid) {
                // let saveData = formSaveData();
                setdisable(true)
                
            }
            else {
                setModalText(fieldList.length && fieldList[0].sections.modal[0].mandatoryModal.paragraph)
                setShow(true);
            }
        }
    }
    const handleClose = () => {
        setShow(false);
        if (isSuccess) {
            setIsSuccess(false);
            navigate('/admin');
        }
    }

    const renderModal = (modal) => {
        let modalData = modalText;
        return (
            <CustomModal
                show={show}
                onHide={handleClose}
                modelBodyContent={modalData}
                buttonText={fieldList.length && fieldList[0].sections.modal[0].mandatoryModal.primaryButton.text}
            />
        );
    };
    const getOperatorFields2 = (item, index, flag) => {
        if(item.users.includes(userType)){
            switch (item.component.toUpperCase()) {
                case "INPUT":
                    return (<Input
                        colWidth={item.styles ? (selectedUser && selectedUser == "fbo" && item.styles.fboColWidth ? item.styles.fboColWidth : item.styles.colWidth) : ""}
                        Type={item.type}
                        Label={item.label}
                        data-label={item.label}
                        Name={item.name}
                        // id={item.id}
                        disabled={ !item.edit}
                        Placeholder={item.placeholder}
                        isRequred={item.isRequired ? item.isRequired : false }
                        maxLength={item.maxLength}
                        minLength={item.minLength}
                        tooltip={item.tooltip ? item.tooltip : null}
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
                                .errorMessage
                        }
                        formDataSet={formFieldData ? formFieldData[item.name] : ''}
                    />)
                case "SELECT":
                    return (<Select
                        colWidth={item.styles ? item.styles.colWidth : ""} 
                        Type={item.type} 
                        Label={item.label}
                        Placeholder={item.placeholder}
                        isRequred={item.isRequired}
                        dynamicSelect={item.dynamicSelect}
                        lookupReference={item.dynamicSelect ? item.lookupReference : null}
                        Options={item.options}
                        disabled= {disable ? item.disabled : !item.edit}
                        Name={item.name}
                        dependentField = {item.dependentField}
                        dependentFieldVal = { item.userRole ? (Storage.getItem('userType') ? Storage.getItem('userType') : ''):'' }
                        handleChange={(e)=>handleChange(e, item, index, flag)}
                        handleBlur={(e)=>handleBlur(e, item, index, flag)}
                        formDataSet={formFieldData ? formFieldData[item.name] : ''}
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
                        }
                        />)

                case "BUTTON":
                    return (<ButtonComponent
                        Label={item.label}
                        Type={item.type}
                        Name={item.name}
                        className={item.styles.className}
                        disabled={item.disabled && disable ? true : false}
                        handleClick={(e) => handleClick(e, item, index)} />)

                case "PARAGRAPH":
                    return (<><Subheading label={item.label} isAccessAble ={true} isEditable={false} EnableEdit={makeEditable} /></>)
            };
        }
    }

    const makeEditable = () => {
        setdisable(false)
    }
    const closeModal = () => {
        setModalShow(false)
    }
    const accept = () => {
        setModalShow(false)
    }

    const showNewCompanyPopup = () =>{
        setModalShow(true)
    }

    return (<>
        {isBusy ? (<Loader />) : (
            <div className='d-flex d-flex-row'>
                <div className=" login-form d-flex d-flex-column bf-width100p">
                    {fieldList[0].sections && fieldList[0].sections.subSections.map((item) => (<Row className='bf-mrgb-0'>
                        {item.companyFieldsArray && item.companyFieldsArray.map((item, index) => (<Row className='bf-mrgb-0'>
                            {item.fields.map((val) => {
                                return getOperatorFields2(val, index, false)
                            })}
                        </Row>))}
                    </Row>))}
                    {fieldList[0].sections.subSections.map((item) => (
                        <ButtonGroup>
                            {item.buttons && item.buttons.map((item) => (<>
                                {getOperatorFields2(item)}</>
                            ))}
                        </ButtonGroup>

                    ))}
                    {show ? renderModal() : null}
                </div>
            </div>)
        }
    </>);
}

export default ProfileDetails;