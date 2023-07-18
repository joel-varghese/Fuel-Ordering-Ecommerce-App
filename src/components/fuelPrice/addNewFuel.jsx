
import Accordion from 'react-bootstrap/Accordion';
import React, { useState, useEffect, useRef } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Input from '../input/input';
import Select from '../select/select';
import ButtonComponent from '../button/button';
import { ButtonGroup } from 'react-bootstrap';
import './company.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import CustomModal from '../customModal/customModal';
import CustomFormModal from '../customModal/customFormModal';
import { addNewFuelPriceService, saveRetailPrice } from '../../actions/fuelPriceHome/fuelPriceService';
import Subheading from '../subHeading/subHeading';
import Loader from '../loader/loader';
import { getFieldIsValid, validateOnlyDecimals, getFormattedMMDDYY, isValidDate, validateAmount } from '../../controls/validations';
import { Storage, jsonStringify } from '../../controls/Storage';
import CompanyDetailsForm from '../account/companyDetailForm';
import { getAccessLevel, getSuperAccess } from '../../controls/commanAccessLevel';
import { useDispatch, useSelector } from 'react-redux';
import { stateMapper } from '../stateMapper';
import { fetchJSONData, fetchDefaultTires } from '../../actions/fuelPriceHome/addNewFuelAction';
import Container from 'react-bootstrap/Container';
import FormLabel from '@mui/material/FormLabel';
import DatePicker from '../datePicker/datePicker'
import ReactDatePicker from '../datePicker/reactDatePicker'
import { lookupService } from '../../services/commonServices';
import parse from 'html-react-parser';

import ReviewAddNewFuel from './reviewAddNewFuel';
import { IoIosArrowDropdownCircle, IoIosArrowDropupCircle } from 'react-icons/io';
import { fuel_Types_label } from '../../controls/commonConstants';
import {saveAuditLogData } from '../../actions/auditLog/auditLogActions';
import EditFormModal from '../customModal/editModal';
import { saveNotificationList } from '../../actions/notificationService/notificationAction';
import { getSystemVariables } from '../../actions/accountAdminAction/adminService'
import {systemVariablesVal} from '../../actions/accountAdminAction/adminAction'
function AddNewFuel(props) {
    const [formData, setFormData] = useState({});
    const [formDataSet, setformDataSet] = useState({});
    const [retailDataSet, setretailDataSet] = useState({});
    const [formFieldData, setFormFieldData] = useState([]);
    const [fieldList, setFieldList] = useState([]);
    const [formErrors, setFormErrors] = useState({});
    const [formFieldErrors, setFormFieldErrors] = useState([]);
    const [isEditable, setIsEditable] = useState(false);
    const [retailDisable, setRetailDisable] = useState(true);
    const [disable, setdisable] = useState(false);
    const [operatorSignup, setoperatorSignupForm] = useState({});
    const [modalDataShow, setModalDataShow] = useState(false);
    const [optionList, setOptionList] = useState([]);
    const [refresh, setrefresh] = useState(false);
    const [showDeactivate, setShowDeactivate] = useState(false);
    const [isRetail, setIsRetail] = useState(false);
    const [isFlat, setIsFlat] = useState(false);
    const [oldFormula, setOldFormula] = useState(false);
    const [companyList, setCompanyList] = useState([])
    const [location, setLocation] = useState(null)
    const [priceDriver, setPriceDriver] = useState()
    const [editmodalShow, seteditModalShow] = useState(false);
    const [popUpModalText, setpopUpModalText] = useState('');
    const [popUpJson , setpopUpJson] = useState();
    const [submittedForm,setsubmittedForm]=useState(false);
    const [fromDate, setFromDate] = useState(null)
    const [toDate, setToDate] = useState(null)
    const [validFromDate, setValidFromDate] = useState(false) 
    const [validToDate, setValidToDate] = useState(false)
    const [summationOfTaxes, setSummationOfTaxes] = useState(0)
    const [getDefaultTireData, setGetDefaultTireData] = useState([])
    const [ActiveTierExpiryDate, setActiveTierExpiryDate] = useState(null)
    const [minRangeData, setMinRangeData] = useState([])
    const [maxRangeData, setMaxRangeData] = useState([])
    const [wholeClass, setWholeClass] = useState('');
    const [oilTypeCount, setOilTypeCount] = useState();
    const [taxList, setTaxList] = useState();
    const [inputDataList, setinputDataList] = useState([]);
    const [weeklyPrice, setWeeklyPrice] = useState([])
    const [dataForReview, setDataForReview] = useState({})
    const [retailPriceFormula, setRetailPriceFormula] = useState({})
    const [clearData, setClearData] = useState(false)
    let navigate = useNavigate();
    const { state } = useLocation();
   const [wholeData, setWholeData] = useState([]);
    const [allBasePrice, setAllBasePrice] = useState([]);
    const [allCostPrice, setAllCostPrice] = useState([]);
    const [showtaxnfees, setShowtaxnfees] = useState(false);
    const [allTaxesAndFees, setAllTaxesAndFees] = useState([]);
    const [allTaxesAndFeesForTiers, setAllTaxesAndFeesForTiers] = useState([]);
    const [filterLocation, setfilterLocation] = useState([]);
    const fuelPriceHomeReducer = useSelector((state) => state.fuelPriceHomeReducer);
    const jsonData = fuelPriceHomeReducer && fuelPriceHomeReducer.adNewFuelJson && fuelPriceHomeReducer.adNewFuelJson;
    //const userData = undefined;
    const loader = fuelPriceHomeReducer && fuelPriceHomeReducer.loading && fuelPriceHomeReducer.loading;
    //let getDefaultTireData = []
    const dispatch = useDispatch()
    const commonReducer = useSelector((state) => state.commonReducer);
    const loggedInUserType =  commonReducer?.loggedInUserType?.data;
    const loggedInUser = commonReducer?.loggedInUser?.data
    
    const [isBusy, setBusy] = useState(true);
    const [calculatedWeeklyPrice, setCalculatedWeeklyPrice] = useState([])
    let paylod = { 'blobname': 'addNewFuel.json' }
    const selectedCompanyValue = fuelPriceHomeReducer && fuelPriceHomeReducer.selectedCompany && fuelPriceHomeReducer.selectedCompany;
    const selectedFuelData = fuelPriceHomeReducer && fuelPriceHomeReducer.selectedFuelData && fuelPriceHomeReducer.selectedFuelData;
    const [organizationName, setOrganizationName] = useState(selectedCompanyValue && selectedCompanyValue.company && selectedCompanyValue.company)
    const [fatValue, setFatValue] = useState(false)
    const dashboardReducer = useSelector((state) => state.dashboardReducer)
    const profileDetails = dashboardReducer && dashboardReducer.profileData && dashboardReducer.profileData.data
    const loginReducer = useSelector(state => state.loginReducer);
    const loginDetails = loginReducer && loginReducer.loginDetails &&loginReducer.loginDetails.data;
    let loginDetls =  JSON.stringify(loginDetails) === '{}'?{}:JSON.parse(loginDetails);
    let userEmail = loginDetls.loginUserName?loginDetls.loginUserName:'';
    let accessLvl = loginReducer && loginReducer.loginAccessLevel&&loginReducer.loginAccessLevel.data&&loginReducer.loginAccessLevel.data?loginReducer.loginAccessLevel.data:[]
    const access =  JSON.parse(accessLvl)
    const adminReducer = useSelector((state) => state.AdminReducer)
    const systemVariables = adminReducer && adminReducer.systemVariables && adminReducer.systemVariables.data 
    useEffect(() => {
        fetchJSONData(paylod, dispatch)
        setBusy(true);
        let loc=[]
        profileDetails && profileDetails.locationAccess && profileDetails.locationAccess.forEach((val)=>{
            if(val.accessLevel=='Level 2 (Standard)'){
                val.locations.forEach((location)=>{
                loc.push(location)
                })
            }
        })
    setfilterLocation(loc)
    let payloadSystem={"Loggedinuser":selectedCompanyValue}
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
    }, []);
    useEffect(() => {
        //fetchJSONData(paylod, dispatch)
        //setBusy(true);
    }, [clearData]);
    useEffect(() => {
        let allData = [];
        if (selectedFuelData && selectedFuelData.data && selectedFuelData.data.addNewUser === true) {
            getLocationDropdown(selectedCompanyValue && selectedCompanyValue.company && selectedCompanyValue.company)
            setOrganizationName(selectedCompanyValue && selectedCompanyValue.company && selectedCompanyValue.company)
            allData = getDefaultTireData
            if(getDefaultTireData !== null){
                allData = allData && allData.AiportLocations && allData.AiportLocations[0]
            }
            getCompanyDropdown('fbo')
        } else {
            setIsRetail(true)
            if(selectedFuelData && selectedFuelData.data && selectedFuelData.data){
                fetchDefaultTires({
                    "FBO": selectedFuelData && selectedFuelData.data && selectedFuelData.data.companyName,
                    "Location": selectedFuelData && selectedFuelData.data && selectedFuelData.data.data.location
                }, dispatch).then((response) => {
                    if(response.StatusCode === 200){
                    let getDefaultTireData = JSON.parse(jsonStringify(response['JSON_UNQUOTE(@JSONResponse)']));
                        setRetailPriceFormula(getDefaultTireData?.RetailPriceFormula)
                    }
                })
            }

            if (selectedFuelData && selectedFuelData.data && selectedFuelData.data.data.wholeData && selectedFuelData.data.data.wholeData.validityRange) {
                let date = getValidDateRange(selectedFuelData.data.data.wholeData.validityRange)
                setFromDate(date[0] && date[0]!== null ?date[0]: new Date ())
                setToDate(date[1])
            }
            //getCompanyDropdown('fbo')
            allData = selectedFuelData && selectedFuelData.data && selectedFuelData.data.data.wholeData
            //getLocationDropdown(organizationName)
            setLocation(allData&&allData.Location)
            setOrganizationName(organizationName)
        }
        if (allData && allData) {
            let fuelTypeLemgth = allData.FuelTypes.length
            let nameArray = []
            let tiredArray = []
            let minRang = []
            let maxRang = []
            let weeklyPriceData = []
            let calWeeklyPriceData = []
            let costPlusArray = []
            let perTaxPriceArray = []
            let allTexesDiscount = []
            let wholeData = []
            let totalTiredCount = 0;
            let totalTires = []
            let totalTiresData = []
            let activeexpireDte =  getMinDate(allData && allData.ActiveTierExpiryDate, fromDate)
            setActiveTierExpiryDate(activeexpireDte)
            //setActiveTierExpiryDate(null)
            formFieldData['validFrom'] = activeexpireDte != null ? activeexpireDte:fromDate
            //setFromDate(activeexpireDte != null ? activeexpireDte:fromDate)
            formFieldData['validTo'] = toDate
            allData && allData.FuelTypes.map((item, count) => {
                nameArray.push(item.Name)
                let tiredSingleArray = []
                let minRange = []
                let maxRange = []
                let weeklyPrice = []
                let costPlusSingleArray = []
                let perTaxPriceSingleArray = []
                let texesDiscountSingleArray = []
                let calculatedWeeklyPrice = []
                let tiresCountData = 0;
                //let totalTiredCount
                item.Tiers.map((data, index) => {
                    tiredSingleArray.push(data.BasePrice)
                    costPlusSingleArray.push(data.CostPlus)
                    minRange.push(data.MinRange)
                    maxRange.push(data.MaxRange)
                    weeklyPrice.push(data.WeeklyPrice)
                    calculatedWeeklyPrice.push(data.BasePrice + data.CostPlus)
                    perTaxPriceSingleArray.push(parseFloat(data.BasePrice) + parseFloat(data.CostPlus))
                    totalTiredCount++;
                    tiresCountData++
                })
                totalTiresData.push(tiresCountData)
                tiredArray.push(tiredSingleArray)
                costPlusArray.push(costPlusSingleArray)
                perTaxPriceArray.push(perTaxPriceSingleArray)
                minRang.push(minRange)
                maxRang.push(maxRange)
                weeklyPriceData.push(weeklyPrice)
                calWeeklyPriceData.push(calculatedWeeklyPrice)
            })
            
            wholeData.push(nameArray)
            wholeData.push(tiredArray)
            wholeData.push(costPlusArray)
            wholeData.push(perTaxPriceArray)
            //wholeData.push(allTexesDiscount)
            let executeOnce = 0
            // getting tired fees 
            let feeData = getTaxesAndFeesForLocation( allData && allData.FuelTypes);
            /// calculating taxes
            allData && allData.FuelTypes.map((item, count) => {
                //nameArray.push(item.Name)
                let taxesFeesSingleArray = []
                let taxesDiscountSingleFederalArray = []
                let taxesDiscountSingleArray = []
                let taxesDiscountSingleFederalArrayWithUnit = []
                let taxesDiscountSingleArrayWithUnit = []
                if (item.Tiers && count === 0) {
                    item && item.Tiers && item.Tiers[0].Taxes && item.Tiers[0].Taxes.map((item) => {
                        if(item.SortOrder === 1){
                            taxesDiscountSingleFederalArray.push({ "taxname": item.Tax, "amount": item.Amount, "unit":item.Unit })
                            taxesDiscountSingleFederalArrayWithUnit.push({ "taxname": item.Tax, "amount": item.Amount, "unit":item.Unit })
                        } else {
                            taxesDiscountSingleArray.push({ "taxname": item.Tax, "amount": item.Amount, "unit":item.Unit })
                            taxesDiscountSingleArrayWithUnit.push({ "taxname": item.Tax, "amount": item.Amount, "unit":item.Unit })
                        }
                    })

                    allTexesDiscount.push(taxesDiscountSingleFederalArray.concat(taxesDiscountSingleArray));
                    setAllTaxesAndFees(taxesDiscountSingleFederalArrayWithUnit.concat(taxesDiscountSingleArrayWithUnit))
                } 
                executeOnce++;
            })
            let totalOfTaxes = 0;
            let totalTaxFeeDataArray = [];
            
            let totalTaxFeeDataWithUnitArray = [];
            
            allTexesDiscount.map((item) => { //setSummationOfTaxes
                item.map((data, index) => {
                    totalOfTaxes = totalOfTaxes + parseFloat(data.amount)
                })
            })
            //wholeData.push(totalTaxFeeDataArray)
            let summationOfTaxFeeData = ["Taxes & Fees"];
            totalTiresData.map((tiredIte, tiresIndex) => {
                let dataTaxArray = []
                for (let i = 0; i < tiredIte; i++) {

                    dataTaxArray.push(totalOfTaxes)
                }
                summationOfTaxFeeData.push(dataTaxArray)
            })
            wholeData.push(summationOfTaxFeeData)
            allTexesDiscount.map((item) => { //setSummationOfTaxes

                item.map((data, index) => {
                    //totalOfTaxes = totalOfTaxes + parseFloat(data.amount)
                    let dataArra = [];
                    let dataArrayWithUnit = [];
                    dataArra.push(data.taxname)
                    totalTiresData.map((data1, index) => {
                        let dataTaxArray = []
                        let dataTaxArrayWithUnit = []
                        let summationDataTaxArray = []
                        for (let i = 0; i < data1; i++) {
                            dataTaxArray.push(data.amount)
                            dataTaxArrayWithUnit.push({"amount":data.amount, "unit":data.unit})
                        }
                        dataArra.push(dataTaxArray)
                        dataArrayWithUnit.push(dataTaxArrayWithUnit)
                    })
                    totalTaxFeeDataArray.push(dataArra)
                    totalTaxFeeDataWithUnitArray.push(dataArrayWithUnit)
                })
            })
            let totalTaxFeeDataConcatArray = totalTaxFeeDataArray.concat(feeData[0])
            let totalTaxFeeDataConcatArrayWithUnit = totalTaxFeeDataWithUnitArray.concat(feeData[1])
            wholeData.push(totalTaxFeeDataConcatArray)
            setAllTaxesAndFeesForTiers(totalTaxFeeDataConcatArrayWithUnit)
            if(selectedFuelData && selectedFuelData.data && selectedFuelData.data.addNewUser === true){
                setSummationOfTaxes(0)
            }else {
                setSummationOfTaxes(totalOfTaxes)
            }
            setMinRangeData(minRang)
            setMaxRangeData(maxRang)
            setWeeklyPrice(weeklyPriceData)
            setCalculatedWeeklyPrice(calWeeklyPriceData)
            setWholeData(wholeData)
            let totalInputs = 0
            let inputList = wholeData[1].map((item) => {
                totalInputs += item.length
                return item.length
            })
            setinputDataList(inputList)
            let totalOils = wholeData[0].length
            setOilTypeCount(totalOils);
            setTaxList(wholeData[5].length)
            setWholeClass(85 / totalInputs);
            setFieldList(jsonData && jsonData.data && jsonData.data.data && jsonData.data.data.addNewFuel)
            setInitialState(jsonData && jsonData.data && jsonData.data.data && jsonData.data.data.addNewFuel, wholeData);
            setBusy(false);
            } else {
            setFieldList(jsonData && jsonData.data && jsonData.data.data && jsonData.data.data.addNewFuel)
            setInitialState(jsonData && jsonData.data && jsonData.data.data && jsonData.data.data.addNewFuel, []);
            setBusy(false);
            //setResults(addressdata)
            if (Storage.getItem('userType') === "Barrel Fuel") {
                setIsEditable(true)
            } else {
                setIsEditable(false)
            }
            setdisable(true)
            //setActiveTierExpiryDate(getMinDate())
            let activeexpireDte =  getMinDate(allData && allData.ActiveTierExpiryDate, fromDate)
            setActiveTierExpiryDate(activeexpireDte)
            formFieldData['validFrom'] = activeexpireDte !== null ? activeexpireDte:fromDate
            formFieldData['validTo'] = toDate
        }
        
        //getLocationDropdown(Storage.getItem('organizationName'))


        // });
    }, [jsonData, refresh, getDefaultTireData]);
    
    const getTaxesAndFeesForLocation = (fuelTypes) =>{
        //let fuelTypeLength = fuelTypes.length
        let taxFeeDataWithUnit = []
        let fuelTypeTiersLength = 0
        fuelTypes.map((items)=>{
            fuelTypeTiersLength = fuelTypeTiersLength + items.Tiers.length;

        })
        let feeData = []
        fuelTypes.map((items, index)=>{
            if(index === 0){
                feeData = createTaxesFeesForTiers(items, fuelTypeTiersLength, fuelTypes)
            }

        })
        
        let DataFeeArray = []
        let DataFeeArrayWithUnit = []
        feeData && feeData.map((feeDataData, index)=>{
            let innerInnerData = []
            let innserDataArray = []
            let innserDataArrayWithUnit = []
            innserDataArray.push(feeDataData[0][0].taxname)
            
            feeDataData.map((feeDataInner, feeDataInnerindex)=>{
                let otherInnerData = []
                let otherInnerDataWithUnit = []
                feeDataInner.map((feeDataInnerData)=>{
                    otherInnerData.push(feeDataInnerData.amount)
                    otherInnerDataWithUnit.push({"amount":feeDataInnerData.amount, "unit":feeDataInnerData.unit})
                })
                innserDataArray.push(otherInnerData)
                innserDataArrayWithUnit.push(otherInnerDataWithUnit)
            })
            innerInnerData.push(innserDataArray)
            DataFeeArray.push(innserDataArray)
            DataFeeArrayWithUnit.push(innserDataArrayWithUnit)
        }) 
        
        return [DataFeeArray,DataFeeArrayWithUnit];
    
        
    } 
    const createTaxesFeesForTiers = (items, fuelTypeTiersLength, fuelTypes) => {
        let feeTaxDaata = []
        items && items.Tiers[0].Fees !== null&& items.Tiers[0].Fees !== undefined && items.Tiers[0].Fees.map((data, index)=>{
            //if(index ===0){
              let outeDataArray = []   
            fuelTypes.map((fuelItem, fuelIndex)=>{
                let innDataArray = []
                fuelItem.Tiers.map((fuelTireItem, fuelTierIndex)=>{
                    //innDataArray.push(data.FeeTiers[fuelTierIndex])
                    if(data.FeeTiers.length > 1){
                    if(data.FeeTiers[fuelTierIndex]){
                        innDataArray.push({"taxname": data.Fees, "amount": data.FeeTiers[fuelTierIndex].TierValue, "unit":data.FeeTiers[fuelTierIndex].unit })
                    }
                } else {
                    innDataArray.push({"taxname": data.Fees, "amount": data.FeeTiers[0].TierValue, "unit":data.FeeTiers[0].unit })
                }
                })
                outeDataArray.push(innDataArray)
            })
            feeTaxDaata.push(outeDataArray)
        })

        return feeTaxDaata
        
    }
    
    const clearAllData = () =>{
        Object.keys(formFieldData).map((key)=>{
            if(!['name','primaryLocation','validFrom','validTo'].includes(key)){
                if(key.includes('finalPrice-') || key.includes('taxPerPrice-')){
                    formFieldData[key] = "0.00"
                }else if( key.includes('weeklyChanges-')){
                    formFieldData[key] = "0.00%"
                }else
                formFieldData[key] = ""
            }
        })
        setClearData(Math.random())
    }
    const getMinDate = (fulldate)=>{
        
        //if()
          return fulldate  ? getFormattedMMDDYY(new Date(new Date(fulldate).setDate(new Date(fulldate).getDate() + 1))): null//new Date();
        /* let newDate;
        let date = fulldate ? new Date(fulldate) : new Date();
        let lastDate = 0
        let actualMonth = date.getMonth()+1
        let feb = date.getFullYear()%4 == 0 || date.getFullYear()%400 == 0 ? 29 : 28
        const oddMonths = [1,3,5,7,8,10,12]
        if(oddMonths.includes(actualMonth)){
            lastDate = 31
        }else if (actualMonth == 2){
            lastDate = feb
        }else {
            lastDate = 30
        }
        
        let year = fulldate && date.getMonth()== 11 &&  date.getDate()==31 ? date.getFullYear()+1: date.getFullYear();
        let month = fulldate && date.getMonth()== 11 &&  date.getDate()==31 ? 1 : date.getMonth()< 11 && date.getDate()==31? date.getMonth()+2:date.getMonth()+1;
        let dt = fulldate &&  date.getDate()== lastDate? 1 : (fulldate?date.getDate() + 1: date.getDate());
        newDate = (month <= 9 ? "0" + month : month)+ "/" + (dt <= 9 ? "0" + dt : dt) + "/" + year; 
        
        return newDate; */
    }
    const getLableForHeader = (label) => {
        let actualLabel = null;
        fuel_Types_label.map((item) => {
            if (item.label === label) {
                actualLabel = item.value
            }
        })
        return actualLabel;
    }

    const getValidDateRange = (validDate) => {
        let validDateRange = validDate.split("to");
        let valiDate = []
        validDateRange.map((item, index) => {
            let date = item.split("-")

            valiDate.push(date[1] + "/" + date[2] + "/" + date[0])
        })
        return valiDate
        //return validDateRange[1]+"/"+validDateRange[2]+"/"+validDateRange[0]
    }

    const createNewFuelPrice = () => {
        //return dumyData() //getDefaultTireData //dumyData();
        return getDefaultTireData //dumyData();
        // let rows = []

    }


    const getLocationDropdown = (organizationName) => {
        let header = {
            "organizationName": organizationName ? organizationName : Storage.getItem('organizationName')
        }
        let requestData = {
            "serviceName": "location",
            "headers": header
        }
        let options = [];
        lookupService(requestData).then(((res) => {
            let data = JSON.parse(res.body)
            let access= accessLvl&&accessLvl.toLowerCase()
            let isAdmin = true
            if(access.includes("super") || loggedInUserType=='Barrel Fuel'){
                isAdmin = false
            }
            data && data.map((val, index) => {
                let comp = {};
                comp.value = val;
                comp.title = val;
                options.push(comp);
            })
            if(options.length && isAdmin){
				let filteroptions=[]
				options.forEach((val)=>{
				  if(filterLocation.includes(val.value)){
					let comp={};
					comp.value=val.value;
					comp.title=val.value;
					filteroptions.push(comp)
				  }
				})
				options = filteroptions
			}
            setOptionList(options);
            setOrganizationName(organizationName)
            //setLocation(null)
            //setCompanyDropDown(data)
            //setCompanyList(data)
        }))

    }
    const getCompanyDropdown = (userType) => {
        let header = {
            "userType": userType
        }
        let requestData = {
            "serviceName": "companyName",
            "headers": header
        }
        lookupService(requestData).then(((res) => {
            let data = JSON.parse(res.body)
            let options = [];
            data && data.map((val, index) => {
                let comp = {};
                comp.value = val;
                comp.title = val;
                options.push(comp);
            })
            setCompanyList(options)
        }))

    }
    const getFormErrorRules = (item) => {
        return {
            isValid: item?.name === "name" ? true : item?.isRequired ? true : false,
            isTouched: false,
            activeValidator: {},
            validations: item?.validations,
            isRequired: item?.isRequired,
            minLength: item?.minLength,
            maxLength: item?.maxLength
        };
    }
    const getFormErrorRulesForinput = (item) => {
        return {
            isValid: item?.isRequired ? true : false,
            isTouched: false,
            activeValidator: {},
            validations: item?.validations,
            isRequired: item?.isRequired,
            minLength: item?.minLength,
            maxLength: item?.maxLength
        };
    }
    const setInitialState = (adminAddUserData, wholeDataData) => {
        let details = {};
        let errDetails = {};
        //const formDataSet = {};
        let formdetails = [];
        let formFieldError = [];
        const fieldTypeArr = ['input', 'select', 'date'];
        adminAddUserData && adminAddUserData.length && adminAddUserData[0].sections.subSections.forEach((items) => {

            items.companyFieldsArray && items.companyFieldsArray.forEach((item, index) => {
                item.fields.forEach((item) => {
                    if (fieldTypeArr.includes(item.component.toLowerCase())) {
                        //details[item.name] = item.name === 'name' ? "Infinite Pvt Ltd" : formFieldData && formFieldData.length > index ? formFieldData[item.name] : item.defaultValue ? item.defaultValue : "";
                        details[item.name] = item.name == "primaryLocation" ? location : item.name == "name" ? selectedCompanyValue && selectedCompanyValue.company && selectedCompanyValue.company : item.name == "validFrom" ? (selectedFuelData && selectedFuelData.data && selectedFuelData.data.addNewUser || selectedFuelData.data.screen === "archive") && ActiveTierExpiryDate && ActiveTierExpiryDate!== null ?ActiveTierExpiryDate:fromDate == null? new Date(): fromDate : item.name == "validTo" ? toDate : "";
                        errDetails[item.name] = getFormErrorRules(item);
                        errDetails = { ...setPrevActiveValidator(errDetails, item, index) };
                    }
                })
                formdetails = JSON.parse(JSON.stringify(details));
                formFieldError = JSON.parse(JSON.stringify(errDetails));


            })
        });
        let fuelPrice = adminAddUserData && adminAddUserData.length && adminAddUserData[0].sections.subSections[1].fuelPrice
        fuelPrice && wholeDataData && wholeDataData.map((itemP1, index) => {

            if (index === 1 || index === 2) {

                itemP1.map((data, index2) => {
                    //if()
                    data.map((itemP2, index3) => { 
                        let name = index === 1 ? "baseFuel-" + index + "_" + index2 + "_" + index3 : "cost-1_" + index2 + "_" + index3
                        //details[name] = itemP2 !=="" ? parseFloat(itemP2) : "";
                        details[name] = itemP2 && itemP2 !== "" ? itemP2.toFixed(2) : "";
                        errDetails[name] = getFormErrorRulesForinput(fuelPrice, name);
                        errDetails = { ...setPrevActiveValidatorForInput(errDetails, fuelPrice, index.name) };
                    })

                })


            }
        })
        let finalPrice = adminAddUserData && adminAddUserData.length && adminAddUserData[0].sections.subSections[2].finalPrice
        wholeDataData && wholeDataData.map((itemP1, index) => {

            if (index === 1) {
                itemP1.map((data, index2) => {
                    //if()
                    data.map((itemP2, index3) => {
                        /** tax per price */
                        let name = "taxPerPrice-" + index + "_" + index2 + "_" + index3
                        details[name] = getTaxPerPrice(index + "_" + index2 + "_" + index3, details);
                        errDetails[name] = getFormErrorRulesForinput(finalPrice, name);
                        errDetails = { ...setPrevActiveValidatorForInput(errDetails, finalPrice, index.name) };
                        name = "finalPrice-" + index + "_" + index2 + "_" + index3
                        details[name] = itemP2 !== "" ? getFinalPrice(index + "_" + index2 + "_" + index3, details) : "";
                        errDetails[name] = getFormErrorRulesForinput(finalPrice, name);
                        errDetails = { ...setPrevActiveValidatorForInput(errDetails, finalPrice, index.name) };
                        name = "weeklyChanges-" + index + "_" + index2 + "_" + index3
                        details[name] = itemP2 !== "" ? getWeeklyPricePer(index + "_" + index2 + "_" + index3, index2, index3, details) : "";
                        errDetails[name] = getFormErrorRulesForinput(finalPrice, name);
                        errDetails = { ...setPrevActiveValidatorForInput(errDetails, finalPrice, index.name) };
                        name = "tax_Fee_1_" + index2 + "_" + index3
                        details[name] = "";
                        errDetails[name] = getFormErrorRulesForinput(finalPrice, name);
                        errDetails = { ...setPrevActiveValidatorForInput(errDetails, finalPrice, index.name) };
                        
                    })

                })


            }
        })
        //--------------------- calculating the taxes  on load for edit fuel price------------------------------------
        if(selectedFuelData && selectedFuelData.data && selectedFuelData.data.addNewUser !== true){
        if(allTaxesAndFeesForTiers.length > 0){
            let arrayOfTaxes = []
            allTaxesAndFeesForTiers.map((item,index1)=>{
                arrayOfTaxes.push(item[0][0])
            })
            //fields['primaryLocation'] = location
            allTaxesAndFeesForTiers.map((item,index1)=>{
             if(index1 === 0){     
                item.map((data,index2)=>{
                    let totalCount = 0     
                    
                    data.map((innerData, index3)=>{
                         //if(index3 !==2){
                            let totalCount = 0 
                        let name = "tax_Fee_unit-"+index1+"_"+index2+"_"+index3;
                        arrayOfTaxes.map((innerItem, innerIndex)=>{
                            let taxPerPrice = 0.0
                            if(innerItem.unit === "%"){
                                
                                taxPerPrice = (details["taxPerPrice-1_"+index2+"_"+index3] *innerItem.amount)/100
                                totalCount = totalCount + taxPerPrice
                                if(document.getElementById("tax_fee_unit-"+innerIndex+"_"+index2+"_"+index3)!== null)
                                document.getElementById("tax_fee_unit-"+innerIndex+"_"+index2+"_"+index3).innerHTML = parseFloat(taxPerPrice).toFixed(2)
                                
                            } else{
                                taxPerPrice = innerItem.amount
                                totalCount = totalCount + taxPerPrice
                                if(document.getElementById("tax_fee_unit-"+innerIndex+"_"+index2+"_"+index3)!== null)
                                document.getElementById("tax_fee_unit-"+innerIndex+"_"+index2+"_"+index3).innerHTML = parseFloat(taxPerPrice).toFixed(2)
                            }
                        })
                        
                        //fields[name] = innerData.amount
                        let taxfeedata = parseFloat(totalCount).toFixed(2);
                        //document.getElementById("tax_Fee_1_"+index2+"_"+index3).value = parseFloat(taxfeedata).toFixed(2)
                        details["tax_Fee_1_"+index2+"_"+index3] =  parseFloat(taxfeedata).toFixed(2)
                        //document.getElementById("finalPrice-1_"+index2+"_"+index3).value = (parseFloat(fields["taxPerPrice-1_"+index2+"_"+index3])+parseFloat(totalCount)).toFixed(2)
    
                        details["finalPrice-1_"+index2+"_"+index3] = (parseFloat(details["taxPerPrice-1_"+index2+"_"+index3])+parseFloat(totalCount)).toFixed(2)
    
                    //} 
                    //setSummationOfTaxes(totalCount.toFixed(2))
                    })
                    
                })
            }
            })
        }
        storeAllOldPreTaxDat();
    } 
        //----------------------------------------------------------
        
        formdetails = JSON.parse(JSON.stringify(details));
        formFieldError = JSON.parse(JSON.stringify(errDetails));
        setdisable(true)
        setFormFieldData(formdetails);
        setFormFieldErrors(formFieldError);
        setFormData(formdetails);
        setformDataSet(formdetails)
        setFormErrors(formFieldError);
        /* if(state && state.addNewUser !== true){
            createTaxesAndFeesWithUnit(location)
        } */
    }

    const storeAllOldPreTaxDat = () => {
      let ArrayBaseData = []
      let ArrayCostData = []
      Object.keys(formFieldData).map((item)=>{
        if(item.includes("baseFuel-")){  
            ArrayBaseData[item] = formFieldData[item]
        } else 
        if(item.includes("cost-")){
            ArrayCostData[item] = formFieldData[item]
        } 
      })   
      setAllBasePrice(ArrayBaseData);
      setAllCostPrice(ArrayCostData);
    } 

    

    const getTaxPerPrice = (name, details) => {
        let value = parseFloat(parseFloat(details["baseFuel-" + name]) + parseFloat(details["cost-" + name])).toFixed(2);
        return isNaN(value) ? "0.00" : value;
    }

    const getWeeklyPricePer = (name, index1, index2, details) => {
        let localArray = calculatedWeeklyPrice;
        if (details["taxPerPrice-" + name] && weeklyPrice.length > 0) {
            if(weeklyPrice[index1][index2] !== undefined && weeklyPrice[index1][index2] !== 0){
                if(details["taxPerPrice-" + name] === "0.00"){
                    return "0.00%"
                } else {
                    let value = parseFloat((( details["taxPerPrice-" + name] - weeklyPrice[index1][index2]) / weeklyPrice[index1][index2] ) * 100 ).toFixed(2) 
                     return value + "%";
                }
            
        } else {
            return "0.00%"
        }
            //return 
        } else {
            return "0.00%"
        }

    }

    const getFinalPrice = (name, details) => {
        let value = parseFloat(details["taxPerPrice-" + name] + summationOfTaxes).toFixed(2);
        return value;
        //return parseFloat(details["taxPerPrice-"+name]) + parseFloat(summationOfTaxes);
    }

    const setPrevActiveValidator = (curFormErrors, item, index) => {
        //const { formErrors } = this.state;
        if (formFieldErrors[index]) {
            curFormErrors[item.name].isValid = formFieldErrors[index][item.name].isValid;
            curFormErrors[item.name].isTouched = formFieldErrors[index][item.name].isTouched;
            if (formFieldErrors[index][item.name].activeValidator !== {} && formFieldErrors[index][item.name].activeValidator.validation) {
                const activeValidator = curFormErrors[item.name].validations.filter((elem) => elem.validation === formFieldErrors[index][item.name].activeValidator.validation);
                if (activeValidator.length) {
                    curFormErrors[item.name].activeValidator = activeValidator[0];
                }
            }
        }
        return curFormErrors;
    }

    const setPrevActiveValidatorForInput = (curFormErrors, item, index, name) => {
        //const { formErrors } = this.state;
        if (formFieldErrors[index]) {
            curFormErrors[name].isValid = formFieldErrors[index][name].isValid;
            curFormErrors[name].isTouched = formFieldErrors[index][name].isTouched;
            if (formFieldErrors[index][item.name].activeValidator !== {} && formFieldErrors[index][item.name].activeValidator.validation) {
                const activeValidator = curFormErrors[name].validations.filter((elem) => elem.validation === formFieldErrors[index][name].activeValidator.validation);
                if (activeValidator.length) {
                    curFormErrors[name].activeValidator = activeValidator[0];
                }
            }
        }
        return curFormErrors;
    }
    /* const cancatinateRows = (data) => {
        const ObjecDataAt = {};
        for (let i = 0; i < data.length; i++) {
            let ObjKey = '';
            let value = [];
            let dummyOb = {}
            for (const property in data[i]) {
                if (property != 'location') {
                    ObjKey = ObjKey + `${property}|${data[i][property]}|`;
                } else {
                    dummyOb["value"] = data[i][property];
                    dummyOb["label"] = data[i][property];
                    value.push(dummyOb);

                }
            }
            if (ObjecDataAt[ObjKey]) {
                ObjecDataAt[ObjKey] = [...ObjecDataAt[ObjKey], ...value]
            } else {
                ObjecDataAt[ObjKey] = value;
            }
        }

        const updatedArray = []
        for (const property in ObjecDataAt) {
            let data = property.split('|');
            const updatedObj = {};
            for (let j = 0; j < data.length - 1; j++) {
                updatedObj[data[j]] = data[j + 1];
                j++;

            }
            updatedObj['location'] = ObjecDataAt[property];
            updatedArray.push(updatedObj);

        }

        return updatedArray;
    } */
   
    const calculatTaxesBasedOnUnit = (tacPerPrice,index, baseValue, costValue) =>{
        const fields = { ...formDataSet };
        let splitIndex = index.split('_')
        //const fields = { ...formDataSet };
        let totalCount = 0.00
        allTaxesAndFeesForTiers.map((item,index) => {
            let taxPerPrice = 0.0
            
            if(item[splitIndex[1]]&&item[splitIndex[1]][splitIndex[2]]&&item[splitIndex[1]][splitIndex[2]]['unit'] === "%"){
                if(baseValue === "" && costValue === ""){
                    taxPerPrice = item[splitIndex[1]][splitIndex[2]]['amount']
                    totalCount = 0.00
                } else {
                    taxPerPrice = (tacPerPrice * item[splitIndex[1]][splitIndex[2]]['amount'])/100
                    totalCount = totalCount+taxPerPrice
                }
                
            } else{
                if(baseValue === "" && costValue === ""){
                    taxPerPrice = (item[splitIndex[1]][splitIndex[2]]['amount'])
                    totalCount = 0.00
                } else {
                    taxPerPrice = item[splitIndex[1]]&&item[splitIndex[1]][splitIndex[2]]&&item[splitIndex[1]][splitIndex[2]]['amount']
                    totalCount = totalCount+taxPerPrice
                }
                //totalCount = totalCount+taxPerPrice
            }
            if( document.getElementById("tax_fee_unit-"+index+"_"+splitIndex[1]+"_"+splitIndex[2]) !== null)
            document.getElementById("tax_fee_unit-"+index+"_"+splitIndex[1]+"_"+splitIndex[2]).innerHTML = parseFloat(taxPerPrice).toFixed(2)
            
        })
        fields["tax_Fee_1_"+splitIndex[1]] = totalCount === "0.00"?"0.00":parseFloat(totalCount).toFixed(2);
        let totalCountValue = totalCount === "0.00"?"0.00":parseFloat(totalCount).toFixed(2)
        setSummationOfTaxes(totalCountValue)
        if(document.getElementById("tax_Fee_1_"+splitIndex[1]+"_"+splitIndex[2])!=null)
        document.getElementById("tax_Fee_1_"+splitIndex[1]+"_"+splitIndex[2]).value = totalCount === "0.00"?"0.00":parseFloat(totalCount).toFixed(2)
        
        //fields["finalPrice-1_"+splitIndex[1]+"_"+splitIndex[2]] = (parseFloat(tacPerPrice) + parseFloat(totalCount)).toFixed(2)
        //setFormFieldData(fields);
        return totalCount;
    }
    const handleChange = (e, field, index, flag) => {
        const fields = { ...formDataSet };
        let target = e !== null && e.target;
        let fieldName, fieldValue;
        let invalidDate = false;
        if(flag){
            //fields['validFrom'] = ActiveTierExpiryDate
        }
        if (field.name !== 'validFrom' && field.name !== 'validTo') {
            if (field.name === "name") {
                if (target.value !== "") {
                    getLocationDropdown(target.value)
                }
            }
            if (target.name === "primaryLocation") {
                
                if (target.value !== "" && selectedFuelData && selectedFuelData.data && selectedFuelData.data.addNewUser === true) {
                    //getLocationDropdown(target.value)
                    setFromDate(null)
                    setWeeklyPrice([])
                    setCalculatedWeeklyPrice([])
                    fetchDefaultTires({
                        "FBO": Storage.getItem('organizationName'),
                        "Location": target.value
                    }, dispatch).then((response) => {
                        if(response.StatusCode === 200){
                        let getDefaultTireData = JSON.parse(jsonStringify(response['JSON_UNQUOTE(@JSONResponse)']));
                            setGetDefaultTireData(getDefaultTireData)
                            setRetailPriceFormula(getDefaultTireData?.RetailPriceFormula)
                            let allData = []
                            if(getDefaultTireData !== null){
                                allData = allData && allData.AiportLocations && allData.AiportLocations[0]

                                let activeTireExpData = getDefaultTireData && getDefaultTireData.AiportLocations[0].ActiveTierExpiryDate!== null ? getFormattedMMDDYY(new Date(getDefaultTireData && getDefaultTireData.AiportLocations[0].ActiveTierExpiryDate).setDate(new Date(getDefaultTireData && getDefaultTireData.AiportLocations[0].ActiveTierExpiryDate).getDate() + 1)): getFormattedMMDDYY(new Date())
                                fields['validFrom'] = activeTireExpData;
                                setActiveTierExpiryDate(activeTireExpData)
                            }
                            setIsRetail(true)
                            //createTheWholeData(allData)
                        } else if(response.StatusCode === 201) {
                            setModalText(response.Msg)
                            setShow(true);
                            setGetDefaultTireData(null)
                            setWholeData([])
                        }
                        //setrefresh(Math.random())
                        setLocation(target.value)
                       
                        //setInitialState(jsonData && jsonData.data && jsonData.data.data && jsonData.data.data.addNewFuel);
                    })
                    //fields['validFrom'] = ActiveTierExpiryDate
                    //fields['validFrom'] = ActiveTierExpiryDate ? ActiveTierExpiryDate: getFormattedMMDDYY(new Date());
                    //setrefresh(Math.random())
                }
            }




        }

        //if (field.name != "DocumentUpload") {
        fieldName = field.name;

        //let fields = {};

        let formData = {}
        if (field.name === 'validFrom' || field.name === 'validTo') {
            if(e !=null){
                let selectedDate = e&&e.$d&&e.$d
                let date = getFormattedMMDDYY(selectedDate)
                let today = new Date();
                today.setHours(0,0,0,0)
                var newDate = new Date(new Date(selectedDate) + 30 * 24*60*60*1000);
                newDate.setHours(0,0,0,0)
                if(field.name === 'validFrom'){
                    fields['validTo'] = null
                    //setActiveTierExpiryDate(getFormattedMMDDYY(selectedDate))
                    if( new Date(date) < new Date(ActiveTierExpiryDate)) {
                        invalidDate= "dateLessActive"
                        fieldValue = date;
                        fields[fieldName] = date;
                        setValidFromDate(invalidDate) 
                        validateField(field.name, selectedDate, fields, true, formData,invalidDate);
                      } else if( selectedDate == "Invalid Date"){
                        invalidDate= "invalidDate"
                        fieldValue = date;
                        fields[fieldName] = date;
                        setValidFromDate(invalidDate) 
                        validateField(field.name, selectedDate, fields, true, formData,invalidDate);
                      } else if(new Date(date)  < today ){
                        invalidDate= true
                        fieldValue = date;
                        fields[fieldName] = date;
                        setValidFromDate(invalidDate) 
                        validateField(field.name, selectedDate, fields, true, formData,invalidDate);

                      }else {
                        invalidDate= false
                        fieldValue = date;
                        fields[fieldName] = date;
                        setValidFromDate(invalidDate)
                        validateField(field.name, selectedDate, fields, true,formData, invalidDate);
                      }
                }else if(field.name === "validTo"){
                    let validFrom = fields['validFrom']?new Date(fields['validFrom']): new Date()
                    if( selectedDate == "Invalid Date"){
                        invalidDate= "invalidDate"
                        fieldValue = date;
                        fields[fieldName] = date;
                        setValidFromDate(invalidDate) 
                        validateField(field.name, selectedDate, fields, true, formData,invalidDate);
                      }
                    else if(new Date(date) < new Date(validFrom)) {
                        invalidDate= true
                        fieldValue = date;
                        fields[fieldName] = date;
                        setValidToDate(invalidDate) 
                        validateField(field.name, selectedDate, fields, true, formData,invalidDate);
                      } else if(new Date(date) > new Date(validFrom).setDate(new Date(validFrom).getDate() + 30)){
                        invalidDate= 'dateGreThirty'
                        fieldValue = date;
                        fields[fieldName] = date;
                        setValidToDate(invalidDate) 
                        validateField(field.name, selectedDate, fields, true, formData,invalidDate);
                      }else {
                        invalidDate= false
                        fieldValue = date;
                        fields[fieldName] = date;
                        setValidToDate(invalidDate) 
                        validateField(field.name, selectedDate, fields, true,formData, invalidDate);
                      }
                }
              }else{
                fieldValue = null;
                fields[fieldName] = null;
              }
        } else {
            fieldValue = target.value;
            fieldValue = fieldValue.trim()
            fieldValue = fieldValue.replace(/-/g, ' ')
            fieldName = target.name
            if(fieldValue === '-'){
                fields[target.name] = '';
            } else {
                fields[target.name] = fieldValue;
            }
            
            
            if (field.validations) {
                for (var i = 0; i < field.validations.length; i++) {
                    if (field.validations[i].validation === 'checkTwoDigit') {
                        /* if (!(new RegExp(field.validations[i].validateRule)
                        .test(e.target.value))) { */
                        let result = validateOnlyDecimals(e.target.value)
                        //if(result){
                        fields[target.name] = result;
                        //} 

                        //}
                        if (target.name.includes("baseFuel-")) {
                            let data = target.name.split('-');
                            let dataArr = data[1].split('_')
                            let taxPerPrice = parseFloat(fields["cost-" + data[1]]) + parseFloat(fields[target.name])
                            if(fields[target.name] === ""){

                               if(fields["cost-" + data[1]] !== "")
                               {
                                fields["taxPerPrice-" + data[1]] = fields["cost-" + data[1]]
                                //calculatedWeeklyPrice[dataArr[1]][dataArr[2]] = fields["cost-" + data[1]]
                                let sumOfTaxes = calculatTaxesBasedOnUnit(fields["taxPerPrice-" + data[1]], data[1], fields["baseFuel-" + data[1]], fields["cost-" + data[1]])
                                let finalPrice = (parseFloat(fields["cost-" + data[1]]) + parseFloat(sumOfTaxes)).toFixed(2)
                                if(isNaN(finalPrice)){
                                    fields["finalPrice-" + data[1]] = parseFloat(0.00).toFixed(2)
                               } else {
                                    fields["finalPrice-" + data[1]] = parseFloat(finalPrice).toFixed(2)
                                    
                               }
                               fields["tax_Fee_1_"+dataArr[1]+"_"+dataArr[2]] = sumOfTaxes.toFixed(2);
                               }else{
                                let sumOfTaxes = calculatTaxesBasedOnUnit(fields["taxPerPrice-" + data[1]], data[1],fields["baseFuel-" + data[1]], fields["cost-" + data[1]]) 
                                    fields["taxPerPrice-" + data[1]] = parseFloat(0.00).toFixed(2)
                                    //calculatedWeeklyPrice[dataArr[1]][dataArr[2]] = 0.00
                                    fields["finalPrice-" + data[1]] = parseFloat(0.00).toFixed(2)
                                    fields["tax_Fee_1_"+dataArr[1]+"_"+dataArr[2]] = parseFloat(0.00).toFixed(2)
                               }
                            } else {
                                
                                if(fields["cost-" + data[1]] !== ""){
                                    fields["taxPerPrice-" + data[1]] = (parseFloat(fields["cost-" + data[1]]) + parseFloat(fields[target.name])).toFixed(2)
                                    fields["taxPerPrice-" + data[1]] = isNaN(fields["taxPerPrice-" + data[1]])?"0.00":fields["taxPerPrice-" + data[1]]
                                    //calculatedWeeklyPrice[dataArr[1]][dataArr[2]] =(parseFloat(fields["cost-" + data[1]]) + parseFloat(fields[target.name])).toFixed(2)
                                    let sumOfTaxes = calculatTaxesBasedOnUnit(fields["taxPerPrice-" + data[1]], data[1], fields["baseFuel-" + data[1]], fields["cost-" + data[1]]) 
                                    fields["tax_Fee_1_"+dataArr[1]+"_"+dataArr[2]] = sumOfTaxes.toFixed(2);
                                    //fields["tax_Fee_1_"+data[1]] = sumOfTaxes.toFixed(2);
                                    let finalPrice = (parseFloat(fields["cost-" + data[1]]) + parseFloat(fields[target.name]) + parseFloat(sumOfTaxes)).toFixed(2)
                                    if(isNaN(finalPrice)){
                                        fields["finalPrice-" + data[1]] = parseFloat(0.00).toFixed(2)
                                    } else {
                                        fields["finalPrice-" + data[1]] = (parseFloat(fields["cost-" + data[1]]) + parseFloat(fields[target.name]) + parseFloat(sumOfTaxes)).toFixed(2)
                                    }
                                   }else{
                                    fields["taxPerPrice-" + data[1]] = parseFloat(fields[target.name]).toFixed(2) 
                                    fields["taxPerPrice-" + data[1]] = isNaN(fields["taxPerPrice-" + data[1]])?"0.00":fields["taxPerPrice-" + data[1]]
                                    //calculatedWeeklyPrice[dataArr[1]][dataArr[2]] = parseFloat(fields[target.name]).toFixed(2)
                                    let sumOfTaxes = calculatTaxesBasedOnUnit(fields["taxPerPrice-" + data[1]], data[1],fields["baseFuel-" + data[1]], fields["cost-" + data[1]]) 
                                    fields["tax_Fee_1_"+dataArr[1]+"_"+dataArr[2]] = sumOfTaxes.toFixed(2);
                                    let finalPrice = (parseFloat(fields[target.name]) + parseFloat(sumOfTaxes)).toFixed(2)
                                    if(isNaN(finalPrice)) {
                                        fields["finalPrice-" + data[1]] = parseFloat(0.00).toFixed(2)
                                    } else {
                                        fields["finalPrice-" + data[1]] = parseFloat(finalPrice).toFixed(2)
                                        
                                    }
                                   }
                            }
                            //fields["taxPerPrice-" + data[1]] = ;
                           // calculatTaxesBasedOnUnit(fields["taxPerPrice-" + data[1]], data[1])
                            ;
                            let indexes = data[1].split("_")
                            fields["weeklyChanges-" + data[1]] = getWeeklyPricePer(data[1], indexes[1], indexes[2], fields)
                        }
                        

                        if (target.name.includes("cost-")) {
                            let data = target.name.split('-');
                            let dataArr = data[1].split('_')
                            let taxPerPrice = parseFloat(fields["cost-" + data[1]]) + parseFloat(fields[target.name])
                            if (fields[target.name] === "") {
                                if (fields["baseFuel-" + data[1]] !== "") {
                                    fields["taxPerPrice-" + data[1]] = parseFloat(fields["baseFuel-" + data[1]]).toFixed(2)
                                    fields["taxPerPrice-" + data[1]] = isNaN(fields["taxPerPrice-" + data[1]]) ? "0.00" : fields["taxPerPrice-" + data[1]]
                                    //calculatedWeeklyPrice[dataArr[1]][dataArr[2]] = parseFloat(fields["baseFuel-" + data[1]]).toFixed(2)
                                    let sumOfTaxes = calculatTaxesBasedOnUnit(fields["taxPerPrice-" + data[1]], data[1], fields["baseFuel-" + data[1]], fields["cost-" + data[1]])
                                    fields["tax_Fee_1_" + dataArr[1] + "_" + dataArr[2]] = sumOfTaxes.toFixed(2);
                                    let finalPrice = (parseFloat(fields["baseFuel-" + data[1]]) + parseFloat(sumOfTaxes)).toFixed(2)
                                    fields["finalPrice-" + data[1]] = (parseFloat(fields["baseFuel-" + data[1]]) + parseFloat(sumOfTaxes)).toFixed(2)
                                } else {
                                    let sumOfTaxes = calculatTaxesBasedOnUnit(fields["taxPerPrice-" + data[1]], data[1], fields["baseFuel-" + data[1]], fields["cost-" + data[1]])
                                    fields["taxPerPrice-" + data[1]] = parseFloat(0.00).toFixed(2)
                                   // calculatedWeeklyPrice[dataArr[1]][dataArr[2]] = 0.00
                                    fields["finalPrice-" + data[1]] = parseFloat(0.00).toFixed(2)
                                    fields["tax_Fee_1_" + dataArr[1] + "_" + dataArr[2]] = parseFloat(0.00).toFixed(2)
                                }
                            } else {
                                if (fields["baseFuel-" + data[1]] !== "") {
                                    fields["taxPerPrice-" + data[1]] = (parseFloat(fields["baseFuel-" + data[1]]) + parseFloat(fields[target.name])).toFixed(2)
                                    fields["taxPerPrice-" + data[1]] = isNaN(fields["taxPerPrice-" + data[1]]) ? "0.00" : fields["taxPerPrice-" + data[1]]
                                    //calculatedWeeklyPrice[dataArr[1]][dataArr[2]] = (parseFloat(fields["baseFuel-" + data[1]]) + parseFloat(fields[target.name])).toFixed(2)
                                    /////
                                    let sumOfTaxes = calculatTaxesBasedOnUnit(fields["taxPerPrice-" + data[1]], data[1], fields["baseFuel-" + data[1]], fields["cost-" + data[1]])
                                    ///////
                                    fields["tax_Fee_1_" + dataArr[1] + "_" + dataArr[2]] = sumOfTaxes.toFixed(2);
                                    let finalPrice = (parseFloat(fields["baseFuel-" + data[1]]) + parseFloat(fields[target.name]) + parseFloat(sumOfTaxes)).toFixed(2)
                                    if(isNaN(finalPrice)){
                                        fields["finalPrice-" + data[1]] = parseFloat(0.00).toFixed(2)
                                    } else {
                                        fields["finalPrice-" + data[1]] = (parseFloat(fields["baseFuel-" + data[1]]) + parseFloat(fields[target.name]) + parseFloat(sumOfTaxes)).toFixed(2)
                                    }
                                } else {
                                    fields["taxPerPrice-" + data[1]] = parseFloat(fields[target.name]).toFixed(2)
                                    fields["taxPerPrice-" + data[1]] = isNaN(fields["taxPerPrice-" + data[1]]) ? "0.00" : fields["taxPerPrice-" + data[1]]
                                    //calculatedWeeklyPrice[dataArr[1]][dataArr[2]] = fields[target.name]
                                    let sumOfTaxes = calculatTaxesBasedOnUnit(fields["taxPerPrice-" + data[1]], data[1], fields["baseFuel-" + data[1]], fields["cost-" + data[1]])
                                    fields["tax_Fee_1_" + dataArr[1] + "_" + dataArr[2]] = sumOfTaxes.toFixed(2);
                                    let finalPrice = (parseFloat(fields[target.name]) + parseFloat(sumOfTaxes)).toFixed(2)
                                    if (isNaN(finalPrice)) {
                                        fields["finalPrice-" + data[1]] = parseFloat(0.00).toFixed(2)
                                    } else {
                                        fields["finalPrice-" + data[1]] = parseFloat(finalPrice).toFixed(2)
                                    }
                                }
                            }
                            
                            //fields["taxPerPrice-" + data[1]] = ;
                            ;
                            let indexes = data[1].split("_")
                            fields["weeklyChanges-" + data[1]] = getWeeklyPricePer(data[1], indexes[1], indexes[2], fields)
                        }
                        
                    }
                }
            }
        }
        validateField(fieldName, fieldValue, fields, true,formData, invalidDate);
        formData = {
            ...formDataSet,
            ...fields
        };
        setFormFieldData(fields);
        setFormData(formData);
        setformDataSet(formData)
        setFormFieldData(formData)
        //}





        //validateField(fieldName, fieldValue, fields, true); */

    }

    const validateField = (fieldName, value, fields, isTouched,formData,invalidDate) => {
        const fieldValidationErrors = {
            ...formFieldErrors
        };
        let fieldValidationError = null;

        fieldValidationError = fieldValidationErrors[fieldName];

        if (isTouched !== undefined) {
            fieldValidationError.isTouched = isTouched;
        }
        let validationObj = {};
        validationObj = getFieldIsValid(value, fieldValidationError, fieldName,formData,invalidDate);
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

        
        setFormErrors(fieldValidationErrors)
        setFormFieldErrors(fieldValidationErrors);
        /*customValidation(
            fieldName, value, validationObj
        );*/
    }
    const handleBlur = (e, item, index) => {
        let formdData = {};
        let fields = {};
        let target = e.target;
        let fieldName, fieldValue;
        fieldName = target.name;
        fieldValue = target.value;
        if( target.name === "primaryLocation"){
            fields[fieldName] = formDataSet[fieldName] !== "" ? formDataSet[fieldName] :target.value
            //fields[fieldName] = target.value;
        } else{
        if(parseFloat(fieldValue) === 0|| fieldValue === '.' || fieldValue === '-'){
            fields[fieldName] = "";    
        } else{
            let value = parseFloat(fieldValue).toFixed(2)
            if(value !== 'NaN'){
            fields[fieldName] = parseFloat(fieldValue).toFixed(2);
            } else {
            fields[fieldName] = "";
            }
        }
    }
        const errorObj = validateField(
            fieldName, fieldValue, fields, true,formData,true
        );

        //setFormErrors(errorObj);
        formdData = {
            ...formDataSet,
            ...fields
        }
        setFormData(formdData);
        setformDataSet(formdData)
        setFormFieldData(formdData)

    }



    const validateForm = () => {
        let formValid = true;
        Object.keys(formFieldErrors).forEach((fieldname) => {
            if (!formFieldErrors[fieldname].isValid) {
                formValid = formFieldErrors[fieldname].isValid;
                return formValid;
            }
        })
        //})
        return formValid;
    }

    const getFormattedYYMMDD = (fulldate) => {
        let newDate;
        let date = new Date(fulldate);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let dt = date.getDate();
        newDate = year + "-" + (month <= 9 ? "0" + month : month) + "-" + (dt <= 9 ? "0" + dt : dt);
        return newDate;
    }

    const getFormattedMMDD = (fulldate) => {
        let newDate;
        let date = new Date(fulldate);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let dt = date.getDate();
        newDate = (month <= 9 ? "0" + month : month) + "-" + (dt <= 9 ? "0" + dt : dt);
        return newDate;
    }
    const datesAreOnSameDay = (first, second) =>
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate();

    const formSaveData = () => {

        let saveJson = {};
        let datavalue = []
        let countValue = 0;

        wholeData&&wholeData.map((data, index) => {
            let i = 0
            //let fuelTypeData = 
            if (index === 0) {
                data&&data.map((item, indexP) => {
                    //fuelTypeData['fuelType'] = item

                    datavalue.push({ "fuelType": item, "baseFuel": [], "cost": [], "taxPerPrice": [], "finalPrice": [] })
                })
            }
            if (index === 1) {
                data&&data.map((item, indexP) => {
                    //datavalue.push({"juelType":item})
                    item.map((data, indexp1) => {
                        datavalue[indexP]["baseFuel"].push({ "baseFuel": formFieldData["baseFuel-1_" + indexP + "_" + indexp1] })
                    })

                    i++;
                })
            }

            if (index === 2) {
                data&&data.map((item, indexP) => {
                    //datavalue.push({"juelType":item})
                    item.map((data, indexp1) => {
                        datavalue[indexP]["cost"].push({ "cost": formFieldData["cost-1_" + indexP + "_" + indexp1] })
                    })

                    i++;
                })
            }
            if (index === 3) {
                data&&data.map((item, indexP) => {
                    //datavalue.push({"juelType":item})
                    item.map((data, indexp1) => {
                        datavalue[indexP]["taxPerPrice"].push({ "taxPerPrice": formFieldData["taxPerPrice-1_" + indexP + "_" + indexp1] })
                    })

                    i++;
                })
            }
            if (index === 3) {
                data&&data.map((item, indexP) => {
                    //datavalue.push({"juelType":item})
                    item.map((data, indexp1) => {
                        datavalue[indexP]["finalPrice"].push({ "finalPrice": formFieldData["finalPrice-1_" + indexP + "_" + indexp1] })
                    })

                    i++;
                })
            }



        })

        let finalData = []
       let isFromDateChanged =  datesAreOnSameDay(new Date(fromDate),new Date(formFieldData['validFrom']))
       let isToDateChanged =  datesAreOnSameDay(new Date(toDate),new Date(formFieldData['validTo']))
        let data2 = {
            "TransType": (selectedFuelData && selectedFuelData.data && selectedFuelData.data.addNewUser)? "Add" : "Edit",
            "FBO": formFieldData['name'],
            "CreatedBy": Storage.getItem('email'),
            "ValidFrom": getFormattedYYMMDD(formFieldData['validFrom']),
            "ValidTo": getFormattedYYMMDD(formFieldData['validTo']),
            "AirportLocation": [{
                "Location": formFieldData['primaryLocation'],
                "FuelTypes": []
            }
            ]
        }
        datavalue.map((item, index) => {
            let data = {
                "Name": item.fuelType,
                "PricingType": item.baseFuel.length > 1 ? "Tiered" : "flat",
                "Tiers": []

            }
            item.baseFuel.map((itemP, indexp) => {
                let data1 = {

                    "Name": "Tier " + parseInt(indexp) + parseInt(1),

                    "MinRange": minRangeData[index][indexp],

                    "MaxRange": maxRangeData[index][indexp],

                    "BasePrice": item.baseFuel[indexp].baseFuel,

                    "CostPlus": item.cost[indexp].cost,

                    "PreTaxPrice": item.taxPerPrice[indexp].taxPerPrice,

                    "FinalPrice": item.finalPrice[indexp].finalPrice,

                    "LastWeekPrice": "0.00"

                }
                data.Tiers.push(data1)
            })
            data2["AirportLocation"][0]["FuelTypes"].push(data)
        })



        return data2;
    }
    const clickDeactivate = (data) => {
        setModalText(fieldList.length && fieldList[0].sections.modal[0].deactivate.text)
        setShowDeactivate(true);
        document.getElementById('root').style.filter = 'blur(5px)';
        //setDeactivateData(data)
    }

    const submitData = (data) => {
        let saveData = dataForReview;
        if (data === 'cancel') {
            setModalDataShow(false)
            document.getElementById('root').style.filter = 'none';
        } else {
            
            saveFinalData(saveData)
            
        }

    }

    const saveFinalData = (saveData) => {
        addNewFuelPriceService(saveData).then(res => {
            let activity = state.addNewUser === true?"Fuel Price Added For Week "+getFormattedMMDD(saveData["ValidFrom"])+" to "+getFormattedMMDD(saveData['ValidTo']):"Fuel Price Updated For Week "+getFormattedMMDD(saveData["ValidFrom"])+" to "+getFormattedMMDD(saveData['ValidTo'])
            let auditPayload = {"ModuleName":"Fuel Price",
                              "TabName":"Add new fuel",
                              "Activity":activity,
                              "ActionBy":Storage.getItem('email'),
                              "Role":JSON.parse(Storage.getItem('userRoles')),
                              "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
                    saveAuditLogData(auditPayload, dispatch)
            document.getElementById('root').style.filter = 'none';
            if(!selectedFuelData.data.addNewUser){
            let payload = {}
            payload.type = "create"
            payload.notificationMessage = fieldList[0]?.sections?.notifyMessage.msg1+loggedInUser+fieldList[0]?.sections?.notifyMessage.msg2+saveData.AirportLocation[0].Location+"."
            payload.organizationName = selectedCompanyValue.company
            payload.loginUserName = loggedInUser
            payload.sendNotificationTo = "ORG Internal"
            payload.access_levels = ["Level 1 (Admin)"]
            payload.levelOfAccess = access.includes('Super') ? "Level 1 (Admin)" : access.includes('Admin') ? "Level 2 (Standard)" : "Level 3 (Basic)"
            payload.isActionable = false
            payload.actionTaken = ""
            payload.category = "account"
            payload.readInd = false
            saveNotificationList(payload,dispatch).then((res)=>{
  
            })
            payload = {}
            payload.type = "create"
            payload.notificationMessage = fieldList[0]?.sections?.notifyMessage.msg1+loggedInUser+fieldList[0]?.sections?.notifyMessage.msg2+saveData.AirportLocation[0].Location+"."
            payload.organizationName = selectedCompanyValue.company
            payload.loginUserName = loggedInUser
            payload.sendNotificationTo = "ORG Internal"
            payload.access_levels = ["Level 2 (Standard)","Level 3 (Basic)"]
            payload.levelOfAccess = access.includes('Super') ? "Level 1 (Admin)" : access.includes('Admin') ? "Level 2 (Standard)" : "Level 3 (Basic)"
            payload.isActionable = false
            payload.actionTaken = ""
            payload.category = "account"
            payload.readInd = false
            payload.location = [saveData.AirportLocation[0].Location]
            saveNotificationList(payload,dispatch).then((res)=>{
  
            })
            }else{
                let payload = {}
                payload.type = "create"
                payload.notificationMessage = fieldList[0]?.sections?.notifyMessage.msg3+selectedCompanyValue.company+fieldList[0]?.sections?.notifyMessage.msg4+loggedInUser+fieldList[0]?.sections?.notifyMessage.msg2+saveData.AirportLocation[0].Location+"."
                payload.organizationName = selectedCompanyValue.company
                payload.loginUserName = loggedInUser
                payload.sendNotificationTo = "ORG Internal"
                payload.access_levels = ["Level 1 (Admin)"]
                payload.levelOfAccess = access.includes('Super') ? "Level 1 (Admin)" : access.includes('Admin') ? "Level 2 (Standard)" : "Level 3 (Basic)"
                payload.isActionable = false
                payload.actionTaken = ""
                payload.category = "account"
                payload.readInd = false
                saveNotificationList(payload,dispatch).then((res)=>{
      
                })
                payload = {}
                payload.type = "create"
                payload.notificationMessage = fieldList[0]?.sections?.notifyMessage.msg3+selectedCompanyValue.company+fieldList[0]?.sections?.notifyMessage.msg4+loggedInUser+fieldList[0]?.sections?.notifyMessage.msg2+saveData.AirportLocation[0].Location+"."
                payload.organizationName = selectedCompanyValue.company
                payload.loginUserName = loggedInUser
                payload.sendNotificationTo = "ORG Internal"
                payload.access_levels = ["Level 2 (Standard)","Level 3 (Basic)"]
                payload.levelOfAccess = access.includes('Super') ? "Level 1 (Admin)" : access.includes('Admin') ? "Level 2 (Standard)" : "Level 3 (Basic)"
                payload.isActionable = false
                payload.actionTaken = ""
                payload.category = "account"
                payload.readInd = false
                payload.location = [saveData.AirportLocation[0].Location]
                saveNotificationList(payload,dispatch).then((res)=>{
      
                })
            }
            navigate(`/dashboard/fuel-pricing`,{state:{companyName :selectedCompanyValue && selectedCompanyValue.company? selectedCompanyValue.company:Storage.getItem('organizationName')}})
            if (res.statusCode) {
                if (res.statusCode == 200) {
                    
                    //setIsSuccess(true);
                    //setModalText(fieldList.length && fieldList[0].sections.modal[0].successModal.paragraph)
                    //sendEmails();
                    setdisable(true)
                }
                else {
                    //setModalText(res.data.accountRegister);
                }
            }
            else {
                //setModalText("server error");
            }
            setShow(true);
            setModalDataShow(false)

        })
    }

    const getFatNumberValidation = (newVal,oldVal) => {
        let val = (systemVariables.Fat_Finger_Threshold*oldVal)/100;
        let percentileValPlus8 = (parseFloat(oldVal) + parseFloat(val)).toFixed(2)
        let percentileValMinus8 = (parseFloat(oldVal) - parseFloat(val)).toFixed(2)
        if(newVal != oldVal && oldVal>0 && ((parseFloat(newVal) >= percentileValPlus8) || (parseFloat(newVal) <= percentileValMinus8))){
            return true

        } else return false;

      }

    const handleClick = (e, item, index) => {
        if (item.name === "cancel") {
            navigate(`/dashboard/fuel-pricing`,{state:{companyName :selectedCompanyValue && selectedCompanyValue.company ? selectedCompanyValue.company:Storage.getItem('organizationName')}})
        } else {
            let isFormValid
            const fieldValidationErrors = {
                ...formErrors
            };
            let resultArray = []
            /* if(selectedFuelData && selectedFuelData.data && selectedFuelData.data.addNewUser !== true){
                Object.keys(formFieldData).forEach((fieldName) => {
                    if(fieldName.includes("baseFuel-")){  
                        
                         if(getFatNumberValidation(formFieldData[fieldName], allBasePrice[fieldName])){
                            resultArray.push(true);
                        } 
                        
                    } else 
                    if(fieldName.includes("cost-")){
                         if(getFatNumberValidation(formFieldData[fieldName], allCostPrice[fieldName])){
                            resultArray.push(true);
                        } 
                    } 
                })
            } */
            
            calculatedWeeklyPrice.map((item, index) =>{
                item && item.map((innerItem, innerIndex)=>{
                    if(getFatNumberValidation(formFieldData["taxPerPrice-1_" + index +"_"+ innerIndex],innerItem)){
                        resultArray.push(true)
                        document.getElementById("taxPerPrice-1_" + index +"_"+ innerIndex).style.border = "1px solid #A30000";
                    } else {
                        document.getElementById("taxPerPrice-1_" + index +"_"+ innerIndex).style.border = "0px";
                    }
                })
                
            })

           
             //formFieldData.forEach((val,index)=>{ setValidToDate setValidFromDate validFrom validTo
            Object.keys(formFieldData).forEach((fieldName) => {
                if(fieldName === "validFrom"){
                    validateField(
                        fieldName,
                        formFieldData[fieldName],
                        { [fieldName]: formFieldData[fieldName] },
                        true,
                        formErrors, validFromDate
                    );

                } else if(fieldName === "validTo") {
                    validateField(
                        fieldName,
                        formFieldData[fieldName],
                        { [fieldName]: formFieldData[fieldName] },
                        true,
                        formErrors, validToDate
                    );

                } else {
                    validateField(
                        fieldName,
                        formFieldData[fieldName],
                        { [fieldName]: formFieldData[fieldName] },
                        true,
                        formErrors, formData
                    );
                }
                
            })
            //})
            isFormValid = validateForm();

            if (isFormValid) {
                document.getElementById('root').style.filter = 'blur(5px)';
                let saveData = formSaveData();
                setDataForReview(saveData)
                //if(selectedFuelData && selectedFuelData.data && selectedFuelData.data.addNewUser !== true){
                  if(resultArray.length > 0){
                        setModalDataShow(true)
                        setFatValue(false)
                    }else
                    {
                        setFatValue(true)
                        setModalDataShow(true)
                        /* saveFinalData(saveData)
                        setdisable(true) */
                    }
                /* } else {
                    setModalDataShow(true)
                } */
            }
            else {
                setModalText(fieldList.length && fieldList[0].sections.modal[0].mandatoryModal.paragraph)
                setShow(true);
            }

        }

    }

    const [show, setShow] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [modalText, setModalText] = useState();
    const handleClose = () => {
        setShow(false);
        if (isSuccess) {
            setIsSuccess(false);
            //navigate('/admin');
        }
        document.getElementById('root').style.filter = 'none';
    }
    const handleShowHideAccordion = () => {
        setShowtaxnfees(!showtaxnfees);
    }
    const renderModal = (modal) => {
        let modalData = modalText;
        document.getElementById('root').style.filter = 'blur(5px)';
        return (
            <CustomModal
                show={show}
                onHide={handleClose}
                modelBodyContent={modalData}
                buttonText={fieldList.length && fieldList[0].sections.modal[0].mandatoryModal.primaryButton.text}
            />
        );
    };
    const renderDeactivateModal = (modal) => {
        let modalData = modalText;
        document.getElementById('root').style.filter = 'blur(5px)';
        return (
            <CustomModal
                show={showDeactivate}
                close={(e) => closeModal(e)}
                hide={(e) => closeModal(e)}
                onHide={(e) => handleClick(e, { name: "deactive" })}
                modelBodyContent={modalData}
                buttonText={fieldList.length && fieldList[0].sections.modal[0].deactivate.button1}
                secondbutton={fieldList.length && fieldList[0].sections.modal[0].deactivate.button2}
            />
        );
    };

    const getSevenDaysFromToday = () => {

    }

    useEffect(() => {
        if(priceDriver=='manual'){
            setRetailDisable(false)
        }else{
            setRetailDisable(true)
        }
        let data =fieldList && fieldList[0]?.sections?.retailPriceJson;
        if(isFlat && priceDriver!=='manual'){
            data = data?.fields.filter((m)=>
            m.dynamicValue.includes('flat')
          )
        }else{
            data = data?.fields.filter((m)=>
            m.dynamicValue.includes(priceDriver)
          )
        } 
          let newData={}
          newData['fields']= data && data
          setPopUpInitialState(newData,oldFormula)
          setpopUpJson(newData)
      }, [priceDriver])

    const setPopUpInitialState = (fboData,old) => {
        let formData = {};
        const fieldTypeArr = ['input', 'select','textarea'];
    
        fboData && fboData?.fields?.forEach((item) => {
            if (fieldTypeArr.includes(item.component.toLowerCase())) {
                formData[item.name] =retailDataSet && retailDataSet[item.name]? retailDataSet[item.name]: old && retailPriceFormula && retailPriceFormula[item.name]? retailPriceFormula[item.name]:item.defaultValue ? item.defaultValue : "";
            }
        })
        calculateRetailPrice(formData);
      }

    const calculateRetailPrice=(fieldData)=>{
        let priceData={...formDataSet}
        let whole=wholeData
        let formula=fieldData?.Formula;
        let value=fieldData?.Value =='' ? 0 : fieldData?.Value;
        let driver=fieldData?.PriceDriver;
        if(driver=='Manual'){
            setretailDataSet(fieldData)
        }else{
            let retail=0;
            let finalPriceArr=[];
            let preTaxPrice=[];
            if(whole && whole.length && whole[0]?.length && whole[0][0]=='Jet A'){
                Object.keys(priceData).forEach((name)=>{
                    if(name.includes('finalPrice-1_0')){
                        finalPriceArr.push(parseFloat(priceData[name]))
                    }else if(name.includes('taxPerPrice-1_0')){
                        preTaxPrice.push(parseFloat(priceData[name]))
                    }
                })
                if(formula?.includes('Base Price') && formula?.includes('Lowest Tier')){
                    retail=parseFloat(value)+Math.min(...preTaxPrice)
                }else if(formula?.includes('Base Price') && formula?.includes('Highest Tier')){
                    retail=parseFloat(value)+Math.max(...preTaxPrice)
                }else if(formula?.includes('Final Price') && formula?.includes('Lowest Tier')){
                    retail=parseFloat(value)+Math.min(...finalPriceArr)
                }else if(formula?.includes('Final Price') && formula?.includes('Highest Tier')){
                    retail=parseFloat(value)+Math.max(...finalPriceArr)
                }else if(formula=='Final Price +'){
                    retail=parseFloat(value)+finalPriceArr[0]
                }else if(formula=='Base Price +'){
                    retail=parseFloat(value)+preTaxPrice[0]
                }
            }else{
                retail+=parseFloat(value)
            }
            fieldData['RetailPrice']=retail;
            setretailDataSet(fieldData)
        }
    }  
    const onHandleChange= (e,item)=>{
        let fieldName,fieldValue;
        let formfields={...retailDataSet}
        fieldName = item.name;
        fieldValue = e.target.value;
        if(fieldName=='PriceDriver'){
            setOldFormula(false)
            setPriceDriver(fieldValue?.toLowerCase())
        }
        if(fieldName=='Value' || fieldName=='RetailPrice'){
            fieldValue=validateAmount({"unit":"%"},fieldValue);
        }
        formfields[item.name]=fieldValue;
        calculateRetailPrice(formfields)
    }  
    const onHandleBlur= (e,item)=>{
    
    }

    const setRetailPrice = ()=>{
        let whole=wholeData
        if(whole && whole.length && whole[1]?.length && whole[1][0].length==1 && whole[0][0]=='Jet A'){
            setIsFlat(true)
        }
        if(retailPriceFormula){
            setOldFormula(true)
            setPriceDriver(retailPriceFormula.PriceDriver?.toLowerCase())
        }else{
            setPriceDriver('cost +')
        }
        seteditModalShow(true)
    }

    const onClickSubmit=()=>{
        let payload={...retailDataSet}
        payload.organizationName=formDataSet?.name;
        payload.location=formDataSet?.primaryLocation;
        payload.LoggedinUser=loggedInUser;
        setsubmittedForm(true)
        saveRetailPrice(payload).then((res)=>{
            setsubmittedForm(false)
            if(res){
                if(res[0][0]?.Msg=='Record(s) process successfully'){
                    closeEditModal()
                    setRetailPriceFormula(retailDataSet)
                }
            }else{
                setpopUpModalText('Server Error')
            }
        })
    }
    const closeEditModal =()=>{
        seteditModalShow(false)
        setRetailDisable(true)
        setOldFormula(false)
        setPriceDriver('')
        setIsFlat(false)
        setpopUpModalText('')
        setretailDataSet({})
        document.getElementById('root').style.filter = 'none';
      }

    const getOperatorFields2 = (item, index, flag) => {
        
        switch (item.component.toUpperCase()) {

            case "INPUT":

                return (<Input
                    colWidth={item.styles ? item.styles.colWidth : ""}
                    Type={item.type}
                    Label={item.label}
                    data-label={item.label}
                    Name={item.name}
                    id={item.name}
                    disabled={item.name === 'name' ? true : item.disabled && disable ? true : false}
                    Placeholder={item.placeholder}
                    isRequred={item.isRequired}
                    maxLength={item.maxLength}
                    minLength={item.minLength}
                    handleChange={(e) => handleChange(e, item, index, flag)}
                    handleBlur={(e) => handleBlur(e, item, index, flag)}
                    styles={item.styles}
                    tooltip={item.tooltip}
                    fieldError={
                        formErrors &&
                        formErrors[item.name] && !formErrors[item.name].isValid
                        && (
                            formErrors[item.name].isTouched
                        )
                    }
                    errorMessage={
                        formErrors
                        && formErrors[item.name]
                            .activeValidator
                            .errorMessage
                    }
                    formDataSet={formFieldData ? formFieldData[item.name] : ''}
                />)
            case "SELECT":
                return (<Select
                    colWidth={3}
                    Type={item.type}
                    Label={item.label}
                    Placeholder={item.placeholder}
                    disabled={item.name === 'name' ? true : item.disabled && disable ? true : false}
                    dynamicSelect={item.dynamicSelect}
                    lookupReference={item.dynamicSelect ? item.lookupReference : null}
                    isRequred={item.isRequired}
                    Options={item.name === "primaryLocation" ? optionList : companyList}
                    Name={item.name}
                    handleChange={(e) => handleChange(e, item, index, flag)}
                    handleBlur={(e) => handleBlur(e, item, index, flag)}
                    dependentField={item.dependentField}
                    filterLocation={filterLocation}
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
                    formDataSet={formFieldData && formFieldData[item.name] ? formFieldData[item.name] : item.defaultValue ? item.defaultValue : ''}
                />)

            case "BUTTON":

                return (<ButtonComponent
                    Label={item.label}
                    Type={item.type}
                    Name={item.name}
                    className={item.styles.className}
                    disabled={item.disabled && disable ? true : false}
                    handleClick={(e) => handleClick(e, item, index)} />)


            case "PARAGRAPH":
                let array = []
                return (<>
                    <Subheading label={item.label}
                        isEditable={false}
                        EnableEdit={makeEditable}
                        isAccessAble={getAccessLevel(Storage.getItem('userType'),
                            Storage.getItem('accessLevel'))}
                        isClear={item.isClear && isRetail}
                        clearData = {clearAllData}
                        setRetailPrice = {setRetailPrice}
                        item={item}
                    /></>

                )
            case "DATE":
                return (<>
                    <DatePicker
                        colWidth={item.styles ? item.styles.colWidth : ""}
                        styles={item.styles}
                        Name={item.name}
                        isRequired={item.isRequired}
                        handleChange={(e) => handleChange(e, item, index, true)}
                        handleBlur={(e) => handleBlur(e, item, index, true)}
                        Label={item.label}
                        currentValue = {item.name == 'validFrom'&& ActiveTierExpiryDate ? ActiveTierExpiryDate :formFieldData['validFrom'] ? formFieldData['validFrom']:item.name == 'validTo'?ActiveTierExpiryDate?ActiveTierExpiryDate:formFieldData['validFrom']:  new Date()}

                        /* MinDate={item.name == 'validTo'? (ActiveTierExpiryDate !== null ? new Date(ActiveTierExpiryDate)  :(formFieldData['validFrom'] && formFieldData['validFrom'] !== 'NaN/NaN/NaN' && formFieldData['validFrom'] != null) ? formFieldData['validFrom']  :  new Date()) : item.name == 'validFrom'&& ActiveTierExpiryDate!== null ? new Date(ActiveTierExpiryDate) :  formFieldData['validFrom']} */

                        MinDate={item.name == 'validTo'? selectedFuelData && selectedFuelData.data && selectedFuelData.data.addNewUser == false && formFieldData['validTo']!== null?new Date(formFieldData["validTo"]):(formFieldData['validFrom'] && formFieldData['validFrom'] !== 'NaN/NaN/NaN' && formFieldData['validFrom'] != null) ?formFieldData['validFrom'] : new Date() : 
                        
                        
                        item.name == 'validFrom'? fromDate !== null?fromDate:ActiveTierExpiryDate && ActiveTierExpiryDate !== 'NaN/NaN/NaN' &&ActiveTierExpiryDate!== null ? new Date(ActiveTierExpiryDate) : formFieldData[item.name] ?formFieldData[item.name]:new Date(): null}

                        MaxDate={item.name == 'validTo'? formFieldData['validFrom'] && formFieldData['validFrom'] !== 'NaN/NaN/NaN' && formFieldData['validFrom'] != null?new Date(formFieldData['validFrom']).setDate(new Date(formFieldData['validFrom']).getDate() + 30): new Date(ActiveTierExpiryDate).setDate(new Date(ActiveTierExpiryDate).getDate() + 30) 
                        
                        :item.name == 'validFrom' ? ActiveTierExpiryDate && ActiveTierExpiryDate !== null  ? new Date(ActiveTierExpiryDate +30) : new Date().setDate(new Date().getDate() + 30) 
                        :item.name == 'validFrom' && (formFieldData['validTo'] !== 'NaN/NaN/NaN' && formFieldData['validTo'] != null) ? formFieldData['validTo'] : formFieldData['validFrom'] !== null?new Date(formFieldData['validFrom']).setDate(new Date(formFieldData['validFrom']).getDate() + 30): new Date().setDate(new Date().getDate() + 30)}



                        disabled = {item.name == 'validFrom' && selectedFuelData && selectedFuelData.data && selectedFuelData.data.addNewUser === false? selectedFuelData.data.screen === "archive"? false:true:false}
                        disableFuture={false}
                        fieldError={
                            formErrors &&
                            formErrors[item.name] && !formErrors[item.name].isValid
                            && (
                                formErrors[item.name].isTouched
                            )
                        }
                        errorMessage={
                            formErrors
                            && formErrors[item.name]
                                .activeValidator
                                .errorMessage
                        }
                        /* value={formFieldData["primaryLocation"] == null?null:item.name == 'validFrom'? ActiveTierExpiryDate!== null ? new Date(ActiveTierExpiryDate):formFieldData && formFieldData[item.name] && formFieldData[item.name]!== null ?formFieldData[item.name]: item.name == 'validTo'?
                        (formFieldData && formFieldData[item.name] && formFieldData[item.name]!== null)
                        ?formFieldData[item.name]:ActiveTierExpiryDate ? new Date(ActiveTierExpiryDate): new Date()} */
                        value={formFieldData["primaryLocation"] == null?null: 
                        item.name == 'validFrom' ? fromDate?fromDate:formFieldData && formFieldData["validFrom"] && formFieldData["validFrom"]!== null?formFieldData["validFrom"]: null
                        
                        :item.name == 'validTo'?formFieldData && formFieldData["validTo"] && formFieldData["validTo"]!== null &&formFieldData["validTo"]:ActiveTierExpiryDate ? new Date(ActiveTierExpiryDate): new Date()}

                    /></>

                )

        };
    }

    const makeEditable = () => {
        //alert("ll")
        setdisable(false)
    }
    const closeModal = (e) => {
        setModalDataShow(false)
        setShowDeactivate(false)
        document.getElementById('root').style.filter = 'none';
    }
    const accept = () => {
        if (modalText === operatorSignup.modal[0].termsmodal.paragraph) {
            //setbtnDisable(false)
        }
        setModalDataShow(false)
    }
    const getTaxAndFeeDetails = (data, iddata) => {
         
        let multiLineData = ''
        data&&data.forEach((ele, index) => {
            multiLineData += `<div id=${iddata+"_"+index} title=${ele}>${ele}</div>`
        })
        return <div className='bf-accordion-tax-details'>{parse(multiLineData)}</div>
    }

    const getInput = (item, name, disable, label) => {
        if(item){
            if (typeof item === 'object') {
                item.name = name
            }
             item.styles = { "className": "" }
            if (item?.name?.includes('weeklyChanges-')) {
                if (formFieldData[item.name] && formFieldData[item.name] !== "") {
                    if (formFieldData[item.name].replace('%', '') > 0) {
                        item.styles = { "className": "bf-fee-positive" }
                    } else if(formFieldData[item.name].replace('%', '') < 0){
                        item.styles = { "className": "bf-fee-negative" }
                    }
                }
    
            }
    
            return (<Input
                colWidth={"md3"}
                Type="text"
                Label={""}
                data-label="text"
                Name={item?.name}
                id={item?.name}
                handleChange={(e) => handleChange(e, item)}
                handleBlur={(e) => handleBlur(e)}
                styles={item?.styles}
                tooltip=""
                disabled={disable ? "disabled" : false}
                showTitle={true}
                //val={item.taxVal ? item.taxVal : null}
                fieldError={
                    formErrors &&
                    formErrors[item?.name] && !formErrors[item?.name].isValid
                    && (
                        formErrors[item?.name].isTouched
                    )
                }
                errorMessage={
                    formErrors && formErrors[item?.name] && formErrors[item?.name]
                        .activeValidator
                        .errorMessage
                }
                formDataSet={formFieldData ? formFieldData[item?.name] : ''}
            />)
        }
        
    }
    const hidePopup = () => {
        setModalDataShow(false)
        setrefresh(Math.random())
    }
    return (<>
        {isBusy ? (<Loader />) : (
            <div className='bf-flex-h100 d-flex d-flex-row'>
                <div className={`bf-edit-fuel-pricing-container login-form d-flex d-flex-column`}>
                    <div className='bf-head-label'>{selectedFuelData && selectedFuelData.data && selectedFuelData.data.addNewUser === true ? "New Fuel Pricing" : selectedFuelData && selectedFuelData.data && selectedFuelData.data.screen?"New Fuel Pricing": "Edit Fuel Price"}</div>


                    <Container className='bf-edit-fuel-pricing row'>
                        {fieldList && fieldList.length > 0 && fieldList[0].sections && fieldList[0].sections.subSections[0].companyFieldsArray[0].fields.map((item, jsonIndex) => {
                            if (jsonIndex == 0) {
                                return (
                                    <div>{getOperatorFields2(item)}</div>
                                )
                            }
                        })}
                        <div className='d-flex d-flex-row'>
                            {fieldList && fieldList.length > 0 && fieldList[0].sections && fieldList[0].sections.subSections[0].companyFieldsArray[0].fields.map((item, jsonIndex) => {
                                if (jsonIndex > 0 && item.type !== 'subheading') {
                                    return (
                                        getOperatorFields2(item)
                                    )
                                }
                            })}
                        </div>
                        {fieldList && fieldList.length > 0 && fieldList[0].sections && fieldList[0].sections.subSections[0].companyFieldsArray[0].fields.map((item, jsonIndex) => {
                            if (item.label == 'Fuel Price*') {
                                return (
                                    <div>{getOperatorFields2(item)}</div>
                                )
                            }
                        })}

                        {wholeData&&wholeData.length > 0 ?
                            <div className={`bf-fuel-price-details bf-col-${oilTypeCount}`}>
                                {
                                    wholeData && wholeData.map((item, index) => {

                                        if (index === 0) {

                                            return (<Row className="bf-oil-types"><Col></Col>{
                                                item&&item.map((data, oiltypeIndex) => {
                                                    return (<Col className='align-item-center justify-content-center' style={{ "width": wholeClass * inputDataList[oiltypeIndex] + '%' }}> {getLableForHeader(data)} </Col>)
                                                })

                                            }
                                            </Row>)
                                        } else if (index === 1 || index === 2) {
                                            return (<Row className="bf-base-fuel-cost"><Col>{index === 1 ? "Base Fuel" : "Cost +"}</Col>{
                                                item&&item.map((data, index2) => {
                                                    return (<Col data-leng={`asdf - ${inputDataList}`} style={{ "width": wholeClass * inputDataList[index2] + '%' }}>
                                                        {data&&data.map((item, indexC) => {
                                                            return (<div style={{"width": "100%"}}>{getInput(fieldList && fieldList.length > 0 && fieldList[0].sections && fieldList[0].sections.subSections[1].fuelPrice, index === 1 ? "baseFuel-" + index + "_" + index2 + "_" + indexC : "cost-1_" + index2 + "_" + indexC, false)}</div>)
                                                        })} </Col>)
                                                })

                                            }
                                            </Row>)
                                        } else if (index >= 5) {
                                            return (<div className={`row bf-add-fuel-taxes-fees ${showtaxnfees ? 'bf-showtaxnfees' : 'bf-hidetaxnfees'} ${taxList > 6 ? 'bf-taxList6plus' : 'bf-taxlist-'+taxList }`}>{
                                                
                                                item&&item.map((data, fueltaxfeeIndex) => {
                                                    if (index === 0) {
                                                        return (<Col> {data} </Col>)
                                                    } else {
                                                        return (<Row className='bf-add-fuel-tax-sec'>
                                                            {data&&data.map((dataP, indexP) => {
                                                                return (<Col style={{ "width": (indexP == 0 ? '15%' : 'calc('+wholeClass * inputDataList[indexP - 1] + '% + 10px)') }}>
                                                                    {
                                                                        indexP == 0 ? dataP :
                                                                            getTaxAndFeeDetails(dataP, "tax_fee_unit-"+fueltaxfeeIndex+"_"+(parseInt(indexP)-1))
                                                                    }
                                                                </Col>)
                                                            })}
                                                        </Row>)
                                                    }
                                                })

                                            }
                                            </div>)
                                        }
                                        else if (index === 4) {
                                            return (<Row className={`bf-tax-fees-accordion ${showtaxnfees ? 'bf-expanded-accordion' : ''}`}>{
                                                item&&item.map((data, fueltaxfeeIndex) => {
                                                    if (fueltaxfeeIndex === 0) {
                                                        return (<Col className='bf-accordion-column' onClick={handleShowHideAccordion}>
                                                            {showtaxnfees ? <IoIosArrowDropupCircle className='bf-primary-color' /> : <IoIosArrowDropdownCircle className='bf-primary-color' />} {data} </Col>)
                                                    } else {
                                                        return (<Col style={{ "width": wholeClass * inputDataList[fueltaxfeeIndex - 1] + '%' }}>
                                                            {data&&data.map((dataP, indexP) => {
                                                                // return(<Col><div class=" mb-4 col-md-md3"><div className="mb-3 input-group bf-block">{dataP}</div></div></Col>)
                                                                return (<Col>{getInput({ "taxVal": dataP, }, "tax_Fee_1_" +(parseInt(fueltaxfeeIndex)-1)+"_"+indexP, true)}</Col>)
                                                            })}
                                                        </Col>)
                                                    }
                                                }) 
                                            }
                                            </Row>)

                                        }
                                        else {
                                            return (<Row className="bf-pertax-price"><Col>{"Pre-Tax Price"}</Col>{
                                                item && item.map((data, index2) => {

                                                    return (<Col style={{ "width": wholeClass * inputDataList[index2] + '%' }}>

                                                        {data && data.map((item, indexC) => {
                                                            return (<Col>{getInput(fieldList && fieldList.length > 0 && fieldList[0].sections && fieldList[0].sections.subSections[2].finalPrice, "taxPerPrice-1_" + index2 + "_" + indexC, true)}</Col>)
                                                        })} </Col>)
                                                })


                                            }
                                            </Row>)
                                        }
                                    })
                                }
                                {wholeData && wholeData.map((item, index) => {
                                    if (index === 1) {

                                        return (<Row className="bf-final-price"><Col>{"Final Price"}</Col>{
                                            item&&item.map((data, index2) => {
                                                return (<Col style={{ "width": wholeClass * inputDataList[index2] + '%' }}>

                                                    {data && data.map((item, indexC) => {
                                                        return (<Col>{getInput(fieldList && fieldList.length > 0 && fieldList[0].sections && fieldList[0].sections.subSections[1].fuelPrice, "finalPrice-" + index + "_" + index2 + "_" + indexC,true)}</Col>)
                                                    })} </Col>)
                                            })

                                        }
                                        </Row>)

                                    }

                                })


                                }
                                {wholeData && wholeData.map((item, index) => {
                                    if (index === 1) {

                                        return (<Row className='bf-weekly-charges'><Col>{"Weekly Changes"}</Col>{
                                            item&&item.map((data, index2) => {
                                                return (<Col style={{ "width": wholeClass * inputDataList[index2] + '%' }}>

                                                    {data&&data.map((item, indexC) => {
                                                        return (<Col>{getInput(fieldList && fieldList.length > 0 && fieldList[0].sections && fieldList[0].sections.subSections[1].fuelPrice, "weeklyChanges-" + index + "_" + index2 + "_" + indexC, true)}</Col>)
                                                    })} </Col>)
                                            })

                                        }
                                        </Row>)

                                    }

                                })


                                }
                                <div className='bf-addFuel-buttons'>
                                    {fieldList && fieldList.length > 0 && fieldList[0].sections && fieldList[0].sections.subSections[4].buttons.map((item) => (
                                        <>
                                            {getOperatorFields2(item)}
                                        </>))}
                                </div>
                            </div> : ""}
                            <div className='bf-absolute-usd'>{"*All Values are in USD"}</div>
                        </Container>

                    {show ? renderModal() : null}
                    {showDeactivate ? renderDeactivateModal() : null}




                </div>

            </div>)}
        {<CustomFormModal
            show={modalDataShow}
            onHide={() => accept()}
            hide={() => closeModal()}
            title={""}
            size={"lg"}
            componentName={"ReviewAddNewFuel"}
            modelBodyContent={<ReviewAddNewFuel />}
            buttonText={"Save"}
            secondbutton={() => closeModal()}
            DataForReview={dataForReview}
            hidePopup={hidePopup}
            submitData={submitData}
            addNewUser={fatValue}
            location = {location}
        />}
        {editmodalShow?<EditFormModal
         onHide={() => closeEditModal()}
         formdata={retailDataSet}
         show={editmodalShow}
         json={popUpJson && popUpJson}
         onHandleChange={onHandleChange}
         onHandleBlur={onHandleBlur}
         onClickSubmit={onClickSubmit}
         showError = {popUpModalText}
        submittedForms = {submittedForm}
        customButtons={true}
        primaryButtonText={"Submit"}
        customOptions={true}
        retailDisable={retailDisable}
        warningMessage = {fieldList && fieldList[0]?.sections?.retailPriceWarningMessage?.text}
    />:""}
    </>
    );
}
export default AddNewFuel;