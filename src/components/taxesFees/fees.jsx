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
import { getFieldIsValid, getFormattedDDMMYY, getFormattedMMDDYY, getFormattedYYMMDD, validateAmount, validateUnitAmount } from '../../controls/validations';
import { adminAddUserSave } from "../../actions/adminAddUserService/adminAddUserService";
import { getAccessLevel } from '../../controls/commanAccessLevel';

import { useDispatch, useSelector } from 'react-redux';
// import { fetchJSONData, fetchUserData } from '../../actions/userActions/userActions';
import { feefetchJSONData, fetchFeeData, getSelectedTab, getSelectedUser } from '../../actions/taxFees/feeActions';
import { createFee, deleteFee, getFeesTiers, updateFee } from '../../actions/taxFees/feeService';
import { get } from 'jquery';
import { saveNotificationList } from '../../actions/notificationService/notificationAction';
import {saveAuditLogData } from '../../actions/auditLog/auditLogActions';
import { getSystemVariables } from '../../actions/accountAdminAction/adminService'
import {systemVariablesVal} from '../../actions/accountAdminAction/adminAction'

function Fees() {
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
  const [isEditable, setIsEditable] = useState(false); 
  const [feesTiers, setFeesTiers] = useState([]);
  const [formFieldData, setFormFieldData] = useState([]);
  const [operatorCheck, setoperatorCheck] = useState(false);
  const [refresh, setrefresh] = useState(0);
  const [newRows, setnewRows] = useState([]);
  const [addNew, setaddNew] = useState(false);
  const [feeLocations, setFeeLocations] = useState([]);
  const [locDisable, setlocDisable] = useState(false);
  const [disable, setdisable] = useState(false);
  const [dateDisable, setDateDisable] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [name, setname] = useState(0);
  const [restricted, setrestricted] = useState(true);
  const [deletedFeeName, setDeletedFeeName] = useState('');
  const [userId, setuserId] = useState(0);
  const [serviceBusy, setServiceBusy] = useState(false);
  const [inValidStartDate, setInvalidStartDate] = useState(false);
  const [inValidEndDate, setInvalidEndDate] = useState(false); 
  const [isBusy, setBusy] = useState(true);
  const [filterLocation, setfilterLocation] = useState([]);
  const [acclvl, setacclvl] = useState(true);
  const [loading, setLoading] = useState(true)
  const [dynamicValue, setDynamicValue] = useState("S")
  const [modalFields, setModalFields] = useState()
  const [fixedFields, setFixedFields] = useState()
  const [dateFields, setDateFields] = useState()
  const [tierdFields, setTierdFields] = useState()
  const [isTiered, setIsTiered] = useState(false)
  const [fatNumber,setFatNumber] = useState(true)
  const [feeAmount,setFeeAmount] = useState(0)
  const [isLevel2, setIsLevel2] = useState(false);
  const [validStartDate, setValidStartDate] = useState(false);
  const [validEndDate, setValidEndDate] = useState(false);
  const paylod = { 'blobname': 'fees.json' }
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const feeReducer = useSelector(state => state.feeHomeReducer);
  const accountHomeReducer = useSelector((state) => state.taxFeesHomeReducer);
  const jsonData = feeReducer && feeReducer.feeHomeJson && feeReducer.feeHomeJson;
  const feeData = feeReducer && feeReducer.feeDetails && feeReducer.feeDetails;
  const loader = feeReducer && feeReducer.loading && feeReducer.loading;
  const selectedUser = accountHomeReducer && accountHomeReducer.selectedUser ? accountHomeReducer.selectedUser.user : Storage.getItem('userType').toLocaleLowerCase();
  const selectedCompany = accountHomeReducer && accountHomeReducer.selectedCompany && accountHomeReducer.selectedCompany.company
  const dashboardReducer = useSelector((state) => state.dashboardReducer)
  const profileDetails = dashboardReducer && dashboardReducer.profileData && dashboardReducer.profileData.data
  const loginReducer = useSelector(state => state.loginReducer);
  const loginDetails = loginReducer && loginReducer.loginDetails &&loginReducer.loginDetails.data;
  let loginDetls =  JSON.stringify(loginDetails) === '{}'?{}:JSON.parse(loginDetails);
  let userEmail = loginDetls.loginUserName?loginDetls.loginUserName:'';
  let accessLvl = loginReducer && loginReducer.loginAccessLevel&&loginReducer.loginAccessLevel.data&&loginReducer.loginAccessLevel.data?loginReducer.loginAccessLevel.data:[]
  const access =  JSON.parse(Storage.getItem('accessLevel'))[0]
  let userType = loginDetls.userType?loginDetls.userType:'';
  const adminReducer = useSelector((state) => state.AdminReducer)
  const systemVariables = adminReducer && adminReducer.systemVariables && adminReducer.systemVariables.data 
  
  function createData(location, name, status, addedBy, criteria, amount, unit,sDate, eDate, pricingType,tiers,id,buttons,loc) {
    let dataObj= {
      "location": location+[],
      "name": name,
      "taxID":id,
      "status": status ? status : "Inactive" ,
      "addedBy": addedBy,
      "criteria": pricingType == 'Fixed' ? "Flat" : pricingType == 'Date Range' ? getFormattedFullYear(sDate, eDate) : getTires("range",tiers),
      "feesAmount": pricingType == 'Tiered' ? getTires("amount",tiers) : amount,
      "taxUnit": unit,
      "Buttons": [{ "Label": "Edit", "method": "onEditClick", "className": "btn btn-bf-primary" }, { "Label": "Delete", "method": "onDeactivateClick", "className": "btn-bf-secondary bf-mrgl20", "checkAdminAccess" :true }]
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
 },[])

  useEffect(() => {
    let fees = feesTiers;
    let modalfees = tierdFields && tierdFields.fields;
    isTiered && fees && modalfees && modalfees.forEach((arr,index) => {
      if(arr.update != undefined) {
          fees.forEach((fee, i) => {
            if(fee.Name == arr.update) {
              let label = `${fee.Name}<br/>${fee.MinRange} ${fee.MaxRange ? "-" :""} ${fee.MaxRange ?  fee.MaxRange : "+"}`;
              modalfees[index].label = label;
              modalfees[index].isVisible = true;
              modalfees[index].dataType='numeric';
              modalfees[index].disable = false;
              modalfees[index].placeholder = '00.00';
              modalfees[index].styles.colWidth = "2 bf-md-fee-tiers"
            }
          })
      }
    })
    if(isTiered && fees && fees.length) {
      let modifiedFields={}
      modifiedFields["fields"] =  modalfees && modalfees.filter(item => item.isVisible)
      setModalFields(modifiedFields)
      setInitialState(modifiedFields,false,formdata)
    }
    
    let access=  accessLvl&&accessLvl.toLowerCase()
    if(access.includes("super") || selectedUser =='Barrel Fuel' || selectedUser =='internal' || userType=='Barrel Fuel'){
      setacclvl(false)
    }
  },[feesTiers,isTiered])
  useEffect(() => {
    setrefresh(0);
    let accessable = getAccessLevel(userType, accessLvl)
    if (accessable) {
      setrestricted(false)
    }
    let req = {}
    req.organization = selectedCompany
    req.loggedInuser = userEmail
    if(req){
      fetchFeeData(dispatch, req)
    }
    feefetchJSONData(paylod, dispatch)
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
    
  },[refresh,selectedCompany]);

  useEffect(() => {
    setRows(null)
    let loc=[]
    profileDetails && profileDetails.locationAccess && profileDetails.locationAccess.forEach((val)=>{
      if(val.accessLevel=='Level 2 (Standard)'){
        val.locations.forEach((location)=>{
          loc.push(location)
        })
      }
    })
    setfilterLocation(loc)
    let data = jsonData && jsonData.feeData;
    let userRows = [];
    let response =  feeData && feeData.data && feeData.data.length && feeData.data[0][0]['cast(JSON_UNQUOTE(@jsonresult) as json)']
    response= response && JSON.parse(response)

    let responseData = response && response.res
    responseData && responseData.map((item, index) => {
      let roleData = [];
      let amount = item.amount!=null&&item.amount?item.amount.toFixed(2):"00.00";
      let unit = item.unit
      if(item.Tiers.length<=1){
        unit = item.Tiers[0].unit
        amount = item.Tiers[0].tierValue!=null&&item.Tiers[0].tierValue?item.Tiers[0].tierValue.toFixed(2):"00.00"
      }
      userRows.push(createData(item.locations, item.feeName, item.status, item.addedBy, item.criteria, amount, unit,item.startDate, item.endDate, item.pricingType,item.Tiers,item.feeid,data && data[0].Buttons,loc))
    })
    setnewRows(responseData)
    setRows(userRows)
    setBusy(false);
    setLoading(loader && loader)
  }, [feeData, loader, selectedUser])
  useEffect(()=>{
    let data = jsonData && jsonData.feeData;
    let fixedFlds = {}
    let dateFlds = {}
    let tierdFlds = {}
    let dateField = data?.length && data && data[0]?.feesFields?.fields.filter((fld)=>fld.dynamicValue.includes("Date Range"))
    dateFlds["fields"] = dateField
    let fixedField = data?.length && data && data[0]?.feesFields?.fields.filter((fld)=>fld.dynamicValue.includes("Fixed"))
    fixedFlds["fields"] =fixedField
    let tierdField = data?.length && data && data[0]?.feesFields?.fields.filter((fld)=>fld.dynamicValue.includes("Tiered") )
    tierdFlds["fields"] =tierdField
    let taxfields =  data?.length && data && data[0]?.feesFields?.fields.filter((fld)=>fld.dynamicValue.includes(dynamicValue)&& fld.isVisible)
    let editFields = {}
    editFields["fields"] =  taxfields
    
    setFixedFields(fixedFlds)
    setTierdFields(tierdFlds)
    setDateFields(dateFlds)
    setModalFields(editFields)
    setFieldList(data)
    setInitialState(editFields, false,formdata)
  },[jsonData, dynamicValue])

  const setInitialState = (fboData, clear, editdata) => {
    const formData = {};
    let formErrors = {};
    const fieldTypeArr = ['input', 'select', 'id','date','multiselectcheckbox'];
    fboData && fboData?.fields?.forEach((item) => {
      if (fieldTypeArr.includes(item.component.toLowerCase())) {
        if (item.name == 'location' && editdata && Array.isArray(editdata[item.name])) {
          formData[item.name] = editdata[item.name].length ? editdata[item.name] : []
        } else if (item.name == 'pricingType' && editdata ) {
          setDynamicValue(editdata[item.name]? editdata[item.name]:"S")
          formData[item.name] = editdata[item.name] ? editdata[item.name]: ''
        } else if ((item.name == 'startDate' || item.name == 'endDate') && editdata) {
          let validFrom = getFormattedMMDDYY(new Date());
          let date = getFormattedMMDDYY(editdata[item.name])
            if(date == "NaN/NaN/NaN" && item.name == 'startDate'){
            formData[item.name] = validFrom
            }else if(date == "NaN/NaN/NaN" && item.name == 'endDate'){
              formData[item.name] = ''
            }else{
              formData[item.name] = date
            }
        } else{
          let data = editdata && editdata[item.name] ? (typeof editdata[item.name] == 'number' ? editdata[item.name].toString() : editdata[item.name]) :item.defaultValue?item.defaultValue:"";
          if(item.name.includes('Tier ')){
            if(data !== "" && data !== null){
              formData[item.name] = parseFloat(data).toFixed(2)  
            } else {
              formData[item.name] = data
            }
          } else {
            formData[item.name] = data
          }
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
      endDate:item.endDate,
      startDate:item.startDate
    };
  }
  
  const getFormattedFullYear = (startDate, endDate) => {
    let sDate = getFormattedMMDDYY(startDate)
    let eDate = getFormattedMMDDYY(endDate)
    return ["MultiLine",[sDate,eDate]];
  }

  const getTires = (type,tires) => {
    let tireList = tires&&tires.map((tire) => {
      if(type == 'amount') {
        return `${tire.unit && tire.unit == "$"? tire.unit : ""}${tire.tierValue ? parseFloat(tire.tierValue).toFixed(2):"00.00"}${tire.unit && tire.unit == "%"? tire.unit : ""}`
      } else if(type == 'newAmount'){

      }
      else {
        return `${tire.MinRange}${tire.MaxRange ? '-' + tire.MaxRange : "+" }`;
      }
    })
    return ["MultiLine",tireList]

  } 

  const validateField = (fieldName, value, fields, isTouched,formdata,invalidDate) => {
    const fieldValidationErrors = {
      ...formErrors
    };
    let fieldValidationError = null;

    fieldValidationError = fieldValidationErrors[fieldName];

    if (isTouched !== undefined) {
      fieldValidationError.isTouched = isTouched;
    }
    let validationObj = {};
    validationObj = getFieldIsValid(value, fieldValidationError, fieldName, formdata,invalidDate);


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
  const getTiers = (location)=>{
    let locactionData = []
    location.forEach((e)=>{
      locactionData.push({"Location":e})
    })
    let payload = {payload:{
      "FBO": selectedCompany,
      "AirportLocations":locactionData}
  }
    getFeesTiers(payload).then((response)=>{
      let  data = response && response.length>0 && response[0].length>0 && response[0][0]?response[0][0]:[]
      if(data&&data['JSON_UNQUOTE(@JSONResponse)']){
        let locdata =  JSON.parse((data['JSON_UNQUOTE(@JSONResponse)']))
        const tierData = locdata?.AiportLocations[0]?.FuelTypes[0]?.Tiers
        setFeesTiers(tierData)
        setDisableSubmit(false)
      }else{
        let err= data && data.error ? data.error : data.Msg?data.Msg:"Server Error"
        setModalText(err)
        setDisableSubmit(true)


      }
       
    })
  }
  const onHandleChange = (e, field) => {
    let target = e&&e.target
    let fieldValue 
    let fieldName = field.name
    let formdataset = {}
    const fields = {...formdata};
    let maxLength = 0;
    let invalidDate = false;
    if(field.dataType=='numeric'){
      target.value = target.value.replace(/(?!-)[^0-9.]/g, "" )
    }
    if (field && field.maxLength) {
      maxLength = parseInt(field.maxLength);
    }
    if (maxLength > 0 && target.value.length > maxLength) {
      target.value = target.value.substring(0, maxLength);
      return;
    }
    if(field.name == "pricingType" ){
      let flds = modalFields&&modalFields.fields
      flds&&flds.forEach((item)=>{
       if(item.name=="pricingType" && target.value == "Tiered" ){
         item.styles.colWidth='2'
       }else if(item.name=="pricingType" && target.value != "Tiered" ){
         item.styles.colWidth='4'
       }
       
      })
      if(target.value == 'Date Range'){
        setDateDisable(false)
      }
      setModalFields(flds)
      setModalText("")
      if(formdata["locations"]?.length && target.value == "Tiered"){
         getTiers(formdata["locations"])
         setIsTiered(true)
         setDisableSubmit(true)
      }else{
         setDisableSubmit(false)
      }
      setDynamicValue(target.value)
       fieldValue = target.value;
       fields[fieldName] = target.value;
     } else if(field.name == "locations"){
       if(formdata["pricingType"] && formdata["pricingType"] === "Tiered"){
         let locations = e.length ? e.map(i => i.value) : [];
         getTiers(locations)
         setIsTiered(true)
         setDisableSubmit(true)
       }else  setDisableSubmit(false)
        fieldValue = e.length ? e.map(i => i.value) : [];
        fields[fieldName] = fieldValue;
        validateField(field.name, fieldValue, fields, true,formdata,invalidDate);

     }
    else{
      if(field.name === "feeName"){
        target.value = target.value.replace(/[^a-z0-9_ ]/gi,'')
      }
      if(fieldName == "amount"){
        target.value = validateAmount(formdata,target.value)
      }
      if(fieldName == "unit"){
        if(formdata.amount>0 && formdata.unit){
          formdata.amount = ''
        }
        let amount = validateUnitAmount(formdata,target.value)
        fields["amount"] = amount
      }if(field.name == 'startDate' || field.name == 'endDate') {
        if(e !=null){
          let selectedDate = e&&e.$d&&e.$d
          let date = getFormattedMMDDYY(selectedDate)
          let today = new Date();
          today.setHours(0,0,0,0)
          if( selectedDate == "Invalid Date" ) {
            invalidDate = 'invalidDate';
            fieldValue = date;
            fields[fieldName] = date;
            // validateField(field.name, selectedDate, fields, true, formdata,invalidDate);
          } else if(new Date(selectedDate) < today){
            invalidDate = true;
            fieldValue = date;
            fields[fieldName] = date;
          }
          else {
            invalidDate = false;
            fieldValue = date;
            fields[fieldName] = date;
            // validateField(field.name, selectedDate, fields, true,formdata, invalidDate);
          }
          if(field.name == 'startDate'){
            setInvalidStartDate(invalidDate)
          } else if(field.name == 'endDate'){
            setInvalidEndDate(invalidDate)
          }
        }else{
          fieldValue = null;
          fields[fieldName] = null;
        }
        if(field.name == 'startDate' ){
          setValidStartDate(invalidDate)
          fields["endDate"] = ''

        }
        else{
          setValidEndDate(invalidDate)
        }
      }else {
          fieldValue = target.value;
        fields[fieldName] = target.value;
      }
      if(formdata['locations']&&formdata["locations"]?.length&&formdata['pricingType']&&formdata['pricingType']=="Tiered"){
        if(feesTiers?.length){
          feesTiers&&feesTiers.length&&feesTiers.forEach((tier)=>{
            if(tier.Name == fieldName){
              let amount = validateAmount(formdata,target.value)
              fieldValue = amount;
              fields[fieldName] = amount;
            }
            else if(fieldName == 'unit' && tier.Name in formdata){
              let amount = validateUnitAmount(formdata,target.value,formdata[tier.Name])
              formdata[tier.Name] = amount;
              fields[fieldName] = target.value;
              fields[tier.Name] = amount;
            }
          })
          setDisableSubmit(false)
        }else setDisableSubmit(true)
      }else setDisableSubmit(false)
   }
    if ( field.type=="date") {
      let date = getFormattedDDMMYY(fieldValue)
      if(date != "NaN/NaN/NaN"){
        validateField(
          field.name, fieldValue, fields, true,formdata,invalidDate
        );
      }
    }
    formdataset = {
      ...formdata,
      ...fields
    }
    setformdata(formdataset)
  }

  const onHandleBlur = (e, field) => {
    let target = e.target
    let formdataset = { ...formdata }
    let invalidDate = false
    let fieldValue 
    let fieldName = field.name
    const fields = {};
    if(e.target.value<0.01 || (fieldName=='amount' && target.value=='.')){
      formdataset[field.name] = ''
    }else {
      if(field.name.includes("Tier ")){
        if(target.value=='.'){
          formdataset[field.name] = ''
        }else{
          formdataset[field.name] = parseFloat(e.target.value).toFixed(2);
        }
      }else{
      
      formdataset[field.name] = e.target.value;}
    }
    if (field.type == "multiSelectCheckbox") {
      fieldValue = e.length ? e.map(i => i.value) : [];
    fields[fieldName] = fieldValue;
    }else if(field.name == 'startDate' || field.name == 'endDate') {
      if(e !=null){
        let selectedDate = target.value
        let date = getFormattedMMDDYY(selectedDate)
        let today = new Date();
        today.setHours(0,0,0,0)
        if(date == "NaN/NaN/NaN" ) {
          invalidDate = "invalidDate";
          fieldValue = selectedDate;
          fields[fieldName] = date;
        } 
        else if (new Date(date) < today){
          invalidDate = true;
          fieldValue = date;
          fields[fieldName] = date;
        } else {
          invalidDate = false;
          fieldValue = date;
          fields[fieldName] = date;
        }

      }else{
        fieldValue = null;
        fields[fieldName] = null;
        setInvalidStartDate(false)
        setInvalidEndDate(false)
      }
      if(field.name == 'startDate' ){
        setValidStartDate(invalidDate)
      }
      else if(field.name == 'endDate' ) {
        setValidEndDate(invalidDate)
      }
    }else {
        fieldValue = target.value;
      fields[fieldName] = target.value;
    }
    // if (field.type=="date") {
      // if (isBtnValidate) {
      if(target){
        validateField(field.name, fieldValue, fields, true,formdata,invalidDate);
      }
      else if(target==undefined && field.type == "multiselectcheckbox"){
        let fieldValue = e.length ? e.map(i => i.value) : null;
        validateField(field.name, fieldValue, fields, true,formdata,invalidDate);
      }
      else if(field.type=="date"){
        validateField(field.name, fieldValue, fields, true,formdata,invalidDate);
      }
    // }

    if (field.name == "access") {

      let value = {
        "accessLevel": target.value
      }

      adminAddUserSave(value).then(response => {
        formdataset['accessLevel'] = response.data.serialNumber === undefined ? '' : response.data.accessLevel;
        formdataset['roles'] = response.data.manufacturer === undefined ? '' : response.data.roles;
        
      })
    } else {
      setformdata(formdataset)
    }
      setformdata(formdataset)
  }
  const getTierValue = (formdata)=>{
    let tiers = feesTiers
    let fees = []
    tiers.forEach((tier,index)=>{
      let data = {
        basefuelprice : null,
        maxrange : tier.MaxRange,
        minrange : tier.MinRange,
        tier : index+1,
        tierValue : formdata[tier.Name]
      }
      fees.push(data)
    })
    return fees
  }
  const getActualLoaction = (location) => {
    if(location&&location.includes("All the Above")){
      location.splice(-1)
      return location
    } else {
      return location
    }
  }
  const onClickSubmit = (e, item) => {
    if (item.name && item.name == "addNew") {
      setformdata({})
      setInitialState(modalFields, false)
      setaddNew(true)
      setDateDisable(false)
      seteditModalShow(true)
      
    } else {
      setbtnValidate(true)
      setdisable(false)
      const fieldValidationErrors = {
        ...formErrors
      };
      if(formdata.feeName){
        let isOnlySpace = formdata.feeName.replace(/\s/g, '').length>0?false:true;
         if(isOnlySpace){
           formdata.feeName ='';
         }
       }
      Object.keys(fieldValidationErrors).forEach((fieldName, index) => {
        if(fieldName == 'startDate'){
          validateField(
            fieldName,
            formdata[fieldName],
            { [fieldName]: formdata[fieldName] },
            true,
            formdata,
            inValidStartDate
          );
        } else if(fieldName == 'endDate'){
          //setInvalidEndDate(invalidDate)
          validateField(
            fieldName,
            formdata[fieldName],
            { [fieldName]: formdata[fieldName] },
            true,
            formdata,
            inValidEndDate
          );
        }else {
          validateField(
            fieldName,
            formdata[fieldName],
            { [fieldName]: formdata[fieldName] },
            true,
            formdata,
          );
        }
      });

      let isValid = validateForm();
      let isFatNumber = addNew?true:isValid && getFatNumberValidation(fatNumber);
      if (isValid && isFatNumber) {
        setDisableSubmit(true)
        setServiceBusy(true)
        setBusy(true)
        // setServiceBusy(false)
        setModalText('')
        setFatNumber(true)
        setbtnValidate(false)
        setlocDisable(false)
        let saveJSON = {}
        if (addNew) {
          let amount = formdata.amount?parseFloat(formdata.amount).toFixed(2):"00.00"
          let reqpayload = {
            "feename":formdata.feeName,
            "startDate":formdata.startDate ? getFormattedYYMMDD(formdata.startDate) :formdata.startDate,
            "endDate":formdata.endDate ? getFormattedYYMMDD(formdata.endDate) : formdata.endDate,
            "unit":formdata.unit,
            "amount":amount,
            "pricingType":formdata.pricingType,
            "loggedInuser":userEmail,
            "locations": getActualLoaction(formdata.locations),
            "tiers": getTierValue(formdata)
          }
          saveJSON.payload=reqpayload;
          saveJSON.organizationName = selectedCompany;
          saveJSON.payload['loggedInuser'] = userEmail
          createFee(saveJSON).then((res)=>{
            if(res[0]&&res[0][0]&&res[0][0].ErrMsg){
              setModalText(res[0][0].ErrMsg)
            } else {
              closeEditModal()
            }
            let payload = {}
            payload.type = "create"
            payload.notificationMessage = fieldList[0].notifyMessage.msg1+formdata.feeName+fieldList[0].notifyMessage.msg2+(formdata.locations+[])+ ' by ' +userEmail+ "."
            payload.organizationName = selectedCompany
            payload.loginUserName = userEmail
            payload.sendNotificationTo = "ORG Internal"
            payload.access_levels = ["Level 1 (Admin)"]
            payload.levelOfAccess = access == "Super" ? "Level 1 (Admin)" : access == "Admin" ? "Level 2 (Standard)" : "Level 3 (Basic)"
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

            let activity = selectedUser == "fbo"?formdata.feeName +" Added for "+selectedCompany :formdata.feeName +" Added";
            let auditPayload = {"ModuleName":"Taxes and Fees",
                                    "TabName":"Fees",
                                    "Activity":activity,
                                    "ActionBy":Storage.getItem('email'),
                                    "Role":JSON.parse(Storage.getItem('userRoles')),
                                    "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
                                saveAuditLogData(auditPayload, dispatch)
            setrefresh(refresh+1)
          })

        } else {
          let data = formdata;
          if (Array.isArray(data.accessLevel)) {
            data.accessLevel = data.accessLevel[0]
          }
          if (Array.isArray(data.roles)) {
            data.roles = data.roles[0]
          }
          let amount = formdata.amount?parseFloat(formdata.amount).toFixed(2):"00.00"
          let reqpayload = {
            "feename":formdata.feeName,
            "startDate":formdata.startDate ? getFormattedYYMMDD(formdata.startDate) :formdata.startDate,
            "endDate":formdata.endDate ? getFormattedYYMMDD(formdata.endDate) : formdata.endDate,
            "unit":formdata.unit,
            "amount":amount,
            "pricingType":formdata.pricingType,
            "loggedInuser":userEmail,
            "locations": getActualLoaction(formdata.locations),
            "feesid":formdata.feeid,
            "tiers":getTierValue(formdata)
          }
          saveJSON.payload = reqpayload;
          saveJSON.organizationName = selectedCompany;
          saveJSON.payload['loggedInuser'] = userEmail
          updateFee(saveJSON).then((res) => {
            if(res[0]&&res[0][0]&&res[0][0].ErrMsg){
              setModalText(res[0][0].ErrMsg)
            } else {
              closeEditModal()
              setrefresh(refresh + 1)
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
              payload.type = "update"
              payload.notificationMessage = fieldList[0].notifyMessage.msg3+formdata.feeName+fieldList[0].notifyMessage.msg4+loc+fieldList[0].notifyMessage.msg5+userEmail+ "."
              payload.organizationName = selectedCompany
              payload.loginUserName = userEmail
              payload.sendNotificationTo = "ORG Internal"
              payload.access_levels = ["Level 1 (Admin)"]
              payload.levelOfAccess = access == "Super" ? "Level 1 (Admin)" : access == "Admin" ? "Level 2 (Standard)" : "Level 3 (Basic)"
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
              let activity = selectedUser == "fbo"?formdata.feeName +" Updated for "+selectedCompany :formdata.feeName +" Updated";
              let auditPayload = {"ModuleName":"Taxes and Fees",
                                    "TabName":"Fees",
                                    "Activity":activity,
                                    "ActionBy":Storage.getItem('email'),
                                    "Role":JSON.parse(Storage.getItem('userRoles')),
                                    "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
                                saveAuditLogData(auditPayload, dispatch)
          }})
        }

      } else if(!isValid) {
        setModalText(fieldList[0].modal.validate.text)
        setServiceBusy(false)
      } else if(!isFatNumber){
          setModalText(fieldList[0].modal.fatNumber.text)
          setFatNumber(false)
          setServiceBusy(false)
        }else{
          setModalText(fieldList[0].modal.validate.text)
          setServiceBusy(false)
      }
    }

  }

  const handleCheck = (e, item) => {
  }
  const getTieredRow = (row)=>{
    let rowData = row
    let data = {}
    row.Tiers.forEach((tier,index)=>{
      rowData[`Tier ${index+1}`] = tier.tierValue
    })
    return rowData

  }
  const clickEdit = (data) => {
    newRows.forEach((row) => {
      if ((row.feeName == data.name) && (row.addedBy == data.addedBy) && row.status == data.status && JSON.stringify(row.feeid) == JSON.stringify(data.taxID) ) {
        if(row.Tiers.length<=1){
          row.unit = row.Tiers[0].unit
          row.amount = row.Tiers[0].tierValue&&parseFloat(row.Tiers[0].tierValue).toFixed(2)  
        }
        if(row.pricingType == "Date Range"){
          setInitialState(dateFields, false, row)
          setDateDisable(true)
        }else if(row.pricingType == "Fixed"){
          setInitialState(fixedFields, false, row)
        }else if(row.pricingType == "Tiered"){
          let flds  = tierdFields &&tierdFields.fields
          flds && flds.forEach((item)=>{
            if(item.name == "pricingType"){
              item.styles.colWidth='2'
            }
          })
          setTierdFields({fields:flds})
          getTiers(row.locations)
          let rowData = getTieredRow(row)
          rowData.unit = row.Tiers[0].unit
          setformdata(rowData)
          setIsTiered(true)
        }
        
        if(row.locations.length <= 1){
          setlocDisable(true)
        }
        setFeeAmount(row.amount)
      }
    })
    setdisable(true)
    seteditModalShow(true)
    setServiceBusy(false)
  }

  const clickDeactivate = (data) => {

    newRows.forEach((row) => {
      if ((row.feeName == data.name) && (row.addedBy == data.addedBy) && row.status == data.status && JSON.stringify(row.feeid) == JSON.stringify(data.taxID) ) {
        setuserId(row.feeid)
        setFeeLocations(row.locations)
        setDeletedFeeName(row.feeName)
      }
    })
    setModalText(fieldList[0].modal.deactivate.text)
    setModalShow(true)
    document.getElementById('root').style.filter = 'blur(5px)';
  }
  const closeModal = () => {
    setformdata({})
    setModalShow(false);
    setModalText('')
    document.getElementById('root').style.filter = 'none';
  }
  const closeEditModal = () => {
    seteditModalShow(false);
    setDynamicValue("S")
    setFeesTiers([])
    setformdata({})
    setIsTiered(false)
    setlocDisable(false)
    document.getElementById('root').style.filter = 'none';
    setaddNew(false)
    setDateDisable(false)
    seteditModalShow(false)
    setInitialState(modalFields)
    setbtnValidate(false)
    setModalText('')
    setDisableSubmit(false)
    setFatNumber(true)
    setServiceBusy(false)
  }
  const successModal = () => {
    setModalShow(false)
    setModalText('')
    document.getElementById('root').style.filter = 'none';
    if (modalText == fieldList[0].modal.deactivate.text) {
      setBusy(true)
      let reqPayload = {
        feesid:userId
      }
      let payload = {
        "loginUserName": userEmail,
        "payload":reqPayload
      }

      deleteFee(payload).then((res) => {
        let activity = selectedUser == "fbo"?userId +" Deleted for "+selectedCompany :userId +" Deleted";
        let loc = ""
              let locLength = feeLocations?.length
              feeLocations?.forEach((val,index)=>{
                if(index == locLength-1){
                  loc = loc + val
                }else{
                  loc = loc + val+','
                }
              })
              let payload = {}
              payload.type = "delete"
              payload.notificationMessage = fieldList[0].notifyMessage.msg3+deletedFeeName+fieldList[0].notifyMessage.msg6+loc+fieldList[0].notifyMessage.msg5 +"the "+userEmail+ "."
              payload.organizationName = selectedCompany
              payload.loginUserName = userEmail
              payload.sendNotificationTo = "ORG Internal"
              payload.access_levels = ["Level 1 (Admin)"]
              payload.levelOfAccess = access == "Super" ? "Level 1 (Admin)" : access == "Admin" ? "Level 2 (Standard)" : "Level 3 (Basic)"
              payload.isActionable = false
              payload.actionTaken = ""
              payload.category = "account"
              payload.readInd = false
              saveNotificationList(payload,dispatch).then((res)=>{
    
              })
              payload.access_levels = ["Level 2 (Standard)","Level 3 (Basic)"]
              payload.location = feeLocations
              saveNotificationList(payload,dispatch).then((res)=>{
             })
        let auditPayload = {"ModuleName":"Taxes and Fees",
                                    "TabName":"Fees",
                                    "Activity":"Deleted Fees By "+userEmail,
                                    "ActionBy":Storage.getItem('email'),
                                    "Role":JSON.parse(Storage.getItem('userRoles')),
                                    "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
                                saveAuditLogData(auditPayload, dispatch)
        setrefresh(refresh + 1)

      })
    }
  }
  const getFatNumberValidation = (num) => {
    
    let newValue = parseFloat(formdata.amount).toFixed(2);
    let errors = formErrors
    let feeAmountVal = parseFloat(feeAmount).toFixed(2)
    let val = parseFloat((systemVariables.Fat_Finger_Threshold*feeAmountVal)/100).toFixed(2);
    if(newValue&&newValue != feeAmountVal && feeAmountVal>0 && num){
      if(newValue<=feeAmountVal - val){
        errors.amount.isValid = false
        errors.amount.activeValidator.errorMessage = " "
        return false
      }else if(newValue>=parseFloat(feeAmountVal)+parseFloat(val)){
        errors.amount.isValid = false
        errors.amount.activeValidator.errorMessage = " "
        return false
      }else{
        errors.amount.isValid = true
        errors.amount.activeValidator.errorMessage = {}
        return true;
      }
    } else {
      if(errors.amount){
        errors.amount.isValid = true
        //errors.amount.activeValidator.errorMessage = {}
      }
      return true;
    }
    setformErrors(errors)
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
    { !feeData ? <div className='table-loader'><Loader height="auto"/> </div>:
    <><div className={`${fieldList && fieldList[0].addNewBanking ? fieldList[0].addNewBanking.styles.colWidth : ''} bf-absolute`}>
      {fieldList && fieldList[0].addNewBanking ? getOperatorFields(fieldList[0].addNewBanking) : ''}
    </div>
      {fieldList && fieldList.length ?
        <div className='bf-table-container bf-fees-table-container'>
          <BFTable
            sortEnabled={true}
            searchEnabled={true}
            Data={rows && rows}
            heading={fieldList[0].headCells}
            searchBy={["location", "name"]}
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
        json={modalFields}
        onHandleChange={onHandleChange}
        onHandleBlur={onHandleBlur}
        companyName = {selectedCompany}
        userType={userType}
        onClickSubmit={onClickSubmit}
        handleCheck={handleCheck}
        showError={modalText}
        addNew = {addNew}
        editDisable = {dateDisable}
        locDisable = {locDisable}
        disable = {disableSubmit}
        submittedForm={serviceBusy}
        maxVal = {formdata['endDate'] ? formdata['endDate'] : null}
        minVal = {formdata['startDate'] ? formdata['startDate'] : null}
        selectAll = {true}
        //disable = {submitBtnEnabled}
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
export default Fees;