import React, { useState, useEffect, useRef } from 'react';
import Input from '../input/input';
import Select from '../select/select';
import Radio from '../radio/radio';
import { bfaJsonService } from '../../actions/BFAServices/BFAJsonService';
import ButtonComponent from '../button/button';
import MultiSelectCheckbox from '../multiSelect/multiSelectCheckbox';
import './company.scss';
import * as xlsx from "xlsx";
import { useLocation, useNavigate } from 'react-router-dom';
import { Storage, jsonStringify } from '../../controls/Storage';
import BFTable from '../table/table'
import { accountCompanyEditService, accountCompanyDeactivateService, fetchCompanyDetails } from '../../actions/accountServices/accountCompanyService';
import { getAddressFromAcukwik } from '../../actions/OperatorFboService/operatorFboService'
import EditFormModal from '../customModal/editModal';
import CustomModal from '../customModal/customModal';
import Loader from '../loader/loader';
import { addressValidationService } from '../../actions/searchService/search';
import { searchAddress } from '../../actions/searchService/search'
import { getAccessLevel, getSuperAccess } from '../../controls/commanAccessLevel';
import { fetchJSONData, fetchLocationNData } from '../../actions/accountHome/accountLocationActions';
import { useDispatch, useSelector } from 'react-redux';
import { stateMapper } from '../stateMapper';
import { validateField, phoneValidation, einValidation, zipValidation, getFormErrorRules, getPasswordStrength, matchPassword, validateForm } from '../../controls/validations';
import { enablePopUp, getMobileHeaderText } from '../../actions/commonActions/commonActions';
import { saveNotificationList } from '../../actions/notificationService/notificationAction';
import { insertFBODefaultFuelPrice} from '../../actions/OperatorFboService/operatorFboService';
import {saveAuditLogData } from '../../actions/auditLog/auditLogActions';
import { updateDeclineOrder } from '../../services/commonServices';

function Locations(props) {

  const [fieldList, setFieldList] = useState([]);
  const { state } = useLocation();
  const [rows, setRows] = useState([]);
  const [mobileDataRows, setMobileDataRows] = useState(null);
  const [Locjson, setLocjson] = useState([])
  const { currentUserRole, storageOrgName } = state ? state : {};
  const restrictedFields = ['organizationName', 'userType'];
  const [locationDetailsData, setLocationDetailsData] = useState(null);
  const [formdata, setformdata] = useState({});
  const [editmodalShow, seteditModalShow] = useState(state.enableModal && state.enableModal);
  const [formErrors, setformErrors] = useState({});
  const [isBtnValidate, setbtnValidate] = useState(false);
  const [modalText, setModalText] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [deactivateData, setDeactivateData] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [disable, setdisable] = useState(true);
  const [reset, setReset] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [isLevel2, setIsLevel2] = useState(false);
  const [results, setResults] = useState({});
  const [fullresults, setFullResults] = useState({});
  let addressdata = []
  let fulladdressdata = []
  let isaddressvalid = true;
  const [serviceBusy, setServiceBusy] = useState(false);
  const [addNew, setAddNew] = useState(false);
  const dispatch = useDispatch()
  const [modalTextForEdit, setModalTextForEdit] = useState("");
  //address
  const [address1Selected, setAddress1Selected] = useState([]);
  const [isAddress1Loading, setAddress1Loading] = useState(false);
  const [editfuel, setEditFuel] = useState(null)
  const orgName = Storage.getItem('organizationName')
  const loginName = Storage.getItem('email')
  const access = JSON.parse(Storage.getItem('accessLevel'))[0]

  let [resetvalue, setResetValue] = useState();
  const typeaheadRef = useRef(null);
  //address end
  const commonReducer = useSelector(state => state.commonReducer);
  const dashboardReducer = useSelector((state) => state.dashboardReducer)
  const loginReducer = useSelector(state => state.loginReducer);
  const popUpEnable = commonReducer && commonReducer.enableModal && commonReducer.enableModal.data;
  const accountLocationReducer = useSelector((state) => state.accountLocationReducer);
  const jsonData = accountLocationReducer && accountLocationReducer.accountLocationJson && accountLocationReducer.accountLocationJson;
  const serviceLocationData = accountLocationReducer && accountLocationReducer.accountLocationJson && accountLocationReducer.accountLocationData;
  const accountHomeReducer = useSelector((state) => state.accountHomeReducer);
  const selectedCompany = accountHomeReducer && accountHomeReducer.selectedCompany && accountHomeReducer.selectedCompany.company;
	const profileDetails = dashboardReducer && dashboardReducer.profileData && dashboardReducer.profileData.data
  const accessLvl = loginReducer && loginReducer.loginAccessLevel&&loginReducer.loginAccessLevel.data?JSON.parse(loginReducer.loginAccessLevel.data):[]
  const loggedInUserType =  commonReducer?.loggedInUserType?.data;
  let paylod = { 'blobname': 'accountLocations.json' }

  let melissaEndpointURI = process.env.REACT_APP_MELISSA_ENDPOINT
  let melissaTopRecords = process.env.REACT_APP_MELISSA_TOP_RECORDS

  function createData(airportIdentificationNumber, airportName, airPortLocation, fuelServiceData, addedBy, buttons, airportId,loc) {
    
    
    let obj= {
      "airportIdentificationNumber": airportIdentificationNumber,
      "airportName": airportName,
      "airportLocation": airPortLocation,
      "fuelService": fuelServiceData,
      "airportId": airportId,
      "addedby": addedBy,
      "Buttons": JSON.parse(JSON.stringify(buttons))
    }; 
    console.log(obj)
    if(!accessLvl?.includes('Super') && loggedInUserType.toLowerCase()!='barrel fuel'){
      if(accessLvl?.includes('Admin')){
        if(loc?.includes(airportIdentificationNumber)){
          setIsLevel2(true);
          obj.Buttons[0].disable=true;
          obj.Buttons[1].disable=true;
        }else{
          obj.Buttons[0].disable=false;
          obj.Buttons[1].disable=true;
        }
      }
    } 
    return obj;
  }
  function createMobileData(airportIdentificationNumber, airportName) {

    return {
      "airportIdentificationNumber": airportIdentificationNumber,
      "airportName": airportName,
      "mobileButton": true
    };
  }

  const [isBusy, setBusy] = useState(true);
  useEffect(() => {
    seteditModalShow(state.enableModal && state.enableModal)
    fetchJSONData(paylod, dispatch)
    getMobileHeaderText(dispatch,"Location")
  }, []);

  useEffect(() => {
    return (
      () => {
        document.getElementById('root').style.filter = 'none'
      })
  }, [])

  useEffect(() => {
    //setJsonData();
    let locationJSONData = jsonData && jsonData.data && jsonData.data.data && jsonData.data.data.locationData
    setInitialState(locationJSONData && locationJSONData[0].aircraftInformation)
    setLocjson(locationJSONData)
    setResults(addressdata)
    setBusy(false);
    if (Storage.getItem('userType') === "Barrel Fuel") {
      setIsEditable(true)
    } else {
      setIsEditable(false)
    }
    setReset(Math.random())
    //seteditModalShow(state.enableModal && state.enableModal)
  }, [jsonData])

  useEffect(() => {
    jsonData && jsonData.data && jsonData.data.data && jsonData.data.data.locationData && fetchLocationNData({ 'service': 'location', 'organizationName': selectedCompany }, dispatch).then((response) => {
      //setAccountHomeData( response.data)
      //seteditModalShow(state.enableModal && state.enableModal)
      let loc=[]
      profileDetails && profileDetails.locationAccess && profileDetails.locationAccess.forEach((val)=>{
        if(val.accessLevel=='Level 3 (Basic)'){
          val.locations.forEach((location)=>{
            loc.push(location)
          })
        }
      })
      let locationLocalData = [];
      let locationMobileDataRows = [];
      let locationJSONData = jsonData && jsonData.data && jsonData.data.data && jsonData.data.data.locationData
      let responseData = response && response.res
      responseData && responseData.map((item, index) => {
        let fuelServiceData = [];
        let data = [];
        item.fuelServiceOffered.map((item) => {
          fuelServiceData.push(item.services)
        })
        data.push(item.airportId);
        //locationJSONData[0].Buttons[0].airportId = data;
        locationLocalData.push(createData(item.airportIdentificationNumber, item.airportName, item.airPortLocation, fuelServiceData.toString()
          , item.addedBy, locationJSONData && locationJSONData[0].Buttons, item.airportId,loc))
        locationMobileDataRows.push(createMobileData(item.airportIdentificationNumber, item.airportName, item.airPortLocation, fuelServiceData.toString()
          , item.addedBy, locationJSONData && locationJSONData[0].Buttons, item.airportId))
      })

      setRows(locationLocalData)
      setMobileDataRows(locationMobileDataRows)
      //setformDataSet(data)

      //setCompanyDetailsData(response.res) 
    })
  }, [reset, selectedCompany])

  useEffect((e) => {
    if (props.showPopup) {
      if (fieldList && fieldList[0] && fieldList[0].addNewAircraft)
        onClickNewButton(e, fieldList[0].addNewAircraft)
    }
    setAddNew(popUpEnable)
    seteditModalShow(popUpEnable)
  }, [fieldList, popUpEnable])

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
          formErrors, formData)
      })

      setformErrors(errorData);
      //setFormFieldErrors(errorData);
      setformdata(formData);
      //setformDataSet(formData)
      //setFormFieldData(formData)
      document.getElementsByName('airportLocation')[0].blur();
    } catch (err) {
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
  const onAddressSearchBlur = (evt) => {
    console.log('test search address')
    let formData = { ...formdata };
    let errorData = { ...formErrors };
    if (evt.target.value != '') {
      if (!Array.isArray(address1Selected)) {
        if (address1Selected == '' && (resetvalue != '' && evt.target.value == resetvalue[0])) {
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
    if (formErrors['airportLocation'] && formErrors['airportLocation'].activeValidator.errorMessage != null) {
      validateField('airportLocation', evt.target.value,
        { ['airportLocation']: evt.target.value })
    }
  }
  const filterBy = () => true;
  const handleFocus = () => {
    setResetValue(address1Selected);
    setAddress1Selected('');
  }

  const setInitialState = (locationData) => {
    jsonData && jsonData.data && jsonData.data.data && jsonData.data.data.locationData && setFieldList(jsonData && jsonData.data && jsonData.data.data && jsonData.data.data.locationData)
    const allFormData = {};
    let formErrors = {};

    const fieldTypeArr = ['input', 'select', 'multiselectcheckbox', 'asynctypeahead'];

    locationData && locationData.fields.forEach((item, index) => {
      if (fieldTypeArr.includes(item.component.toLowerCase())) {
        //formData[item.name] = formdata && formdata[item.name] ? formdata[item.name] : item.defaultValue?item.defaultValue:"";
        //formErrors[item.name] = getFormErrorRules(item);
        allFormData[item.name] = formdata && formdata[item.name] && formdata[item.name] !== 'null' ? formdata[item.name] : "";
        formErrors[item.name] = getFormErrorRules(item);
        //formErrors = { ...setPrevActiveValidator(formErrors, item, index) };
      }
    })
    setAddress1Selected('');
    setformErrors(formErrors);
    setformdata(allFormData);

  }

  const setPrevActiveValidator = (curFormErrors, item) => {
    //const { formErrors } = this.state;
    if (formErrors) {
      curFormErrors[item.name].isValid = formErrors[item.name].isValid;
      curFormErrors[item.name].isTouched = formErrors[item.name].isTouched;
      if (formErrors[item.name].activeValidator !== {} && formErrors[item.name].activeValidator.validation) {
        const activeValidator = curFormErrors[item.name].validations.filter((elem) => elem.validation === formErrors[item.name].activeValidator.validation);
        if (activeValidator.length) {
          curFormErrors[item.name].activeValidator = activeValidator[0];
        }
      }
    }
    return curFormErrors;
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
    const validationTypes = ['IsMandatory', 'CheckRegex', 'CheckZIP', "onlyspecial"];
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
      target.value = target.value.replace(/[^a-z0-9]/gi, '')
      target.value = target.value.toUpperCase()
    }
    //fields[field.name] = e.target.value;

    //const fields = JSON.parse(JSON.stringify(formdata));

    if (field.type == "multiSelectCheckbox") {
      fieldName = field.name;
      let fieldValue = e.length ? e.map(i => i.value) : null;
      fields[field.name] = fieldValue;
      fieldValueData = fieldValue
      setEditFuel(true)
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

    // if (isBtnValidate) {
      validateField(
        fieldName, fieldValueData, fields, true
      );
    // }
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
          "FBOName": selectedCompany,
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

  const resetPopupData = () => {

    let allFormData = []
    let fieldListData = []
    Object.keys(formdata).forEach((item, index) => {

      allFormData[item] = "";

    })
    setformdata(allFormData)

    fieldList[0].aircraftInformation.fields.forEach((item, index) => {
      if (item.name === "airportLocation") {

        item.callback = false;
      }
    })
    //document.getElementsByName("airportLocation")[0].callback = false

    setInitialState(fieldList[0].aircraftInformation)
  }

  const onClickNewButton = (e, item) => {
    resetPopupData()
    seteditModalShow(true)
    setAddNew(true)
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

        "organizationName": selectedCompany,

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

        "organizationName": selectedCompany,

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
      let action = e.target.innerHTML.trim()
      let saveData
      if (deactivateData.length === 0) {
        saveData = formSubmitData()
      } else {
        saveData = formSaveData()
      }
      accountCompanyEditService(saveData).then(res => {
        if (res.statusCode) {
          if (res.statusCode === 200) {
            if (addNew) {
              let payload = {}
              payload.type = "create"
              payload.notificationMessage = Locjson[0].notifyMessage.msg1 + saveData.json.city + Locjson[0].notifyMessage.msg2
              payload.organizationName = orgName
              payload.loginUserName = loginName
              payload.sendNotificationTo = "ORG Internal"
              payload.access_levels = ["Level 1 (Admin)"]
              payload.levelOfAccess = access == "Super" ? "Level 1 (Admin)" : access == "Admin" ? "Level 2 (Standard)" : "Level 3 (Basic)"
              payload.isActionable = false
              payload.actionTaken = ""
              payload.category = "account"
              payload.readInd = false
              saveNotificationList(payload, dispatch).then((res) => {

              })
            } if (!addNew && editfuel) {
              let payload = {}
              payload.type = "create"
              payload.notificationMessage = Locjson[0].notifyMessage.msg3 + loginName + "."
              payload.organizationName = orgName
              payload.loginUserName = loginName
              payload.sendNotificationTo = "ORG Internal"
              payload.access_levels = ["Level 1 (Admin)"]
              payload.levelOfAccess = access == "Super" ? "Level 1 (Admin)" : access == "Admin" ? "Level 2 (Standard)" : "Level 3 (Basic)"
              payload.isActionable = false
              payload.actionTaken = ""
              payload.category = "account"
              payload.readInd = false
              saveNotificationList(payload, dispatch).then((res) => {
                setEditFuel(false)
              })
            }
            let addDEfaultTire = {
              "FBO": saveData.json.organizationName,
              "FBOLocations": [{
                "Location": saveData.json.airportIdentificationNumber
              }
              ],
              "CreatedBy": saveData.loginUserName,
              "ModifiedBy": saveData.loginUserName
            }
            insertFBODefaultFuelPrice(addDEfaultTire).then(response => {
              //setrefresh(Math.random())
            })
            setdisable(true)
            setDeactivateData([])
            seteditModalShow(false)
            enablePopUp(false, dispatch)
            document.getElementById('root').style.filter = 'none';
            setAddNew(false)
            setReset(Math.random())
            setModalShow(false)
            //document.getElementById('root').style.filter = 'blur(5px)';
            setServiceBusy(false)
            setModalTextForEdit("")
            //setInitialState(fieldList[0].aircraftInformation)
            let allFormData = []
            Object.keys(formdata).forEach((item, index) => {

              allFormData[item] = "";

            })
            setformdata(allFormData)
            document.getElementById('root').style.filter = 'none';
            let auditPayload = {"ModuleName":"Account",
                                "TabName":"Location",
                                "Activity":addNew?saveData.json.airportIdentificationNumber+" Location Added ":saveData.json.airportIdentificationNumber+" Location Updated",
                                "ActionBy":Storage.getItem('email'),
                                "Role":JSON.parse(Storage.getItem('userRoles')),
                                "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
                            saveAuditLogData(auditPayload, dispatch)
        setReset(Math.random())
          }
          else {
            setModalTextForEdit(fieldList[0].modal.validate.text)
            setModalText(res.message);
            setServiceBusy(false)
          }
        }
        else {
          setModalTextForEdit(res.response.data.message)
          setServiceBusy(false)
        }

      }).catch(err => {
        setModalTextForEdit(err)
        setServiceBusy(false)
      })
    } else {
      setModalTextForEdit(fieldList[0].modal.validate.text)
      setServiceBusy(false)
    }


  }
  const handleCheck = (e, item) => {
  }
  const clickEdit = (data) => {
    let editedDataArray = []
    serviceLocationData.data.res.map((value) => {

      if (value.airportId === data.airportId) {
        editedDataArray.push(value)
      }
    })
    let fuelArray = []
    editedDataArray[0].fuelServiceOffered.map((fuelData) => {
      fuelArray.push(fuelData.services)

    })
    let EditedData = {
      airportIdentificationNumber: editedDataArray[0].airportIdentificationNumber,
      airportLocation: editedDataArray[0].addressLine1,
      airportLocation2: editedDataArray[0].addressLine2,
      airportName: editedDataArray[0].airportName,
      city: editedDataArray[0].airPortLocation,
      country: editedDataArray[0].country,
      fuelService: fuelArray.toString(','),
      state: editedDataArray[0].state,
      zip: editedDataArray[0].zip
    }

    setDeactivateData(data)
    let allFormData = {}
    let formErrors = {};
    const fieldTypeArr = ['input', 'select'];
    Object.keys(formdata).forEach((item, index) => {

      allFormData[item] = EditedData && EditedData[item] && EditedData[item] !== 'null' ? EditedData[item] : "";

    })
    setformdata(allFormData);
    fieldList[0].aircraftInformation.fields.forEach((item, index) => {
      if (item.name === "airportLocation") {

        item.callback = false;
      }
    })
    seteditModalShow(true)
    setModalText("")
  }
  const clickDeactivate = (data) => {
    setModalText(fieldList[0].modal.deactivate.text)
    setModalShow(true);
    document.getElementById('root').style.filter = 'blur(5px)';
    setDeactivateData(data)
  }
  const successModal = () => {
    setModalShow(false)
    setModalText("")
    document.getElementById('root').style.filter = 'none';
    if (modalText == fieldList[0].modal.deactivate.text) {
      // setBusy(true)
      let saveData = {

        "organizationid": Storage.getItem("organizationId"),

        "organizationName": Storage.getItem("organizationName") !== "undefined" ? Storage.getItem("organizationName") : "BF Techno12",

        "deActivationId": deactivateData.airportId


      }
      accountCompanyDeactivateService({
        'service': 'location',
        "loginUserName": Storage.getItem('email') ? Storage.getItem('email') : null,
        "json": saveData
      }).then(res => {
        let payloadData = {
          'Service': 'location',
          "LoginUserName": Storage.getItem('email') ? Storage.getItem('email') : null,
          'Organization': selectedCompany,
          'Location': deactivateData.airportId
        }
        updateDeclineOrder(payloadData)
        let payload = {}
        payload.type = "delete"
        payload.notificationMessage = Locjson[0].notifyMessage.msg4 + deactivateData.airportIdentificationNumber + Locjson[0].notifyMessage.msg5 + loginName + "."
        payload.organizationName = orgName
        payload.loginUserName = loginName
        payload.access_levels = ["Level 1 (Admin)"]
        payload.sendNotificationTo = "ORG Internal"
        payload.levelOfAccess = access == "Super" ? "Level 1 (Admin)" : access == "Admin" ? "Level 2 (Standard)" : "Level 3 (Basic)"
        payload.isActionable = false
        payload.actionTaken = ""
        payload.category = "account"
        payload.readInd = false
        saveNotificationList(payload, dispatch).then((res) => {

        })
        // setModalText(fieldList && fieldList[0].sections.modal[0].deactivate.paragraph)
        // setModalShow(true)
        // setModalText(res.message);
        let auditPayload = {"ModuleName":"Account",
                                                "TabName":"Location",
                                                "Activity":deactivateData.airportIdentificationNumber+" Location Deleted",
                                                "ActionBy":Storage.getItem('email'),
                                                "Role":JSON.parse(Storage.getItem('userRoles')),
                                                "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
                            saveAuditLogData(auditPayload, dispatch)
        setReset(Math.random())

      })
    }
  }
  const closeModal = (e) => {
    if (e.target.innerHTML === "Yes") {

      let saveData = {

        "organizationid": Storage.getItem("organizationId"),

        "organizationName": Storage.getItem("organizationName") !== "undefined" ? Storage.getItem("organizationName") : "BF Techno12",

        "deActivationId": deactivateData.airportId


      }

      accountCompanyDeactivateService({
        'service': 'location',
        "loginUserName": Storage.getItem('email') ? Storage.getItem('email') : null,
        "json": saveData
      }).then(res => {

        if (res.statusCode) {
          if (res.message == 'data Deleted Successfully') {
            let payload = {}
            payload.type = "delete"
            payload.notificationMessage = Locjson[0].notifyMessage.msg4 + saveData.airport_id + Locjson[0].notifyMessage.msg5 + loginName + "."
            payload.organizationName = orgName
            payload.loginUserName = loginName
            payload.sendNotificationTo = "ORG Internal"
            payload.access_levels = ["Level 1 (Admin)"]
            payload.levelOfAccess = access == "Super" ? "Level 1 (Admin)" : access == "Admin" ? "Level 2 (Standard)" : "Level 3 (Basic)"
            payload.isActionable = false
            payload.actionTaken = ""
            payload.category = "account"
            payload.readInd = false
            saveNotificationList(payload, dispatch).then((res) => {

            })
            setIsSuccess(true);

            //sendEmails();
            setReset(Math.random())
            setdisable(true)
            let auditPayload = {"ModuleName":"Account",
                                                "TabName":"Location",
                                                "Activity":deactivateData.airportId+" Location Deleted",
                                                "ActionBy":Storage.getItem('email'),
                                                "Role":JSON.parse(Storage.getItem('userRoles')),
                                                "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
                            saveAuditLogData(auditPayload, dispatch)
        setReset(Math.random())
            // setModalShow(true)
            // document.getElementById('root').style.filter = 'blur(5px)';
            setInitialState(fieldList[0].aircraftInformation)
          }
        }
        else {
          //setModalText("server error");
        }
        //setShow(true);

      })
    } else { //setReset(Math.random())
      setModalShow(false)
    }
    document.getElementById('root').style.filter = 'none';
    setDeactivateData([])
    setModalText('');
    setInitialState(fieldList[0].aircraftInformation)

  }
  const closeEditModal = () => {
    setInitialState(fieldList[0].aircraftInformation)
    let allFormData = {}
    Object.keys(formdata).forEach((item, index) => {

      allFormData[item] = "";


    })
    setformdata(allFormData);
    seteditModalShow(false)
    enablePopUp(false, dispatch)
    document.getElementById('root').style.filter = 'none';
    setAddNew(false);
    setModalText("");
    setModalTextForEdit("")
  }

  const getOperatorFields = (item) => {
    let accessable = null;
    if (Storage.getItem('userType') === "Barrel Fuel") {
      accessable = true
    } else {
      accessable = getAccessLevel(Storage.getItem('userType'),
        Storage.getItem('accessLevel'))
    }
    switch (item.component.toUpperCase()) {


      case "BUTTON":
        return (<ButtonComponent
          Label={item.label}
          Type={item.type}
          className={item.styles.className}
          variant={item.variant}
          disabled={accessable ? false : true}
          handleClick={(e) => onClickNewButton(e, item)} />)
    };
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

  return (<>{isBusy ? (<Loader />) : fieldList && fieldList[0] && (
    <><div className={`${fieldList && fieldList[0].addNewAircraft ? fieldList && fieldList[0].addNewAircraft.styles.colWidth : ''} bf-absolute`}>
      {fieldList && fieldList[0].addNewAircraft && selectedCompany && getSuperAccess(Storage.getItem('userType'), Storage.getItem('accessLevel')) ? getOperatorFields(fieldList && fieldList[0].addNewAircraft) : ''}
    </div>
      {fieldList && fieldList.length ?
        <div className='bf-table-container bf-location-table-container bf-responsive-table-container'>
          <BFTable
            sortEnabled={true}
            searchEnabled={true}
            Data={rows && rows}
            heading={fieldList && fieldList[0].headCells}
            searchBy={["airportIdentificationNumber", "airportName", "airportLocation"]}
            primaryClick={clickEdit}
            secondaryClic={clickDeactivate}
            level2={isLevel2}
          >

          </BFTable>

          <BFTable
            sortEnabled={false}
            searchEnabled={true}
            Data={mobileDataRows && mobileDataRows}
            heading={fieldList[0].mobileHeadCells && fieldList[0].mobileHeadCells}
            searchBy={["aircraftType", "aircraftTailNumber"]}
            primaryClick={clickEdit}
            secondaryClic={clickDeactivate}
            isUserMobileTab={true}
            isMobileTable={true}
            viewLabels={fieldList[0].headCells && fieldList[0].headCells}
            viewData={rows && rows}
            jsonData={jsonData}
            viewLabel={fieldList[0].mobileViewHeader}
          >
          </BFTable>
        </div>
        : ""}
      {editmodalShow ? <EditFormModal
        onHide={() => closeEditModal()}
        formErrors={formErrors}
        formdata={formdata}
        show={editmodalShow}
        json={fieldList[0].aircraftInformation}
        onHandleChange={onHandleChange}
        onHandleBlur={onHandleBlur}
        onClickSubmit={onClickSubmit}
        handleCheck={handleCheck}
        //results={results}
        useCache={false}
        onHandleSelect={onHandleSelect}
        showError={modalTextForEdit}
        submittedForm={serviceBusy}
        addNew={addNew}
        filterBy={filterBy}
        isAddress1Loading={isAddress1Loading}
        onAddressSearchBlur={onAddressSearchBlur}
        typeaheadRef={typeaheadRef}
        searchAPI={searchAPI}
        address1Selected={address1Selected}
        handleFocus={handleFocus}
        searchHandler={searchHandler}
        results={results}
      /> : ""}
      <CustomModal
        show={modalShow}
        close={(e) => closeModal(e)}
        onHide={(e) => successModal(e)}
        hide={(e) => closeModal(e)}
        modelBodyContent={modalText}
        buttonText={fieldList && modalText !== "" && modalText === fieldList[0].modal.deactivate.text ? fieldList && fieldList[0].modal.deactivate.button1 : fieldList && fieldList[0].modal.validate.button1}
        secondbutton={fieldList && modalText !== "" && modalText === fieldList[0].modal.deactivate.text ? fieldList && fieldList[0].modal.deactivate.button2 : ""}
      />
    </>
  )}  </>
  );
}
export default Locations;