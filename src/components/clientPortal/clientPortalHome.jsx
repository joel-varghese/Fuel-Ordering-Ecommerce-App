import React,{useState,useEffect,useRef} from 'react';
import './clientPortalHome.scss';
import ButtonComponent from '../button/button';
import BFTable from '../table/table';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJSONData ,fetchDiscountData,getTailNumbersList,getOperatorForBulkupload,getDiscountSelectedCompany} from '../../actions/clientPortal/discountAction';
import { IoIosSearch } from 'react-icons/io'
import { Nav } from 'react-bootstrap';
import EditFormModal from '../customModal/editModal';
import CustomModal from '../customModal/customModal';
import { lookupService } from '../../services/commonServices';
import arrowDownIcon from '../../assets/images/arrow-down_icon.svg';
import { enablePopUp } from '../../actions/commonActions/commonActions';
import { Storage } from '../../controls/Storage';
import * as xlsx from "xlsx";
import { deleteDiscount ,addDiscount} from '../../actions/clientPortal/discountService';
import  DiscountTemplate  from '../../assets/files/DiscountTemplate.xlsx'
import { useNavigate } from 'react-router-dom';
import Loader from '../loader/loader';
import { getAccessLevel } from '../../controls/commanAccessLevel';
import { saveNotificationList } from '../../actions/notificationService/notificationAction';
import {saveAuditLogData } from '../../actions/auditLog/auditLogActions';
import { getSystemVariables } from '../../actions/accountAdminAction/adminService'
import {systemVariablesVal} from '../../actions/accountAdminAction/adminAction'

function ClientPortalHome() {

  const [editDiscountJson,seteditDiscountJson] = useState(null);
  const [portalHomeData, setPortalHomeData] = useState(null);
  const [fieldList, setFieldList] = useState(null);
  const [deactivateData, setDeactivateData] = useState([]);
  const [formFieldData , setFormFieldData] = useState([]);
  const [rows, setRows] = useState(null);
  const [companyValue, setCompanyValue] = useState("");
  const [newRows, setnewRows] = useState([]);
  const [companyDropDown, setCompanyDropDown] = useState([])
  const [companyList, setCompanyList] = useState([])
  const [loading, setLoading] = useState(false);
  const [editmodalShow, seteditModalShow] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [modalText, setModalText] = useState("");
  const [editFormdata, setEditFormdata] = useState({});
  const [formErrors, setformErrors] = useState({});
  const [modalTextForEdit, setModalTextForEdit] = useState("");
  const [addNew, setAddNew] = useState(false);
  const [isBtnValidate, setbtnValidate] = useState(false);
  const [companySearch, setCompanySearch] = useState(false);
  const [operatorVal,setOperatorVal] = useState('');
  const [selectedTailNums,setSelectedTailNums] = useState([]);
  const [tailNum,setTailNum] = useState([]);
  const [checked,setCheked] = useState(false);
  const [clear, setClear] = useState();
  const [disable , setdisable] = useState(true);
  const [fileType,setFileType] = useState('');
  const [results, setResults] = useState({});
  const [reset, setReset] = useState(null);
  const [isBulkUpload,setBulkUpload] =useState(false);
  const [searchLength,setSearchLength]=useState(3);
  const [disabled,setDisabled]=useState(true);
  const [showDeactivate, setShowDeactivate] = useState(false);
  const [restricted,setrestricted]=useState(true);
  const [discountAmount,setDiscountAmount]=useState(0)
  const [fatNUmber,setFatNumber] = useState(true)
  const [filterLocation, setfilterLocation] = useState([]);
  const [acclvl, setacclvl] = useState(true);
  const [serviceBusy,setServiceBusy]=useState(false);
  const [isLevel2, setIsLevel2] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const typeaheadRef = useRef(null);
  const paylod = { 'blobname': 'clientPortal.json' }
  const access = JSON.parse(Storage.getItem('accessLevel'))[0]
  const discountReducer = useSelector(state => state.discountReducer);
  const loginReducer = useSelector(state => state.loginReducer);
  const jsonData = discountReducer && discountReducer.discountJson && discountReducer.discountJson;
  const discountData = discountReducer && discountReducer.discountData && discountReducer.discountData;
  const loader = discountReducer && discountReducer.loading && discountReducer.loading;
  const loginDetails = loginReducer && loginReducer.loginDetails &&loginReducer.loginDetails.data;
  const selectedCompany = discountReducer && discountReducer.selectedCompany && discountReducer.selectedCompany.company;
  let tailNumbersData = []
  let loginDetls =  loginDetails&&JSON.stringify(loginDetails) === '{}'?{}:loginDetails&&JSON.parse(loginDetails);
  let userEmail = loginDetls.loginUserName?loginDetls.loginUserName:'';
  let organizationName = loginDetls.organizationName?loginDetls.organizationName:selectedCompany!=' '?selectedCompany:'';
  let accessLvl = loginReducer && loginReducer.loginAccessLevel&&loginReducer.loginAccessLevel.data&&loginReducer.loginAccessLevel.data?loginReducer.loginAccessLevel.data:[]
  let userType = loginDetls.userType?loginDetls.userType:'';
  const dashboardReducer = useSelector((state) => state.dashboardReducer)
	const profileDetails = dashboardReducer && dashboardReducer.profileData && dashboardReducer.profileData.data
  const AccountReducer = useSelector((state) => state.accountHomeReducer);
  const selectedUser = AccountReducer && AccountReducer.selectedUser && AccountReducer.selectedUser.user && AccountReducer.selectedUser.user;
  const commonReducer = useSelector((state) => state.commonReducer);
  const loggedInUserType =  commonReducer?.loggedInUserType?.data;
  const loggedInUser = commonReducer?.loggedInUser?.data
  const adminReducer = useSelector((state) => state.AdminReducer)
  const systemVariables = adminReducer && adminReducer.systemVariables && adminReducer.systemVariables.data 
  function createData(tailNumber,location, criteria, value, status, addedBy, buttons,loc) {
    let dataObj= {
      "tailNumber":tailNumber,
      "location":location,
      "criteria":criteria,
      "value":value,
      "status":status,
      "addedBy":addedBy,
      "Buttons":JSON.parse(JSON.stringify(buttons))
    };

    let acc=JSON.parse(accessLvl)
    if(!acc?.includes('Super') && userType.toLowerCase()!='barrel fuel'){
      if(acc?.includes('Admin')){
        setIsLevel2(true)
          if(!loc?.includes(location)){
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

  useEffect (()=>{
      fetchJSONData(paylod,dispatch)
      setResults(tailNumbersData)
      setCompanyValue(organizationName)
      getCompanyDropdown("FBO");
      let payload={};
      payload["FBO"] = organizationName;
      payload["loggedinuser"] = loggedInUser 
      fetchDiscountData(payload,dispatch)
      let accessable = getAccessLevel("FBO", accessLvl)
      if(accessable){
        setrestricted(false)
      }
      else if (userType=='Barrel Fuel'){
        setrestricted(false)
      }
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
  },[reset,organizationName])

    useEffect (()=>{
      let data = jsonData && jsonData.data && jsonData.data.data&& jsonData.data.data.dicountData&&jsonData.data.data.dicountData[0]?jsonData.data.data.dicountData[0]:{}
      setPortalHomeData(data)
      },[jsonData])

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
      setRows(null)
      let data = jsonData && jsonData.data && jsonData.data.data && jsonData.data.data.dicountData;
      let userRows = [];
      setInitialState(data && data[0].addNewDiscountInformation)
      let response = discountData && discountData.data 
      let res = response && response.length>0 && response[0].length>0 && response[0][0]?response[0][0]:{}
      let dataObj = res && res['JSON_UNQUOTE(@JSONResponse)']?JSON.parse(res['JSON_UNQUOTE(@JSONResponse)']):[]
      dataObj.sort((a, b) => b.DiscountID - a.DiscountID);
      //console.log(dataObj)
      let homeData = dataObj.filter((value, index, self) =>
        index === self.findIndex((t) => (
          t.Location == value.Location && t.tailnumber == value.tailnumber
        ))
      )
      homeData&&homeData.map((e,i)=>{
          let isActive = e.Status == 1?'Active':'Inactive';
          userRows.push(createData(e.tailnumber,e.Location, e.Criteria, e.Value, isActive ,e.AddedBy, data && data[0].Buttons,loc))
      })
      setFieldList(data)
      setnewRows(homeData)
      //console.log(homeData)
      setRows(userRows)
      setLoading(loader&& loader)
    },[jsonData,loader,discountData,reset])
  
    const getCompanyDropdown = (userType)=>{
      let header = {
        "userType": userType
      }
      let requestData = {
        "serviceName": "companyName",
        "headers" : header
      }
      if(userType != 'internal') {
      lookupService(requestData).then(((res)=>{
        if(res){
          let data = JSON.parse(res.body)
          setCompanyDropDown(data)
          setCompanyList(data)
        }
      }))
    }
    }

    const handleSearchChange = (e) => {
      let data = companyList && companyList
      let value = (e.target.value).toLowerCase()
      let newData = data && data.filter((d)=>d.toLowerCase().includes(value))
      setCompanyValue(e.target.value)
      setCompanyDropDown(newData)
    }

    const onSearchFocus = ()=>{
      setCompanySearch(true)
    }

    const onSearchBlur = (e)=>{
      if(e.target.parentElement.className != 'bf-sugesstion-dropdown' && e.target.parentElement.className != 'search') {
        setCompanySearch(false);
      }
    }

    useEffect(() => {
      window.addEventListener('click', onSearchBlur);
    }, [companySearch]);

    const ondropDownClick =(name)=>{
      getDiscountSelectedCompany(name,dispatch)
      setCompanyValue(name)
      setCompanySearch(false)
    }

  const searchData= portalHomeData &&  portalHomeData.search ? portalHomeData.search : null;
  const setInitialState = (discount,isClear) => {
      let details = {};
      let formErrors = {};
      let editJson = {};
      editJson.fields = [];
      let formdetails=[];
      const fieldTypeArr = ['input', 'checkbox', 'select', 'multiselectcheckbox',"creatableSelect",'asynctypeahead'];
      discount&&discount.forEach((items) => {
        items&&items.fields&&items.fields.forEach((item,index)=>{
          if(item.type =='file'){
              setFileType(item.accept);
          }
           if (!(item.isNew)){
            editJson.fields.push(item);
           }
          if (fieldTypeArr.includes(item.component.toLowerCase())) {
              details[item.name] = isClear ? "" : formFieldData  && formFieldData.length>index ? formFieldData[index][item.name] : item.defaultValue?item.defaultValue:"";
              formErrors[item.name] = getFormErrorRules(item);
          }
        })
        formdetails.push(JSON.parse(JSON.stringify(details)));
      })
     
      setformErrors(formErrors);
      setEditFormdata(details);
      setFormFieldData(formdetails);
      seteditDiscountJson(editJson);
  }
  
const onHandleChange = (e, field) => {
    let target = e.target
    let formdataset = {}
    let fields = {};
    let fieldName
    let fieldValueData;
    setModalTextForEdit("")
    if(field.type == "file"){
      setClear()
      setAddNew(true)
      let fileData = target.files[0];
      let acceptedTypes = ["xls","xlsx","csv"];
      let getFileType = fileData.name.split('.');
      let filenamelength= getFileType.length;

      if(!acceptedTypes.includes(getFileType[filenamelength-1])) 
        validateField(field.name, "fileType", fields);
       else {
        validateField(field.name,null,fields);
        const reader = new FileReader();
        reader.onload = (e) => {
            setBulkUpload(true)
            const data = e.target.result;
            const workbook = xlsx.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const fileJson = xlsx.utils.sheet_to_json(worksheet);
            if(fileJson.length) {
              let fieldArr = fieldList;
              let arrLength = fieldList[0].addNewDiscountInformation.length;
              fieldList[0].addNewDiscountInformation.splice(1,arrLength-1)
              setFieldList(fieldArr);
              let updatedJson = updateResultJsonNames(fileJson)
              let uploadedArr = []
              let data ={}
              if(updatedJson.length>0){
                updatedJson&&updatedJson.forEach((item)=>{
                  let tailNumbers = [{"TailNumber":item.tailNumbers}]
                  let fBOLocations = [({"Location":item.location})]
                  uploadedArr.push({
                    "Amount":item.amount,
                    "Criteria":item.criteria,
                    "Unit":item.unit,
                    "IsActive": true,
                    "Operator": "",
                    "FBOLocations" :fBOLocations,
                    "TailNumbers":tailNumbers
                  }
                  )
                })
                data = {
                  "FBO":organizationName,
                  "CreatedBy": userEmail,
                  "ModifiedBy": userEmail,
                  "Data":uploadedArr
                }
                getDataForBulkupload(data)
              }else{
                setBulkUpload(false)
              }
            }else{
              setBulkUpload(false)
            }
        };
        reader.readAsArrayBuffer(e.target.files[0]);
      }
    } 
    if (field.type == "multiselectcheckbox"){
       fieldName = field.name;
      let fieldValue = e.length ? e.map(i => i.value) : null;
      fields[field.name] = fieldValue;
      fieldValueData = fieldValue
    } else if(field.name == 'operator'){
      setOperatorVal(target.value?target.value:'');
      fieldName = target.name;
      fields[fieldName] = e.target.value;
      fieldValueData = target.value;
      searchAPI(e,false)
    }else if(field.name == "amount"){
        let result  = validateAmount(target.value,editFormdata.unit)
        if(result){
          fieldName = target.name;
          fields[fieldName] = target.value;
          fieldValueData = target.value;
        }else if(target.value == ""){
          fieldName = target.name;
          fields[fieldName] = target.value;
          fieldValueData = target.value;
        }
    }else if(field.name == "unit"){
        fieldName = target.name;
        fieldValueData = target.value;
        fields[fieldName] = e.target.value;
        let result  = false

        if(editFormdata.amount !=""){
          result =  validateAmount(editFormdata.amount,target.value)
          if(result){
          editFormdata.amount=editFormdata.amount
          }else{
            editFormdata.amount =""
          }
        }
        editFormdata.amount =""
    }else {
       fieldName = target.name;
       fieldValueData = target.value;
       fields[fieldName] = e.target.value;
    }
    if(isBtnValidate){
        if(target){
          validateField(target.name, target.value, fields, true);
        }else if(target==undefined && field.type == "multiselectcheckbox"){
          let fieldValue = e.length ? e.map(i => i.value) : null;
          validateField(field.name, fieldValue, fields, true);
        }
     }
      formdataset = {
        ...editFormdata,
        ...fields
      }
      setEditFormdata(formdataset)
     let isValid = validateForm();
      if (isValid) {
        setModalText('');
      }
}

const validateAmount = (value,unit) =>{
  let result = false
  let dolorRegex = /^(?=.*\d)\d{0,4}(?:\.\d{0,2})?$/
  let percentileRegex = /^(?=.*\d)\d{0,2}(?:\.\d{0,2})?$/
    if(unit== '%'){
          result = percentileRegex.test(value)
      }else{
          result = dolorRegex.test(value)
    }
    return result
}
const getDataForBulkupload =(jsonData) =>{
  document.getElementById('root').style.filter = 'none';
  getOperatorForBulkupload(jsonData,dispatch).then((response)=>{
    seteditModalShow(false)
    let res = response && response.length>0 && response[0].length>0 && response[0][0]?response[0][0]:{}
    let homeData = res && res['JSON_UNQUOTE(@JSONResponse)']?JSON.parse(res['JSON_UNQUOTE(@JSONResponse)']):[];
    let fileData = homeData&&homeData.Data?homeData.Data:[]
    let error = res&&res.Errmsg?res.Errmsg:'Server error';
    if(fileData.length>0){
      document.getElementById('root').style.filter = 'none';
      navigate('/dashboard/discount-upload', {state:{xlData:fileData,FBO:organizationName,user:userEmail,count:fileData.length}})
    }else{
      setBulkUpload(false);
      setModalShow(true);
      setModalText(error)
    }
  })
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
    let errcount = validationObj.errcount;
    if (!errcount) {
      fieldValidationErrors[fieldName].isValid = true;
      fieldValidationErrors[fieldName].activeValidator = {};
    } else {
      fieldValidationErrors[fieldName].isValid = false;
      fieldValidationErrors[fieldName].activeValidator = validationObj.fieldValidationError.activeValidator;
    }
    return fieldValidationErrors
}

const updateResultJsonNames =(uploadData) => {
   let resultArray = [];
   let fieldArray = {"Location":"location","Criteria":"criteria","Amount ":"amount","Unit":"unit","Tail Number":"tailNumbers"};
  uploadData.forEach(item => {
      let dummyOb = {};
      for(const property in item){
        if(fieldArray[property]){
          dummyOb[fieldArray[property]] = item[property]
        }
      }
      if(dummyOb && dummyOb.tailNumbers && dummyOb.location){
          resultArray.push(dummyOb)
      }
  });
  let res = cancatinateRows(resultArray);
  return res;
}

const cancatinateRows = (data) => {
  let res =[]
  res = data.filter((value, index, self) =>
    index === self.findIndex((t) => (
      t.location == value.location && t.tailNumbers == value.tailNumbers
    ))
  )
  return res;
}

const getFieldIsValid = (value, fieldValidationError, fieldName) => {
    let validationObj = {
      fieldValidationError: fieldValidationError,
      errcount: 0
    };
    if (fieldValidationError.isRequired === true) {
      validationObj =
        checkValidationByValidationTypes(value, fieldValidationError, fieldName);
    }else {
      if (value) {
        validationObj =
          checkValidationByValidationTypes(value, fieldValidationError, fieldName);
      }
    }
    return validationObj;
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
  
const checkValidationByValidationTypes = (value, fieldValidationError, fieldName) => {
    const validationTypes = ['IsMandatory','fileType','amount'];
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
            } else if(validationType === 'fileType'){
              if( value === 'fileType' ) {
                errcount++;
                fieldValidationError.activeValidator = fieldValidationError.validations[0];
              }
            }else if(validationType === "amount"){
              if(value>100 &&editFormdata.unit === '%'){
                errcount++;
                fieldValidationError.activeValidator = fieldValidationError.validations[1];
              }
            }
        }
    });
    return {
        fieldValidationError: fieldValidationError,
        errcount: errcount
    };
}

const getSymbolAndValue = (data) =>{
    let currencyObj={}
    if(data.includes("%")){
      currencyObj.symbol = data.charAt(data.length-1);
      currencyObj.amount = data.replace('%','')
    }else if(data.includes("$")){
      currencyObj.symbol = data.substring(0, 1);
      currencyObj.amount = data.replace('$','')
    }
    return currencyObj;
}

const clickEdit = (data) =>{
    let editedDataArray =[];
    let res = discountData && discountData.data && discountData.data.length>0 && discountData.data[0].length>0 && discountData.data[0][0]?discountData.data[0][0]:{}
    let homeData = res && res['JSON_UNQUOTE(@JSONResponse)']?JSON.parse(res['JSON_UNQUOTE(@JSONResponse)']):[];
    homeData.map((value)=>{
      if(value.tailnumber === data.tailNumber && value.Location === data.location){
        editedDataArray.push(value)
      }
    })
    let currency = getSymbolAndValue(editedDataArray[0].Value);
    let EditedData = {
      addedBy: editedDataArray[0].AddedBy,
      criteria:editedDataArray[0].Criteria,
      discountId:editedDataArray[0].DiscountID,
      location:editedDataArray[0].Location,
      status:editedDataArray[0].Status,
      amount:currency.amount,
      unit:currency.symbol,
      tailNumbers:editedDataArray[0].tailnumber,
      operator:editedDataArray[0].Operator
    }
    setDiscountAmount(currency.amount);
    let tailNums =[];
    tailNums.push(editedDataArray[0].tailnumber)
     editFormdata['discountId']=editedDataArray[0].DiscountID
     editFormdata['status']=editedDataArray[0].Status
     editFormdata['addedBy']=editedDataArray[0].AddedBy
    setDeactivateData(data);
    //setSelectedTailNums(tailNums)
    let allFormData = {}
    Object.keys(editFormdata).forEach((item, index) => {
      allFormData[item] = EditedData && EditedData[item] && EditedData[item] !== 'null' ? EditedData[item] : "";
    })
    setEditFormdata(allFormData);
    seteditModalShow(true)
    setModalText("")
    setOperatorVal("")
}
  
const closeEditModal = () => {
    setInitialState(fieldList[0].addNewDiscountInformation)
    let allFormData = {}
    Object.keys(editFormdata).forEach((item) => {
      allFormData[item] = "";
    })
    setEditFormdata(allFormData);
    seteditModalShow(false);
    setAddNew(false);
    document.getElementById('root').style.filter = 'none';
    enablePopUp(false,dispatch)
    setModalText("");
    setModalTextForEdit("");
    setSelectedTailNums([]);
    setTailNum([])
    setCheked(false)
    setDisabled(true)
    setShowDeactivate(false)
    setSearchLength(searchLength==0?3:0)
    setOperatorVal("");
    setFatNumber(true);
}

const successModal = () => {
    setShowDeactivate(false)
    setModalText("")
    document.getElementById('root').style.filter = 'none';
    if(modalText==fieldList[0].modal.deactivate.text){
      let disId = deactivateData.DiscountID
      let modifiedBy = userEmail
      deleteDiscount({"DiscountID":disId,"ModifiedBy":modifiedBy}).then(res => {
        setReset(Math.random())
        let loc = ""
        loc = deactivateData.Location
        let payload = {}
        payload.type = "delete"
        payload.notificationMessage = portalHomeData.notifyMessage.msg4+loc+portalHomeData.notifyMessage.msg2+userEmail+ "."
        payload.organizationName = organizationName
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
        payload.location = loc
        saveNotificationList(payload,dispatch).then((res)=>{
        })
        let auditPayload = {"ModuleName":"Client Portal",
                              "TabName":"Discount",
                              "Activity":"Deleted Discount for organization "+organizationName,
                              "ActionBy":Storage.getItem('email'),
                              "Role":JSON.parse(Storage.getItem('userRoles')),
                              "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
                    saveAuditLogData(auditPayload, dispatch)
      })
    }
}

const closeModal = (e) => {
    if (e.target.innerHTML === "Yes") {
      let saveData = {
        "DiscountID": deactivateData.DiscountID,
        "ModifiedBy": userEmail
      }
      deleteDiscount({saveData}).then(res => {
        if (res.statusCode) {
          if (res.message=='data Deleted Successfully') {
            setReset(Math.random())
            setdisable(true)
            setInitialState(fieldList[0].addNewDiscountInformation)
          }
        }
      })
    } else { 
      setShowDeactivate(false)
    }
    setDeactivateData([])
    setInitialState(fieldList[0].addNewDiscountInformation)
    document.getElementById('root').style.filter = 'none';
    setModalText("");
}

const clickDeactivate = (data) => {
    setModalText(fieldList[0].modal.deactivate.text)
    setShowDeactivate(true);
    document.getElementById('root').style.filter = 'blur(5px)';
    let res = discountData && discountData.data && discountData.data.length>0 && discountData.data[0].length>0 && discountData.data[0][0]?discountData.data[0][0]:{}
    let homeData = res && res['JSON_UNQUOTE(@JSONResponse)']?JSON.parse(res['JSON_UNQUOTE(@JSONResponse)']):[];
    homeData.map((value)=>{
      if(value.tailnumber === data.tailNumber && value.Location === data.location){
        setDeactivateData(value);
      }
    });
} 

const onClickSubmit = () => {
    setbtnValidate(true)
    const fieldValidationErrors = {
      ...formErrors
    };
    Object.keys(fieldValidationErrors).forEach((fieldName, index) => {
      validateField(
        fieldName,
        editFormdata[fieldName],
        { [fieldName]: editFormdata[fieldName] }
        );
      });
    let isFatNumber = getFatNumberValidation(fatNUmber);
    let isValid = validateForm();
      if (isValid && isFatNumber) {
        setServiceBusy(true)
        setModalText("");
        let saveData;
        if (deactivateData.length === 0) {
          saveData = formSubmitData()
        } else {
          saveData = formSaveData()
        }
        addDiscount(saveData).then(res => {
          let resMsg = res&&res[0]&&res[0][0].Msg?res[0][0].Msg:'';
          let error = res&&res[0]&&res[0][0].error?res[0][0].error:'Server error';
          if (resMsg.length>0) {
            setServiceBusy(false)
            setdisable(true)
            //  setFatNumber(false)
              setDeactivateData([])
              seteditModalShow(false)
              enablePopUp(false,dispatch)
              document.getElementById('root').style.filter = 'none';
              setAddNew(false)
              setReset(Math.random())
              setSelectedTailNums([])
              setModalShow(false)
              setShowDeactivate(false)
              setModalTextForEdit("")
              setCheked(false)
              setDisabled(true)
              setOperatorVal("")
              setTailNum([])
              let allFormData = []
              Object.keys(editFormdata).forEach((item, index) => {
                allFormData[item] =  "";
              })
              setEditFormdata(allFormData)
              let loc = ""
              let locLength = saveData.FBOLocations.length
              saveData.FBOLocations.forEach((val,index)=>{
                if(index == locLength-1){
                  loc = loc + val.Location
                }else{
                  loc = loc + val.Location+','
                }
              })
              if(saveData.DiscountID != null){
                let payload = {}
                payload.type = "update"
                payload.notificationMessage = portalHomeData.notifyMessage.msg1+loc+portalHomeData.notifyMessage.msg2+userEmail+ "."
                payload.organizationName = organizationName
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
                payload.location = saveData.FBOLocations
                saveNotificationList(payload,dispatch).then((res)=>{
                })
                let auditPayload = {"ModuleName":"Client Portal",
                              "TabName":"Discount",
                              "Activity":"Discount Updated For"+JSON.stringify(saveData.TailNumbers)+" In "+organizationName,
                              "ActionBy":Storage.getItem('email'),
                              "Role":JSON.parse(Storage.getItem('userRoles')),
                              "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
                    saveAuditLogData(auditPayload, dispatch)
              }else{
                let payload = {}
                payload.type = "create"
                payload.notificationMessage = portalHomeData.notifyMessage.msg3+loc+portalHomeData.notifyMessage.msg2+userEmail+ "."
                payload.organizationName = organizationName
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
                payload.location = saveData.FBOLocations
                saveNotificationList(payload,dispatch).then((res)=>{
                })
                let auditPayload = {"ModuleName":"Client Portal",
                              "TabName":"Discount",
                              "Activity":"Discount Added For"+JSON.stringify(saveData.TailNumbers)+" In "+organizationName,
                              "ActionBy":Storage.getItem('email'),
                              "Role":JSON.parse(Storage.getItem('userRoles')),
                              "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
                    saveAuditLogData(auditPayload, dispatch)
              }
          }else {
            setModalTextForEdit(error);
            setServiceBusy(false)
          }
        })
      } else {
        if(!isFatNumber){
          setModalTextForEdit(fieldList[0].modal.fatNumber.text)
          setFatNumber(false)
          setServiceBusy(false)
        }else
        setModalTextForEdit(fieldList[0].modal.validate.text)
        setServiceBusy(false)
      }
}

const getFatNumberValidation = (num) => {
  let newValue = editFormdata.amount;
  let val = (systemVariables.Fat_Finger_Threshold*discountAmount)/100;
  if(newValue&&newValue != discountAmount &&discountAmount>0 && num){
    if(newValue<=parseFloat(discountAmount) - parseFloat(val)){
      return false
    }else if(newValue>=parseFloat(discountAmount)+parseFloat(val)){
      return false
    }else{
      return true;
    }
  } else return true;
}

const formSaveData = () => {
    let saveJson = {}
    let fieldData = JSON.parse(JSON.stringify(editFormdata))
    let payload={}
    payload[userType] = companyValue;
    let locations = fieldData.location?fieldData.location:[]
    let FBOLocations = []
    let tailNumbrs =[]
    if(locations.length>0){
      locations.map((loc)=>{
        FBOLocations.push({"Location":loc})
      })
    }
    if(selectedTailNums.length>0){
      selectedTailNums.map((num)=>{
        tailNumbrs.push({"TailNumber":num})
      })
    }else{
      tailNumbrs.push({"TailNumber":editFormdata.tailNumbers})
    }
  
    saveJson={
      "DiscountID" : fieldData.discountId,
      "IsActive": true,
      "Operator": fieldData.operator,
      "Criteria": fieldData.criteria,
      "Amount": fieldData.amount,
      "Unit": fieldData.unit,
      "CreatedBy": fieldData.addedBy?fieldData.addedBy:userEmail,
      "ModifiedBy": userEmail,
      "FBOLocations": FBOLocations,
      "TailNumbers": tailNumbrs,
      "FBO":organizationName
    }
    return saveJson;
}

const formSubmitData = () => {
    let saveJson = {};
    let fieldData = JSON.parse(JSON.stringify(editFormdata));
    let payload={};
    payload[userType] = companyValue;
    let locations = fieldData.location?fieldData.location:[];
    let FBOLocations = []
    let tailNumbrs =[]
    if(locations.length>0){
      locations.map((loc)=>{
        FBOLocations.push({"Location":loc})
      })
    }
    if(selectedTailNums.length>0){
      selectedTailNums.map((num)=>{
        tailNumbrs.push({"TailNumber":num})
      })
    }else{
      tailNumbrs.push({"TailNumber":editFormdata.tailNumbers})
    }
    saveJson={
      "IsActive": fieldData.status,
      "Operator": fieldData.operator,
      "Criteria": fieldData.criteria,
      "Amount": fieldData.amount,
      "Unit": fieldData.unit,
      "CreatedBy": userEmail,
      "ModifiedBy": userEmail,
      "FBOLocations": FBOLocations,
      "TailNumbers": tailNumbrs,
      "FBO":organizationName,
      "IsActive":true
    }
    return saveJson;
}

const getFormErrorRules = (item) => {
    return {
        isValid: item.isRequired ? false : true,
        isTouched: false,
        activeValidator: {},
        validations: item.validations,
        isRequired: item.isRequired,
        maxValue: item.maxValue
    };
}

const getDiscountFields = (item) => {
    switch(item.component.toUpperCase()) {
     case "BUTTON":
      return (<ButtonComponent       
              Label={item.label} 
              Type={item.type} 
              className={item.styles.className}
              variant={item.variant}
              disabled={restricted?true:companyValue?false:true}
              handleClick={(e)=>onClickNewButton(e,item)}/>)
      };
}

const handleCheck = () => {
    let formData = { ...editFormdata };
    setCheked(!checked);
    selectedTailNums.push(tailNum[0])
    setDisabled(true)
    if(formData['tailNumbers']){
      typeaheadRef.current.state.selected = []
      typeaheadRef.current.state.text =''
    }
}

const getTabs =()=>{
    return (
      <div className='bf-tabs-container bf-mrgt20'>
        {portalHomeData && portalHomeData.portalTabs ?
          <>
            {portalHomeData.portalTabs.tabs.map((tab,i) => (
              <Nav variant="tabs" className='bf-tabs' key={i} >
                <Nav.Item>
                  <Nav.Link className="bf-active-tab" >{tab.title}</Nav.Link>
                </Nav.Item>
              </Nav>
            ))}
          </> : null}
      </div>
    )
}

const onClickNewButton = () => {
    resetPopupData()
    seteditModalShow(true)
    setAddNew(true)
}

const resetPopupData = () =>{
    setInitialState(fieldList[0].addNewDiscountInformation)
}

const onHandleBlur = (e, field) => {
    let formdataset = { ...editFormdata }
    if(e.target.value<0.01){
      formdataset[field.name] = ''
    }else
    formdataset[field.name] = e.target.value;
    setEditFormdata(formdataset)
}

const onHandleSelect = () => {
    let formData = { ...editFormdata };
    Object.keys(formData).map((fieldName) => {
      validateField(
        fieldName,
        formData[fieldName],
        { [fieldName]: formData[fieldName] },
        true,
        formErrors, formData
      );
    })
    setEditFormdata(formData);
}

const onCreateChange =(e) =>{
  let formData = { ...editFormdata };
  if(e.length>0){
    let newArr =[]
    e&&e.length>0&&e.forEach((item)=>{
      newArr.push(item.value)
    })
    setSelectedTailNums(newArr);
  }else{
    //setDisabled(false);
    setCheked(false)
    setSelectedTailNums([]);
    setResults([])
    setTailNum('')
     typeaheadRef.current.state.selected = []
     typeaheadRef.current.state.text =''
    formData["tailNumbers"] = ''
  }
  setEditFormdata(formData);
} 

const onCreateInputChange = (e) =>{}

const getTailNumbers=(payload)=>{
  getTailNumbersList(payload,dispatch).then((res)=>{
    let tailNumbersList = [];
    let data = res && res.length>0 && res[0]&& res[0].length>0&&res[0][0]&&res[0][0]['@JSONResponse']?JSON.parse(res[0][0]['@JSONResponse']):[];
    if(data.length>0){
      data.map((i) =>{
        let tailNumbr = Array.isArray(payload.TailNumber)?payload.TailNumber[0]:payload.TailNumber
        if(tailNumbr !="" && tailNumbr !=undefined && i.TailNumbers != tailNumbr){
          tailNumbersList.push(tailNumbr)
        }
        tailNumbersList.push(i.TailNumbers);
      })
    }else{
      let tailNumbr = Array.isArray(payload.TailNumber)?payload.TailNumber[0]:payload.TailNumber
      if(tailNumbr&&tailNumbr.length>0)
       tailNumbersList.push(tailNumbr);
    }
     let arr = tailNumbersList&&tailNumbersList.filter((item,index) => tailNumbersList.indexOf(item) === index)
     setResults(arr);
    })
}

const searchAPI =(e,isSearch)=>{
  let payload ={}
  if(isSearch){
    payload={
      "Operator" : operatorVal?operatorVal:'' ,
      "TailNumber" :e?e:''
    }
  }else{
    payload={
      "Operator" :  e&&e.target&&e.target.value?e.target.value:operatorVal ,
      "TailNumber" : tailNum?tailNum:''
    }
    setSearchLength(0)
  }
   getTailNumbers(payload);
}

const handleFocus = () => {
  let formData = { ...editFormdata };
  formData['tailNumbers'] = ''
  setEditFormdata(formData)
  setTailNum([]);
}

const searchHandler =(items)=>{
  let formData = { ...editFormdata };
  let num =[...selectedTailNums];
    try {
      if(items.length>0 && !(num.includes(items[0]))){
        num.push(items[0]);
        setTailNum(items);
        if(checked){
          setSelectedTailNums(num);
          typeaheadRef.current.state.selected = []
          typeaheadRef.current.state.text =''
          formData["tailNumbers"] = '';
        }
        setDisabled(checked?true:false)
        formData["tailNumbers"] = items[0];
      }
      validateField("tailNumbers", tailNum, null, true,formErrors,formData)
      setEditFormdata(formData);
    } catch(err) {
      console.error('Caught error in search')
    }
}

const searchOnKeyDown = (evt) => {
 if(evt.target.name !="amount")
   evt.target.value=evt.target.value.replace(/[^a-zA-Z0-9]+/,"")
}

const filterBy = () => true;

const getSelectOptions = () =>{
  let options=[];
  if(selectedTailNums.length>0){
    selectedTailNums.map((i)=>{
      options.push({label:i,value:i});
    })
  }
  return options;
}

const renderModal = (modal) => {
  let modalData = modalText;
  return (
      <CustomModal
          show={modalShow}
          onHide={handleClose}
          modelBodyContent={modalData}
          buttonText={fieldList[0].modal.submit.button?fieldList[0].modal.submit.button:''}
      />
  );
  };

  const handleClose = () => {
    setModalShow(false);
    document.getElementById('root').style.filter = 'none';
  }

  const renderDeactivateModal = (modal) => {
    let modalData = modalText;
    return (
        <CustomModal
            show={showDeactivate}
            close ={(e) => closeModal(e)}
            hide={(e) => closeModal(e)}
            onHide={(e) => successModal(e)}
            modelBodyContent={modalData}
            buttonText={modalText==fieldList[0].modal.deactivate.text? fieldList[0].modal.deactivate.button1:fieldList[0].modal.validate.button1}
            secondbutton={modalText==fieldList[0].modal.deactivate.text?fieldList[0].modal.deactivate.button2:""}
        />
    );
  };

const selectedOptions = getSelectOptions();

return ( 
  ( isBulkUpload?<Loader /> :
  <div className='bf-client-portal-home-container'>
      {portalHomeData && portalHomeData  ? <div className='bf-client-portal-home'>
      {userType =="Barrel Fuel" ?
      <div className='bf-userBar'>
          <div className="search" >
            <IoIosSearch className='search-icon' />
            <input
              type={searchData&&searchData.type}
              name={searchData&&searchData.name}
              value={companyValue}
              id={searchData&&searchData.name}
              placeholder={searchData&&searchData.placeholder}
              className={"search-input form-control"}
              onChange={(e) =>{handleSearchChange(e) }}
              onFocus = {(e)=>onSearchFocus()}
            />
            {/* <img src={arrowDownIcon} className='bf-down-arrow' /> */}
            {companySearch &&
            <ul className='bf-sugesstion-dropdown'>
              { companyDropDown && companyDropDown.length&&companyDropDown.map((comp)=>(
                <li onClick={(e)=>{ondropDownClick(comp)}}>{comp}</li>
              ))}
            </ul>}
          </div>
      </div>:<div className="portal-title">{portalHomeData.portalTitle?portalHomeData.portalTitle:""}</div>}
          {getTabs()}
      <div className='tab-details-container'>
      <div className={`${fieldList && fieldList[0].addNewDiscount ? fieldList[0].addNewDiscount.styles.colWidth: ''} bf-absolute`}>
          {fieldList && fieldList[0].addNewDiscount ? getDiscountFields(fieldList[0].addNewDiscount) : ''}
      </div>
      {fieldList && fieldList.length>0 &&
        <div className='bf-table-container bf-discount-table-container'>
          <BFTable 
          sortEnabled = {true} 
          searchEnabled={true} 
          Data ={rows && rows} 
          heading={fieldList[0].headCells} 
          searchBy={["tailNumber", "location"]}
          primaryClick = {clickEdit}
          secondaryClic = {clickDeactivate}
          loading = {loading}
          isUserTab={false}
          level2={isLevel2}
          >
          </BFTable>
        </div>} 
        {editmodalShow?<EditFormModal
            onHide={() => closeEditModal()}
            formErrors={formErrors}
            formdata={editFormdata}
            show={editmodalShow}
            json={addNew?fieldList[0].addNewDiscountInformation[0]:editDiscountJson}
            onHandleChange={onHandleChange}
            onClickSubmit={onClickSubmit}
            onHandleBlur={onHandleBlur}
            onHandleSelect={onHandleSelect}
            handleCheck={handleCheck}
            disabled={disabled}
            companyName={companyValue}
            showError={modalTextForEdit}
            selectedOptions={selectedOptions}
            addNew={addNew}
            isClearable={false}
            Accept={fileType}          
            onCreateChange={(e)=>onCreateChange(e)}
            onCreateInputChange={(e)=>onCreateInputChange(e)}
            checked={checked}
            searchAPI={(e)=>searchAPI(e,true)}
            searchHandler={(items)=>searchHandler(items)}
            handleFocus={handleFocus}
            results={results}
            onKeyDown={(evt) => searchOnKeyDown(evt)}
            filterBy={filterBy}
            typeaheadRef={typeaheadRef}
            selected={searchLength == 0?results:tailNum}
            template={DiscountTemplate}
            inputProps={{ 'maxLength': 6}}
            minLength={searchLength}
            filterLocation={filterLocation}
            isAdmin = {acclvl}
            submittedForm={serviceBusy}
            selectAll = {true}
          />:""}
          {modalShow ? renderModal() : null}
          {showDeactivate?renderDeactivateModal():null}
        </div> 
     </div>:""}
     </div>)
  )
}

export default ClientPortalHome