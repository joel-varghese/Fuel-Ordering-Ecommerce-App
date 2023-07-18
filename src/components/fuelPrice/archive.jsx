import React, { useState,useEffect } from 'react';
import { bfaJsonService } from '../../actions/BFAServices/BFAJsonService';
import './company.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { Storage, jsonStringify } from '../../controls/Storage';
import { accountCompanyEditService, accountUserDeactivateService,deleteAircraft, fetchCompanyDetails } from '../../actions/accountServices/accountCompanyService';
import FuelPriceTable from '../table/fuelPriceTable'
import Loader from '../loader/loader';
import CustomModal from '../customModal/customModal';
import ButtonComponent from '../button/button';
import EditFormModal from '../customModal/editModal';
import { getFieldIsValid } from '../../controls/validations';
import { adminAddUserSave } from "../../actions/adminAddUserService/adminAddUserService";
import { getAccessLevel } from '../../controls/commanAccessLevel';
//import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJSONData, fetchUserData } from '../../actions/userActions/userActions';
import { fetchFuelArchiveData, getSelectedFuelPriceData } from '../../actions/fuelPriceHome/fuelPriceHomeActions';
function Archive() {
    let {state} = useLocation()
    const [fieldList, setFieldList] = useState(null);
    const [rows, setRows] = useState(null);
    const [userDetailsData, setUserDetailsData] = useState(null);
    const [formdata, setformdata] = useState({});
    const [editmodalShow, seteditModalShow] = useState(false);
    const [formErrors, setformErrors] = useState({});
    const [isBtnValidate,setbtnValidate]=useState(false);
    const [modalText, setModalText] = useState("");
    const [modalShow, setModalShow] = useState(false);
    const [isEditable, setIsEditable] = useState(false);const [formFieldErrors , setFormFieldErrors] = useState([]);
    const [formData , setFormData] = useState({});
    const [formFieldData , setFormFieldData] = useState([]);
    const [operatorCheck , setoperatorCheck] = useState(false);
    const [refresh,setrefresh]=useState(0);
    const [newRows, setnewRows] = useState([]);
    const [addNew, setaddNew] = useState(false);
    const [disable,setdisable]=useState(false);
    const [name,setname]=useState(0);
    const [restricted,setrestricted]=useState(true);
    const [userId,setuserId]=useState(0);
    const [serviceBusy, setServiceBusy] = useState(false);
    const [useremail, setUserEmail] = useState()
    const [isBusy, setBusy] = useState(true);
    const [loading, setLoading] = useState(true)
    const [userType, setUserType] = useState()
    let jetAArrayValue = []
    const [fuelTypeValue, setFuelTypesValues] = useState([{'jeta':[0.0]},{'100ll':[0.0]},{'saf':[0.0]},{'Prist':[0.0]}])
    const paylod = { 'blobname': 'accountUser.json' }
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const fuelPriceHomeReducer = useSelector((state) => state.fuelPriceHomeReducer);
    const jsonData = fuelPriceHomeReducer && fuelPriceHomeReducer.fuelPriceHomeJson && fuelPriceHomeReducer.fuelPriceHomeJson;;
    let fuelArchiveData = fuelPriceHomeReducer && fuelPriceHomeReducer.fuelArchiveData && fuelPriceHomeReducer.fuelArchiveData;
    fuelArchiveData = fuelArchiveData && fuelArchiveData.data && fuelArchiveData.data['JSON_UNQUOTE(@JSONResponse)'] && JSON.parse(jsonStringify(fuelArchiveData.data['JSON_UNQUOTE(@JSONResponse)']))
    let userData = undefined;
    const loader = fuelPriceHomeReducer && fuelPriceHomeReducer.loading && fuelPriceHomeReducer.loading;
    //const fuelPriceHomeReducer = useSelector((state) => state.accountHomeReducer);
    const selectedUser = fuelPriceHomeReducer && fuelPriceHomeReducer.selectedUser ? fuelPriceHomeReducer.selectedUser.user:Storage.getItem('userType').toLocaleLowerCase();
    const selectedCompanyValue = fuelPriceHomeReducer && fuelPriceHomeReducer.selectedCompany && fuelPriceHomeReducer.selectedCompany;
    const loginReducer = useSelector(state => state.loginReducer);
    const loginDetails = loginReducer && loginReducer.loginDetails &&loginReducer.loginDetails.data;
    let loginDetls =  JSON.stringify(loginDetails) === '{}'?{}:JSON.parse(loginDetails);
    let userEmail = loginDetls.loginUserName?loginDetls.loginUserName:'';

    function createData(firstName,lastName, calories, fat, carbs, protein, item2, item3, wholeData) {
      return {
        "location":firstName, 
        "validRange":lastName,
        "addedBy":calories,
        "Tire":fat,
        "jetA":carbs,
        "100ll":protein,
        "prist":item2,
        "saf":item3,
        "Buttons":[{"Label":"Duplicate", "method":"onEditClick","className":"btn btn-bf-primary"}],
        "wholeData": wholeData
      };
    }
    
    useEffect(() => {
      //setrefresh(0);
      let accLevel=JSON.parse(Storage.getItem('accessLevel'))
      accLevel=accLevel.map((level)=>{
        level=level.toLowerCase()
        return level
      })
      let usermailID = Storage.getItem('email')
      setUserEmail(usermailID)
      let userType= Storage.getItem('userType')
      let accessable = getAccessLevel(Storage.getItem('userType'), Storage.getItem('accessLevel'))
      if(accessable && Storage.getItem('organizationName') !== "undefined"){
        setrestricted(false)
      }
      let companyDetails={'service': 'user', 'loginUserName':usermailID, 'organizationName': state && state.companyValue && state.companyValue}
      fetchJSONData(dispatch, paylod)
      
      //fetchUserData(dispatch, companyDetails)
  }, [state && state.companyValue && state.companyValue, refresh]);

  const createBaseData = (data, categoryData) =>{
    let fuelData = []
    let allFuelData = []
    let fuelBaseData = null

    data.Tiers.map((item,index)=>{
      fuelData.push(item.BasePrice + item.CostPlus)
   })
    if(fuelData.length  === 1){
      categoryData.map((item, index)=>{
        if(data.Name === "Sustainable Aviation Fuel (SAF)"){
          allFuelData.push(fuelData[0] + jetAArrayValue[index])
        } else if(data.Name === "Jet A+ / Prist"){
          allFuelData.push(fuelData[0] + jetAArrayValue[index])
        } else {
          allFuelData.push(fuelData[0] )
        }
                  
      })
   } else{
    allFuelData = fuelData
   }
  //}
   
   
    switch(data.Name){
      
      case 'Jet A':
        jetAArrayValue = fuelData
        //fuelTypeValue[0]['jeta'] = fuelData
        return  {"label":"jeta", "value":allFuelData}
        
       
      break;
      case '100LL':

        return {"label":"100ll","value":allFuelData}
      break;
      case 'Sustainable Aviation Fuel (SAF)':
        return  {"label":"saf","value":allFuelData}
      break;
      case 'Jet A+ / Prist':
        return  {"label":"prist","value":allFuelData}
      break;
      default:
    }
    //return fuelTypeValue;
  }
const createFeesTaxDiscount = (data, count, FuelTypes) =>{
  let fuelData = []
  let fuelBaseData = []
  let totalOfTax = 0;
  data.Tiers.map((item,index)=>{
    let totalOfTax = 0;
    item.Taxes && item.Taxes.map((data,index) => {
      fuelBaseData.push({"taxName":data.Tax, "amount":data.Amount})
      totalOfTax = parseFloat(totalOfTax) + parseFloat(data.Amount);
    })

    item.Fees && item.Fees.map((data,index) => {
      fuelBaseData.push({"taxName":data.Fees, "amount":data.Amount})
      totalOfTax = parseFloat(totalOfTax) + parseFloat(data.Amount);
    })

    item.Discounts && item.Discounts.map((data,index) => {
      fuelBaseData.push({"taxName":data.Disount, "amount":data.Amount})
      totalOfTax = parseFloat(totalOfTax) + parseFloat(data.Amount);
    })
    return fuelBaseData;
 })
  
  return fuelBaseData;
}
  useEffect(() => {
    let organizationName= selectedCompanyValue && selectedCompanyValue.company && selectedCompanyValue.company !== null?selectedCompanyValue.company:""
    fetchFuelArchiveData( {"FBO": organizationName,"loggedinuser":userEmail}, dispatch).then((response)=>{
      let fueActiveData = response && response['JSON_UNQUOTE(@JSONResponse)'] && JSON.parse(jsonStringify(response['JSON_UNQUOTE(@JSONResponse)']))
      let dumyDataResponse = fueActiveData;
    let rows = []
    let userRows = [];
    dumyDataResponse && dumyDataResponse.AiportLocations.map((item)=>{
      let locatinData = null
      let jetA = null
      let LL100 = 0
      let saf = null
      let prist = null
      let categotyData = [];
      let createBaseDataArray = [];
      let feesTaxDiscount = []
      item.FuelTypes.map((data, count)=>{
        let accordionArray = []
        let fuelData = []
        if(data.PricingType === "Tiered"){
          data.Tiers.map((item,index)=>{
            if(item.MaxRange !== null){
              fuelData.push(item.MinRange+"-"+item.MaxRange)
            } else {
              fuelData.push(item.MinRange+"+")
            }
         })
         //categotyData = fuelData;
         categotyData = categotyData.length > 0 && categotyData.length > fuelData.length ? categotyData: fuelData;
        } else {
          if(data.Name === "100LL" && categotyData.length == 0 ){
            categotyData = [""]
          }
        }
            
            createBaseDataArray.push(createBaseData(data, categotyData))
            feesTaxDiscount= createFeesTaxDiscount(data, count, item.FuelTypes)
        
      })
      //createBaseDataArray = createBaseDataArray
      rows.push(createData(item.Location, getValidDateRange(item.ExpirationDate), item.addedby, categotyData,
      getActiualVaue('jeta',createBaseDataArray), 

      getActiualVaue('100ll',createBaseDataArray),

      getActiualVaue('saf',createBaseDataArray),

      getActiualVaue('prist',createBaseDataArray),item))
    })

    setRows(null)
    let data = jsonData && jsonData.data && jsonData.data.data && jsonData.data.data;
   
    let responseData = userData && userData.data && userData.data.res
      setFieldList(data)
      rows  && rows.map((item,index)=>{
      let roleData = [];
      userRows.push(item)
    })
    //setnewRows(responseData)
    setnewRows(rows)
    setRows(userRows)
    setBusy(false);
    setLoading(loader&& loader)
    setUserType(selectedUser && selectedUser)
    })
    //let dumyDataResponse = dumyData();
    
  },[jsonData,loader,selectedUser, state.companyValue, refresh])

  const getActiualVaue = (label, data) =>{
    let returnValue = []
    data.map((item)=>{
      if(item.label === label){
        returnValue = item.value
      } 
    })
    return returnValue
  }

  const getValidDateRange =(validDate) =>{
    let validDateRange = validDate.split("-");
    return validDateRange[1]+"/"+validDateRange[2]+"/"+validDateRange[0]
  }

  const setInitialState = (fboData,clear,editdata) => {
    const formData = {};
    let formErrors = {};
    const fieldTypeArr = ['input', 'select','id'];

    fboData && fboData.fields.forEach((item) => {
        if (fieldTypeArr.includes(item.component.toLowerCase())) {
          if(item.name == 'accessLevel' && editdata && Array.isArray(editdata[item.name])) {
            formData[item.name] = editdata[item.name].length ? editdata[item.name][0].accessLevels : ''
          } else if(item.name == 'roles' && editdata && Array.isArray(editdata[item.name])) {
            formData[item.name] = editdata[item.name].length ? editdata[item.name][0].roleType : ''
          } else {
            formData[item.name] =editdata && editdata[item.name]?(typeof editdata[item.name] == 'number' ? editdata[item.name].toString() : editdata[item.name]): clear? "": formdata && formdata[item.name] ? formdata[item.name] : item.defaultValue?item.defaultValue:"";
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
     if (field.name == "access") {

       let value = {
          "accessLevel": target.value
       }

       adminAddUserSave(value).then(response => {
         formdataset['accessLevel'] = response.data.serialNumber === undefined ? '' : response.data.accessLevel;
         formdataset['roles'] = response.data.manufacturer === undefined ? '' : response.data.roles;
         //   formdataset['aircraftType'] = response.data.aircraftType === undefined ? '' : response.data.aircraftType;
      //   setformdata(formdataset)
      })   
   }else{
     setformdata(formdataset)
   }
   setTimeout(()=>{
    setformdata(formdataset) 
   },1500)  
  }
  
  const onClickSubmit = (e,item) => {
    if(item.name && item.name=="addNew"){
      getSelectedFuelPriceData({addNewUser: true, companyName :selectedCompanyValue.company?selectedCompanyValue.company:Storage.getItem('organizationName')}, dispatch)
          navigate(`/dashboard/add-new-fuel`, {state:{addNewUser: true, companyName :selectedCompanyValue.company?selectedCompanyValue.company:Storage.getItem('organizationName')}})
     
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

               
      }else{
        saveJSON.service="user";
        let data = formdata;
        if (Array.isArray(data.accessLevel)){
          data.accessLevel= data.accessLevel[0]
        }
        if (Array.isArray(data.roles)){
          data.roles= data.roles[0]
        }
        saveJSON.json=formdata;
        saveJSON.json['userType'] = userType ? userType : Storage.getItem('userType')
        saveJSON['loginUserName'] = useremail
        accountCompanyEditService(saveJSON).then((res)=>{
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
    getSelectedFuelPriceData({addNewUser: false, data: data, screen:"archive",companyName :state.companyValue?state.companyValue:Storage.getItem('organizationName')}, dispatch)
    navigate(`/dashboard/add-new-fuel`, {state:{addNewUser: false,  data: data, screen:"archive",companyName :state.companyValue?state.companyValue:Storage.getItem('organizationName')}})
    
  }

  const clickDeactivate = (data) => {
   
    newRows.forEach((row)=>{
      if((row.accessLevel.length == 0 || row.accessLevel[0].accessLevels==data.access) && (row.roles.length == 0 || row.roles[0].roleType == data.roles) && row.email== data.email){
        setuserId(row.userId)
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
    if(modalText==fieldList[0].modal.deactivate.text){
      setBusy(true)
      let payload={
        "userId": userId.toString(),
        "loginUserName": useremail
       


      }
      // payload.userType="FBO"
      
      accountUserDeactivateService(payload).then((res)=>{
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
            disabled={ restricted?true:Storage.getItem('organizationName') !== "undefined"?false:state.companyValue? true:false}
           // disabled={restricted}
            handleClick={(e)=>onClickSubmit(e,item)}/>)
     };
}

    
   return (
   <>{
    <><div  className={`${fieldList && fieldList.active.addNewFuelPrice ? fieldList.active.addNewFuelPrice.styles.colWidth : ''} bf-absolute`}>
    {fieldList && fieldList.active.addNewFuelPrice ? getOperatorFields(fieldList.active.addNewFuelPrice) : ''}
  </div>  
  {fieldList && !loader ?
    <div className='bf-table-container bf-fuelPricint-active-table-container'>
      <FuelPriceTable 
      sortEnabled = {true} 
      searchEnabled={true} 
      Data ={rows && rows} 
      heading={fieldList.archive.headCells} 
      searchBy={["location", "addedBy"]}
      primaryClick = {clickEdit}
      secondaryClic = {clickDeactivate}
      // loading = {loading}
      screen = {"fuelPrice"}
      >
      </FuelPriceTable>
    </div>
    :<div className='table-loader'><Loader height="auto"/></div>}
      {editmodalShow?<EditFormModal
            onHide={() => closeEditModal()}
            formErrors={formErrors}
            formdata={formdata}
            show={editmodalShow}
            json={fieldList.active.aircraftInformation}
            onHandleChange={onHandleChange}
            onHandleBlur={onHandleBlur}
            userType={userType}
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
      buttonText={modalText== fieldList.active.modal.deactivate.text? fieldList.active.modal.deactivate.button1: fieldList.active.modal.validate.button1}
      secondbutton={modalText==fieldList.active.modal.deactivate.text? fieldList.active.modal.deactivate.button2:""}
    />}</>
       }</>
    );
  }
export default Archive;