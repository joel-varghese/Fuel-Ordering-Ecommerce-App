import React, { useState, useEffect } from 'react';
import { bfaJsonService } from '../../actions/BFAServices/BFAJsonService';
import { useLocation, useNavigate } from 'react-router-dom';
import { Storage, jsonStringify } from '../../controls/Storage';
import { accountCompanyEditService, accountUserDeactivateService, deleteAircraft, fetchCompanyDetails } from '../../actions/accountServices/accountCompanyService';
import BFTable from '../table/table'
import Loader from '../loader/loader';
import CustomModal from '../customModal/customModal';
import ButtonComponent from '../button/button';
import EditFormModal from '../customModal/editModal';
import { getFieldIsValid, validateAmount, validateUnitAmount } from '../../controls/validations';
import { adminAddUserSave } from "../../actions/adminAddUserService/adminAddUserService";
import { getAccessLevel } from '../../controls/commanAccessLevel';

import { useDispatch, useSelector } from 'react-redux';
// import { fetchJSONData, fetchUserData } from '../../actions/userActions/userActions';
import { additionalServicefetchJSONData, fetchAddServiceData, getSelectedTab, getSelectedUser } from '../../actions/taxFees/additionalServiceActions';
import { createAddService, deleteAddService, updateAddService } from '../../actions/taxFees/additionalServices';
import {saveAuditLogData } from '../../actions/auditLog/auditLogActions';
import { saveNotificationList } from '../../actions/notificationService/notificationAction';
import { getSystemVariables } from '../../actions/accountAdminAction/adminService'
import {systemVariablesVal} from '../../actions/accountAdminAction/adminAction'

function AdditionalServices() {
  let { state } = useLocation()
  const [fieldList, setFieldList] = useState(null);
  const [rows, setRows] = useState(null);
  const [userDetailsData, setUserDetailsData] = useState(null);
  const [formdata, setformdata] = useState({});
  const [editmodalShow, seteditModalShow] = useState(false);
  const [formErrors, setformErrors] = useState({});
  const [isBtnValidate, setbtnValidate] = useState(false);
  const [modalText, setModalText] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [isEditable, setIsEditable] = useState(false); const [formFieldErrors, setFormFieldErrors] = useState([]);
  const [formData, setFormData] = useState({});
  const [formFieldData, setFormFieldData] = useState([]);
  const [popUpJson, setPopUpJson] = useState();
  const [refresh, setrefresh] = useState(0);
  const [newRows, setnewRows] = useState([]);
  const [addNew, setaddNew] = useState(false);
  const [disable, setdisable] = useState(false);
  const [addLocations, setAddLocations] = useState(false);
  const [filterLocation, setfilterLocation] = useState([]);
  const [acclvl, setacclvl] = useState(true);
  const [waiverType, setwaiverType] = useState(' ');
  const [restricted, setrestricted] = useState(true);
  const [userId, setuserId] = useState(0);
  const [serviceBusy, setServiceBusy] = useState(false);
  const [isBusy, setBusy] = useState(true);
  const [loading, setLoading] = useState(true)
  const [fatNumber,setFatNumber] = useState(true)
  const [actualFeeAmount,setActualFeeAmount] = useState(0)
  const [locDisable, setlocDisable] = useState(false);
  const [feeAmount,setFeeAmount] = useState(0)
  const [isLevel2, setIsLevel2] = useState(false);
  const paylod = { 'blobname': 'additionalServices.json' }
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const AddServcieReducer = useSelector(state => state.additionalServiceHomeReducer);
  const jsonData = AddServcieReducer && AddServcieReducer.additionalServiceHomeJson && AddServcieReducer.additionalServiceHomeJson;
  const addServcieData = AddServcieReducer && AddServcieReducer.additionalServiceDetails && AddServcieReducer.additionalServiceDetails;
  const loader = AddServcieReducer && AddServcieReducer.loading && AddServcieReducer.loading;
  const accountHomeReducer = useSelector((state) => state.taxFeesHomeReducer);
  const selectedUser = accountHomeReducer && accountHomeReducer.selectedUser ? accountHomeReducer.selectedUser.user : Storage.getItem('userType').toLocaleLowerCase();
  const selectedCompany = accountHomeReducer && accountHomeReducer.selectedCompany && accountHomeReducer.selectedCompany.company
  const dashboardReducer = useSelector((state) => state.dashboardReducer)
  const profileDetails = dashboardReducer && dashboardReducer.profileData && dashboardReducer.profileData.data
  const loginReducer = useSelector(state => state.loginReducer);
  const loginDetails = loginReducer && loginReducer.loginDetails &&loginReducer.loginDetails.data;
  let loginDetls =  JSON.stringify(loginDetails) === '{}'?{}:JSON.parse(loginDetails);
  let userEmail = loginDetls.loginUserName?loginDetls.loginUserName:'';
  let accessLvl = loginReducer && loginReducer.loginAccessLevel&&loginReducer.loginAccessLevel.data&&loginReducer.loginAccessLevel.data?loginReducer.loginAccessLevel.data:[]
  let userType = loginDetls.userType?loginDetls.userType:'';
  const adminReducer = useSelector((state) => state.AdminReducer)
  const systemVariables = adminReducer && adminReducer.systemVariables && adminReducer.systemVariables.data 
 
  function createData(service, location, fee, wavier, addedBy, id, unit, buttons,loc) {
    let dataWaiver = ""
    if(wavier != "00.00"){
      if(unit=="$"){
        dataWaiver = unit + wavier
      }
      else{
        dataWaiver =  wavier + unit 
      } 
    }
    let dataObj= {
      "service": service,
      "location": location+[],
      "fee": fee,
      "taxID":id,
      "wavier": dataWaiver ? dataWaiver : "NA",
      "addedBy": addedBy,
      "Buttons": [{ "Label": "Edit", "method": "onEditClick", "className": "btn btn-bf-primary" }, { "Label": "Delete", "method": "onDeactivateClick", "className": "btn-bf-secondary bf-mrgl20", "checkAdminAccess" :true}]
    };
    let acc=JSON.parse(accessLvl)
    if(!acc?.includes('Super') && userType.toLowerCase()!='barrel fuel'){
      if(acc?.includes('Admin')){
        setIsLevel2(true)
          let flag=true;
          location?.map((v)=>{
            if(loc?.includes(v)){
              flag=false;
            }
          })
          if(flag){
            dataObj.Buttons[0].disable=true;
            dataObj.Buttons[1].disable=true;
          }
      }
    }
    return dataObj;
  }
  useEffect (()=>{
    return(
      ()=>{
        document.getElementById('root').style.filter = 'none'
      })
      /* let payloadSystem={"Loggedinuser":userEmail}
      getSystemVariables(payloadSystem).then((res)=>{
        let data=res?.data
        data =  data[0][0]['JSON_UNQUOTE(@JSONResponse)']
        data=JSON.parse(data)
        let systemVariable = {}
        data && data.map((item, index) => {
            systemVariable[item.VariableName.replace(/ /g,"_")] = item.value;
        })
        systemVariablesVal(systemVariable, dispatch)
        
    }) */
 },[])

  useEffect(() => {
    setrefresh(0);
    let accessable = getAccessLevel(userType, accessLvl)
    if (accessable) {
      setrestricted(false)
    }
    additionalServicefetchJSONData(paylod, dispatch)
    let req = {}
    req.organization = selectedCompany
    req.loggedInuser = userEmail
    fetchAddServiceData(dispatch, req)
    let access= accessLvl&&accessLvl.toLowerCase()
    if(access.includes("super") || selectedUser =='Barrel Fuel' || selectedUser =='internal' || userType=='Barrel Fuel'){
      setacclvl(false)
    }
    let payloadSystem={"Loggedinuser":userEmail}
        getSystemVariables(payloadSystem).then((res)=>{
            let data=res?.data
            data =  data[0][0]['JSON_UNQUOTE(@JSONResponse)']
            data=JSON.parse(data)
            let systemVariable = {}
            data && data.map((item, index) => {
                systemVariable[item.VariableName.replace(/ /g,"_")] = item.value;
            })
            systemVariablesVal(systemVariable, dispatch)
            
        })
  }, [ refresh, selectedCompany]);

  useEffect(() => {

    let loc=[]
    profileDetails && profileDetails.locationAccess && profileDetails.locationAccess.forEach((val)=>{
      if(val.accessLevel=='Level 2 (Standard)'){
        val.locations.forEach((location)=>{
          loc.push(location)
        })
      }
    })
    setfilterLocation(loc)
    let data = jsonData && jsonData.additionalServiceData;
    let userRows = [];
    let response =  addServcieData && addServcieData.data && addServcieData.data.length && addServcieData.data[0][0]['cast(JSON_UNQUOTE(@jsonresult) as json)']
     response = response!=undefined&&JSON.parse(response)
    let responseData = response&&response.res?response.res:[]
    setFieldList(data)
    responseData&&responseData.sort((a, b) => b.fboaddlserviceid - a.fboaddlserviceid);
    responseData && responseData.map((item, index) => {
      let actualAmnt  = item.actualamount!=null&&item.actualamount?item.actualamount.toFixed(2):"00.00";
      let amount =   item.amount!=null&&item.amount?item.amount.toFixed(2):"00.00";
      userRows.push(createData(item.servicetype, item.locations, amount, actualAmnt, item.addedBy,item.fboaddlserviceid, item.unit, data && data[0].Buttons,loc))
    })
    setnewRows(responseData && responseData)
    setRows(userRows)
    setBusy(false);
    setLoading(loader && loader)
  }, [addServcieData, jsonData, loader, selectedUser])

  useEffect(() => {
    let data = jsonData && jsonData.additionalServiceData;
      data = data?.length && data[0].aircraftInformation?.fields.filter((m)=>
        m.waiverType.includes(waiverType)
      )
      let newData={}
      newData['fields']= data && data
      setInitialState(newData,false,formdata)
      setPopUpJson(newData)

  }, [waiverType])

  const setInitialState = (fboData, clear, editdata) => {
    const formData = {};
    let formErrors = {};
    const fieldTypeArr = ['input', 'select', 'id','date','multiselectcheckbox'];

    fboData && fboData?.fields?.forEach((item) => {
      if (fieldTypeArr.includes(item.component.toLowerCase())) {
        if(item.name == 'locations'){
          formData[item.name] =editdata && editdata[item.name]?.length ? editdata[item.name].toString(',') : ""
        } else {
          formData[item.name] = editdata && editdata[item.name] ? (typeof editdata[item.name] == 'number' ? editdata[item.name].toString() : editdata[item.name]) :item.defaultValue?item.defaultValue:"";
        }
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
      maxLength: item.maxLength,
      amount:item.actualamount
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
    validationObj = getFieldIsValid(value, fieldValidationError, fieldName,formdata);


    let errcount = validationObj.errcount;
    if (!errcount) {
      fieldValidationErrors[fieldName].isValid = true;
      fieldValidationErrors[fieldName].activeValidator = {};
    } else {
      fieldValidationErrors[fieldName].isValid = false;
      fieldValidationErrors[fieldName].activeValidator = validationObj.fieldValidationError.activeValidator;
    }
    setformErrors(fieldValidationErrors)
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
  const onHandleChange = (e, field) => {
    let target = e.target
    let fieldName=field.name
    let fieldValue
    let formdataset = {}
    const fields = {};
    let maxLength = 0;

    if (field && field.maxLength) {
      maxLength = parseInt(field.maxLength);
    }
    if (maxLength > 0 && target.value.length > maxLength) {
      target.value = target.value.substring(0, maxLength);
      return;
    }
    if(field.name === "servicetype"){
      target.value = target.value.replace(/[^a-z0-9_ ]/gi,'')
    }
    if(field.dataType==='numeric'){
      target.value=target.value.replace(/\D/g,'');
    }
    if(field.name=='thresholdtowaive'){
      setwaiverType(target.value)
    }
    if(fieldName == "actualamount"){
      // if(formdata.unit =='$'){
        target.value = validateAmount(formdata,target.value)
      // }
    }
    if(fieldName == "amount"){
      target.value = validateAmount(formdata,target.value,true)
    }
    if(fieldName == "unit"){
      if(formdata.actualamount>0 && formdata.unit){
        formdata.actualamount = ''
      }
      let amount = validateUnitAmount(formdata,target.value,"actualamount")
      fields["actualamount"] = amount
    }
    if (field.type == "multiSelectCheckbox") {
      fieldValue = e.length ? e.map(i => i.value) : '';
     fields[fieldName] = fieldValue;
   } else {
      fieldValue = target.value;
     fields[fieldName] = target.value;

   }
    if (isBtnValidate || formdata.unit=='%' ) {
      validateField(
        fieldName, fieldValue, fields, true
      );
    }
    formdataset = {
      ...formdata,
      ...fields
    }
    setformdata(formdataset)
    setdisable(false)
    let isValid=validateForm();
    if(isValid){
      setModalText('')
    }  
  }

  const onHandleBlur = (e, field) => {
    let target = e.target
    let formdataset = { ...formdata }
    let fieldName=field.name
    const fields = {};
    if(e.target.value<0.01 || ((fieldName=='amount' || fieldName=='actualamount'|| fieldName=='mingallons'|| fieldName=='minordervalue') && target.value=='.')){
      formdataset[field.name] = ''
    }else formdataset[field.name] = e.target.value.trim();

    setformdata(formdataset)
  }
  const getActualLoaction = (location) => {
    let locationArr =[]
    if(location&&location.includes("All the Above")){
       location.splice(-1)
       locationArr =  location
    } else {
      locationArr = location
    }
    return locationArr
  }
  const onClickSubmit = (e, item) => {
    if (item.name && item.name == "addNew") {
      setformdata({})
      setwaiverType("N/A")
      setaddNew(true)
      seteditModalShow(true)
    } else {
      setbtnValidate(true)
      setdisable(false)
      const fieldValidationErrors = {
        ...formErrors
      };
      if(formdata.servicetype){
       let isOnlySpace = formdata.servicetype.replace(/\s/g, '').length>0?false:true;
        if(isOnlySpace){
          formdata.servicetype ='';
        }
      }
      Object.keys(fieldValidationErrors).forEach((fieldName, index) => {
        validateField(
          fieldName,
          formdata[fieldName],
          { [fieldName]: formdata[fieldName] }
        );
      });

      let isValid = validateForm();
      let amountIsValid =false
      if(formdata.unit == '$'){
        amountIsValid = Number(formdata.actualamount) > Number(formdata.amount) ?false:true
      }else{
        amountIsValid = true
      }
      let isFatNumber = addNew?true:isValid && getFatNumberValidation(fatNumber);
      let locatns = getActualLoaction(formdata.locations);
      if (isValid && isFatNumber && amountIsValid) {
        setdisable(true)
        setServiceBusy(true)
        setBusy(true)
        setlocDisable(false)
        // setServiceBusy(false)
        setModalText('')
        setbtnValidate(false)
        let saveJSON = {}
        const isShown = false;
        const isinternal = false;
        if (addNew) {
          let userType = Storage.getItem('userType')
          if (userType.toLowerCase() == 'operator' || userType.toLowerCase() == 'fbo') {
            const isShown = true;
          }
          else if (userType.toLowerCase() == 'internal') {
            const isinternal = true;
          }
          let data = formdata;
          let amnt =  formdata.amount ? parseFloat(formdata.amount).toFixed(2) : "00.00";
          let actualamnt = formdata.actualamount?parseFloat(formdata.actualamount).toFixed(2) : "00.00";
          formdata["locations"] =  locatns
          saveJSON["payload"] = formdata;
          saveJSON.payload["amount"] = amnt;
          saveJSON.payload["actualamount"] = actualamnt;
          saveJSON.organizationName = selectedCompany;
          saveJSON.payload['loggedInuser'] = userEmail
          createAddService(saveJSON).then((res)=>{

            if(res[0]&&res[0][0]&&res[0][0].ErrMsg){
              setModalText(res[0][0].ErrMsg)
              setServiceBusy(false)
            }
            else if(res==undefined){
              setModalText("Error occured while processing data")
              setServiceBusy(false)

            }
            else {
              closeEditModal()
              setServiceBusy(false)
              let loc = ""
              let locLength = formdata?.locations?.length
              formdata?.locations?.forEach((val,index)=>{
                if(index == locLength-1){
                  loc = loc + val
                }else{
                  loc = loc + val+','
                }
              })
              let payload = {}
              payload.type = "create"
              payload.notificationMessage = fieldList[0].notifyMessage.msg1+formdata.servicetype+fieldList[0].notifyMessage.msg2+fieldList[0].notifyMessage.msg5+userEmail+ "."
              payload.organizationName = selectedCompany
              payload.loginUserName = userEmail
              payload.sendNotificationTo = "ORG Internal"
              payload.access_levels = ["Level 1 (Admin)"]
              payload.levelOfAccess =  accessLvl == "Super" ? "Level 1 (Admin)" : accessLvl == "Admin" ? "Level 2 (Standard)" : "Level 3 (Basic)"
              payload.isActionable = false
              payload.actionTaken = ""
              payload.category = "account"
              payload.readInd = false
              saveNotificationList(payload,dispatch).then((res)=>{
    
              })
              payload.access_levels = ["Level 2 (Standard)","Level 3 (Basic)"]
              payload.location = formdata.locations
                saveNotificationList(payload,dispatch).then((res)=>{
             })
            }
            let auditPayload = {"ModuleName":"Taxes and Fees",
            "TabName":"Additional Services",
            "Activity":formdata['servicetype']+" Added for "+selectedCompany,
            "ActionBy":Storage.getItem('email'),
            "Role":JSON.parse(Storage.getItem('userRoles')),
            "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
            saveAuditLogData(auditPayload, dispatch)
            setrefresh(refresh+1)
          })
        } else {
          let data = formdata;
          let amnt =  formdata.amount ? parseFloat(formdata.amount).toFixed(2) : "00.00";
          let actualamnt = formdata.actualamount?parseFloat(formdata.actualamount).toFixed(2) : "00.00";
          formdata["locations"] =  locatns
          saveJSON["payload"] = formdata;
          saveJSON.payload["amount"] = amnt;
          saveJSON.payload["actualamount"] = actualamnt;
          saveJSON.payload['loggedInuser'] = userEmail
          saveJSON.organizationName = selectedCompany;
          updateAddService(saveJSON).then((res) => {
            // setServiceBusy(true)
            if(res[0]&&res[0][0]&&res[0][0].ErrMsg){
              setModalText(res[0][0].ErrMsg)
              // setServiceBusy(false)
            }else if(res==undefined){
              setModalText("Error occured while processing data")
              // setServiceBusy(false)
            }
            else {
              closeEditModal()
              let loc = ""
              let locLength = formdata?.locations?.length
              formdata?.locations?.forEach((val,index)=>{
                if(index == locLength-1){
                  loc = loc + val
                }else{
                  loc = loc + val+','
                }
              })
              let payload = {}
              payload.type = "create"
              payload.notificationMessage = fieldList[0].notifyMessage.msg7+formdata.servicetype+fieldList[0].notifyMessage.msg4+loc+fieldList[0].notifyMessage.msg8+userEmail+ "."
              payload.organizationName = selectedCompany
              payload.loginUserName = userEmail
              payload.sendNotificationTo = "ORG Internal"
              payload.access_levels = ["Level 1 (Admin)"]
              payload.levelOfAccess =  accessLvl == "Super" ? "Level 1 (Admin)" : accessLvl == "Admin" ? "Level 2 (Standard)" : "Level 3 (Basic)"
              payload.isActionable = false
              payload.actionTaken = ""
              payload.category = "account"
              payload.readInd = false
              saveNotificationList(payload,dispatch).then((res)=>{
    
              })
              payload.access_levels = ["Level 2 (Standard)","Level 3 (Basic)"]
              payload.location = formdata.locations
                saveNotificationList(payload,dispatch).then((res)=>{
             })
              // setServiceBusy(false)
            }
            let auditPayload = {"ModuleName":"Taxes and Fees",
            "TabName":"Additional Services",
            "Activity":formdata['servicetype']+" Updated for "+selectedCompany,
            "ActionBy":Storage.getItem('email'),
            "Role":JSON.parse(Storage.getItem('userRoles')),
            "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
        saveAuditLogData(auditPayload, dispatch)
            setrefresh(refresh + 1)
          })
        }

      } else if(!isValid) {
        setModalText(fieldList[0].modal.validate.text)
        setServiceBusy(false)
      } else
        if(!isFatNumber){
          setModalText(fieldList[0].modal.fatNumber.text)
          setFatNumber(false)
          setServiceBusy(false)
        }else if(!amountIsValid){
          setModalText(fieldList[0].modal.threshold.text)
          setServiceBusy(false)
        } else{
          setModalText(fieldList[0].modal.validate.text)
          setServiceBusy(false)
        }
      
    }
  }
  const getFatNumberValidation = (num) => {
    let newValue = parseFloat(formdata.amount).toFixed(2)
    let newActualAmount = parseFloat(formdata.actualamount).toFixed(2)
    let errors = formErrors
    let feeAmountVal = parseFloat(feeAmount).toFixed(2)
    let actualFeeAmountVal = parseFloat(actualFeeAmount).toFixed(2)
    let val = parseFloat((
      feeAmountVal)/100).toFixed(2)
    let actualVal = (systemVariables.Fat_Finger_Threshold*actualFeeAmountVal)/100
    if(newActualAmount&&newActualAmount != actualFeeAmountVal&&actualFeeAmountVal>0 && num){
      if(newActualAmount<=actualFeeAmountVal - actualVal){
        errors.actualamount.isValid = false
        errors.actualamount.activeValidator.errorMessage = " "
        return false
      }else if(newActualAmount>=parseFloat(actualFeeAmountVal)+parseFloat(actualVal)){
        errors.actualamount.isValid = false
        errors.actualamount.activeValidator.errorMessage = " "
        return false
      }else{
        if(errors.actualamount){
          errors.actualamount.isValid = true
          errors.actualamount.activeValidator = {}
        }
        return true;                             
        
      }
    } 
    else if(newValue&&newValue != feeAmountVal&&feeAmountVal>0 && num){
      if(newValue<=feeAmountVal-val){
        errors.amount.isValid = false
        errors.amount.activeValidator.errorMessage = " "
        return false
      }else if(newValue>=parseFloat(feeAmountVal)+parseFloat(val)){
        errors.amount.isValid = false
        errors.amount.activeValidator.errorMessage = " "
        return false
      }else{
        if(errors.amount){
          errors.amount.isValid = true
          errors.amount.activeValidator = {}
        }
        return true;                             
        
      }
    }
    else {
      if(errors.actualamount){
        errors.actualamount.isValid = true
        errors.actualamount.activeValidator = {}
      }
      errors.amount.isValid = true
      errors.amount.activeValidator = {}
      return true;                             

    }
    setformErrors(errors)
  }
  const handleCheck = (e, item) => {
  }

  const clickEdit = (data) => {
    newRows.forEach((row) => {
      if (row.servicetype==data.service && row.fboaddlserviceid==data.taxID) {
        if(row.locations&&row.locations.length <= 1){
          setlocDisable(true)
        }
        let amount = row.amount&&parseFloat(row.amount).toFixed(2)
        let actualamount = row.actualamount&&parseFloat(row.actualamount).toFixed(2)
        row.amount = amount;
        row.actualamount = actualamount
        setformdata(row)
        setwaiverType(row.thresholdtowaive)
        setFeeAmount(row.amount)
        setActualFeeAmount(row.actualamount)
      }
    })
    seteditModalShow(true)
  }

  const clickDeactivate = (data) => {

    newRows.forEach((row) => {
      if (row.servicetype==data.service && row.fboaddlserviceid==data.taxID) {
        setuserId(row.fboaddlserviceid)
        setAddLocations(row.locations)
      }
    })
    setModalText(fieldList[0].modal.deactivate.text)
    setModalShow(true)
    document.getElementById('root').style.filter = 'blur(5px)';
  }
  const closeModal = () => {
    setModalShow(false);
    setModalText('')
    document.getElementById('root').style.filter = 'none';
  }
  const closeEditModal = () => {
    seteditModalShow(false);
    setformdata({})
    document.getElementById('root').style.filter = 'none';
    setaddNew(false)
    seteditModalShow(false)
    setwaiverType(' ')
    setbtnValidate(false)
    setModalText('')
    setFatNumber(true)
    setdisable(false)
    setlocDisable(false)
    setServiceBusy(false)
  }
  const successModal = () => {
    setModalShow(false)
    setModalText('')
    document.getElementById('root').style.filter = 'none';
    if (modalText == fieldList[0].modal.deactivate.text) {
      setBusy(true)
      let payload = {
        "addServiceId": userId.toString(),
        "loginUserName": userEmail

      }

      deleteAddService(payload).then((res) => {
        let auditPayload = {"ModuleName":"Taxes and Fees",
                                    "TabName":"Additional Services",
                                    "Activity":userId+" Deleted for "+selectedCompany,
                                    "ActionBy":Storage.getItem('email'),
                                    "Role":JSON.parse(Storage.getItem('userRoles')),
                                    "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
                                saveAuditLogData(auditPayload, dispatch)
        let loc = ""
        let locLength = addLocations?.length
        addLocations?.forEach((val,index)=>{
          if(index == locLength-1){
            loc = loc + val
          }else{
            loc = loc + val+','
          }
        })
        let payload = {}
        payload.type = "create"
        payload.notificationMessage = fieldList[0].notifyMessage.msg3+fieldList[0].notifyMessage.msg6+loc+fieldList[0].notifyMessage.msg5+userEmail+ "."
        payload.organizationName = selectedCompany
        payload.loginUserName = userEmail
        payload.sendNotificationTo = "ORG Internal"
        payload.access_levels = ["Level 1 (Admin)"]
        payload.levelOfAccess =  accessLvl == "Super" ? "Level 1 (Admin)" : accessLvl == "Admin" ? "Level 2 (Standard)" : "Level 3 (Basic)"
        payload.isActionable = false
        payload.actionTaken = ""
        payload.category = "account"
        payload.readInd = false
        saveNotificationList(payload,dispatch).then((res)=>{

        })
        payload.access_levels = ["Level 2 (Standard)","Level 3 (Basic)"]
        payload.location = addLocations
          saveNotificationList(payload,dispatch).then((res)=>{
        })
        setrefresh(refresh + 1)
      })
    }
  }
  const getOperatorFields = (item) => {
    switch (item.component.toUpperCase()) {

      case "BUTTON":
        return (<ButtonComponent
          Label={item.label}
          Type={item.type}
          className={item.styles.className}
          variant={item.variant}
          // disabled={!isEditable ? true :false}
          disabled={restricted}
          handleClick={(e) => onClickSubmit(e, item)} />)
    };
  }
  return (<>
    { !addServcieData ? <div className='table-loader'><Loader height="auto"/> </div>:
    <><div className={`${fieldList && fieldList[0].addNewBanking ? fieldList[0].addNewBanking.styles.colWidth : ''} bf-absolute`}>
      {fieldList && fieldList[0].addNewBanking ? getOperatorFields(fieldList[0].addNewBanking) : ''}
    </div>
      {fieldList && fieldList.length ?
        <div className='bf-table-container bf-additionalServices-table-container'>
          <BFTable
            sortEnabled={true}
            searchEnabled={true}
            Data={rows && rows}
            heading={fieldList[0].headCells}
            searchBy={["service", "location"]}
            primaryClick={clickEdit}
            secondaryClic={clickDeactivate}
            loading={loading}
            taxAccess={true}
            level2={isLevel2}
          >
          </BFTable>
        </div>
        : ""}
      {editmodalShow ? <EditFormModal
        onHide={() => closeEditModal()}
        formErrors={formErrors}
        formdata={formdata}
        filterLocation={filterLocation}
        isAdmin = {acclvl}
        show={editmodalShow}
        json={popUpJson}
        onHandleChange={onHandleChange}
        onHandleBlur={onHandleBlur}
        userType={userType}
        disable={disable}
        onClickSubmit={onClickSubmit}
        handleCheck={handleCheck}
        companyName = {selectedCompany}
        editDisable = {addNew ? false : true}
        locDisable = {locDisable}
        addNew={addNew}
        showError={modalText}
        submittedForm={serviceBusy}
        selectAll = {true}
      /> : ""}
      {fieldList &&
        <CustomModal
          show={modalShow}
          onHide={() => successModal()}
          close={() => closeModal()}
          hide={() => closeModal()}
          modelBodyContent={modalText}
          buttonText={modalText == fieldList[0].modal.deactivate.text ? fieldList[0].modal.deactivate.button1 : fieldList[0].modal.validate.button1}
          secondbutton={modalText == fieldList[0].modal.deactivate.text ? fieldList[0].modal.deactivate.button2 : ""}
        />}</>}
  </>
  );
}
export default AdditionalServices;