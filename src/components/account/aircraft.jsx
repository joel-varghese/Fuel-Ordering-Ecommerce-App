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
import { useDispatch, useSelector } from 'react-redux';
import { fetchAircraftData, fetchJSONData } from '../../actions/acountAircraft/accountAircraftActions';
import { enablePopUp } from '../../actions/commonActions/commonActions';
import { saveNotificationList } from '../../actions/notificationService/notificationAction';
import {saveAuditLogData } from '../../actions/auditLog/auditLogActions';

import { camelize } from '../../controls/validations'
function Aircraft(props) {
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
    const [serviceBusy, setServiceBusy] = useState(false);
    const [tailNumber,setTailNumber] = useState(null)
    const orgName = Storage.getItem('organizationName')
    const loginName = Storage.getItem('email')
    const access = JSON.parse(Storage.getItem('accessLevel'))[0]
    let paylod = { 'blobname': 'accountAircraft.json' }
    const dispatch = useDispatch();
    const aircraftReducer = useSelector(state => state.aircraftReducer);
    const [aircraftpresent,setAircraftPresent] = useState(true)
    const commonReducer = useSelector(state => state.commonReducer);
    const popUpEnable = commonReducer && commonReducer.enableModal && commonReducer.enableModal.data;
    const jsonData = aircraftReducer && aircraftReducer.aircraftJson && aircraftReducer.aircraftJson;
    const aircraftData = aircraftReducer && aircraftReducer.aircraftData && aircraftReducer.aircraftData && aircraftReducer.aircraftData.data
    const accountHomeReducer = useSelector((state) => state.accountHomeReducer);
    const selectedCompany = accountHomeReducer && accountHomeReducer.selectedCompany && accountHomeReducer.selectedCompany.company;
    function createData(name, calories, fat, carbs, protein,button) {
      return {
        "aircraftTailNumber":name,
        "serialNumber":calories,
        "manufacturerName":fat,
        "aircraftModel":carbs,
        "homeBaseAirport":protein,
        "Buttons":button
      };
    }
    function createMobileData(aircraftModel, tailNumber) {
      return {
        "aircraftModel":aircraftModel,
        "aircraftTailNumber":tailNumber,
        "mobileButton":true
      };
    }
    
    const [isBusy, setBusy] = useState(true);
    useEffect(() => {
      let accLevel=Storage.getItem('accessLevel')? JSON.parse(Storage.getItem('accessLevel')):[]
      accLevel=accLevel.map((level)=>{
        level=level.toLowerCase()
        return level
      })
      let userType=Storage.getItem('userType')
      if(userType.toLowerCase()=='operator'){
        if(!accLevel.includes('super')){
          setrestricted(true)
        }
      }
      //Storage.setItem('organizationName','amazon50')
      let companyDetails={'service': 'aircraft', 'organizationName': selectedCompany}
      fetchJSONData(dispatch,paylod)
      fetchAircraftData(dispatch,companyDetails)
  }, [refresh,selectedCompany]);
  useEffect(()=>{
    let data = jsonData && jsonData.data && jsonData.data.data && jsonData.data.data.aircraftData
    setFieldList(data)
    setInitialState(data && data[0].aircraftInformation)
    let aircraftDataRes = [];
    let userMobileDataRows = [];
    let responseData = aircraftData && aircraftData.res
    responseData && responseData.map((item,index)=>{
      aircraftDataRes.push(createData(item.tailNumber, camelize(item.serialNumber), camelize(item.manufacturerName),camelize(item.aircraftModel), camelize(item.homeBaseAirport),data && data[0].Buttons))
      userMobileDataRows.push(createMobileData(item.aircraftModel,item.tailNumber))
    })
    setnewRows(responseData)
    setRows(aircraftDataRes)
    setMobileDataRows(userMobileDataRows)
    //setformDataSet(data)
    setBusy(false);
    //setCompanyDetailsData(response.res) 
  },[jsonData && jsonData.data && jsonData.data.data && jsonData.data.data.aircraftData,aircraftData && aircraftData.res])
  useEffect((e)=>{
    // if(props.showPopup) {
    //     if(fieldList && fieldList[0] && fieldList[0].addNewAircraft)  
    //       onClickSubmit(e, fieldList[0].addNewAircraft)
    // }
    
      setaddNew(popUpEnable)
      seteditModalShow(popUpEnable)
  },[popUpEnable])
  const setInitialState = (fboData,clear,editdata) => {
    const formData = {};
    let formErrors = {};
    const fieldTypeArr = ['input', 'select','id'];

    fboData && fboData.fields.forEach((item) => {
        if (fieldTypeArr.includes(item.component.toLowerCase())) {
            formData[item.name] =editdata && editdata[item.name] && editdata[item.name]!== ""? editdata[item.name]: "";
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

    if(field.dataType=='numeric'){
      target.value = target.value.replace(/\D/g,'')
    }
    if (field.name === 'aircraftTailNumber' || field.name === 'maxFuelCapacity') {
      target.value = target.value.replace(/[^a-zA-Z0-9]/gi, '')
    }

    if ( field.name === 'aircraftTailNumber' || field.name === 'homeBaseAirport' ) {
      target.value= target.value.toUpperCase()

    }

    if ( field.name === 'serialNumber' ) {
      let serialNumberLen = target.value.length;
      if(target.value && target.value.length == 1 && target.value == "-") {
          target.value = ""
      }else if(target.value && serialNumberLen && target.value[serialNumberLen-1] == "-" && target.value[serialNumberLen-2] == "-" ){
          target.value = target.value.subString(0, serialNumberLen-1)
      }else {
          target.value = target.value.replace(/[^a-zA-Z0-9-]/gi, '')
      }
  }

  if ( field.name === 'manufacturerName' ) {
      let manufacturerLen = target.value.length;
      if(target.value && target.value.length == 1 && target.value == "-") {
          target.value = ""
      }else if(target.value && manufacturerLen && target.value[manufacturerLen-1] == "-" && target.value[manufacturerLen-2] == "-" ){
          target.value = target.value.subString(0, manufacturerLen-1)
      }else {
          target.value = target.value.replace(/[^a-zA-Z0-9 -]/gi, '')
      }
  }

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

    let isValid=validateForm();
    if (isValid) {
      setModalText('');
    }

    setformdata(formdataset)    
  }

  const onHandleBlur = (e,field) => {
    let target=e.target
    let formdataset={...formdata}
    const fields = {};
    const errorData = {
      ...formErrors
    };
    formdataset[field.name] = e.target.value;
    if (field.name == "aircraftTailNumber") {

      let value = {
          "tailNumber": target.value
      }
    //  if(e.target.value != '') {
        flightInformationService(value).then(response => {
          if(response.data.message != null){
            setAircraftPresent(false)
          }
          formdataset['serialNumber'] = response.data.serialNumber === undefined ? '' : response.data.serialNumber;
          formdataset['manufacturerName'] = response.data.manufacturer === undefined ? '' : response.data.manufacturer;
          formdataset['aircraftModel'] = response.data.aircraftModel === undefined ? '' : response.data.aircraftModel;
          setformdata(formdataset)
          if(!response.data.message) {
            let fieldlist = ['serialNumber', 'manufacturerName', 'aircraftModel'];
            fieldlist.forEach(item => {
              errorData[item].isTouched = true;
                errorData[item].isValid = true;
                validateField(item, formdataset[item], 
                    { [item]: formdataset[item] }, true)
            })
            setformErrors(errorData);
            setTimeout(() => {
              let isValid=validateForm();
              if (isValid) {
                setModalText('');
              }
            },1)
          }
        }) 
      }  
 // }else{
    // formdataset['serialNumber'] = '';
    // formdataset['manufacturerName'] = '';
    // formdataset['aircraftModel'] = '';
    // setformdata(formdataset)
 // }
  // setTimeout(()=>{
    //setformdata(formdataset) 
  // },1500)  
  }

  const onClickSubmit = (e,item) => {
    if(item.name&&item.name=="addNew"){
      setaddNew(true)
      setInitialState(fieldList[0].aircraftInformation,true)
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
      setServiceBusy(true)
//      seteditModalShow(false)
      //document.getElementById('root').style.filter = 'none';
      setbtnValidate(false)
      let saveJSON={}
      if(addNew){
        saveJSON.service="addAircraft";
        saveJSON.json=formdata;
        delete saveJSON.json.aircraft_id;
        saveJSON.json.organizationName=state.companyValue
        accountCompanyEditService(saveJSON).then((res)=>{
          console.log(res)
          setServiceBusy(false)
          if(res==undefined){
            setModalText("Technical error")
          }else if(res?.response?.data?.message.includes(saveJSON.json.aircraftTailNumber)){
            setModalText(fieldList[0].modal.duplicate.text)
          }else if(res.message=='data Updated Successfully'){
            let payload = {}
            payload.type = "create"
            payload.notificationMessage = fieldList[0].notifyMessage.msg1+saveJSON.json.aircraftTailNumber+fieldList[0].notifyMessage.msg2
            payload.organizationName = orgName
            payload.loginUserName = loginName
            payload.sendNotificationTo = "ORG Internal"
            payload.access_levels = ["Level 1 (Admin)","Level 2 (Standard)","Level 3 (Basic)"]
            payload.levelOfAccess = access == "Super" ? "Level 1 (Admin)" : access == "Admin" ? "Level 2 (Standard)" : "Level 3 (Basic)"
            payload.isActionable = false
            payload.actionTaken = ""
            payload.category = "account"
            payload.readInd = false
            saveNotificationList(payload,dispatch).then((res)=>{

            })
            if(!aircraftpresent){
            let req = {}
            req.type = "create"
            req.notificationMessage = fieldList[0].notifyMessage.msg6+loginName+fieldList[0].notifyMessage.msg7
            req.organizationName = orgName
            req.loginUserName = loginName
            req.sendNotificationTo = "BF Internal"
            req.access_levels = ["Level 1 (Admin)","Level 2 (Standard)","Level 3 (Basic)"]
            req.levelOfAccess = access == "Super" ? "Level 1 (Admin)" : access == "Admin" ? "Level 2 (Standard)" : "Level 3 (Basic)"
            req.isActionable = false
            req.actionTaken = ""
            req.category = "account"
            req.readInd = false
            saveNotificationList(req,dispatch).then((res)=>{
              setAircraftPresent(false)
            })
          }
            let auditPayload = {"ModuleName":"Account",
                              "TabName":"Aircaft",
                              "Activity":"Aircaft "+saveJSON.json.aircraftTailNumber+" Added",
                              "ActionBy":Storage.getItem('email'),
                              "Role":JSON.parse(Storage.getItem('userRoles')),
                              "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
                    saveAuditLogData(auditPayload, dispatch)
            setrefresh(refresh+1)
            seteditModalShow(false)
            enablePopUp(false,dispatch)
            document.getElementById('root').style.filter = 'none';
            setModalText("")
            setaddNew(false)
          }
          //setrefresh(refresh+1)
        })
        // setServiceBusy(false)
      }else{
        saveJSON.service="aircraft";
        saveJSON.json=formdata;
        accountCompanyEditService(saveJSON).then((res)=>{
          setServiceBusy(false)
          let payload = {}
          payload.type = "update"
          payload.notificationMessage = fieldList[0].notifyMessage.msg1 + saveJSON.json.aircraftTailNumber + fieldList[0].notifyMessage.msg3 + loginName+ "."
          payload.organizationName = orgName
          payload.loginUserName = loginName
          payload.sendNotificationTo = "ORG Internal"
          payload.access_levels = ["Level 1 (Admin)","Level 2 (Standard)","Level 3 (Basic)"]
          payload.levelOfAccess = access == "Super" ? "Level 1 (Admin)" : access == "Admin" ? "Level 2 (Standard)" : "Level 3 (Basic)"
          payload.isActionable = false
          payload.actionTaken = ""
          payload.category = "account"
          payload.readInd = false
          saveNotificationList(payload,dispatch).then((res)=>{

          })
          let auditPayload = {"ModuleName":"Account",
                              "TabName":"Aircaft",
                              "Activity":"Aircaft "+saveJSON.json.aircraftTailNumber+" Updated",
                              "ActionBy":Storage.getItem('email'),
                              "Role":JSON.parse(Storage.getItem('userRoles')),
                              "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
                    saveAuditLogData(auditPayload, dispatch)
          setrefresh(refresh+1)
          seteditModalShow(false)
          enablePopUp(false,dispatch)
          document.getElementById('root').style.filter = 'none';
          setModalText("")
          setaddNew(false)
        })
        // setServiceBusy(false)
      }
    }else{
      setModalText(fieldList[0].modal.validate.text)
      setServiceBusy(false)
    }
    }
    
  }

  const handleCheck = (e,item) => {
  }

   const clickEdit = (data) => {
    newRows.forEach((row)=>{
      if(row.tailNumber==data.aircraftTailNumber){
        row.aircraftTailNumber=row.tailNumber
        setInitialState(fieldList[0].aircraftInformation,false,row)
      }
    })
    setdisable(true)
    seteditModalShow(true)
    setServiceBusy(false)
  }

  const clickDeactivate = (data) => {
    newRows.forEach((row)=>{
      if(row.tailNumber==data.aircraftTailNumber){
        setaircraftId(row.aircraft_id)
        setTailNumber(data.aircraftTailNumber)
      }
    })
    setModalText(fieldList[0].modal.deactivate.text)
    setModalShow(true)
    document.getElementById('root').style.filter = 'blur(5px)';
    
  }  
  const closeModal = () => {
    setModalShow(false)
    document.getElementById('root').style.filter = 'none';
    setModalText("");
  }
  const closeEditModal = () => {
    setaddNew(false)
    setdisable(false)
    seteditModalShow(false)
    setAircraftPresent(false)
    enablePopUp(false,dispatch)
    document.getElementById('root').style.filter = 'none';
    setInitialState(fieldList[0].aircraftInformation)
    setbtnValidate(false)
    setModalText("")
    setServiceBusy(false)
  }
  const successModal = () => {
    setModalShow(false)
    setModalText("")
    document.getElementById('root').style.filter = 'none';
    if(modalText==fieldList[0].modal.deactivate.text){
      setBusy(true)
      let payload={}
      payload.aircraft_id=aircraftId.toString()
      deleteAircraft(payload).then((res)=>{
        let req = {}
        req.type = "delete"
        req.notificationMessage = fieldList[0].notifyMessage.msg4+tailNumber+fieldList[0].notifyMessage.msg5 + loginName+ "."
        req.organizationName = orgName
        req.loginUserName = loginName
        req.sendNotificationTo = "ORG Internal"
        req.access_levels = ["Level 1 (Admin)","Level 2 (Standard)","Level 3 (Basic)"]
        req.levelOfAccess = access == "Super" ? "Level 1 (Admin)" : access == "Admin" ? "Level 2 (Standard)" : "Level 3 (Basic)"
        req.isActionable = false
        req.actionTaken = ""
        req.category = "account"
        req.readInd = false
        saveNotificationList(req,dispatch).then((res)=>{

        })
        let auditPayload = {"ModuleName":"Account",
                              "TabName":"Aircaft",
                              "Activity":"Aircaft"+tailNumber+"Deleted",
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
  { fieldList && rows && 
  <>
    <div  className={`${fieldList[0].addNewAircraft ? fieldList[0].addNewAircraft.styles.colWidth : ''} bf-absolute`}>
  {fieldList[0].addNewAircraft && selectedCompany  ? getOperatorFields(fieldList[0].addNewAircraft) : ''}
</div>  
<div className='bf-table-container bf-aricraft-table-container'>
    <BFTable Data ={rows} 
    searchEnabled={true} 
    sortEnabled = {true} 
    heading={fieldList[0].headCells} 
    searchBy={["aircraftTailNumber", "serialNumber", "manufacturerName","aircraftModel","homeBaseAirport"]}
    primaryClick = {clickEdit}
    disable={restricted}
    secondaryClic = {clickDeactivate}
    >
    </BFTable>
    <BFTable 
        sortEnabled = {false} 
        searchEnabled={true} 
        Data ={mobileDataRows && mobileDataRows} 
        heading={fieldList[0].mobileHeadCells && fieldList[0].mobileHeadCells} 
        searchBy={["aircraftModel","aircraftTailNumber"]}
        primaryClick = {clickEdit}
        secondaryClic = {clickDeactivate}
        isUserMobileTab = {true}
        isMobileTable = {true}
        viewLabels = {fieldList[0].headCells && fieldList[0].headCells}
        viewData = {rows && rows} 
        jsonData = {jsonData}
        viewLabel = {jsonData?.data?.data?.aircraftData[0].mobileViewHeader}
      >
      </BFTable>
    </div>
    {editmodalShow?<EditFormModal
          onHide={() => closeEditModal()}
          formErrors={formErrors}
          taildisable={disable}
          formdata={formdata}
          show={editmodalShow}
          json={fieldList[0].aircraftInformation}
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
    onHide={() => successModal()}
    close={()=>closeModal()}
    hide={()=>closeModal()}
    size={modalText===fieldList[0].modal.deactivate.text ? "lg":''}
    modelBodyContent={modalText}
    buttonText={modalText==fieldList[0].modal.deactivate.text? fieldList[0].modal.deactivate.button1:fieldList[0].modal.validate.button1}
    secondbutton={modalText==fieldList[0].modal.deactivate.text?fieldList[0].modal.deactivate.button2:""}
  /></>}</>
    )}  </>
  );
}
export default Aircraft;