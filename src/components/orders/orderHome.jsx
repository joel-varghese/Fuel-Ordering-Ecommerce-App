import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getTailNumbersList } from '../../actions/clientPortal/discountAction'
import { fetchOrderJsonData, getFromLocation, getIsReorder,getFuelInfo, getIsPricePending, getIsSummary, getLegData, getLegLevel, getLegType, getMultipleLeg, getUUID, saveOrderData ,clearAll, getMultiLegPricePending, getIsEditSingle, getIsOrderClose, getIsEditMultiple, getIsPreviousScreen, getIsMultiSummary} from '../../actions/orderPlacementActions/orderPlacementActions'
import { getDiscounts, getFedTaxes, getOperatorsByTailNum } from '../../actions/orderPlacementActions/orderPlacementService'
import Orderdata from './orderdata'
import './orderHome.scss'
import OrderSummary from './orderSummary'
import OrderView from './orderView'
import OrderViewHome from './orderViewHome'
import CustomModal from '../customModal/customModal';
import uuid from 'react-uuid';
import MultiLegData from './multiLegData'
import EditFormModal from '../customModal/editModal'
import { accountCompanyEditService } from '../../actions/accountServices/accountCompanyService'
import { saveNotificationList } from '../../actions/notificationService/notificationAction'
import { flightInformationService } from '../../actions/tailNumberService/tailNumberService'
import { getEditLegData, getIsEdit } from '../../actions/orderPlacementActions/multiLegActions'
import { fetchFuelLocations, fetchFuelResult, setMobileOrderDetails } from '../../actions/searchFuelOrder/searchFuelOrderActions'
import { camelize, getFieldIsValid, getFormattedMMDDYY, getFormattedYYMMDD, validateAmount, validateAmountForFive} from '../../controls/validations';
import { Modal } from 'bootstrap'
import ReactRouterPrompt from "react-router-prompt";

import { getOrderTab } from '../../actions/orderActions/orderCompletedAction'
import { sender_Email } from '../../controls/commonConstants';
import { SendMailToUsers } from '../../services/commonServices';
import Radio from '../radio/radio'
import { cancelDeclineOrder, getFboUsers } from '../../actions/orderActions/activeOrderService'
import Invoice from './invoice'
import html2pdf from 'html2pdf.js'
import AccordionModal from '../customModal/accordionModal'
import CustomProfileModal from '../myProfile/customProfileModal'

import {saveAuditLogData } from '../../actions/auditLog/auditLogActions';
import { Storage } from '../../controls/Storage';
import Loader from '../loader/loader'
import History from '../history/history'
import { getMobileHeaderText } from '../../actions/commonActions/commonActions'
import { getSystemVariables } from '../../actions/accountAdminAction/adminService'
import {systemVariablesVal} from '../../actions/accountAdminAction/adminAction'

export default function OrderHome() {
    const [jsonData, setJsonData] = useState({});
    const [customTaxDataSet, setCustomTaxDataSet] = useState({});
    const [customTaxFormError, setCustomTaxFormError] = useState({});
    const [customJson, setCustomJson] = useState();
    const [cancelDeclineJson, setCancelDeclineJson] = useState({});
    const [userType, setUserType] = useState();
    const [jsonPayload, setJsonPayload] = useState({ 'blobname': 'ordersPlacementHome.json' });
    const [formDataSet, setFormDataSet] = useState({"unit":"Gallons"});
    const [tailResults, setTailResults] = useState([]);
    const [tailOptions,setTailOptions]= useState([]);
    const [searchType, setsearchType] = useState('')
    const [tailLoading, setTailLoading] = useState(false);
    const [tailSelected, setTailSelected] = useState([]);
    const [viewType, setViewType] = useState('');
    const [invoiceData, setInvoiceData] = useState()
    const [results, setresults] = useState([]);
    const [history,setHistory] = useState(false)
    const [isMobileHistory,setIsMobileHistory] = useState(false)
    const [summaryFlag ,setsummaryFlag] = useState(false);
    const [isAddress1Loading, setAddress1Loading] = useState(false);
    const [isCancelDecline, setIsCancelDecline] = useState(false);
    const [address1Selected, setAddress1Selected] = useState([]);
    const [summaryReorder, setSummaryReorder] = useState(false);
    const [arrivingFrom,setArrivingFrom] = useState("")
    const [editPopText,setEditPopText] = useState("")
    const [originalFuelList, setoriginalFuelList] = useState([])
    const [fedTaxes, setFedTaxes] = useState([]);
    const [allTaxes, setAllTaxes] = useState([]);
    const [fuelPrice, setFuelPrice] = useState(0);
    const [totalTaxValue, setTotalTaxValue] = useState(0);
    const [totalOrderValue, setTotalOrderValue] = useState(0);
    const [cardFee, setCardFee] = useState(0);
    const [subTotal, setSubTotal] = useState(0);
    const [totalServiceValue, setTotalServiceValue] = useState(0);
    const [totalValueDummy, setTotalOrderValueDummy] = useState(0);
    const [discounts, setDiscounts] = useState(0);
    const [services, setServices] = useState([]);
    const [unitValue, setUnitValue] = useState(1);
    const [tailNumber, setTailNumber] = useState();
    const [editMultiTailNumber, setEditMultiTailNumber] = useState();
    const [multiEdit, setMultiEdit] = useState(false);
    const [totalValue, setTotalValue] = useState();
    const [fuelCostSavings, setFuelCostSavings] = useState(0);
    const [gallonValue, setGallonValue] = useState(0);
    const [fuelTiers, setFuelTiers] = useState([]);
    const [disable,setdisable]=useState(false);
    const [serviceBusy, setServiceBusy] = useState(false);
    const [isBtnValidate,setbtnValidate]=useState(false);
    const [serviceUpdated,setServiceUpdated]=useState(false);
    const [appliedDiscounts,setAppliedDiscounts]=useState(false);
    const [modalText, setModalText] = useState('');
    const [modalShow, setModalShow] = useState(false);
    const [isOperator, setIsOperator] = useState(false);
    const [homeLoader, setHomeLoader] = useState(true);
    const [allowUpdate, setAllowUpdate] = useState(false);
    const [legDetails, setLegDetails] = useState([]);
    const [formErrors, setformErrors] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [formdata, setformdata] = useState({});
    const [flightErrors, setFlightErrors] = useState({});
    const [costPlus, setCostPlus] = useState(0);
    const [requestedOrg, setRequestedOrg] = useState("");
    const [multiOperators, setMultiOperators] = useState('multiple');
    const [operatorJsonData, setOperatorJsonData] = useState(false);
    const [operatorData, setOperatorData] = useState(false);
    const [requestedOperators, setRequestedOperators] = useState(false);
    const [requestedCompanyOptions, setRequestedCompanyOptions] = useState(false);
    const [requestedUser, setRequestedUser] = useState("");
    const [singleLegID, setSingleLegID] = useState(uuid());
    const [errorsCaptured, seterrorsCaptured] = useState(false);
    const [refresh,setRefresh] = useState(false);
    const [isValidForm,setIsValidForm] = useState(true);
    // const [isEdit, setIsEdit] = useState(false);
    const [editmodalShow, setEditModalShow] = useState(false);
    const [date, setDate] = useState(new Date());
    const [orderDetails, setOrderDetails] = useState({});
    const typeaheadRef = useRef(null);
    const [title,setModalTitle] = useState();
    const navigate = useNavigate()
    const orderPlacementReducer = useSelector((state)=>state.orderPlacementReducer);
    const orderViewHomeReducer = useSelector((state)=>state.orderViewHomeReducer);
    const orderJsonData = orderPlacementReducer?.orderPlacementJson?.data?.data;
    const multiLegData = orderPlacementReducer?.multiLegData?.data;
    const fromLocation = orderPlacementReducer?.fromLocation?.data;
    const isReorder = orderPlacementReducer?.isReorder?.data; // 
    const isEditSingle = orderPlacementReducer?.isEditSingle?.data;//
    const isEditMultiple = orderPlacementReducer?.isEditMultiple?.data;
    const isOrderClose = orderPlacementReducer?.isOrderClose?.data; //
    const isPreviousScreen = orderPlacementReducer?.isPreviousScreen?.data;
    const allowClearAll = orderPlacementReducer?.clearAll?.data;
    const fuelInfo = orderPlacementReducer?.fuelInfo?.data;
    const orderSearchReducer = useSelector((state)=>state.searchFuelOrderReducer);
    const commonReducer = useSelector((state) => state.commonReducer);
    const mobileHeaderText = commonReducer && commonReducer.mobileHeaderText && commonReducer.mobileHeaderText.data;
    const loggedInUser = commonReducer?.loggedInUser?.data;
    const loggedInUserType =  commonReducer?.loggedInUserType?.data;
    const loggedInFirstName =  commonReducer?.loggedInFirstName?.data;
    const loggedInCompany =  commonReducer?.loggedInCompany?.data;
    const company =  commonReducer?.loggedInCompany?.data;
    const orderSearchCriteria = orderSearchReducer?.orderDetails?.data
    const isMulti = orderPlacementReducer?.isMultileg?.data;
    const multipleLeg = orderPlacementReducer?.multipleLeg?.data;
    const isSummary = orderPlacementReducer?.isSummary?.data;
    const multiLegReducer = useSelector(state => state.multiLegReducer);
    const editLegData = multiLegReducer?.editLegData?.data;
    const isEdit = multiLegReducer?.isEdit?.data;
    const orderLegID = orderPlacementReducer?.orderID?.data;
    const orderLegLevel = orderPlacementReducer?.legLevel?.data!=undefined?orderPlacementReducer?.legLevel?.data:0;
    const [edit,setEdit]= useState(false)
    const [clearSummary,setClearSummary]= useState(!isSummary ?false :true)
    const isMultiLedPricePending = orderPlacementReducer?.isMultiLedPricePending?.data;
    const [clearAllReducer, setClearAllReducer] = useState(!isSummary ?true :false);
    const isPricePending = orderPlacementReducer?.isPricePending?.data;
    const [showPlaceSummaryscreen,setShowPlaceSummaryScreen] = useState(false);
    const [showMobileDelete,setShowMobileDelete] = useState(false);
    const isClickViewOrder = orderViewHomeReducer?.isClickViewOrder
    const loginReducer = useSelector(state => state.loginReducer);
    let accessLvl = loginReducer && loginReducer.loginAccessLevel&&loginReducer.loginAccessLevel.data&&loginReducer.loginAccessLevel.data?loginReducer.loginAccessLevel.data:[]
    const access =  JSON.parse(accessLvl)

     let reOrder = isReorder!=undefined || !isReorder ?false:true
     const [show, setShow] = useState(false);
     const [loader, setLoader] = useState(false);
    const dispatch = useDispatch()
    const adminReducer = useSelector((state) => state.AdminReducer)
    const systemVariables = adminReducer && adminReducer.systemVariables && adminReducer.systemVariables.data 
    const loginDetails = loginReducer && loginReducer.loginDetails &&loginReducer.loginDetails.data;
    let loginDetls =  JSON.stringify(loginDetails) === '{}'?{}:JSON.parse(loginDetails);
    let userEmail = loginDetls.loginUserName?loginDetls.loginUserName:'';
    useEffect(() => {
        fetchOrderJsonData(dispatch, jsonPayload)
        console.log("checking for edit multi leg", editLegData)
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
    }, [])
    useEffect(() => {
        if((!isEdit || !isReorder || !isEditSingle || !isOrderClose)){
            setOrderDetails(orderSearchCriteria)
        }
        if(!isEdit && !isReorder && !isEditSingle && !isOrderClose){
            setAllowUpdate(true)
        }
        
        let data = formDataSet
        let fuelingDate = orderSearchCriteria?.formData?.dateOfOrder  ? getFormattedMMDDYY(orderSearchCriteria?.formData?.dateOfOrder) :formDataSet.fuelingDate
        data["tailNumber"] = orderSearchCriteria?.formData?.tailNumber ? orderSearchCriteria.formData.tailNumber : tailNumber? tailNumber :""
        setTailSelected([orderSearchCriteria?.formData?.tailNumber ? orderSearchCriteria.formData.tailNumber : tailNumber? tailNumber :""])
        setTailNumber(orderSearchCriteria?.formData?.tailNumber ? orderSearchCriteria.formData.tailNumber : tailNumber? tailNumber :"")
        data["fuelingDate"] = orderSearchCriteria?.formData?.dateOfOrder  ? getFormattedMMDDYY(orderSearchCriteria?.formData?.dateOfOrder) :formDataSet.fuelingDate
        data["arrivingFrom"] = fromLocation && isMulti && orderLegLevel >0 ? fromLocation : formDataSet.arrivingFrom ? formDataSet.arrivingFrom:""
        setAddress1Selected([fromLocation && isMulti && orderLegLevel >0 ? fromLocation : formDataSet.arrivingFrom ? formDataSet.arrivingFrom:""])
        data["fuelUpon"] = formDataSet.fuelUpon ? formDataSet.fuelUpon:""
        data["quantity"] = formDataSet.quantity ? formDataSet.quantity:""
        data["unit"] = formDataSet.unit ? formDataSet.unit:""
        let expireDate = (new Date(orderSearchCriteria?.fboInfo?.expiresOn))<new Date(fuelingDate)
        getIsPricePending(dispatch,expireDate)
        if(!isMultiLedPricePending){getMultiLegPricePending(dispatch,expireDate)}
        setJsonData(orderJsonData)

        let operatorJson = {}
        operatorJson['fields']= orderJsonData?.orderHomeData?.operatorFields?.fields?.filter((item)=>item&&item.multiple&&item.multiple.includes(multiOperators))
        setOperatorJsonData(operatorJson)
        getFedTaxes().then((res)=>{
            if(res&& res.length){
                let fedTaxData = res[0] && res[0][0] && res[0][0]['JSON_UNQUOTE(@JSONResponse)'] && res[0][0]['JSON_UNQUOTE(@JSONResponse)']
                fedTaxData = JSON.parse(fedTaxData && fedTaxData).Taxes
                setFedTaxes(fedTaxData ? fedTaxData : [])
            }
        })
        setFormDataSet(data)
         orderJsonData && setEditInitialState(isOperator? operatorJson: orderJsonData.orderHomeData.addAircraft)
    }, [orderJsonData,orderSearchCriteria,multiOperators])
   
    useEffect(()=>{
        if(isReorder){
            setSummaryReorder(true)
        }
        if(loggedInUserType.toLowerCase()=="barrel fuel" && isEditSingle){
            setUserType('operator')
        }else{
            setUserType(loggedInUserType?.toLowerCase())
        }
        if(isOrderClose){
            setUserType('fbo')
        }
        
        if(loggedInUserType.toLowerCase()=='operator' || (isOrderClose && loggedInUserType.toLowerCase()=='fbo')){
            let payload ={"Operator":isOrderClose ? editLegData?.OperatorName :loggedInCompany,"IsRequestedFor":"OrderManagement","TailNumber":""}
            getTailNumbersList(payload,dispatch).then((res)=>{
              let tailNumbersList = [];
              let data = res && res.length && res[0].length&&res[0][0]&&res[0][0]['@JSONResponse']?JSON.parse(res[0][0]['@JSONResponse']):[]
              if(data.length>0){
                data.map((i) =>{
                  let obj={}
                  obj.title=i.TailNumbers;
                  obj.value=i.TailNumbers;
                  tailNumbersList.push(obj);
                })
              }
                setTailOptions(tailNumbersList);
              })
          }
    },[refresh])

    useEffect(() => {
        if(isEdit || isReorder || isEditSingle || isOrderClose){
            // setHomeLoader(true)
           let data =  {}
           let legData = editLegData
           let serviceData = []
           let servs  = []
           let checkedServices = []
           editLegData?.Services?.forEach((serv)=>{
            checkedServices.push(serv.ServiceName)
             servs.push({
                "name":serv.ServiceName,
                "amount":parseFloat(serv.Amount).toFixed(2)
            })
           })
           data["tailNumber"] = editLegData.TailNumber
           data["flightType"] = editLegData.FlightType
           data["arrivingFrom"] = editLegData.ArrivingFrom
           data["fuelingDate"] = new Date(editLegData.FuellingDate) < new Date() ? getFormattedMMDDYY(new Date()) : editLegData.FuellingDate
           data["fuelUpon"] = editLegData.Fuelupon
           data["quantity"] = editLegData.FuelQuantity?parseFloat(editLegData.FuelQuantity).toFixed(2):0
           data["unit"] = editLegData.Unit
           let payload={"SearchString":editLegData.ICAO,
                  "SearchType":"ICAO",
                  "LoggedinUser":loggedInUser
                }
                setFormDataSet(data)    
           fetchFuelResult(dispatch,payload).then((res)=>{
            if(res && res.length && res[0]){
                let data = JSON.parse(res[0][0]['JSON_UNQUOTE(@JSONResponse)'])
                let orderData = orderSearchCriteria ? orderSearchCriteria : {}
                let item = (data.filter((item)=>item.FBOName == editLegData.FBO ))
                item = item&& item.length ? item[0]:{}
                let fboInfo = orderData.fboInfo ? orderData?.fboInfo : {}
                let formData = orderData.formData ? orderData?.formData : {}
                formData['fuelservice'] = editLegData.FuelType 
                fboInfo["address"] = item?.AiportLocations[0].Address
                fboInfo["airportLocations"] = item?.AiportLocations
                fboInfo["fboName"] = item?.FBOName
                fboInfo["icao"] = item?.ICAO
                fboInfo["IsPartner"] = item?.IsPartner ? 'Partner' : ''
                fboInfo["RetailPrice"] = item?.AiportLocations[0].RetailPrice

                // AiportLocations[0].fuelTypes loop 
                // fboInfo["expiresOn"] = item?.IsPartner ? 'Partner' : ''

                fboInfo["bfPrice"] = editLegData.BasePrice
                orderData["fboInfo"] = fboInfo
                orderData["formData"] = formData

                let expireDate = (new Date(fboInfo?.expiresOn))<new Date(editLegData?.FuellingDate)
                getIsPricePending(dispatch,expireDate)
                if(!isMultiLedPricePending){getMultiLegPricePending(dispatch,expireDate)}
                setOrderDetails(orderData)
                setGallonValue(editLegData.FuelQuantity)
                setCostPlus(editLegData.CostPlus)
                setTailNumber(editLegData.TailNumber)
                setAddress1Selected([editLegData.ArrivingFrom])
                setTailSelected(editLegData?.TailNumber ? [editLegData.TailNumber]:[''])
                // setFormDataSet(data)
                setSelectedServices(checkedServices)
                setServices(servs)
                setFuelPrice(editLegData.BasePrice)
                setAllowUpdate(true)
                // updateData(orderData,servs,editLegData.FuelQuantity,editLegData.BasePrice)
            }
           })

        }
        if(editLegData) {
            setShowPlaceSummaryScreen(false);
            setShowMobileDelete(true);
            console.log("Editing leg data", editLegData)
        }
    },[isEdit,editLegData,orderJsonData,isReorder,isEditSingle,isOrderClose])
    
    useEffect(()=>{
      // clearAll(dispatch,false)
        if(isMulti){
            let legeLevel = orderLegLevel
            let data = formDataSet
            data["tailNumber"] = orderSearchCriteria?.formData?.tailNumber ? orderSearchCriteria.formData.tailNumber : tailNumber? tailNumber :""
            setTailSelected(orderSearchCriteria?.formData?.tailNumber ? [orderSearchCriteria.formData.tailNumber] : tailNumber? [tailNumber] :"")
            data["fuelingDate"] = orderSearchCriteria?.formData?.dateOfOrder  ? orderSearchCriteria?.formData?.dateOfOrder  :formDataSet.fuelingDate
            if(legeLevel == "0"){
                getUUID(dispatch,uuid())
                getLegData(dispatch,{})
            }
            setFormDataSet(data)
        }
        // else{
        //     getUUID(dispatch,'')   
        // }
    },[isMulti])
    
    // useEffect(() => {
    //    return()=>{
    //     document.getElementById('root').style.filter = 'none';
    //     // setTimeout(()=>{
    //         if(!clearAllReducer && clearSummary){
    //             getMultipleLeg(dispatch, false)
    //             getIsSummary(dispatch, false)
    //             getIsPricePending(dispatch,false)
    //             getMultiLegPricePending(dispatch,false)
    //             getLegData(dispatch,{})
    //             getLegType(dispatch, false)
    //             getLegLevel(dispatch,0)
    //             getIsEdit(dispatch,false)
    //             getIsEditSingle(dispatch,false)
    //             getIsOrderClose(dispatch,false)
    //             getIsReorder(dispatch,false)
    //             getIsEditMultiple(dispatch,false)
    //             getIsPreviousScreen(dispatch,'')
    //         } 
    //     // },1000)
       
    // }
    // }, [])

    useEffect(() => {
        allowUpdate && updateData(orderDetails)
    }, [gallonValue,tailNumber,orderDetails,fuelPrice,orderSearchCriteria,services,selectedServices,serviceUpdated,fedTaxes])
    
    const handleTermsEvent = (item) => {
        setModalText(jsonData?.orderHomeData[item])
        item == 'fairRules' ? setModalTitle('Fare Rules') : item == 'privacyPolicy' ? setModalTitle('Privacy Policy') : setModalTitle('Terms and Conditions')
        setShow(true);
    }

    const removeTaxFee = (e,value,index)=>{
        let taxFee=[...allTaxes];
        taxFee.splice(index,1)
        updateData(orderDetails,false,false,false,taxFee)

    }
    const updateData = (orderDetails,servs,quantity,price,taxFee)=>{
       if(tailNumber){ getOperatorOptions()}
        let cardFee= 0
        let netCost = 0
        let costSaving = 0
        let taxesAndFeesValue = 0
        let servicesValue = 0
        let fuelTypes = orderDetails?.fboInfo?.airportLocations[0].FuelTypes ? orderDetails?.fboInfo?.airportLocations[0].FuelTypes :[]
        let retailPrice = orderDetails?.fboInfo?.airportLocations[0].RetailPrice ? orderDetails?.fboInfo?.airportLocations[0].RetailPrice : 0;
        let allTaxes=[]
        if(!taxFee){
            let taxdata = orderDetails?.fboInfo?.airportLocations[0].Taxes ? orderDetails?.fboInfo?.airportLocations[0].Taxes :[]
            let allFees = orderDetails?.fboInfo?.airportLocations[0].Fees ? orderDetails?.fboInfo?.airportLocations[0].Fees :[]
            allTaxes = orderDetails?.fboInfo? [...fedTaxes, ...taxdata, ...allFees] :[]
        }else{
            allTaxes = taxFee;
        }
        
        let taxes =  []
        let costPlusValue = 0
        let selectedQuantity = quantity ? quantity :gallonValue
        let basePrice = price ? price : fuelPrice
        let IsMultiLeg =userType?.toLowerCase()=='fbo'? false : summaryFlag ? true : (orderDetails?.formData?.legType === "Multiple Leg" || reOrder)? (isEditSingle || isOrderClose || isReorder) ? false : true : false
        getLegType(dispatch,IsMultiLeg)
        let totalService = 0
        if(servs && servs.length || services?.length){
            ((isEdit || isReorder || isEditSingle || isOrderClose) && servs && servs.length ? servs :services).forEach((item)=>{
                totalService += parseFloat(item.amount) 
            })
            
        }
        setTotalServiceValue(totalService)
        servicesValue= totalService
        let totalDiscountValue = 0
        let totalAmount = 0
        if(!taxFee){
            allTaxes && allTaxes.length && allTaxes.forEach((tax)=>{
                let taxValue = getAmount(tax,tax.Fees?"fees":"tax",servicesValue)
                let Tdata = {
                    "name": tax.Fees? tax.Fees : tax.Tax,
                    "amount" : taxValue.toFixed(2),
                    "unit": tax.Fees?tax.FeeTiers[0].unit :tax.Unit,
                    "type": tax.Fees?"fees":"tax",
                    "taxType": tax.Tax?( tax.TaxType?"Federal/State Tax" :"Custom Tax"):"",
                }
                totalAmount+= taxValue
                if(tax?.Tax=='Sales Tax - Additional Services' && !selectedServices.length){

                }else{
                    taxes.push(Tdata)
                }
            })
        }else{
            taxFee?.forEach((tax)=>{
                totalAmount+= parseFloat(tax.amount)
                taxes.push(tax)
            })
        }
        
        setTotalTaxValue(totalAmount.toFixed(2))
        taxesAndFeesValue = totalAmount 
        setAllTaxes(taxes)
        fuelTypes && fuelTypes.length && fuelTypes.forEach((type)=>{
            if(type.Name == orderDetails?.formData?.fuelservice){
                setFuelTiers(type.Tiers)
                type.Tiers.map((tier)=>{
                    if(selectedQuantity>= tier.MinRange && ((tier.MaxRange ? selectedQuantity<= tier.MaxRange : true))){
                        setFuelPrice(tier.Baseprice + tier.costplus )
                        setCostPlus(tier.costplus)
                        costPlusValue = tier.costplus
                    }
                })
            }
        })
        let feeAndPayout = (parseFloat(systemVariables.Charge_Fee) + parseFloat(systemVariables.Payout_Fee)).toFixed(2)
        if(tailNumber){
            let payload = {"FBO":orderDetails?.fboInfo?.fboName,"TailNumber":tailNumber,"Location":orderDetails?.fboInfo?.icao}
            let discountValue = 0
            let selectedDiscounts = []
            getDiscounts(payload).then((res)=>{
                let discountData = res && res.length && res[0] && res[0][0] && res[0][0]['JSON_UNQUOTE(@JSONResponse)'] && res[0][0]['JSON_UNQUOTE(@JSONResponse)']
                discountData = discountData && JSON.parse(discountData)
                let discAmount = 0
                discountData&& discountData.forEach((item,index)=>{
                    if(item.Criteria == "Per Order" ||item.Criteria == "Per Gallon" ){
                        if(item.discountunit == "%"){
                            discountValue += ((selectedQuantity*basePrice)*item.discountvalue/100)
                            discAmount = ((selectedQuantity*basePrice)*item.discountvalue/100)
                        }
                        else{
                            discountValue += item.discountvalue
                            discAmount = item.discountvalue
                        }
                    }else if(item.Criteria == "Cost Plus"){
                        if(item.discountunit == "%"){
                            discountValue += (((costPlusValue)*item.discountvalue/100)*selectedQuantity)
                            discAmount = (((costPlusValue)*item.discountvalue/100)*selectedQuantity)

                        }
                        else{
                            discountValue += item.discountvalue
                            discAmount = item.discountvalue

                        }
                    }

                        
                    selectedDiscounts.push(
                        {
                            "DiscountID": item.DiscountID,
                            "Amount": discAmount,
                            "Unit": item.discountunit,
                            "Criteria": item.Criteria
                          }
                    )
                })
                setAppliedDiscounts(selectedDiscounts)
                totalDiscountValue = discountValue
                setDiscounts(discountValue ? discountValue.toFixed(2) : discountValue)
                netCost = (((selectedQuantity*basePrice)+ taxesAndFeesValue + servicesValue)-totalDiscountValue).toFixed(2)
                cardFee = (netCost*(feeAndPayout)) //(chagerFee + payout)/100.toFixed(2)
                setCardFee(cardFee)
                setSubTotal(netCost)
                setTotalValue(parseFloat(netCost)+parseFloat(cardFee))
                setTotalOrderValueDummy(netCost)
            })
        }
        netCost = (((selectedQuantity*basePrice)+ taxesAndFeesValue + servicesValue)-totalDiscountValue).toFixed(2)
        costSaving = ((retailPrice*selectedQuantity)-(selectedQuantity*basePrice)).toFixed(2)
        cardFee = (netCost*(feeAndPayout))//
        setCardFee(cardFee)
        setSubTotal(netCost)
        setTotalValue(parseFloat(netCost)+parseFloat(cardFee))
        setTotalOrderValueDummy(netCost)
        setFuelCostSavings(costSaving)
        allowUpdate && setHomeLoader(false)
    }
    const updateState = (item,value)=>{
        if(item == "quantity"){
            setGallonValue(value)
        }else if (item == "unit"){
            setUnitValue(value)
        }
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
    const validateField = (fieldName, value, fields, isTouched, formdata,invalidDate) => {
        const fieldValidationErrors = isOperator || editmodalShow ?  {...formErrors} : flightErrors
        let fieldValidationError = null;
        fieldValidationError = fieldValidationErrors[fieldName];
    
        if (isTouched !== undefined  ) {
            fieldValidationError["isTouched"] = isTouched;
        }
        let validationObj = {};
        validationObj = getFieldIsValid(value, fieldValidationError, fieldName,formdata,invalidDate)
        fieldValidationErrors[fieldName] = {
            ...validationObj.fieldValidationError
        };
    
        let errcount = validationObj.errcount;
        if (!errcount) {
            fieldValidationErrors[fieldName].isValid = true;
            fieldValidationErrors[fieldName].activeValidator = {};
        } else {
            fieldValidationErrors[fieldName].isValid = false;
            fieldValidationErrors[fieldName].activeValidator = validationObj.fieldValidationError.activeValidator;
        }
        if(isOperator || editmodalShow){
            setformErrors(fieldValidationErrors) 
        } else{
            setFlightErrors(fieldValidationErrors)
        } 
        /*customValidation(
            fieldName, value, validationObj
        );*/
      }

      const validateCustomTaxField = (fieldName, value, fields, isTouched, formdata,invalidDate) => {
        const fieldValidationErrors = customTaxFormError
        let fieldValidationError = null;
        fieldValidationError = fieldValidationErrors[fieldName];
    
        if (isTouched !== undefined  ) {
            fieldValidationError["isTouched"] = isTouched;
        }
        let validationObj = {};
        validationObj = getFieldIsValid(value, fieldValidationError, fieldName,formdata,invalidDate)
        fieldValidationErrors[fieldName] = {
            ...validationObj.fieldValidationError
        };
    
        let errcount = validationObj.errcount;
        if (!errcount) {
            fieldValidationErrors[fieldName].isValid = true;
            fieldValidationErrors[fieldName].activeValidator = {};
        } else {
            fieldValidationErrors[fieldName].isValid = false;
            fieldValidationErrors[fieldName].activeValidator = validationObj.fieldValidationError.activeValidator;
        }
        setCustomTaxFormError(fieldValidationErrors)
      }  
      const validateForm = () => {
        let formValid = true;
        let errors = editmodalShow || isOperator ? formErrors : flightErrors
        const formErrorKeys = Object.keys(errors);
        for (let i = 0; i < formErrorKeys.length; i++) {
            const fieldName = formErrorKeys[i];
    
            if (!errors[fieldName].isValid) {
                formValid = errors[fieldName].isValid;
                return formValid;
            }

        }

        if(isOrderClose){
            let data={...customTaxDataSet}
            if(data['taxFeeValue']!=='' || data['discountValue']!==''){
                if(data['taxFeeValue']!==''){
                    if (!customTaxFormError['customTaxFee'].isValid) {
                        formValid = customTaxFormError['customTaxFee'].isValid;
                        return formValid;
                    }
                }
                if(data['discountValue']!==''){
                    if (!customTaxFormError['customDiscount'].isValid) {
                        formValid = customTaxFormError['customDiscount'].isValid;
                        return formValid;
                    }
                }
                
            }    
      }
      return formValid;
    }
    const setEditInitialState = (fboData,clear,editdata) => {
        const formData = {};
        let formErrors = {};
        const fieldTypeArr = ['input', 'select','id','textarea'];
    
        fboData && fboData.fields.forEach((item) => {
            if (fieldTypeArr.includes(item.component.toLowerCase())) {
                formData[item.name] =editdata && editdata[item.name] && editdata[item.name]!== ""? editdata[item.name]: "";
                formErrors[item.name] = getFormErrorRules(item);
            }
        })
        setformErrors(formErrors);
        setformdata(formData);
      }
    const closeModal = () => {
        setLoader(false);
        setIsValidForm(true)
        setModalShow(false)
        if(!isMulti){
            getLegData(dispatch,{})
        }
        setHistory(false)
        setMultiEdit(false)
        document.getElementById('root').style.filter = 'none';
    }

    const editTailNumber = () => {
        let form={...formDataSet}
        form['tailNumber']=editMultiTailNumber;
        setTailNumber(editMultiTailNumber)
        setTailSelected([editMultiTailNumber])
        setFormDataSet(form)
        setModalShow(false)
        setMultiEdit(false)
        document.getElementById('root').style.filter = 'none';
    }
    const closeModals = () => {
        setIsValidForm(true)
        setLoader(false);
        setMobileModalShow(false)
        if(!isMulti){
            getLegData(dispatch,{})
        }
        setHistory(false)
        document.getElementById('root').style.filter = 'none';
    }
    const addTail= ()=>{
        setEditModalShow(true)
    }
    const sendInvoice=(email,orderNum,requestBy)=>{
        let emailData = isOrderClose ? orderJsonData?.orderHomeData?.emailInvoice  :  orderJsonData?.orderHomeData?.emailOrderConfirmation
        let data = document.getElementById('invoicePDF')
        html2pdf().from(data).outputPdf().then((url)=>{
            // let text = "Your Order is Closed. Please check the attached Invoice.  <br><br> Thanks, <br> The Barrel Fuel Team"
            // let placedtext = "Successfully Placed Order. Please check the attached Invoice.  <br><br> Thanks, <br> The Barrel Fuel Team"
            let data = {
                to: email,
                from: sender_Email,
                subject: emailData.title + orderNum ,
                text: emailData.paragraph + requestBy ,
                html:`${emailData.paragraph + camelize(requestBy) }, <br><br> ${emailData.html}`,
                attachments: [
                    {
                      content: btoa(url),
                      filename: "Invoice.pdf",
                      type: "application/pdf",
                      disposition: "attachment"
                    }
                  ]
            }
             SendMailToUsers(data);
          })
       
    }
    const successModal = (legData,multi,totalOrderValu) => {
        let Json = {
            "OrderNumber": isMulti ?`MCC${uuid()}`: singleLegID,
            "OrderDate": getFormattedYYMMDD(new Date),
            "Role":userType,
            "OperatorName": userType=="fbo" ? editLegData?.OperatorName : loggedInUserType=="Barrel Fuel" ? requestedOrg : loggedInCompany,
            "IsMultiLeg": isMulti,
            "IsProxyOrder": loggedInUserType=="Barrel Fuel"? true :false,
            "OrderId": "",
            "TotalOrderValue":totalOrderValu?totalOrderValu: totalOrderValue,
            "RequestBy": (loggedInUserType=="Barrel Fuel" || userType=='fbo')?userType=='fbo' ? editLegData?.RequestBy : requestedUser: loggedInUser,
            "CreatedBy": loggedInUser,
            "OrderLegs": legData?legData:multiLegData&& multiLegData.OrderLegs ? multiLegData.OrderLegs:legDetails
          }
          if(isEditSingle || isOrderClose){
            Json.OrderLegs[0].OrderNumber_Display=editLegData.OrderNumber
            if(isOrderClose){
                Json.OrderLegs[0].OrderStatus="Completed"
            }
            if(isEditSingle && editLegData?.IsMultiLeg=='true' && editLegData?.TailNumber!=Json.OrderLegs[0].TailNumber){
                Json.OrderLegs[0].IsMultiTailEdit=1
            }
          }
        
        setIsOperator(false)


       if(multi){
            // setMultipleLeg(true)
            getMultipleLeg(dispatch,true)
            getIsPricePending(dispatch,false)
            if(!isMultiLedPricePending){getMultiLegPricePending(dispatch,false)}
            setClearAllReducer(true)
            getLegData(dispatch,Json)

        }else{
            setMobileOrderDetails({},dispatch)
            saveOrderData(dispatch,Json).then((res)=>{
                setModalShow(false)
                document.getElementById('root').style.filter = 'none';
                let result = res[0] && res[0][0] && res[0][0]['JSON_UNQUOTE(@JSONResponse)'] ? JSON.parse(res[0][0]['JSON_UNQUOTE(@JSONResponse)']):[]
                let emailData = orderJsonData?.orderHomeData?.emailFlds;
                let orderNum = result&&result.length>0&&result[0].OrderNumber && result[0].IsMultiLeg=='true' && userType!=='fbo' ?result[0].OrderNumber: result[0]?.OrderLegs[0]?.OrderNumber? result[0]?.OrderLegs[0]?.OrderNumber:''
                let htmlText1 = emailData&&emailData.html1?emailData.html1+' ['+orderNum+'] ':'';
                let htmlText2 = emailData&&emailData.html2?emailData.html2:''
                let requestBy = result&&result.length>0&&result[0].RequestByName?result[0].RequestByName:''
                // let operatorName = result&&result.length>0&&result[0].OperatorName?result[0].OperatorName:''
                let requesterMail = (loggedInUserType=="Barrel Fuel" || userType=='fbo') ? userType=='fbo' ? result&&result.length>0&&result[0]?.RequestBy : requestedUser: loggedInUser
                let paragraph = `${emailData.paragraph} ${camelize(requestBy)},`
                let body = `${paragraph} <br> <br>${ htmlText1+htmlText2}`
                getLegData(dispatch,{})
                let ayditActivity = null;
                let payload = {}
                if(isReorder){
                    ayditActivity = orderNum+" Reordered"
                    getMobileHeaderText(dispatch, "Order Placed")
                }else if(isEditSingle){
                    ayditActivity = orderNum+" Updated"
                    if(userType == "operator"){
                    payload.type = "update"
                    payload.notificationMessage = editLegData?.OperatorName + jsonData?.orderHomeData?.notifyMessage.msg3 + Json.OrderLegs[0].OrderNumber_Display+"."
                    payload.organizationName = Json.OrderLegs[0].FBO
                    payload.loginUserName = loggedInUser
                    payload.sendNotificationTo = "ORG Internal"
                    payload.access_levels = ["Level 1 (Admin)","Level 2 (Standard)","Level 3 (Basic)"]
                    payload.levelOfAccess = access.includes('Super') ? "Level 1 (Admin)" : access.includes('Admin') ? "Level 2 (Standard)" : "Level 3 (Basic)"
                    payload.isActionable = false
                    payload.actionTaken = ""
                    payload.category = "order"
                    payload.readInd = false
                    getMobileHeaderText(dispatch, "Order Updated")
                    }else if(userType == "fbo"){
                        payload.type = "update"
                        payload.notificationMessage = jsonData?.orderHomeData?.notifyMessage.msg6 + Json.OrderLegs[0].OrderNumber_Display+jsonData?.orderHomeData?.notifyMessage.msg7+"."
                        payload.organizationName = Json.OperatorName
                        payload.loginUserName = loggedInUser
                        payload.sendNotificationTo = "ORG Internal"
                        payload.access_levels = ["Level 1 (Admin)","Level 2 (Standard)","Level 3 (Basic)"]
                        payload.levelOfAccess = access.includes('Super') ? "Level 1 (Admin)" : access.includes('Admin') ? "Level 2 (Standard)" : "Level 3 (Basic)"
                        payload.isActionable = false
                        payload.actionTaken = ""
                        payload.category = "order"
                        payload.readInd = false
                    }
                } else if(isOrderClose){
                    ayditActivity = orderNum+" Close and Completed"
                    if(result.isMultileg == "true"){
                        payload.notificationMessage = jsonData?.orderHomeData?.notifyMessage.msg6+result[0].CreatedBy+jsonData?.orderHomeData?.notifyMessage.msg7+result[0]?.OrderLegs[0]?.OrderNumber+jsonData?.orderHomeData?.notifyMessage.msg8+result[0]?.OrderNumber+jsonData?.orderHomeData?.notifyMessage.msg6+"."
                    }else{
                        payload.notificationMessage = jsonData?.orderHomeData?.notifyMessage.msg4+Json.OrderLegs[0].OrderNumber_Display+jsonData?.orderHomeData?.notifyMessage.msg5+"."
                    }
                    payload.type = "create"
                    payload.organizationName = Json.OperatorName
                    payload.loginUserName = loggedInUser
                    payload.sendNotificationTo = "ORG Internal"
                    payload.access_levels = ["Level 1 (Admin)","Level 2 (Standard)","Level 3 (Basic)"]
                    payload.levelOfAccess = access.includes('Super') ? "Level 1 (Admin)" : access.includes('Admin') ? "Level 2 (Standard)" : "Level 3 (Basic)"
                    payload.isActionable = false
                    payload.actionTaken = ""
                    payload.category = "order"
                    payload.readInd = false
                } else {
                    ayditActivity = orderNum+" Placed"

                    payload.type = "create"
                    payload.notificationMessage = jsonData?.orderHomeData?.notifyMessage.msg1+Json.OrderLegs[0].TailNumber+" "+Json.OperatorName+jsonData?.orderHomeData?.notifyMessage.msg2+Json.OrderDate+"."
                    payload.organizationName = Json.OrderLegs[0].FBO
                    payload.loginUserName = loggedInUser
                    payload.sendNotificationTo = "ORG Internal"
                    payload.access_levels = ["Level 1 (Admin)","Level 2 (Standard)","Level 3 (Basic)"]
                    payload.levelOfAccess = access.includes('Super') ? "Level 1 (Admin)" : access.includes('Admin') ? "Level 2 (Standard)" : "Level 3 (Basic)"
                    payload.isActionable = false
                    payload.actionTaken = ""
                    payload.category = "order"
                    payload.readInd = false
                    getMobileHeaderText(dispatch, "Order Placed")
                }
                saveNotificationList(payload,dispatch).then((res)=>{
      
                })
                let auditPayload = {"ModuleName":"Orders",
                              "TabName":"Complete",
                              "Activity":ayditActivity,
                              "ActionBy":Storage.getItem('email'),
                              "Role":JSON.parse(Storage.getItem('userRoles')),
                              "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
                    saveAuditLogData(auditPayload, dispatch)
                // if(isOrderClose){
                setInvoiceData(result[0])
                 if(isOrderClose){
                    setTimeout(()=>{
                        sendInvoice(requesterMail,orderNum,requestBy)
                    },25)
                }
                
                if(result&&result.length>0 && !isOrderClose){
                    let data = document.getElementById('invoicePDF')
                    setTimeout(()=>{
                        html2pdf().from(data).outputPdf().then((url)=>{
                            // let text = "Your Order is Closed. Please check the attached Invoice.  <br><br> Thanks, <br> The Barrel Fuel Team"
                            // let placedtext = "Successfully Placed Order. Please check the attached Invoice.  <br><br> Thanks, <br> The Barrel Fuel Team"
                            let data = {
                                to: requesterMail,
                                from: sender_Email,
                                subject: emailData&&emailData.title&&emailData.title+' ['+orderNum+'] ' ,
                                text: paragraph,
                                html:body,
                                attachments: [
                                    {
                                      content: btoa(url),
                                      filename: "Invoice.pdf",
                                      type: "application/pdf",
                                      disposition: "attachment"
                                    }
                                  ]
                            }
                             SendMailToUsers(data);
                          })
                    },25)
                }
                // setisSummary(true)
                if(isEditMultiple || (result[0].IsMultiLeg=='true' && userType!=='fbo')){
                    setsummaryFlag(true)
                    getLegType(dispatch,true)
                }
                setClearAllReducer(false)
                getIsSummary(dispatch, true)
                setClearSummary(true)
                getIsPricePending(dispatch,false)
                getMultiLegPricePending(dispatch,true)
                getUUID(dispatch,'')
                getMultipleLeg(dispatch,false)  
                getLegData(dispatch,Json)
                getEditLegData(dispatch,{})
                setSummaryReorder(false)
                

            })
        }
    }

    const getAddTaxFee = (type)=>{
        let dataset={...customTaxDataSet}
        
        let data={}
        if(type=='taxFee'){
            data.Amount=dataset.taxFeeValue
            data.Unit=dataset.taxFeeUnit
            data.Name=dataset.customTaxFee
        }else if(type=='discount'){
            data.Amount=dataset.discountValue
            data.Unit=dataset.discountUnit
            data.Name=dataset.customDiscount
        }
        return data;
    }
    const getTaxAndFeesPayload = (items,type)=>{
        let updatedPayload = []
       items &&  items.length && items.map((data)=>{
            if(data.type == "tax" && type=="tax"){
                updatedPayload.push({
                    "TaxName": data.name,
                    "Amount": data.amount,
                    "Unit": data.unit,
                    "TaxType": data.taxType
                })
            }else if (data.type == "fees" && type=="fees"){
                updatedPayload.push({
                    "FeeName": data.name,
                    "Amount": data.amount,
                    "Unit": data.unit
                })
            }else if (type=="services"){
                updatedPayload.push({
                    "ServiceName":data.name ,
                    "Amount": data.amount
                })
            }

        })
        return updatedPayload

    }
    const getAmount = (data,type,serv)=>{
        let amount = 0
        if(type == "tax" && data.Amount){
             amount = data.Amount  
            if(data.Unit == "%"){
                if(data?.Tax=='Sales Tax - Additional Services'){
                    amount = parseFloat(((parseFloat(serv)*(parseFloat(data.Amount))/100)))
                }else{
                    amount = parseFloat(((parseFloat(gallonValue*fuelPrice)*(parseFloat(data.Amount))/100)))
                }    
            }
            else{
                amount = parseFloat(data.Amount)
            }
        }
        else if(type == "fees"){
            if(data.pricingType == "Tiered"){
                data.FeeTiers.forEach((fee)=>{
                    if(gallonValue>=fee.MinRange && (fee.MaxRange ? gallonValue<=fee.MaxRange : true)){
                        if(fee.unit == "%"){
                            amount = parseFloat(((parseFloat(gallonValue*fuelPrice)*(parseFloat(fee.TierValue))/100)))
                        }
                        else{
                            amount = parseFloat(fee.TierValue)
                        }
                    }
                })
            }else{
                let fee = data.FeeTiers[0]
                if(fee.unit == "%"){
                    amount = parseFloat(((parseFloat(gallonValue*fuelPrice)*(parseFloat(fee.TierValue))/100)))
                }
                else{
                    amount = parseFloat(fee.TierValue)
                }
            }
        }
        return parseFloat(amount)
    }
    
    const searchAPI =(e,item)=>{
        let fields = {...formDataSet}
        let fieldName = item.name
        let payload = {}
        if(item.name=='tailNumber'){
            setTailLoading(true)
            payload ={"Operator":company,"IsRequestedFor":"OrderManagement","TailNumber":e && e}
            getTailNumbersList(payload,dispatch).then((res)=>{
                let tailNumbersList = [];
                let data = res && res.length && res[0].length?JSON.parse(res[0][0]['@JSONResponse']):[];
                if(data.length>0){
                    data.map((i) =>{
                        tailNumbersList.push(i.TailNumbers);
                    })
                }
                setTailResults(tailNumbersList);
                setTailLoading(false)
            })
        }else if(item.name=='arrivingFrom'){
            if(e?.length<4){
                setsearchType('')
            }
            if(searchType=='icao'){
                e=e.substring(0,4)
            }
            setAddress1Loading(true)
          payload ={"SearchString":e && e,"SearchType":"All","LoggedinUser":loggedInUser}
          fetchFuelLocations(dispatch,payload).then((res)=>{
            let data = res && res.length && res[0].length && res[0][0]['JSON_UNQUOTE(@JSONResponse)']?JSON.parse(res[0][0]['JSON_UNQUOTE(@JSONResponse)']):[];
            let list=[]
            let originalList=[]
            data && data.map((val)=>{
              list.push(val.Result)
              originalList.push(val)
            })
            setresults(list)
            setoriginalFuelList(originalList)
            setAddress1Loading(false)
          })
        }
        fields[fieldName]= e 
    }
    const searchHandler = (items,field) => {
        let fieldName=field.name
        let formData = {...formDataSet};
        formData[fieldName]=items[0]
        try {
            if(fieldName=='arrivingFrom'){
                setAddress1Selected(items)
                originalFuelList.map((val)=>{
                  if(items[0]==val?.Result){
                    setsearchType(val?.ResultType?.toLowerCase())
                  }
                })
                setresults(items)
            }
            
            else if(fieldName=='tailNumber'){
                if(isEditSingle && editLegData?.IsMultiLeg=='true'){
                    setMultiEdit(true)
                    setModalShow(true)
                    document.getElementById('root').style.filter = 'blur(5px)';
                    setEditMultiTailNumber(items && items.length && items[0])
                    formData[fieldName]='';
                }else{
                    setTailSelected(items)
                    setTailResults(items)
                }
            }
            setFormDataSet(formData);
        } catch( err ) {
            console.error(' unexpected error caught in  search')
        }
    }
    const getOperatorOptions= (isDecline)=>{
        let  payload = {"TailNumber": tailNumber}
        let operatorName  = '';
        let allOperators = [];
        let users = []
        let requestedUsers = []
        let totalData = [];
        let isMultiOperators = 'multiple'
        if(loggedInUserType == "Barrel Fuel" && userType!=='fbo'){
            getOperatorsByTailNum(payload).then((res)=>{
                let data = res && res[0] &&  res[0][0] && res[0][0]['JSON_UNQUOTE(@JSONResponse)']
                data = data&&JSON.parse(data)
                console.log(data)
                if(data){
                    if(isDecline || isEditSingle){
                        data.map((value)=>{
                            if(value.Operators && value.Operators.length && value.Operators[0].Operator==editLegData?.OperatorName){
                                value.Operators[0].Users.map((user)=>{
                                    let obj={}
                                    obj.title=user
                                    obj.value=user
                                    requestedUsers.push(obj)
                                })
                            setRequestedOperators(requestedUsers)
                            }
                            
                        })
                        isMultiOperators = "single"  
                        setMultiOperators(isMultiOperators)
                    }else{
                        totalData = data&&data
                        setOperatorData(totalData)
                        let Operators = data&&data
                        if(Operators&&Operators.length == 1){
                            operatorName = Operators&&Operators[0].Operator
                            users = Operators&&Operators[0]?.Operators[0]?.Users
                            users&&users.forEach((user)=>{
                                requestedUsers.push({
                                    "value":user,
                                    "title":user
                                })
                            })
                            setRequestedOrg(Operators[0].Operator)
                            setRequestedOperators(requestedUsers)
                            isMultiOperators = "single"
                        }else if(Operators&&Operators.length > 1){
                                isMultiOperators = "multiple"
                                Operators.forEach((item)=>{
                                    if(item.Operators && item.Operators.length){
                                        allOperators.push({
                                            "value":item.Operators[0]?.Operator,
                                            "title":item.Operators[0]?.Operator
                                        })
                                    }
                                    
                                })
                                setRequestedCompanyOptions(allOperators)
                            
                        }
                        setMultiOperators(isMultiOperators)
                    }
                }else{
                    setRequestedCompanyOptions([])
                    setRequestedOperators([])
                }
            })
        }else if(loggedInUserType == "Barrel Fuel" && (userType=='fbo' || isOrderClose)){
            isMultiOperators = "single"  
            setMultiOperators(isMultiOperators)
            let payload={"role":userType,"FBO":editLegData?.FBO,"Loggedinuser":loggedInUser}
            getFboUsers(payload).then((res)=>{
                if(res){
                let data = res && res.length && res[0].length && res[0][0]['JSON_UNQUOTE(@JSONResponse)']?JSON.parse(res[0][0]['JSON_UNQUOTE(@JSONResponse)']):[];
                data.map((value)=>{
                        let obj={}
                        obj.title=value.RequestedBy
                        obj.value=value.RequestedBy
                        requestedUsers.push(obj)  
                })
                }
                setRequestedOperators(requestedUsers)
            })
        }
        
    }
    const onClickSubmit= (e,item,isSummary,mobileView)=>{
        
        if(item.name=="back"){
            if(isEdit){
                let mdata=multiLegData.OrderLegs[multiLegData.OrderLegs.length - 1]
                getIsEdit(dispatch,true)
                getEditLegData(dispatch,mdata)
                getMultipleLeg(dispatch,true)
                getLegLevel(dispatch,multiLegData.OrderLegs.length)
                setClearAllReducer(true)
            }else if(isReorder){
                getOrderTab('completed',dispatch)
                if(isPreviousScreen=='viewOrder'){
                    navigate('/dashboard/fuelorder/viewOrder')
                }else{
                    navigate('/dashboard/order')
                }
                
            }else if(isEditSingle || isOrderClose){
                getOrderTab('active',dispatch)
                if(isPreviousScreen=='viewOrder'){
                    navigate('/dashboard/fuelorder/viewOrder')
                }else if(isPreviousScreen=='viewMultiOrder'){
                    navigate('/dashboard/fuelorder/viewMultiOrder')
                }else{
                    navigate('/dashboard/order')
                }
            }else{
                if(mobileView) {
                    setShowPlaceSummaryScreen(false);
                    return
                }
                navigate('/dashboard/fuelorder')
                
            }
            
        }
        else if(item.name=="placeOrder"){
            let isFormValid = true;
            const fieldValidationErrors = {
                ...flightErrors
            };
            Object.keys(fieldValidationErrors).forEach((fieldName, index) => {
                validateField(
                  fieldName,
                  formDataSet[fieldName],
                  { [fieldName]: formDataSet[fieldName]},
                  true
                );
              });

            if(isOrderClose){
                let data={...customTaxDataSet}
                if(data['taxFeeValue']!=='' || data['discountValue']!==''){
                    setbtnValidate(true)
                        if(data['taxFeeValue']!==''){
                            validateCustomTaxField(
                                'customTaxFee',
                                customTaxDataSet['customTaxFee'],
                                null,
                                true
                              );
                        }
                        if(data['discountValue']!==''){
                            validateCustomTaxField(
                                'customDiscount',
                                customTaxDataSet['customDiscount'],
                                null,
                                true
                              );
                        }
                }else{
                    setinitialCustomState(customJson)
                }
                
            }
            isFormValid = validateForm();

            
            //  isFormValid = true;
            if(isFormValid) {
                setLoader(true);
                if(item.view) {
                    setShowPlaceSummaryScreen(true)
                    return
                }
                setIsValidForm(true)
                let fuellingDate = getFormattedYYMMDD(formDataSet.fuelingDate)
                getFromLocation(dispatch,orderDetails.fboInfo.icao)
                let legData = {
                    "OrderNumber": isMulti ? uuid() : singleLegID,
                    "Name": "Leg"+isMulti?( orderLegLevel+1): 1,
                    "LegID":    isMulti?( orderLegLevel+1): 1,
                    "FBO": orderDetails.fboInfo.fboName,
                    "ICAO": orderDetails.fboInfo.icao,
                    "TailNumber": formDataSet.tailNumber,
                    "FlightType": formDataSet.flightType,
                    "ArrivingFrom": formDataSet.arrivingFrom,
                    "FuellingDate": fuellingDate,
                    "CostPlus": costPlus,
                    "FuelCostSavings": fuelCostSavings,
                    "CardFee": cardFee,
                    "FuellingDateEpoch": new Date(fuellingDate).getTime(),
                    "FinalPrice":totalValue,
                    "Fuelupon": formDataSet.fuelUpon,
                    "FuelType": orderDetails.formData.fuelservice,
                    "FuelQuantity": formDataSet.quantity,
                    "Unit": formDataSet.unit,
                    "BasePrice": fuelPrice,
                    "CostPlus":costPlus,
                    "Taxes": getTaxAndFeesPayload(allTaxes,"tax"),
                    "Fees": getTaxAndFeesPayload(allTaxes,"fees") ,
                    "Services":getTaxAndFeesPayload(services,"services"),
                    "AdditionalTaxFee":isOrderClose ? getAddTaxFee("taxFee") : null,
                    "AdditionalDiscount":isOrderClose ? getAddTaxFee("discount") : null,
                    "Discounts":appliedDiscounts,
                    "PricePending":isPricePending
                }
                let fuelData = {
                    'dateOfOrder': getFormattedYYMMDD(formDataSet.fuelingDate),
                    'fuelservice':orderDetails.formData.fuelservice,
                    'tailNumber':formDataSet.tailNumber
                }
                getFuelInfo(dispatch,fuelData)
                if(isMulti){
                    setMobileOrderDetails({},dispatch)
                    getEditLegData(dispatch,{})
                    getIsEdit(dispatch,false)
                    setMobileOrderDetails({},dispatch)
                    if(isSummary){
                        // getLegLevel(dispatch,0)
                        // getUUID(dispatch,'')
                        setClearAllReducer(false)
                        document.getElementById('root').style.filter = 'blur(5px)';
                        if(loggedInUserType == "Barrel Fuel"){
                            setEditInitialState(operatorJsonData)
                            getOperatorOptions()
                            setIsOperator(true)
                        }else{
                            setModalShow(true)
                        }
                    }else{
                        let orderedData = multiLegData?.OrderLegs ? multiLegData?.OrderLegs: []
                        let updatedData = multiLegData?.OrderLegs ? multiLegData?.OrderLegs: []

                        if(isEdit){
                            orderedData&& orderedData.length && orderedData.forEach((item,index)=>{
                                if(item.LegID == orderLegLevel+1){
                                    updatedData[index] = legData
                                }
                            })
                        }else{
                            updatedData.push(legData)
                        }
                        let totalOrderValu = 0
                        updatedData.forEach((d)=>{
                            totalOrderValu += parseFloat(d.FinalPrice)
                        })
                        // Sort by fuelling Date (used Epoch value)
                        updatedData.sort((a, b) => {
                            return a.FuellingDateEpoch - b.FuellingDateEpoch;
                        });
                        // LegID and name change (used Epoch value)
                        updatedData.forEach((leg,index)=>{
                            leg['LegID'] = index + 1;
                            leg['Name'] = index + 1;
                        })
                        setTotalOrderValue(totalOrderValu)
                        let legeLevel = orderLegLevel + 1
                        getLegLevel(dispatch,legeLevel)
                        if(legeLevel == "1"){
                            getUUID(dispatch,uuid())
                        }
                        successModal(updatedData,isMulti,totalOrderValu)
                        setLegDetails(updatedData)
                    }

                }else{
                    
                    let orderedData = multiLegData?.OrderLegs ? multiLegData?.OrderLegs: []
                    orderedData.push(legData)
                    let Json = {
                        "OrderNumber": isMulti ?`MCC${uuid()}`: singleLegID,
                        "OrderDate": getFormattedYYMMDD(new Date),
                        "OperatorName": loggedInUserType=="Barrel Fuel"? requestedOrg : loggedInCompany,
                        "IsMultiLeg": isMulti,
                        "IsProxyOrder": loggedInUserType=="Barrel Fuel"? true : false,
                        "OrderId": "",
                        "TotalOrderValue":totalOrderValue ,
                        "RequestBy": loggedInUserType=="Barrel Fuel"? requestedUser: loggedInUser,
                        "CreatedBy": loggedInUser,
                        "OrderLegs": orderedData,
                    }
                    setTotalOrderValue(totalValue)
                    document.getElementById('root').style.filter = 'blur(5px)';
                    setLegDetails(orderedData)
                    getLegData(dispatch,Json)
                    getLegLevel(dispatch,0)
                    createPopUpText()
                    //setClearAllReducer(false)
                    if(loggedInUserType == "Barrel Fuel"){
                        getOperatorOptions()
                        setEditInitialState(operatorJsonData)
                        setIsOperator(true)
                    }else{
                        setModalShow(true)
                    }
                }
            } else {
                setLoader(false)
                setIsValidForm(false)
                setModalShow(true)
                document.getElementById('root').style.filter = 'blur(5px)';
            }
        }
    }
    const createPopUpText=()=>{
        let modal=jsonData?.orderHomeData?.modal
        let txt;
        if(isEditSingle){
            if(userType=='fbo'){
                txt=modal?.editConfirm?.textFbo;
            }else{
                txt=modal?.editConfirm?.textOperator;
            }
            txt=`Hi ${camelize(loggedInFirstName)},`+txt;
        }
        setEditPopText(txt)
    }
    const closeEditModal = () => {
        setIsCancelDecline(false)
        setEditModalShow(false)
        setLoader(false)
        if(!isMulti){
            getLegData(dispatch,{})
        }
        setIsOperator(false)
        document.getElementById('root').style.filter = 'none';
        setEditInitialState(jsonData.orderHomeData.addAircraft)
        setModalText("")
      }
      const onEditHandleChange = (e,field) => {
        let target=e.target
        let formdataset={}
        const fields = {};
        let maxLength = 0;
        if(field.name == "operatorName"){
            setRequestedOrg(target.value)
            let options = []
            let filteredData = operatorData?.length && operatorData.filter((item)=>item?.Operators && item?.Operators[0]?.Operator==target.value)
            filteredData[0]?.Operators[0]?.Users?.forEach((data)=>{
                options.push({
                    "value":data,
                    "title":data
                })
            })
            setRequestedOperators(options)
        }
        if(field.name == "requestedBy"){
            setRequestedUser(target.value)
        }
        if(field.dataType=='numeric'){
          target.value = target.value.replace(/\D/g,'')
        }
        if (field.name === 'aircraftTailNumber' || field.name === 'serialNumber'  || field.name === 'aircraftModel' || field.name === 'maxFuelCapacity') {
          target.value = target.value.replace(/[^a-zA-Z0-9]/gi, '')
        }
        if ( field.name === 'aircraftTailNumber' || field.name === 'homeBaseAirport' ) {
            target.value= target.value.toUpperCase()
      
          }
            if (field && field.maxLength) {
                maxLength = parseInt(field.maxLength);
            }
            if (maxLength > 0 && target.value.length > maxLength) {
                target.value = target.value.substring(0, maxLength);
                return;
            }
    
        fields[field.name] = e.target.value;
        // if(isBtnValidate){
          validateField(
              target.name, target.value, fields, true
          );
        // }
        formdataset = {
          ...formdata,
          ...fields
        }
    
        setformdata(formdataset) 
        let isValid=validateForm();
        if (isValid) {
          setModalText('');
        }
    
          
      }
    
      const onEditHandleBlur = (e,field) => {
        let target=e.target
        let formdataset={...formdata}
        const fields = {};
        const errorData = {
          ...formErrors
        };
        formdataset[field.name] = e.target.value;
        if (field.name == "aircraftTailNumber") {
    
          let value = {
              "tailNumber": target.value
          }
          if(e.target.value) {
            flightInformationService(value).then(response => {
              formdataset['serialNumber'] = response.data.serialNumber === undefined ? '' : response.data.serialNumber;
              formdataset['manufacturerName'] = response.data.manufacturer === undefined ? '' : response.data.manufacturer;
              formdataset['aircraftModel'] = response.data.aircraftModel === undefined ? '' : response.data.aircraftModel;
              setformdata(formdataset)
              if(!response.data.message) {
                let fieldlist = ['serialNumber', 'manufacturerName', 'aircraftModel'];
                fieldlist.forEach(item => {
                  errorData[item].isTouched = true;
                    errorData[item].isValid = true;
                    validateField(item, formdataset[item], 
                        { [item]: formdataset[item] }, true)
                })
                setformErrors(errorData);
                setTimeout(() => {
                  let isValid=validateForm();
                  if (isValid) {
                    setModalText('');
                  }
                },1)
              }
            }) 
          }  
      }else{
        setformdata(formdataset)
      }
      // setTimeout(()=>{
        //setformdata(formdataset) 
      // },1500)  
      }
    
      const onEditClickSubmit = (e,item) => {
        if(item && item.name&&item.name=="addNew"){
          setEditInitialState(jsonData.orderHomeData.addAircraft,true)
          setEditModalShow(true)
        }else if(item && item.name&&item.name=="cancel"){
            navigate('/dashboard/fuelorder')
            setEditModalShow(false)
            document.getElementById('root').style.filter = 'none'
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
          { [fieldName]: formdata[fieldName] }, true
        );
        });
    
        let isValid=validateForm();
    
        if(isValid){
            if(isOperator){
                successModal(legDetails)
            }else if(isCancelDecline){
                let payload={}
                payload.RequestedBy=formdata.requestedBy
                payload.role=loggedInUserType
                payload.Loggedinuser=loggedInUser
                payload.Status=userType?.toLowerCase()=='operator'?"Canceled":"Declined"
                payload.StatusReason=formdata.StatusReason
                payload.StatusNotes=formdata.StatusNotes?.replace("\n"," ");
                payload.OrderDetailid=editLegData?.OrderDetailid;
                // setsubmittedForm(true)
                cancelDeclineOrder(payload).then((res)=>{ //
                    //setsubmittedForm(false)
                    if(res){
                        if(res[0][0].Msg=="Record(s) process successfully"){
                            let emailData=userType?.toLowerCase()=='operator'? orderJsonData?.orderHomeData?.cancelEmailBody :orderJsonData?.orderHomeData?.declineEmailBody;
                            let userName=editLegData?.CreatedBy;
                            let sendingTo=userType?.toLowerCase()=='operator'? formdata.requestedBy : editLegData?.RequestBy
                            let orderNum = editLegData?.OrderNumber
                            let htmlText1 = emailData?.html1 ? emailData.html1+orderNum:'';
                            let htmlText2 = emailData?.html2 ? emailData.html2:''
                            let paragraph = `${emailData.paragraph} ${camelize(userName)},`
                            let body = `${paragraph} <br> <br>${ htmlText1+htmlText2}`
                            const emailPayload = {
                                "to":sendingTo,
                                "from": sender_Email,
                                "subject": emailData?.title+orderNum+emailData?.title2,
                                "text": paragraph,
                                "html": body
                            }
                            SendMailToUsers(emailPayload);
                            setEditModalShow(false)
                            document.getElementById('root').style.filter = 'none';
                            getOrderTab('completed',dispatch)
                            //
                            let auditPayload = {"ModuleName":"Orders",
                              "TabName":"Complete",
                              "Activity":payload.OrderDetailid + payload.Status ,
                              "ActionBy":Storage.getItem('email'),
                              "Role":JSON.parse(Storage.getItem('userRoles')),
                              "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
                    saveAuditLogData(auditPayload, dispatch)
                    //
                            navigate("/dashboard/order")
                        }
                    }else{
                        setModalText("Server Error")
                    }
                    
                })
            }
          else{setServiceBusy(true)
    //      seteditModalShow(false)
          //document.getElementById('root').style.filter = 'none';
          setbtnValidate(false)
          let saveJSON={}
            saveJSON.service="addAircraft";
            saveJSON.json=formdata;
            delete saveJSON.json.aircraft_id;
            saveJSON.json.organizationName=loggedInCompany
            accountCompanyEditService(saveJSON).then((res)=>{
              setServiceBusy(false)  
              if(res==undefined){
                setModalText("Technical error")
              }else if(res.message.includes(saveJSON.json.aircraftTailNumber)){
                setModalText(jsonData.orderHomeData.modal.duplicate.text)
              }else if(res.message=='data Updated Successfully'){
                setRefresh(!refresh)
                setEditModalShow(false)
                document.getElementById('root').style.filter = 'none';
                setModalText("")
                setEditInitialState(jsonData.orderHomeData.addAircraft)
              }
              
            })
            }
        }else{
          setModalText(jsonData.orderHomeData.modal.validate.text)
        }
        }
        
      }
    const setFlightFormErrors = (errors) => {
        setFlightErrors(errors);
        seterrorsCaptured(true)
    }
    const updateServices = (list,selectedServices,gallons)=>{
        let data =selectedServices
        let servs = services
        orderDetails?.fboInfo?.airportLocations[0]?.Services && orderDetails?.fboInfo?.airportLocations[0].Services.forEach((item)=>{
            data&& data.length && data.forEach((serv)=>{
                if(serv.name == item.Service){
                    let amount = 0.00
                    let quantity= gallons ? gallons : gallonValue 
                    if(quantity){
                        let orderValue = (quantity * fuelPrice)
                        if(item.ThresholdtoWaive == 'OrderValue'){
                            if(orderValue>= item.minordervalue){
                                if(item.Unit == "%"){
                                    amount = parseFloat((item.Amount) -((item.Amount) * (parseFloat(item.ActualAmount)/100)))
                                }else{
                                    amount =  item.ActualAmount
                                }
                            }else{
                                amount =  item.Amount
                            }
                        }
                        else if(item.ThresholdtoWaive == 'FuelGallons'){
                            if(quantity>= item.mingallons){
                                if(item.Unit == "%"){
                                    amount = parseFloat((item.Amount) -((item.Amount) * (parseFloat(item.ActualAmount)/100)))
                                }else{
                                    amount =  item.ActualAmount
                                }
                            }else{
                                amount =  item.Amount
                            }
                        }else{
                            amount =  item.Amount
                        }
                    }
                    serv.amount = parseFloat(amount).toFixed(2)
                }

            })
        })
        setServices(data)
        setServiceUpdated(!serviceUpdated)
    }
    const allowRouting = ()=>{
        let flag = clearAllReducer
        return flag
    }
    const confirmNavigating = (confirm)=>{
        if((isMulti&& orderLegLevel>0 && !multipleLeg || isClickViewOrder)){
            
        }else{
            getMultipleLeg(dispatch, false)
            //getIsSummary(dispatch, false)
            getIsPricePending(dispatch,false)
            getMultiLegPricePending(dispatch,false)
            getLegData(dispatch,{})
            getLegType(dispatch, false)
            getLegLevel(dispatch,0)
            getIsEdit(dispatch,false);
            getIsReorder(dispatch,false)
            getIsEditSingle(dispatch,false)
            getIsOrderClose(dispatch,false)
            getIsEditMultiple(dispatch,false)
            getEditLegData(dispatch,{})
            getIsMultiSummary(dispatch,false)
            document.getElementById('root').style.filter = 'none';
        }
        confirm()
    }
    const updateClearAll = (flag)=>{
        setClearAllReducer(flag)
    }
    const setinitialCustomState = (json)=>{
        let data={}
        let errors={}
        const fieldTypeArr = ['input', 'select'];
        json?.closeOrderFields?.map((item)=>{
            if(item.closeOrder && fieldTypeArr.includes(item.component.toLowerCase())){
                data[item.name]=customTaxDataSet && customTaxDataSet[item.name] ? customTaxDataSet[item.name] : item.defaultValue ? item.defaultValue : ""
                errors[item.name]=getFormErrorRules(item)
            }
        })
        setCustomJson(json)
        setCustomTaxDataSet(data)
        setCustomTaxFormError(errors)
    }
    const onHandleChangeCustom =(e,item)=>{
        let fields={...customTaxDataSet}
        let fieldName = item.name;
        let fieldValue = e.target.value;
        let taxFeedata={}
        let cardFee=0;
        let value=parseFloat(totalValueDummy)
        let maxLength = 0
        if (item && item.maxLength) {
        maxLength = parseInt(item.maxLength);
        }
        if (maxLength > 0 && e.target.value.length > maxLength) {
            e.target.value = e.target.value.substring(0, maxLength);
            return;
        }
        if(fieldName === "customDiscount" || fieldName === "customTaxFee"){
            e.target.value = e.target.value.replace(/[^a-z0-9_ ]/gi,'')
        }
        if(item.fieldType=='taxFee'){
            if(fieldValue!==''){
                if(fieldName=='taxFeeUnit'){
                    taxFeedata.Unit=e.target.value
                    fields['taxFeeValue']=''
                }else{
                    taxFeedata.Unit=fields['taxFeeUnit']
                }
                
                if(fieldName=='taxFeeValue'){
                    e.target.value = validateAmount({unit:fields["taxFeeUnit"]},e.target.value)
                    taxFeedata.Amount=e.target.value
                }else{
                    taxFeedata.Amount=''
                }
                
                let taxamount=getAmount(taxFeedata,'tax')
                let discountamount=getDiscountAmount({"Amount":fields['discountValue'], "Unit":fields['discountUnit']},value)
                value+=taxamount;
                value-=discountamount;
            }

        }else if(item.fieldType=='discount'){
            if(fieldValue!=''){
                if(fieldName=='discountUnit'){
                    taxFeedata.Unit=e.target.value
                    fields['discountValue']=''
                }else{
                    taxFeedata.Unit=fields['discountUnit']
                }
                
                if(fieldName=='discountValue'){
                    e.target.value = validateAmount({unit:fields["discountUnit"]},e.target.value)
                    taxFeedata.Amount=e.target.value
                }else{
                    taxFeedata.Amount=''
                }
                let taxamount=getAmount({"Amount":fields['taxFeeValue'], "Unit":fields['taxFeeUnit']},'tax')
                let discountamount=getDiscountAmount(taxFeedata,value)
                
                value+=taxamount;
                value-=discountamount;
            }
            
        }
        fields[fieldName]=e.target.value
        if(isBtnValidate){
            if(fields['taxFeeValue']!==''){
                validateCustomTaxField(
                    'customTaxFee',
                    fields['customTaxFee'],
                    null,
                    true
                  );
            }
            if(fields['discountValue']!==''){
                validateCustomTaxField(
                    'customDiscount',
                    fields['customDiscount'],
                    null,
                    true
                  );
            }
        }
        setSubTotal(value)
        let feeAndPayout = (parseFloat(systemVariables.Charge_Fee) + parseFloat(systemVariables.Payout_Fee)).toFixed(2)
        cardFee=parseFloat(value)*feeAndPayout;//
        setCardFee(cardFee)
        setTotalValue(parseFloat(value)+parseFloat(cardFee))
        setCustomTaxDataSet(fields)

    }
    const [mobileModalShow, setMobileModalShow] = useState(false)
    const [mobileModalData, setMobileModalData] = useState()
    const showMobileFuelTiers = (data) => {
        setMobileModalShow(true)
        setMobileModalData(data)
        document.getElementById('root').style.filter = 'blur(5px)';
    }

    const getDiscountAmount = (data,value)=>{
        let amount=0;
        if(data.Amount){
            if(data.Unit == "%"){
                amount = parseFloat(((parseFloat(value)*(parseFloat(data.Amount))/100)))
            }
            else{
                amount = parseFloat(data.Amount)
            }
        }
        return amount;
    }

    const onHandleBlurCustom = (e,item)=>{

    }
    const onHandleChange = (e,field,Adservices)=>{
        let fields = {...formDataSet}
        let fieldValue = e?.target?.value
        let fieldName = field.name
        let adServices = services ? services : []
        let invalidDate = false;
        if(fieldName == 'unit'){
            let unit = 1
            switch (fieldValue) {
                case "Pounds":
                    unit = 0.12
                    break;
            
                case "Kilograms":
                    unit =  0.26
                    break;
            
                case "Liters":
                    unit = 0.264172
                    break;
            
                default:
                    break;
            }
            let quantity = (parseFloat(fields['quantity']) * unit).toFixed(2)
            setGallonValue(quantity)
            setUnitValue(unit)
            updateServices(Adservices,services,quantity)
            fields[fieldName]=fieldValue
        }
        if(fieldName == 'tailNumber'){
            if(isEditSingle && editLegData?.IsMultiLeg=='true'){
                setMultiEdit(true)
                setModalShow(true)
                document.getElementById('root').style.filter = 'blur(5px)';
                setEditMultiTailNumber(e?.target?.value)
            }else{
                setTailNumber(e?.target?.value ? e?.target?.value : '')
            }
        }
        if(field.name == 'viewType'){
            setViewType(e.target.value)
            if(e.target.value=='Operator View'){
                setUserType('operator')
            }else{
                setUserType('fbo')
            }
        }
        if(field.name=='fuelingDate'){
          if(e !=null){
            let selectedDate = e&&e.$d&&e.$d
            setDate(selectedDate)
            let date = getFormattedMMDDYY(selectedDate)
            let today = new Date();
            today.setHours(0,0,0,0)
            var newDate = new Date(Date.now() + 90 * 24*60*60*1000);
            newDate.setHours(0,0,0,0)
            if( selectedDate == "Invalid Date" || new Date(selectedDate) < today || new Date(selectedDate) > newDate) {
                if(new Date(selectedDate) > newDate || selectedDate == "Invalid Date"){
                    invalidDate = "invalidDate";
                }else{
                    invalidDate = true;
                }
                fieldValue = date;
                let expireDate = (new Date(orderDetails.fboInfo.expiresOn))<new Date(fieldValue)
                getIsPricePending(dispatch,expireDate)
                if(!isMultiLedPricePending){getMultiLegPricePending(dispatch,expireDate)}
                fields[fieldName] = date;
                validateField(field.name, selectedDate, fields, true,formdata,invalidDate);
              } else {
                invalidDate = false;
                fieldValue = date;
                let expireDate = (new Date(orderDetails.fboInfo.expiresOn))<new Date(fieldValue)
                getIsPricePending(dispatch,expireDate)
                getMultiLegPricePending(dispatch,expireDate)
                fields[fieldName] = date;
                validateField(field.name, selectedDate, fields, true,formdata, invalidDate);
              }
          }else{
            fieldValue = null;
            fields[fieldName] = null;
          }
        }
        if(field.component === "checkbox"){
            let checkedServices = [...selectedServices]
            if(e.target.checked){
                checkedServices.push(fieldName)
                let amount = e.target.value
                adServices.push({"name":fieldName, "amount":parseFloat(amount).toFixed(2)})
            }else{
                adServices = adServices.filter((item)=>item.name!=fieldName)
                checkedServices = checkedServices.filter((item)=>item!=fieldName)
            }
            setServices(adServices)
            setSelectedServices(checkedServices)
            updateServices(Adservices,adServices)
            fields[fieldName]=fieldValue
        }
        if(fieldName == 'quantity'){
            let result = /^(?=.*\d)\d{0,5}(?:\.\d{0,2})?$/.test(e&&e.target &&e.target.value)
            if(result){
              fieldValue =  e?.target?.value;
              fields[fieldName]= fieldValue
              let quantity = (parseFloat(fieldValue?fieldValue:0) * unitValue).toFixed(2)
              setGallonValue(quantity)
              updateServices(Adservices,services,fieldValue)
            }else if(fieldValue == ''){
              fields[fieldName]= fieldValue
            }
        }else{
            if(isEditSingle && editLegData?.IsMultiLeg=='true' && fieldName == 'tailNumber'){
                
            }else{
                fields[fieldName]=fieldValue
            }
        }
        let fieldValidationErrors = {...flightErrors}
       
        validateField(
            fieldName,
            fieldValue,
            { [fieldName]:  fieldValue },
            true,
            formdata,
            invalidDate
          );
        setFormDataSet(fields)
    }
    const onHandleBlur = (e,field)=>{
        let fields = {...formDataSet}
        if(e.target.value<0.01){
            fields[field.name] =''
        } else{ fields[field.name] = e.target.value}
        setFormDataSet(fields)
    }
    const onSearchBlur = (e,field)=>{
        let fields = {...formDataSet}
        if(field.name == 'tailNumber'){
            if(isReorder || isOrderClose || isEditSingle){
                setTailSelected([e.target.value])
            } else
            if(tailResults.includes(e.target.value)){
                setTailNumber(e.target.value)
                fields[field.name]=e.target.value
                setTailSelected([e.target.value])
            }else{
                fields[field.name]=""
                setTailSelected([""])
            }
        }else if (field.name == 'arrivingFrom'){
            if(results.includes(e.target.value)){
                fields[field.name]=e.target.value
                setArrivingFrom(e.target.value)
            }else{
                fields[field.name]=""
            }
        }
        let fieldValidationErrors = {...flightErrors}
        validateField(
            field.name,
            e.target.value,
            { [field.name]:  e.target.value },
            true
          );
        setFormDataSet(fields)
    }
    const showHistory=()=>{
        setHistory(true)
        document.getElementById('root').style.filter = 'blur(5px)';
    }
    const handlemobileHistoryBack = (head) => {
        setIsMobileHistory(false)
        getMobileHeaderText(dispatch,head)
    }
    const handleViewMobileOrderHistory = () => {
        setIsMobileHistory(true)
    }
    const onLink = (e,item)=>{
        let json={...jsonData?.orderHomeData?.cancelDecline};
        json['fields']=json.fields.filter(m=>m?.users?.includes(userType))
        setIsCancelDecline(true)
        getOperatorOptions(true)
        setCancelDeclineJson(json)
        setEditInitialState(json)
        setEditModalShow(true)
    }

    const onRemoveLink = (e,item)=>{
        let data={...customTaxDataSet}
        let val=subTotal
        let cardFee=0;
        let amount=0;
        if(item.name=='removeTaxFee'){
            amount=getAmount({'Amount':data['taxFeeValue'],'Unit':data['taxFeeUnit']},'tax')
            val-=amount;
            data['customTaxFee']=""
            data['taxFeeValue']=""

        }else if(item.name=='removeDiscount'){
            amount=getDiscountAmount({'Amount':data['discountValue'],'Unit':data['discountUnit']},val)
            val+=amount;
            data['customDiscount']=""
            data['discountValue']=""
        }
        setSubTotal(val)
        let feeAndPayout = (parseFloat(systemVariables.Charge_Fee) + parseFloat(systemVariables.Payout_Fee)).toFixed(2)
        cardFee=parseFloat(val)*feeAndPayout;//
        setCardFee(cardFee)
        setTotalValue(parseFloat(val)+parseFloat(cardFee))
        setCustomTaxDataSet(data)
    }

    const searchOnKeyDown = (evt,item) => {
         if(item.name =='arrivingFrom'){
            var inputValue = evt.which;
            if(!(inputValue >= 65 && inputValue <= 123) && (inputValue != 32 && inputValue != 0 ) && !(inputValue ==8) && !(inputValue==46) && !(inputValue == 9) && !(inputValue == 39) && !(inputValue == 37)) { 
                evt.preventDefault(); 
            } 
         }else{
            evt.target.value=evt.target.value.replace(/[^a-zA-Z0-9]+/,"")
         }
       }
       const handleClose = () => {
        setShow(false);
        setModalText('')
        document.getElementById('root').style.filter = 'none';
        
    }
    const getOperatorFields = (item) => {
        switch(item?.component?.toUpperCase()) {
            
          case "RADIO":
            return ( <Radio type={item.type} 
                Label={item.label} 
                Name={item.name}
                secondButtonDisable={isEditMultiple ? true : false}
                formDataSet={viewType ? viewType : item.defaultValue ? item.label : ''}
                colWidth={item.styles ? item.styles.colWidth : ''}
                options={item.options}
                className={item.styles? item.styles.className: ''}
                handleChange={(e) => onHandleChange(e, item)}
                handleBlur={(e) => onHandleBlur(e, item)}/>)  
        }        
    } 
    const renderModal = (modal) => {
        let modalData = modalText;
        document.getElementById('root').style.filter = 'blur(5px)';
        return (
            <CustomModal
                show={show}
                onHide={handleClose}
                title={title}
                modelBodyContent={modalData}
                buttonText={"Dismiss"}
            />
        );
    };
    const showMobileOrderFields = () => {
        console.log("on mobile section")
        setShowPlaceSummaryScreen(false)
    }
      
    return (<>
        {jsonData?.orderHomeData && !homeLoader ?
        <div className='bf-order-placement-home'>
            <div style={{"height":"0","width":"0","overflow":"hidden"}}>
                <div style={{"height":"100%","width":"100%"}}id="invoicePDF">
                  <Invoice  isInvoice ={isOrderClose && isOrderClose ? true : false} invoiceData={invoiceData} />
                </div>
            </div>
            {
            !isMobileHistory ? 
            <>
            {!isSummary?<div  className={`bf-order-placement-home ${isEditSingle ? 'bf-edit-existing-order' : ''}`}>
                <div className='bf-order-heading'>{`${multipleLeg?jsonData && jsonData?.orderHomeData?.placeHolder?.summaryText:isOrderClose ? editLegData.OrderStatus=='Escalated' ? `${jsonData?.orderHomeData?.placeHolder?.closeEscalatedText} - ${editLegData.OrderNumber}` :`${jsonData?.orderHomeData?.placeHolder?.closeText} - ${editLegData.OrderNumber}` :isEditSingle ? `${jsonData?.orderHomeData?.placeHolder?.editText} - ${editLegData.OrderNumber}` :!isEdit ?isReorder?jsonData && jsonData?.orderHomeData?.placeHolder?.reOrder: jsonData && jsonData?.orderHomeData?.placeHolder?.text : jsonData && jsonData?.orderHomeData?.placeHolder?.editText}${isMulti&&!multipleLeg?(" - Leg "+(orderLegLevel+1)):""}`}</div>
                <div className='bf-order-admin-view bf-hide-mobile'>
                    {loggedInUserType.toLowerCase()=='barrel fuel' && isEditSingle  ? getOperatorFields(jsonData?.orderHomeData?.viewType) : ''}
                    {(isEditSingle || isOrderClose) ? <><div></div><a href='javascript:void(0);' onClick={(e)=>{showHistory()}} className={`bf-hyperlink ${!(loggedInUserType.toLowerCase()=='barrel fuel' && isEditSingle) ? 'bf-order-history' : ''}`}>View Order History</a></> : ""}
                </div>
                {isEditSingle || isOrderClose ?
                    <div className='bf-show-mobile bf-mobile-order-history'><a href="javascript:void(0)" onClick={(e)=>{handleViewMobileOrderHistory(e)}}>View Order History</a></div> :
                    null
                }
                <div className='bf-order-management-home d-flex d-flex-row'>
                    {multipleLeg?
                        <div className="bf-order-summary">
                            <MultiLegData onClickSubmit = {onClickSubmit} updateClearAll={updateClearAll}/>
                        </div>:""
                    }
                    <div className={`bf-order-creation ${showPlaceSummaryscreen ? 'bf-hide-mobile-order-fields-container' : 'bf-show-mobile-fields-container'} ${multipleLeg ? 'bf-multileg-order-data' : ''}`}>
                        <Orderdata
                            fboData= {orderDetails&& orderDetails}
                            quantity = {gallonValue ? gallonValue: 0 }
                            onHandleChange={onHandleChange}
                            onHandleBlur={onHandleBlur}
                            searchAPI={searchAPI}
                            tailOptions = {tailOptions}
                            tailSelected={tailSelected}
                            tailResults={tailResults}
                            address1Selected={address1Selected}
                            onSearchBlur={onSearchBlur}
                            typeaheadRef={typeaheadRef}
                            formDataSet={formDataSet}
                            isAddress1Loading={isAddress1Loading}
                            tailLoading={tailLoading}
                            date={date}
                            selectedServices = {selectedServices}
                            taxesandFees = {allTaxes}
                            services= {services}
                            results={results}
                            addTail = {addTail}
                            updateState = {updateState}
                            fuelTiers={fuelTiers}
                            updateServices= {updateServices}
                            fuelPrice={fuelPrice}
                            // maxDate={maxDate}
                            searchHandler={searchHandler}
                            // handleFocus={handleFocus} 
                            multiTailEdit={isEditSingle && editLegData?.IsSingleLegComp ? true : false}
                            multipleLeg = {multipleLeg}
                            setFlightFormErrors = {setFlightFormErrors}
                            formErrors = {flightErrors}
                            errorsCaptured = {errorsCaptured}
                            onKeyDown={searchOnKeyDown}
                            isEditSingle={isEditSingle}
                            userType={userType}
                            onClickSubmit = {onClickSubmit}
                            showMobileFuelTiers = {showMobileFuelTiers}
                            isOrderClose={isOrderClose}
                            isCancelDecline = {isCancelDecline}
                        />
                    </div>
                    {!multipleLeg?<div className={`bf-order-summary ${showPlaceSummaryscreen ? 'bf-show-place-order-mobile-summary-screen' : 'bf-hide-place-order-mobile-summary-screen'}`}>
                        <OrderSummary 
                            quantity = {gallonValue ? gallonValue: 0 }
                            fboData= {orderDetails}
                            taxesandFees = {allTaxes}
                            services= {services}
                            discountValue = {discounts}
                            price = {parseFloat(fuelPrice)}
                            totalTaxValue ={totalTaxValue}
                            fuelCostSavings={fuelCostSavings}
                            totalServiceValue = {parseFloat(totalServiceValue).toFixed(2)}
                            subTotal = {subTotal}
                            finalPrice = {totalValue}
                            cardFee= {cardFee}
                            loader= {loader}
                            onClickSubmit = {onClickSubmit}
                            isEdit={isEdit}
                            isEditMobile={isEdit} 
                            isEditSingle={isEditSingle}
                            isReorder={isReorder}
                            isEditMultiple={isEditMultiple}
                            isOrderClose={isOrderClose}
                            isMulti={isMulti}
                            // orderStatus={editLegData?.OrderStatus}
                            // date={editLegData?.Date && getFormattedMMDDYY(editLegData?.Date)}
                            userType={userType}
                            removeTaxFee={removeTaxFee}
                            onHandleChangeCustom={onHandleChangeCustom}
                            onHandleBlurCustom={onHandleBlurCustom}
                            formDataSet={customTaxDataSet}
                            formErrors={customTaxFormError}
                            setInitialState={setinitialCustomState}
                            onLink={onLink}
                            onRemoveLink={onRemoveLink}
                            showMobileOrderFields = {showMobileOrderFields}
                            prevScreen = {showPlaceSummaryscreen}
                            orderLegLevel={orderLegLevel}
                        />
                    </div>:""}
                </div>
                <div className='bf-font-14 bf-hide-mobile'>{multipleLeg ?  jsonData && 
                    <>
                    {/* {getTerms()} */}

                        <span>{jsonData?.orderHomeData?.multiTermsplaceHolder?.text} </span>
                            <a id = 'Terms of Service' href='javascript:void(0)' onClick={()=>{handleTermsEvent('termsOfService')}}  className='bf-hyperlink'>{jsonData?.orderHomeData?.multiTermsplaceHolder?.link3}</a> and
                            <a id = 'fairRules' href='javascript:void(0)' onClick={()=>{handleTermsEvent('fairRules')}} className='bf-hyperlink' > {jsonData?.orderHomeData?.multiTermsplaceHolder?.link1}</a>
                    </>  : ''}</div>
            </div>:
            <OrderViewHome
             totalOrderValue= {totalOrderValue}
             fboDetails = {orderDetails}
             updateClearAll={updateClearAll}
             userType={userType}
          />}
          </> :
          <History 
            handlemobileHistoryBack={handlemobileHistoryBack} 
            orderNumber={editLegData?.OrderNumber && editLegData.OrderNumber}
            sectionHead = {mobileHeaderText}
            /> 
          }
            {editmodalShow || isOperator?<EditFormModal
                onHide={closeEditModal}
                formErrors={formErrors}
                hide = {closeEditModal}
                modalWidth={isOperator ?'order-place': null}
                modalClassName={isCancelDecline ? "bf-cancel-modal" : null}
                taildisable={disable}
                formdata={formdata}
                show={editmodalShow || isOperator}
                json={isCancelDecline ? cancelDeclineJson : isOperator ? operatorJsonData : jsonData.orderHomeData.addAircraft}
                onHandleChange={onEditHandleChange}
                onHandleBlur={onEditHandleBlur}
                customOptions = {true}
                onClickSubmit={onEditClickSubmit}
                userOptions={requestedOperators}
                companyOptions={requestedCompanyOptions}
                customButtons={true}
                showError = {modalText}
                submittedForms = {serviceBusy}
                primaryButtonText = {isOperator ? "Yes" : "Submit"}
                secondbutton = {isCancelDecline ? "Back" :"Cancel"} 
                addNew = {true}
                isEditSingle={isEditSingle}
                isOrderClose={isOrderClose}
                editPopText={editPopText}
            />:""}
            <ReactRouterPrompt when={allowRouting()}>
                {({ isActive, onConfirm, onCancel }) => (
                    <>
                   <CustomModal
                    show={isActive}
                    isPrompt = {isActive}
                    onHide={() => confirmNavigating(onConfirm)}
                    close={()=>{
                        document.getElementById('root').style.filter = 'none';onCancel()}}
                    hide={()=>{
                        document.getElementById('root').style.filter = 'none';onCancel()}}
                    classStyles={"bf-mrgtb20"}
                    modalId={"bf-place-order"}
                    modelBodyContent={"Wait! All Order Progress Will Be Lost, Are You Sure You Want To Proceed? "}
                    buttonText={"Yes"}
                    secondbutton={"Cancel"}
                />
                </>
                )}
            </ReactRouterPrompt>
            {history && <AccordionModal
                show={history}
                onHide={() => closeModal()}
                orderNumber = {editLegData?.OrderNumber && editLegData.OrderNumber}
                buttonText={"Dismiss"}
                modalId={"bf-modal-accordion"}
            />}
            {mobileModalShow ? <CustomProfileModal
                show={mobileModalShow}
                onHide={() => closeModals()}
                hide={() => closeModals()}
                title={''}
                size={"md"}
                modelBodyContent={mobileModalData}
            /> : ""}
            {modalShow ?<CustomModal
                show={modalShow}
                onHide={!isValidForm ? ()=> closeModal() : multiEdit ? () => editTailNumber(): () => successModal()}
                close={()=>closeModal()}
                hide={()=>closeModal()}
                classStyles={"bf-mrgtb20"}
                modalId={"bf-place-order"}
                modelBodyContent={!isValidForm ? jsonData?.orderHomeData?.modal?.validate?.text :
                     multiEdit ? `Hi ${loggedInFirstName},${jsonData?.orderHomeData?.modal?.editMultiLegTailNumber?.text}` :
                     isEditSingle ? editPopText:
                     isOrderClose ? jsonData?.orderHomeData?.modal?.closeOrderConfirm?.text:
                     jsonData.orderHomeData.modal.placeOrder.text}
                buttonText={!isValidForm ? jsonData?.orderHomeData?.modal?.validate?.button1 : jsonData.orderHomeData.modal.placeOrder.button1}
                secondbutton={!isValidForm ? null :jsonData.orderHomeData.modal.placeOrder.button2}
            />:""}
            {show ? renderModal() : null}
        </div> : <Loader/>}
        </>)
}
