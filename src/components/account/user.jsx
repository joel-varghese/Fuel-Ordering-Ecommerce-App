import React, { useState,useEffect } from 'react';
import { bfaJsonService } from '../../actions/BFAServices/BFAJsonService';
import './company.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { Storage, jsonStringify } from '../../controls/Storage';
import { accountCompanyEditService, accountUserDeactivateService,accountUserDelete,deleteAircraft, fetchCompanyDetails } from '../../actions/accountServices/accountCompanyService';
import BFTable from '../table/table'
import Loader from '../loader/loader';
import CustomModal from '../customModal/customModal';
import ButtonComponent from '../button/button';
import EditFormModal from '../customModal/editModal';
import { getFieldIsValid, phoneValidation } from '../../controls/validations';
import { adminAddUserSave } from "../../actions/adminAddUserService/adminAddUserService";
import { barrelFuelAccess, getAccessLevel } from '../../controls/commanAccessLevel';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJSONData, fetchUserData, getUserDataSuccess } from '../../actions/userActions/userActions';
import { SendMailToUsers } from '../../services/commonServices';
import { sender_Email } from '../../controls/commonConstants';
import { saveNotificationList } from '../../actions/notificationService/notificationAction';
import {saveAuditLogData } from '../../actions/auditLog/auditLogActions';

function User() {
    let {state} = useLocation()
    const [fieldList, setFieldList] = useState(null);
    const [rows, setRows] = useState(null);
    const [mobileDataRows, setMobileDataRows] = useState(null);
    const [userDetailsData, setUserDetailsData] = useState(null);
    const [formdata, setformdata] = useState({});
    const [editmodalShow, seteditModalShow] = useState(false);
    const [formErrors, setformErrors] = useState({});
    const [isBtnValidate,setbtnValidate]=useState(false);
    const [modalText, setModalText] = useState("");
    const [modalShow, setModalShow] = useState(false);
    const [refresh,setrefresh]=useState(0);
    const [newRows, setnewRows] = useState([]);
    const [mobileNewRows, setMobileNewRows] = useState([]);
    const [addNew, setaddNew] = useState(false);
    const [disable,setdisable]=useState(false);
    const [restricted,setrestricted]=useState(true);
    const [userId,setuserId]=useState(0);
    const [serviceBusy, setServiceBusy] = useState(false);
    const [useremail, setUserEmail] = useState()
    const [isBusy, setBusy] = useState(true);
    const [loading, setLoading] = useState(true);
    const [deletedEmail, setDeletedEmail] = useState('')
    const [deletedName, setDeletedName] = useState('')
    const [userType, setUserType] = useState()
    const [filteredRows, setFilteredRows] = useState([])
    const [filteredMobileRows, setFilteredMobileRows] = useState([])
    const [acclvl, setacclvl] = useState(true);
    const [isInactive, setInactive] = useState(false)
    const [oldemail, setoldemail] = useState(null)
    const [oldrole, setoldrole] = useState(null)
    const [oldaccess, setoldaccess] = useState(null)
    const [lochange,setlochange] = useState(null)
    const [levelUserId,setLevelUserId] = useState("")
    const [passwordIdArray,setPasswordIdArray] = useState([])
    const [isLevel2, setIsLevel2] = useState(false);
    const [isInactiveUser,setIsInactiveUser] = useState("Y")
    const paylod = { 'blobname': 'accountUser.json' }
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const orgName = Storage.getItem('organizationName')
    const loginName = Storage.getItem('email')
    const access = JSON.parse(Storage.getItem('accessLevel'))[0]
    const loginReducer = useSelector(state => state.loginReducer);
    const userReducer = useSelector(state => state.userReducer);
    const dashboardReducer = useSelector((state) => state.dashboardReducer)
    const loggedInUser = Storage.getItem('userType') ? Storage.getItem('userType') :""
    const jsonData = userReducer && userReducer.userJson && userReducer.userJson;
    const data=jsonData && jsonData.data && jsonData.data.data && jsonData.data.data.userData
    const userData = userReducer && userReducer.userData && userReducer.userData;
    const loader = userReducer && userReducer.loading && userReducer.loading;
    const accountHomeReducer = useSelector((state) => state.accountHomeReducer);
    const commonReducer = useSelector(state => state.commonReducer);
    const profileDetails = dashboardReducer && dashboardReducer.profileData && dashboardReducer.profileData.data
    const accessLvl = loginReducer && loginReducer.loginAccessLevel&&loginReducer.loginAccessLevel.data&&loginReducer.loginAccessLevel.data?loginReducer.loginAccessLevel.data:[]
    const loggedInUserType = commonReducer && commonReducer.loggedInUserType && commonReducer.loggedInUserType.data;
    const selectedCompany = accountHomeReducer && accountHomeReducer.selectedCompany && accountHomeReducer.selectedCompany.company;
    const selectedUser = accountHomeReducer && accountHomeReducer.selectedUser ? accountHomeReducer.selectedUser.user:Storage.getItem('userType').toLocaleLowerCase();
    const cells = data && data.length && data[0].headCells && data[0].headCells.filter((m)=>
		  m?.users?.includes(selectedUser))
    const mobileCells = data && data.length && data[0].mobileHeadCells && data[0].mobileHeadCells.filter((m)=>
		  m?.users?.includes(selectedUser))
    
  const editjsons = data && data.length && data[0].aircraftInformation && data[0].aircraftInformation.fields.filter((m)=>
  m?.users?.includes(selectedUser)
)
  let editjson={}
  editjson.fields=editjsons
    
  function createData(id,firstName,lastName, calories, fat, carbs, protein, buttons,loc) {
    if(selectedUser=='fbo'){
      let dataObj= {
        "taxID":id,
        "name":firstName+" "+lastName,
        "email":calories,
        "accessLevel":fat,
        "status":carbs=='Y'?'Active':'Inactive',
        "locations":protein?.toString(),
        "Buttons":JSON.parse(JSON.stringify(buttons))
      };

      let acc=JSON.parse(accessLvl)
      if(!acc?.includes('Super') && loggedInUserType.toLowerCase()!='barrel fuel'){
        if(acc?.includes('Admin')){
          setIsLevel2(true)
            let flag=true;
            protein?.map((v)=>{
              if(loc?.includes(v)){
                flag=false;
              }
            })
            if(flag || fat.trim()=='Level 1'){
              dataObj.Buttons[0].disable=true;
              dataObj.Buttons[1].disable=true;
            }
        }
      }
      return dataObj;
    }else{
      return {
        "taxID":id,
        "name":firstName+" "+lastName,
        "email":calories,
        "accessLevel":fat,
        "status":carbs=='Y'?'Active':'Inactive',
        "mobileNumber":protein?phoneValidation(protein.toString()):'',
        "Buttons":buttons
      };
    }
  }
  function createMobileData(id,firstName,lastName, accessLevel) {
    if(selectedUser=='fbo'){
      return {
        "taxID":id,
        "name":firstName+" "+lastName,
        "accessLevel":accessLevel,
        "mobileButton":true
      };
    }else{
      return {
        "taxID":id,
        "name":firstName+" "+lastName,
        "accessLevel":accessLevel,
        "mobileButton":true
      };
    }
  }
    
    useEffect(() => {
      setrefresh(0);
      let accLevel=JSON.parse(Storage.getItem('accessLevel'))
      accLevel=accLevel.map((level)=>{
        level=level.toLowerCase()
        return level
      })
      if(accLevel.includes("super") || loggedInUser=='Barrel Fuel'){
        setacclvl(false)
      }
      let usermailID = Storage.getItem('email')
      setUserEmail(usermailID)
      let accessable = getAccessLevel(Storage.getItem('userType'), Storage.getItem('accessLevel'))
      if(accessable){
        setrestricted(false)
      }
      if(selectedUser=="internal" && barrelFuelAccess(Storage.getItem('userType'), Storage.getItem('accessLevel'))){
        setrestricted(true)
      }
      let companyDetails={'service': 'user', 'loginUserName':usermailID, 'organizationName': selectedCompany}
      fetchJSONData(dispatch, paylod)
      // if(selectedUser !== "internal" && state.companyValue == ''  ){
      //   dispatch(getUserDataSuccess({}))
      // }else{
        fetchUserData(dispatch, companyDetails)
      // }
  }, [selectedCompany, refresh]);

  useEffect(() => {
    setRows(null)
    setMobileDataRows(null)
    let locts=[]
    profileDetails && profileDetails.locationAccess && profileDetails.locationAccess.forEach((val)=>{
      if(val.accessLevel=='Level 2 (Standard)'){
        val.locations.forEach((location)=>{
          locts.push(location)
        })
      }
    })
    let data = jsonData && jsonData.data && jsonData.data.data && jsonData.data.data.userData;
    let userRows = [];
    let userDataRows = [];
    let userMobileDataRows = [];
    let userMobileTableRows = [];
    let responseData = userData && userData.data && userData.data.res
      setFieldList(data)
      setInitialState(data && data[0].aircraftInformation)
      let levelArray = []
      let passwordArray = []
    responseData  && responseData.map((item,index)=>{
      // let accessLevel = [];
      // item.accessLevel && item.accessLevel.map((j)=>{ 
      //   accessLevel.push(j.accessLevels) 
      // })
      let loc=[]
      item.location && item.location.map((val)=>{
        if(loc.length==0 || !loc.includes(val)){
          loc.push(val)
        }
      })
      let accessLevel = item.accessLevel&& item.accessLevel
      if(!item.isPassword){
        passwordArray.push(item.userId)
      }
      let levelOfAccess = accessLevel
        if(selectedUser=="internal"){
            if(accessLevel === "Level 3 (Basic)"){
                levelOfAccess = "Basic"
            }
            else{
                levelOfAccess = "Admin"
                if(item.activateInd == "Y"){
                  levelArray.push(item.userId)
                }
            }
        }else {
          levelOfAccess = accessLevel ? accessLevel?.split("(")[0] : "";
          if(accessLevel && accessLevel == "Level 1 (Admin)" && item.activateInd == "Y"){
            levelArray.push(item.userId)
          }
        }
        
      userDataRows.push(createData(item.userId,item.firstName,item.lastName, item.email,levelOfAccess,item.activateInd,selectedUser=='fbo'?item.location && loc: item.mobileNumber,item.activateInd === "Y"?data && data[0].Buttons:data && data[0].ActivateButtons,locts))
      userMobileDataRows.push(createMobileData(item.userId,item.firstName,item.lastName, levelOfAccess))
      if(item.activateInd === "Y"){
        userRows.push(createData(item.userId,item.firstName,item.lastName, item.email,levelOfAccess,item.activateInd,selectedUser=='fbo'?item.location && loc: item.mobileNumber,data && data[0].Buttons,locts))
        userMobileTableRows.push(createMobileData(item.userId,item.firstName,item.lastName,levelOfAccess))
       } 

    })
    if(levelArray && levelArray.length == 1){
      setLevelUserId(levelArray[0])
    }
    else{
      setLevelUserId("")
    }
    setPasswordIdArray(passwordArray)
    if(isInactive){
      setRows(userDataRows)
      setMobileDataRows(userMobileDataRows)
    }
    else{
      setRows(userRows)
      setMobileDataRows(userMobileTableRows)
    }
    setnewRows(userDataRows)
    setMobileNewRows(userMobileDataRows)
    setUserDetailsData(responseData)
    setFilteredRows(userRows)
    setFilteredMobileRows(userMobileTableRows)
    setBusy(false);
    setLoading(loader)
    setUserType(selectedUser && selectedUser)
  },[userData,jsonData,loader,selectedUser])

  const getActiveInactiveUsers = (status) =>{
    let userRows = [];
      setInactive(status)
      if(status){
        const sortedList = newRows.sort((a, b) =>
        a.status.localeCompare(b.status));
        /* const sortedListMobile = mobileNewRows.sort((a, b) =>
        a.status.localeCompare(b.status)); */
        setRows(sortedList)
        setMobileDataRows(mobileNewRows)
        console.log('status if ',newRows,' status ',status)
      }
      else{
        setRows(filteredRows)
        setMobileDataRows(filteredMobileRows)
        console.log('status else ',filteredRows,' status ',status)
      }

  }

  const setInitialState = (fboData,clear,editdata) => {
    const formData = {};
    let formErrors = {};
    const fieldTypeArr = ['input', 'select','id','multiselectcheckbox'];

    fboData && fboData.fields.forEach((item) => {
        if (fieldTypeArr.includes(item.component.toLowerCase())) {
          // if(item.name == 'accessLevel' && editdata && Array.isArray(editdata[item.name])) {
          //   formData[item.name] = editdata[item.name].length ? editdata[item.name][0].accessLevels : ''
          // } else 
          // if(item.name == 'roles' && editdata && Array.isArray(editdata[item.name])) {
          //   formData[item.name] = editdata[item.name].length ? editdata[item.name][0].roleType : ''
          // } else
           if(item.name == 'location' && editdata && editdata[item.name]){
            formData[item.name] = editdata[item.name].length ? editdata[item.name].toString(',') : ''
          } else if(item.name == 'mobileNumber' && editdata){
            formData[item.name] = editdata[item.name] ? phoneValidation(editdata[item.name].toString()) : ""
          }else {
            formData[item.name] = editdata && editdata[item.name] ?(typeof editdata[item.name] == 'number' ? editdata[item.name].toString() : editdata[item.name]): "";
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
   const onHandleChange = (e,field) => {
    let target=e.target
    let formdataset={}
    let fieldName=field.name
    let fieldValue
    let fields = {};
    let maxLength = 0;
    
    if (field && field.maxLength) {
      maxLength = parseInt(field.maxLength);
    }
  if (maxLength > 0 && target.value.length > maxLength) {
      target.value = target.value.substring(0, maxLength);
      return;
  }
    if (field.name === 'firstName' || field.name === 'lastName') {
      target.value = target.value.replace(/[^a-z]/gi, '')
    }
  if(field.name === 'email'){
    setoldemail(formdata[field.name])
  }
  if(field.name === 'accessLevel'){
    setoldaccess(formdata[field.name])
  }
  if(field.name === 'roles'){
    setoldrole(formdata[field.name])
  }
  if(field.name == 'location'){
    setlochange(formdata[field.name])
  }

        if(field.validations){
          for(var i=0;i<field.validations.length; i++){
              if(field.validations[i].validation === 'CheckUSPhone'){
                  e.target.value=phoneValidation(e.target.value);
              }
            }
          }
        if (field.type == "multiSelectCheckbox") {
          fieldValue = e.length ? e.map(i => i.value) : '';
         fields[fieldName] = fieldValue;
       } else {
          fieldValue = target.value;
         fields[fieldName] = target.value;
   
       }
    if(isBtnValidate){
      validateField(
          fieldName, fieldValue, fields, true
      );
    }
    formdataset = {
      ...formdata,
      ...fields
    }
    setformdata(formdataset)  
    let isValid=validateForm();
    if(isValid){
      setModalText('')
    }  
  }

  const onHandleBlur = (e,field) => {
    let target=e.target
    let formdataset={...formdata}
    const fields = {};

    
  }
  
  const onClickSubmit = (e,item) => {
    if(item.name&&item.name=="addNew"){
      let accessable = getAccessLevel(Storage.getItem('userType'), Storage.getItem('accessLevel'))
      let selectedUserType = userType && userType
      if(accessable){
        setInitialState(fieldList[0].aircraftInformation,true)
        if (selectedUserType === 'operator' || selectedUserType ==='fbo') {
          navigate(`/dashboard/adduser`, {state:{addNewUser: true, selectedUser: selectedUserType}})
        } else {
          navigate(`/dashboard/admin-adduser`, {state:{addNewUser: true, selectedUser: selectedUserType}})
        }
      }
      else{
        setrestricted(true)
      }
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
      setBusy(true)
      seteditModalShow(false)
      setServiceBusy(false)
      document.getElementById('root').style.filter = 'none';
      setModalText('')
      setbtnValidate(false)
      let saveJSON={}
      const isShown=false;
      const isinternal=false;
      if(addNew){
        let userType= Storage.getItem('userType')
       if(userType.toLowerCase()=='operator'||userType.toLowerCase()=='fbo'){
        const isShown=true;

       
      }
      else if (userType.toLowerCase()=='internal')
      {
        const isinternal=true;
      }

        // saveJSON.service="user";
        // saveJSON.json=formdata;
        // delete saveJSON.json.userId;
        // saveJSON.json.organizationName=Storage.getItem('organizationName')
        // accountCompanyEditService(saveJSON).then((res)=>{
        //   if(res==undefined){
        //     setModalText("Technical error")
        //     setModalShow(true)
        //   }
        //   setrefresh(refresh+1)
        // })
        // setaddNew(false)
        
      }else{
        let loc=[]
        saveJSON.service="user";
        let data = formdata;
        data.location && data.location.forEach((val)=>{
          let obj={}
          obj['city']=val
          loc.push(obj)
        })
        saveJSON.json=formdata;
        saveJSON.json['location'] = loc
        saveJSON.json['userType'] = userType=='internal' ? 'Barrel Fuel': userType ? userType : Storage.getItem('userType')
        saveJSON['loginUserName'] = useremail
        saveJSON.json.mobileNumber=saveJSON.json.mobileNumber.replace(/\D/g,'')
        accountCompanyEditService(saveJSON).then((res)=>{
          if(oldemail != null){
            let payload = {}
            payload.type = "update"
            payload.notificationMessage = fieldList[0].notifyMessage.msg1+ oldemail +fieldList[0].notifyMessage.msg5 +formdata.email+"."
            payload.organizationName = orgName
            payload.loginUserName = loginName
            payload.sendNotificationTo = "Individual"
            payload.individualUser = formdata.email
            payload.levelOfAccess = access == "Super" ? "Level 1 (Admin)" : access == "Admin" ? "Level 2 (Standard)" : "Level 3 (Basic)"
            payload.isActionable = false
            payload.actionTaken = ""
            payload.category = "user"
            payload.readInd = false
            saveNotificationList(payload,dispatch).then((res)=>{
              setoldemail(null)
            })

            let auditPayload = {"ModuleName":"Account",
                                                "TabName":"User",
                                                "Activity":formdata.email+" detail Updated",
                                                "ActionBy":Storage.getItem('email'),
                                                "Role":JSON.parse(Storage.getItem('userRoles')),
                                                "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
                            saveAuditLogData(auditPayload, dispatch)

          }
          if(oldaccess != null){
            let payload = {}
            payload.type = "update"
            payload.notificationMessage = fieldList[0].notifyMessage.msg2+ oldaccess +fieldList[0].notifyMessage.msg5 +formdata.accessLevel+"."
            payload.organizationName = orgName
            payload.loginUserName = loginName
            payload.sendNotificationTo = "Individual"
            payload.levelOfAccess = access == "Super" ? "Level 1 (Admin)" : access == "Admin" ? "Level 2 (Standard)" : "Level 3 (Basic)"
            payload.individualUser = formdata.email
            payload.isActionable = false
            payload.actionTaken = ""
            payload.category = "user"
            payload.readInd = false
            saveNotificationList(payload,dispatch).then((res)=>{
              setoldaccess(null)
            })
            let auditPayload = {"ModuleName":"Account",
                                                "TabName":"User",
                                                "Activity":formdata.email+" detail Updated",
                                                "ActionBy":Storage.getItem('email'),
                                                "Role":JSON.parse(Storage.getItem('userRoles')),
                                                "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
                            saveAuditLogData(auditPayload, dispatch)
          }
          if(oldrole != null){
            let payload = {}
            payload.type = "update"
            payload.notificationMessage = fieldList[0].notifyMessage.msg3+ oldrole +fieldList[0].notifyMessage.msg5 +formdata.roles+"."
            payload.organizationName = orgName
            payload.loginUserName = loginName
            payload.sendNotificationTo = "Individual"
            payload.levelOfAccess = access == "Super" ? "Level 1 (Admin)" : access == "Admin" ? "Level 2 (Standard)" : "Level 3 (Basic)"
            payload.individualUser = formdata.email
            payload.isActionable = false
            payload.actionTaken = ""
            payload.category = "user"
            payload.readInd = false
            saveNotificationList(payload,dispatch).then((res)=>{
              setoldrole(null)
            })
            let auditPayload = {"ModuleName":"Account",
                                                "TabName":"User",
                                                "Activity":formdata.email+" detail Updated",
                                                "ActionBy":Storage.getItem('email'),
                                                "Role":JSON.parse(Storage.getItem('userRoles')),
                                                "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
                            saveAuditLogData(auditPayload, dispatch)
          }
          if(lochange != null){
            let oldloc = ""
            let newloc = ""
            let oldLocLength = lochange.length
            let newLocLength = data.location.length
            lochange.forEach((item,index)=>{
              if(index == oldLocLength-1)
                oldloc = oldloc+item
              else
                oldloc = oldloc+item+','
            })
            data.location && data.location.forEach((val,index)=>{
              if(index == newLocLength-1)
                newloc = newloc+val.city
              else
                newloc = newloc+val.city+','
            })
            let payload = {}
            payload.type = "update"
            payload.notificationMessage = fieldList[0].notifyMessage.msg4+oldloc+fieldList[0].notifyMessage.msg5+newloc+"."
            payload.organizationName = orgName
            payload.loginUserName = loginName
            payload.sendNotificationTo = "Individual"
            payload.levelOfAccess = access == "Super" ? "Level 1 (Admin)" : access == "Admin" ? "Level 2 (Standard)" : "Level 3 (Basic)"
            payload.individualUser = formdata.email
            payload.isActionable = false
            payload.actionTaken = ""
            payload.category = "user"
            payload.readInd = false
            saveNotificationList(payload,dispatch).then((res)=>{
              setlochange(null)
            })
            let auditPayload = {"ModuleName":"Account",
                                "TabName":"User",
                                "Activity":formdata.email+" detail Updated",
                                "ActionBy":Storage.getItem('email'),
                                "Role":JSON.parse(Storage.getItem('userRoles')),
                                "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
            saveAuditLogData(auditPayload, dispatch)
          }
          setrefresh(refresh+1)
        })
      }
      
    }else{
      setModalText(fieldList[0].modal.validate.text)
      // setModalShow(true)
    }
    }
    
  }

  const handleCheck = (e,item) => {
  }

   const clickEdit = (data) => {
    userDetailsData.forEach((row)=>{
      
      if(row.userId == data.taxID && row.email== data.email){
        // row.accessLevel=!row.accessLevel.length ? '' : row.accessLevel[0]
        setInitialState(editjson && editjson,false,row)
     }
    })
    setdisable(true)
    seteditModalShow(true)
  }

  const clickDeactivate = (data) => {
    userDetailsData.forEach((row)=>{
      if(( row.userId == data.taxID && row.email== data.email) && row.email== data.email){

        setuserId(row.userId)
        setDeletedEmail(row.email)
        setDeletedName(row.firstName)
        if(row.activateInd == "N"){
          setModalText(fieldList[0].modal.delete.text)
        }else{
          setModalText(fieldList[0].modal.deactivate.text)
          
        }
        setIsInactiveUser(row.activateInd)
        setModalShow(true)
        document.getElementById('root').style.filter = 'blur(5px)';
      }
    })
   
    
  }  
  const closeModal = () => {
    setModalShow(false);
    setModalText('')
    document.getElementById('root').style.filter = 'none';
  }
  const closeEditModal = () => {
    seteditModalShow(false);
    document.getElementById('root').style.filter = 'none';
    setaddNew(false)
    seteditModalShow(false)
    setInitialState(fieldList[0].aircraftInformation)
    setbtnValidate(false)
    setModalText('')
  }
  const successModal = () => {
    setModalShow(false)
    setModalText('')
    document.getElementById('root').style.filter = 'none';
    setIsInactiveUser("Y")

    if(modalText==fieldList[0].modal.deactivate.text){
      setBusy(true)
      let payload={
        "userId": userId.toString(),
        "loginUserName": useremail
      }
      // payload.userType="FBO"
        

        accountUserDeactivateService(payload).then((res) => {
          if (res.message == 'data Deleted Successfully') {
            const emailBody = fieldList[0].emailBody
            let name = deletedName
            name = name.charAt(0).toUpperCase() + name.slice(1);
            let paragraph = `${emailBody.paragraph} ${name},`
            let body = `${paragraph} <br> <br>${emailBody.html}`
            const emailPayload = {
              "to": [deletedEmail],
              "from": sender_Email,
              "subject": emailBody.title,
              "text": paragraph,
              "html": body
            }

            let auditPayload = {"ModuleName":"Account",
                                                "TabName":"User",
                                                "Activity":useremail+" Deactived",
                                                "ActionBy":Storage.getItem('email'),
                                                "Role":JSON.parse(Storage.getItem('userRoles')),
                                                "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
                            saveAuditLogData(auditPayload, dispatch)
                            
            SendMailToUsers(emailPayload)
            setrefresh(refresh + 1)
          } else {
            setModalText('Server Error')
            setModalShow(true)
            document.getElementById('root').style.filter = 'blur(5px)';
          }

        })
      
    }else if(modalText==fieldList[0].modal.delete.text){
      setBusy(true)
      let payload={
        "userId": userId.toString(),
        "loginUserName": useremail
      }
      accountUserDelete(payload).then((res) => {
        if (res.message == 'data Deleted Successfully') {
          const emailBody = fieldList[0].emailBody
          let name = deletedName
          name = name.charAt(0).toUpperCase() + name.slice(1);
          let paragraph = `${emailBody.paragraph} ${name},`
          let body = `${paragraph} <br> <br>${emailBody.html}`
          const emailPayload = {
            "to": [deletedEmail],
            "from": sender_Email,
            "subject": emailBody.title,
            "text": paragraph,
            "html": body 
          }
          SendMailToUsers(emailPayload)
          let auditPayload = {"ModuleName":"Account",
                                                "TabName":"User",
                                                "Activity":useremail+" Deactived",
                                                "ActionBy":Storage.getItem('email'),
                                                "Role":JSON.parse(Storage.getItem('userRoles')),
                                                "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
                            saveAuditLogData(auditPayload, dispatch)
          setrefresh(refresh + 1)
        } else {
          setModalText('Server Error')
          setModalShow(true)
          document.getElementById('root').style.filter = 'blur(5px)';
        }
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
           // disabled={!isEditable ? true :false}
            disabled={restricted}
            handleClick={(e)=>onClickSubmit(e,item)}/>)
     };
}

const handleViewRow = () => {

}


//   return (<>{isBusy?(<Loader/>):(
//   <div className={`${modalShow || editmodalShow ? 'bf-show-model-blr' : ''}`}>
//     <div  className={`${fieldList[0].addNewAircraft ? fieldList[0].addNewAircraft.styles.colWidth : ''} bf-absolute`}>
//   {fieldList[0].addNewAircraft ? getOperatorFields(fieldList[0].addNewAircraft) : ''}
// </div >
//     <BFTable Data ={rows} 
    
   return (<>
    <><div  className={`${fieldList && fieldList[0].addNewAircraft ? fieldList[0].addNewAircraft.styles.colWidth : ''} bf-absolute`}>
    {fieldList && fieldList[0].addNewAircraft ? getOperatorFields(fieldList[0].addNewAircraft) : ''}
  </div>  
  {fieldList &&  fieldList.length ?
    <div className='bf-table-container bf-user-table-container'>
      <BFTable 
        sortEnabled = {true} 
        searchEnabled={true} 
        Data ={rows && rows} 
        heading={cells && cells} 
        searchBy={["name", "email", "mobileNumber"]}
        primaryClick = {clickEdit}
        secondaryClic = {clickDeactivate}
        loading = {loading}
        getActiveInactiveUsers = {getActiveInactiveUsers}
        isUserTab = {true}
        userLevelId = {levelUserId}
        passwordIdArray = {passwordIdArray}
        level2={isLevel2}
      >
      </BFTable>

      <BFTable 
        sortEnabled = {false} 
        searchEnabled={true} 
        Data ={mobileDataRows && mobileDataRows} 
        heading={mobileCells && mobileCells} 
        searchBy={["name"]}
        primaryClick = {clickEdit}
        secondaryClic = {clickDeactivate}
        handleViewRow = {handleViewRow}
        loading = {loading}
        getActiveInactiveUsers = {getActiveInactiveUsers}
        isUserTab = {true}
        isUserMobileTab = {true}
        isMobileTable = {true}
        viewLabels = {cells && cells}
        viewData = {rows && rows} 
        jsonData = {jsonData}
        viewLabel = {jsonData?.data?.data?.userData[0].mobileViewHeader}
        userLevelId = {levelUserId}
        passwordIdArray = {passwordIdArray}
      >
      </BFTable>

    </div>
    :""}
      {editmodalShow?<EditFormModal
            onHide={() => closeEditModal()}
            isAdmin={acclvl}
            companyName={state.companyValue}
            formErrors={formErrors}
            formdata={formdata}
            isUserTab={true}
            show={editmodalShow}
            json={editjson}
            onHandleChange={onHandleChange}
            onHandleBlur={onHandleBlur}
            userType={selectedUser=='internal'?'barrel fuel':selectedUser}
            onClickSubmit={onClickSubmit}
            handleCheck={handleCheck}
            showError = {modalText}
            submittedForm = {serviceBusy}
        />:""}
        {fieldList &&
      <CustomModal
      show={modalShow}
      onHide={() => successModal()}
      close = {()=>closeModal()}
      hide={()=>closeModal()}
      modelBodyContent={modalText}
      buttonText={modalText== fieldList[0].modal.deactivate.text? fieldList[0].modal.deactivate.button1: fieldList[0].modal.validate.button1}
      secondbutton={modalText==fieldList[0].modal.deactivate.text ||modalText==fieldList[0].modal.delete.text ? fieldList[0].modal.deactivate.button2:""}
    />}</>
       </>
    );
  }
export default User;