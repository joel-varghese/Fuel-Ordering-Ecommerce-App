import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import React, { useState, useEffect, useRef } from 'react';
import Row from 'react-bootstrap/Row';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import ButtonComponent from '../button/button';
import logo from '../../assets/images/barrel_fuel_logo.png'
import './fboSignup.scss';
import Input from '../input/input';
import Select from '../select/select';
import { bfaJsonService } from '../../actions/BFAServices/BFAJsonService';
import { registerFBOService, operatorFboSendMail, insertFBODefaultFuelPrice, getAddressFromAcukwik } from '../../actions/OperatorFboService/operatorFboService';
import CustomModal from '../customModal/customModal';
import '../../assets/styles/accordion-styles.scss';
import Accordion from 'react-bootstrap/Accordion';
import Checkbox from '../checkbox/checkbox';
import Nav from 'react-bootstrap/Nav';
import { einValidation, phoneValidation, zipValidation } from '../../controls/validations';
import Tooltip from 'react-bootstrap/Tooltip';
import iIcon from '../../assets/images/info-icon.png';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import parse from 'html-react-parser';
import { addressValidationService } from '../../actions/searchService/search';
import { searchAddress } from '../../actions/searchService/search'
import Loader from '../loader/loader';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import AviationFacts from '../aviationFacts/aviationFacts';
import { stateMapper } from '../stateMapper';
import { duplicatePending, enrollmentSave } from '../../actions/accountEnrollService/accountEnrollService';
import { Storage, jsonStringify } from '../../controls/Storage';
import Dashboard from '../dashboard/index';
import MultiSelectCheckbox from '../multiSelect/multiSelectCheckbox';
import { getFBONamesList } from '../../actions/fboCompany/companyNameAction';
import { useDispatch, useSelector } from 'react-redux';
import { encryptData } from '../../services/commonServices';
import {saveAuditLogData } from '../../actions/auditLog/auditLogActions';

function FboSignupForm(props) {

    let navigate = useNavigate();
    const [fboEnrollData, setfboEnrollData] = useState({});
    const [formDataSet, setformDataSet] = useState({});
    const [formErrors, setformErrors] = useState({});
    const [modalShow, setModalShow] = useState(false);
    const [modalText, setModalText] = useState("");
    const [isBusy, setBusy] = useState(true);
    const [isFboMembershipChecked, setFboMembership] = useState(false);
    const [isSameAsCompanyAdderss, setSameAsCompanyAdderss] = useState(false);
    const payload = { "blobname": process.env.REACT_APP_READ_FBO_SIGNUP_FORM_BLOBNAME }
    const [isBtnValidate, setbtnValidate] = useState(false);
    const [results, setResults] = useState({});
    const [fboresults, setFboResults] = useState({});
    const [fullresults, setFullResults] = useState({});
    const [indexvalue, setindexvalue] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [address, setaddress] = useState([]);
    const [isBtnBusy, setbtnBusy] = useState(false);
    const [address1Selected, setAddress1Selected] = useState([]);
    const [isAddress1Loading, setAddress1Loading] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(false);
    const [isFBOLoading, setFBOLoading] = useState(false);
    const [addressOptions, setAddressOptions] = useState([]);
    const [scrollPosition, setScrollPosition] = useState();
    let [resetvalue, setResetValue] = useState();
    const [addAirport, setAddAirport] = useState(false);
    const [addBank, setAddBank] = useState(false);
    const typeaheadRef = useRef(null);
    const [airportErrors, setAirportErrors] = useState([]);
    const [airportData, setAirportData] = useState([]);
    let melissaEndpointURI = process.env.REACT_APP_MELISSA_ENDPOINT
    let melissaTopRecords = process.env.REACT_APP_MELISSA_TOP_RECORDS
    let companyData = [];


    let addressdata = []
    let fulladdressdata = []
    let isaddressvalid = true;
    let detailsAreCorrect;
    const { state } = useLocation();
    const dispatch = useDispatch()

    const commonReducer = useSelector((state) => state.commonReducer);
    const loggedinUserType = commonReducer?.loggedInUserType?.data;
    let newRowData = state && state.rowdata && state.rowdata !== null ? state.rowdata : props.rowdata
    let addNewCompany = state && state.addNewCompany && state.addNewCompany !== null ? state.addNewCompany : props.addNewCompany
    useEffect(() => {
        bfaJsonService(payload).then(response => {
            setfboEnrollData(response.data.fboEnrollData)
            setBusy(false);
            setResults(addressdata)
            setInitialState(response.data.fboEnrollData, false, true);
        })
        setFboResults(companyData)
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
                setAddress1Loading(false);

            }).catch((err) => {
                setAddress1Loading(false);
            });

    }
    const onAddressSearchBlur = (evt) => {
        let formData = { ...formDataSet };
        let errorData = { ...formErrors };
        if (evt.target.value != '') {
            if (!Array.isArray(address1Selected)) {
                if (address1Selected == '' && (resetvalue != '' && evt.target.value == resetvalue[0])) {
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
        if (formErrors['addressLine1'] && formErrors['addressLine1'].activeValidator.errorMessage != null) {
            validateField('addressLine1', evt.target.value,
                { ['addressLine1']: evt.target.value })
        }
    }
    const handleFocus = () => {
        setResetValue(address1Selected);
        setAddress1Selected('');
    }
    const searchHandler = (items, dummy) => {
        try {
            let formData = { ...formDataSet };
            let errorData = { ...formErrors };
            let address = items[0];
            let addressArr = address.split(',')
            let stateAndzip = addressArr[2].split(' ')
            let cityName = addressArr[1].trim();

            let fullAddress = fullresults.filter((item) => item.Address == address)[0];
            let country = fullAddress.CountryName == '' ? 'United States' : fullAddress.CountryName.replace(' Of America', '')
            setAddress1Selected([fullAddress.Address1])
            document.getElementsByName("zip")[0].value = stateAndzip[2]//fullresults[0].PostalCode
            document.getElementsByName("city")[0].value = cityName//fullresults[0].Locality
            document.getElementsByName("stateName")[0].value = stateMapper[stateAndzip[1]]//fullresults[0].AdministrativeArea
            document.getElementsByName("countryName")[0].value = fullresults[0].country

            //formData["addressLine2"] = fullresults[0].Address2
            formData["addressLine1"] = addressArr[0]//fullresults[0].Address1
            formData["zip"] = stateAndzip[2]//fullresults[0].PostalCode
            formData["city"] = cityName // fullresults[0].Locality
            formData["stateName"] = stateAndzip[1] //fullresults[0].AdministrativeArea
            formData["countryName"] = country;

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
        } catch (err) {
            console.error(' unexpected error caught in fbo address search')
        }
    }

    const filterBy = () => true;

    const setInitialState = (fboData, clear, flag) => {
        const formData = {};
        let formErrors = {};
        let airportFormDetails = [];
        let airportErrDetails = {};
        let airportError = [];
        let airportDetails = {};
        const fieldTypeArr = ['input', 'select', 'Checkbox', 'asynctypeahead', 'multiselectcheckbox', 'asynctypecompany'];

        fboData && fboData.sections[0].adminDetailsSection[0].fields.forEach((item) => {
            if (fieldTypeArr.includes(item.component.toLowerCase())) {
                formData[item.name] = clear ? (item.defaultValue ? item.defaultValue : "") : formDataSet && formDataSet[item.name] ? formDataSet[item.name] : item.defaultValue ? item.defaultValue : "";
                formErrors[item.name] = getFormErrorRules(item);
            }
        })

        fboData && fboData.sections[0].companyDetailsSection[0].fields.forEach((item) => {
            if (fieldTypeArr.includes(item.component.toLowerCase())) {
                formData[item.name] = clear ? (item.defaultValue ? item.defaultValue : "") : formDataSet && formDataSet[item.name] ? formDataSet[item.name] : item.defaultValue ? item.defaultValue : "";
                formErrors[item.name] = getFormErrorRules(item);
                if (clear) {
                    setAddress1Selected('');
                    typeaheadRef.current.clear();
                }
            }
        })
        if (props.jsondata && props.jsondata.hasOwnProperty('airportDetails') && props.jsondata.airportDetails.length > 1 && flag) {
            for (var i = 1; i < props.jsondata.airportDetails.length; i++) {
                let usedField = fboData.sections[0].airportLocationSection; //operatorSignup.sections[0].subSections[0].additionalUser
                const addNewFiled = {}
                const temp = JSON.parse(JSON.stringify(fboData.sections[0].airportLocationSection[usedField.length - 1].fields));

                addNewFiled['fields'] = temp
                fboData.sections[0].airportLocationSection.push(addNewFiled);
            }
        }
        fboData && fboData.sections[0].airportLocationSection.forEach((item, index) => {
            item.fields.forEach((item) => {
                if (fieldTypeArr.includes(item.component.toLowerCase())) {
                    airportDetails[item.name] = clear ? "" : airportData && airportData.length > index ? airportData[index][item.name] : item.defaultValue ? item.defaultValue : "";
                    airportErrDetails[item.name] = getFormErrorRules(item);
                    if (clear) { }
                    else { airportErrDetails = { ...setPrevActiveValidator(airportErrDetails, item, index) } };
                }
            })
            if (props.jsondata && props.jsondata.airportDetails != null && clear == false && flag) {
                item.fields.forEach((item) => {
                    if (fieldTypeArr.includes(item.component.toLowerCase())) {
                        airportDetails[item.name] = props.jsondata.airportDetails[index][item.name] ? props.jsondata.airportDetails[index][item.name] : "";
                    }
                })
            }
            airportFormDetails.push(JSON.parse(JSON.stringify(airportDetails)));
            airportError.push(JSON.parse(JSON.stringify(airportErrDetails)));
        })
        fboData && fboData.sections[0].bankInformationSection[0].fields.forEach((item) => {
            if (fieldTypeArr.includes(item.component.toLowerCase())) {
                formData[item.name] = clear ? (item.defaultValue ? item.defaultValue : "") : formDataSet && formDataSet[item.name] ? formDataSet[item.name] : item.defaultValue ? item.defaultValue : "";
                formErrors[item.name] = getFormErrorRules(item);
            }
        })
        fboData && fboData.sections[0].fboMemberShipSection[0].fields.forEach((item) => {
            if (fieldTypeArr.includes(item.component.toLowerCase())) {
                formData[item.name] = clear ? (item.defaultValue ? item.defaultValue : "") : formDataSet && formDataSet[item.name] ? formDataSet[item.name] : item.defaultValue ? item.defaultValue : "";
                formErrors[item.name] = getFormErrorRules(item);
            }
        })

        fboData && fboData.sections[0].paymentSection[0].fields.forEach((item) => {
            if (fieldTypeArr.includes(item.component.toLowerCase())) {
                formData[item.name] = clear ? (item.defaultValue ? item.defaultValue : "") : formDataSet && formDataSet[item.name] ? formDataSet[item.name] : item.defaultValue ? item.defaultValue : "";
                formErrors[item.name] = getFormErrorRules(item);
            }
        })
        if (newRowData != null && clear == false) {
            fboData.sections[0].primaryButton[2].shouldNotRender = false
            fboData && fboData.sections[0].adminDetailsSection[0].fields.forEach((item) => {
                if (fieldTypeArr.includes(item.component.toLowerCase())) {
                    formData[item.name] = newRowData[item.name] ? newRowData[item.name] : formData[item.name];
                }
            })

            fboData && fboData.sections[0].companyDetailsSection[0].fields.forEach((item) => {
                // console.log(' item.name ::: ', item.name)
                // if (item.name == "companyName") {
                //     formData[item.name] = newRowData[item.name] ? newRowData[item.name] : formData[item.name];

                // }
            })
        }
        if (props.jsondata != null && clear == false) {
            fboData && fboData.sections[0].adminDetailsSection[0].fields.forEach((item) => {
                if (fieldTypeArr.includes(item.component.toLowerCase())) {
                    if (item.name == 'mobileNumber') {
                        formData[item.name] = props.jsondata[item.name] ? phoneValidation(props.jsondata[item.name]) : formData[item.name];
                    } else {
                        formData[item.name] = props.jsondata[item.name] ? props.jsondata[item.name] : formData[item.name];
                    }

                }
            })
            fboData && fboData.sections[0].companyDetailsSection[0].fields.forEach((item) => {
                if (fieldTypeArr.includes(item.component.toLowerCase())) {
                    if (item.name == 'companyNumber') {
                        formData[item.name] = props.jsondata[item.name] ? phoneValidation(props.jsondata[item.name]) : formData[item.name];
                    } else {
                        formData[item.name] = props.jsondata[item.name] ? props.jsondata[item.name] : formData[item.name];
                    }
                }
            })
            fboData && fboData.sections[0].airportLocationSection.forEach((item) => {
                // item.fields.forEach((item) => {
                //     if (fieldTypeArr.includes(item.component.toLowerCase())) {
                //         airportDetails[item.name] = props.jsondata[item.name] ? props.jsondata[item.name] : formData[item.name];
                //     }
                // })
                // airportFormDetails.push(JSON.parse(JSON.stringify(airportDetails)));
            })
            fboData && fboData.sections[0].bankInformationSection[0].fields.forEach((item) => {
                if (fieldTypeArr.includes(item.component.toLowerCase())) {
                    formData[item.name] = props.jsondata[item.name] ? props.jsondata[item.name] : formData[item.name];
                }
            })
            fboData && fboData.sections[0].fboMemberShipSection[0].fields.forEach((item) => {
                if (fieldTypeArr.includes(item.component.toLowerCase())) {
                    formData[item.name] = props.jsondata[item.name] ? props.jsondata[item.name] : formData[item.name];
                }
            })
            fboData && fboData.sections[0].paymentSection[0].fields.forEach((item) => {
                if (fieldTypeArr.includes(item.component.toLowerCase())) {
                    formData[item.name] = props.jsondata[item.name] ? props.jsondata[item.name] : formData[item.name];
                }
            })
        }

        setAirportData(airportFormDetails);
        setAirportErrors(airportError);
        setformErrors(formErrors);
        setformDataSet(formData);
    }

    const setPrevActiveValidator = (curFormErrors, item, index) => {
        //const { formErrors } = this.state;
        if (airportErrors[index]) {
            curFormErrors[item.name].isValid = airportErrors[index][item.name].isValid;
            curFormErrors[item.name].isTouched = airportErrors[index][item.name].isTouched;
            if (airportErrors[index][item.name].activeValidator !== {} && airportErrors[index][item.name].activeValidator.validation) {
                const activeValidator = curFormErrors[item.name].validations.filter((elem) => elem.validation === airportErrors[index][item.name].activeValidator.validation);
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

        setindexvalue(index)
        let formData = {};

        //document.getElementsByName("addressLine2")[0].value = fullresults[index].Address2
        // document.getElementsByClassName("rbt-input-main form-control rbt-input").value =  'kdjfki';//fullresults[index].Address2
        // document.getElementsByName("addressLine1")[0].value = "jdfjkdjhue"//fullresults[index].Address1
        document.getElementsByName("zip")[0].value = fullresults[index].PostalCode
        document.getElementsByName("city")[0].value = fullresults[index].Locality
        document.getElementsByName("stateName")[0].value = fullresults[index].AdministrativeArea
        document.getElementsByName("countryName")[0].value = fullresults[index].CountryName



        document.getElementsByName("addressLine1")[0].callback = false
        setformDataSet(formData);
        document.getElementsByClassName('dropdown-menu show')[0].style.display = 'none';

        isaddressvalid = true
    }

    const onHandleChange = (e, field, index, flag) => {
        let formData = {};
        const fields = {};
        let target = e.target;
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

        if (field.name === 'firstName' || field.name === 'lastName' || field.name === 'middleName') {
            target.value = target.value.replace(/[^a-z]/gi, '')
        }
        if(field.name === 'airportIdentificationNumber'){
            target.value = target.value.replace(/[^a-z0-9]/gi, '')
            target.value = target.value.toUpperCase()
        
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

        if (flag) {
            let airFields = [];
            airFields = JSON.parse(JSON.stringify(airportData));
            let fieldName, fieldValue;
            // if(fieldName == "fuelServiceOffered"){
            //     let dummy = [];
            //     dummy.push(fieldValue);
            //     airFields[index][fieldName] = dummy;
            // }
            // else airFields[index][fieldName] = fieldValue;


            if (field.type == "multiSelectCheckbox") {
                fieldName = field.name;
                fieldValue = e.length ? e.map(i => i.value) : null;
                airFields[index][fieldName] = fieldValue;
                console.log('airfields ::: ', airFields[index][fieldName])
            } else {
                fieldName = target.name;
                fieldValue = target.value;
                airFields[index][fieldName] = fieldValue;
                console.log('else airfields ::: ', airFields[index][fieldName])
            }
            setAirportData(airFields);

        }
        else {
            if (target.name === "fboMemberShip") {
                setFboMembership(target.checked)
                fields[field.name] = isFboMembershipChecked;
            } else {
                // if (target.name === 'emailId' || isBtnValidate) {
                //     validateField(
                //         target.name, target.value, fields
                //     );
                // }
                fields[field.name] = target.value;
            }
            formData = {
                ...formDataSet,
                ...fields
            }
            setformDataSet(formData)
        }
    }

    const onHandleBlur = (e, field, index) => {
        let formData = { ...formDataSet };
        const fields = {};
        let target = e.target;

        target.value = target.value.trim()
        console.log('test formData ', formData)

        // if(target.name === "fboMemberShip") {
        //     setFboMembership(target.checked)
        //     fields[field.name] = target.label;
        // } 

        // else 
        if (target.name === "sameAsCompanyAdderss") {
            setSameAsCompanyAdderss(target.checked)
            fields[field.name] = isSameAsCompanyAdderss;
        } else {
            fields[field.name] = target.value;
        }

        // if (target.name === 'emailId') {
            validateField(
                target.name, target.value, fields
            );
        // }

        console.log('fboName ::: ', formData['companyName'])

        if (field.name === "airportIdentificationNumber") {
            let value = {
                "FBOName": formData["companyName"] === undefined ? "" : formData["companyName"],
                "ICAO": target.value
            }
            //formData[index]["airportIdentificationNumber"] = target.value
            fetchFunction(value, index)
        }

        async function fetchFunction(value, index) {
            let errorData = { ...formErrors };
            let airFields = [];
            airFields = JSON.parse(JSON.stringify(airportData));
            try {
                getAddressFromAcukwik(value).then(response => {

                    let fboAddressDataObj = JSON.parse(JSON.stringify(response.data[3][0]));
                    let fboAddressData = JSON.parse(JSON.stringify(fboAddressDataObj['@JSONResponse']))

                    document.getElementsByName("airportName")[index].value = JSON.parse(fboAddressData)[0].airport_name === undefined ? '' : JSON.parse(fboAddressData)[0].airport_name;
                    document.getElementsByName("locationAdr1")[index].value = JSON.parse(fboAddressData)[0].address_1 === undefined ? '' : JSON.parse(fboAddressData)[0].address_1;
                    document.getElementsByName("locationAdr2")[index].value = JSON.parse(fboAddressData)[0].address_2 === undefined ? '' : JSON.parse(fboAddressData)[0].address_2;
                    document.getElementsByName("locationCity")[index].value = JSON.parse(fboAddressData)[0].city === undefined ? '' : JSON.parse(fboAddressData)[0].city;
                    document.getElementsByName("locationState")[index].value = JSON.parse(fboAddressData)[0].state === undefined ? '' : JSON.parse(fboAddressData)[0].state;
                    document.getElementsByName("locationZip")[index].value = JSON.parse(fboAddressData)[0].postcode === undefined ? '' : JSON.parse(fboAddressData)[0].postcode;
                    document.getElementsByName("locationCountry")[index].value = JSON.parse(fboAddressData)[0].country_name === undefined ? '' : JSON.parse(fboAddressData)[0].country_name === 'USA' ? 'United States' : JSON.parse(fboAddressData)[0].country_name;

                    airFields[index]["airportName"] = JSON.parse(fboAddressData)[0].airport_name === undefined ? '' : JSON.parse(fboAddressData)[0].airport_name;
                    airFields[index]["locationAdr1"] = JSON.parse(fboAddressData)[0].address_1 === undefined ? '' : JSON.parse(fboAddressData)[0].address_1;
                    airFields[index]["locationAdr2"] = JSON.parse(fboAddressData)[0].address_2 === undefined ? '' : JSON.parse(fboAddressData)[0].address_2;
                    airFields[index]["locationCity"] = JSON.parse(fboAddressData)[0].city === undefined ? '' : JSON.parse(fboAddressData)[0].city;
                    airFields[index]["locationState"] = JSON.parse(fboAddressData)[0].state === undefined ? '' : JSON.parse(fboAddressData)[0].state;
                    airFields[index]["locationZip"] = JSON.parse(fboAddressData)[0].postcode === undefined ? '' : JSON.parse(fboAddressData)[0].postcode;
                    airFields[index]["locationCountry"] = JSON.parse(fboAddressData)[0].country_name === undefined ? '' : JSON.parse(fboAddressData)[0].country_name;

                    setAirportData(airFields);

                    let fields = ['airportName', 'locationAdr1', 'locationAdr2', 'locationCity', 'locationState', 'locationZip', 'locationCountry'];
                    fields.forEach(item => {
                        errorData[item].isTouched = true;
                        errorData[item].isValid = true;
                        validateField(item, formData[item],
                            { [item]: formData[item] })
                    })

                })

            }
            catch (err) {
                throw err;
                console.error(err);
            }
        }


        fields[field.name] = target.value;

        formData = {
            ...formDataSet,
            ...fields
        }

        setformDataSet(formData)
    }

    const checkDuplicate = () => {
        let dupInd = [];
        let airFields = [];
        airFields = JSON.parse(JSON.stringify(airportData));
        airFields.forEach((ob, index) => {
            let icao = ob.airportIdentificationNumber;
            let flagIndex = [];
            for (let i = index + 1; i < airFields.length; i++) {
                if (airFields[i]["airportIdentificationNumber"] == icao) {
                    flagIndex.push(i);
                    flagIndex.push(index);
                }
            }
            dupInd = new Set([...dupInd, ...flagIndex])
        })
        let convertArr = [...dupInd];
        if (convertArr.length) {
            convertArr.forEach(dup => {
                Object.keys(airFields[dup]).forEach((fieldName) => {
                    if (fieldName == 'airportIdentificationNumber') {
                        console.log(' fieldName ::: ',fieldName)
                        validateField(
                            fieldName,
                            airFields[dup][fieldName],
                            { [fieldName]: airFields[dup][fieldName] },
                            dup,
                            true,
                            'airportAddNew',
                            true
                        );
                    }
                })
            })
            return false;
        }
        else return true;
    }

    const validateField = (fieldName, value, fields, index, flag) => {
        const fieldValidationErrors = {
            ...formErrors
        };
        const NewFieldValidationErrors = [...airportErrors];
        let fieldValidationError = null;

        if (flag) {
            fieldValidationError = airportErrors[index][fieldName];
        } else {
            fieldValidationError = fieldValidationErrors[fieldName];
        }
        let validationObj = {};
        validationObj = getFieldIsValid(value, fieldValidationError, fieldName);


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

            setAirportErrors(NewFieldValidationErrors);
        } else {
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
        const validationTypes = ['IsMandatory', 'CheckEIN', 'CheckZIP', 'IsEmail', 'CheckRegex', 'CheckUSPhone', 'onlydigit', 'onlyspecial', 'duplicateICAO'];
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
                    if (validationType === 'CheckUSPhone') {
                        if (value && ((value.match(/\d/g) || []).length !== 10)) {
                            errcount++;
                            fieldValidationError
                                .activeValidator = activeValidator[0];
                        }
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
                    if (validationType === 'IsEmail') {
                        let check = false;
                        if (!new RegExp(activeValidator[0].validateRule)
                            .test(value)) {
                            check = true
                        }
                        let splitVal = value.split('@');
                        let replacedVal = splitVal[0].replaceAll('_', '').replaceAll('.', '')
                        if (replacedVal) { }
                        else {
                            check = true
                        }
                        if (check) {
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

    const handleAddAirportFormSubmit = () => {
        let usedField = fboEnrollData.sections[0].airportLocationSection; //operatorSignup.sections[0].subSections[0].additionalUser
        console.log(' userField ', usedField)
        const addNewFiled = {}
        const temp = JSON.parse(JSON.stringify(fboEnrollData.sections[0].airportLocationSection[usedField.length - 1].fields));

        addNewFiled['fields'] = temp
        let list = fboEnrollData
        fboEnrollData.sections[0].airportLocationSection.push(addNewFiled);
        if (fboEnrollData.sections[0].airportLocationSection.length >= 2 && !addAirport) {
            setAddAirport(true)
        }
        setfboEnrollData(list)
        setInitialState(list, null, false)

    }
    const handleAirportRemoveFormSubmit = (e, item, index) => {
        let fieldArr = fboEnrollData;
        fieldArr.sections[0].airportLocationSection.splice(index, 1);
        if (fieldArr.sections[0].airportLocationSection.length == 1 && addAirport) {
            setAddAirport(false);
        }
        setfboEnrollData(fieldArr);
        let updatedAirportData = airportData;
        updatedAirportData.splice(index, 1)
        setAirportData(updatedAirportData);
        setInitialState(fieldArr, null, false);
    }

    const saveEnroll = () =>{ /// on bording save
        console.log("formDataSet--------", formDataSet)
        setbtnBusy(true)
        const request = {};
        request.json = { ...formDataSet }
        request.json.bfAdmin = Storage.getItem('email')
        request.json.airportDetails = airportData;
        request.json.timestamp = new Date()
        enrollmentSave(request).then(response => {

            if (response.data.statusCode == 200) {
                setbtnBusy(false)
                props.onboard()

                let activity = "Onboarding Saved For "+formDataSet.companyName

                            let auditPayload = {"ModuleName":"Client Onboarding",
                            "TabName":"Client Onboarding",
                            "Activity":activity,
                            "ActionBy":Storage.getItem('email')?Storage.getItem('email'):"null",
                            "Role":Storage.getItem('userRoles')?JSON.parse(Storage.getItem('userRoles')):"null",
                            "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
                            saveAuditLogData(auditPayload, dispatch)
            }
            else{
                setbtnBusy(false)
                setModalText("Internal Server Error. Please Try Again!")
                setModalShow(true)
            }

        })
    }

    const onClickSubmit = (e, item, index) => {

        if (item.name == 'save') {
            if(props.jsondata != null){
                saveEnroll()
            }else{
                const load = {}
                load.emailId = formDataSet.emailId
                duplicatePending(load).then(response=>{
                    if(response.data.accountRegister == "SUCCESS"){
                        saveEnroll()
                    }else{
                        setModalText(fboEnrollData.modal[0].errorModal.paragraph)
                        setScrollPos()
                        setModalShow(true)
                        document.getElementById('root').style.filter = 'blur(5px)';
                        setbtnBusy(false);
                    }
                })
            }
            return;
        }
        let airportDetailsObj = {};
        if (item.name === 'clear') {
            setInitialState(fboEnrollData, true);
        } else if (item.name === 'airportAddNew') {
            handleAddAirportFormSubmit()
        } else if (item.name === 'airportRemove') {
            handleAirportRemoveFormSubmit(e, item, index)
        } else if (item.name === 'bankAddNew') {
        } else if (item.name === 'bankRemove') {
        } else {
            setbtnValidate(true);
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
            airportData.forEach((val, index) => {
                Object.keys(val).forEach((fieldName) => {
                    validateField(
                        fieldName,
                        airportData[index][fieldName],
                        { [fieldName]: airportData[index][fieldName] },
                        index,
                        true
                    );
                })
            })
            let isValid = validateForm();
            if (isValid) {
                let isDuplicate = checkDuplicate();
                console.log('isICAO is duplicated ::: ',isDuplicate)
                if( isDuplicate == true) {
                setbtnBusy(true);
                const saveJSON = { ...formDataSet }
                var html = fboEnrollData.emailBody.html
                var loc = html.indexOf(":");
                let nameString = saveJSON.firstName;
                let name = nameString.charAt(0).toUpperCase() + nameString.slice(1);
                var firstString = "Hi " + name + ',';
                var userType = 'FBO'
                let emailId = encryptData(saveJSON.emailId);
                var activeLink = process.env.REACT_APP_DOMAIN_URL + "/" + fboEnrollData.emailBody.redirectURI + emailId + '&' + userType;
                html = firstString + html.substring(0, loc) + activeLink + html.substring(loc + 1, html.length)
                console.log('save json ::: ', saveJSON)
                const emailLoad = {
                    "to": [saveJSON.emailId],
                    "from": fboEnrollData.emailBody.fromEmailId,
                    "subject": fboEnrollData.emailBody.title,
                    "text": fboEnrollData.emailBody.paragraph,
                    "html": html
                }

                saveJSON.stateOfIncorporation = "";
                saveJSON.organizationType = "FBO";
                saveJSON.loginUserName = Storage.getItem('email') ? Storage.getItem('email') : null
                saveJSON.airportDetails = airportData;
                if (newRowData != null) {
                    saveJSON.bfAdmin = Storage.getItem('email')
                }
                // airportDetailsObj.airportIdentificationNumber = saveJSON.airportIdentificationNumber;
                // airportDetailsObj.airportName = saveJSON.airportName;
                // airportDetailsObj.locationAdr1 = saveJSON.locationAdr1;
                // airportDetailsObj.locationAdr2 = saveJSON.locationAdr2;
                // airportDetailsObj.locationCity = saveJSON.locationCity;
                // airportDetailsObj.locationState = saveJSON.locationState;
                // airportDetailsObj.locationZip = saveJSON.locationZip;
                // airportDetailsObj.locationCountry = saveJSON.locationCountry;
                // airportDetailsObj.fuelServiceOffered = ["Jet Fuel", "Air Fuel"];

                //saveJSON.airportDetails.push(airportDetailsObj);
                saveJSON.accessLevel = "L1";
                saveJSON.expirationDate = "01/2025";
                saveJSON.fboMemberShip = "premium";
                saveJSON.defaultAccessLevel = 'Level 1 (Admin)';
                saveJSON.sameAsCompanyAdderss = isSameAsCompanyAdderss;
                saveJSON.mobileNumber = saveJSON.mobileNumber.replace(/\D/g, '')
                saveJSON.companyNumber = saveJSON.companyNumber.replace(/\D/g, '')
                saveJSON.EIN = saveJSON.EIN.replace(/\D/g, '')
                saveJSON.fedralTaxExemptId = saveJSON.fedralTaxExemptId.replace(/\D/g, '')
                saveJSON.termsAndCondition = false;
                console.log('savejson values are ::: ', saveJSON)
                registerFBOService(saveJSON).then(response => {
                    if (response.data != undefined) {
                        if (response.data.accountRegister === "SUCCESS") {

                            try {
                                if (saveJSON.loginUserName !== null) {
                                    let fboLocations = saveJSON.airportDetails.map(function (obj) {
                                        obj['Location'] = obj['airportIdentificationNumber']; // Assign new key
                                        delete obj['locationCity']; // Delete old key
                                        delete obj['airportIdentificationNumber'];
                                        delete obj['airportName'];
                                        delete obj['fuelService'];
                                        delete obj['locationAdr1'];
                                        delete obj['locationAdr2'];
                                        delete obj['locationState'];
                                        delete obj['locationZip'];
                                        delete obj['locationCountry'];
                                        return obj;
                                    });

                                    let insertFBODefaultPayload = {
                                        "FBO": saveJSON.companyName,
                                        "FBOLocations": fboLocations,
                                        "CreatedBy": saveJSON.loginUserName,
                                        "ModifiedBy": saveJSON.loginUserName
                                    }
                                    console.log(' insertbfkek ', insertFBODefaultPayload)
                                    insertFBODefaultFuelPrice(insertFBODefaultPayload).then(response => {
                                        console.log('response in insertfbo default fp ', response)
                                    })
                                }
                            }
                            catch (err) {
                                console.error('Got error while inserting default fuel tiers');
                            }
                            setModalText(fboEnrollData.modal[0].submitModal.paragraph)
                            setScrollPos()
                            setModalShow(true)
                            document.getElementById('root').style.filter = 'blur(5px)';
                            operatorFboSendMail(emailLoad)
                            let activity = props.jsondata?"Onboarding Completed For "+saveJSON.companyName:saveJSON.companyName +" Created"
                            let auditPayload = {"ModuleName":"FBO SignUp",
                            "TabName":"FBO SignUp",
                            "Activity":activity,
                            "ActionBy":Storage.getItem('email'),
                            "Role":JSON.parse(Storage.getItem('userRoles')),
                            "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
                            saveAuditLogData(auditPayload, dispatch)

                            setbtnBusy(false);
                        } else {
                            let results = response.data;
                            if (results.message.includes(saveJSON.companyName)) {
                                setModalText(fboEnrollData.modal[0].errorModal2.paragraph)
                                setScrollPos()
                                setModalShow(true)
                                document.getElementById('root').style.filter = 'blur(5px)';
                                setbtnBusy(false);
                            } else if (results.message.includes(saveJSON.emailId)) {
                                setModalText(fboEnrollData.modal[0].errorModal.paragraph)
                                let errorObj = formErrors
                                errorObj.emailId.isValid = false
                                errorObj.emailId.activeValidator.errorMessage = " "
                                setformErrors(errorObj)
                                setScrollPos()
                                setModalShow(true)
                                document.getElementById('root').style.filter = 'blur(5px)';
                                setbtnBusy(false);
                            } else {
                                setModalText(fboEnrollData.modal[0].validateModal.paragraph)
                                setScrollPos()
                                setModalShow(true)
                                document.getElementById('root').style.filter = 'blur(5px)';
                                setbtnBusy(false);
                            }
                        }


                    }
                })
            } else {
                setModalText(fboEnrollData.modal[0].duplicateModal.paragraph)
                setScrollPos()
                setModalShow(true)
                document.getElementById('root').style.filter = 'blur(5px)';
                setbtnBusy(false);
            }
            } else {
                setModalText(fboEnrollData.modal[0].validateModal.paragraph)
                setScrollPos()
                setModalShow(true)
                document.getElementById('root').style.filter = 'blur(5px)';
                setbtnBusy(false);
            }
        }
    }

    const closeModal = () => {
        setModalShow(false)
        document.getElementById('root').style.filter = 'none';
        resetScrollPos();

        if (modalText === fboEnrollData.modal[0].submitModal.paragraph) {
            if (addNewCompany) {
                //console.log("In add new company")
                if (props.onboard != null) {
                    props.onboard()
                } else {
                    navigate('/dashboard/account/company')
                }
            } else {
                navigate('/admin')
            }
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
            {parse(tooltipInfo.text)}
        </Tooltip>
    );
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
        airportErrors.map((val, index) => {
            Object.keys(val).forEach((fieldname) => {
                if (!airportErrors[index][fieldname].isValid) {
                    formValid = airportErrors[index][fieldname].isValid;
                    return formValid;
                }
            })
        })
        return formValid;
    }
    const searchFBO = (e, isSearch) => {
        setFBOLoading(true)
        let payload = {}
        // if(isSearch){
        //   payload={
        //     "FBOName" : companyVal?companyVal:'' ,
        //   }
        // }else{
            setFboResults([])
        if(e.length <3){
            
        }else{
            payload = {
                "FBOName": e && e ? e.toUpperCase() : '',
            }
            //}
            getCompanyName(payload);
            // setFBOLoading(false)
        }
        
    }
    const getCompanyName = (payload) => {
        try {
        getFBONamesList(payload, dispatch).then((res) => {
            let companyList = [];
            let data = res && res.length > 0 && res[0] && res[0].length > 0 && res[2][0] && res[2][0]['@JSONResponse'] ? JSON.parse(res[2][0]['@JSONResponse']) : [];
            if (data.length > 0) {
                data.map((i) => {
                    let compName = Array.isArray(payload.FBOName) ? payload.FBOName[0] : payload.FBOName
                    if (compName != "" && compName != undefined && i.FBOName != compName) {
                        companyList.push(compName)
                    }
                    companyList.push(i.FBOName);
                })
            }
            let arr = companyList && companyList.filter((item, index) => companyList.indexOf(item) === index)
            setFboResults(arr);
            setFBOLoading(false)
        }) } catch ( err ) {
            setFBOLoading(false)
        }

    }

    const onCompanySearchBlur = (evt) => {
        let formData = { ...formDataSet };
        let errorData = { ...formErrors };
        if (evt.target.value != '') {
            if(fboresults.includes(evt.target.value)){
                formData["companyName"] = evt.target.value;
                setSelectedCompany([evt.target.value])
                errorData['companyName'].isTouched = true;
                errorData['companyName'].isValid = true;
            }else{
                setFboResults([]);
                formData["companyName"] = "";
                errorData['companyName'].isTouched = true;
                setSelectedCompany([""])
                errorData['companyName'].isValid = false;
            }

        } else {
            setFboResults([]);
            errorData['companyName'].isTouched = true;
            errorData['companyName'].isValid = false;
            formData["companyName"] = evt.target.value;
        }
        setformErrors(errorData);
        setformDataSet(formData);
        if (formErrors['companyName'] && formErrors['companyName'].activeValidator.errorMessage != null) {
            validateField('companyName', evt.target.value,
                { ['companyName']: evt.target.value })
        }
    }

    const searchFBOHandler = (items) => {
        let formData = { ...formDataSet };
        const fields = {};
        //let errorData = { ...formErrors };
        try {
            formData["companyName"] = items[0];
            setSelectedCompany(items)
            console.log(' formdata in formData::: ', formData)
            // errorData[item].isTouched = true;
            // errorData[item].isValid = true;
            setformDataSet(formData)
            // console.log(' formdata in setformDataSet ::: ', formDataSet)
            validateField("companyName", items[0], { ['companyName']: items[0] }, true)
            //setformErrors(errorData);
            if(formDataSet.companyName){
                let payload = {
                "FBOName": formDataSet.companyName.toUpperCase()
                }
                getCompanyName(payload);
            } 

        } catch (err) {
            console.error('Caught error in search', err)
        }
    }
    const getOperatorFields = (item, index) => {
        switch (item.component.toUpperCase()) {
            case "INPUT":
                return (<Input

                    colWidth={item.styles ? item.styles.colWidth : ""}
                    Type={item.type}
                    Label={item.label}
                    data-label={item.label}
                    Placeholder={item.placeholder}
                    callback={item.callback}
                    onselect={(index, item) => onHandleSelect(index, item)}
                    result={results}
                    isRequred={item.isRequired}
                    Name={item.name}
                    handleChange={(e) => onHandleChange(e, item)}
                    handleBlur={(e) => onHandleBlur(e, item, index)}
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
            case "CHECKBOX":
                return (<Checkbox Label={item.label} colWidth={item.styles ? item.styles.colWidth : ''}
                    Placeholder={item.placeholder}
                    type={item.type}
                    ischeck={item.ischeck}
                    isRequred={item.isRequired}
                    Name={item.name}
                    handleChange={(e) => onHandleChange(e, item)}
                    handleBlur={(e) => onHandleBlur(e, item)}
                    className={item.styles}
                />)

            case "ASYNCTYPEAHEAD":
                return (
                    <Form.Group as={Col} md={item.styles.colWidth} className={`${formErrors &&
                        formErrors[item.name] && formErrors[item.name]
                            .activeValidator
                            .errorMessage != null ? 'bf-error-class' : ''
                        } mb-4`} controlId={item.name}
                    >
                        <Form.Label>{item.label} {item.isRequired ? <span className='bf-required'>*</span> : ''}</Form.Label>
                        <AsyncTypeahead
                            filterBy={filterBy}
                            isLoading={isAddress1Loading}
                            minLength={3}
                            defaultInputValue={formDataSet && formDataSet[item.name] ? formDataSet[item.name] : item.defaultValue ? item.defaultValue : ''}
                            label={item.label}
                            useCache={false}
                            onSearch={searchAPI}
                            inputProps={{
                                name: item.name,
                                maxLength: item.maxLength
                            }}
                            ref={typeaheadRef}
                            onChange={(index, item) => searchHandler(index, item)}
                            options={results}
                            placeholder={item.placeholder}
                            onBlur={onAddressSearchBlur}
                            selected={address1Selected}
                            onFocus={handleFocus}
                            renderMenuItemChildren={(option) => (
                                <>
                                    <span>{option}</span>
                                </>
                            )}
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
            case "ASYNCTYPECOMPANY":
                return (
                    <Form.Group as={Col} md={item.styles.colWidth} className={`${formErrors &&
                        formErrors[item.name] && formErrors[item.name]
                            .activeValidator
                            .errorMessage != null ? 'bf-error-class' : ''
                        } mb-4`} controlId={item.name}
                    >
                        <Form.Label>{item.label} {item.isRequired ? <span className='bf-required'>*</span> : ''}</Form.Label>
                        <AsyncTypeahead
                            filterBy={filterBy}
                            isLoading={isFBOLoading}
                            id={item.id}
                            minLength={3}
                            defaultInputValue={formDataSet && formDataSet[item.name] ? formDataSet[item.name] : item.defaultValue ? item.defaultValue : ''}
                            label={item.label}
                            useCache={false}
                            onSearch={(items) => searchFBO(items)}
                            inputProps={{
                                name: item.name,
                                maxLength: item.maxLength
                            }}
                            // ref={typeaheadRef}
                            onChange={(e) => searchFBOHandler(e)}
                            options={fboresults}
                            placeholder={item.placeholder}
                            onBlur={onCompanySearchBlur}
                            selected={selectedCompany}
                        //   onFocus={handleFocus}
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
                    handleChange={(e) => onHandleChange(e, item)}
                    handleBlur={(e) => onHandleBlur(e, item)}
                    dependentField={item.dependentField}
                    dependentFieldVal={item.dependentFieldVal}
                    fieldError={
                        formErrors
                        && !formErrors[item.name].isValid
                        // && (
                        //     formErrors[item.name].isTouched
                        //)
                    }
                    errorMessage={
                        formErrors
                        && formErrors[item.name]
                            .activeValidator
                            .errorMessage
                    }
                    formDataSet={formDataSet && formDataSet[item.name] ? formDataSet[item.name] : item.defaultValue ? item.defaultValue : ''} />)
            case "BUTTON":
                if (!item.shouldNotRender) {
                    return (<ButtonComponent
                        Label={item.label}
                        Type={item.type}
                        className={item.styles.className}
                        variant={item.variant}
                        disabled={false}
                        handleClick={(e) => onClickSubmit(e, item)} />)
                }
        };
    }

    const getAirportFields = (item, index, flag) => {
        switch (item.component.toUpperCase()) {
            case "INPUT":
                return (<Input

                    colWidth={item.styles ? item.styles.colWidth : ""}
                    Type={item.type}
                    Label={item.label}
                    data-label={item.label}
                    onkeyDown={true}
                    Placeholder={item.placeholder}
                    callback={item.callback}
                    onselect={(index, item) => onHandleSelect(index, item, index, flag)}
                    result={results}
                    isRequred={item.isRequired}
                    Name={item.name}
                    handleChange={(e) => onHandleChange(e, item, index, flag)}
                    handleBlur={(e) => onHandleBlur(e, item, index)}
                    // formDataSet={airportData && airportData[index][item.name] ? airportData[index][item.name] : item.defaultValue ? item.defaultValue : ''}
                    fieldError={
                        airportErrors &&
                        airportErrors[index][item.name] && !airportErrors[index][item.name].isValid
                    }
                    errorMessage={
                        airportErrors &&
                        airportErrors[index][item.name] && airportErrors[index][item.name]
                            .activeValidator
                            .errorMessage
                    }
                />)
            case "CHECKBOX":
                return (<Checkbox Label={item.label} colWidth={item.styles ? item.styles.colWidth : ''}
                    Placeholder={item.placeholder}
                    type={item.type}
                    ischeck={item.ischeck}
                    isRequred={item.isRequired}
                    Name={item.name}
                    handleChange={(e) => onHandleChange(e, item)}
                    handleBlur={(e) => onHandleBlur(e, item)}
                    className={item.styles}
                />)

            case "ASYNCTYPEAHEAD":
                return (
                    <Form.Group as={Col} md={item.styles.colWidth} className="mb-4" controlId={item.name}>
                        <Form.Label>{item.label} {item.isRequired ? <span className='bf-required'>*</span> : ''}</Form.Label>
                        <AsyncTypeahead
                            filterBy={filterBy}
                            isLoading={isAddress1Loading}
                            minLength={3}
                            label={item.label}
                            onSearch={searchAPI}
                            inputProps={{
                                name: item.name,
                                minLength:5
                            }}
                            ref={typeaheadRef}
                            onChange={(index, item) => searchHandler(index, item)}
                            options={results}
                            placeholder={item.placeholder}
                            onBlur={onAddressSearchBlur}
                            selected={address1Selected}
                            onFocus={handleFocus}
                            renderMenuItemChildren={(option) => (
                                <>
                                    <span>{option}</span>
                                </>
                            )}
                        />
                    </Form.Group>
                )

            case "MULTISELECTCHECKBOX":
                // if((airportData[item.name] !== null) && (airportData[item.name] !== "")){
                //   if(Array.isArray(airportData[item.name])){
                //     airportData[item.name] = airportData[item.name]
                //   } else {
                //     airportData[item.name] = airportData[item.name]//.split(',')
                //   }
                // }
                return (<MultiSelectCheckbox
                    Label={item.label}
                    Name={item.name}
                    isRequred={item.isRequired}
                    colWidth={item.styles ? item.styles.colWidth : ''}
                    dynamicSelect={item.dynamicSelect}
                    placeholder={item.placeholder}
                    // Options = {item.options?item.options:null} 
                    Options={item.options ? item.options : null}
                    //disabled={disable}
                    lookupReference={item.dynamicSelect ? item.lookupReference : null}
                    handleChange={(e) => onHandleChange(e, item, index, flag)}
                    //checked={item.name==='location'?true:true}
                    handleBlur={(e) => onHandleBlur(e, item, index, flag)}
                    //removeFormData = {() => removeFormData(item)}
                    //   dependentField = {item.dependentField}
                    //   dependentFieldVal = {'company'}
                    styles={item.styles}
                    //   fieldError={
                    //     formErrors
                    //     && !formErrors[item.name].isValid
                    //    // && (
                    //    //     formErrors[item.name].isTouched
                    //     //)
                    // }
                    // errorMessage={
                    //     formErrors
                    //     && formErrors[item.name]
                    //         .activeValidator
                    //         .errorMessage
                    // }
                    // formDataSet={formdata[item.name] }
                    formDataSet={airportData && airportData[index][item.name] ? airportData[index][item.name] : item.defaultValue ? item.defaultValue : ''}
                    fieldError={
                        airportErrors &&
                        airportErrors[index][item.name] && !airportErrors[index][item.name].isValid
                    }
                    errorMessage={
                        airportErrors &&
                        airportErrors[index][item.name] && airportErrors[index][item.name]
                            .activeValidator
                            .errorMessage
                    }
                />)

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
                    handleBlur={(e) => onHandleBlur(e, item)}
                    dependentField={item.dependentField}
                    dependentFieldVal={item.dependentFieldVal}
                    formDataSet={airportData && airportData[index][item.name] ? airportData[index][item.name] : item.defaultValue ? item.defaultValue : ''}
                    fieldError={
                        airportErrors &&
                        airportErrors[index][item.name] && !airportErrors[index][item.name].isValid
                    }
                    errorMessage={
                        airportErrors &&
                        airportErrors[index][item.name] && airportErrors[index][item.name]
                            .activeValidator
                            .errorMessage
                    } />)
            case "BUTTON":
                return (<ButtonComponent
                    Label={item.label}
                    Type={item.type}
                    className={item.styles.className}
                    variant={item.variant}
                    disabled={false}
                    handleClick={(e) => onClickSubmit(e, item, index)} />)
        };
    }


    return (<>
        {isBusy ? (<Loader />) : (
            <div className={`d-flex d-flex-row login-section bf-operator-enrollment-section signup-section ${modalShow ? 'bf-show-model-blr' : ''} ${newRowData || loggedinUserType ? 'bf-dashboard-signup bf-dashboard-fbo-signup' : ''}`}>
                <div className={`${newRowData || loggedinUserType? '' : 'w-70p '}operator-form d-flex d-flex-column `}>
                    {addNewCompany || loggedinUserType ? null :
                        <div className="d-flex d-flex-row align-item-center justify-content-between bf-menu-header">
                            <Nav.Link href={'./admin'}>
                                <img src={logo} alt="Barrel Fuel Logo" className='login-logo' />
                            </Nav.Link>
                            <Nav.Link href={'./admin'} className='bf-mrgl15n'>Home</Nav.Link>
                        </div>}
                    <Form autoComplete='off'>
                        <h1 className='d-flex align-items-center bf-heading bf-mrgt20'>{fboEnrollData && fboEnrollData.headline.label}</h1>

                        <div className={`${newRowData || loggedinUserType? 'bf-dashboard-signup-body' : ''}`}>
                            <div>
                                <Accordion defaultActiveKey={['0']} alwaysOpen>
                                    <Accordion.Item eventKey="0">
                                        <Accordion.Header><span>Super Admin Details</span></Accordion.Header>
                                        <Accordion.Body>
                                            {fboEnrollData && fboEnrollData.sections.map((section, sectionIndex) => {
                                                return (
                                                    section.adminDetailsSection.map((item) => (<Row className='mb-3'>
                                                        {item.fields.map((field) => (
                                                            getOperatorFields(field)
                                                        ))}
                                                    </Row>
                                                    ))
                                                )
                                            }
                                            )}
                                        </Accordion.Body>
                                    </Accordion.Item>

                                    <Accordion.Item eventKey="1">
                                        <Accordion.Header><span>Company Details</span></Accordion.Header>
                                        <Accordion.Body>
                                            {fboEnrollData && fboEnrollData.sections.map((section, sectionIndex) => {
                                                return (
                                                    section.companyDetailsSection.map((item) => (<Row className='mb-3'>
                                                        {item.fields.map((field) => (
                                                            getOperatorFields(field)
                                                        ))}
                                                    </Row>
                                                    ))
                                                )
                                            }
                                            )}
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="2">
                                        <Accordion.Header><span>Airport Location Information</span></Accordion.Header>
                                        <Accordion.Body className={`${addAirport ? 'bf-add-new-section' : ''} bf-accordion-add`}>
                                            {fboEnrollData && fboEnrollData.sections.map((section, sectionIndex) => {
                                                return (
                                                    section.airportLocationSection.map((item, index) => (<Row className='mb-3 bf-airport-loc-info'>
                                                        {item.fields.map((field) => (
                                                            getAirportFields(field, index, true)
                                                        ))}
                                                    </Row>
                                                    ))
                                                )
                                            }
                                            )}
                                        </Accordion.Body>
                                    </Accordion.Item>

                                    <Accordion.Item eventKey="3">
                                        <Accordion.Header><span>Banking Information  {overLayTooltip('Order Amount will be transferred to this account')}</span></Accordion.Header>
                                        <Accordion.Body className={`${addBank ? 'bf-add-new-section' : ''} bf-accordion-add`}>
                                            {fboEnrollData && fboEnrollData.sections.map((section, sectionIndex) => {
                                                return (
                                                    section.bankInformationSection.map((item) => (<Row className='mb-3 bf-banking-information'>
                                                        {item.fields.map((field) => (
                                                            getOperatorFields(field)
                                                        ))}
                                                    </Row>
                                                    ))
                                                )
                                            }
                                            )}
                                        </Accordion.Body>
                                    </Accordion.Item>

                                    <Accordion.Item eventKey="4">
                                        <Accordion.Header><span>FBO Membership {overLayTooltip('FBO: Premium')}</span></Accordion.Header>
                                        <Accordion.Body>
                                            {fboEnrollData && fboEnrollData.sections.map((section, sectionIndex) => {
                                                return (
                                                    section.fboMemberShipSection.map((item) => (<Row className='mb-3'>
                                                        {item.fields.map((field) => (
                                                            getOperatorFields(field)
                                                        ))}
                                                    </Row>
                                                    ))
                                                )
                                            }
                                            )}
                                        </Accordion.Body>
                                    </Accordion.Item>

                                    <Accordion.Item eventKey="5">
                                        <Accordion.Header><span>Payment Information {overLayTooltip('Order Funds Would Be Deducted From The Payment Method Selected')}</span>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            {fboEnrollData && fboEnrollData.sections.map((section, sectionIndex) => {
                                                return (
                                                    section.paymentSection.map((item) => (<Row className='mb-3 bf-payment-signup-information'>
                                                        {item.fields.map((field) => (
                                                            getOperatorFields(field)
                                                        ))}
                                                    </Row>
                                                    ))
                                                )
                                            }
                                            )}
                                        </Accordion.Body>
                                    </Accordion.Item>

                                </Accordion>
                            </div>
                        </div>
                        {fboEnrollData && fboEnrollData.sections.map((section, sectionIndex) => {

                            return (

                                <div>
                                    {isBtnBusy ? (<Loader height='auto' />) : (
                                        <div className={`${newRowData || loggedinUserType? 'bf-dashboard-signup-buttons' : ''} d-grid gap-2 bf-mrgt20i d-flex bf-mrgb20i`}>
                                            {section.primaryButton.map((field) => (
                                                getOperatorFields(field)
                                            ))}
                                        </div>)}
                                </div>


                            )
                        }
                        )}


                        <CustomModal
                            show={modalShow}
                            onHide={() => closeModal()}
                            modelBodyContent={modalText}
                            buttonText={fboEnrollData.modal[0].submitModal.primaryButton.text}
                        />

                    </Form>
                </div>
                {addNewCompany || loggedinUserType? null :
                    <div className='d-flex bg-image-container w-30p'>
                        <div className='d-flex d-flex-column bf-login-right-sec'>
                            {fboEnrollData && fboEnrollData.aviationFacts &&
                                <AviationFacts facts={fboEnrollData.aviationFacts} />
                            }
                        </div>
                    </div>}

            </div>

        )}
    </>);
}

export default FboSignupForm;