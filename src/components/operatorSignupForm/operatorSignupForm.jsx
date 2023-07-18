import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import React, { useState, useEffect, useRef } from 'react';
import Row from 'react-bootstrap/Row';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import ButtonComponent from '../button/button';
import logo from '../../assets/images/barrel_fuel_logo.png'
import './operatorSignupForm.scss';
import Input from '../input/input';
import Nav from 'react-bootstrap/Nav';
import Select from '../select/select';
import Col from 'react-bootstrap/Col';
import { bfaJsonService } from '../../actions/BFAServices/BFAJsonService';
import { operatorSignupSave, operatorSendMail } from '../../actions/operatorSignup/operatorSignup';
import Subheading from '../subHeading/subHeading';
import Checkbox from '../checkbox/checkbox';
import CustomModal from '../customModal/customModal';
import Tooltip from 'react-bootstrap/Tooltip';
import iIcon from '../../assets/images/info-icon.png';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import "./styles.css";
import { searchAddress } from '../../actions/searchService/search'
import './accordion-styles.scss';
import Accordion from 'react-bootstrap/Accordion';
import { flightInformationService } from '../../actions/tailNumberService/tailNumberService';
import { addressValidationService } from '../../actions/searchService/search';
import Loader from '../loader/loader';
import { einValidation, phoneValidation, zipValidation } from '../../controls/validations';
import { Storage } from '../../controls/Storage';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import AviationFacts from '../aviationFacts/aviationFacts';
import { stateMapper } from '../stateMapper';
import { propsWithBsClassName } from 'react-bootstrap-typeahead/types/utils';
import { duplicatePending, enrollmentSave } from '../../actions/accountEnrollService/accountEnrollService';
import { encryptData } from '../../services/commonServices';
import {saveAuditLogData } from '../../actions/auditLog/auditLogActions';
import MobileHeader from '../mobileHeader/mobileHeader';
import CollapseMenuIcon from '../../assets/images/collapse_arrow.svg';
import parse from 'html-react-parser';
import { getMobileHeaderText } from '../../actions/commonActions/commonActions';
import { useDispatch, useSelector } from 'react-redux';


function OperatorSignupForm(props) {
    const [operatorSignup, setoperatorSignupForm] = useState({});
    const [formDataSet, setformDataSet] = useState({});
    const [formErrors, setformErrors] = useState({});
    const [isBusy, setBusy] = useState(true);
    const dispatch = useDispatch();
    const [modalShow, setModalShow] = useState(false);
    const [btnDisable, setbtnDisable] = useState(Storage.getItem('jwtToken') == null ? true : false);
    const [formData, setFormData] = useState({});
    const [modalText, setModalText] = useState("");
    const payload = { "blobname": process.env.REACT_APP_READ_OPERATOR_SIGNUP_BLOBNAME }
    const [fieldList, setFieldList] = useState([]);
    const [isLoggedIn, setisLoggedIn] = useState(true);
    const [issupport, setissupport] = useState(true);
    const [isBtnValidate, setbtnValidate] = useState(false);
    const uploadDataArray = []
    const [uploadFileData, setuploadFileData] = useState({});
    const [clickedSelection, setClickedSelection] = useState({});

    const [results, setResults] = useState({});
    const [fullresults, setFullResults] = useState({});
    const [indexvalue, setindexvalue] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [address, setaddress] = useState([]);
    const [address1Selected, setAddress1Selected] = useState([]);
    const [isAddress1Loading, setAddress1Loading] = useState(false);
    const [uploadDocumentMsg, setUploadDocumentMsg] = useState([]);
    const [selectedFile, setSelectedFile] = useState([]);
    const [options, setOptions] = useState([]);
    const [formFieldErrors, setFormFieldErrors] = useState([]);
    const [formFieldData, setFormFieldData] = useState([]);
    const [aircraftFieldData, setAircraftFieldData] = useState([]);
    const [aircraftFormErrors, setAircraftFormErrors] = useState([]);
    const [uploadDocsData, setUploadDocsData] = useState([]);
    const [saveDocsData, setSaveDocsData] = useState([]);
    const [filenames, setfilenames] = useState([]);
    const [uploadDocsErrors, setUploadDocsErrors] = useState([]);
    const [showMobileTerms, setShowMobileTerms] = useState(false);
    const commonReducer = useSelector((state) => state.commonReducer);
    const loggedinUserType = commonReducer?.loggedInUserType?.data;
    
    let navigate = useNavigate();
    let addressdata = []
    let fulladdressdata = []
    let arrayOfFiles = []
    const [uploadedDocs, setUploadedDocs] = useState([]);
    let isaddressvalid = true;
    let detailsAreCorrect;
    const [isterms, setisterms] = useState(false);
    const [isaircraft, setisaircraft] = useState(true);
    const [formFieldAVErrors, setFormFieldAVErrors] = useState([]);
    const uploadformDataValue = new FormData();
    const [isBtnBusy, setbtnBusy] = useState(false);
    const [clear, setClear] = useState();
    const [scrollPosition, setScrollPosition] = useState();
    let [resetvalue,setResetValue] = useState(); 
    const typeaheadRef = useRef(null);
    const {state} = useLocation()
    //const dispatch = useDispatch()
    let newRowData = state && state.rowdata && state.rowdata !== null? state.rowdata: props.rowdata
    let addNewCompany = state && state.addNewCompany && state.addNewCompany !== null? state.addNewCompany: props.addNewCompany
    //console.log("useLocationProps", useLocationProps.addNewCompany)
    //   const[addindex, setaddindex] =  useState();    
    const [addADuser, setaddADuser] = useState({});
    let indexValue = 0
    //  setaddindex(indexValue)

    let melissaEndpointURI = process.env.REACT_APP_MELISSA_ENDPOINT
    let melissaTopRecords = process.env.REACT_APP_MELISSA_TOP_RECORDS

    window.onbeforeunload = function () {
        if (Storage.getItem('jwtToken')) {

        } else {
            clearStorage(); 
        } 
    }
    useEffect(() => {
        var element = document.querySelector('.grecaptcha-badge');
        if (element) {
            element.parentNode.removeChild(element);
        }
        bfaJsonService(payload).then(response => {
            setoperatorSignupForm(response.data.operatorSignup)
            setBusy(false);
            setResults(addressdata)
            setInitialState(response.data.operatorSignup, false, false, true,true);
            //        const [contacts, setContacts] =useState(response.data.operatorSignup);
        })
        console.log("add new company",addNewCompany)
        console.log("loggedin user type",loggedinUserType)
    }, []);

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
        let formData = { ...formDataSet };
        let errorData = { ...formErrors };
        if(evt.target.value != '') {
            if(!Array.isArray(address1Selected)) {
                if(address1Selected == '' && (resetvalue != '' && evt.target.value == resetvalue[0])) {
                        setAddress1Selected(resetvalue)
                } else {
                    setAddress1Selected([evt.target.value]);
                    formData["addressLine1"] = evt.target.value;
                }
            }
            errorData['addressLine1'].isTouched = true;
            errorData['addressLine1'].isValid = true;
            
        } else {
            setAddress1Selected('');
            errorData['addressLine1'].isTouched = true;
            errorData['addressLine1'].isValid = false;
            formData["addressLine1"] = evt.target.value;
        }
        setformErrors(errorData); 
        setformDataSet(formData);
        if(formErrors['addressLine1'] && formErrors['addressLine1'].activeValidator.errorMessage != null) {
            validateField('addressLine1', evt.target.value, 
                { ['addressLine1']: evt.target.value })
        }
    }
    
    const handleFocus = () => {
        setResetValue(address1Selected);
        setAddress1Selected('');
    }

    const searchHandler = (items) => {
        let formData = { ...formDataSet };
        let errorData = { ...formErrors };
       try {
        let address = items[0];
        let addressArr = address.split(',')
        let stateAndzip = addressArr[2].split(' ')
        let cityName = addressArr[1].trim();
        let fullAddress = fullresults.filter((item) => item.Address == address)[0];
        let country = fullAddress.CountryName == '' ? 'United States' : fullAddress.CountryName.replace(' Of America', '')
        setAddress1Selected([fullAddress.Address1])
        document.getElementsByName("zip")[0].value = stateAndzip[2]//fullresults[0].PostalCode
        document.getElementsByName("city")[0].value = cityName; //fullresults[0].Locality
        document.getElementsByName("stateName")[0].value = stateMapper[stateAndzip[1]]//fullresults[0].AdministrativeArea
        document.getElementsByName("countryName")[0].value = country

        //formData["addressLine2"] = fullresults[0].Address2
        formData["addressLine1"] = addressArr[0]//fullresults[0].Address1
        formData["zip"] = stateAndzip[2]//fullresults[0].PostalCode
        formData["city"] = cityName // fullresults[0].Locality
        formData["stateName"] = stateAndzip[1] //fullresults[0].AdministrativeArea
        formData["countryName"] = country
        
        let fields = ['addressLine1', 'zip', 'city', 'stateName', 'countryName'];
        fields.forEach(item => {
            errorData[item].isTouched = true;
            errorData[item].isValid = true;
            validateField(item, formData[item], 
                { [item]: formData[item] })
        })
        setformErrors(errorData);
        setformDataSet(formData);
        document.getElementsByName('addressLine1')[0].blur();
       } catch(err) {
        console.error('Caught error in melissa')
       }
    }

    const filterBy = () => true;

    const handleChange = (selected) => {
        setClickedSelection(selected[0]);
        // list.sections[0].subSections[0].
        // typeaheadRef.current.clear();
    };



    const handleAddFormSubmit = () => {
        let usedField = operatorSignup.sections[0].subSections[0].additionalUser
        const addNewFiled = {}
        const temp = JSON.parse(JSON.stringify(operatorSignup.sections[0].subSections[0].additionalUser[usedField.length - 1].fields));

        addNewFiled['fields'] = temp
        let list = operatorSignup
        list.sections[0].subSections[0].additionalUser.push(addNewFiled);
        setoperatorSignupForm(list)
        setInitialState(list,null,null,null,false)

    }
    const handleRemoveFormSubmit = (e, item, index) => {
        let fieldArr = operatorSignup;
        fieldArr.sections[0].subSections[0].additionalUser.splice(index, 1);
        setoperatorSignupForm(fieldArr);
        let updatedFormFieldData = formFieldData;
        updatedFormFieldData.splice(index,1)
        setFormFieldData(updatedFormFieldData);
        let updatedFormFieldErrors = formFieldErrors;
        updatedFormFieldErrors.splice(index,1)
        setFormFieldErrors(updatedFormFieldErrors);
        setInitialState(fieldArr,null,null,null,false);

    }

    const handleAircraftSubmit = () => {
        let usedField = operatorSignup.sections[0].subSections[0].aircraftInformation
        const addNewFiled = {}
        const temp = JSON.parse(JSON.stringify(operatorSignup.sections[0].subSections[0].aircraftInformation[usedField.length - 1].fields));

        addNewFiled['fields'] = temp
        let list = operatorSignup
        list.sections[0].subSections[0].aircraftInformation.push(addNewFiled);
        setoperatorSignupForm(list)
        setInitialState(list,null,null,null,false)
    }
    const handleAircraftRemove = (e, item, index) => {
        let fieldArr = operatorSignup;
        fieldArr.sections[0].subSections[0].aircraftInformation.splice(index, 1);
        setoperatorSignupForm(fieldArr);
        let updatedAircraftFieldData = aircraftFieldData;
        updatedAircraftFieldData.splice(index,1)
        setAircraftFieldData(updatedAircraftFieldData);
        let updatedAircraftFormErrors = aircraftFormErrors;
        updatedAircraftFormErrors.splice(index,1)
        setAircraftFormErrors(updatedAircraftFormErrors);
        setInitialState(fieldArr,null,null,null,false);
    }

    const handleFileAddSubmit = () => {
        let usedField = operatorSignup.sections[0].subSections[0].uploadDocument
        const addNewFiled = {}
        const temp = JSON.parse(JSON.stringify(operatorSignup.sections[0].subSections[0].uploadDocument[usedField.length - 1].fields));

        addNewFiled['fields'] = temp
        let list = operatorSignup
        list.sections[0].subSections[0].uploadDocument.push(addNewFiled);
        
        const fieldTypeArr = ['input', 'select', 'Checkbox', 'asynctypeahead'];
        let latestSection=operatorSignup && operatorSignup.sections[0].subSections[0].uploadDocument[usedField.length-1];
        let uploadDocsDetails = {};
        let uploadDocsErrDetails ={};
        let uploadformDetails = [...uploadDocsData];
        let uploadDocsFormError = [...uploadDocsErrors];
        latestSection.fields.forEach((item) => {
            if (fieldTypeArr.includes(item.component.toLowerCase())) {
                uploadDocsDetails[item.name] = item.defaultValue ? item.defaultValue : "";
                uploadDocsErrDetails[item.name] = getFormErrorRules(item);
            }
        })
        if(props.jsondata && props.jsondata.hasOwnProperty('saveDocsData')){
            let newfile = ""
            const names = [...filenames]
            const docs = [...saveDocsData]
            names.push(newfile)
            docs.push(newfile)
            setfilenames(names)
            setSaveDocsData(docs)
        }
            uploadformDetails.push(JSON.parse(JSON.stringify(uploadDocsDetails)));
            uploadDocsFormError.push(JSON.parse(JSON.stringify(uploadDocsErrDetails)));
            setUploadDocsData(uploadformDetails)
            setUploadDocsErrors(uploadDocsFormError)
            setoperatorSignupForm(list);
    }
    const handleFileFormRemove = (e, item, index) => {
        let fieldArr = JSON.parse(JSON.stringify(operatorSignup));
        fieldArr.sections[0].subSections[0].uploadDocument.splice(index, 1);
        setoperatorSignupForm(fieldArr);
        let docs = [...uploadedDocs]
        console.log(uploadDocsData)
        console.log(docs)
        let selectedDocs = [...selectedFile]
        selectedDocs.splice(index,1);
        setSelectedFile(selectedDocs)
        // let docsList =  uploadedDocs;
        // docsList.splice(index, 1);
        // setUploadedDocs(docsList);
        //setSelectedFile(docsList);
        if(props.jsondata && props.jsondata.hasOwnProperty('saveDocsData')){
            const names = [...filenames]
            const docs = [...saveDocsData]
            names.splice(index,1)
            setfilenames(names)
            docs.splice(index,1)
            setSaveDocsData(docs)
        }
        let updateduploadDocsData = [...uploadDocsData];
        updateduploadDocsData.splice(index,1);
        setUploadDocsData(updateduploadDocsData);
        setUploadedDocs(selectedDocs);
        let uploadDocumentMsglatest = uploadDocumentMsg;
        uploadDocumentMsglatest.splice(index,1);
        setUploadDocumentMsg(uploadDocumentMsglatest);
        let uploadDocsFormError = [...uploadDocsErrors];
        uploadDocsFormError.splice(index,1);
        setUploadDocsErrors(uploadDocsFormError);
        setInitialState(fieldArr,null,null,null,false);
    }

    const setInitialState = (operatorSigup, isClear, isClearSubField, isOnLoad,flag) => {

        const formData = {};
        let formDataErrors = {};
        let formdetails = [];
        let aircarftFormDetails = [];
        let uploadformDetails = [];


        let errDetails = {}; //A
        let formFieldError = [];//A
        let details = {};

        let aircraftErrDetails = {}; //A
        let aircraftDetails = {};
        let aircraftFormError = []

        let uploadDocsErrDetails = {};
        let uploadDocsDetails = {};
        let uploadDocsFormError = []
        if (isClear && !Storage.getItem('jwtToken')) {
            setbtnDisable(true);
        }
        const fieldTypeArr = ['input', 'select', 'Checkbox', 'asynctypeahead'];

        operatorSigup && operatorSigup.sections[0].subSections[0].fields.forEach((item) => {
            if (fieldTypeArr.includes(item.component.toLowerCase())) {
                if (Storage.getItem('noOfAircrafts') != undefined && item.name === 'numberOfAircrafts') {
                    formData[item.name] = isClear ? '' : Storage.getItem('noOfAircrafts');
                } else {
                    formData[item.name] = isClear ? (item.defaultValue ? item.defaultValue : "") : formDataSet && formDataSet[item.name] ? formDataSet[item.name] : item.defaultValue ? item.defaultValue : "";
                }
                formDataErrors[item.name] = isClear ? getFormErrorRules(item) : formErrors && formErrors[item.name] ? formErrors[item.name] : getFormErrorRules(item);
            }
        })

        operatorSigup && operatorSigup.sections[0].subSections[0].administratorDetails.forEach((item) => {
            if (fieldTypeArr.includes(item.component.toLowerCase())) {
                formData[item.name] = isClear ? (item.defaultValue ? item.defaultValue : "") : formDataSet && formDataSet[item.name] ? formDataSet[item.name] : item.defaultValue ? item.defaultValue : "";
                formDataErrors[item.name] = isClear ? getFormErrorRules(item) : formErrors && formErrors[item.name] ? formErrors[item.name] : getFormErrorRules(item);
            }
        })


        // operatorSigup && operatorSigup.sections[0].subSections[0].additionalUser.fields.forEach((item) => {
        //     if (fieldTypeArr.includes(item.component.toLowerCase())) {
        //         formData[item.name] = formDataSet && formDataSet[item.name] ? formDataSet[item.name] : item.defaultValue?item.defaultValue:"";
        //         formErrors[item.name] = getFormErrorRules(item);
        //     }

        //  })
        if(props.jsondata && props.jsondata.hasOwnProperty('additionalUserRequest') && props.jsondata.additionalUserRequest.length > 1 && flag){
            for(var i=1;i<props.jsondata.additionalUserRequest.length;i++){
                let usedField = operatorSigup.sections[0].subSections[0].additionalUser
                const addNewFiled = {}
                const temp = JSON.parse(JSON.stringify(operatorSigup.sections[0].subSections[0].additionalUser[usedField.length - 1].fields));

                addNewFiled['fields'] = temp
                operatorSigup.sections[0].subSections[0].additionalUser.push(addNewFiled);
            }
        }
        operatorSigup && operatorSigup.sections[0].subSections[0].additionalUser.forEach((item, index) => {
            item.fields.forEach((item) => {
                if (fieldTypeArr.includes(item.component.toLowerCase())) {
                    details[item.name] = isClear || isClearSubField ? "" : formFieldData && formFieldData.length > index ? formFieldData[index][item.name] : item.defaultValue ? item.defaultValue : "";
                    errDetails[item.name] = getFormErrorRules(item);
                    if (isClear || isClearSubField) { }
                    else { errDetails = { ...setPrevActiveValidator(errDetails, item, index) } };
                }
            })
            if(props.jsondata && props.jsondata.hasOwnProperty('additionalUserRequest') && props.jsondata.additionalUserRequest.length > 0 && isClear == false && flag){
                item.fields.forEach((item) => {
                    if (fieldTypeArr.includes(item.component.toLowerCase())) {
                        if(props.jsondata.additionalUserRequest.length > 1){
                            details[item.name] = props.jsondata.additionalUserRequest[index][item.name] ? props.jsondata.additionalUserRequest[index][item.name] : details[item.name] 
                        }else{
                            details[item.name] = props.jsondata.additionalUserRequest[0][item.name] ? props.jsondata.additionalUserRequest[0][item.name] : details[item.name] 
                        }
                    }
                })
            }
             formdetails.push(JSON.parse(JSON.stringify(details)));
             formFieldError.push(JSON.parse(JSON.stringify(errDetails)));
        })

        operatorSigup && operatorSigup.sections[0].subSections[0].companyDetails[0].fields.forEach((item) => {
            if (fieldTypeArr.includes(item.component.toLowerCase())) {
                formData[item.name] = isClear ? (item.defaultValue ? item.defaultValue : "") : formDataSet && formDataSet[item.name] ? formDataSet[item.name] : item.defaultValue ? item.defaultValue : "";
                formDataErrors[item.name] = isClear ? getFormErrorRules(item) : formErrors && formErrors[item.name] ? formErrors[item.name] : getFormErrorRules(item);
                if(isClear) {
                     setAddress1Selected('');
                     typeaheadRef.current.clear();
                }
            }
        })
        // operatorSigup && operatorSigup.sections[0].subSections[0].aircraftInformation[0].fields.forEach((item) => {
        //     if (fieldTypeArr.includes(item.component.toLowerCase())) {
        //         formData[item.name] = isClear ? (item.defaultValue ? item.defaultValue : "") : formDataSet && formDataSet[item.name] ? formDataSet[item.name] : item.defaultValue ? item.defaultValue : "";
        //         formErrors[item.name] = getFormErrorRules(item);
        //     }
        // })
        if(props.jsondata && props.jsondata.hasOwnProperty('aircraft') && props.jsondata.aircraft.length > 1 && flag){
            for(var i=1;i<props.jsondata.aircraft.length;i++){
                let usedField = operatorSigup.sections[0].subSections[0].aircraftInformation
                const addNewFiled = {}
                const temp = JSON.parse(JSON.stringify(operatorSigup.sections[0].subSections[0].aircraftInformation[usedField.length - 1].fields));

                addNewFiled['fields'] = temp
                operatorSigup.sections[0].subSections[0].aircraftInformation.push(addNewFiled);
            }
        }
        operatorSigup && operatorSigup.sections[0].subSections[0].aircraftInformation.forEach((item, index) => {
            item.fields.forEach((item) => {
                if (fieldTypeArr.includes(item.component.toLowerCase())) {
                    aircraftDetails[item.name] = isClear || isClearSubField ? "" : aircraftFieldData && aircraftFieldData.length > index ? aircraftFieldData[index][item.name] : item.defaultValue ? item.defaultValue : "";
                    aircraftErrDetails[item.name] = isClear ? getFormErrorRules(item) : aircraftFormErrors && aircraftFormErrors.length > index ? aircraftFormErrors[index][item.name] : getFormErrorRules(item);
                    //if (isClear || isClearSubField) { }
                    //else { aircraftErrDetails = { ...setPrevActiveValidator(aircraftErrDetails, item, index) } };
                }
            })
            if(props.jsondata && props.jsondata.aircraft != null && isClear == false && flag){
                item.fields.forEach((item) => {
                    if (fieldTypeArr.includes(item.component.toLowerCase())) {
                        if(props.jsondata.additionalUserRequest.length > 1){
                            aircraftDetails[item.name] = props.jsondata.aircraft[index][item.name] ? props.jsondata.aircraft[index][item.name] : aircraftDetails[item.name]
                        }else{
                            aircraftDetails[item.name] = props.jsondata.aircraft[0][item.name] ? props.jsondata.aircraft[0][item.name] : aircraftDetails[item.name] 
                        }
                    }
                })
            }
            aircarftFormDetails.push(JSON.parse(JSON.stringify(aircraftDetails)));
            aircraftFormError.push(JSON.parse(JSON.stringify(aircraftErrDetails)));
        })
        if(props.jsondata && props.jsondata.hasOwnProperty('filenames') && props.jsondata.filenames.length > 1 && flag){
            for(var i=1;i<props.jsondata.filenames.length;i++){
                let usedField = operatorSigup.sections[0].subSections[0].uploadDocument
                const addNewFiled = {}
                const temp = JSON.parse(JSON.stringify(operatorSigup.sections[0].subSections[0].uploadDocument[usedField.length - 1].fields));
    
                addNewFiled['fields'] = temp
                operatorSigup.sections[0].subSections[0].uploadDocument.push(addNewFiled);
            }
        }
        if(props.jsondata && props.jsondata.hasOwnProperty('saveDocsData') && flag){
            setSaveDocsData(props.jsondata.saveDocsData)
            setfilenames(props.jsondata.filenames)
        }
        operatorSigup && operatorSigup.sections[0].subSections[0].uploadDocument.forEach((item,index) => {
            if(isOnLoad || isClear){
                item.fields.forEach((item) => {
                    if (fieldTypeArr.includes(item.component.toLowerCase())) {
                        uploadDocsDetails[item.name] = isClear ? (item.defaultValue ? item.defaultValue : "") : uploadDocsData && uploadDocsData.length > index ? uploadDocsData[index][item.name] : item.defaultValue ? item.defaultValue : "";
                        uploadDocsErrDetails[item.name] = getFormErrorRules(item);
                    }
                })
                if(props.jsondata && props.jsondata.filenames.length > 0 && isClear == false && flag){
                    let blob = [...selectedFile]
                    item.fields.forEach((item) => {
                        if(item.name == "documentName"){
                            uploadDocsDetails[item.name] = props.jsondata.uploadDocsData[index][item.name] ? props.jsondata.uploadDocsData[index][item.name] : uploadDocsData[index][item.name]
                            uploadDocsErrDetails[item.name] = getFormErrorRules(item);
                        }else if(item.name == "DocumentUpload"){
                            uploadDocsDetails[item.name] = props.jsondata.filenames[index] ? props.jsondata.filenames[index] : uploadDocsData[index][item.name] 
                            uploadDocsErrDetails[item.name] = getFormErrorRules(item);
                            var block = props.jsondata.saveDocsData[index].split(";");
                            var contentType = block[0].split(":")[1];
                            var realData = block[1].split(",")[1];                           
                            blob[index] = b64toBlob(realData, contentType)
                        }
                    })
                    setSelectedFile(blob)
                }
                uploadformDetails.push(JSON.parse(JSON.stringify(uploadDocsDetails)));
                uploadDocsFormError.push(JSON.parse(JSON.stringify(uploadDocsErrDetails)));
                
            }
            //setUploadDocumentMsg("")
        })
        operatorSigup && operatorSigup.sections[0].subSections[0].cardSignup[0].fields.forEach((item) => {
            if (fieldTypeArr.includes(item.component.toLowerCase())) {
                formData[item.name] = formDataSet && formDataSet[item.name] ? formDataSet[item.name] : item.defaultValue ? item.defaultValue : "";
                formDataErrors[item.name] = isClear ? getFormErrorRules(item) : formErrors && formErrors[item.name] ? formErrors[item.name] : getFormErrorRules(item);
            }
        })
        if(newRowData != null&& isClear == false){
            operatorSigup && operatorSigup.sections[0].subSections[0].fields.forEach((item) => {
                if (fieldTypeArr.includes(item.component.toLowerCase())) {
                    formData[item.name] = newRowData[item.name] ? newRowData[item.name] : item.defaultValue;
                }
            })
            operatorSigup && operatorSigup.sections[0].subSections[0].administratorDetails.forEach((item) => {
                if (fieldTypeArr.includes(item.component.toLowerCase())) {
                    formData[item.name] = newRowData[item.name] ? newRowData[item.name] : item.defaultValue;
                }
            })
            operatorSigup && operatorSigup.sections[0].subSections[0].companyDetails[0].fields.forEach((item) => {
                if (item.name == "companyName") {
                    formData[item.name] = newRowData[item.name] ? newRowData[item.name] : item.defaultValue;
                }
            })
        }
        if(props.jsondata != null && isClear == false){
            operatorSigup && operatorSigup.sections[0].subSections[0].fields.forEach((item) => {
                if (fieldTypeArr.includes(item.component.toLowerCase())) {
                    formData[item.name] = props.jsondata[item.name] ? props.jsondata[item.name] : item.defaultValue;
                }
            })
            operatorSigup && operatorSigup.sections[0].subSections[0].administratorDetails.forEach((item) => {
                if (fieldTypeArr.includes(item.component.toLowerCase())) {
                    if(item.name=='mobileNumber'){
                        formData[item.name] = props.jsondata[item.name] ? phoneValidation(props.jsondata[item.name]) : item.defaultValue;
                    }else{
                        formData[item.name] = props.jsondata[item.name] ? props.jsondata[item.name] : item.defaultValue;
                }
                }
            })

            operatorSigup && operatorSigup.sections[0].subSections[0].companyDetails[0].fields.forEach((item) => {
                if (fieldTypeArr.includes(item.component.toLowerCase())) {
                    if(item.name=='companyNumber'){
                        formData[item.name] = props.jsondata[item.name] ? phoneValidation(props.jsondata[item.name]) : item.defaultValue;
                    }else{
                        formData[item.name] = props.jsondata[item.name] ? props.jsondata[item.name] : item.defaultValue;
                }
                    
                }
            })
            operatorSigup && operatorSigup.sections[0].subSections[0].cardSignup[0].fields.forEach((item) => {
                if (fieldTypeArr.includes(item.component.toLowerCase())) {
                    formData[item.name] = props.jsondata[item.name] ? props.jsondata[item.name] : item.defaultValue;
                }
            })
        }
        //console.log('formFieldError', formFieldError)
        if(isClear)
            setUploadDocumentMsg([])
        setFormFieldData(formdetails);
        setFormFieldErrors(formFieldError);
        setformErrors(formDataErrors);
        setformDataSet(formData);

        setAircraftFieldData(aircarftFormDetails);
        setAircraftFormErrors(aircraftFormError);
        if(isOnLoad || isClear){
            setUploadDocsData(uploadformDetails)
            setUploadDocsErrors(uploadDocsFormError)
        }


    }
    const setPrevActiveValidator = (curFormErrors, item, index) => {
        //const { formErrors } = this.state;
        if (formFieldErrors[index]) {
            curFormErrors[item.name].isValid = formFieldErrors[index][item.name].isValid;
            curFormErrors[item.name].isTouched = formFieldErrors[index][item.name].isTouched;
            if (formFieldErrors[index][item.name].activeValidator !== {} && formFieldErrors[index][item.name].activeValidator.type) {
                const activeValidator = curFormErrors[item.name].validations.filter((elem) => elem.type === formFieldErrors[index][item.name].activeValidator.type);
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
    const onHandleSelect = (field, index) => {

        //     setindexvalue(index)
        //     //console.log(fullresults[index])
        //     let formData = {...formDataSet};
        //     document.getElementsByName("addressLine2")[0].value = fullresults[index].Address2
        //     document.getElementsByName("addressLine1")[0].value = fullresults[index].Address1
        //     document.getElementsByName("zip")[0].value = fullresults[index].PostalCode
        //     document.getElementsByName("city")[0].value = fullresults[index].Locality
        //     document.getElementsByName("stateName")[0].value = fullresults[index].AdministrativeArea
        //     document.getElementsByName("countryName")[0].value = fullresults[index].CountryName
        //     //console.log(  formDataSet[mailling2])

        //     document.getElementsByName("addressLine1")[0].callback = false
        //   //  setformDataSet(formData);
        //     document.getElementsByClassName('dropdown-menu show')[0].style.display = 'none';


        //     formData["addressLine2"] = fullresults[index].Address2
        //     formData["addressLine1"]= fullresults[index].Address1
        //     formData["zip"] = fullresults[index].PostalCode
        //     formData["city"] = fullresults[index].Locality
        //     formData["stateName"] = fullresults[index].AdministrativeArea
        //     formData["countryName"] = fullresults[index].CountryName
        //     //console.log(  formDataSet)

        //     formData["callback"] = false
        //     setformDataSet(formData)
        //     isaddressvalid = true


    }

    const isValidFileExtenstion = (fileName) => {

        if (fileName.endsWith(".png") || fileName.endsWith(".jpg") || fileName.endsWith(".jpeg") || fileName.endsWith("pdf") || fileName.endsWith("doc") || fileName.endsWith("docx")) {
            return true;
        } else {
            return false
        }

    }

    const onHandleSelectFile = (e, field, flag, index, section) => {
        let target = e.target;
        let maxLength = 0;
        if (field && field.maxLength) {
            maxLength = parseInt(field.maxLength);
        }
        if (maxLength > 0 && target.value.length > maxLength) {
            target.value = target.value.substring(0, maxLength);
            return;
        }

        let fileSizeAndType = "";
        let formData = { ...formDataSet };

        let isValidFileName = isValidFileExtenstion(e.target.files[0].name)

        if (field.name == "DocumentUpload") {
            setClear();
            let arrayOfFiles = [...uploadedDocs];
            arrayOfFiles[index] = e.target.files[0];
            let docsList = [...uploadDocsData]
            docsList[index][field.name] = e.target.files[0];
            let fileName = e.target.files[0].name;
            let splitName = fileName.split('.');
            let docName = splitName[0];
            if (docsList[index]["documentName"].trim() == '') {  
                if(splitName[0].length > field.length) {
                    docName = splitName[0].substring(0, field.length);
                }
                docsList[index]["documentName"] = docName;
            }
            setUploadDocsData(docsList);
           
            if (e.target.files[0].size <= 5242880 && isValidFileName) {
                setUploadedDocs(arrayOfFiles);
                setSelectedFile(arrayOfFiles);
                let savedfile =  [...saveDocsData];
                let name = [...filenames];
                name[index] = fileName;
                getBase64(e.target.files[0]).then((data) => {
                    savedfile[index] = data
                  })
                formData[field.name] = fileSizeAndType;
                validateField(field.name, fileSizeAndType, null, index, flag, section);
                setformDataSet(formData)
                if (e.target && e.target.files[0]) {
                    setuploadFileData(uploadformDataValue)
                    flag = false
                    let uploadDocumentMsglatest = uploadDocumentMsg;
                    uploadDocumentMsglatest[index]=field.successMessage;
                    setUploadDocumentMsg(uploadDocumentMsglatest);
                }
                setSaveDocsData(savedfile)
                setfilenames(name)
            } else {

                if (!isValidFileName) {
                    fileSizeAndType = 'InvalidType'
                } else {
                    fileSizeAndType = 'InvalidSize'
                }
                flag = true;
                formData[field.name] = fileSizeAndType;
                validateField(field.name, fileSizeAndType, null, index, flag, section);
                setformDataSet(formData)
            }
        }
    }
    const onHandleChecked = (e, field, index) => {
        if (field.id == "termsAndCondition") {
            var element = document.getElementById("submitform");
            if (e.target.checked) { /// audit log
                var element = document.getElementById("submitform");
                element.classList.remove("btn-disabled");
                setisterms(true)
                setbtnDisable(false)
                let auditPayload = {"ModuleName":"Account",
                        "TabName":"User",
                        "Activity":Storage.getItem('email')+" Accepted Terms and Conditions for "+Storage.getItem('organizationName'),
                        "ActionBy":Storage.getItem('email'),
                        "Role":JSON.parse(Storage.getItem('userRoles')),
                        "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
      saveAuditLogData(auditPayload, dispatch)
            } else {
                setisterms(false)
                setbtnDisable(true)
            }

        }

        if (field.id == "companyAddress") {
            if (e.target.checked) {
                document.getElementsByName("ccmailling1")[0].value = fullresults[indexvalue].Address1
                document.getElementsByName("ccmailling2")[0].value = fullresults[indexvalue].Address2
                document.getElementsByName("ccZip")[0].value = fullresults[indexvalue].PostalCode
                document.getElementsByName("ccCity")[0].value = fullresults[indexvalue].Locality
                document.getElementsByName("ccCountry")[0].value = fullresults[indexvalue].CountryName

                formDataSet["sameAsCompanyAdderss"] = true;

            } else {
                document.getElementsByName("mailling2")[0].value = ""
                document.getElementsByName("mailling1")[0].value = ""
                document.getElementsByName("zip")[0].value = ""
                document.getElementsByName("city")[0].value = ""
                document.getElementsByName("ccCountry")[0].value = ""
                formDataSet["sameAsCompanyAdderss"] = false;
            }
        }
    }

    /* const onHandleChange = (e, field, index, flag) => {
 
         let formData = {};
         const fields = {};
         let target = e.target;
         /**
          * Prevent typing if allowed field length is reached.
          
 
         let maxLength = 0;
         if (field && field.maxLength) {
             maxLength = parseInt(field.maxLength);
         }
         if (maxLength > 0 && target.value.length > maxLength) {
             target.value = target.value.substring(0, maxLength);
             return;
         }
 
         fields[field.name] = target.value;
 
         validateField(
             target.name, target.value, fields, true
         );
         formData = {
             ...formDataSet,
             ...fields
         }
 
         setformDataSet(formData)
     }*/

    const onHandleChange = (e, field, index, flag, section) => {

        let formData = {};
        let fields = {};
        let target = e.target;
        let fieldName;
        let fieldValue;

        /**
         * Prevent typing if allowed field length is reached.
         */
        let maxLength = 0;
        if (field && field.maxLength) {
            maxLength = parseInt(field.maxLength);
        }
        if (maxLength > 0 && target.value.length > maxLength) {
            target.value = target.value.substring(0, maxLength);
            return;
        }
        if (field.name === 'aircraftTailNumber' ||  field.name === 'aircraftModel' || field.name === 'maxFuelCapacity' || field.name === 'homeBaseAirport') {
            target.value = target.value.replace(/[^a-zA-Z0-9]/gi, '')
        }
        if(field.name === 'aircraftTailNumber' || field.name === 'homeBaseAirport'){
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

        if (field.name === 'firstName' || field.name === 'lastName' || field.name === 'middleName' || field.name === 'homeBaseAirport') {
            target.value = target.value.replace(/[^a-z]/gi, '')
        }
        if (field.name === 'vatExemptId') {
            target.value = target.value.replace(/[^a-zA-Z0-9]/gi, '')
        }
        if (field.dataType === 'numeric') {
            target.value = target.value.replace(/\D/g, '')
        }
        if (field.validations) {
            for (var i = 0; i < field.validations.length; i++) {
                if (field.validations[i].type === 'CheckUSPhone') {
                    e.target.value = phoneValidation(e.target.value);
                } else if (field.validations[i].type === 'CheckEIN') {
                    e.target.value = einValidation(e.target.value);
                } else if (field.validations[i].type === 'CheckZIP') {
                    if (!(new RegExp(field.validations[i].validateRule)
                        .test(e.target.value))) {
                        e.target.value = zipValidation(e.target.value)
                    }
                }
            }
        }

        // if (field.name == "addressLine1" || field.name == "addressLine2") {

        //     setIsLoading(true);

        //     let value = {
        //         "ff": target.value
        //     }


        //     fetchaddressFunction(value)
        // }
        // if (field.name == "addressLine1" || field.name == "addressLine2" || field.name == "city"  || field.name == "zip" || field.name == "stateName" || field.name == "countryName") {
        //     setIsLoading(true);
        //     let value = {
        //         "addressLine1":document.getElementsByName("addressLine1")[0].value ,
        //         "addressLine2":document.getElementsByName("addressLine2")[0].value ,
        //         "city":document.getElementsByName("city")[0].value ,
        //         "zipcode":document.getElementsByName("zip")[0].value
        //     }
        //     let countryname = document.getElementsByName("countryName")[0].value
        //     if(countryname !== ""){
        //         if(isaddressvalid){
        //             fetchaddressverification(value)
        //         }
        //     }

        // }
        // async function fetchaddressverification(value) {

        //     try {
        //         addressValidationService(value).then(response => {
        //             let addressValue = response.data

        //             if(addressValue.TotalRecords == 0 ){
        //                 formDataSet["detailsAreCorrect"] = false;
        //                 setModalText(operatorSignup.modal[0].addressModal.paragraph)
        //                 setModalShow(true)
        //             }else{
        //                 formDataSet["detailsAreCorrect"] = true;

        //             }


        //         })


        //     }
        //     catch (err) {

        //         throw err;
        //         //console.log(err);
        //     }
        // }

        // async function fetchaddressFunction(value) {
        //     let items;
        //     try {
        //         searchAddress(value).then(response => {
        //             for (let i = 0; i <= response.data.length; i++) {

        //                 addressdata.push(response.data[i].Address.Address)
        //                 fulladdressdata.push(response.data[i].Address)

        //             }

        //         })
        //         //  const { totalItems, items } = addressdata;
        //         //console.log(addressdata)
        //         setResults(addressdata)
        //         setFullResults(fulladdressdata)
        //         //  setIsLoading(false);
        //         //   setResults(totalItems ? items.map((i: any) => i.addressdata) : []);

        //         items = addressdata
        //         target.results = addressdata
        //         //  setResults(addressdata)
        //         setaddress(addressdata)
        //         field.result = { results }

        //         //   field.results = addressdata
        //         const delayDebounceFn = setTimeout(() => {
        //             field.callback = true
        //             if (document.getElementsByClassName('dropdown-menu show')[0].style.display == "none") {
        //                 document.getElementsByClassName('dropdown-menu show')[0].style.display = "block"
        //             }

        //           //  setformDataSet(formData);
        //         }, 50)
        //         setIsLoading(false);
        //         //  items = 
        //         //   
        //     }
        //     catch (err) {
        //         throw err;
        //         //console.log(err);
        //     }
        // }


        fields[field.name] = target.value;


        if (flag) {
            let fields = [];
            if(section == "addUser") {
                fields = JSON.parse(JSON.stringify(formFieldData));
            } else if (section == "uploadDocs") {
                fields = JSON.parse(JSON.stringify(uploadDocsData));
            }
            else {
                fields = JSON.parse(JSON.stringify(aircraftFieldData));
            }
            fieldName = target.name;
            fieldValue = target.value;
            fields[index][fieldName] = fieldValue;
            //console.log('fields',fields);

            // if (field.name === 'additionalUserMail' /* || field.name === 'aircraftTailNumber' */) {
            //     validateField(fieldName, fieldValue, fields, index, flag, section);
            // }
            if(section == "addUser") {
                setFormFieldData(fields);
            } else if (section == "uploadDocs") {
                if (field.name=="documentName"){
                    let docsList = [...uploadDocsData]
                    docsList[index][field.name] = e.target.value;
                    docsList[index]["documentName"] = e.target.value;
                    setUploadDocsData(docsList);
                }
            }
            else
                setAircraftFieldData(fields);
        }
        else {
            if (field.name != "DocumentUpload") {
                fieldName = target.name;
                fieldValue = target.value;
                let fields = {};
                //fieldValue = fieldValue.trim()

                fields[fieldName] = fieldValue;
                // if (fieldName === 'emailId' || isBtnValidate) {
                //     validateField(fieldName, fieldValue, fields, index, flag);
                // }

                formData = {
                    ...formDataSet,
                    ...fields
                };
                setformDataSet(formData);
            }

        }


        //  validateField(
        //      target.name, target.value, fields, true
        //  );
        // formData = {
        //     ...formDataSet,
        //     ...fields
        // }

        // setformDataSet(formData)
    }
    const onHandleBlur = (e, field, index, flag, section) => {
        let formData = {};
        let fields = {};
        let target = e.target;

        target.value = target.value.trim()
        fields[field.name] = target.value;
        // if (field.name === 'additionalUserMail' || field.name === 'emailId') {
            validateField(field.name, target.value, fields, index, flag, section);
        // }
        // if (target.name === 'emailId') {
        //     validateField(
        //         target.name, target.value, fields, true,
        //     );
        // }

        // if (field.name === 'emailId' || isBtnValidate) {
        //     validateField(field.name, fieldValue, fields, index, flag);
        // }

        if (field.name == "aircraftTailNumber") {

            let value = {
                "tailNumber": target.value
            }

            fetchFunction(value, index)
        }

        async function fetchFunction(value, index) {
            let formData = [ ...aircraftFieldData ];
           
                flightInformationService(value).then(response => {

                    // console.log('response data ',response.data.serialNumber)
                    document.getElementsByName("serialNumber")[index].value = response === undefined ? '' : response.data.serialNumber  === undefined ? '' : response.data.serialNumber;
                    document.getElementsByName("manufacturerName")[index].value = response === undefined ? '' : response.data.manufacturer === undefined ? '' : response.data.manufacturer;
                    document.getElementsByName("aircraftModel")[index].value = response === undefined ? '' : response.data.aircraftModel === undefined ? '' : response.data.aircraftModel;
                    formData[index]['serialNumber'] = response === undefined ? '' : response.data && response.data.serialNumber
                    formData[index]['manufacturerName'] = response === undefined ? '' : response.data && response.data.manufacturer
                    formData[index]['aircraftModel'] = response === undefined ? '' :  response.data && response.data.aircraftModel
                    setAircraftFieldData(formData)
                }).catch( err => {
                    document.getElementsByName("serialNumber")[index].value = ""
                    document.getElementsByName("manufacturerName")[index].value = ""
                    document.getElementsByName("aircraftModel")[index].value = ""
                })
        }

        /* formData = {
            ...formDataSet,
            ...fields
        }

        setformDataSet(formData) */
    }
    const validateField = (fieldName, value, fields, index, flag, section,isDuplicate,isAircraftDuplicate) => {
        const fieldValidationErrors = {
            ...formErrors
        };
        let NewFieldValidationErrors = [];
        if(section == "addUser"){
            NewFieldValidationErrors = [ ...formFieldErrors ];
        } else if(section == "uploadDocs"){
            NewFieldValidationErrors = [ ...uploadDocsErrors ];
        }
        else NewFieldValidationErrors = [ ...aircraftFormErrors ];
        let fieldValidationError;

        //fieldValidationError = fieldValidationErrors[fieldName];

        if (flag) {
            if(section == "addUser"){
                fieldValidationError = formFieldErrors[index][fieldName];
            } else if(section == "uploadDocs"){ 
                fieldValidationError = uploadDocsErrors[index][fieldName];
            }
            else fieldValidationError = aircraftFormErrors[index][fieldName];
        } else {
            fieldValidationError = fieldValidationErrors[fieldName];
        }
        // if (isTouched !== undefined) {
        //     fieldValidationError.isTouched = isTouched;
        // }
        let validationObj = {};
        validationObj = getFieldIsValid(value, fieldValidationError, fieldName,isDuplicate,isAircraftDuplicate);
        if (flag) {
            NewFieldValidationErrors[index][fieldName] = {
                ...validationObj.fieldValidationError
            };
            let errcount = validationObj.errcount;
            if (!errcount) {
                NewFieldValidationErrors[index][fieldName].isValid = true;
                NewFieldValidationErrors[index][fieldName].activeValidator = {};
            } else {
                NewFieldValidationErrors[index][fieldName].isValid = false;
            }

            if(section == "addUser") {
                setFormFieldErrors(NewFieldValidationErrors);
            } else if(section == "uploadDocs"){
                setUploadDocsErrors(NewFieldValidationErrors)
            }
            else setAircraftFormErrors(NewFieldValidationErrors);
        } else {
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
            setformErrors(fieldValidationErrors);

        }
        // fieldValidationErrors[fieldName] = {
        //     ...validationObj.fieldValidationError
        // };

        // let errcount = validationObj.errcount;
        // if (!errcount) {
        //     fieldValidationErrors[fieldName].isValid = true;
        //     fieldValidationErrors[fieldName].activeValidator = {};
        // } else {
        //     fieldValidationErrors[fieldName].isValid = false;
        // }
        // setformErrors(fieldValidationErrors)
        /*customValidation(
            fieldName, value, validationObj
        );*/
    }
    const customValidation = (
        fieldName, value, validationObj
    ) => {
        const fieldValidationErrors = {
            ...formErrors
        };
        let errcount = validationObj.errcount;
        if (!errcount) {
            fieldValidationErrors[fieldName].isValid = true;
            fieldValidationErrors[fieldName].activeValidator = {};
        } else {
            fieldValidationErrors[fieldName].isValid = false;
        }
        setformErrors(fieldValidationErrors)
    }


    const getFieldIsValid = (value, fieldValidationError, fieldName,isDuplicate,isAircraftDuplicate) => {
        let validationObj = {
            fieldValidationError: fieldValidationError,
            errcount: 0
        };
        if (fieldValidationError.isRequired === true) {
            validationObj =
                checkValidationByValidationTypes(value, fieldValidationError, fieldName,isDuplicate,isAircraftDuplicate);
        } else {
            if (value) {
                validationObj =
                checkValidationByValidationTypes(value, fieldValidationError, fieldName,isDuplicate,isAircraftDuplicate);
            }
        }
        return validationObj;
    }

    const closeModal = () => {
        resetScrollPos();
        setModalShow(false)
        document.getElementById('root').style.filter = 'none';
        if (modalText === operatorSignup.modal[0].termsmodal.paragraph) {
            document.getElementById('termsAndCondition').checked = false;
            setbtnDisable(true)
        }
    }
    const closed = () => {
        setModalShow(false)
        document.getElementById('root').style.filter = 'none';
    }
    const accept = () => {
        resetScrollPos();
        setModalShow(false)
        document.getElementById('root').style.filter = 'none';
        if (modalText === operatorSignup.modal[0].termsmodal.paragraph) {
            document.getElementById('termsAndCondition').checked = true;
            setbtnDisable(false)
        } else if (modalText === operatorSignup.modal[0].submitModal.paragraph) {
            if (Storage.getItem('jwtToken')) {
                if(addNewCompany){
                    //console.log("In add new company")
                    if(props.onboard != null){
                        props.onboard()
                    }else{
                        navigate('/dashboard/account/company')
                    }
                } else {
                    navigate('/admin')
                }
                
            } else {
                navigate('/')
            }
        } else {
            if (Storage.getItem('jwtToken')) {

            } else {
                document.getElementById('termsAndCondition').checked = false;
                setbtnDisable(true)
            }
        }

    }
    const checkValidationByValidationTypes = (value, fieldValidationError, fieldName,isDuplicate,isAircraftDuplicate) => {
        const validationTypes = ['IsMandatory', 'IsEmail', 'email', 'CheckZIP', 'CheckEIN', 'CheckRegex', 'CheckUSPhone', 'onlyspecial', 'onlydigit', 'fileSize', 'fileType','IsDuplicated','IsAircraftDuplicated'];
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
                    }
                }
                if (!errcount) {
                    if (validationType === 'IsEmail') {
                        let check = false;
                        if (!new RegExp(activeValidator[0].validateRule)
                            .test(value)) {
                            check = true
                        }
                        if (fieldName == "emailaddress" || fieldName == "emailId") {
                            let splitVal = value.split('@');
                            // let replacedVal = splitVal[0].replaceAll('_', '').replaceAll('.', '')
                            let replacedVal =  !new RegExp('.*[^a-zA-Z0-9._+].*').test(splitVal[0]);
                            if (replacedVal) { }
                            else {
                                check = true
                            }
                        }
                        if (check) {
                            errcount++;
                            fieldValidationError
                                .activeValidator = activeValidator[0];
                        }
                    }
                }
                if (!errcount) {
                    if (validationType === 'CheckUSPhone') {
                        let number = value ? value.match(/\d/g) :[]
                        if (value && (number.length !== 10)) {
                            errcount++;
                            fieldValidationError
                                .activeValidator = activeValidator[0];
                        }
                        // else if(value && (number.length == 10)){
                       
                        //     let data = value.replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, '')
                        //     data = data.replace("-", '')
                        //     data =parseInt(data.replace(" ",""))
                        //     if (data<10){
                        //         errcount++;
                        //         fieldValidationError
                        //             .activeValidator = activeValidator[0];
                        //     }
                            
                        // }
                    }
                }
                if (!errcount) {
                    if (validationType === 'CheckEIN') {
                        if (value.length !== 11) {
                            errcount++;
                            fieldValidationError
                                .activeValidator = activeValidator[0];
                        }
                    }
                }
                if (!errcount) {
                    if (validationType === 'CheckZIP') {
                        if (!(value.length === 10 || value.length === 5)) {
                            errcount++;
                            fieldValidationError
                                .activeValidator = activeValidator[0];
                        }
                    }
                }
                if (!errcount) {
                    if (validationType === 'onlyspecial') {
                        if (!new RegExp(activeValidator[0].validateRule)
                            .test(value)) {
                            errcount++;
                            fieldValidationError
                                .activeValidator = activeValidator[0];
                        }
                    }
                }
                if(!errcount){
                    if(validationType === 'IsDuplicated'){
                        if( isDuplicate === true ) {
                            errcount++;
                            fieldValidationError.activeValidator = activeValidator[0];
                          }
                    }
                }
                if(!errcount){
                    if(validationType === 'IsAircraftDuplicated'){
                        console.log(' isAircraftDuplicate ',isAircraftDuplicate)
                        if( isAircraftDuplicate === true ) {
                            errcount++;
                            fieldValidationError.activeValidator = activeValidator[0];
                          }
                    }
                }
                            
                if (!errcount) {
                    if (validationType === 'onlydigit') {
                        if (!new RegExp(activeValidator[0].validateRule)
                            .test(value)) {
                            errcount++;
                            fieldValidationError
                                .activeValidator = activeValidator[0];
                        }
                    }
                }

                if (!errcount) {
                    if (validationType === 'fileSize') {
                        if (value == "InvalidSize") {
                            errcount++;
                            fieldValidationError
                                .activeValidator = activeValidator[0];
                        }
                    }
                }

                if (!errcount) {
                    if (validationType === 'fileType') {
                        if (value == "InvalidType") {
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
    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        })
    }
    function b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;
    
        var byteCharacters = atob(b64Data);
        var byteArrays = [];
    
        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);
    
            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
    
            var byteArray = new Uint8Array(byteNumbers);
    
            byteArrays.push(byteArray);
        }
    
        var blob = new Blob(byteArrays, {type: contentType});
        return blob;
      }
      const checkDuplicate = () =>{
        let dupInd = [];
      formFieldData.forEach((ob,index) => {
        let email = ob.additionalUserMail;
        let flagIndex = [];
        for(let i = index+1;i<formFieldData.length;i++){
          if(formFieldData[i]["additionalUserMail"] == email){
              flagIndex.push(i);
              flagIndex.push(index);
          }
        }
        dupInd = new Set([...dupInd, ...flagIndex])
      })
      let convertArr = [...dupInd];
      if(convertArr.length) {
        convertArr.forEach(dup => {
          Object.keys(formFieldData[dup]).forEach((fieldName)=> {
            if(fieldName == 'additionalUserMail'){
              validateField(
                fieldName,
                formFieldData[dup][fieldName],
                { [fieldName]: formFieldData[dup][fieldName] },
                dup,
                true,
                'addUser',
                true,
                false
              );
            }
          })
        })
        return false;
      }
      else return true;
      }

      const checkAircraftDuplicate = () =>{
        let dupInd = [];
        aircraftFieldData.forEach((ob,index) => {
        let aircraftID = ob.aircraftTailNumber;
        console.log('aircraftID ::: ',aircraftID)
        let flagIndex = [];
        for(let i = index+1;i<aircraftFieldData.length;i++){
          if(aircraftFieldData[i]["aircraftTailNumber"] == aircraftID){
              flagIndex.push(i);
              flagIndex.push(index);
          }
        }
        dupInd = new Set([...dupInd, ...flagIndex])
      })
      let convertArr = [...dupInd];
      if(convertArr.length) {
        convertArr.forEach(dup => {
          Object.keys(aircraftFieldData[dup]).forEach((fieldName)=> {
            if(fieldName == 'aircraftTailNumber'){
                console.log(' fieldName aircraft ',aircraftFieldData[dup][fieldName])
              validateField(
                fieldName,
                aircraftFieldData[dup][fieldName],
                { [fieldName]: aircraftFieldData[dup][fieldName] },
                dup,
                true,
                'aircraft',
                false,
                true
              );
            }
          })
        })
        return false;
      }
      else return true;
      }

    const saveEnroll = () =>{
        setbtnBusy(true)
        let additionalUserRequest = formFieldData;
        let aircraft = aircraftFieldData;
        const request = {};
        if (additionalUserRequest[0].additionalUserMail === '' && additionalUserRequest[0].additionalUserRole === '' && additionalUserRequest[0].additionalUserLevelAccess === '') {
            additionalUserRequest = [];
        }
        request.json = {...formDataSet, uploadDocsData,saveDocsData,filenames, aircraft, additionalUserRequest }
        request.json.bfAdmin = Storage.getItem('email')
        request.json.timestamp = new Date()
        enrollmentSave(request).then(response =>{
            
            if(response.data.statusCode == 200){
                setbtnBusy(false)
                props.onboard()
            }

        })
    }
    const isDuplicateMail = ()=>{
        let formdataMail = formDataSet['emailId']
        let additionalUser = formFieldData
        let errorObj = formErrors
        let error = formFieldErrors
        let duplicateFlag = true
        additionalUser && additionalUser.length && additionalUser.forEach((item,index)=>{
            if(item.additionalUserMail == formdataMail){
                errorObj.emailId.isValid = false
                errorObj.emailId.activeValidator.errorMessage = ' '
                error[index].additionalUserMail.isValid = false
                error[index].additionalUserMail.activeValidator.errorMessage = " "
                duplicateFlag=false
            }
            formFieldData.forEach((data, i)=>{
                if(data.additionalUserMail == item.additionalUserMail && index!=i){
                    duplicateFlag=false
                    error[index].additionalUserMail.isValid = false
                    error[index].additionalUserMail.activeValidator.errorMessage = " "
                }
            })
        })
        setformErrors(errorObj)
        setFormFieldErrors(error)
        return duplicateFlag

    }
    const onClickSubmit = (e, item, index) => {
        if(item == 'save'){
            if(props.jsondata != null){
                saveEnroll()
            }else{
                const load = {}
                load.emailId = formDataSet.emailId
                duplicatePending(load).then(response=>{
                    if(response.data.accountRegister == "SUCCESS"){
                        saveEnroll()
                    }else{
                        setModalText(operatorSignup.modal[0].errorModal2.paragraph)
                        setScrollPos();
                        setModalShow(true);
                        document.getElementById('root').style.filter = 'blur(5px)';
                        setbtnBusy(false);
                    }
                })
            }
            return;
        }
        if (item === "clear") {
            Storage.removeItem('noOfAircrafts');
            setInitialState(operatorSignup, true);
            setClear('Clear');
        } else if (item === "additionalUserAddNew") {
            handleAddFormSubmit();
        } else if (item === "additionalUserRemove") {
            handleRemoveFormSubmit(e, item, index);
        } else if (item === "aircraftAddNew") {
            handleAircraftSubmit();
        } else if (item === "aircraftRemove") {
            handleAircraftRemove(e, item, index)
        } else if (item === "fileUploadAddNew") {
            handleFileAddSubmit();
        } else if (item === "fileUploadRemove") {
            handleFileFormRemove(e, item, index)
        }

        else {
            //   if(isterms){
            //setModalShow(true)
            setbtnValidate(true)
            const fieldValidationErrors = {
                ...formErrors
            };

            Object.keys(fieldValidationErrors).forEach((fieldName, index) => {
                validateField(
                    fieldName,
                    formDataSet[fieldName],
                    { [fieldName]: formDataSet[fieldName] }
                );
            });
            formFieldData.forEach((val, index) => {
                Object.keys(val).forEach((fieldName) => {
                    validateField(
                        fieldName,
                        formFieldData[index][fieldName],
                        { [fieldName]: formFieldData[index][fieldName] },
                        index,
                        true, 'addUser'
                    );
                })
            })
            
            aircraftFieldData.forEach((val, index) => {
                Object.keys(val).forEach((fieldName) => {
                    validateField(
                        fieldName,
                        aircraftFieldData[index][fieldName],
                        { [fieldName]: aircraftFieldData[index][fieldName] },
                        index,
                        true, 'aircraft'
                    );
                })
            })
            let additionalUserRequest = formFieldData;
            let aircraft = aircraftFieldData;

            // const savejson1 = { ...formDataSet, additionaluser }
            // console.log("savejson1", savejson1)
            
            let isValid = validateForm();
            let duplicateCheck = isDuplicateMail()
            if (isValid  && duplicateCheck ) {
                let isDuplicate= checkDuplicate();
                let isAircraftDuplicate = checkAircraftDuplicate();
                console.log('isAircraft ::: ', isAircraftDuplicate)
                if( isDuplicate && isAircraftDuplicate ){
                    setbtnBusy(true);
                Storage.removeItem('noOfAircrafts');
                if (additionalUserRequest[0].additionalUserMail === '' && additionalUserRequest[0].additionalUserRole === '' && additionalUserRequest[0].additionalUserLevelAccess === '') {
                    additionalUserRequest = [];
                }

                const saveJSON = { ...formDataSet, uploadformDataValue, aircraft, additionalUserRequest }
                delete saveJSON.additionalUserMail
                delete saveJSON.additionalUserRole
                delete saveJSON.additionalUserLevelAccess
                delete saveJSON.aircraftTailNumber
                delete saveJSON.serialNumber
                delete saveJSON.manufacturerName
                delete saveJSON.aircraftModel
                delete saveJSON.maxFuelCapacity
                delete saveJSON.homeBaseAirport
                if(newRowData != null){
                    saveJSON.bfAdmin = Storage.getItem('email')
                }
                saveJSON.mobileNumber = saveJSON.mobileNumber.replace(/\D/g, '')
                saveJSON.companyNumber = saveJSON.companyNumber.replace(/\D/g, '')
                saveJSON.EIN = saveJSON.EIN != null ? saveJSON.EIN.replace(/\D/g, '') : saveJSON.EIN
                saveJSON.fedralTaxExemptId = saveJSON.fedralTaxExemptId != null ? saveJSON.fedralTaxExemptId.replace(/\D/g, '') : saveJSON.fedralTaxExemptId
                saveJSON.organizationType = 'Operator'
                saveJSON.loginUserName = Storage.getItem('email')?Storage.getItem('email'):null
                saveJSON.defaultAccessLevel = 'Level 1 (Admin)';
                let userType = "";
                if (Storage.getItem('jwtToken')) {
                    saveJSON.termsAndCondition = false;
                    userType = "Operator"
                } else {
                    saveJSON.termsAndCondition = true;
                }
                //console.log("json",saveJSON);

                let emailId = encryptData(saveJSON.emailId);

                var html = operatorSignup.emailBody.html
                var loc = html.indexOf(":");
                let nameString = saveJSON.firstName;
                let name = nameString.charAt(0).toUpperCase() + nameString.slice(1);
                var firstString = "Hi " + name + ',';
                var activeLink = process.env.REACT_APP_DOMAIN_URL+"/"+operatorSignup.emailBody.redirectURI + emailId + "&" + userType;
                html = firstString + html.substring(0, loc) + activeLink + html.substring(loc + 1, html.length)
                const emailLoad = {
                    "to": [saveJSON.emailId],
                    "from": operatorSignup.emailBody.fromEmailId,
                    "subject": operatorSignup.emailBody.title,
                    "text": operatorSignup.emailBody.paragraph,
                    "html": html
                }

                operatorSignupSave(saveJSON, selectedFile).then(response => {
                    console.log('response data is ', response.data)
                    let results = response.data;
                        let errorObj = formErrors
                        let error = formFieldErrors
                    // if (response.data != undefined) {
                        if (response.data.accountRegister === "SUCCESS") {
                            setModalText(operatorSignup.modal[0].submitModal.paragraph)
                            setScrollPos();
                            setModalShow(true);
                            document.getElementById('root').style.filter = 'blur(5px)';
                            operatorSendMail(emailLoad)
                            setbtnBusy(false);
                            additionalUserRequest.forEach((item)=>{
                                let html2 = operatorSignup.emailBody.html
                                html2 = "Hi User," + html2.substring(0, loc) + process.env.REACT_APP_BASE_URL + '/' + operatorSignup.emailBody.registrationURI + item.additionalUserMail + html2.substring(loc + 1, html2.length)
                                emailLoad.to = [item.additionalUserMail]
                                emailLoad.html=html2
                                operatorSendMail(emailLoad)
                            })

                    let payload = {"ModuleName":"Operator SignUp",
                    "TabName":"Operator SignUp",
                    "Activity":saveJSON.companyName +" Created",
                    "ActionBy":Storage.getItem('email'),
                    "Role":JSON.parse(Storage.getItem('userRoles')),
                    "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
                    saveAuditLogData(payload, dispatch)
                            
                        }
                        else if (response.data.accountRegister == "FAILED"){
                           let duplicate =  response.data.duplicateUsers
                           duplicate && duplicate.length && duplicate.forEach((user)=>{
                            if(user.userType && user.userType == "User" ){
                                setModalText(operatorSignup.modal[0].errorModal2.paragraph)
                                setScrollPos();
                                errorObj.emailId.isValid = false
                                errorObj.emailId.activeValidator.errorMessage = ' '
                                setformErrors(errorObj)
                                setModalShow(true);
                                document.getElementById('root').style.filter = 'blur(5px)';
                            }
                            if(user.userType && user.userType == "Additional User" ){
                                setModalText(operatorSignup.modal[0].errorModal2.paragraph)
                                setScrollPos();
                                let mail = user.errorReason.split(":")[1]
                                mail = mail.trim()
                                let userData = additionalUserRequest
                                let index = 0
                                userData.forEach((user,i)=>{
                                    if(user.additionalUserMail == mail){
                                        index = i
                                    }
                                })
                                error[index].additionalUserMail.isValid = false
                                error[index].additionalUserMail.activeValidator.errorMessage = " "
                                setModalShow(true);
                                document.getElementById('root').style.filter = 'blur(5px)';
                            }
                           }
                           )
                           setFormFieldErrors(error)
                           setbtnBusy(false);

                        }
                        
                       else if (results.message.includes(saveJSON.companyName)) {
                            setModalText(operatorSignup.modal[0].errorModal3.paragraph)
                            setScrollPos();
                            setModalShow(true);
                            document.getElementById('root').style.filter = 'blur(5px)';
                            setbtnBusy(false);
                        } else if (results.message.includes(saveJSON.emailId)) {
                            console.log(results)
                            setModalText(operatorSignup.modal[0].errorModal2.paragraph)
                            setScrollPos();
                            errorObj.emailId.isValid = false
                            errorObj.emailId.activeValidator.errorMessage = ' '
                            setformErrors(errorObj)
                            setModalShow(true);
                            document.getElementById('root').style.filter = 'blur(5px)';
                            setbtnBusy(false);
                        } else if (results.message.includes('user exists')) {
                            console.log(results)
                            setModalText(operatorSignup.modal[0].errorModal5.paragraph)
                            setScrollPos();
                            console.log(additionalUserRequest)
                            let mail = results.message.split(":")[1]
                            let userData = additionalUserRequest
                            let index = 0
                            let error = formFieldErrors
                            userData.forEach((user,i)=>{
                                if(user.additionalUserMail == mail){
                                    index = i
                                }
                            })
                            error[index].additionalUserMail.isValid = false
                            error[index].additionalUserMail.activeValidator.errorMessage = " "
                            console.log(formFieldErrors)
                            setFormFieldErrors(error)
                            setModalShow(true);
                            document.getElementById('root').style.filter = 'blur(5px)';
                            setbtnBusy(false);
                        } else {
                            setModalText(operatorSignup.modal[0].validateModal.paragraph)
                            setScrollPos();
                            console.log(errorObj)
                            setModalShow(true);
                            document.getElementById('root').style.filter = 'blur(5px)';
                            setbtnBusy(false);
                        }
                    

                })
                }
                 else {
                    setModalText(operatorSignup.modal[0].duplicateModal.paragraph)
                    setScrollPos();
                    setModalShow(true);
                    document.getElementById('root').style.filter = 'blur(5px)';
                 }    
                
            } else {
                if(!isValid){
                    setModalText(operatorSignup.modal[0].validateModal.paragraph)
                    setScrollPos();
                    setModalShow(true);
                    document.getElementById('root').style.filter = 'blur(5px)';
                }
                else if(!duplicateCheck){
                    setModalText("Duplicate entries found. Please check the highlighted entries.");
                    setScrollPos();
                    setModalShow(true);
                    document.getElementById('root').style.filter = 'blur(5px)';
                }
                
                
            }
            //}
        }
    }
    const resetScrollPos = () => {
        window.scrollTo(0, scrollPosition)
    }
    const setScrollPos = () => {
        let scrollpos = window.scrollY;
        setScrollPosition(scrollpos);
        window.scrollTo(0, 0);
    }
    const renderTooltip = (tooltipInfo) => (
        <Tooltip id="button-tooltip" {...tooltipInfo}>
            {tooltipInfo.text}
        </Tooltip>
    );
    const clearStorage = () => {
        Storage.removeItem('noOfAircrafts')
        //Storage.clear();
    };
    const overLayTooltip = (Tooltiptext) => {
        return <OverlayTrigger
            placement="right"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip({ text: Tooltiptext })}
            text={"abcd"}
        >
            <img src={iIcon} tabIndex="0" alt="Tooltip icon" />
        </OverlayTrigger>
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

        formFieldErrors.map((val, index) => {
            Object.keys(val).forEach((fieldname) => {
                if (!formFieldErrors[index][fieldname].isValid) {
                    formValid = formFieldErrors[index][fieldname].isValid;
                    return formValid;
                }
            })
        })
        aircraftFormErrors.map((val, index) => {
            Object.keys(val).forEach((fieldname) => {
                if (!aircraftFormErrors[index][fieldname].isValid) {
                    formValid = aircraftFormErrors[index][fieldname].isValid;
                    return formValid;
                }
            })
        })
        uploadDocsErrors.map((val, index) => {
            Object.keys(val).forEach((fieldname) => {
                if (!uploadDocsErrors[index][fieldname].isValid) {
                    formValid = uploadDocsErrors[index][fieldname].isValid;
                    return formValid;
                }
            })
        })
        return formValid;

    }

    const getOperatorFields = (item, index, flag) => {
        switch (item.component.toUpperCase()) {
            case "PARAGRAPH":
                return (<Row className='mb-3'>

                    <div><b> {item.label}</b></div>
                </Row>)

            case "HEADER":
                return (<Subheading label={item.label} />)
            case "CHECKBOX":
                if (Storage.getItem('jwtToken') && item.id === 'termsAndCondition') {
                    return ('')
                } else {
                    return (<Checkbox Label={item.label} id={item.id} onClick={(e) => onHandleChecked(e, item)} style={item.styles.className} colWidth={item.styles ? item.styles.colWidth : ''} />)
                }


            case "INPUT":

                return (<Input
                    disabled={item.disable}
                    colWidth={item.styles ? item.styles.colWidth : ""}
                    styles={item.styles}
                    Type={item.type}
                    Label={item.label}
                    data-label={item.label}
                    //value={item.label}
                    onkeyDown={true}
                    Placeholder={item.placeholder}
                    callback={item.callback}
                    onselect={(index, item) => onHandleSelect(index, item)}
                    result={results}
                    isRequred={item.isRequired}
                    Name={item.name}
                    handleChange={(e) => onHandleChange(e, item, index, flag)}
                    handleBlur={(e) => onHandleBlur(e, item, index,flag)}
                    formDataSet={formDataSet && formDataSet[item.name] ? formDataSet[item.name] : item.defaultValue ? item.defaultValue : ''}
                    fieldError={
                        formErrors &&
                        formErrors[item.name] && !formErrors[item.name].isValid/* 
                    && (
                        formErrors[item.name].isTouched
                    ) */
                    }
                    errorMessage={
                        formErrors &&
                        formErrors[item.name] && formErrors[item.name]
                            .activeValidator
                            .errorMessage
                    } />)

            case "ASYNCTYPEAHEAD":
                return (
                    <Form.Group as={Col} md={item.styles.colWidth} className={`${ formErrors &&
                        formErrors[item.name] && formErrors[item.name]
                            .activeValidator
                            .errorMessage != null ? 'bf-error-class' : ''
                    } mb-4`} controlId={item.name}
                    >
                        <Form.Label>{item.label} {item.isRequired ? <span className='bf-required'>*</span> : ''}</Form.Label>
                        <AsyncTypeahead
                            filterBy={filterBy}
                            isLoading={isAddress1Loading}
                            defaultInputValue={formDataSet && formDataSet[item.name] ? formDataSet[item.name] : item.defaultValue ? item.defaultValue : ''}
                            minLength={3}
                            id={item.id}
                            label={item.label}
                            name={item.name}
                            useCache={false}
                            inputProps={{
                                name: item.name,
                                maxLength: item.maxLength
                            }}
                            onSearch={searchAPI}
                            onChange={(items) => searchHandler(items)}
                            options={results}
                            placeholder={item.placeholder}
                             onBlur={onAddressSearchBlur}
                              ref={typeaheadRef}
                              selected={address1Selected}
                              onFocus={handleFocus}
                        // renderMenuItemChildren={(option) => (
                        //     <>
                        //     <span>{option}</span>
                        //     </>
                        // )}
                        />
                        {formErrors &&
                        formErrors[item.name] && !formErrors[item.name].isValid &&
                            <div className='d-flex justify-content-end '>
                                <small class="bf-error-message form-text"><span>
                                {formErrors[item.name]
                                    .activeValidator
                                    .errorMessage}
                                    </span></small>
                                </div>
                        }
                    </Form.Group>
                )

            case "SELECT":
                return (<Select
                    colWidth={item.styles ? item.styles.colWidth : ""}
                    Type={item.type}
                    Label={item.label}
                    Placeholder={item.placeholder}
                    dynamicSelect={item.dynamicSelect}
                    lookupReference={item.dynamicSelect ? item.lookupReference : null}
                    isRequred={item.isRequired}
                    Options={item.options}
                    Name={item.name}
                    handleChange={(e) => onHandleChange(e, item, index, flag)}
                    handleBlur={(e) => onHandleBlur(e, item, index, flag)}
                    dependentField={item.dependentField}
                    dependentFieldVal={item.dependentFieldVal}
                    fieldError={
                        formErrors &&
                        formErrors[item.name] && !formErrors[item.name].isValid/* 
                    && (
                        formErrors[item.name].isTouched
                    ) */
                    }
                    errorMessage={
                        formErrors &&
                        formErrors[item.name] && formErrors[item.name]
                            .activeValidator
                            .errorMessage
                    }
                    formDataSet={formDataSet && formDataSet[item.name] ? formDataSet[item.name] : item.defaultValue ? item.defaultValue : ''}
                />)

            case "BUTTON":

                /*if (item.call == "handleAddFormSubmit") {
                    return (<ButtonComponent
                        Label={item.label}
                        Type={item.type}
                        name={item.name}
                        className={item.styles.className}
                        variant={item.variant}
                        disabled={false}
                        id ={item.id}
                        handleClick={(e) => handleAddFormSubmit(e)} />)
                }else if (item.call == "handleCCSubmit") {
                    return (<ButtonComponent
                        Label={item.label}
                        Type={item.type}
                        name={item.name}
                        className={item.styles.className}
                        variant={item.variant}
                        disabled={false}
                        id ={item.id}
                        handleClick={(e) => handleCCSubmit(e)} />)
                }else if (item.call == "handleCCRemove") {
                    return (<ButtonComponent
                        Label={item.label}
                        Type={item.type}
                        name={item.name}
                        className={item.styles.className}
                        variant={item.variant}
                        disabled={false}
                        id ={item.id}
                        handleClick={(e) => handleCCRemove(e)} />)
                } else {
                    return (<ButtonComponent
                        Label={item.label}
                        Type={item.type}
                        className={item.styles.className}
                        variant={item.variant}
                        disabled = {item.disabled&&btnDisable}
                        id ={item.id}
                        handleClick={(e) => onClickSubmit(e, item.label, index)} />)                  
                }*/
                if(!item.shouldNotRender){
                return (<ButtonComponent
                    Label={item.label}
                    Type={item.type}
                    name={item.name}
                    className={item.styles.className}
                    variant={item.variant}
                    disabled={item.disabled && btnDisable}
                    id={item.id}
                    handleClick={(e) => onClickSubmit(e, item.name, index)} />)
                }
            case "LINK":
                if (Storage.getItem('jwtToken') && item.id === 'termanadcondition') {
                    return ('')
                } else {
                    return (<span className={`bf-mrgl40n col-md-${item.styles.colWidth}`}>
                        {item.firstLabel} 
                        <a onClick={() => termsCondition()} className={`bf-trems-link bf-terms-desktop`}>{item.label}</a>
                        <a onClick={() => MobileTermsCondition()} className={`bf-trems-link bf-terms-mobile`}>{item.label}</a>
                    </span>)
                }
        };
    }

    const getOperatorFields3 = (item, index, flag, section) => {
        switch (item.component.toUpperCase()) {
            case "PARAGRAPH":
                return (<Row className='mb-3'>

                    <div><b> {item.label}</b></div>
                </Row>)

            case "HEADER":
                return (<Subheading label={item.label} />)
            case "CHECKBOX":
                if (Storage.getItem('jwtToken') && item.id === 'termsAndCondition') {
                    return ('')
                } else {
                    return (<Checkbox Label={item.label} id={item.id} onClick={(e) => onHandleChecked(e, item, index)} styles={item.styles.className} colWidth={item.styles ? item.styles.colWidth : ''} />)
                }


            case "INPUT":

                return (<Input
                    disabled={item.disable}
                    colWidth={item.styles ? item.styles.colWidth : ""}
                    styles={item.styles}
                    Type={item.type}
                    Label={item.label}
                    data-label={item.label}
                    //value={item.label}
                    onkeyDown={true}
                    Placeholder={item.placeholder}
                    callback={item.callback}
                    onselect={(index, item) => onHandleSelect(index, item)}
                    result={results}
                    isRequred={item.isRequired}
                    Name={item.name}
                    handleChange={(e) => onHandleChange(e, item, index, flag, section)}
                    handleBlur={(e) => onHandleBlur(e, item, index, flag, section)}
                    formDataSet={aircraftFieldData && aircraftFieldData[index][item.name] ? aircraftFieldData[index][item.name] : item.defaultValue ? item.defaultValue : ''}
                    fieldError={
                        aircraftFormErrors &&
                        aircraftFormErrors[index][item.name] && !aircraftFormErrors[index][item.name].isValid
                    }
                    errorMessage={
                        aircraftFormErrors &&
                        aircraftFormErrors[index][item.name] && aircraftFormErrors[index][item.name]
                            .activeValidator
                            .errorMessage
                    } 
                    
                    />)

            case "ASYNCTYPEAHEAD":
                return (
                    <Form.Group as={Col} md={item.styles.colWidth} className="mb-4" controlId={item.name}>
                        <Form.Label>{item.label} {item.isRequired ? <span className='bf-required'>*</span> : ''}</Form.Label>
                        <AsyncTypeahead
                            filterBy={filterBy}
                            isLoading={isAddress1Loading}
                            minLength={3}
                            id={item.id}
                            label={item.label}
                            name={item.name}
                            inputProps={{
                                name: item.name,
                                minLength:5
                            }}
                            onSearch={searchAPI}
                            onChange={(items) => searchHandler(items)}
                            options={results}
                            placeholder={item.placeholder}
                            onBlur={onAddressSearchBlur}
                            ref={typeaheadRef}
                        // renderMenuItemChildren={(option) => (
                        //     <>
                        //     <span>{option}</span>
                        //     </>
                        // )}
                        />
                    </Form.Group>
                )

            case "SELECT":
                return (<Select
                    colWidth={item.styles ? item.styles.colWidth : ""}
                    Type={item.type}
                    Label={item.label}
                    Placeholder={item.placeholder}
                    dynamicSelect={item.dynamicSelect}
                    lookupReference={item.dynamicSelect ? item.lookupReference : null}
                    isRequred={item.isRequired}
                    Options={item.options}
                    Name={item.name}
                    handleChange={(e) => onHandleChange(e, item, flag, section)}
                    handleBlur={(e) => onHandleBlur(e, item, index, flag, section)}
                    dependentField={item.dependentField}
                    dependentFieldVal={item.dependentFieldVal}
                    formDataSet={aircraftFieldData && aircraftFieldData[index][item.name] ? aircraftFieldData[index][item.name] : item.defaultValue ? item.defaultValue : ''}
                    fieldError={
                        aircraftFormErrors &&
                        aircraftFormErrors[index][item.name] && !aircraftFormErrors[index][item.name].isValid
                    }
                    errorMessage={
                        aircraftFormErrors &&
                        aircraftFormErrors[index][item.name] && aircraftFormErrors[index][item.name]
                            .activeValidator
                            .errorMessage
                    } 
                />)

            case "BUTTON":
                return (<ButtonComponent
                    Label={item.label}
                    Type={item.type}
                    name={item.name}
                    className={item.styles.className}
                    variant={item.variant}
                    disabled={item.disabled && btnDisable}
                    id={item.id}
                    handleClick={(e) => onClickSubmit(e, item.name, index)} />)

            case "LINK":
                if (Storage.getItem('jwtToken') && item.id === 'termanadcondition') {
                    return ('')
                } else {
                    return (<span className={`bf-mrgl40n col-md-${item.styles.colWidth}`}>{item.firstLabel} <a onClick={() => termsCondition()} className={`bf-trems-link`}>{item.label}</a></span>)
                }
        };
    }

    const getOperatorFields2 = (item, index, flag, section) => {

        switch (item.component.toUpperCase()) {
            case "PARAGRAPH":
                return (<Row className='mb-3'>

                    <div><b> {item.label}</b></div>
                </Row>)

            case "HEADER":
                return (<Subheading label={item.label} />)
            case "CHECKBOX":
                return (<Checkbox Label={item.label} id={item.id} onClick={(e) => onHandleChecked(e, item)} styles={item.styles} colWidth={item.styles ? item.styles.colWidth : ''} />)

            case "INPUT":

                return (<Input
                    disabled={item.disable}
                    colWidth={item.styles ? item.styles.colWidth : ""}
                    Type={item.type}
                    Label={item.label}
                    data-label={item.label}
                    //value={item.label}
                    Placeholder={item.placeholder}
                    callback={item.callback}
                    autoComplete="off"
                    onselect={(index, item) => onHandleSelect(index, item)}
                    result={results}
                    isRequred={item.isRequired}
                    Name={item.name}
                    handleChange={(e) => onHandleChange(e, item, index, flag, section)}
                    handleBlur={(e) => onHandleBlur(e, item, index, flag, section)}
                    fieldError={
                        formFieldErrors && formFieldErrors.length &&
                        formFieldErrors[index][item.name] && !formFieldErrors[index][item.name].isValid/* 
                        && (
                            formErrors[item.name].isTouched
                        ) */
                    }
                    errorMessage={
                        formFieldErrors && formFieldErrors.length &&
                        formFieldErrors[index][item.name] && formFieldErrors[index][item.name]
                            .activeValidator
                            .errorMessage
                    }
                    formDataSet={formFieldData && formFieldData[index][item.name] ? formFieldData[index][item.name] : item.defaultValue ? item.defaultValue : ''}

                />
                )

            case "SELECT":
                return (<Select
                    colWidth={item.styles ? item.styles.colWidth : ""}
                    Type={item.type}
                    Label={item.label}
                    Placeholder={item.placeholder}
                    dynamicSelect={item.dynamicSelect}
                    lookupReference={item.dynamicSelect ? item.lookupReference : null}
                    isRequred={item.isRequired}
                    tooltip={item.tooltip}
                    Options={item.options}
                    Name={item.name}
                    handleChange={(e) => onHandleChange(e, item, index, flag, section)}
                    handleBlur={(e) => onHandleBlur(e, item, index, flag, section)}
                    dependentField={item.dependentField}
                    dependentFieldVal={item.dependentFieldVal}
                    formDataSet={formFieldData && formFieldData[index][item.name] ? formFieldData[index][item.name] : item.defaultValue ? item.defaultValue : ''}
                    fieldError={
                        formFieldErrors && formFieldErrors.length &&
                        formFieldErrors[index][item.name] && !formFieldErrors[index][item.name].isValid/* 
                        && (
                            formErrors[item.name].isTouched
                        ) */
                    }
                    errorMessage={
                        formFieldErrors && formFieldErrors.length &&
                        formFieldErrors[index][item.name] && formFieldErrors[index][item.name]
                            .activeValidator
                            .errorMessage
                    }
                />)

            case "BUTTON":

                // if (item.call == "handleAddFormSubmit") {
                //     return (<ButtonComponent
                //         Label={item.label}
                //         Type={item.type}
                //         className={item.styles.className}
                //         variant={item.variant}
                //         disabled={false}
                //         id ={item.id}
                //         handleClick={(e) => handleAddFormSubmit(e)} />)
                // }
                // else {
                //     return (<ButtonComponent
                //         Label={item.label}
                //         Type={item.type}
                //         className={item.styles.className}
                //         variant={item.variant}
                //         disabled={false}
                //         id ={item.id}
                //         handleClick={(e) => handleRemoveFormSubmit(e, item, index)} />)
                // }

                return (<ButtonComponent
                    Label={item.label}
                    Type={item.type}
                    name={item.name}
                    className={item.styles.className}
                    variant={item.variant}
                    disabled={false}
                    id={item.id}
                    handleClick={(e) => onClickSubmit(e, item.name, index)} />)

            case "LINK":
                return (<div tabIndex="0" onClick={() => {
                    setScrollPos();
                    setModalShow(true);
                    document.getElementById('root').style.filter = 'blur(5px)';
                }} className={`bf-mrgl40n bf-trems-link col-md-${item.styles.colWidth}`}>{item.label}</div>)
        };

        if (index > 1) {

            setisLoggedIn(false)
        }

    }
    const termsCondition = () => {
        setModalText(operatorSignup.modal[0].termsmodal.paragraph)
        setScrollPos();
        setModalShow(true);
        document.getElementById('root').style.filter = 'blur(5px)';
    }
    const MobileTermsCondition = () => {
        setShowMobileTerms(true);
        getMobileHeaderText(dispatch, "Operator Sign Up");
    }
    const HandleMobileTerms = (result) => {
        setShowMobileTerms(false);
        setTimeout(()=>{
            document.getElementById('termsAndCondition').checked = result;
        },10)
        setbtnDisable(!result)
        getMobileHeaderText(dispatch, "Sign Up");
    }
    const getOperatorFieldsSupport = (item, index, flag, section) => {

        switch (item.component.toUpperCase()) {
            case "PARAGRAPH":
                return (<Row className='mb-3'>
                    <div><b>{item.label}</b></div>
                </Row>)

            case "HEADER":
                return (<Subheading label={item.label} />)
            case "CHECKBOX":
                return (<Checkbox Label={item.label} id={item.id} onClick={(e) => onHandleChecked(e, item)} colWidth={item.styles ? item.styles.colWidth : ''} />)

            case "INPUT":
                if(item.name == "DocumentUpload") {
                return (<Input
                    disabled={item.disable}
                    colWidth={item.styles ? item.styles.colWidth : ""}
                    Type={item.type}
                    Label={item.label}
                    data-label={item.label}
                    value={item.label}
                    Placeholder={item.placeholder}
                    callback={item.callback}
                    result={results}
                    clear={clear}
                    isRequred={item.isRequired}
                    Name={item.name}
                    uploadStatus={uploadDocumentMsg[index]}
                    handleChange={(e) => onHandleSelectFile(e, item, flag, index, section)}
                    fieldError={
                        uploadDocsErrors && uploadDocsErrors.length&&
                        uploadDocsErrors[index][item.name] && !uploadDocsErrors[index][item.name].isValid
                    }
                    errorMessage={
                        uploadDocsErrors  && uploadDocsErrors.length&&
                        uploadDocsErrors[index][item.name] && uploadDocsErrors[index][item.name]
                        .activeValidator
                            .errorMessage
                    }
                    Accept={item.accept}
                    multiple={true}
                    formPlaceholder = {uploadDocsData && uploadDocsData[index][item.name] && uploadDocsData[index][item.name].name ? uploadDocsData[index][item.name].name : uploadDocsData[index][item.name]}
                    />
                )} else {
                    return (<Input
                        disabled={item.disable}
                        colWidth={item.styles ? item.styles.colWidth : ""}
                        Type={item.type}
                        Label={item.label}
                        data-label={item.label}
                        value={item.label}
                        Placeholder={item.placeholder}
                        callback={item.callback}
                        onselect={(index, item) => onHandleSelect(index, item)}
                        result={results}
                        isRequred={item.isRequired}
                        Name={item.name}
                        handleChange={(e) => onHandleChange(e, item, index, flag, section)}
                        handleBlur={(e) => onHandleBlur(e, item, index, flag, section)}
                        fieldError={
                            uploadDocsErrors && uploadDocsErrors.length&&
                        uploadDocsErrors[index][item.name] && !uploadDocsErrors[index][item.name].isValid
                        }
                        errorMessage={
                            uploadDocsErrors  && uploadDocsErrors.length&&
                        uploadDocsErrors[index][item.name] && uploadDocsErrors[index][item.name]
                        .activeValidator
                            .errorMessage
                        }
                        formDataSet = {uploadDocsData && uploadDocsData[index][item.name] ? uploadDocsData[index][item.name] : item.defaultValue ? item.defaultValue : ''}
    
                />
                )
                    }
            case "BUTTON":

                return (<ButtonComponent
                    Label={item.label}
                    Type={item.type}
                    className={item.styles.className}
                    variant={item.variant}
                    disabled={false}
                    handleClick={(e) => onClickSubmit(e, item.name, index)} />)

            // if (item.call == "handleFileAddSubmit") {
            //     return (<ButtonComponent
            //         Label={item.label}
            //         Type={item.type}
            //         className={item.styles.className}
            //         variant={item.variant}
            //         id={item.id}
            //         disabled={false}
            //         handleClick={(e) => handleFileAddSubmit(e)} />)
            // }
            // if (item.call == "handleFileFormRemove") {


            //     return (<ButtonComponent
            //         Label={item.label}
            //         Type={item.type}
            //         className={item.styles.className}
            //         variant={item.variant}
            //         disabled={false}
            //         handleClick={(e) => handleFileFormRemove(e, item, index)} />)
            // }

            case "LINK":
                return (<div tabIndex="0" onClick={() => {
                    setModalText(operatorSignup.modal[0].terms.title); setModalText(operatorSignup.modal[0].terms.paragraph); setScrollPos();
                    setModalShow(true);
                    document.getElementById('root').style.filter = 'blur(5px)';
                }} className={`bf-mrgl40n bf-trems-link col-md-${item.styles.colWidth}`}>{item.label}</div>)
        };

        if (index > 1) {

            setissupport(false)
        }

    }
    const getOperatorFieldsCC = (item, index, flag) => {

        switch (item.component.toUpperCase()) {
            case "PARAGRAPH":
                return (<Row className='mb-3'>

                    <div><b> {item.label}</b></div>
                </Row>)

            case "HEADER":
                return (<Subheading label={item.label} />)
            case "CHECKBOX":
                return (<Checkbox Label={item.label} id={item.id} onClick={(e) => onHandleChecked(e, item)} colWidth={item.styles ? item.styles.colWidth : ''} />)

            case "INPUT":

                return (<Input
                    disabled={item.disable}
                    colWidth={item.styles ? item.styles.colWidth : ""}
                    Type={item.type}
                    Label={item.label}
                    data-label={item.label}
                    value={item.label}
                    Placeholder={item.placeholder}
                    callback={item.callback}
                    onselect={(index, item) => onHandleSelect(index, item)}
                    result={results}
                    isRequred={item.isRequired}
                    Name={item.name}
                    handleChange={(e) => onHandleChange(e, item, index, flag)}
                    handleBlur={(e) => onHandleBlur(e, item, index, flag)}
                    Accept={item.accept}
                />
                )
            case "BUTTON":
                if (item.call == "handleFileAddSubmit") {
                    return (<ButtonComponent
                        Label={item.label}
                        Type={item.type}
                        className={item.styles.className}
                        variant={item.variant}
                        id={item.id}
                        disabled={false}
                        handleClick={(e) => handleFileAddSubmit(e)} />)
                }
                if (item.call == "handleFileFormRemove") {


                    return (<ButtonComponent
                        Label={item.label}
                        Type={item.type}
                        className={item.styles.className}
                        variant={item.variant}
                        disabled={false}
                        handleClick={(e) => handleFileFormRemove(e, item, index)} />)
                }

            case "LINK":
                return (<div tabIndex="0" onClick={() => {
                    setModalText(operatorSignup.modal[0].terms.title); setModalText(operatorSignup.modal[0].terms.paragraph); setScrollPos();
                    setModalShow(true);
                    document.getElementById('root').style.filter = 'blur(5px)';
                }} className={`bf-mrgl40n bf-trems-link col-md-${item.styles.colWidth}`}>{item.label}</div>)
        };

        if (index > 1) {

            setissupport(false)
        }

    }

    const getSaveButton=(item,index)=>{
        switch (item.component.toUpperCase()) {
            case "BUTTON":
                return (<ButtonComponent
                    Label={item.label}
                    Type={item.type}
                    name={item.name}
                    className={item.styles.className}
                    variant={item.variant}
                    disabled={false}
                    id={item.id}
                    handleClick={(e) => onClickSubmit(e, item.name, index)} />)
        }
    }

    const getOperatorFieldsAircraft = (item, index, flag) => {

        switch (item.component.toUpperCase()) {
            case "PARAGRAPH":
                return (<Row className='mb-3'>

                    <div><b> {item.label}</b></div>
                </Row>)

            case "HEADER":
                return (<Subheading label={item.label} />)
            case "CHECKBOX":
                return (<Checkbox Label={item.label} id={item.id} onClick={(e) => onHandleChecked(e, item)} colWidth={item.styles ? item.styles.colWidth : ''} />)

            case "INPUT":

                return (<Input
                    disabled={item.disable}
                    colWidth={item.styles ? item.styles.colWidth : ""}
                    Type={item.type}
                    Label={item.label}
                    data-label={item.label}
                    value={item.label}
                    Placeholder={item.placeholder}
                    callback={item.callback}
                    onselect={(index, item) => onHandleSelect(index, item)}
                    result={results}
                    isRequred={item.isRequired}
                    Name={item.name}
                    handleChange={(e) => onHandleChange(e, item, index, flag)}
                    handleBlur={(e) => onHandleBlur(e, item, index, flag)}
                    fieldError={
                        formFieldAVErrors && formFieldAVErrors.length &&
                        formFieldAVErrors[index][item.name] && !formFieldAVErrors[index][item.name].isValid/* 
                        && (
                            formErrors[item.name].isTouched
                        ) */
                    }
                    errorMessage={
                        formFieldAVErrors && formFieldAVErrors.length &&
                        formFieldAVErrors[index][item.name] && formFieldAVErrors[index][item.name]
                            .activeValidator
                            .errorMessage
                    }

                />
                )
            case "BUTTON":
                if (item.call == "handleAircraftSubmit") {
                    return (<ButtonComponent
                        Label={item.label}
                        Type={item.type}
                        className={item.styles.className}
                        variant={item.variant}
                        disabled={false}
                        id={item.id}
                        handleClick={(e) => handleAircraftSubmit(e)} />)
                }
                if (item.call == "handleAircraftRemove") {


                    return (<ButtonComponent
                        Label={item.label}
                        Type={item.type}
                        className={item.styles.className}
                        variant={item.variant}
                        disabled={false}
                        handleClick={(e) => handleAircraftRemove(e, item, index)} />)
                }

            case "LINK":
                return (<div tabIndex="0" onClick={() => {
                    setModalText(operatorSignup.modal[0].terms.title); setModalText(operatorSignup.modal[0].terms.paragraph); setScrollPos();
                    setModalShow(true);
                    document.getElementById('root').style.filter = 'blur(5px)';
                }} className={`bf-mrgl40n bf-trems-link col-md-${item.styles.colWidth}`}>{item.label}</div>)
        };

        if (index > 1) {

            setisaircraft(false)
        }

    }
    return (<>
        {isBusy ? (<Loader />) : (


            <div className={`d-flex d-flex-row login-section bf-operator-enrollment-section bf-operator-signup-mobile-section signup-section ${modalShow ? 'bf-show-model-blr' : ''} ${newRowData || loggedinUserType? 'bf-dashboard-signup' : ''}`}>
                <div className={`${newRowData || loggedinUserType ? '' : 'w-70p '}operator-form d-flex d-flex-column `}>
                { addNewCompany || loggedinUserType  ? null :<>
                    <div className="d-flex d-flex-row align-item-center justify-content-between bf-menu-header">
                        <Nav.Link href={Storage.getItem('jwtToken') == null ? "./" : './admin' } onClick={() => clearStorage()}>
                            <img src={logo} alt="Barrel Fuel Logo" className='login-logo' />
                        </Nav.Link>
                        <Nav.Link href={Storage.getItem('jwtToken') == null ? "./" : './admin' } onClick={() => clearStorage()}>Home</Nav.Link>
                    </div>
                    <MobileHeader name="Sign Up" />
                    </>}
                    {!showMobileTerms && 
                    <Form autoComplete="off" className={Storage.getItem('jwtToken') == null ? 'bf-operator-signup-form' : ''}>
                        <h1 className='d-flex align-items-center bf-heading bf-relative'>
                        <Nav.Link href="./signup" className='bf-mobile-back-nav-acc'>
                            <img src={CollapseMenuIcon} />
                        </Nav.Link> 
                        {operatorSignup && operatorSignup.headline.label}</h1>
                        
                        {operatorSignup && operatorSignup.sections.map((section, sectionIndex) => {
                            return (

                                section.subSections.map((item) => (

                                    <>
                                        <div className={`${newRowData || loggedinUserType? 'bf-dashboard-signup-body' : ''}`}>
                                            <div className='bf-no-of-aircraft'>
                                                <Row className='bf-aircraft-number'>
                                                    {item.fields.map((field) => (
                                                        getOperatorFields(field, false)
                                                    ))}
                                                </Row>
                                                <Accordion defaultActiveKey={['0']} alwaysOpen className='operator-accorion'>
                                                        <Accordion.Item eventKey="0">
                                                            <Accordion.Header><span>{operatorSignup.accordianHeading.admin}</span></Accordion.Header>
                                                            <Accordion.Body>
                                                                <Row className='mb-3'>
                                                                    {item.administratorDetails.map((field) => (
                                                                        getOperatorFields(field, false)
                                                                    ))}

                                                                </Row>
                                                            </Accordion.Body>
                                                        </Accordion.Item>
                                                        <Accordion.Item eventKey="1">
                                                            <Accordion.Header><span>{operatorSignup.accordianHeading.additionalUser}</span></Accordion.Header>
                                                            <Accordion.Body>
                                                                {/* <Row className='mb-3'>
                                                                    {item.additionalUser.map((field) => (

                                                                        field.fields.map((field) => (

                                                                            getOperatorFields(field, false)
                                                                        ))
                                                                    ))}

                                                                </Row> */}


                                                                {/* //*/}
                                                                {item.additionalUser.map((field, index) => (
                                                                    <Row className='bf-mrgb-0'>
                                                                        {
                                                                            field.fields.map((field) => {
                                                                                if (field.type != "button")
                                                                                    return getOperatorFields2(field, index, true, 'addUser')
                                                                            })
                                                                        }
                                                                        <Row className='bf-buttons-section'> {

                                                                            field.fields.map((field) => {
                                                                                if (field.type == "button") {
                                                                                    if ((operatorSignup.sections[0].subSections[0].additionalUser && operatorSignup.sections[0].subSections[0].additionalUser.length == 1 && index == 0 && field.name == "additionalUserRemove") ||
                                                                                        (operatorSignup.sections[0].subSections[0].additionalUser && ((operatorSignup.sections[0].subSections[0].additionalUser.length - 1) != index) && field.name == "additionalUserAddNew")) { }
                                                                                    else return getOperatorFields2(field, index, true, 'addUser')
                                                                                    //return getOperatorFields2(val,index,true)
                                                                                }
                                                                            })

                                                                        }
                                                                        </Row>
                                                                    </Row>))}
                                                            </Accordion.Body>
                                                        </Accordion.Item>
                                                        <Accordion.Item eventKey="2">
                                                            <Accordion.Header><span>{operatorSignup.accordianHeading.company}</span></Accordion.Header>
                                                            <Accordion.Body>
                                                                <Row className='mb-3'>
                                                                    {item.companyDetails.map((field) => (

                                                                        field.fields.map((field) => (

                                                                            getOperatorFields(field, false)
                                                                        ))
                                                                    ))}

                                                                </Row>
                                                            </Accordion.Body>
                                                        </Accordion.Item>
                                                        <Accordion.Item eventKey="3">
                                                            <Accordion.Header><span>{operatorSignup.accordianHeading.aircraft}</span></Accordion.Header>
                                                            <Accordion.Body>

                                                                {item.aircraftInformation.map((field, index) => (
                                                                    <Row className='bf-mrgb-0'>
                                                                        {
                                                                            field.fields.map((field) => {
                                                                                if (field.type != "button")
                                                                                    return getOperatorFields3(field, index,true, 'aircraft')
                                                                            })
                                                                        }
                                                                        <Row className='mb-3 bf-buttons-section'>{
                                                                            field.fields.map((field) => {
                                                                                if (field.type == "button") {
                                                                                    if ((operatorSignup.sections[0].subSections[0].aircraftInformation && operatorSignup.sections[0].subSections[0].aircraftInformation.length == 1 && index == 0 && field.name == "aircraftRemove") ||
                                                                                        (operatorSignup.sections[0].subSections[0].aircraftInformation && ((operatorSignup.sections[0].subSections[0].aircraftInformation.length - 1) != index) && field.name == "aircraftAddNew")) { }
                                                                                    else return getOperatorFields3(field, index,true, 'aircraft')
                                                                                }
                                                                            }

                                                                            )}
                                                                        </Row>
                                                                    </Row>))}
                                                            </Accordion.Body>
                                                        </Accordion.Item>
                                                        <Accordion.Item eventKey="4">
                                                            <Accordion.Header><span>{operatorSignup.accordianHeading.document.txt}<span className='bf-acc-smlhead'>{operatorSignup.accordianHeading.document.txt2}</span></span></Accordion.Header>
                                                            <Accordion.Body id="bf-upload-docs-sec">

                                                                {/* {issupport
                                                                    ? <Row className='mb-3'>
                                                                        {item.uploadDocument.map((field, index) => (
                                                                            <Row className='mb-3 bf-add-new row  '>
                                                                                {field.fields.map((field) => (
                                                                                    getOperatorFieldsSupport(field, index, true)
                                                                                ))}


                                                                            </Row>


                                                                        ))}
                                                                    </Row>
                                                                    : <Row className='mb-3d bf-add-new' >

                                                                        {item.uploadDocument.map((field, index) => (
                                                                            <Row className='mb-3 sd' id={index}>
                                                                                {field.fields.map((field) => (
                                                                                    getOperatorFieldsSupport(field, index, true)
                                                                                ))}
                                                                            </Row>
                                                                        ))}
                                                                    </Row>
                                                                } */}

                                                                {item.uploadDocument.map((field, index) => (
                                                                    <Row className='bf-mrgb-0'>
                                                                        {
                                                                            field.fields.map((field) => {
                                                                                if (field.type != "button")
                                                                                    return getOperatorFieldsSupport(field, index, true, 'uploadDocs')
                                                                            })
                                                                        }
                                                                        <Row className='bf-buttons-section'>{
                                                                            field.fields.map((field) => {
                                                                                if (field.type == "button") {
                                                                                    if ((operatorSignup.sections[0].subSections[0].uploadDocument && operatorSignup.sections[0].subSections[0].uploadDocument.length == 1 && index == 0 && field.name == "fileUploadRemove") ||
                                                                                        (operatorSignup.sections[0].subSections[0].uploadDocument && ((operatorSignup.sections[0].subSections[0].uploadDocument.length - 1) != index) && field.name == "fileUploadAddNew")) { }
                                                                                    else return getOperatorFieldsSupport(field, index, true, 'uploadDocs')
                                                                                }
                                                                            }

                                                                            )}
                                                                        </Row>
                                                                    </Row>))}

                                                                {/* <Row className='mb-3'>
                                                                    {item.uploadDocument.map((field) => (
                                                                        <Row className='mb-3'>{
                                                                            field.fields.map((field) => (

                                                                                getOperatorFields(field, false)
                                                                            ))}
                                                                        </Row>
                                                                    ))}

                                                                </Row> */}
                                                            </Accordion.Body>
                                                        </Accordion.Item>
                                                        <Accordion.Item eventKey="5">
                                                            <Accordion.Header><span>{operatorSignup.accordianHeading.payment}<span className='bf-acc-smlhead'>{operatorSignup.accordianHeading.document.txt2}</span></span></Accordion.Header>
                                                            {/* <Accordion.Body>
                                                                <Row className='mb-3'>
                                                                    {item.cardSignup.map((field) => (

                                                                        field.fields.map((field) => (

                                                                            getOperatorFieldsCC(field, false)
                                                                        ))
                                                                    ))}

                                                                </Row>
                                                            </Accordion.Body> */}

                                                        </Accordion.Item>

                                                </Accordion>
                                            </div>    
                                        </div>
                                        <Row className={`${newRowData || loggedinUserType? 'bf-dashboard-signup-buttons' : 'bf-operator-signup-buttons-container' } mt-2 mb-3`}>
                                            {isBtnBusy ? (<Loader height='auto' />) : 
                                            (!newRowData || !loggedinUserType? 
                                                (<>
                                                <div className='d-flex bf-terms-section'>
                                                    {item.primaryButton.map((field, index) => {
                                                        if(field.id == 'termanadcondition' || field.id == 'termsAndCondition') {
                                                            return  (getOperatorFields(field, index, false))
                                                        }
                                                    })}
                                                </div>
                                                <div className='d-flex'>
                                                    {item.primaryButton.map((field, index) => {
                                                        if(field.id != 'termanadcondition' && field.id != 'termsAndCondition') {
                                                            return  (getOperatorFields(field, index, false))
                                                        }
                                                    })}
                                                </div>
                                                </>)
                                                :
                                                (<>
                                                {item.saveImplement && item.saveImplement.map((field, index) => (
                                                    (!field.call) ?
                                                        getSaveButton(field)
                                                    : 
                                                    getOperatorFields(field, index, false)
                                                ))}
                                                </>)
                                            )
                                            }

                                        </Row>
                                    </>
                                        

                                ))


                            )

                        }
                        )}

                        <CustomModal
                            className="bf-mrgt20i"
                            show={modalShow}
                            close={() => closed()}
                            onHide={() => accept()}
                            hide={() => closeModal()}
                            title={modalText === operatorSignup.modal[0].termsmodal.paragraph ? operatorSignup.modal[0].termsmodal.title : ''}
                            size={modalText === operatorSignup.modal[0].termsmodal.paragraph ? "lg" : ''}
                            modelBodyContent={modalText}
                            buttonText={modalText === operatorSignup.modal[0].termsmodal.paragraph ? operatorSignup.modal[0].termsmodal.primaryButton.text : operatorSignup.modal[0].submitModal.primaryButton.text}
                            secondbutton={modalText === operatorSignup.modal[0].termsmodal.paragraph ? operatorSignup.modal[0].termsmodal.secondaryButton.text : ''}
                        />

                    </Form>
                    }
                    {addNewCompany || loggedinUserType ? null :
                        <>{showMobileTerms && 
                        <div className='bf-signup-termsandconditions'>
                            <h1 className='d-flex align-items-center bf-heading bf-relative'>
                                <span onClick={() => HandleMobileTerms(false)} className='bf-mobile-back-nav-acc'>
                                    <img src={CollapseMenuIcon} />
                                </span> 
                                {operatorSignup.modal[0].termsmodal.title}
                            </h1>
                            <div className="bf-terms-section">
                                {parse(operatorSignup.modal[0].termsmodal.paragraph)}
                            </div>
                            <div>
                                <ButtonComponent 
                                Label={operatorSignup.modal[0].termsmodal.primaryButton.text}
                                Type={'button'}
                                variant={"primary"}
                                disabled={false}
                                className={"bf-btn-primary bf-btn-left bf-btn-imp"}
                                handleClick={(e) => HandleMobileTerms(true)} />
                                <ButtonComponent 
                                Label={operatorSignup.modal[0].termsmodal.secondaryButton.text}
                                Type={'button'}
                                variant={"primary"}
                                disabled={false}
                                className={"bf-btn-clear bf-btn-left bf-btn-imp"}
                                handleClick={(e) => HandleMobileTerms(false)} />
                            </div>
                        </div>}
                        </>
                    }
                    <div className='d-flex align-tems-center justify-content-center bf-mrgt20i'>
                    </div>
                </div>
                { addNewCompany || loggedinUserType ? null :
                <div className='d-flex bg-image-container w-30p'>
                    <div className='d-flex d-flex-column bf-login-right-sec'>
                        {
                            operatorSignup && operatorSignup.aviationFacts &&
                            <AviationFacts facts={operatorSignup.aviationFacts} />
                        }
                    </div>
                </div>
}
            </div>

        )}
    </>);
}

export default OperatorSignupForm;