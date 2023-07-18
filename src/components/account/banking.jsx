import React, { useState,useEffect } from 'react';
import Input from '../input/input';
import Select from '../select/select';
import Radio from '../radio/radio';
import { bfaJsonService } from '../../actions/BFAServices/BFAJsonService';
import ButtonComponent from '../button/button';
import MultiSelectCheckbox from '../multiSelect/multiSelectCheckbox';
import './company.scss';
import * as xlsx from "xlsx";
import { useLocation, useNavigate } from 'react-router-dom';
import CustomModal from '../customModal/customModal';
import EditFormModal from '../customModal/editModal';
import { adminAddUserSave } from '../../actions/adminAddUserService/adminAddUserService';
import Subheading from '../subHeading/subHeading';
import { SendMailToUsers } from '../../services/commonServices';
import Loader from '../loader/loader';
import CompanyDetails from './companyDetails';
import MembershipDetails from './memberShip';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import BFTable from '../table/table'
import { Button } from 'react-bootstrap';
import { flightInformationService } from '../../actions/tailNumberService/tailNumberService';
import {saveAuditLogData } from '../../actions/auditLog/auditLogActions';
import { useDispatch, useSelector } from 'react-redux';

function Banking() {
    
    const [fieldList, setFieldList] = useState(null);
    const {state} = useLocation();
    const { currentUserRole, storageOrgName } = state ? state:{};
    const restrictedFields = ['organizationName', 'userType'];
    const [modalShow, setModalShow] = useState(false);
    const [formErrors, setformErrors] = useState({});
    const [isBtnValidate,setbtnValidate]=useState(false);
    const [disable,setdisable]=useState(false);
    const [editmodalShow, seteditModalShow] = useState(false);
    const [modalText, setModalText] = useState("");
    const [formdata, setformdata] = useState({});
    const [addNew, setaddNew] = useState(false);
    const [serviceBusy, setServiceBusy] = useState(false);
    const [jsonData, setJsonData] = useState(false);
    const dispatch = useDispatch();

    let paylod = { 'blobname': 'accountBanking.json' }
    
    function createData(name, calories, fat, carbs, protein) {
      return {
        "accountHolderName":name,
        "bankName":calories,
        "accountType":fat,
        "accountNumber":carbs,
        "Buttons":[{"Label":"Edit", "method":"onEditClick","className":"btn btn-bf-primary"},{"Label":"Delete", "method":"onDeactivateClick","className":"btn-bf-secondary bf-mrgl20"}]
      };
    }
    
  function createMobileData(accountHolderName, bankName) {

    return {
      "accountHolderName": accountHolderName,
      "bankName": bankName,
      "mobileButton":true
    };
  }
    const rows = [
      createData('Cupcake', 'Bank of America', 'Savings accounts', '122105155'),
      createData('Donut', 452, 'Money market accounts', '082000549'),
      createData('Eclair', 262, 'Checking accounts', '122235821'),
      createData('Frozen yoghurt', 159, 6.0, '121122676'),
      createData('Gingerbread', 356, 16.0, 49),
      createData('Honeycomb', 408, 3.2, 87),
      createData('Ice cream sandwich', 237, 'Checking accounts', 37),
      createData('Jelly Bean', 375, 0.0, 94),
      createData('KitKat', 518, 26.0, 65),
      createData('Lollipop', 392, 0.2, 98),
      createData('Marshmallow', 318, 0, 81),
      createData('Nougat', 360, 19.0, 9),
      createData('Oreo', 437, 18.0, 63),
    ];
    const mobileRows = [
      createMobileData('Cupcake', 'Bank of America'),
      createMobileData('Donut','Money market accounts'),
      createMobileData('Eclair', 'Checking accounts'),
      createMobileData('Frozen yoghurt', '121122676'),
      createMobileData('Gingerbread','Bank of America'),
      createMobileData('Honeycomb', 'Bank of America'),
      createMobileData('Ice cream sandwich',  'Checking accounts'),
      createMobileData('Jelly Bean', 'Bank of America'),
      createMobileData('KitKat', 'Bank of America'),
      createMobileData('Lollipop', 'Bank of America'),
      createMobileData('Marshmallow', 'Bank of America'),
      createMobileData('Nougat', 'Bank of America'),
      createMobileData('Oreo', 'Bank of America'),
    ];
    
    const [isBusy, setBusy] = useState(true);
    useEffect(() => {
      bfaJsonService(paylod).then(data => {
          setJsonData(data.data.bankingData[0].bankInformation);

          setFieldList(data.data.bankingData)
          setInitialState(data.data.bankingData[0].bankInformation)
          //setInitialState(data.data.companyDetailsData);
          setBusy(false);
      });
  }, []);

  const setInitialState = (fboData,clear) => {
    const formData = {};
    let formErrors = {};

    const fieldTypeArr = ['input', 'select'];

    fboData && fboData.fields.forEach((item) => {
        if (fieldTypeArr.includes(item.component.toLowerCase())) {
            formData[item.name] =clear? "": formdata && formdata[item.name] ? formdata[item.name] : item.defaultValue?item.defaultValue:"";
            formErrors[item.name] = getFormErrorRules(item);
        }
    })
    console.log(formData)
    setformErrors(formErrors);
    setformdata(formData);
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
      const validationTypes = ['IsMandatory', 'CheckRegex'];
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
                  if (validationType === 'CheckRegex') {
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
                  }else{
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

        if (!formErrors[fieldName].isValid) {
            formValid = formErrors[fieldName].isValid;
            return formValid;
        }
  }
  return formValid;
  }
   const onHandleChange = (e,field) => {
    let target=e.target
    let formdataset={}
    const fields = {};
    let maxLength = 0;

        if (field && field.maxLength) {
            maxLength = parseInt(field.maxLength);
        }
        if (maxLength > 0 && target.value.length > maxLength) {
            target.value = target.value.substring(0, maxLength);
            return;
        }

    fields[field.name] = e.target.value;
    if(isBtnValidate){
      validateField(
          target.name, target.value, fields, true
      );
    }
    formdataset = {
      ...formdata,
      ...fields
    }
    setformdata(formdataset)    
  }

  const onHandleBlur = (e,field) => {
    let target=e.target
    let formdataset={...formdata}
    const fields = {};

    formdataset[field.name] = e.target.value;
    if (field.name == "aircraftTailNumber") {

      let value = {
          "tailNumber": target.value
      }

      flightInformationService(value).then(response => {
        formdataset['serialNumber'] = response.data.serialNumber === undefined ? '' : response.data.serialNumber;
        formdataset['manufacturerName'] = response.data.manufacturer === undefined ? '' : response.data.manufacturer;
        formdataset['aircraftType'] = response.data.aircraftType === undefined ? '' : response.data.aircraftType;
      })
      
  }
  setTimeout(()=>{
    setformdata(formdataset) 
  },1000)  
  }

  const onClickSubmit = (e,item) => {
    if(item.name&&item.name=="addNew"){
      setInitialState(fieldList[0].bankInformation,true)
      seteditModalShow(true)
      setaddNew(true)
    }else{
      setbtnValidate(true)
      setdisable(false)
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

    let isValid=validateForm();

    if(isValid){
      seteditModalShow(false)
      setModalText('')
      document.getElementById('root').style.filter = 'none';
      setbtnValidate(false)
      console.log(formdata)
      let auditPayload = {"ModuleName":"Account",
          "TabName":"Billing",
          "Activity":"Added Billing details for ",
          "ActionBy":Storage.getItem('email'),
          "Role":JSON.parse(Storage.getItem('userRoles')),
          "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
saveAuditLogData(auditPayload, dispatch)
    }else{
      setModalText(fieldList[0].modal.validate.text)
//      setModalShow(true)
    }
    }
    
  }

  const handleCheck = (e,item) => {
  }

   const clickEdit = (data) => {
    setdisable(true)
    setformdata(data);
    seteditModalShow(true)
  }

  const clickDeactivate = (data) => {
    setModalText(fieldList[0].modal.deactivate.text)
    setModalShow(true)
    document.getElementById('root').style.filter = 'blur(5px)';
    
  }  
  const closeModal = () => {
    setModalShow(false)
    document.getElementById('root').style.filter = 'none';
    setModalText('')
    let auditPayload = {"ModuleName":"Account",
    "TabName":"Billing",
    "Activity":"Deleted Billing details for ",
    "ActionBy":Storage.getItem('email'),
    "Role":JSON.parse(Storage.getItem('userRoles')),
    "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
saveAuditLogData(auditPayload, dispatch)
    document.getElementById('root').style.filter = 'none';
  }
  const closeEditModal = () => {
    seteditModalShow(false)
    setModalText('')
    document.getElementById('root').style.filter = 'none';
    setInitialState(fieldList[0].bankInformation)
    setaddNew(false)
  }

  const getOperatorFields = (item) => {
    switch(item.component.toUpperCase()) {
        
     case "BUTTON":
    return (<ButtonComponent       
            Label={item.label} 
            Type={item.type} 
            className={item.styles.className}
            variant={item.variant}
            disabled={false}
            handleClick={(e)=>onClickSubmit(e,item)}/>)
     };
}


  return (<>{isBusy?(<Loader/>):(
  <><div  className={`${fieldList[0].addNewBanking ? fieldList[0].addNewBanking.styles.colWidth : ''} bf-absolute`}>
  {fieldList[0].addNewBanking&& state && state.companyValue ? getOperatorFields(fieldList[0].addNewBanking) : ''}
</div>  
  <div className='bf-table-container bf-banking-table-container bf-responsive-table-container'>
    <BFTable Data ={rows} 
    searchEnabled={true} 
    heading={fieldList[0].headCells} 
    searchBy={["name", "email", "mobileNumber"]}
    primaryClick = {clickEdit}
    secondaryClic = {clickDeactivate}
    >
    </BFTable>
    <BFTable 
        sortEnabled = {false} 
        searchEnabled={true} 
        Data ={mobileRows && mobileRows} 
        heading={fieldList[0].mobileHeadCells && fieldList[0].mobileHeadCells} 
        searchBy={["aircraftType","aircraftTailNumber"]}
        primaryClick = {clickEdit}
        secondaryClic = {clickDeactivate}
        isUserMobileTab = {true}
        isMobileTable = {true}
        viewLabels = {fieldList[0].headCells && fieldList[0].headCells}
        viewData = {rows && rows} 
        jsonData = {jsonData}
        viewLabel = {fieldList[0].mobileViewHeader}
      ></BFTable>
    </div>
    {editmodalShow?<EditFormModal
          onHide={() => closeEditModal()}
          formErrors={formErrors}
          disable={disable}
          formdata={formdata}
          show={editmodalShow}
          json={fieldList[0].bankInformation}
          onHandleChange={onHandleChange}
          onHandleBlur={onHandleBlur}
          onClickSubmit={onClickSubmit}
          handleCheck={handleCheck}
          showError = {modalText}
          submittedForm = {serviceBusy}
          addNew = {addNew}
      />:""}
    <CustomModal
    show={modalShow}
    onHide={() => closeModal()}
    hide={()=>closeModal()}
    modelBodyContent={modalText}
    buttonText={modalText==fieldList[0].modal.deactivate.text? fieldList[0].modal.deactivate.button1:fieldList[0].modal.validate.button1}
    secondbutton={modalText==fieldList[0].modal.deactivate.text?fieldList[0].modal.deactivate.button2:""}
  /></>
    )}  </>
  );
}
export default Banking;