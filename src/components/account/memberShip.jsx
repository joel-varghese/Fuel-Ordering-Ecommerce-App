import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import logo from '../../assets/images/barrel_fuel_logo.png'
import Row from 'react-bootstrap/Row';
import Input from '../input/input';
import Select from '../select/select';
import Radio from '../radio/radio';
import { bfaJsonService } from '../../actions/BFAServices/BFAJsonService';
import ButtonComponent from '../button/button';
import MultiSelectCheckbox from '../multiSelect/multiSelectCheckbox';
import { ButtonGroup } from 'react-bootstrap';
import './company.scss';
import * as xlsx from "xlsx";
import { useLocation, useNavigate } from 'react-router-dom';
import CustomModal from '../customModal/customModal';
import { adminAddUserSave } from '../../actions/adminAddUserService/adminAddUserService';
import Subheading from '../subHeading/subHeading';
import { SendMailToUsers } from '../../services/commonServices';
import Loader from '../loader/loader';
import { accountCompanyEditService, accountCompanyDeactivateService, fetchCompanyDetails } from '../../actions/accountServices/accountCompanyService';
import Nav from 'react-bootstrap/Nav';
import { Storage, jsonStringify } from '../../controls/Storage';
function MembershipDetails(props) {
    const [formData, setFormData] = useState({});
    const [formFieldData, setFormFieldData] = useState([]);
    const [fieldList, setFieldList] = useState([]);
    const [formErrors, setFormErrors] = useState({});
    const [formFieldErrors, setFormFieldErrors] = useState([]);
    const [companyDetailsData, setCompanyDetailsData] = useState([]);
    const [operatorCheck, setoperatorCheck] = useState(false);
    const [disable, setdisable] = useState(true);
    let navigate = useNavigate();
    const { state } = useLocation();
    const { currentUserRole, storageOrgName } = state ? state : {};
    const restrictedFields = ['organizationName', 'userType'];

    let paylod = { 'blobname': 'company.json' }

    const [isBusy, setBusy] = useState(true);
    useEffect(() => {
        //  bfaJsonService(paylod).then(data => {
        //setJsonData();
        setFieldList(props.fieldList)
        setInitialState(props.fieldList);
        setCompanyDetailsData(props.companyData)
        setBusy(false);
        //});
    }, []);
    useEffect(() => {
        // bfaJsonService(paylod).then(data => {

        //setJsonData();
        
        
        setCompanyDetailsData(props.companyData)
        setInitialState(props.fieldList);
        


        // });
    }, [props.companyData]);
    /* useEffect(() => {
       //setInitialState(fboSignupList);
       bfaJsonService({"blobname":"addAdminUser.json"}).then(response=>{
           setInitialState(response.data.addAdminUserData);
           setFieldList(response.data.addAdminUserData)
           setBusy(false);
           
           /* setFieldList(fboSignupList.addAdminUserData)
           setBusy(false);
           setInitialState(fboSignupList.addAdminUserData); */
    //   })
    // },[]);  */

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
    const setInitialState = (adminAddUserData, isClear, isClearSubField) => {
        let formErrors = {};
        let data = {};
        let fields = [];
        let details = {};
        let errDetails = {};
        const formDataSet = {};
        let formdetails = [];
        let formFieldError = [];
        const fieldTypeArr = ['input', 'checkbox', 'select', 'multiselectcheckbox', 'radio'];
        adminAddUserData && adminAddUserData.length && adminAddUserData[0].sections.subSections.forEach((items) => {

            /*items.fields && items.fields.forEach((item) => {
                if (fieldTypeArr.includes(item.component.toLowerCase())) {
                    if (item.name === 'userType') {
                        if (currentUserRole != "bfAdmin") {
                            formDataSet[item.name] = currentUserRole;
                        }
                        else formDataSet[item.name] = formData && formData[item.name] ? formData[item.name] : item.defaultValue ? item.defaultValue : "";
                        (formDataSet[item.name] === "Operator") ? setoperatorCheck(true) : setoperatorCheck(false)
                    } else if (item.name === 'organizationName') {
                        if (currentUserRole != "bfAdmin") {
                            formDataSet[item.name] = storageOrgName;
                        }
                        else formDataSet[item.name] = isClear ? (item.defaultValue ? item.defaultValue : "") : formData && formData[item.name] ? formData[item.name] : item.defaultValue ? item.defaultValue : "";
                    } else {
                        formDataSet[item.name] = isClear ? (item.defaultValue ? item.defaultValue : "") : formData && formData[item.name] ? formData[item.name] : item.defaultValue ? item.defaultValue : "";
                    }
                    formErrors[item.name] = getFormErrorRules(item);
                    //formErrors = { ...setPrevActiveValidator(formErrors, item) };
                }
            })*/

            items.memberFieldsArray && items.memberFieldsArray.forEach((item, index) => {

                item.fields.forEach((item) => {
                    console.log("item", item.name)
                    if (fieldTypeArr.includes(item.component.toLowerCase())) {
                        details[item.name] = companyDetailsData && companyDetailsData[item.name] !== 'null'?companyDetailsData[item.name]:"";
                        errDetails[item.name] = getFormErrorRules(item);
                        if (isClear || isClearSubField) { }
                        else { errDetails = { ...setPrevActiveValidator(errDetails, item, index) } };
                    }
                })
                formdetails.push(JSON.parse(JSON.stringify(details)));
                formFieldError.push(JSON.parse(JSON.stringify(errDetails)));
            })
        });

        setFormFieldData(formdetails);
        setFormFieldErrors(formFieldError);
        setFormData(formDataSet);
        setFormErrors(formErrors);
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
    const updateResultJsonNames = (uploadData) => {
        let resultArray = [];
        let fieldArray = { "Email": "additionalUserMail", "Role": "additionalUserRole", "Level of Access": "additionalUserLevelAccess", "Location": "location" };

        uploadData.forEach(item => {
            let dummyOb = {};
            for (const property in item) {
                dummyOb[fieldArray[property]] = item[property]
            }
            resultArray.push(dummyOb);
        });
        
        let res = cancatinateRows(resultArray);
        return res;//resultArray //abc; 
    }

    const cancatinateRows = (data) => {
        const ObjecDataAt = {};
        for (let i = 0; i < data.length; i++) {
            let ObjKey = '';
            let value = [];
            let dummyOb = {}
            for (const property in data[i]) {
                if (property != 'location') {
                    ObjKey = ObjKey + `${property}|${data[i][property]}|`;
                } else {
                    dummyOb["value"] = data[i][property];
                    dummyOb["label"] = data[i][property];
                    value.push(dummyOb);
                    
                }
            }
            if (ObjecDataAt[ObjKey]) {
                ObjecDataAt[ObjKey] = [...ObjecDataAt[ObjKey], ...value]
            } else {
                ObjecDataAt[ObjKey] = value;
            }
        }
        
        const updatedArray = []
        for (const property in ObjecDataAt) {
            let data = property.split('|');
            const updatedObj = {};
            for (let j = 0; j < data.length - 1; j++) {
                updatedObj[data[j]] = data[j + 1];
                j++;

            }
            updatedObj['location'] = ObjecDataAt[property];
            updatedArray.push(updatedObj);

        }
        
        return updatedArray;
    }
    const handleChange = (e, item, index, flag) => {
        let formDataSet = {};
        let fields;
        let target = e.target;
        let fieldName, fieldValue;
        if (item.type == "file") {
            //e.preventDefault();
            let fileData = target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target.result;
                const workbook = xlsx.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const fileJson = xlsx.utils.sheet_to_json(worksheet);
                
                if (fileJson.length) {
                    let updatedJson = updateResultJsonNames(fileJson)
                    addMore(updatedJson.length);
                    //let updatedFormData = [...formFieldData,...updatedJson]
                    setFormFieldData(updatedJson);
                }
            };
            reader.readAsArrayBuffer(e.target.files[0]);
        }

        if (flag) {
            fields = [];
            fields = JSON.parse(JSON.stringify(formFieldData));
            if (item.type == "multiSelectCheckbox") {
                fieldName = item.name;
                fieldValue = e.length ? e : null;
                fields[index][item.name] = fieldValue;
            } else {
                fieldName = target.name;
                fieldValue = target.value;
                fields[index][fieldName] = fieldValue;
                
            }
            if (item.name === 'additionalUserMail') {
                validateField(fieldName, fieldValue, fields, index, flag);
            }
            setFormFieldData(fields);
        }
        else {
            fieldName = target.name;
            fieldValue = target.value;
            fields = {};
            fieldValue = fieldValue.trim()
            if (target.type === 'radio') {
                fieldName = item.name;
                if (fieldValue == "Operator")
                    setoperatorCheck(true);
                else
                    setoperatorCheck(false);

            }
            fields[fieldName] = fieldValue;
            formDataSet = {
                ...formData,
                ...fields
            };
            setFormData(formDataSet);
        }


        //validateField(fieldName, fieldValue, fields, true);

    }
    const handleBlur = (e, item, index) => {
        let formDataSet = {};
        const fields = {};
        /* let formValid = this.state.formValid;
        const fieldValidationErrors = {...this.state.formErrors}; */
        let target = e.target;
        let fieldName, fieldValue;
        fieldName = target.name;
        fieldValue = target.value;
        fields[fieldName] = fieldValue;
        // validateField(
        // fieldName, fieldValue, fields, true
        // );

    }
    const validateField = (fieldName, value, fields, index, flag) => {
        const fieldValidationErrors = {
            ...formErrors
        };
        const NewFieldValidationErrors = [
            ...formFieldErrors
        ];
        let fieldValidationError = null;
        //const fieldKey = Object.keys(fields)[0];
        if (flag) {
            fieldValidationError =
                formFieldErrors[index][fieldName];
        } else {
            fieldValidationError = fieldValidationErrors[fieldName];
        }
        //fieldValidationError = fieldValidationErrors[fieldName];

        // if (isTouched !== undefined) {
        //     fieldValidationError.isTouched = isTouched;
        // }

        let validationObj = {};
        validationObj = checkValidationByValidationTypes(value, fieldValidationError, fieldName);
        if (flag) {
            NewFieldValidationErrors[index][fieldName] = {
                ...validationObj.fieldValidationError
            };
            let errcount = validationObj.errcount;
            if (!errcount) {
                NewFieldValidationErrors[index][fieldName].isValid = true;
                NewFieldValidationErrors[index][fieldName].activeValidator = {};
            } else {
                NewFieldValidationErrors[index][fieldName].isValid = false;
            }
            setFormFieldErrors(NewFieldValidationErrors);
        } else {
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
            setFormErrors(fieldValidationErrors);

        }
        // customValidation(
        //     fieldName, value, validationObj,index
        // );
    }

    const checkValidationByValidationTypes = (value, fieldValidationError, fieldName) => {

        let fieldValidations = fieldValidationError.validations;
        let errcount = 0;
        if (fieldValidations && fieldValidations.length) {
            for (let i = 0; i < fieldValidations.length; i++) {

                let validationType = fieldValidationError.validations[i].validation;
                if (validationType === 'IsMandatory') {
                    if (!value) {
                        errcount++;
                        fieldValidationError.activeValidator = fieldValidationError.validations[i];
                    }
                } else if (validationType === "CheckRegex") {
                    if (!new RegExp(fieldValidationError.validations[i].validateRule).test(value)) {
                        errcount++;
                        fieldValidationError.activeValidator = fieldValidationError.validations[i];
                    }
                }
                else if (validationType === 'CheckBFDomain') {
                    if (new RegExp(fieldValidationError.validations[i].validateRule).test(value)) {
                        let eSplit = value.split('@');
                        if (eSplit.length && eSplit[1]) {
                            let internalSplit = eSplit[1].split('.');
                            if (internalSplit[0] == "barrelfuel") {

                            }
                            else {
                                errcount++;
                                fieldValidationError.activeValidator = fieldValidationError.validations[i];
                            }
                        }
                    }
                }
                if (errcount > 0) {
                    return {
                        fieldValidationError: fieldValidationError,
                        errcount: errcount
                    };
                }
            }
        }
        return {
            fieldValidationError: fieldValidationError,
            errcount: errcount
        };
    }
    const customValidation = (
        fieldName, value, validationObj, index
    ) => {
        const fieldValidationErrors = {
            ...formErrors
        };
        const NewFieldValidationErrors = [
            ...formFieldErrors
        ];
        let errcount = validationObj.errcount;
        if (!errcount) {
            fieldValidationErrors[fieldName].isValid = true;
            fieldValidationErrors[fieldName].activeValidator = {};
        } else {
            fieldValidationErrors[fieldName].isValid = false;
        }
        setFormErrors(fieldValidationErrors);
    }
    const validateForm = () => {
        let formValid = true;
        // const formErrorKeys = Object.keys(formErrors);
        // for (let i = 0; i < formErrorKeys.length; i++) {
        //     const fieldName = formErrorKeys[i];
        //     if (!formErrors[fieldName].isValid) {
        //         formValid = formErrors[fieldName].isValid;
        //         return formValid;
        //       }

        // }
        formFieldErrors.map((val, index) => {
            Object.keys(val).forEach((fieldname) => {
                if (!formFieldErrors[index][fieldname].isValid) {
                    formValid = formFieldErrors[index][fieldname].isValid;
                    return formValid;
                }
            })
        })
        return formValid;
    }
    const removeButton = (e, item, index) => {
        let fieldArr = fieldList;
        fieldArr[0].sections.subSections[2].memberFieldsArray.splice(index, 1);
        setFieldList(fieldArr);
        let updatedFormFieldData = formFieldData;
        updatedFormFieldData.splice(index, 1)
        setFormFieldData(updatedFormFieldData);
        setInitialState(fieldArr);
    }

    const formSaveData = () => {
        let saveJson = {};
        let finalJson = {};
        let fieldData = JSON.parse(JSON.stringify(formFieldData));
        saveJson = {
            "service": "company",
            "json": {

                "organizationId": Storage.getItem("organizationId"),

                "organizationName": Storage.getItem("organizationName"),

                "serviceFee": fieldData[0].serviceFee,

                "membershipFee": fieldData[0].membershipfee,

                "membershipType": fieldData[0].membershiptype,

                "mailingAddressLine": fieldData[0].mailingAddressLine

                }
        }
        return saveJson;
    }

    const sendEmails = () => {
        let sendEmailObj = fieldList.length && fieldList[0].sections.emailBody;
        var html = sendEmailObj.html;
        var loc = html.indexOf(":");
        formFieldData.forEach(item => {
            var activeLink = "<a href='https://www.devinfbf.devinfarch.com/bfhome/user-registration?" + item.additionalUserMail + "' target='_blank'>" + "link" + "</a>";
            let html1 = html.substring(0, loc + 1) + item.additionalUserMail + html.substring(loc + 1, html.length) + activeLink;
            let data = {
                to: item.additionalUserMail,
                from: "vijaykrishnan@infinite.com",
                subject: sendEmailObj.title,
                text: sendEmailObj.paragraph,
                html: html1
            }
            SendMailToUsers(data);
        })

    }

    const handleClick = (e, item, index) => {
        
        if (item.name === "clear") {
            setInitialState(fieldList, true);
        } else if (item.name === "addNew") {
            addMore();
        }
        else if (item.name === "remove") {
            removeButton(e, item, index);
        }
        else {
            let isFormValid
            const fieldValidationErrors = {
                ...formErrors
            };


            formFieldData.forEach((val, index) => {
                Object.keys(val).forEach((fieldName) => {
                    validateField(
                        fieldName,
                        formFieldData[index][fieldName],
                        { [fieldName]: formFieldData[index][fieldName] },
                        index,
                        true
                    );
                })
            })
            isFormValid = validateForm();
            if (isFormValid) {
                let saveData = formSaveData();
                accountCompanyEditService(saveData).then(res => {
                    if (res.data.accountRegister) {
                        if (res.data.accountRegister == "SUCCESS") {
                            setIsSuccess(true);
                            setModalText(fieldList.length && fieldList[0].sections.modal[0].successModal.paragraph)
                            //sendEmails();
                            setdisable(true)
                        }
                        else {
                            setModalText(res.data.accountRegister);
                        }
                    }
                    else {
                        setModalText("server error");
                    }
                    setShow(true);

                })
            }
            else {
                setModalText(fieldList.length && fieldList[0].sections.modal[0].mandatoryModal.paragraph)
                setShow(true);
            }
        }

    }

    const memberHandleClick = (e, item, index) => {
        
        if (item.name === "clear") {
            setInitialState(fieldList, true);
        } else if (item.name === "addNew") {
            addMore();
        }
        else if (item.name === "remove") {
            removeButton(e, item, index);
        }
        else {
            let isFormValid
            const fieldValidationErrors = {
                ...formErrors
            };


            formFieldData.forEach((val, index) => {
                Object.keys(val).forEach((fieldName) => {
                    validateField(
                        fieldName,
                        formFieldData[index][fieldName],
                        { [fieldName]: formFieldData[index][fieldName] },
                        index,
                        true
                    );
                })
            })
            isFormValid = validateForm();
            if (isFormValid) {
                let saveData = formSaveData();
                adminAddUserSave(saveData).then(res => {
                    if (res.data.accountRegister) {
                        if (res.data.accountRegister == "SUCCESS") {
                            setIsSuccess(true);
                            setModalText(fieldList.length && fieldList[0].sections.modal[0].successModal.paragraph)
                            sendEmails();

                        }
                        else {
                            setModalText(res.data.accountRegister);
                        }
                    }
                    else {
                        setModalText("server error");
                    }
                    setShow(true);

                })
            }
            else {
                setModalText(fieldList.length && fieldList[0].sections.modal[0].mandatoryModal.paragraph)
                setShow(true);
            }
        }

    }

    const [show, setShow] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [modalText, setModalText] = useState();
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
    const addMore = (numberOfObjs) => {
        let usedField = fieldList[0].sections.subSections[2].memberFieldsArray
        const addNewFiled = {}
        const temp = JSON.parse(JSON.stringify(fieldList[0].sections.subSections[2].memberFieldsArray[usedField.length - 1].fields));

        addNewFiled['fields'] = temp
        let list = fieldList
        if (numberOfObjs) {
            for (let i = 0; i < (numberOfObjs - 1); i++) {
                list[0].sections.subSections[2].memberFieldsArray.push(addNewFiled);
            }
        }
        else list[0].sections.subSections[2].memberFieldsArray.push(addNewFiled);

        setFieldList(list)
        numberOfObjs ? setInitialState(list, false, true) : setInitialState(list)
        

    }

    const removeFormData = (item, index, flag) => {
        let fields = [];
        fields = [...formFieldData];
        let fieldName = item.name;
        fields[index][fieldName] = "";
        setFormFieldData(fields);
        //validateField(fieldName, "", fields,index,flag);
    }

    
    const getOperatorFields2 = (item, index, flag) => {
        switch (item.component.toUpperCase()) {
            case "INPUT":
                return (<Input
                    colWidth={item.styles ? item.styles.colWidth : ""}
                    Type={item.type}
                    Label={item.label}
                    Name={item.name}
                    id={item.id}
                    disabled={item.disabled && disable ? true : false}
                    Placeholder={item.placeholder}
                    isRequred={item.isRequired}
                    maxLength={item.maxLength}
                    minLength={item.minLength}
                    handleChange={(e) => handleChange(e, item, index, flag)}
                    handleBlur={(e) => handleBlur(e, item, index, flag)}
                    fieldError={
                        formFieldErrors && formFieldErrors.length &&
                        formFieldErrors[index][item.name] && !formFieldErrors[index][item.name].isValid/* 
                    && (
                        formErrors[item.name].isTouched
                    ) */
                    }
                    errorMessage={
                        formFieldErrors && formFieldErrors.length &&
                        formFieldErrors[index][item.name] && formFieldErrors[index][item.name]
                            .activeValidator
                            .errorMessage
                    }
                    formDataSet={formFieldData && formFieldData.length ? formFieldData[index][item.name] : item.defaultValue ? item.defaultValue : ''}
                />)
            case "SELECT":
                return (<Select
                    colWidth={item.styles ? item.styles.colWidth : ""}
                    Type={item.type}
                    Label={item.label}
                    Name={item.name}
                    Placeholder={item.placeholder}
                    isRequred={item.isRequired}
                    maxLength={item.maxLength}
                    minLength={item.minLength}
                    dynamicSelect={item.dynamicSelect}
                    tooltip={item.tooltip}
                    lookupReference={item.dynamicSelect ? item.lookupReference : null}
                    handleChange={(e) => handleChange(e, item, index, flag)}
                    handleBlur={(e) => handleBlur(e, item, index, flag)}
                    removeFormData={() => removeFormData(item, index, flag)}
                    dependentField={item.dependentField}
                    dependentFieldVal={formData ? formData[item.dependentField] : null}
                    fieldError={
                        formFieldErrors && formFieldErrors.length &&
                        formFieldErrors[index][item.name] && !formFieldErrors[index][item.name].isValid/* 
                    && (
                        formErrors[item.name].isTouched
                    ) */
                    }
                    errorMessage={
                        formFieldErrors && formFieldErrors.length &&
                        formFieldErrors[index][item.name] && formFieldErrors[index][item.name]
                            .activeValidator
                            .errorMessage
                    }
                    formDataSet={formFieldData && formFieldData.length ? formFieldData[index][item.name] : item.defaultValue ? item.defaultValue : ''} />)
            case "BUTTON":
                return (<ButtonComponent
                    Label={item.label}
                    Type={item.type}
                    Name={item.name}
                    className={item.styles.className}
                    disabled={item.disabled && disable ? true : false}
                    handleClick={(e) => handleClick(e, item, index)} />)
            case "MULTISELECTCHECKBOX":
                return (<MultiSelectCheckbox
                    Label={item.label}
                    Name={item.name}
                    colWidth={item.styles ? item.styles.colWidth : ''}
                    dynamicSelect={item.dynamicSelect}
                    lookupReference={item.dynamicSelect ? item.lookupReference : null}
                    handleChange={(e) => handleChange(e, item, index, flag)}
                    checked={item.name === 'location' && operatorCheck ? true : false}
                    handleBlur={(e) => handleBlur(e, item, index, flag)}
                    dependentField={item.dependentField}
                    dependentFieldVal={formData ? formData[item.dependentField] : null}
                    fieldError={
                        formFieldErrors && formFieldErrors.length &&
                        formFieldErrors[index][item.name] && !formFieldErrors[index][item.name].isValid/* 
                    && (
                        formErrors[item.name].isTouched
                    ) */
                    }
                    errorMessage={
                        formFieldErrors && formFieldErrors.length &&
                        formFieldErrors[index][item.name] && formFieldErrors[index][item.name]
                            .activeValidator
                            .errorMessage
                    }
                    formDataSet={formFieldData && formFieldData.length ? formFieldData[index][item.name] : item.defaultValue ? item.defaultValue : ''}
                />)
            case "PARAGRAPH":
                return (<><Subheading label={item.label} isEditable={true} EnableEdit={makeEditable} /></>)

        };
    }
    const makeEditable = () =>{
        setdisable(false)
    }
    
    return (<>
        {isBusy ? (<Loader />) : (
            <div className='d-flex d-flex-row'>
                <div className=" login-form d-flex d-flex-column">

                    
                        {
                            fieldList && fieldList.length > 0 && fieldList[0].sections && fieldList[0].sections.subSections.map((item) => (<Row className='bf-mrgb-0'>
                                {/* {item.fields && item.fields.map((field) => {
                                if(currentUserRole == "bfAdmin") {
                                    return getOperatorFields(field,false)
                                } else {
                                    if(!restrictedFields.includes(field.name)) {
                                        return getOperatorFields(field,false)
                                    } 
                                }
                                
                            })} */}
                                {item.memberFieldsArray && item.memberFieldsArray.map((item, index) => (<Row className='bf-mrgb-0'>
                                    {
                                        item.fields.map((val) => {

                                            if (val.type != "button") {
                                                return getOperatorFields2(val, index, true)
                                            } else {
                                               

                                                return (

                                                    <ButtonGroup>

                                                        {getOperatorFields2(val)}

                                                    </ButtonGroup>
                                                )
                                            }
                                        })
                                    }
                                    

                                </Row>))}
                            </Row>

                            ))
                        }
                        
                        {/* <div className=" gap-2 mb-5">
                    <ButtonGroup>
                        {fieldList[0].sections.buttons.map((item) => (<>
                                {getOperatorFields(item)}</>
                                
                            ))}
                    </ButtonGroup>
                </div> */}
                        {show ? renderModal() : null}


                        {/* <div className="d-grid gap-2 mb-5">
                    <ButtonGroup>
                        <Button className="bf-btn-login" variant="primary" type="submit">
                            Create User
                        </Button>
                        <Button className="bf-btn-login" variant="primary" type="submit">
                            Clear
                        </Button>
                    </ButtonGroup>
                </div> */}
                    
                </div>

            </div>)}
    </>
    );
}

export default MembershipDetails;