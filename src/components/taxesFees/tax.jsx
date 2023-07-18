import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Storage, jsonStringify } from '../../controls/Storage';
import BFTable from '../table/table'
import Loader from '../loader/loader';
import CustomModal from '../customModal/customModal';
import ButtonComponent from '../button/button';
import EditFormModal from '../customModal/editModal';
import { getFieldIsValid, getFormattedMMDDYY, getFormattedDDMMYY, validateAmount, validateUnitAmount } from '../../controls/validations';
import { adminAddUserSave } from "../../actions/adminAddUserService/adminAddUserService";
import { getAccessLevel } from '../../controls/commanAccessLevel';
import { useDispatch, useSelector } from 'react-redux';
import { taxfetchJSONData, getSelectedTab, getSelectedUser, fetchTaxData } from '../../actions/taxFees/taxActions';
import { createTax, deleteTax, getTaxTemplates, updateTax } from '../../actions/taxFees/taxService';
import parse from 'html-react-parser';
import { saveNotificationList } from '../../actions/notificationService/notificationAction';
import {saveAuditLogData } from '../../actions/auditLog/auditLogActions';
import { getSystemVariables } from '../../actions/accountAdminAction/adminService'
import {systemVariablesVal} from '../../actions/accountAdminAction/adminAction'

function User() {
  let { state } = useLocation()
  const [fieldList, setFieldList] = useState(null);
  const [rows, setRows] = useState(null);
  const [formdata, setformdata] = useState({});
  const [editmodalShow, seteditModalShow] = useState(false);
  const [formErrors, setformErrors] = useState({});
  const [isBtnValidate, setbtnValidate] = useState(false);
  const [modalText, setModalText] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [refresh, setrefresh] = useState(0);
  const [newRows, setnewRows] = useState([]);
  const [addNew, setaddNew] = useState(false);
  const [locDisable, setlocDisable] = useState(false);
  const [isEditFlds, setIsEditFlds] = useState(false);
  const [data, setData] = useState(0);
  const [restricted, setrestricted] = useState(true);
  const [taxId, setTaxId] = useState(0);
  const [serviceBusy, setServiceBusy] = useState(false);
  const [taxType, setTaxType] = useState('');
  const [taxLocation, setTaxLocation] = useState([]);
  const [headcells, setHeadcells] = useState([]);
  const [fldDisable, setFldDisable] = useState(true);
  const [addServDisable, setAddServDisable] = useState(true);
  const [isAddNew, setIsAddNew] = useState(true);
  const [loading, setLoading] = useState(true)
  const [filterLocation, setfilterLocation] = useState([]);
  const [acclvl, setacclvl] = useState(true);
  const [modalFields, setModalFields] = useState()
  const [isDateRange, setISDateRange] = useState("S")
  const [templates, setTemplates]= useState([])
  const [tempOptions, setTempOptions] = useState([])
  const [submitBtnEnabled, setSubmitBtnEnabled] = useState(false)
  const [fatNumber,setFatNumber] = useState(true)
  const [taxAmount,setTaxAmount] = useState(0)
  const [selectAllAbove,setSelectAllAbove] = useState(false)
  const [taxName,setTaxName] = useState(false)
  const [isLevel2, setIsLevel2] = useState(false);
  const [disable, setDisable] = useState(false);
  const [inValidStartDate, setInvalidStartDate] = useState(false);
  const [inValidEndDate, setInvalidEndDate] = useState(false); 
  const [globalSysVer, setGlobalSysVer] = useState([])
  
  const paylod = { 'blobname': 'tax.json' }
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const taxReducer = useSelector(state => state.taxHomeReducer);
  const accountHomeReducer = useSelector((state) => state.taxFeesHomeReducer);
  const jsonData = taxReducer && taxReducer.taxHomeJson && taxReducer.taxHomeJson.data && taxReducer.taxHomeJson.data.data;
  const taxData = taxReducer && taxReducer.taxDetails && taxReducer.taxDetails.data && taxReducer.taxDetails.data
  const loader = taxReducer && taxReducer.loading && taxReducer.loading;
  const selectedUser = taxReducer && taxReducer.selectedUser ? taxReducer.selectedUser.user : Storage.getItem('userType').toLocaleLowerCase();
  const selectedCompany = accountHomeReducer && accountHomeReducer.selectedCompany && accountHomeReducer.selectedCompany.company;
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
 
  function createData(type, name, status,location, id, addedBy, criteria, amount, unit, endDate, startDate, pricingType,buttons,loc) {
    let dataObj = {
      "taxname": name,
      "taxID":id,
      "location": location+[],
      "addedBy": addedBy,
      "criteria": pricingType == "Fixed" ? "Flat" : getFormattedFullYear(startDate, endDate), 
      "taxAmount": amount && amount,
      "taxUnit":unit,
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
    if(selectedUser == "internal"){
      dataObj = {
        "taxtype" : type,
        "taxname": name,
        "taxID":id,
        "status": status,
        "addedBy": addedBy,
        "criteria": pricingType == "Fixed"  ? "Flat" : getFormattedFullYear(startDate, endDate), 
        "taxAmount": amount && amount,
        "taxUnit":unit,
        "Buttons": [{ "Label": "Edit", "method": "onEditClick", "className": "btn btn-bf-primary" }, { "Label": "Delete", "method": "onDeactivateClick", "className": "btn-bf-secondary bf-mrgl20" }]
      }
    }
    return dataObj
  }

  const getFormattedFullYear = (startDate, endDate) => {
    let sDate = getFormattedMMDDYY(startDate)
    let eDate = getFormattedMMDDYY(endDate)
    return ["MultiLine",[sDate,eDate]];
  }

  useEffect (()=>{
    return(
      ()=>{
        document.getElementById('root').style.filter = 'none'
      })
 },[])

  useEffect(() => {
    setrefresh(0);
    let accessable = getAccessLevel(userType, accessLvl)
    if (accessable) {
      setrestricted(false)
    }
    let req = {}
    if (selectedUser=="internal" || selectedUser=="barrel fuel"){
      req.userRole = "BF-Admin"
    }
    else if(selectedUser=="fbo"){ 
      req.userRole = "FBO"
    }
    req.organization = selectedCompany
    req.loggedInuser = userEmail

    if(req){
      fetchTaxData(dispatch, req)
    }
    taxfetchJSONData(paylod, dispatch)
    
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
        setGlobalSysVer(systemVariable)
        
    })

  }, [refresh,selectedCompany,selectedUser]);
 
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
    let userRows = [];
    let response = taxData&&taxData.length&&taxData[0][0]&&taxData[0][0]['cast(JSON_UNQUOTE(@jsonresult) as json)']
    response = response!=undefined&&JSON.parse(response)
    let responseData = response&&response.res?response.res:[]
    responseData&&responseData.sort((a, b) => b.taxid - a.taxid);
    responseData && responseData.length && responseData.map((item, index) => {
      let amount = item.amount!=null&&item.amount?item.amount.toFixed(2):"00.00";
      let roleData = [];
      let location = item.locations && item.locations
      item.roles && item.roles.map((i) => {
        roleData.push(i.roleType)
      })
      let accessLevel = [];
      item.accessLevel && item.accessLevel.map((j) => {
        accessLevel.push(j.accessLevels)
      })
      userRows.push(createData(item.taxtype, item.taxname, item.status,location,item.taxid, item.addedBy, item.criteria, amount, item.unit, item.endDate, item.startDate, item.pricingType ,data && data[0].Buttons,loc))
    })
    setnewRows(responseData)
    setRows(userRows)
    setLoading(loader && loader)
  }, [loader, taxData])
  const [editModalFields, setEditModalFields] = useState();
  useEffect(()=>{
    let data = jsonData && jsonData.taxData;
    let header = data && data[0].headCells.filter((item)=>item.user.includes(selectedUser))
    let editFields = {}
    let dynamicValue = isDateRange
    let fields = selectedUser && data && data[0].taxFields.fields.filter((fld)=>fld.user.includes(selectedUser.toLocaleLowerCase()))
    let requiredFields = {"fields" : fields}
    let taxfields = fields && fields.filter((fld)=>fld.dateRange.includes(dynamicValue))
    let editModalFields = taxfields?.filter((fld)=>fld.isEdit)
    editFields["fields"] = isEditFlds? editModalFields : taxfields
    if(addNew){
      seteditModalShow(true)
      editFields["fields"] = taxfields
    }
    setFieldList(data)
    setHeadcells(header)
    setEditModalFields(requiredFields)
    setModalFields(editFields)
    setInitialState(editFields, false,formdata)
  },[jsonData,isDateRange,selectedUser,isAddNew])


  const setInitialState = (fboData, clear, editdata) => {
    const formData = {};
    let formErrors = {};
    const fieldTypeArr = ['input', 'select', 'id', 'date',"multiselectcheckbox"];
    fboData && fboData.fields && fboData.fields.forEach((item) => {
      if (fieldTypeArr.includes(item.component.toLowerCase())) {
        if (item.name == 'location' && editdata && Array.isArray(editdata[item.name])) {
          formData[item.name] = editdata[item.name].length ? editdata[item.name] : []
        } else if (item.name == 'pricingType' && editdata ) {
          setISDateRange(editdata[item.name]? editdata[item.name] : "S")
          formData[item.name] = editdata[item.name] ? editdata[item.name]: item.defaultValue?item.defaultValue:""
        } else if (item.name == 'type' && (editdata || item.defaultValue )) {
          if(editdata&&editdata[item.name]?editdata[item.name]=="Create From Tax Template" : item.defaultValue == "Create From Tax Template"){
              getTaxTemplates().then((response)=>{
                let responseData =  response&&response.length&&response[0][0]&&response[0][0]['cast(JSON_UNQUOTE(@jsonresult) as json)']
                responseData = responseData!=undefined&&JSON.parse(responseData)
                let listOFtemplates = responseData&&responseData.res?responseData.res:[]
                setTemplates(listOFtemplates)
                let options = []
                listOFtemplates && listOFtemplates.forEach((item)=>{
                  options.push({title:item.taxname,value:item.taxname})
                })
                setTempOptions(options)
              })
              setFldDisable(false)
              setAddServDisable(false)
           }else{
            setFldDisable(true)
            if(editdata&&editdata[item.name] && editdata[item.name]=="Create New Additional Services Tax"){
              setAddServDisable(true)
            }else{
              setAddServDisable(false)
            }
           }
          formData[item.name] = editdata[item.name] ? editdata[item.name]: item.defaultValue?item.defaultValue:""
        }else {
          if((item.name == 'startDate' || item.name == 'endDate') && editdata) {
            let validFrom = getFormattedMMDDYY(new Date());
            let date = getFormattedMMDDYY(editdata[item.name]? editdata[item.name]:new Date())
              if(date == "NaN/NaN/NaN" && item.name == 'startDate'){
                formData[item.name] = validFrom
              }else if(date == validFrom && item.name == 'endDate'){
                formData[item.name] = ''
              }else{
                formData[item.name] = date
              }
          } else {
            formData[item.name] = editdata && editdata[item.name] ? (typeof editdata[item.name] == 'number' ? editdata[item.name].toString() : editdata[item.name]) : item.defaultValue?item.defaultValue:"";
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
          if((formdata['type'] == "Create New Tax" || formdata['type'] == "Create New Additional Services Tax") && fieldName == "taxTemplate"){
            formValid = true;
          }else if(formdata[fieldName] == "Sales Tax - Additional Services" && fieldName == "taxname"){
            formValid = true;
          }else{
            formValid = formErrors[fieldName].isValid;
          }
       }
    }
    return formValid;
  }
  const onHandleChange = (e, field) => {
    let target = e&&e.target
    let fieldValue 
    let fieldName = field.name
    let formdataset = {}
    let fields = {...formdata};
    let modalFlds = {}
    let maxLength = 0;
    let invalidDate = false;
    
    if (field && field.maxLength) {
      maxLength = parseInt(field.maxLength);
    }
    if (maxLength > 0 && target.value.length > maxLength) {
      target.value = target.value.substring(0, maxLength);
      return;
    }
    if(field.name === "taxname"){
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
    }
    if(fieldName == "pricingType"){
      setISDateRange(target.value)
      if(target.value == "Date Range"){
        fields["startDate"] = new Date()
        setDisable(false)
      }
    }
    if(fieldName == "type" ){
      if(target.value === "Create New Tax"){
        setFldDisable(true)
        setAddServDisable(false)
        fields= {}
        fields["type"] = "Create New Tax"
        setISDateRange("S")
      }else if (target.value === "Create New Additional Services Tax"){
        setFldDisable(true)
        setAddServDisable(true)
        fields= {}
        fields["type"] = "Create New Additional Services Tax"
        fields["taxname"] = "Sales Tax - Additional Services"
        setISDateRange("S")
      }else{
        fields["taxname"] = ""
        getTaxTemplates().then((response)=>{
          let responseData =  response&&response.length&&response[0][0]&&response[0][0]['cast(JSON_UNQUOTE(@jsonresult) as json)']
          responseData = responseData!=undefined&&JSON.parse(responseData)
          let listOFtemplates = responseData&&responseData.res?responseData.res:[]
          setTemplates(listOFtemplates)
          let options = []
          listOFtemplates && listOFtemplates.forEach((item)=>{
            options.push({title:item.taxname,value:item.taxname})
          })
          setTempOptions(options)
        })
        setFldDisable(false)
        setAddServDisable(false)
      }
    }
    if(field.name == "taxTemplate" ) {
      let tempData = templates
      tempData = tempData.filter((item)=>e.target.value === item.taxname)
      Object.keys(tempData[0]).map((keys)=>{
        if(keys !== "taxname"){
        fields[keys] = tempData[0][keys]
        if(keys == "pricingType" ){
          setISDateRange(tempData[0][keys])
        }
      }
      })
    }
    if (field.type == "multiSelectCheckbox") {
       fieldValue = e.length ? e.map(i => i.value) : '';
       fields[fieldName] = fieldValue;
        validateField(field.name, fieldValue, fields, true,[], formdata);

   } else if(field.name == 'startDate' || field.name == 'endDate') {
    if(e !=null){
      let selectedDate = e&&e.$d&&e.$d
      let date = getFormattedMMDDYY(selectedDate)
      let today = new Date();
      today.setHours(0,0,0,0)
      if(selectedDate == "Invalid Date" ) {
        invalidDate = "invalidDate";
        fieldValue = date;
        fields[fieldName] = date;
        // validateField(field.name, selectedDate, fields, true,[], formdata,invalidDate);
      } 
      else if (new Date(selectedDate) < today){
        invalidDate = true;
        fieldValue = date;
        fields[fieldName] = date;
      }
      else if(field.name == 'endDate'){
        let startDate = new Date(fields["startDate"]);
        startDate.setHours(0,0,0,0)
        if(new Date(selectedDate) < startDate){
          invalidDate = true;
          fieldValue = date;
          fields[fieldName] = date;
        } else{
          invalidDate = false;
          fieldValue = date;
          fields[fieldName] = date;
        }

      }else {
        if(field.name == 'startDate'){
          fields['endDate'] = ''
        }
        invalidDate = false;
        fieldValue = date;
        fields[fieldName] = date;
        // !disable&& validateField(field.name, selectedDate, fields, true,[],formdata, invalidDate);
      }
    }else{
      fieldValue = null;
      fields[fieldName] = null;
    }
   
   }else {
      fieldValue = target.value;
     fields[fieldName] = target.value;
   }
    if (isBtnValidate ||field.type=="date") {
      // if (isBtnValidate) {
      if(target){
        // validateField(target.name, target.value, fields, true,formdata,invalidDate);
      }
      else if(target==undefined && field.type == "multiselectcheckbox"){
        let fieldValue = e.length ? e.map(i => i.value) : null;
        // validateField(field.name, fieldValue, fields, true,formdata,invalidDate);
      }
      else if(field.type=="date"){
        let date = getFormattedDDMMYY(fieldValue)
        if(date != "NaN/NaN/NaN"){
          validateField(field.name, fieldValue, fields, true,formdata,invalidDate);

        }
      }
    }
    formdataset = {
      ...fields
    }
    setSubmitBtnEnabled(false)
    setformdata(formdataset)
  }

  const onHandleBlur = (e, field) => {
    let target = e.target
    let formdataset = { ...formdata }
    let fields = {};
    let fieldValue 
    let fieldName = field.name
    let invalidDate= false
    if(field.name == 'startDate' || field.name == 'endDate') {
      if(e !=null && e.target.value != ""){
        let selectedDate = e.target.value
        let date = getFormattedMMDDYY(selectedDate)
        let today = new Date();
        today.setHours(0,0,0,0)
        if(date == "NaN/NaN/NaN" ) {
          invalidDate = "invalidDate";
          fieldValue = date;
          fields[fieldName] = date;
          // validateField(field.name, selectedDate, fields, true,[], formdata,invalidDate);
        } 
        else if (new Date(date) < today){
          invalidDate = true;
          fieldValue = date;
          fields[fieldName] = date;
        }
        else if(field.name == 'endDate'){
          let startDate = new Date(fields["startDate"]);
          startDate.setHours(0,0,0,0)
          if(new Date(selectedDate) < startDate){
            invalidDate = true;
            fieldValue = date;
            fields[fieldName] = date;
          } else{
            invalidDate = false;
            fieldValue = date;
            fields[fieldName] = date;
          }
  
        }else {
          if(field.name == 'startDate'){
            fields['endDate'] = date
          }
          invalidDate = false;
          fieldValue = date;
          fields[fieldName] = date;
          // !disable&& validateField(field.name, selectedDate, fields, true,[],formdata, invalidDate);
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
     
     }else {
        fieldValue = target.value;
       fields[fieldName] = target.value;
     }
      if (isBtnValidate ||field.type=="date") {
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
      }
    if(e.target.value<0.01){
      formdataset[field.name] = ''
    }else if(fieldName=='amount' && target.value=='.'){
      formdataset[field.name] = ''
    }else formdataset[field.name] = e.target.value.trim();
    // if (field.name == "access") {

    //   let value = {
    //     "accessLevel": target.value
    //   }

    //   adminAddUserSave(value).then(response => {
    //     formdataset['accessLevel'] = response.data.serialNumber === undefined ? '' : response.data.accessLevel;
    //     formdataset['roles'] = response.data.manufacturer === undefined ? '' : response.data.roles;
    //     //   formdataset['aircraftType'] = response.data.aircraftType === undefined ? '' : response.data.aircraftType;
    //     //   setformdata(formdataset)
    //   })
    // } 

      setformdata(formdataset)
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
      setISDateRange("S")
      setIsAddNew(!isAddNew)
      setaddNew(true)
      setDisable(false)
      setIsEditFlds(false)
    } else {
      setbtnValidate(true)
      const fieldValidationErrors = {
        ...formErrors
      };
      if(formdata.taxname){
        let isOnlySpace = formdata.taxname.replace(/\s/g, '').length>0?false:true;
         if(isOnlySpace){
           formdata.taxname ='';
         }
       }
      Object.keys(fieldValidationErrors).forEach((fieldName, index) => {
        if(fieldName =="startDate" || fieldName =="endDate"){
            let selectedDate =  getFormattedMMDDYY(formdata[fieldName])
            let today = new Date();
            today.setHours(0,0,0,0)
            if( selectedDate == "Invalid Date" || selectedDate== "NaN/NaN/NaN"){validateField(fieldName, formdata[fieldName], { [fieldName]: formdata[fieldName]}, true, formdata,'invalidDate');
          }else if(new Date(selectedDate) < today && !disable) {
              validateField(fieldName, formdata[fieldName], { [fieldName]: formdata[fieldName]}, true, formdata,true);
            } else if(fieldName == 'endDate'){
              let startDate = new Date(formdata["startDate"]);
                  startDate.setHours(0,0,0,0)
                  if( selectedDate == "Invalid Date" || selectedDate== "NaN/NaN/NaN"){validateField(fieldName, formdata[fieldName], { [fieldName]: formdata[fieldName]}, true, formdata,'invalidDate');
                } else
                  if(new Date(selectedDate) < startDate){
                    validateField(fieldName, formdata[fieldName], { [fieldName]: formdata[fieldName]}, true, formdata,true);
                  } else{
                    validateField(fieldName, formdata[fieldName], { [fieldName]: formdata[fieldName]}, true,formdata, false);
                  }
            }else {
              validateField(fieldName, formdata[fieldName], { [fieldName]: formdata[fieldName]}, true,formdata, false);
            }
          } else{
            if(formdata[fieldName] == "Sales Tax - Additional Services" && fieldName == "taxname"){

            }else{
              validateField(fieldName,formdata[fieldName],{ [fieldName]: formdata[fieldName]},true,formdata,false)
            }
          }
        });
 
      let isValid = validateForm();
      let isFatNumber = addNew?true:isValid && getFatNumberValidation(fatNumber);
      if (isValid && isFatNumber) {
        setServiceBusy(true)
        setbtnValidate(false)
        setSubmitBtnEnabled(true)
        setlocDisable(false)
        let saveJSON = {}
        const isShown = false;
        const isinternal = false;
        let userType = selectedUser
          if ( userType.toLowerCase() == 'fbo') {
            saveJSON.role = "FBO";
          }
          else if (userType.toLowerCase() == 'internal') {
            saveJSON.role = "BF-Admin";
          }
        saveJSON.organizationName = selectedCompany;
        
        if (addNew) {
          let amount = formdata.amount ? parseFloat(formdata.amount).toFixed(2):"00.00"
          let payload = {
            taxName: formdata.taxname ? formdata.taxname : "",
            taxType: formdata.taxtype ? formdata.taxtype : "Custom Tax",
            unit: formdata.unit ? formdata.unit : "",
            amount: amount,
            pricingType: formdata.pricingType ? formdata.pricingType : "",
            startDate: formdata.startDate ? getFormattedDDMMYY(formdata.startDate) : '',
            endDate: formdata.endDate ? getFormattedDDMMYY(formdata.endDate) : '' ,
            //locations: formdata.location,
            locations: getActualLoaction(formdata.locations),
            loggedInuser : userEmail
          }

          saveJSON.payload= payload;

          delete saveJSON.payload.taxid
          createTax(saveJSON).then((res)=>{
            if(res[0]&&res[0][0]&&res[0][0].ErrMsg){
              setModalText(res[0][0].ErrMsg)
              setServiceBusy(false)
            }else if(res==undefined){
              setModalText("Error occured while processing data")
              setServiceBusy(false)
            }
            else {
              closeEditModal()
              setServiceBusy(false)
            }
            setrefresh(refresh+1)
            let payload = {}
            let Fedmessage = fieldList[0].notifyMessage.msg1+formdata.taxname+fieldList[0].notifyMessage.msg2+userEmail+ "."
            let customTaxMSG = fieldList[0].notifyMessage.newTax+formdata.taxname+fieldList[0].notifyMessage.newTax1+ (formdata.locations+[]) + ' by ' + userEmail+ "."
            payload.type = "create"
            payload.notificationMessage = formdata.taxtype == 'Federal/State Tax' ? Fedmessage : selectedCompany ? customTaxMSG : ''
            payload.organizationName = selectedCompany
            payload.loginUserName = userEmail
            payload.sendNotificationTo = formdata.taxtype == 'Federal/State Tax'? "FBO": "ORG Internal"
            payload.access_levels = formdata.taxtype == 'Federal/State Tax' ? ["Level 1 (Admin)","Level 2 (Standard)","Level 3 (Basic)"] :["Level 1 (Admin)"]
            payload.levelOfAccess = access == "Super" ? "Level 1 (Admin)" : access == "Admin" ? "Level 2 (Standard)" : "Level 3 (Basic)"
            payload.isActionable = false
            payload.actionTaken = ""
            payload.category = "account"
            payload.readInd = false
            // payload.location = formdata.locations ? formdata.locations :''
            let payload2 = {...payload} 
            payload2.access_levels = ["Level 2 (Standard)","Level 3 (Basic)"]
            payload2.location = formdata.locations
            saveNotificationList(payload,dispatch).then((res)=>{
  
            })
            if(selectedCompany && formdata.taxtype != 'Federal/State Tax' ){
              saveNotificationList(payload2,dispatch).then((res)=>{
  
              })
            }
            let activity = selectedUser == "fbo"?formdata.taxname +" Added for"+selectedCompany :formdata.taxname +" Added";
            let auditPayload = {"ModuleName":"Taxes and Fees",
                                    "TabName":"Taxes",
                                    "Activity":formdata.taxname +" Added",
                                    "ActionBy":Storage.getItem('email'),
                                    "Role":JSON.parse(Storage.getItem('userRoles')),
                                    "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
                                saveAuditLogData(auditPayload, dispatch)
          })
        } else {
          let data = formdata;
          let amount = formdata.amount ? parseFloat(formdata.amount).toFixed(2):"00.00"
          let payload = {
            taxName: formdata.taxname ? formdata.taxname : "",
            taxType: formdata.taxtype ? formdata.taxtype : "",
            unit: formdata.unit ? formdata.unit : "",
            amount: amount,
            pricingType: formdata.pricingType ? formdata.pricingType : "",
            startDate: formdata.startDate ? getFormattedDDMMYY(formdata.startDate) : '',
            endDate: formdata.endDate ? getFormattedDDMMYY(formdata.endDate) : '' ,
            taxid: formdata.taxid,
            //locations: formdata.location,
            locations: getActualLoaction(formdata.locations),
            loggedInuser : userEmail
          }
          saveJSON.payload= payload;
          saveJSON.organizationName = selectedCompany;
          updateTax(saveJSON).then((res) => {
            let errorMsg = res&&res[0]&&res[0][0]&&res[0][0].ErrMsg?res[0][0].ErrMsg:""
            if(res[0]&&res[0][0]&&res[0][0].ErrMsg){
              setModalText(res[0][0].ErrMsg)
            }else if(res==undefined){
              setModalText("Error occured while processing data")
            }
            else {
              closeEditModal()
            }
            setrefresh(refresh+1)
            let loc = ""
            let locLength = formdata?.locations?.length
            formdata?.locations?.forEach((val,index)=>{
              if(index == locLength-1){
                loc = loc + val
              }else{
                loc = loc + val+','
              }
            })
            if(res[0]&&res[0][0]&&res[0][0].ErrMsg){
              setModalText(res[0][0].ErrMsg)
            }else if(res==undefined){
              setModalText("Error occured while processing data")
            }
            else {
              closeEditModal()
            }
            let payload = {}
            let Fedmessage = fieldList[0].notifyMessage.msg3+formdata.taxname+fieldList[0].notifyMessage.msg6+userEmail+ "."
            let customTaxMSG = fieldList[0].notifyMessage.exsitingTax+formdata.taxname+fieldList[0].notifyMessage.exsitingTax1+ (formdata.locations+[]) + ' by ' + userEmail+ "."
            payload.type = "update"
            payload.notificationMessage = formdata.taxtype == 'Federal/State Tax' ? Fedmessage : selectedCompany ? customTaxMSG : ''
            payload.organizationName = selectedCompany
            payload.loginUserName = userEmail
            payload.sendNotificationTo =  formdata.taxtype == 'Federal/State Tax'? "FBO": "ORG Internal"
            payload.access_levels = ["Level 1 (Admin)","Level 2 (Standard)","Level 3 (Basic)"]
            payload.levelOfAccess = access == "Super" ? "Level 1 (Admin)" : access == "Admin" ? "Level 2 (Standard)" : "Level 3 (Basic)"
            payload.isActionable = false
            payload.actionTaken = ""
            payload.category = "account"
            payload.readInd = false
            payload.location = formdata.locations ? formdata.locations :''
            let payload2 = payload 
            payload2.access_levels = ["Level 2 (Standard)","Level 3 (Basic)"]
            payload2.location = formdata.locations
            saveNotificationList(payload,dispatch).then((res)=>{
  
            })
            if( selectedCompany && formdata.taxtype != 'Federal/State Tax' ){
              saveNotificationList(payload2,dispatch).then((res)=>{
  
              })
            }
            let activity = selectedUser == "fbo"?formdata.taxname +" Updated for "+selectedCompany :formdata.taxname +" Updated";
            let auditPayload = {"ModuleName":"Taxes and Fees",
                                    "TabName":"Taxes",
                                    "Activity":activity,
                                    "ActionBy":Storage.getItem('email'),
                                    "Role":JSON.parse(Storage.getItem('userRoles')),
                                    "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
                                saveAuditLogData(auditPayload, dispatch)
            setrefresh(refresh + 1)
          })
        }
      }  else if(!isValid) {
        setModalText(fieldList[0].modal.validate.text)
       
      } else if(!isFatNumber){
          setModalText(fieldList[0].modal.fatNumber.text)
          setFatNumber(false)
       
        }else{
          setModalText(fieldList[0].modal.validate.text)
       
      }
    }

  }

  const handleCheck = (e, item) => {
  }

  const clickEdit = (data) => {
    newRows.forEach((row) => {
      if ((row.taxname === data.taxname) &&  row.taxid == data.taxID) {
        let fields = row.pricingType == "Date Range" ? editModalFields : modalFields
        if(row.locations&&row.locations.length <= 1){
          setlocDisable(true)
        }
        let amount = row.amount&&parseFloat(row.amount).toFixed(2)
        row.amount = amount;
        if(row.taxname=='Sales Tax - Additional Services'){
          setAddServDisable(true)
          setFldDisable(true)
        }
        setaddNew(false)
        setDisable(true)
        setIsEditFlds(true)
        setISDateRange(row.pricingType)
        setformdata(row)
        setTaxAmount(amount)
      }
    })
    seteditModalShow(true)
    setServiceBusy(false)
  }

  const clickDeactivate = (data) => {

    newRows.forEach((row) => {
      if ((row.taxname === data.taxname) &&  row.taxid == data.taxID) {
        setTaxId(row.taxid)
        setTaxName(row.taxname)
        setTaxType(row.taxtype)
        setTaxLocation(row.locations? row.locations:'')
      }
    })
    setModalText(fieldList[0].modal.deactivate.text)
    setModalShow(true)
    document.getElementById('root').style.filter = 'blur(5px)';
  }
  const closeModal = () => {
    setModalShow(false);
    setModalText('')
    setaddNew(false)
    setDisable(false)
    setIsEditFlds(false)
    setformdata({})
    setModalText('')
    document.getElementById('root').style.filter = 'none';
  }
  const closeEditModal = () => {
    seteditModalShow(false);
    setTaxAmount(0)
    setIsEditFlds(true)
    document.getElementById('root').style.filter = 'none';
    setaddNew(false)
    setDisable(false)
    seteditModalShow(false)
    setISDateRange("S")
    setbtnValidate(false)
    setModalText('')
    setlocDisable(false)
    setSubmitBtnEnabled(false)
    setFatNumber(true);
    setServiceBusy(false)
    setAddServDisable(false)

  }
  const successModal = () => {
    setModalShow(false)
    setModalText('')
    document.getElementById('root').style.filter = 'none';
    if (modalText == fieldList[0].modal.deactivate.text) {
      let payload = {
        "taxId": taxId.toString(),
        "userRole": selectedUser == "fbo"? "FBO" : "BF-Admin",
        "organization": selectedCompany
      }
      deleteTax(payload).then((res) => {
        setrefresh(refresh + 1)
        let payload = {}
            let Fedmessage = fieldList[0].notifyMessage.msg3+formdata.taxname+fieldList[0].notifyMessage.deleteTax1+userEmail+ "."
            let customTaxMSG = fieldList[0].notifyMessage.exsitingTax+formdata.taxname+fieldList[0].notifyMessage.deleteTax+ (formdata.locations+[]) + ' by ' + userEmail+ "."
            payload.type = "delete"
            payload.notificationMessage = taxType == 'Federal/State Tax' ? Fedmessage : selectedCompany ? customTaxMSG : ''
            payload.organizationName = selectedCompany
            payload.loginUserName = userEmail
            payload.sendNotificationTo =  formdata.taxtype == 'Federal/State Tax'? "FBO": "ORG Internal"
            payload.access_levels = ["Level 1 (Admin)","Level 2 (Standard)","Level 3 (Basic)"]
            payload.levelOfAccess = access == "Super" ? "Level 1 (Admin)" : access == "Admin" ? "Level 2 (Standard)" : "Level 3 (Basic)"
            payload.isActionable = false
            payload.actionTaken = ""
            payload.category = "account"
            payload.readInd = false
            payload.location = taxLocation ? taxLocation :''
            let payload2 = payload 
            payload2.access_levels = ["Level 2 (Standard)","Level 3 (Basic)"]
            payload2.location = taxLocation
            saveNotificationList(payload,dispatch).then((res)=>{
  
            })
            if( selectedCompany && taxLocation != 'Federal/State Tax' ){
              saveNotificationList(payload2,dispatch).then((res)=>{
  
              })
            }
      })
      let activity = selectedUser == "fbo"?taxName +" Deleted for "+selectedCompany :taxName +" Deleted";
      let auditPayload = {"ModuleName":"Taxes and Fees",
                                    "TabName":"Taxes",
                                    "Activity":activity,
                                    "ActionBy":Storage.getItem('email'),
                                    "Role":JSON.parse(Storage.getItem('userRoles')),
                                    "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
                                saveAuditLogData(auditPayload, dispatch)
    }
  }
  const getFatNumberValidation = (num) => {
    let newValue = parseFloat(formdata.amount).toFixed(2);
    let taxAmountVal = parseFloat(taxAmount).toFixed(2)
    let val = parseFloat((systemVariables.Fat_Finger_Threshold*taxAmountVal)/100).toFixed(2);
    let errors = formErrors
    if(newValue&&newValue != taxAmountVal&&taxAmountVal>0 && num){
      if(newValue<=taxAmountVal - val){
        errors.amount.isValid = false
        errors.amount.activeValidator.errorMessage = " "
        return false
      }else if(newValue>=(parseFloat(taxAmountVal))+(parseFloat(val))){
        errors.amount.isValid = false
        errors.amount.activeValidator.errorMessage = " "
        return false
      }else{
        errors.amount.isValid = true
        errors.amount.activeValidator.errorMessage = {}
        return true;
      }
    } else {
      errors.amount.isValid = true
      //errors.amount.activeValidator.errorMessage = {}
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
  {/* { !taxData ? <div className='table-loader'><Loader height="auto"/> </div>:
    <> */}
    
    <div className={`${fieldList && fieldList[0].addNewBanking ? fieldList[0].addNewBanking.styles.colWidth : ''} bf-absolute`}>
      {fieldList && (selectedCompany || selectedUser=="internal") &&  fieldList[0].addNewBanking ? getOperatorFields(fieldList[0].addNewBanking) : ''}
    </div>
      {fieldList && fieldList.length ?
        <div className='bf-table-container bf-tax-table-container'>
          <BFTable
            sortEnabled={true}
            searchEnabled={true}
            Data={rows && rows}
            heading={headcells}
            searchBy={["taxname", "location"]}
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
        show={editmodalShow}
        json={modalFields}
        filterLocation={filterLocation}
        isAdmin = {acclvl}
        onHandleChange={onHandleChange}
        onHandleBlur={onHandleBlur}
        onClickSubmit={onClickSubmit}
        handleCheck={handleCheck}
        disabled={fldDisable}
        addServdis={addServDisable}
        companyName = {selectedCompany}
        tempOptions = {tempOptions}
        showError={modalText}
        // submittedForm={false}
        addNew = {addNew}
        editDisable = {disable}
        locDisable = {locDisable}
        //maxVal = {formdata['endDate'] ? formdata['endDate'] : null}
        maxVal = {formdata['startDate'] ? formdata['startDate'] : null}
        //maxVal = {formdata['endDate'] === 'NaN/NaN/NaN' && formdata['startDate'] !== 'NaN/NaN/NaN'?new Date(formdata['startDate']).setDate(new Date(formdata['startDate']).getDate() + 90): formdata['endDate'] ? formdata['endDate'] : new Date(formdata['startDate']).setDate(new Date(formdata['startDate']).getDate() + 90)}
        //minVal = {formdata['startDate'] ? formdata['startDate'] : null}
        minVal = {new Date()}
        disable = {submitBtnEnabled}
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
        />}</>
      // }
  // </>
  );
}
export default User;