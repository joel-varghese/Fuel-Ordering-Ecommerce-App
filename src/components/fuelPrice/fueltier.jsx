import React, { useState,useEffect, useRef } from 'react';
import { bfaJsonService } from '../../actions/BFAServices/BFAJsonService';
import './company.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { Storage, jsonStringify } from '../../controls/Storage';
import { accountCompanyEditService, accountUserDeactivateService,deleteAircraft, fetchCompanyDetails } from '../../actions/accountServices/accountCompanyService';
import {getAddressFromAcukwik} from '../../actions/OperatorFboService/operatorFboService'
import CustomModal from '../customModal/customModal';
import ButtonComponent from '../button/button';
import EditFormModal from '../customModal/editModal';
import { phoneValidation, einValidation, zipValidation,getFormErrorRules, getPasswordStrength, matchPassword, validateForm } from '../../controls/validations';
import { getAccessLevel, getSuperAccess } from '../../controls/commanAccessLevel';
import { useDispatch, useSelector } from 'react-redux';
import FuelPriceTable from '../table/fuelPriceTable'
import { stateMapper } from '../stateMapper';
import { enablePopUp } from '../../actions/commonActions/commonActions';
import { fetchJSONData, fetchFuelTireData, saveFuelTirePriceService } from '../../actions/fuelPriceHome/fuelPriceHomeActions';
import CustomFormModal from '../customModal/customFormModal';
import EditFuelTire from './editFuelTire';
import { insertFBODefaultFuelPrice} from '../../actions/OperatorFboService/operatorFboService';
import Loader from '../loader/loader';
import {saveAuditLogData } from '../../actions/auditLog/auditLogActions';

function FuelTiers() {
  let {state} = useLocation()
  const [fieldList, setFieldList] = useState(null);
  const [rows, setRows] = useState(null);
  const [formdata, setformdata] = useState({});
  const [editmodalShow, seteditModalShow] = useState(false);
  const [formErrors, setformErrors] = useState({});
  const [isBtnValidate,setbtnValidate]=useState(false);
  const [modalText, setModalText] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [refresh,setrefresh]=useState(0);
  const [newRows, setnewRows] = useState([]);
  const [addNew, setaddNew] = useState(false);
  const [disable,setdisable]=useState(false);
  const [restricted,setrestricted]=useState(false);
  const [userId,setuserId]=useState(0);
  const [serviceBusy, setServiceBusy] = useState(false);
  const [useremail, setUserEmail] = useState()
  const [isBusy, setBusy] = useState(true);
  const [loading, setLoading] = useState(true)
  const [userType, setUserType] = useState()
  //const paylod = { 'blobname': 'accountUser.json' }
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [address1Selected, setAddress1Selected] = useState([]);
  const [isAddress1Loading, setAddress1Loading] = useState(false);
  let [resetvalue,setResetValue] = useState(); 
  let addressdata = []
  let fulladdressdata = []
  let isaddressvalid = true;
  const [fullresults, setFullResults] = useState({});
  const typeaheadRef = useRef(null);
  const [results, setResults] = useState({});
  const [modalTextForEdit, setModalTextForEdit] = useState("");
  const [deactivateData, setDeactivateData] = useState([]);
  const [reset, setReset] = useState(null);
  const [modalEditShow, setModalEditShow] = useState(false);
  const [fuelTireData, setFuelTireData] = useState();
  const [dummyRefresh, setDummyRefresh] = useState('');
  const [validFieldIssue, setValidFieldIssue] = useState(false);
  const fuelPriceHomeReducer = useSelector((state) => state.fuelPriceHomeReducer);
  const jsonData = fuelPriceHomeReducer && fuelPriceHomeReducer.fuelPriceHomeJson && fuelPriceHomeReducer.fuelPriceHomeJson;
  //let fueltireData = fuelPriceHomeReducer && fuelPriceHomeReducer.fuelTireData && fuelPriceHomeReducer.fuelTireData;
  //fueltireData = fueltireData && fueltireData.data && JSON.parse(jsonStringify(fueltireData.data[0][0]['JSON_UNQUOTE(@JSONResponse)']))
  const loader = fuelPriceHomeReducer && fuelPriceHomeReducer.loading && fuelPriceHomeReducer.loading;
  const accountHomeReducer = useSelector((state) => state.accountHomeReducer);
  const selectedUser = accountHomeReducer && accountHomeReducer.selectedUser ? accountHomeReducer.selectedUser.user:Storage.getItem('userType').toLocaleLowerCase();
  let melissaEndpointURI = process.env.REACT_APP_MELISSA_ENDPOINT
  let melissaTopRecords = process.env.REACT_APP_MELISSA_TOP_RECORDS
  const selectedCompanyValue = fuelPriceHomeReducer && fuelPriceHomeReducer.selectedCompany && fuelPriceHomeReducer.selectedCompany;
  const loginReducer = useSelector(state => state.loginReducer);
  const loginDetails = loginReducer && loginReducer.loginDetails &&loginReducer.loginDetails.data;
    let loginDetls =  JSON.stringify(loginDetails) === '{}'?{}:JSON.parse(loginDetails);
    let userEmail = loginDetls.loginUserName?loginDetls.loginUserName:'';
    const orgName = loginDetls.organizationName?loginDetls.organizationName:'';
  function createData(location,jetA, LL100, jestPresist, saf, accordion, tired, wholeData, AirportId) {
    return {
      "Icon":"Icon",
      "AirportId":AirportId,
      "location":location, 
      "jetA":jetA,
      "100LL":LL100,
      "jetaPrist":jestPresist,
      "saf":saf,
      "Buttons":[{"Label":"Edit", "method":"onEditClick","className":"btn btn-bf-primary"}],
      "accordion": accordion,
      "tired":tired,
      "wholeData":wholeData

           
    };
  }
  
  const onEditClick =() =>{
    //alert("ok")
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
    let accessable = getSuperAccess(Storage.getItem('userType'), Storage.getItem('accessLevel'))
    if(accessable && Storage.getItem('organizationName') !== "undefined"){
      setrestricted(false)
    } else {
      setrestricted(true)
    }
    let companyDetails={'service': 'user', 'loginUserName':usermailID, 'organizationName': state && state.companyValue && state.companyValue}
    //fetchJSONData(dispatch, paylod)
    //fetchUserData(dispatch, companyDetails)
}, [state && state.companyValue && state.companyValue, refresh]);

useEffect(() => {
  let organizationName = selectedCompanyValue.company && selectedCompanyValue.company!== null?selectedCompanyValue.company:"";
  fetchFuelTireData({"FBO": organizationName, "loggedinuser":userEmail}, dispatch).then((response)=>{
    let rows = []
    let userRows = [];
    
    if(response && response[0][0] && response[0][0]["Msg"] && response[0][0]["Msg"] === "No Record Found"){
      let data = jsonData && jsonData.data && jsonData.data.data && jsonData.data.data;
      setFieldList(data)
      setnewRows([])
    }else {
    let dumyDataResponse = response && response && JSON.parse(jsonStringify(response[0][0]['JSON_UNQUOTE(@JSONResponse)']))
    setFuelTireData(dumyDataResponse)
    dumyDataResponse && dumyDataResponse.AiportLocations.map((item)=>{
      let locatinData = null
      let jetA = 0
      let LL100 = null
      let saf = null
      let prist = null
      let accordion = [];
      let tierData = []
      tierData["labeldata"] = "";
      tierData["tiresDrop"] = true;
      tierData["label0"] = "Tier 1";
      tierData["label1"] = "Tier 2";
      tierData["label2"] = "Tier 3";
      tierData["label3"] = "Tier 4";
      tierData["label4"] = "Tier 5";
      tierData["label5"] = "Tier 6";
      tierData["label6"] = "Tier 7";
      accordion.push(tierData)
      item.FuelTypes.map((data)=>{
        let accordionArray = []
        
        
        if(data.PricingType === "Tiered"){
          let labeData = null;
          switch(data.Name){
            case 'Jet A':
              labeData = "Jet-A"
              jetA = data.Tiers.length;
            break;
            case '100LL':
              labeData = "100LL"
              LL100 = data.Tiers.length;
            break;
            
            default:
          }
          let triedSection = 0;
          accordionArray["labeldata"] = labeData;
          accordionArray["tiresDrop"] = true;
          
          data.Tiers.map((innerData,index)=>{
             accordionArray["label"+index] = innerData.MinRange +"-"+innerData.MaxRange
             triedSection = index;
          })
          for(let i = triedSection+1; i<7;i++)
          {
            accordionArray["label"+i] = null
          }
        } else{
          let labeData = null;
          switch(data.Name){
            case 'Jet A':
              labeData = "Jet-A"
              jetA = data.PricingType;
            break;
            case '100LL':
              LL100 = 0;
              labeData = "100LL"
            break;
            case 'Jet A+ / Prist':
              prist = 0;
              labeData = "Prist"
            break;
            case 'Sustainable Aviation Fuel (SAF)':
              labeData = "SAF"
              saf = 0;
            break;
            default:
          }
          accordionArray["labeldata"] = labeData
          accordionArray["tiresDrop"] = false;
          
        }
        
        accordion.push(accordionArray)
      })
      rows.push(createData(item.Location, isNaN(jetA)?jetA:jetA+" Tiers", LL100 !== null?LL100 == 0 ?"Flat":LL100+" Tiers":"NO", prist ===0?"Yes":"No",saf ===0?"Yes":"No", accordion, accordion.length > 1?true:false, item, item.Airport_id))
    })
  
    setRows(null)
    let data = jsonData && jsonData.data && jsonData.data.data && jsonData.data.data;
    
   // let responseData = fueltireData && fueltireData.data && fueltireData.data.res
      setnewRows(rows)
      setRows(userRows)
      setBusy(false);
      setFieldList(data)
      setInitialState(data && data.fuelTiers.aircraftInformation)
      rows  && rows.map((item,index)=>{
      let roleData = [];
      userRows.push(item)

    })
    
  }
    //setnewRows(responseData)
    
   
    setLoading(loader&& loader)
    setUserType(selectedUser && selectedUser)

  })
  setResults(addressdata)
  document.getElementById('root').style.filter = 'none';

},[jsonData,loader,selectedUser, refresh, state.companyValue])

const searchHandler = (items) => { 
  let formData = { ...formdata };
  let errorData = { ...formErrors };
 try {
  let address = items[0];
  let addressArr = address.split(',')
  let stateAndzip = addressArr[2].split(' ')
  let cityName = addressArr[1].trim();
  let fullAddress = fullresults.filter((item) => item.Address == address)[0];
  let country = fullAddress.CountryName == '' ? 'United States' : fullAddress.CountryName.replace(' Of America', '')
  setAddress1Selected([fullAddress.Address1])
  document.getElementsByName("zip").value = stateAndzip[2]//fullresults[0].PostalCode
  document.getElementsByName("city").value = cityName; //fullresults[0].Locality
  document.getElementsByName("state").value = stateMapper[stateAndzip[1]]//fullresults[0].AdministrativeArea
  document.getElementsByName("country").value = country

  //formData["addressLine2"] = fullresults[0].Address2
  formData["airportLocation"] = addressArr[0]//fullresults[0].Address1
  formData["zip"] = stateAndzip[2]//fullresults[0].PostalCode
  formData["city"] = cityName // fullresults[0].Locality
  formData["state"] = stateAndzip[1] //fullresults[0].AdministrativeArea
  formData["country"] = country
  let fields = ['airportLocation', 'zip', 'city', 'state', 'country'];
  fields.forEach(item => {
      errorData[item].isTouched = true;
      errorData[item].isValid = true;
      validateField(item, formData[item], null, true,
          formErrors,formData)
  })

  setformErrors(errorData);
  //setFormFieldErrors(errorData);
  setformdata(formData);
  //setformDataSet(formData)
  //setFormFieldData(formData)
  document.getElementsByName('airportLocation')[0].blur();
 } catch(err) {
  console.error('Caught error in melissa')
 }
}
const searchAPI = (e) => {  
  setAddress1Loading(true)
  fetch(melissaEndpointURI + e + melissaTopRecords)
      .then((resp) => resp.json())
      .then(({ d }) => {
          for (let i = 0; i < d.Results.length; i++) {
              addressdata.push(d.Results[i].Address.Address)
              fulladdressdata.push(d.Results[i].Address)              
          }
          setResults(addressdata);
          setFullResults(fulladdressdata);
          //setAddress1Selected(d.Results[i].Address);        
          setAddress1Loading(false);
      })
      .catch((error) => {
          setAddress1Loading(false);
      });
}

const hidePopup = () =>{
  setModalEditShow(false)
  setrefresh(Math.random())
}
const onAddressSearchBlur = (evt) => { 
  let formData = { ...formdata };
  let errorData = { ...formErrors };
  if(evt.target.value != '') {
      if(!Array.isArray(address1Selected)) {
          if(address1Selected == '' && (resetvalue != '' && evt.target.value == resetvalue[0])) {
                  setAddress1Selected(resetvalue)
          } else {
              setAddress1Selected([evt.target.value]);
              formData["airportLocation"] = evt.target.value;
          }
      }
      errorData['airportLocation'].isTouched = true;
      errorData['airportLocation'].isValid = true;
      
  } else {
      setAddress1Selected('');
      errorData['airportLocation'].isTouched = true;
      errorData['airportLocation'].isValid = false;
      formData["airportLocation"] = evt.target.value;
  }
  setformErrors(errorData); 
  setformdata(formData);
  if(formErrors['airportLocation'] && formErrors['airportLocation'].activeValidator.errorMessage != null) {
      validateField('airportLocation', evt.target.value, 
          { ['airportLocation']: evt.target.value })
  }
}

const setInitialState = (fboData,clear,editdata) => {
  const allFormData = {};
  let formErrors = {};
  const fieldTypeArr = ['input', 'select', 'multiselectcheckbox', 'asynctypeahead'];

  fboData && fboData.fields.forEach((item, index) => {
    if (fieldTypeArr.includes(item.component.toLowerCase())) {
      //formData[item.name] = formdata && formdata[item.name] ? formdata[item.name] : item.defaultValue?item.defaultValue:"";
      //formErrors[item.name] = getFormErrorRules(item);
      allFormData[item.name] = formdata && formdata[item.name] && formdata[item.name] !== 'null' ? formdata[item.name] : "";
      formErrors[item.name] = getFormErrorRules(item);
      //formErrors = { ...setPrevActiveValidator(formErrors, item, index) };
    }
  })
  setformErrors(formErrors);
  setformdata(allFormData);
  setAddress1Selected('')
  //setformErrors(errorData);
}
const onHandleSelect = (field, index) => {
  //alert("sdfas")
  //setindexvalue(index)

  let formData = { ...formdata };

  document.getElementsByName("airportLocation2").value = fullresults[index].Address2
  document.getElementsByName("airportLocation").value = fullresults[index].Address1
  document.getElementsByName("zip").value = fullresults[index].PostalCode
  document.getElementsByName("city").value = fullresults[index].Locality
  document.getElementsByName("state").value = fullresults[index].AdministrativeArea
  document.getElementsByName("country").value = fullresults[index].CountryName


  document.getElementsByName("airportLocation")[0].callback = false
  //  setformDataSet(formData);
  document.getElementsByClassName('dropdown-menu show')[0].style.display = 'none';

  formData["airportLocation2"] = fullresults[index].Address2
  formData["airportLocation"] = fullresults[index].Address1
  formData["zip"] = fullresults[index].PostalCode
  formData["city"] = fullresults[index].Locality
  formData["state"] = fullresults[index].AdministrativeArea
  formData["country"] = fullresults[index].CountryName
  formData["fuelService"] = formdata.fuelService;


  Object.keys(formData).map((fieldName) => {
    validateField(
      fieldName,
      formData[fieldName],
      { [fieldName]: formData[fieldName] },
      true,
      formErrors, formData
    );
  })

  //formData["callback"] = false

  setformdata(formData);
  isaddressvalid = true


}
const filterBy = () => true;
const handleFocus = () => {
  setResetValue(address1Selected);
  setAddress1Selected('');
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
  return fieldValidationErrors
  //setformErrors(fieldValidationErrors)
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
  const validationTypes = ['IsMandatory', 'CheckRegex','CheckZIP', "onlyspecial"];
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
        } if (validationType === 'CheckZIP') {
          if (!(value.length === 10 || value.length === 5)) {
              errcount++;
              fieldValidationError
                  .activeValidator = activeValidator[0];
          }
      } if (validationType === 'onlyspecial') {
        if (!new RegExp(activeValidator[0].validateRule)
            .test(value)) {
            errcount++;
            fieldValidationError
                .activeValidator = activeValidator[0];
        }
    }
      else {
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
const onHandleChange = (e, field) => {
  setModalTextForEdit('')

  let target = e.target
  let formdataset = {}
  let fields = {};
  let maxLength = 0;
  let fieldName
  let fieldValueData;
  if (field && field.maxLength) {
    maxLength = parseInt(field.maxLength);
  }
  if (maxLength > 0 && target.value.length > maxLength) {
    fieldValueData = target.value.substring(0, maxLength);
    return;
  }

  if (field.name === 'airportIdentificationNumber') {
    target.value = target.value.replace(/[^a-z]/gi, '')
    target.value = target.value.toUpperCase()
  }

  //fields[field.name] = e.target.value;

  //const fields = JSON.parse(JSON.stringify(formdata));

  if (field.type == "multiSelectCheckbox") {
     fieldName = field.name;
    let fieldValue = e.length ? e.map(i => i.value) : null;
    fields[field.name] = fieldValue;
    fieldValueData = fieldValue
  } else {
     fieldName = target.name;
     fieldValueData = target.value;
    fields[fieldName] = e.target.value;

  }
  if (field.validations) {
    for (var i = 0; i < field.validations.length; i++) {
        if (field.validations[i].type === 'CheckUSPhone') {
            e.target.value = phoneValidation(e.target.value);
            fields[fieldName] = e.target.value;
        } else if (field.validations[i].type === 'CheckEIN') {
            e.target.value = einValidation(e.target.value);
            fields[fieldName] = e.target.value;
        } else if (field.validations[i].type === 'CheckZIP') {
            if (!(new RegExp(field.validations[i].validateRule)
                .test(e.target.value))) {
                e.target.value = zipValidation(e.target.value)
                fields[fieldName] = e.target.value;
            }
        }
    }
    
}

  
  if (isBtnValidate) {
    validateField(
      fieldName, fieldValueData, fields, true
    );
  }
  formdataset = {
    ...formdata,
    ...fields
  }

  setformdata(formdataset)
  let isValid = validateForm();
  if (isValid) {
    setModalText('');
  }
}
const onHandleBlur = (e, item) => {

  let allFormdData = formdata;
  let fields = {};
  /* let formValid = this.state.formValid;*/
  //const fieldValidationErrors = {...this.state.formErrors}; 

  let target = e.target;
  let fieldName, fieldValue;
  fieldName = target.name;
  fieldValue = target.value;
  fields[fieldName] = fieldValue;
  const errorObj = validateField(
    fieldName, fieldValue, fields, true, formErrors, formdata
  );

  if (fieldName === "airportIdentificationNumber") {
    if (target.value) {
      let value = {
        "FBOName": selectedCompanyValue.company,
        "ICAO": fieldValue
      }
      //formData[index]["airportIdentificationNumber"] = target.value
      fetchFunction(value)
    }
    else{
      setAddress1Selected([''])
        document.getElementsByName("airportName")[0].value = '';
        document.getElementsByName("airportLocation")[0].value = '';
        document.getElementsByName("airportLocation2")[0].value = '';
        document.getElementsByName("city")[0].value = '';
        document.getElementsByName("state")[0].value = '';
        document.getElementsByName("zip")[0].value =  '';
        document.getElementsByName("country")[0].value ='';

        allFormdData["airportName"] =  '';
        allFormdData["airportLocation"] = '';
        allFormdData["airportLocation2"] =  '';
        allFormdData["city"] =  '';
        allFormdData["state"] = '';
        allFormdData["zip"] = '';
        allFormdData["country"] = '';

    }
  }
  async function fetchFunction(value) {
    try {
      getAddressFromAcukwik(value).then(response => {
        console.log(response)
        let fboAddressDataObj = JSON.parse(JSON.stringify(response.data[3][0]));
        let fboAddressData = fboAddressDataObj['@JSONResponse'] && JSON.parse(JSON.stringify(fboAddressDataObj['@JSONResponse']))
        fboAddressData && setAddress1Selected([JSON.parse(fboAddressData)[0].address_1])
        document.getElementsByName("airportName")[0].value =  fboAddressData? JSON.parse(fboAddressData)[0].airport_name === undefined ? '' : JSON.parse(fboAddressData)[0].airport_name:'';
        document.getElementsByName("airportLocation")[0].value =  fboAddressData? JSON.parse(fboAddressData)[0].address_1 === undefined ? '' : JSON.parse(fboAddressData)[0].address_1:'';
        document.getElementsByName("airportLocation2")[0].value = fboAddressData?  JSON.parse(fboAddressData)[0].address_2 === undefined ? '' : JSON.parse(fboAddressData)[0].address_2:'';
        document.getElementsByName("city")[0].value = fboAddressData?  JSON.parse(fboAddressData)[0].city === undefined ? '' : JSON.parse(fboAddressData)[0].city:'';
        document.getElementsByName("state")[0].value = fboAddressData?  JSON.parse(fboAddressData)[0].state === undefined ? '' : JSON.parse(fboAddressData)[0].state:'';
        document.getElementsByName("zip")[0].value =  fboAddressData? JSON.parse(fboAddressData)[0].postcode === undefined ? '' : JSON.parse(fboAddressData)[0].postcode:'';
        document.getElementsByName("country")[0].value =fboAddressData?  JSON.parse(fboAddressData)[0].country_name === undefined ? '' : JSON.parse(fboAddressData)[0].country_name === 'USA' ? 'United States' : JSON.parse(fboAddressData)[0].country_name:'';

        allFormdData["airportName"] =  fboAddressData? JSON.parse(fboAddressData)[0].airport_name === undefined ? '' : JSON.parse(fboAddressData)[0].airport_name:'';
        allFormdData["airportLocation"] = fboAddressData?  JSON.parse(fboAddressData)[0].address_1 === undefined ? '' : JSON.parse(fboAddressData)[0].address_1:'';
        allFormdData["airportLocation2"] =  fboAddressData? JSON.parse(fboAddressData)[0].address_2 === undefined ? '' : JSON.parse(fboAddressData)[0].address_2:'';
        allFormdData["city"] =  fboAddressData? JSON.parse(fboAddressData)[0].city === undefined ? '' : JSON.parse(fboAddressData)[0].city:'';
        allFormdData["state"] = fboAddressData?  JSON.parse(fboAddressData)[0].state === undefined ? '' : JSON.parse(fboAddressData)[0].state:'';
        allFormdData["zip"] = fboAddressData?  JSON.parse(fboAddressData)[0].postcode === undefined ? '' : JSON.parse(fboAddressData)[0].postcode:'';
        allFormdData["country"] = fboAddressData?  JSON.parse(fboAddressData)[0].country_name === undefined ? '' : JSON.parse(fboAddressData)[0].country_name:'';
        let setData = {
          ...allFormdData,
          ...fields
        }
        setformdata(setData);
    
        setformErrors(errorObj);
      })
      

    }
    catch (err) {
      throw err;
      console.error(err);
    }
    
      
  }

  let setData = {
    ...allFormdData,
    ...fields
  }
  setformdata(setData);

  setformErrors(errorObj);
  //setformDataSet(formdData)
}

const onClickSubmit = (e, item) => { 

  setbtnValidate(true)
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

  let isValid = validateForm();

  if (isValid) {
    setServiceBusy(true);
    setModalText("")
    //let action = e.target.innerHTML.trim()
    let saveData
    //if (deactivateData.length === 0) {
      saveData = formSubmitData()
    /* } else {
      saveData = formSaveData()
    } */
    accountCompanyEditService(saveData).then(res => {
      if (res.statusCode) {
        if (res.statusCode === 200) {
          setdisable(true)
          setDeactivateData([])
          seteditModalShow(false)
          enablePopUp(false,dispatch)
          document.getElementById('root').style.filter = 'none';
          setaddNew(false)
          setReset(Math.random())
          setModalShow(false)
          //document.getElementById('root').style.filter = 'blur(5px)';
          setServiceBusy(false)
          setModalTextForEdit("")
          //setInitialState(fieldList[0].aircraftInformation)
          let allFormData = []
          Object.keys(formdata).forEach((item, index) => {

            allFormData[item] =  "";

          })
          setformdata(allFormData)
          //document.getElementsByClassName('dropdown-menu show')[0].style.display = 'none';
          document.getElementById('root').style.filter = 'none';
          let addDEfaultTire = {
            "FBO": saveData.json.organizationName,
            "FBOLocations": [{
                    "Location": saveData.json.airportIdentificationNumber
                }
            ],
            "CreatedBy":saveData.loginUserName,
            "ModifiedBy": saveData.loginUserName
        }
          insertFBODefaultFuelPrice(addDEfaultTire).then( response => {
            setrefresh(Math.random())
          })
          let auditPayload = {"ModuleName":"Fuel Price",
                              "TabName":"Location",
                              "Activity":"Added Location "+saveData.json.airportIdentificationNumber+" for organization "+saveData.json.organizationName,
                              "ActionBy":Storage.getItem('email'),
                              "Role":JSON.parse(Storage.getItem('userRoles')),
                              "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
                    saveAuditLogData(auditPayload, dispatch)

        }
        else {
          setModalText("Oops! Location Already Added");
          setServiceBusy(false)
        }
      }
      else {
        setModalTextForEdit(res.response.data.message)
        setServiceBusy(false)
      }
     
    })
  } else {
    setModalTextForEdit(fieldList.fuelTiers.modal.validate.text)
    setServiceBusy(false)
  }


}
const formSubmitData = () => {
  let saveJson = {};
  let finalJson = {};
  let fieldData = JSON.parse(JSON.stringify(formdata));
  let serviceArray = []
  fieldData.fuelService.map((item) => {
    serviceArray.push({ "services": item })
  })

  saveJson = {
    "service": "addlocation",
    "loginUserName": Storage.getItem('email') ? Storage.getItem('email') : null,
    "json": {

      "organizationName": Storage.getItem('organizationName'),

      "airportName": fieldData.airportName,

      "addressLine1": fieldData.airportLocation,

      "addressLine2": fieldData.airportLocation2,

      "city": fieldData.city,

      "state": fieldData.state,

      "zip": fieldData.zip,

      "country": fieldData.country,

      "airportIdentificationNumber": fieldData.airportIdentificationNumber,
      "airport_id": deactivateData.airportId,

      "fuelServices": serviceArray


    }
  }
  return saveJson;
}
const formSaveData = () => {
  let saveJson = {};
  let finalJson = {};
  let fieldData = JSON.parse(JSON.stringify(formdata));
  let serviceArray = []
  fieldData.fuelService.map((item) => {
    serviceArray.push({ "services": item })
  })
  saveJson = {
    "service": "location",
    "loginUserName": Storage.getItem('email') ? Storage.getItem('email') : null,
    "json": {

      "organizationId": Storage.getItem("organizationId"),

      "organizationName":  state && state.companyValue,

      "airportName": fieldData.airportName,

      "addressLine1": fieldData.airportLocation,

      "addressLine2": fieldData.airportLocation2,

      "airport_id": deactivateData.airportId,

      "city": fieldData.city,

      "state": fieldData.state,

      "zip": fieldData.zip,

      "country": fieldData.country,

      "airportIdentificationNumber": fieldData.airportIdentificationNumber,

      "fuelServices": serviceArray,

      "deActivationId": fieldData.airportId,
    }
  }




  return saveJson;
}

const handleCheck = (e,item) => {
}

 const clickEdit = (data) => { 
  
  setDeactivateData(data)
  setModalEditShow(true)
  document.getElementById('root').style.filter = 'blur(5px)';

  /* newRows.forEach((row)=>{
    
    if((row.accessLevel.length == 0 || row.accessLevel[0].accessLevels==data.access) && (row.roles.length == 0 || row.roles[0].roleType == data.roles) && row.email== data.email){
      row.access=!row.accessLevel.length ? '' : row.accessLevel[0].accessLevels
      setInitialState(fieldList.fuelTiers.aircraftInformation,false,row)
   }
  })
  setdisable(true)
  seteditModalShow(true) */
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
  setModalEditShow(false)
  setValidFieldIssue(false)
  document.getElementById('root').style.filter = 'none';
}
const closeEditModal = () => {
  seteditModalShow(false);
  setformdata({})
  document.getElementById('root').style.filter = 'none';
  setaddNew(false)
  seteditModalShow(false)
  //setInitialState(fieldList.fuelTiers.aircraftInformation)
  setbtnValidate(false)
  setModalText('')
  setModalTextForEdit("")
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
      let auditPayload = {"ModuleName":"Fuel Price",
                              "TabName":"Location",
                              "Activity":"Deactveted Location",
                              "ActionBy":Storage.getItem('email'),
                              "Role":JSON.parse(Storage.getItem('userRoles')),
                              "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
                    saveAuditLogData(auditPayload, dispatch)
      setrefresh(refresh+1)
    })
  }
}
const resetPopupData = () =>{

  let allFormData = []
  let fieldListData = []
  Object.keys(formdata).forEach((item, index) => {

    allFormData[item] =  "";

  })
  setformdata(allFormData)

  fieldList && fieldList.fuelTiers && fieldList.fuelTiers.aircraftInformation.fields.forEach((item, index) => {
    if(item.name === "airportLocation"){
      
      item.callback = false;
    }
  })
  //document.getElementsByName("airportLocation")[0].callback = false
  
  setInitialState(fieldList.fuelTiers.aircraftInformation)
}
const onClickNewButton = (e, item) => { 
  resetPopupData()
  seteditModalShow(true)
  setaddNew(true)
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
          disabled={restricted?restricted:Storage.getItem('organizationName') !== "undefined"?false:state.companyValue? true:false}
          handleClick={(e)=>onClickNewButton(e,item)}/>)
   };
}

 
 return (
 <>{!newRows ? <div className='table-loader'><Loader height="auto"/> </div>:
  <><div  className={`${fieldList && fieldList.fuelTiers.addNewFuelPrice ? fieldList.fuelTiers.addNewFuelPrice.styles.colWidth : ''} bf-absolute`}>
  {fieldList && fieldList.fuelTiers.addNewFuelPrice ? getOperatorFields(fieldList.fuelTiers.addNewFuelPrice) : ''}
</div>  
{fieldList ?
  <div className='bf-table-container bf-fueltier-table-container'>
    <FuelPriceTable 
    sortEnabled = {true} 
    searchEnabled={false} 
    Data ={rows && rows} 
    heading={fieldList.fuelTiers.headCells} 
    searchBy={["location","jetA","100LL"]}
    primaryClick = {clickEdit}
    secondaryClic = {clickDeactivate}
    // loading = {loading}
    accordion = {true}
    pragraph = {fieldList.fuelTiers.paragraph}
    >
    </FuelPriceTable>
  </div>
  :<div className='table-loader'><Loader height="auto"/></div>}
    {editmodalShow?<EditFormModal
          onHide={() => closeEditModal()}
          formErrors={formErrors}
          formdata={formdata}
          show={editmodalShow}
          json={fieldList.fuelTiers.aircraftInformation}
          onHandleChange={onHandleChange}
          onHandleBlur={onHandleBlur}
          onClickSubmit={onClickSubmit}
          handleCheck={handleCheck}
          //results={results}
          onHandleSelect={onHandleSelect}
          showError={modalTextForEdit}
          submittedForm={serviceBusy}
          addNew={addNew}
          filterBy = {filterBy}
          isAddress1Loading ={isAddress1Loading}
          onAddressSearchBlur ={onAddressSearchBlur}
          typeaheadRef = {typeaheadRef}
          searchAPI = {searchAPI}
          handleFocus ={handleFocus}
          searchHandler = {searchHandler}
          results ={results}
          minLength={3}
      />:""}
      {fieldList &&
    <CustomModal
    show={modalShow}
    onHide={() => successModal()}
    close = {()=>closeModal()}
    hide={()=>closeModal()}
    modelBodyContent={modalText}
    buttonText={modalText== fieldList.fuelTiers.modal.deactivate.text? fieldList.fuelTiers.modal.deactivate.button1: fieldList.fuelTiers.modal.validate.button1}
    secondbutton={modalText==fieldList.fuelTiers.modal.deactivate.text? fieldList.fuelTiers.modal.deactivate.button2:""}
  />}
  
  {
    <CustomFormModal
    show={modalEditShow}
    onHide={() => closeModal()}
    hide={() => closeModal()}
    hidePopup ={hidePopup}
    size={"lg"}
    modelBodyContent={<EditFuelTire />}
    buttonText={"Save"}
    secondbutton={()=>closeModal()}
    validFieldIssue = {validFieldIssue}
    setValidFieldIssue = {setValidFieldIssue}
    deactivateData = {deactivateData}
    labelData = {fieldList && fieldList.fuelTiers && fieldList.fuelTiers.editFuelTire}
                        />
  }</>
     }</>
  );
  }
export default FuelTiers;