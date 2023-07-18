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
import { accountCompanyDeactivateService, accountCompanyEditService, deleteAircraft, fetchCompanyDetails } from '../../actions/accountServices/accountCompanyService';
import { getFieldIsValid } from '../../controls/validations';
import { Storage } from '../../controls/Storage';
import { fetchJSONData, fetchPaymentData } from '../../actions/accountPayment/accountPaymentActions';
import { useDispatch, useSelector } from 'react-redux';
import {saveAuditLogData } from '../../actions/auditLog/auditLogActions';

function Payment() {
    
    const [fieldList, setFieldList] = useState(null);
    const {state} = useLocation();
    const restrictedFields = ['organizationName', 'userType'];
    const [restricted, setrestricted] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [formErrors, setformErrors] = useState({});
    const [isBtnValidate,setbtnValidate]=useState(false);
    const [disable,setdisable]=useState(false);
    const [refresh,setrefresh]=useState(0);
    const [aircraftId,setaircraftId]=useState(0);
    const [editmodalShow, seteditModalShow] = useState(false);
    const [addNew, setaddNew] = useState(false);
    const [modalText, setModalText] = useState("");
    const [formdata, setformdata] = useState({});
    const [rows, setRows] = useState([]);
    
    const [mobileDataRows, setMobileDataRows] = useState(null);
    const [newRows, setnewRows] = useState([]);

    let paylod = { 'blobname': 'payment.json' }
    const dispatch = useDispatch();
    const paymentReducer = useSelector(state => state.paymentReducer);
    const jsonData = paymentReducer && paymentReducer.paymentJson && paymentReducer.paymentJson;
    const paymentData = paymentReducer && paymentReducer.paymentData && paymentReducer.paymentData && paymentReducer.paymentData.data
    
    
    function createData(pay, name, date, card,button) {
      return { 
        "paymentMode":pay,
        "nickName":name,
        "dateUploaded":new Date(date).toLocaleDateString('fr'),
        "cardAccountNumber":card.replace(/\d{4}(?=\d{4})/g,"****"),
      //  "homeBaseAirport":protein,
        //"Buttons":[{"Label":"Edit", "method":"onEditClick","className":"btn btn-bf-primary"},{"Label":"Deactive", "method":"onDeactivateClick","className":"btn-bf-secondary bf-mrgl20"}]
      };
    }
    function createMobileData(paymentMode, nickName) {
      return {
        "paymentMode":paymentMode,
        "nickName":nickName,
        "mobileButton":true
      };
    }
    
    const [isBusy, setBusy] = useState(true);
    useEffect(() => {
      // let accLevel=JSON.parse(Storage.getItem('accessLevel'))
      // accLevel=accLevel.map((level)=>{
      //   level=level.toLowerCase()
      //   return level
      // })
      // let userType=Storage.getItem('userType')
      // if(userType.toLowerCase()=='operator'){
      //   if(!accLevel.includes('super')){
      //     setrestricted(true)
      //   }
      // }
      //Storage.setItem('organizationName','amazon66')
      let companyDetails={'service': 'payment', 'organizationName': state.companyValue}
      fetchJSONData(dispatch,paylod)
      fetchPaymentData(dispatch,companyDetails)
  }, [refresh, state && state.companyValue]);
  useEffect(()=>{
    let data = jsonData && jsonData.data && jsonData.data.data && jsonData.data.data.paymentData
    setFieldList(data)
    setInitialState(data && data[0].paymentInformation)
      let paymentres = [];
      let paymentMobileDataRows = [];
      let responseData = paymentData && paymentData.res
      responseData && responseData.map((item,index)=>{
        paymentres.push(createData(item.paymentModes.length>0 ? item.paymentModes[0].paymentMode : "",item.nickName, item.dateUpload,item.cardNumber,data && data[0].Buttons))
        paymentMobileDataRows.push(createMobileData(item.paymentModes.length>0 ? item.paymentModes[0].paymentMode : "",item.nickName))
        
      })
      setnewRows(responseData)
      setRows(paymentres)
      setMobileDataRows(paymentMobileDataRows)
      //setformDataSet(data)
      setBusy(false);
  },[jsonData,paymentData])

  const setInitialState = (fboData,clear,editdata) => {
    const formData = {};
    let formErrors = {};
    console.log(editdata)
    const fieldTypeArr = ['input', 'select','id'];

    fboData && fboData.fields.forEach((item) => {
        if (fieldTypeArr.includes(item.component.toLowerCase())) {
            formData[item.name] =editdata && editdata[item.name]?editdata[item.name]: clear? "": formdata && formdata[item.name] ? formdata[item.name] : item.defaultValue?item.defaultValue:"";
            formErrors[item.name] = getFormErrorRules(item);
        }
    })
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
        setformdata(formdataset)
      })   
  }else{
    setformdata(formdataset)
  }
  // setTimeout(()=>{
    //setformdata(formdataset) 
  // },1500)  
  }

  const onClickSubmit = (e,item) => {
    if(item.name&&item.name=="addNew"){
      setaddNew(true)
      setInitialState(fieldList[0].paymentInformation,true)
      seteditModalShow(true)
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
      setBusy(true)
      seteditModalShow(false)

      document.getElementById('root').style.filter = 'none';
      setbtnValidate(false)
      let saveJSON={}
      if(addNew){
        saveJSON.service="payment";
        saveJSON.json=formdata;
        saveJSON.json.expirtDate=formdata.expireMonth + "/" + formdata.expireYear
        delete saveJSON.json.expireMonth;
        delete saveJSON.json.expireYear;
        saveJSON.json.organizationName=state.companyValue
        accountCompanyEditService(saveJSON).then((res)=>{
          if(res==undefined){
            setModalText("Technical error")
            setModalShow(true)
          }
          let auditPayload = {"ModuleName":"Account",
                                    "TabName":"Payment",
                                    "Activity":"Added new payment for "+formdata['cardHolder'],
                                    "ActionBy":Storage.getItem('email'),
                                    "Role":JSON.parse(Storage.getItem('userRoles')),
                                    "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
                                saveAuditLogData(auditPayload, dispatch)
          setrefresh(refresh+1)
        })
        setaddNew(false)
      }else{
        saveJSON.service="payment";
        saveJSON.json=formdata;
        accountCompanyEditService(saveJSON).then((res)=>{
          let auditPayload = {"ModuleName":"Account",
                                    "TabName":"Payment",
                                    "Activity":"Edited payment for aircraft "+formdata['cardHolder'],
                                    "ActionBy":Storage.getItem('email'),
                                    "Role":JSON.parse(Storage.getItem('userRoles')),
                                    "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
                                saveAuditLogData(auditPayload, dispatch)
          setrefresh(refresh+1)
        })
      }
      
    }else{
      setModalText(fieldList[0].modal.validate.text)
      setModalShow(true)
    }
    }
    
  }

  const handleCheck = (e,item) => {
  }
  const clickEdit = (data) => {}
  //  const clickEdit = (data) => {
  //   newRows.forEach((row)=>{
  //     if(row.tailNumber==data.aircraftTailNumber){
  //       row.aircraftTailNumber=row.tailNumber
  //       setInitialState(fieldList[0].aircraftInformation,false,row)
  //     }
  //   })
  //   setdisable(true)
  //   seteditModalShow(true)
  // }
  const clickDeactivate = (data) => {}
  // const clickDeactivate = (data) => {
  //   newRows.forEach((row)=>{
  //     if(row.tailNumber==data.aircraftTailNumber){
  //       setaircraftId(row.aircraft_id)
  //     }
  //   })
  //   setModalText(fieldList[0].modal.deactivate.text)
  //   setModalShow(true)
    
  // }  
  const closeModal = () => {
    setModalShow(false)
  }
  const closeEditModal = () => {
    setaddNew(false)
    seteditModalShow(false)
    document.getElementById('root').style.filter = 'none';
    setInitialState(fieldList[0].aircraftInformation)
    setbtnValidate(false)
  }
  const successModal = () => {
    setModalShow(false)
    if(modalText==fieldList[0].modal.deactivate.text){
      setBusy(true)
      let payload={}
      payload.aircraft_id=aircraftId.toString()
      deleteAircraft(payload).then((res)=>{
        let auditPayload = {"ModuleName":"Account",
                                    "TabName":"Company",
                                    "Activity":"Delete payment for aircraft "+aircraftId.toString(),
                                    "ActionBy":Storage.getItem('email'),
                                    "Role":JSON.parse(Storage.getItem('userRoles')),
                                    "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
                                saveAuditLogData(auditPayload, dispatch)
        setrefresh(refresh+1)
      })
    }
  }
  const getOperatorFields = (item) => {
    switch(item.component.toUpperCase()) {
        
     case "BUTTON":
    return (<ButtonComponent       
            Label={item.label} 
            Type={item.type} 
            className={item.styles.className}
            variant={item.variant}
            disabled={restricted}
            handleClick={(e)=>onClickSubmit(e,item)}/>)
     };
}


  return (<>{isBusy?(<Loader/>):(
  <>
  {fieldList && rows && 
  <>
    <div  className={`${fieldList[0].addNewPayment ? fieldList[0].addNewPayment.styles.colWidth : ''} bf-absolute`}>
  {fieldList[0].addNewPayment&& state && state.companyValue ? getOperatorFields(fieldList[0].addNewPayment) : ''}
</div>  
<div className='bf-table-container bf-payment-table-container'>
    <BFTable Data ={rows && rows} 
    sortEnabled = {true} 
    searchEnabled={true} 
    heading={fieldList[0].headCells} 
    searchBy={["nickName", "paymentMode"]}
    //primaryClick = {clickEdit}
    disable={restricted}
    //secondaryClic = {clickDeactivate}
    >
    </BFTable>

    <BFTable 
        sortEnabled = {false} 
        searchEnabled={true} 
        Data ={mobileDataRows && mobileDataRows} 
        heading={fieldList[0].mobileHeadCells && fieldList[0].mobileHeadCells} 
        searchBy={["paymentMode","nickName"]}
        primaryClick = {clickEdit}
        secondaryClic = {clickDeactivate}
        isUserMobileTab = {true}
        isMobileTable = {true}
        viewLabels = {fieldList[0].headCells && fieldList[0].headCells}
        viewData = {rows && rows} 
        jsonData = {jsonData}
        viewLabel = {jsonData?.data?.data?.paymentData[0].mobileViewHeader}
      >
      </BFTable>
    </div>
    {editmodalShow?<EditFormModal
          onHide={() => closeEditModal()}
          formErrors={formErrors}
          disable={disable}
          formdata={formdata}
          show={editmodalShow}
          json={fieldList[0].paymentInformation}
          onHandleChange={onHandleChange}
          onHandleBlur={onHandleBlur}
          onClickSubmit={onClickSubmit}
          handleCheck={handleCheck}
          className="bf-modal-body-max"
      />:""}
    <CustomModal
    show={modalShow}
    onHide={() => successModal()}
    hide={()=>closeModal()}
    size={modalText===fieldList[0].modal.deactivate.text ? "lg":''}
    modelBodyContent={modalText}
    buttonText={modalText==fieldList[0].modal.deactivate.text? fieldList[0].modal.deactivate.button1:fieldList[0].modal.validate.button1}
    secondbutton={modalText==fieldList[0].modal.deactivate.text?fieldList[0].modal.deactivate.button2:""}
  /></>}</>
    )}  </>
  );
}
export default Payment;