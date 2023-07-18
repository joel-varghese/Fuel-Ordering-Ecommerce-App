import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { bfaJsonService } from '../../actions/BFAServices/BFAJsonService';
import Loader from '../loader/loader';
import CustomModal from '../customModal/customModal';
import './dispute.scss'
import BFTable from '../table/table'
import disputeReducer from '../../reducers/orderReducer/disputeReducer';
import uuid from 'react-uuid';
import { FaCheckCircle } from "react-icons/fa";
import Input from '../input/input';
import Radio from '../radio/radio';
import Subheading from '../subHeading/subHeading';
import ButtonComponent from '../button/button';
import DisputeLogs from './disputeLogs';
import { disputeAmount, getFormattedMMDDYY, getFormErrorRules, phoneValidation, validateAmount } from '../../controls/validations';
import { fetchCaseNotesDetails, fetchDisputeDetails,fetchHistory,fetchResolveDetails, updateDispute } from '../../actions/orderActions/disputeOrderAction';
import { getIsResolveDispute, getOrderRowData, getOrderTab } from '../../actions/orderActions/orderCompletedAction';
import { fetchFuelResult } from '../../actions/searchFuelOrder/searchFuelOrderActions';
import { getDiscounts, getFedTaxes, getOperatorsByTailNum } from '../../actions/orderPlacementActions/orderPlacementService';
import { getDisputeOrder,invoiceScreen} from '../../actions/orderActions/disputeAction';
import TextArea from '../textArea/textArea';
import EditFormModal from '../customModal/editModal';
import AccordionModal from '../customModal/accordionModal';
import { getIsReorder, getLegLevel, getLegType, getMultipleLeg } from '../../actions/orderPlacementActions/orderPlacementActions';
import { getEditLegData } from '../../actions/orderPlacementActions/multiLegActions';
import { getFboUsers } from '../../actions/orderActions/activeOrderService';
import {saveAuditLogData } from '../../actions/auditLog/auditLogActions';
import { Storage} from '../../controls/Storage';
import { saveNotificationList } from '../../actions/notificationService/notificationAction';

export default function ReviewDispute() {
    let { state } = useLocation()
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = {"blobname":"reviewDispute.json"}
    const [reviewJson , setReviewJson] = useState(null)
    const [isBusy, setBusy] = useState(true)
    const [formDataSet, setformDataSet] = useState([]);
    const [updateReq,setupdateReq] = useState({})
    const [DisputeFormData, setDisputeFormData] = useState({});
    const [DisputeError,setDisputeError] = useState({})
    const [editmodalShow, seteditModalShow] = useState(false);
    const [modalText, setModalText] = useState('');
    const [showModal,setShow] = useState(false)
    const [saveIndicator,setSaveIndicator] = useState([])
    const [iconShow,setIconShow] = useState([])
    const [savePayload,setSavePayload] = useState({})
    const [disputeVal, setdisputeVal] = useState();
    const [formErrors, setformErrors] = useState({});
    const [fedTaxes, setFedTaxes] = useState([]);
    const [FBOData, setFBOData] = useState({});
    const [history,setHistory] = useState(false)
    const [load,setLoad] = useState(true)
    const [Status,setStatus] = useState('')
    const [Cancel,setCancel] = useState(false)
    const [discountData, setDiscountData] = useState([]);
    const [requestedBy, setRequestedBy] = useState([]);
    const [timestamp,setTimeStamp] = useState([])
    const [count, setCount] = useState(0);
    const [refresh,setrefresh] = useState(0)
    const disputeRed = useSelector((state) => state.disputeReducer)
    const dispData = disputeRed && disputeRed.disputeData && disputeRed.disputeData.data
    const View = disputeRed && disputeRed.viewScreen && disputeRed.viewScreen.data
    const dispute = disputeRed && disputeRed.DispData && disputeRed.DispData.data
    const Review = disputeRed && disputeRed.ReviewScreen && disputeRed.ReviewScreen.data
    const raisedUser = state && state.raisedUser && state.raisedUser != null ? state.raisedUser : ""
    //const Review = state && state ? state.review : ""
    const loginReducer = useSelector(state => state.loginReducer);
    const loginDetails = loginReducer && loginReducer.loginDetails &&loginReducer.loginDetails.data;
    const accessLvl = loginReducer?.loginAccessLevel?.data ? loginReducer?.loginAccessLevel?.data :[]
    const access =  JSON.parse(accessLvl)
    let loginDetls =  JSON.stringify(loginDetails) === '{}'?{}:JSON.parse(loginDetails);
    let userType = loginDetls.userType?loginDetls.userType:'';
    let userEmail = loginDetls.loginUserName?loginDetls.loginUserName:'';
    const span = {
        component: "span",
        name: "subhead",
        type: "subheading",
        place : "left",
        label: ""
    }
    const linkspan = {
        component: "linkspan",
        name: "subhead",
        type: "subheading",
        place : "left",
        label: "",
        label2:""
    }
    const payload = {
        "role":userType == "Barrel Fuel" ? "BFUser" : userType,
        "disputeid":dispute.DisputeID,
        "Loggedinuser":userEmail
    }
    const historyReq = {
        "OrderNumber":dispute.Ordernumber,
        "Loggedinuser":userEmail
    }
    useEffect(()=>{
        fetchDisputeDetails(dispatch,payload).then(res=>{
            let data = res && res.length && res[0].length && res[0][0]['JSON_UNQUOTE(@JSONResponse)']?JSON.parse(res[0][0]['JSON_UNQUOTE(@JSONResponse)']):[];
            setdisputeVal(data)
            console.log(data)
            callDispute(data) 
            bfaJsonService(params).then(response=>{
                setReviewJson(response.data.reviewData)
                setInitialState(response.data.reviewData,data)
                setDisputeState(response.data.reviewData.disputeManagement)
                setBusy(false)
            })
            if(Review && View){
                setStatus('Resolved')
            }else{setStatus(dispute && dispute.Status)}
            })        
    },[refresh]);
    useEffect(()=>{
        if(disputeVal){
            let orderDetails = disputeVal && disputeVal?.OrderDetails && disputeVal?.OrderDetails[0]
            let price =orderDetails.OrderLegs[0].BasePrice 
            let quantity =orderDetails.OrderLegs[0].FuelQuantity 
            let payload={
                "SearchString":orderDetails.OrderLegs[0].ICAO,
                "SearchType":"ICAO",
                "LoggedinUser":userEmail
            }
            getFedTaxes().then((res)=>{
                if(res&& res.length){
                    let fedTaxData = res[0] && res[0][0] && res[0][0]['JSON_UNQUOTE(@JSONResponse)'] && res[0][0]['JSON_UNQUOTE(@JSONResponse)']
                    fedTaxData = JSON.parse(fedTaxData && fedTaxData).Taxes
                    setFedTaxes(fedTaxData)
                    console.log(fedTaxData)
                }
            })
            fetchFuelResult(dispatch,payload).then((res)=>{
                if(res && res.length && res[0]){
                    let data = JSON.parse(res[0][0]['JSON_UNQUOTE(@JSONResponse)'])
                    let item = (data.filter((item)=>item.FBOName == orderDetails.OrderLegs[0].FBO ))
                    let orderData = item&& item.length ? item[0]:{}
                    setFBOData(orderData)
                    console.log(orderData)
                }
            })
            getDiscounts(payload).then((res)=>{
                let discounts = res && res.length && res[0] && res[0][0] && res[0][0]['JSON_UNQUOTE(@JSONResponse)'] && res[0][0]['JSON_UNQUOTE(@JSONResponse)']
                discounts = discounts ? JSON.parse(discounts) :[]
                setDiscountData(discounts)
                console.log(discounts)
            })
        }
        if(disputeVal && userType == "Barrel Fuel"){
            let requestedBy=[]
            let fboRequestedBy=[]
            let opComp = disputeVal?.OrderDetails[0].OperatorName
            let fbComp = disputeVal?.OrderDetails[0].OrderLegs[0].FBO
            let tail = disputeVal?.OrderDetails[0].OrderLegs[0].TailNumber
            if(raisedUser == "Operator"){
              getOperatorsByTailNum({"TailNumber":tail}).then((res)=>{
                if(res){
                  let data = res && res.length && res[0].length && res[0][0]['JSON_UNQUOTE(@JSONResponse)']?JSON.parse(res[0][0]['JSON_UNQUOTE(@JSONResponse)']):[];
                  data.map((value)=>{
                    if(value.Operators[0].Operator==opComp){
                      value.Operators[0].Users.map((user)=>{
                        let obj={}
                        obj.title=user
                        obj.value=user
                        requestedBy.push(obj)
                      })
                    }
                    
                  })
                }
                setRequestedBy(requestedBy)
              })
            }
            if(raisedUser == "FBO"){
              let payload={"role":"FBO","FBO":fbComp,"Loggedinuser":userEmail}
              getFboUsers(payload).then((res)=>{
                if(res){
                  let data = res && res.length && res[0].length && res[0][0]['JSON_UNQUOTE(@JSONResponse)']?JSON.parse(res[0][0]['JSON_UNQUOTE(@JSONResponse)']):[];
                  data.map((value)=>{
                        let obj={}
                        obj.title=value.RequestedBy
                        obj.value=value.RequestedBy
                        requestedBy.push(obj)  
                  })
                }
                setRequestedBy(requestedBy)
              })
            }
            }
    },[disputeVal])
    useEffect(() => {
        return()=>{
         document.getElementById('root').style.filter = 'none';
        }
     }, [])
    const callDispute = (data) =>{
        getDisputeOrder(data,dispatch)
      }
    const setDisputeState = (data) => {
        const formDataSet = {};
        let formErrors = {};
        let validationObj = {
            "errorMessage":null
          };
        const fieldTypeArr = ['input', 'select','textarea'];
        setModalText('')
        data && data.editmodal.fields.forEach((item) => {
            if (fieldTypeArr.includes(item.component.toLowerCase())) {
                formDataSet[item.name] =DisputeFormData && DisputeFormData[item.name]? DisputeFormData[item.name]: "";
                formErrors[item.name] = false
            }
        })
        data && data.fields.forEach((item) => {
            if (fieldTypeArr.includes(item.component.toLowerCase())) {
                formDataSet[item.name] =DisputeFormData && DisputeFormData[item.name]? DisputeFormData[item.name]: "";
                formErrors[item.name] = false
            }
        })
        if(userType == "Barrel Fuel"){
            data && data.editmodalBF.fields.forEach((item) => {
                if (fieldTypeArr.includes(item.component.toLowerCase())) {
                    formDataSet[item.name] =DisputeFormData && DisputeFormData[item.name]? DisputeFormData[item.name]: "";
                    formErrors[item.name] = getFormErrorRules(item)
                    formErrors[item.name].activeValidator = validationObj
                }
            })
        }
        setDisputeFormData(formDataSet)
        setDisputeError(formErrors)
    } 
    const setInitialState = (jsonData,data)=>{
        let formData = [];
        let details = {};
        let formErrors = [];
        let errors = {};
        let save = []
        let showIcon = []
        let payload = {...savePayload}
        payload.DisputeReasons = []
        payload.RaisedBy=data.RaisedBy
        const fieldTypeArr = ['input', 'select','radio'];
        
        if(dispData?.dispReason?.length > 1){
            for(var i=1;i<dispData.dispReason.length;i++){
                let usedField = jsonData.reviewInformation.reasons
                const addNewField = {}
                const temp = JSON.parse(JSON.stringify(jsonData.reviewInformation.reasons[usedField.length-1].fields))
                addNewField['fields'] = temp
                jsonData.reviewInformation.reasons.push(addNewField)
            }
        }
        data.DisputeReasons.map((item,index)=>{
            payload.DisputeReasons[index] = {}
            if(item.Reason == "Duplicate Charge"){
                let newfld = JSON.parse(JSON.stringify(jsonData.reviewInformation.subReason[0]))
                newfld.options[1].value = "Remove Charge"
                newfld.options[1].label = "Remove Charge"
                newfld.name = "duplicate"
                let p1 = JSON.parse(JSON.stringify(linkspan))
                p1.label = "Related Order Id - "
                p1.label2 = data.DisputeReasons[index].RelatedOrderId
                jsonData.reviewInformation.reasons[index].fields.push(p1,newfld)
            }
            if(item.Reason == "Service Not Availed"){
                let newfld = JSON.parse(JSON.stringify(jsonData.reviewInformation.subReason[0]))
                newfld.options[1].value = "Remove Charge/Fee"
                newfld.options[1].label = "Remove Charge/Fee"
                newfld.name = "serviceAvail"
                let p1 = JSON.parse(JSON.stringify(span))
                p1.label = "Service Was Taken"
                let p2 = JSON.parse(JSON.stringify(span))
                p2.label = "Service Related Issue"
                jsonData.reviewInformation.reasons[index].fields.push(p1,p2,newfld)
            }
            if(item.Reason == "Additional Services Not Received"){
                item.Services.map((val)=>{
                    let newfld = JSON.parse(JSON.stringify(jsonData.reviewInformation.subReason[1]))
                    newfld.name = val.ServiceName
                    let p1 = JSON.parse(JSON.stringify(span))
                    p1.label = val.ServiceName
                    jsonData.reviewInformation.reasons[index].fields.push(p1,newfld)
                })
            }
            if(item.Reason == "Additional Services Not Billed"){
                item.Services.map((val)=>{
                    let newfld = JSON.parse(JSON.stringify(jsonData.reviewInformation.subReason[0]))
                    newfld.options[1].value = "Add"
                    newfld.options[1].label = "Add"
                    newfld.name = val.ServiceName
                    let p1 = JSON.parse(JSON.stringify(span))
                    p1.label = val.ServiceName
                    jsonData.reviewInformation.reasons[index].fields.push(p1,newfld)
                })
            }
            if(item.Reason == "Incorrect Discount"){
                let newfld = JSON.parse(JSON.stringify(jsonData.reviewInformation.subReason[2]))
                newfld.name = "Discount"+"check"
                let inp1 = JSON.parse(JSON.stringify(jsonData.reviewInformation.subReason[3]))
                inp1.name = "Discount"
                let value = item.ResolutionValue
                let discVal = disputeAmount(item.QuotedDiscount)
                if(value != null){
                    value = value.substring(1,value.length)
                }
                let dollar = item.ResolutionValue != null ? disputeAmount(value) : discVal
                inp1.initialVal = dollar
                inp1.defaultValue = dollar
                let p1 = JSON.parse(JSON.stringify(span))
                p1.label = "Discount"+" < "+discVal+" > "
                jsonData.reviewInformation.reasons[index].fields.push(p1,newfld,inp1)

            }
            if(item.Reason == "Incorrect Tax"){
                item.Taxes && item.Taxes.length && item.Taxes.map((val)=>{
                    let newfld = JSON.parse(JSON.stringify(jsonData.reviewInformation.subReason[2]))
                    newfld.name = val.TaxName+"check"
                    let inp1 = JSON.parse(JSON.stringify(jsonData.reviewInformation.subReason[3]))
                    inp1.name = val.TaxName
                    let value = val.ResolutionValue
                    let taxVal = disputeAmount(val.Amount)
                    if(value != null){
                        value = value.substring(1,value.length)
                    }
                    let dollar = val.ResolutionValue != null ? disputeAmount(value) : taxVal
                    inp1.initialVal = dollar
                    inp1.defaultValue = dollar
                    let p1 = JSON.parse(JSON.stringify(span))
                    p1.label = val.TaxName + " < "+taxVal+" > "
                    jsonData.reviewInformation.reasons[index].fields.push(p1,newfld,inp1)
                })
            }
            if(item.Reason == "Incorrect Fee"){
                item.Fees && item.Fees.map((val)=>{
                    let newfld = JSON.parse(JSON.stringify(jsonData.reviewInformation.subReason[2]))
                    newfld.name = val.FeeName+"check"
                    let inp1 = JSON.parse(JSON.stringify(jsonData.reviewInformation.subReason[3]))
                    inp1.name = val.FeeName
                    let value = val.ResolutionValue
                    let feeVal = disputeAmount(val.FeeAmount)
                    if(value != null){
                        value = value.substring(1,value.length)
                    }
                    let dollar = val.ResolutionValue != null ? disputeAmount(value) : feeVal
                    inp1.initialVal = dollar
                    inp1.defaultValue = dollar
                    let p1 = JSON.parse(JSON.stringify(span))
                    p1.label = val.FeeName+" < "+feeVal+" > "
                    jsonData.reviewInformation.reasons[index].fields.push(p1,newfld,inp1)
                })
            }
            if(item.Reason == "Incorrect Fueling Date"){
                let newfld = JSON.parse(JSON.stringify(jsonData.reviewInformation.subReason[0]))
                newfld.options[1].value = "Update To "+new Date(item.ActualFuelDate).toLocaleDateString('en-US',{ year: 'numeric', month: '2-digit', day: '2-digit' })
                newfld.options[1].label = "Update To "+new Date(item.ActualFuelDate).toLocaleDateString('en-US',{ year: 'numeric', month: '2-digit', day: '2-digit' })
                newfld.name = "date"
                let p1 = JSON.parse(JSON.stringify(span))
                let invDate = new Date(data.OrderDetails[0].OrderLegs[0].FuellingDate).toLocaleDateString('en-US',{ year: 'numeric', month: '2-digit', day: '2-digit' })
                p1.label = "Actual Date - "+invDate
                let p2 = JSON.parse(JSON.stringify(span))
                p2.label = "Date Reported - "+new Date(item.ActualFuelDate).toLocaleDateString('en-US',{ year: 'numeric', month: '2-digit', day: '2-digit' })
                jsonData.reviewInformation.reasons[index].fields.push(p1,p2,newfld)
            }
            if(item.Reason == "Fuel Price Mismatch"){
                let newfld = JSON.parse(JSON.stringify(jsonData.reviewInformation.subReason[0]))
                newfld.name = "fuelPrice"+"check"
                let unit = data.OrderDetails[0].OrderLegs[0].Unit == "Gallon" ? 'gal' : data.OrderDetails[0].OrderLegs[0].Unit == "Kilogram" ? 'kg' : ''
                newfld.options[1].label = "Update To $"+item.ActualFuelPrice+"/"+unit
                newfld.options[1].value = "Update To $"+item.ActualFuelPrice+"/"+unit

                // let inp1 = JSON.parse(JSON.stringify(jsonData.reviewInformation.subReason[3]))
                // inp1.name = "fuelPrice"
                // let dollar = disputeAmount(item.ActualFuelPrice)
                // inp1.initialVal = dollar
                // inp1.defaultValue = dollar
                let p1 = JSON.parse(JSON.stringify(span))
                p1.label = "Invoice Price - $"+data.OrderDetails[0].OrderLegs[0].BasePrice+"/"+unit
                let p2 = JSON.parse(JSON.stringify(span))
                p2.label = "Actual Price - $"+item.ActualFuelPrice+"/"+unit
                jsonData.reviewInformation.reasons[index].fields.push(p1,p2,newfld)
            }
            if(item.Reason == "Fuel Quantity Mismatch"){
                let newfld = JSON.parse(JSON.stringify(jsonData.reviewInformation.subReason[0]))
                newfld.name = "fuelQuantity"+"check"
                let unit = data.OrderDetails[0].OrderLegs[0].Unit == "Gallon" ? 'gal' : data.OrderDetails[0].OrderLegs[0].Unit == "Kilogram" ? 'kg' : ''
                newfld.options[1].label = "Update To "+item.ActualFuelQuantity+unit
                newfld.options[1].value = "Update To "+item.ActualFuelQuantity+unit

                // let inp1 = JSON.parse(JSON.stringify(jsonData.reviewInformation.subReason[3]))
                // inp1.name = "fuelQuantity"
                // inp1.initialVal = item.ActualFuelQuantity
                // inp1.defaultValue = item.ActualFuelQuantity
                let p1 = JSON.parse(JSON.stringify(span))
                p1.label = "Invoice Fuel - "+data.OrderDetails[0].OrderLegs[0].FuelQuantity+unit
                let p2 = JSON.parse(JSON.stringify(span))
                p2.label = "Actual Fuel - "+item.ActualFuelQuantity+unit
                jsonData.reviewInformation.reasons[index].fields.push(p1,p2,newfld)
            }
            if(item.Reason == "Incorrect Tail Number"){
                let newfld = JSON.parse(JSON.stringify(jsonData.reviewInformation.subReason[0]))
                newfld.options[1].value = "Update To "+item.ActualTailNumber
                newfld.options[1].label = "Update To "+item.ActualTailNumber
                newfld.name = "tail"
                let p1 = JSON.parse(JSON.stringify(span))
                p1.label = "Invoice Tail - "+data.OrderDetails[0].OrderLegs[0].TailNumber 
                let p2 = JSON.parse(JSON.stringify(span))
                p2.label = "Tail Reported - "+item.ActualTailNumber 
                jsonData.reviewInformation.reasons[index].fields.push(p1,p2,newfld)
            }
        })
        jsonData.reviewInformation.reasons.forEach((item,index)=>{
            item.fields.forEach((val)=>{
                if (fieldTypeArr.includes(val.component.toLowerCase())) {
                    details[val.name] = val.defaultValue?val.defaultValue:""
                    errors[val.name] = false
                }
            })
            formData.push(details)
            formErrors.push(errors)
            details = {}
            errors={}
        })
        jsonData.reviewInformation.reasons.forEach((item,index)=>{
            let val = index+1
            item.fields[0].label = val+". "+item.fields[0].label + data.DisputeReasons[index].Reason
            formData[index]["notes"] = data.DisputeReasons[index].Notes
            if(data.DisputeReasons[index].Cause != null){
                save[index] = true
                showIcon[index] = true
                formData[index]["cause"] = data.DisputeReasons[index].Cause
                formData[index]["subcause"] = data.DisputeReasons[index].SubCause
                formData[index]["notes"] = data.DisputeReasons[index].Notes
            }
            else if (Review && View){
                save[index] = true
                showIcon[index] = false
            }
            else{
                save[index] = false
                showIcon[index] = false
            }
        })
        jsonData.reviewInformation.reasons.forEach((item,index)=>{
            item.fields.forEach((val)=>{
                if (val.name == "save" && save[index] == true) {
                    val.label = val.text2
                }
            })
        })
        data.DisputeReasons.map((item,index)=>{
            if(item.Reason == "Duplicate Charge"){
                formData[index]["duplicate"] = item.ResolutionAction
            }
            if(item.Reason == "Service Not Availed"){
                formData[index]["serviceAvail"] = item.ResolutionAction
            }
            if(item.Reason == "Additional Services Not Received"){
                item.Services.map((val)=>{
                    formData[index][val.ServiceName] = val.Resolution
                })
            }
            if(item.Reason == "Additional Services Not Billed"){
                item.Services.map((val)=>{
                    formData[index][val.ServiceName] = val.Resolution
                })
            }
            if(item.Reason == "Incorrect Discount"){
                formData[index]["Discount"+"check"] = item.ResolutionAction
            }
            if(item.Reason == "Incorrect Tax"){
                item.Taxes && item.Taxes.map((val)=>{
                    formData[index][val.TaxName+"check"] = val.Resolution
                })
            }
            if(item.Reason == "Incorrect Fee"){
                item.Fees && item.Fees.map((val)=>{
                    formData[index][val.FeeName+"check"] = val.Resolution
                })
            }
            if(item.Reason == "Incorrect Fueling Date"){
                formData[index]["date"] = item.ResolutionAction
            }
            if(item.Reason == "Fuel Price Mismatch"){
                formData[index]["fuelPrice"+"check"] = item.ResolutionAction
            }
            if(item.Reason == "Fuel Quantity Mismatch"){
                formData[index]["fuelQuantity"+"check"] = item.ResolutionAction
            }
            if(item.Reason == "Incorrect Tail Number"){
                formData[index]["tail"] = item.ResolutionAction
            }
        })
        setSaveIndicator(save)
        setIconShow(showIcon)
        setformErrors(formErrors)
        setformDataSet(formData);
        setSavePayload(payload)
    }
    const handleDisputeBlur= (e, item) => {

    }
    const getTaxAndFeesPayload = (items,type)=>{
        let updatedPayload = []
       items &&  items.length && items.map((data)=>{
            if(data.type == "tax" && type=="tax"){
                updatedPayload.push({
                    "TaxName": data.name,
                    "Amount": parseFloat(data.amount),
                    "Unit": data.unit,
                    "TaxType": data.taxType
                })
            }else if (data.type == "fees" && type=="fees"){
                updatedPayload.push({
                    "FeeName": data.name,
                    "Amount":parseFloat(data.amount),
                    "Unit": data.unit
                })
            }else if (type=="services"){
                updatedPayload.push({
                    "ServiceName":data.name ,
                    "Amount": parseFloat(data.amount)
                })
            }

        })
        return updatedPayload

    }
    const getAmount = (data,type,gallonValue,fuelPrice)=>{
        let amount = 0
        if(type == "tax"){
             amount = data.Amount
            if(data.Unit == "%"){
                amount = parseFloat(((parseFloat(gallonValue*fuelPrice)*(parseFloat(data.Amount))/100)))
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
        else if(type == "services"){
            let orderValue = (gallonValue * fuelPrice)
            if(data.ThresholdtoWaive == 'OrderValue'){
                if(orderValue>= data.minordervalue){
                    if(data.Unit == "%"){
                        amount = parseFloat((data.Amount) -((data.Amount) * (parseFloat(data.ActualAmount)/100)))
                    }else{
                        amount =  data.ActualAmount
                    }
                }else{
                    amount =  data.Amount
                }
            }
            else if(data.ThresholdtoWaive == 'FuelGallons'){
                if(gallonValue>= data.mingallons){
                    if(data.Unit == "%"){
                        amount = parseFloat((data.Amount) -((data.Amount) * (parseFloat(data.ActualAmount)/100)))
                    }else{
                        amount =  data.ActualAmount
                    }
                }else{
                    amount =  data.Amount
                }
            }else{
                amount =  data.Amount
            }
        }
        return parseFloat(amount)
    }
    const updateData = (quantity,price,orderVal,tail,discount)=>{
        let orderDetails = orderVal
        let servs = []
        let orderData = FBOData?FBOData :{}
        let federalTaxes = fedTaxes
        let netCost = 0
        let taxesAndFeesValue = 0
        let servicesValue = 0
        let fuelTypes = orderData?.AiportLocations[0].FuelTypes ? orderData.AiportLocations[0].FuelTypes :[]
        let taxdata = orderData?.AiportLocations[0].Taxes ? orderData.AiportLocations[0].Taxes :[]
        let allFees = orderData?.AiportLocations[0].Fees ? orderData.AiportLocations[0].Fees :[]
        let allServices = orderData?.AiportLocations[0].Services ? orderData.AiportLocations[0].Services :[]
        let allTaxes = orderData? [...federalTaxes, ...taxdata, ...allFees] :[]
        let discounts = discount? discount : discountData
        let taxes =  []
        let costPlusValue = 0
        let selectedQuantity = quantity ? parseFloat(quantity) : orderDetails.OrderLegs[0].FuelQuantity
        let basePrice = price ? price : 0
        let tailNumber = tail? tail:orderDetails.OrderLegs[0].TailNumber ;
        let totalDiscountValue = 0
        let totalAmount = 0
        let totalService = 0
        let discountValue = 0
        let selectedDiscounts = []
        let discAmount = 0
        fuelTypes && fuelTypes.length && fuelTypes.forEach((type)=>{
            if(type.Name == orderDetails?.OrderLegs[0].FuelType){
                type.Tiers.map((tier)=>{
                    if(selectedQuantity>= tier.MinRange && ((tier.MaxRange ? selectedQuantity<= tier.MaxRange : true))){
                        basePrice = tier.Baseprice + tier.costplus 
                        costPlusValue = tier.costplus
                    }
                })
            }
        })
        orderDetails?.OrderLegs[0]?.Services?.length && orderDetails.OrderLegs[0].Services?.forEach((serv)=>{
            allServices?.length&& allServices.forEach((ser)=>{
                if(ser.Service == serv.ServiceName){
                    let servAmount = getAmount(ser,"services",selectedQuantity,basePrice)
                    totalService += parseFloat(servAmount)
                    servs.push({
                        // "name":serv.ServiceName,
                        // "amount":parseFloat(servAmount).toFixed(2),
                        "ServiceName":serv.ServiceName,
                        "Amount":parseFloat(servAmount.toFixed(2))
                    })
                }
            })
        })
        allTaxes && allTaxes.length && allTaxes.forEach((tax)=>{
            let taxValue = getAmount(tax,tax.Fees?"fees":"tax",selectedQuantity,basePrice)
            let Tdata = {
                "name": tax.Fees? tax.Fees : tax.Tax,
                "amount" : taxValue.toFixed(2),
                "unit": tax.Fees?tax.FeeTiers[0].unit :tax.Unit,
                "type": tax.Fees?"fees":"tax",
                "taxType": tax.Tax?( tax.TaxType?"Federal/State Tax" :"Custom Tax"):"",
            }
            totalAmount+= taxValue
            taxes.push(Tdata)
        })
        taxesAndFeesValue = totalAmount 
        orderDetails.OrderLegs[0].Taxes = getTaxAndFeesPayload(taxes, 'tax')
        // if(servs && servs.length ){
        //     servs.forEach((item)=>{
                 
        //     })
            
        // }
        orderDetails.OrderLegs[0].Services = servs
        servicesValue= totalService
        discounts&& discounts.forEach((item,index)=>{
            if(item.Criteria == "Per Order" ||item.Criteria == "Per Gallon" ){
                if(item.discountunit == "%"){
                    discAmount = ((selectedQuantity*basePrice)*item.discountvalue/100)
                    discountValue += discAmount
                }
                else{
                    discountValue += item.discountvalue
                    discAmount = item.discountvalue
                }
            }else if(item.Criteria == "Cost Plus"){
                if(item.discountunit == "%"){
                    discAmount = (((costPlusValue)*item.discountvalue/100)*selectedQuantity)
                    discountValue += discAmount
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
            orderDetails.OrderLegs[0].Discounts = selectedDiscounts
            totalDiscountValue = discountValue
        })
        orderDetails.OrderLegs[0].TailNumber = tailNumber
        orderDetails.OrderLegs[0].BasePrice = basePrice
        orderDetails.OrderLegs[0].FuelQuantity = selectedQuantity
        netCost = (((selectedQuantity*basePrice)+ taxesAndFeesValue + servicesValue)-totalDiscountValue).toFixed(2)
        orderDetails.OrderLegs[0].FinalPrice = netCost
        return orderDetails
    }
    const updateall = (reason,data,orderData)=>{
        let orderDetails = orderData
        let sevices = orderDetails.OrderLegs[0].Services
        let price =orderDetails.OrderLegs[0].BasePrice 
        let quantity =orderDetails.OrderLegs[0].FuelQuantity 
        if(reason.Reason == "Fuel Price Mismatch"){
            if(data.fuelPricecheck == "Modify"){
                let price = data.fuelPrice.replace("Update To ","")
                price = price.replace("/gal","")
                let updatedPrice = parseFloat(price.replace("$", ""))
                orderDetails.OrderLegs[0].BasePrice =  updatedPrice
                price = updatedPrice
                orderDetails = updateData(quantity,updatedPrice,orderDetails)
            }
        }
        else if(reason.Reason ==  "Fuel Quantity Mismatch"){
            if(data.fuelQuantitycheck != "No Action"){
                let quantity = data.fuelQuantitycheck.replace("Update To ","")
                quantity = quantity.replace("gal","")
                orderDetails.OrderLegs[0].FuelQuantity =  quantity
                orderDetails = updateData(data.fuelQuantity,price,orderDetails)
            }
        }
        else if(reason.Reason ==  "Additional Services Not Billed"){
            let unUsedService = reason.Services
                let updatedsevices = orderDetails?.OrderLegs[0]?.Services?.length &&  orderDetails.OrderLegs[0].Services
                unUsedService?.length && unUsedService.map((serv)=>{
                    if(data[serv.ServiceName] == "Add Service"){
                        updatedsevices.push({
                            "ServiceName":serv.ServiceName,
                            "Amount":serv.Amount? parseFloat(serv.Amount).toFixed(2) : 0
                        })
                    }
                    
                })
            orderDetails.OrderLegs[0].Services =  updatedsevices
            orderDetails = updateData(quantity,price,orderDetails)
        }
        else if(reason.Reason ==   "Incorrect Tail Number"){
            if(data?.tail !== "No Action" ){
                orderDetails.OrderLegs[0].TailNumber =  data.tail?  data.tail.replace("Update To ","") : orderDetails.OrderLegs[0].TailNumber
                orderDetails = updateData(quantity,price,orderDetails,data.tail)
            }
        }
        return orderDetails
    }
    const  getUpdatedOrder = ()=>{
        let disputedOrder = disputeVal
        console.log(disputedOrder,"fcbgsrjbgrgig")
        let orderDetails = disputedOrder?.OrderDetails ? disputedOrder?.OrderDetails[0] :{}
        let disputeReasons = disputedOrder?.DisputeReasons
        disputeReasons && disputeReasons.length && disputeReasons.forEach((reason,index)=>{
            let sevices = orderDetails?.OrderLegs[0]?.Services
            let data = formDataSet[index]
            let price =orderDetails?.OrderLegs[0]?.BasePrice 
            let quantity =orderDetails?.OrderLegs[0]?.FuelQuantity 
            if(reason.Reason ==   "Fuel Price Mismatch"){
                orderDetails = updateall(reason,data,orderDetails)
            }
            else if(reason.Reason == "Fuel Quantity Mismatch"){
                console.log(updateall(reason,data,orderDetails),"ksdgslgjsdhjfhs")
                orderDetails = updateall(reason,data,orderDetails)
            }  
            else if(reason.Reason ==  "Additional Services Not Billed"){
                
                orderDetails = updateall(reason,data,orderDetails)
            }
            else if(reason.Reason ==  "Incorrect Tail Number"){
                orderDetails = updateall(reason,data,orderDetails)
            } 
        })
        disputeReasons && disputeReasons.length && disputeReasons.map((reason,index)=>{
            let sevices = orderDetails?.OrderLegs[0]?.Services
            let data = formDataSet[index]
            let price =orderDetails?.OrderLegs[0]?.BasePrice 
            let quantity =orderDetails?.OrderLegs[0]?.FuelQuantity 
            if(reason.Reason ==  "Additional Services Not Received" || reason.Reason == "Service Not Availed"){
                let unUsedService = reason.Services
                let updatedsevices = orderDetails?.OrderLegs[0]?.Services?.length &&  orderDetails.OrderLegs[0].Services
                unUsedService?.length && unUsedService.map((serv)=>{
                    if(data[serv.ServiceName] == "Remove"){
                        updatedsevices =  updatedsevices?.length &&  updatedsevices.filter((servs)=>servs.ServiceName !==serv.ServiceName)
                    }
                    
                })
                orderDetails.OrderLegs[0].Services =  updatedsevices
                
            }
            else if(reason.Reason == "Incorrect Fueling Date"){
                if(data?.date !== "No Action" ){
                    orderDetails.OrderLegs[0].FuellingDate =  data.date ? data.date.replace("Update To ","") :  orderDetails.OrderLegs[0].FuellingDate
                }
            }
            else if(reason.Reason == "Duplicate Charge"){
                if(data?.date !== "No Action" ){
                    orderDetails.OrderLegs[0]["DisputeReason"] =  reason.Reason
                    orderDetails["DisputeReason"] =  reason.Reason
                    orderDetails["IsDuplicateCharge"] =  true
                    orderDetails.OrderLegs[0]["IsDuplicateCharge"] =  true
                }
            }
            else if(reason.Reason ==  "Incorrect Payment Method"){
                // orderDetails.OrderLegs[0].FuelQuantity =  formDataSet[index].fuelQuantity
            }
            else if(reason.Reason == "Incorrect Tax"){
                let disputedTax = reason.Taxes
                disputedTax?.length && disputedTax.map((fee,findex)=>{
                    if(data[`${fee.TaxName}check`] == "Modify"){
                        orderDetails?.OrderLegs[0]?.Taxes.length && orderDetails?.OrderLegs[0]?.Taxes.forEach((fe)=>{
                            if(fe.TaxName==fee.TaxName){
                                fe.Amount = parseFloat(data[fee.TaxName].replace("$", ""))
                            }})
                    }
                })
            }
            else if(reason.Reason == "Incorrect Fee"){
                let disputedFee = reason.Fees
                disputedFee?.length && disputedFee.map((fee,findex)=>{
                    if(data[`${fee.FeeName}check`] == "Modify"){
                        orderDetails?.OrderLegs[0]?.Fees.length && orderDetails?.OrderLegs[0]?.Fees.forEach((fe)=>{
                            if(fe.FeeName==fee.FeeName){
                                fe.Amount = parseFloat(data[fee.FeeName].replace("$", ""))
                            }})
                    }
                })
            }
            else if(reason.Reason == "Incorrect Discount"){
                if(data.Discountcheck == "Modify"){
                    orderDetails.OrderLegs[0].CustomerDiscount =  parseFloat(data.Discount.replace("$", ""))
                }
            } 
            
        })
        let orderNumber = uuid()
        orderDetails["OrderNumber_Display"] = orderDetails?.OrderNumber
        orderDetails.OrderLegs[0]["OrderNumber_Display"] = orderDetails?.OrderLegs[0]?.OrderNumber
        orderDetails["DisputeId"] = disputedOrder?.DisputeId
        orderDetails.OrderLegs[0]["DisputeId"] = disputedOrder?.DisputeId
        orderDetails.OrderLegs[0]["DisputeStatus"] = "Resolved"
        orderDetails["DisputeStatus"] = "Resolved"
        orderDetails["ResolvedBy"] = userEmail
        orderDetails["Notes"] = DisputeFormData.notesLog ? DisputeFormData.notesLog : ""
        orderDetails.OrderLegs[0]["Notes"] = DisputeFormData.notesLog ? DisputeFormData.notesLog : ""
        orderDetails.OrderNumber = orderNumber
        orderDetails.OrderLegs[0].OrderNumber = orderNumber
        console.log(orderDetails)
        getOrderRowData(orderDetails,dispatch)
        getIsResolveDispute(orderDetails,dispatch)
        navigate('/dashboard/fuelorder/viewOrder')
    }
    const handleDispChange= (e, item) => {
        let fieldValue;
        let fieldName;
        let fields = [];
        let target = e.target;
        let disperror = {...DisputeError}
        if(item.name != "requestedBy"){
        disperror[item.name] = false
        setModalText('')
        }
        if(item.name == "requestedBy"){
            disperror["requestedBy"].activeValidator.errorMessage = null
        }
        fieldName = item.name;
        fieldValue = target.value;
        fields = JSON.parse(JSON.stringify(DisputeFormData));

        fields[fieldName] = fieldValue;
        setDisputeFormData(fields);
        setDisputeError(disperror)
    }
    const checkValidation = () =>{
        const fieldTypeArr = ['input', 'select','radio'];
        const fieldTypeDisp = ['textarea', 'select'];
        let jsondata = {...reviewJson}
        let reasonerror = {...formErrors}
        let disperror = {...DisputeError}
        let valid = true;
        jsondata.reviewInformation.reasons.forEach((item,index)=>{
            item.fields.forEach(val=>{
                if(fieldTypeArr.includes(val.component.toLowerCase()) && (formDataSet[index][val.name] == '' || formDataSet[index][val.name] == null)){
                    valid = false
                    reasonerror[index][val.name] = true
                }
            })
        })
        jsondata.disputeManagement.fields.forEach((val)=>{
            if(fieldTypeDisp.includes(val.component.toLowerCase()) && DisputeFormData[val.name] == ''){
                valid = false
                disperror[val.name] = true
            }
        })
        setDisputeError(disperror)
        return valid
    }
    const onModalSubmit =(e,item)=>{
        let formerror = {...DisputeError}
        let isValid = true
        if(userType == "Barrel Fuel"){
            if(DisputeFormData["requestedBy"] == ""){
              isValid = false
              formerror["requestedBy"].activeValidator.errorMessage = ""
            }
        }else{
            if(DisputeFormData["Notes"] == ""){
              isValid = false
              formerror["Notes"] = true
            }
        }
        if(isValid){
            seteditModalShow(false)
            document.getElementById('root').style.filter = 'none';
            let payload = {...updateReq}
            payload.ReopenReason = DisputeFormData["Notes"]
            updateDispute(dispatch,updateReq).then(res=>{
                let auditPayload = {"ModuleName":"Orders",
                "TabName":"Dispute",
                "Activity":updateReq["Status"]+" the dispute for disputed id "+updateReq["DisputeID"],
                "ActionBy":Storage.getItem('email'),
                "Role":JSON.parse(Storage.getItem('userRoles')),
                "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
    saveAuditLogData(auditPayload, dispatch)
                let req = {}
                req.type = "create"
                req.notificationMessage = reviewJson.notifyMessage.msg12+disputeVal?.OrderDetails[0].OrderLegs[0].OrderNumber+reviewJson.notifyMessage.msg5+"."
                req.organizationName = raisedUser == "Operator" ? disputeVal?.OrderDetails[0].OperatorName : disputeVal?.OrderDetails[0].OrderLegs[0].FBO
                req.loginUserName = userEmail
                req.sendNotificationTo = "ORG Internal"
                req.access_levels = ["Level 1 (Admin)","Level 2 (Standard)","Level 3 (Basic)"]
                req.levelOfAccess = access.includes('Super') ? "Level 1 (Admin)" : access.includes('Admin') ? "Level 2 (Standard)" : "Level 3 (Basic)"
                req.isActionable = false
                req.actionTaken = ""
                req.category = "order"
                req.readInd = false
                saveNotificationList(req,dispatch).then((res)=>{})
            })
            setCancel(false)
            getOrderTab('dispute',dispatch)
            navigate(`/dashboard/order/dispute`)
        }else{
            setModalText(reviewJson.disputeManagement.editmodal.validationMessage)
            setDisputeError(formerror)
        }
    }
    const closeEditModal =()=>{
      seteditModalShow(false)
      setCancel(false)
      setModalText('')
      let formerror = {...DisputeError}
      formerror["requestedBy"].activeValidator.errorMessage = null
      setDisputeError(formerror)
      document.getElementById('root').style.filter = 'none';
    }
    const onDisputeSubmit=(e,item)=>{
        if(item.label == "Back"){
            getOrderTab('dispute',dispatch)
            navigate(`/dashboard/order/dispute`)
        }
        if(item.label == "Reopen"){
            seteditModalShow(true)
            document.getElementById('root').style.filter = 'blur(5px)';
            let payload = {
                "role":userType == "Barrel Fuel" ? "BFUser" : userType,
                "Loggedinuser":userEmail,
                "Status":"Reopen",
                "DisputeID":disputeVal.DisputeId,
                "ReopenReason":""
              }
              setupdateReq(payload)
        }
        if(item.label == "Submit"){
            if(DisputeFormData["action"] == "Resolve"){
                let save = {...saveIndicator}
                let val = checkValidation()
                let indicate = true
                var ind ;
                for(ind=0;ind < disputeVal.DisputeReasons.length; ind++){
                    if(!save[ind]){
                        indicate=false
                    }
                }
                if(val&&indicate){
                getUpdatedOrder()

                }else{
                    setShow(true)
                    setModalText(reviewJson.modal[0].message)
                }
            }
            else if(DisputeFormData["action"] == "Cancel" && DisputeFormData["notesLog"] != ''){
                let payload = {
                    "role":userType == "Barrel Fuel" ? "BFUser" : userType,
                    "Loggedinuser":userEmail,
                    "Status":"Canceled",
                    "DisputeID":disputeVal.DisputeId,
                    "Notes": DisputeFormData["notesLog"]
                  }
                  setupdateReq(payload)
                  if(userType == "Barrel Fuel"){
                    setCancel(true)
                    seteditModalShow(true)
                  }else{
                    setShow(true)
                    setModalText(reviewJson.modal[0].cancel)
                  }
            }else{
            if(DisputeFormData["action"] != '' && DisputeFormData["notesLog"] != ''){
            let payload = {}
            payload.role = userType == "Barrel Fuel" ? "BFUser" : userType
            payload.RaisedBy = userEmail
            payload.DisputeID = disputeVal.DisputeId
            payload.Action = DisputeFormData["action"]
            payload.Notes = DisputeFormData["notesLog"]
            fetchCaseNotesDetails(dispatch,payload).then((res=>{
                let auditPayload = {"ModuleName":"Orders",
                    "TabName":"Dispute",
                    "Activity":payload.Action+" action take on disputed id "+payload.DisputeID,
                    "ActionBy":Storage.getItem('email'),
                    "Role":JSON.parse(Storage.getItem('userRoles')),
                    "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
                saveAuditLogData(auditPayload, dispatch)
            }))
            let Disputefield = {...DisputeFormData}
            Disputefield["action"] = ""
            Disputefield["notesLog"] = ""
            setDisputeFormData(Disputefield)
            setrefresh(!refresh)
            }else{
                let disperror = {...DisputeError}
                if(DisputeFormData["action"] == ''){disperror["action"] = true}
                if(DisputeFormData["notesLog"] == ''){disperror["notesLog"] = true}
                setDisputeError(disperror)
                setShow(true)
                setModalText(reviewJson.modal[0].message)
            }
            }
        }
        if(item.label == "Reorder"){
            let fieldData = disputeVal?.OrderDetails[0].OrderLegs[0]
              fieldData["OrderDate"] = disputeVal?.OrderDetails[0].OrderDate ?getFormattedMMDDYY(disputeVal.OrderDetails[0].OrderDate) :""
              fieldData["OperatorName"] =disputeVal?.OrderDetails[0].OperatorName ?disputeVal.OrderDetails[0].OperatorName :""
              fieldData["OrderStatus"] = disputeVal?.OrderDetails[0].OrderLegs[0]?.OrderStatus ?disputeVal.OrderDetails[0].OrderLegs[0].OrderStatus :""
              fieldData["CreatedBy"] = disputeVal?.OrderDetails[0].CreatedBy?disputeVal.OrderDetails[0].CreatedBy :""
              fieldData["PhoneNumber"] = disputeVal?.OrderDetails[0].Operator_ContactNumber?phoneValidation(disputeVal.OrderDetails[0].Operator_ContactNumber.toString()) : phoneValidation("7865435786")
              fieldData["RequestBy"] = disputeVal?.OrderDetails[0].RequestBy?disputeVal.OrderDetails[0].RequestBy :""
              fieldData["address"] =disputeVal?.OrderDetails[0].OrderLegs[0]?.Address?disputeVal?.OrderDetails[0].OrderLegs[0].Address :""
              fieldData["FuellingDate"] =  disputeVal?.OrderDetails[0].OrderLegs[0]?.FuellingDate?getFormattedMMDDYY(disputeVal?.OrderDetails[0].OrderLegs[0].FuellingDate) :""
            getIsReorder(dispatch,true)
            getEditLegData(dispatch,fieldData)
            getLegType(dispatch,false)
            getMultipleLeg(dispatch,false)
            getLegLevel(dispatch,0)
            navigate('/dashboard/fuelorder/order')
        }
    }
    const handleBlur= (e, item) => {

    }
    const handleChange= (e, item,index) => {
        let formData = [];
        let fieldValue;
        let fieldName;
        let fields = [];
        let target = e.target;
        let jsondata = {...reviewJson}
        let errors = {...formErrors}

        fieldName = item.name;
        fieldValue = target.value;
        fields = JSON.parse(JSON.stringify(formDataSet));

        fields[index][fieldName] = fieldValue;
        errors[index][fieldName] = false
        if(e.target.value == "Modify"){
            let name = item.name.substring(0,item.name.length-5)
            jsondata.reviewInformation.reasons[index].fields.forEach((val,pos)=>{
                if(val.name == name){
                    val.disable = false
                    val.defaultValue = ""
                }
            })
            setReviewJson(jsondata)
        }
        if(e.target.value == "No Action"){
            let name = item.name.substring(0,item.name.length-5)
            jsondata.reviewInformation.reasons[index].fields.forEach((val,pos)=>{
                if(val.name == name){
                    val.disable = true
                    fields[index][name] = val.initialVal
                }
            })
            setReviewJson(jsondata)
        }
        if(item.modify && item.name != "fuelQuantity"){
            let val = disputeAmount(target.value)
            fields[index][fieldName] = val
        }
        setformDataSet(fields);
        setformErrors(errors)
    }
    const checkRadio=(radio,input,index)=>{
        let errors = {...formErrors}
        let valid = true
        radio.forEach((item)=>{
            if(formDataSet[index][item] == null){
                valid = false
            }
        })
        Object.keys(input).forEach((item)=>{
            if(formDataSet[index][item] == ''){
                    valid = false
                    errors[index][item] = true
            }
        })
        setformErrors(errors)
        return valid
    }
    const onClickSubmit =(e,item,index)=>{
        let save = {...saveIndicator}
        let showIcon = {...iconShow}
        let jsondata = {...reviewJson}
        let payload = {...savePayload}
        let radionames = []
        let inputnames = {}
        let i1=0
        jsondata.reviewInformation.reasons[index].fields.forEach((val,pos)=>{
            if(val.component == "radio"){
                radionames[i1] = val.name
                i1++
            }
            if(val.component == "input"){
                    inputnames[val.name] = val.name
            }
        })
        let valid = checkRadio(radionames,inputnames,index)
        //let inputval = checkInput()
        jsondata.reviewInformation.reasons[index].fields.forEach((val,pos)=>{
            if(val.component == "button"){
                if(val.label == "Save"){
                    if(valid){
                        val.label = val.text2
                        save[index] = true
                        showIcon[index] = true
                        if(disputeVal.DisputeReasons[index].Reason == "Fuel Price Mismatch"){
                            payload.DisputeReasons[index].IssueName = disputeVal.DisputeReasons[index].IssueName
                            payload.DisputeReasons[index].Reason = disputeVal.DisputeReasons[index].Reason
                            payload.DisputeReasons[index].ResolutionAction = formDataSet[index]["fuelPrice"+"check"]
                            payload.DisputeReasons[index].ResolutionValue = ""
                            payload.DisputeReasons[index].Cause=formDataSet[index]["cause"]
                            payload.DisputeReasons[index].SubCause=formDataSet[index]["subcause"]
                            payload.DisputeDetailid= disputeVal.DisputeReasons[index].Detailid
                        }
                        //Service Not Available
                        if(disputeVal.DisputeReasons[index].Reason == "Service Not Availed"){
                            payload.DisputeReasons[index].IssueName = disputeVal.DisputeReasons[index].IssueName
                            payload.DisputeReasons[index].Reason = disputeVal.DisputeReasons[index].Reason
                            payload.DisputeReasons[index].ResolutionAction = formDataSet[index]["serviceAvail"]
                            payload.DisputeReasons[index].ResolutionValue = ""
                            payload.DisputeReasons[index].Cause=formDataSet[index]["cause"]
                            payload.DisputeReasons[index].SubCause=formDataSet[index]["subcause"]
                            payload.DisputeDetailid= disputeVal.DisputeReasons[index].Detailid
                        }
                        if(disputeVal.DisputeReasons[index].Reason == "Duplicate Charge"){
                            payload.DisputeReasons[index].IssueName = disputeVal.DisputeReasons[index].IssueName
                            payload.DisputeReasons[index].Reason = disputeVal.DisputeReasons[index].Reason
                            payload.DisputeReasons[index].ResolutionAction = formDataSet[index]["duplicate"]
                            payload.DisputeReasons[index].ResolutionValue = ""
                            payload.DisputeReasons[index].Cause=formDataSet[index]["cause"]
                            payload.DisputeReasons[index].SubCause=formDataSet[index]["subcause"]
                            payload.DisputeDetailid= disputeVal.DisputeReasons[index].Detailid
                        }
                        if(disputeVal.DisputeReasons[index].Reason == "Fuel Quantity Mismatch"){
                            payload.DisputeReasons[index].IssueName = disputeVal.DisputeReasons[index].IssueName
                            payload.DisputeReasons[index].Reason = disputeVal.DisputeReasons[index].Reason
                            payload.DisputeReasons[index].ResolutionAction = formDataSet[index]["fuelQuantity"+"check"]
                            payload.DisputeReasons[index].ResolutionValue = ""
                            payload.DisputeReasons[index].Cause=formDataSet[index]["cause"]
                            payload.DisputeReasons[index].SubCause=formDataSet[index]["subcause"]
                            payload.DisputeDetailid= disputeVal.DisputeReasons[index].Detailid
                        }
                        if(disputeVal.DisputeReasons[index].Reason == "Incorrect Tax"){
                            payload.DisputeReasons[index].IssueName = disputeVal.DisputeReasons[index].IssueName
                            payload.DisputeReasons[index].Reason = disputeVal.DisputeReasons[index].Reason
                            payload.DisputeReasons[index].Cause=formDataSet[index]["cause"]
                            payload.DisputeReasons[index].SubCause=formDataSet[index]["subcause"]
                            payload.DisputeReasons[index].Taxes = []
                            payload.DisputeDetailid= disputeVal.DisputeReasons[index].Detailid
                            disputeVal.DisputeReasons[index].Taxes.forEach((item,ind)=>{
                                payload.DisputeReasons[index].Taxes[ind] = {}
                                payload.DisputeReasons[index].Taxes[ind].ResolutionAction = formDataSet[index][item.TaxName+"check"]
                                payload.DisputeReasons[index].Taxes[ind].TaxType = item.TaxType
                                payload.DisputeReasons[index].Taxes[ind].TaxName = item.TaxName
                                let val = formDataSet[index][item.TaxName+"check"] == "Modify" ? formDataSet[index][item.TaxName] : null
                                payload.DisputeReasons[index].Taxes[ind].ResolutionValue = val
                            })
                        }
                        if(disputeVal.DisputeReasons[index].Reason == "Incorrect Fee"){
                            payload.DisputeReasons[index].IssueName = disputeVal.DisputeReasons[index].IssueName
                            payload.DisputeReasons[index].Reason = disputeVal.DisputeReasons[index].Reason
                            payload.DisputeReasons[index].Cause=formDataSet[index]["cause"]
                            payload.DisputeReasons[index].SubCause=formDataSet[index]["subcause"]
                            payload.DisputeReasons[index].Fees = []
                            payload.DisputeDetailid= disputeVal.DisputeReasons[index].Detailid
                            disputeVal.DisputeReasons[index].Fees.forEach((item,ind)=>{
                                payload.DisputeReasons[index].Fees[ind] = {}
                                payload.DisputeReasons[index].Fees[ind].ResolutionAction = formDataSet[index][item.FeeName+"check"]
                                payload.DisputeReasons[index].Fees[ind].FeeName = item.FeeName
                                let val = formDataSet[index][item.FeeName+"check"] == "Modify" ? formDataSet[index][item.FeeName] : null
                                payload.DisputeReasons[index].Fees[ind].ResolutionValue = val
                            })
                        }
                        // if(disputeVal.DisputeReasons[index].Reason == "Additional Services Not Used"){
                        //     payload.DisputeReasons[index].IssueName = disputeVal.DisputeReasons[index].IssueName
                        //     payload.DisputeReasons[index].Reason = disputeVal.DisputeReasons[index].Reason
                        //     payload.DisputeReasons[index].Cause=formDataSet[index]["cause"]
                        //     payload.DisputeReasons[index].SubCause=formDataSet[index]["subcause"]
                        //     payload.DisputeReasons[index].Services = []
                        //     payload.DisputeDetailid= disputeVal.DisputeReasons[index].Detailid
                        // }
                        if(disputeVal.DisputeReasons[index].Reason == "Incorrect Tail Number"){
                            payload.DisputeReasons[index].IssueName = disputeVal.DisputeReasons[index].IssueName
                            payload.DisputeReasons[index].Reason = disputeVal.DisputeReasons[index].Reason
                            payload.DisputeReasons[index].Cause=formDataSet[index]["cause"]
                            payload.DisputeReasons[index].SubCause=formDataSet[index]["subcause"]
                            payload.DisputeReasons[index].ResolutionAction = formDataSet[index]["tail"]
                            payload.DisputeReasons[index].ResolutionValue = ""
                            payload.DisputeDetailid= disputeVal.DisputeReasons[index].Detailid
                        }
                        if(disputeVal.DisputeReasons[index].Reason == "Incorrect Fueling Date"){
                            payload.DisputeReasons[index].IssueName = disputeVal.DisputeReasons[index].IssueName
                            payload.DisputeReasons[index].Reason = disputeVal.DisputeReasons[index].Reason
                            payload.DisputeReasons[index].Cause=formDataSet[index]["cause"]
                            payload.DisputeReasons[index].SubCause=formDataSet[index]["subcause"]
                            payload.DisputeReasons[index].ResolutionAction = formDataSet[index]["date"]
                            payload.DisputeReasons[index].ResolutionValue = ""
                            payload.DisputeDetailid= disputeVal.DisputeReasons[index].Detailid
                        }
                        if(disputeVal.DisputeReasons[index].Reason == "Incorrect Discount"){
                            payload.DisputeReasons[index].IssueName = disputeVal.DisputeReasons[index].IssueName
                            payload.DisputeReasons[index].Reason = disputeVal.DisputeReasons[index].Reason
                            payload.DisputeReasons[index].ResolutionAction = formDataSet[index]["Discount"+"check"]
                            let val = formDataSet[index]["Discount"+"check"] == "Modify" ? formDataSet[index]["Discount"] : null
                            payload.DisputeReasons[index].ResolutionValue = val
                            payload.DisputeReasons[index].Cause=formDataSet[index]["cause"]
                            payload.DisputeReasons[index].SubCause=formDataSet[index]["subcause"]
                            payload.DisputeDetailid= disputeVal.DisputeReasons[index].Detailid
                        }
                        if(disputeVal.DisputeReasons[index].Reason == "Additional Services Not Billed"){
                            payload.DisputeReasons[index].IssueName = disputeVal.DisputeReasons[index].IssueName
                            payload.DisputeReasons[index].Reason = disputeVal.DisputeReasons[index].Reason
                            payload.DisputeReasons[index].Cause=formDataSet[index]["cause"]
                            payload.DisputeReasons[index].SubCause=formDataSet[index]["subcause"]
                            payload.DisputeReasons[index].Services = []
                            payload.DisputeDetailid= disputeVal.DisputeReasons[index].Detailid
                            disputeVal.DisputeReasons[index].Services.forEach((item,ind)=>{
                                payload.DisputeReasons[index].Services[ind] = {}
                                payload.DisputeReasons[index].Services[ind].ResolutionAction = formDataSet[index][item.ServiceName]
                                payload.DisputeReasons[index].Services[ind].ServiceName = item.ServiceName
                                let val = formDataSet[index][item.ServiceName] == "Modify" ? formDataSet[index][item.ServiceName] : ""
                                payload.DisputeReasons[index].Services[ind].ResolutionValue = val
                            })
                        }
                        if(disputeVal.DisputeReasons[index].Reason == "Additional Services Not Received"){
                            payload.DisputeReasons[index].IssueName = disputeVal.DisputeReasons[index].IssueName
                            payload.DisputeReasons[index].Reason = disputeVal.DisputeReasons[index].Reason
                            payload.DisputeReasons[index].Cause=formDataSet[index]["cause"]
                            payload.DisputeReasons[index].SubCause=formDataSet[index]["subcause"]
                            payload.DisputeReasons[index].Services = []
                            payload.DisputeDetailid= disputeVal.DisputeReasons[index].Detailid
                            disputeVal.DisputeReasons[index].Services.forEach((item,ind)=>{
                                payload.DisputeReasons[index].Services[ind] = {}
                                payload.DisputeReasons[index].Services[ind].ResolutionAction = formDataSet[index][item.ServiceName]
                                payload.DisputeReasons[index].Services[ind].ServiceName = item.ServiceName
                                let val = formDataSet[index][item.ServiceName] == "Modify" ? formDataSet[index][item.ServiceName] : ""
                                payload.DisputeReasons[index].Services[ind].ResolutionValue = val
                            })
                        }
                        fetchResolveDetails(dispatch,payload).then(res=>{
                            payload.DisputeReasons[index] = {}
                        })
                    }else{
                        setShow(true)
                        setModalText(reviewJson.modal[0].message)
                    }
                }else if(item.label == "Reopen"){
                    val.label = val.text1
                    const payload = {"role":userType == "Barrel Fuel" ? "BFUser" : userType,
                    "Loggedinuser":userEmail,
                    "Status":"Reopen",
                    "DisputeDetailID":disputeVal.DisputeReasons[index].Detailid}
                    updateDispute(dispatch,payload).then(res=>{
                        let auditPayload = {"ModuleName":"Orders",
                            "TabName":"Dispute",
                            "Activity":payload["Status"]+" the dispute for disputed id "+payload["DisputeID"],
                            "ActionBy":Storage.getItem('email'),
                            "Role":JSON.parse(Storage.getItem('userRoles')),
                            "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
              saveAuditLogData(auditPayload, dispatch)

                    })
                    save[index] = false
                }
            }
        })
        setSaveIndicator(save)
        setIconShow(showIcon)
        setReviewJson(jsondata)
    }
    const closeModal = () => {
        setShow(false)
        setHistory(false)
        setModalText('')
        document.getElementById('root').style.filter = 'none';
      }
      const SuccessModal = () =>{
        setShow(false)
        setModalText('')
        document.getElementById('root').style.filter = 'none';
        if(modalText == reviewJson.modal[0].cancel){
        updateDispute(dispatch,updateReq).then(res=>{
            let auditPayload = {"ModuleName":"Orders",
                  "TabName":"Dispute",
                  "Activity":updateReq["Status"]+" the dispute for disputed id "+updateReq["DisputeID"],
                  "ActionBy":Storage.getItem('email'),
                  "Role":JSON.parse(Storage.getItem('userRoles')),
                  "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
              saveAuditLogData(auditPayload, dispatch)
  
        })
        navigate(`/dashboard/order/dispute`)  
        }
      }
    const viewFile = (e,index) => {

    // console.log(row)
    let content=disputeVal.DisputeReasons[index].document
    let contentFormat=disputeVal.DisputeReasons[index].documenttype
        let base64ImageData = content.replace('base64:type251:','');

        const contentType = contentFormat;
        //base64ImageData = "data:"+contentFormat+";base64,"+base64ImageData
        let byteCharacters = window.atob(base64ImageData);
        //const byteCharacters = window.atob(byteChar);
        const byteArrays = [];
        byteCharacters = byteCharacters.replace('data:'+contentType+';base64,','')

        byteCharacters = window.atob(byteCharacters)


        for (let offset = 0; offset < byteCharacters.length; offset += 1024) {

            const slice = byteCharacters.slice(offset, offset + 1024);
            const byteNumbers = new Array(slice.length);

            for (let i = 0; i < slice.length; i++) {

                byteNumbers[i] = slice.charCodeAt(i);

            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);

        }
        const blob = new Blob(byteArrays, { type: contentType });
        const blobUrl = URL.createObjectURL(blob);
            window.open(blobUrl, '_blank');
      }
      const showHistory=()=>{
        setHistory(true)
        document.getElementById('root').style.filter = 'blur(5px)';
        setLoad(true)
      }
    const getOperatorFields = (item, index) => {
        switch (item.component.toUpperCase()) {
            case "INPUT":
                return (<Input
                   
                    colWidth={item.styles ? item.styles.colWidth : ""}
                    Type={item.type}
                    Label={item.label}
                    disabled = {saveIndicator[index] ? saveIndicator[index] : item.disable}
                    Placeholder={item.placeholder}
                    isRequred={item.isRequired}
                    Name={item.name}
                    handleChange={(e) => handleChange(e, item,index)}
                    handleBlur={(e) => handleBlur(e, item, index)} 
                    formDataSet={formDataSet && formDataSet[index][item.name] ? formDataSet[index][item.name] : item.defaultValue ? item.defaultValue : ''}
                    errorMessage={formErrors[index][item.name] ? '' : null}
                    fieldError={
                        formErrors && 
                        formErrors[index][item.name]
                    }
                      />)
            case "RADIO":
                // if(item.name == 'duplicate') {
                //     item.styles['className'] = item.styles.className + ' bf-duplicate';
                // }
                // if(item.name == "tail"){
                //     item.styles['className'] = item.styles.className + ' bf-duplicate';
                // }
                return ( <Radio type={item.type} 
                    Label={item.label} 
                    Name={item.name}
                    formDataSet={formDataSet && formDataSet[index][item.name] ? formDataSet[index][item.name] :item.defaultValue ? item.defaultValue : ''}
                    colWidth={item.styles ? item.styles.colWidth : ''}
                    disabled = {saveIndicator[index]}
                    options={item.options}
                    className={item.styles? item.styles.className: ''}
                    handleChange={(e) => handleChange(e, item,index)}
                    handleBlur={(e) => handleBlur(e, item)}/>)              
            case "PARAGRAPH":
              return (<div className='heading'><Subheading label={item.label} />{saveIndicator[index] && iconShow[index] ? <FaCheckCircle className='bf-success-icon'/> : ''}</div>) 
            case "SPAN":
                return (<span title={item.label}> {item.label} </span>)  
            case "LINKSPAN":
                return (<div><span title={item.label}> {item.label} </span><a className='bf-order-link'>{item.label2}</a></div>)       
            case "BUTTON":
                if(Review && View){
                    return('')
                }else{
                return (Review ? <ButtonComponent
                    Label={item.label}
                    Type={item.type}
                    className={item.styles.className}
                    variant={item.variant}
                    disabled={false}
                    handleClick={(e) => onClickSubmit(e,item,index)}
                     /> : '')
                }
            case 'LINK':
                return (<a onClick={(e)=>viewFile(e,index)} className='bf-view-document'>{item.label}</a>)
            case "TEXTAREA" :
                return( 
                    <TextArea
                      Name={item.name?item.name:''}
                      Label={item.label?item.label:''}
                      colWidth={item.styles ? item.styles.colWidth : ""} 
                      Type={item.type} 
                      Placeholder={item.placeholder}
                      textLength={formDataSet[index][item.name]? formDataSet[index][item.name].length : "0"}
                      maxLength={item.maxLength}
                      disabled = {saveIndicator[index]}
                      isRequred={item.isRequired}
                      onChange={(e)=>handleChange(e,item,index)}
                      Rows={item.rows ? item.rows : 3}
                      restriction={item.lengthRestriction}
                      value={formDataSet[index][item.name]? formDataSet[index][item.name] : ""}
                    />
                ) 
        };
    } 
    const formatHtmlStructure = (allFields, index, reason) => {
        let structuredArray = []
        let listAray = []
        let emptyArray = false
        structuredArray = allFields.map((item,i)=>{
            if(emptyArray) {
                listAray = []
                emptyArray = false
            }
            if(item.place == 'left') {
                    listAray.push(item)
                if(item.component.toUpperCase() == 'RADIO') {
                    if(allFields[i+1] && allFields[i+1].component.toUpperCase() != 'INPUT') {
                        emptyArray = true
                        return listAray
                    }
                    if(i+1 == allFields.length){
                        emptyArray = true
                        return listAray
                    }
                } 
                if (item.component.toUpperCase() == 'INPUT') {
                    emptyArray = true
                    return listAray
                }
                
            }
        })
        let structure = structuredArray.filter(item => {
            if(typeof(item) !== 'undefined') {
                return item
            }
        })
        let rea = reason.substring(12,reason.length)
        let reasonText = (rea == 'Fuel Quantity Mismatch' || rea == 'Incorrect Fueling Date' || rea == 'Incorrect Tail Number' || rea == 'Duplicate Charge' || rea == 'Fuel Price Mismatch' || rea == 'Service Not Availed' ? 'bf-split-row' : '')
        return (
            <div className="bf-full-reason">
                {
                    reasonText == '' ?
                    structure.map((item) => <div className="bf-single-sub-reason">{item.map((element) => <>{getOperatorFields(element,index)}</>)}</div>)
                    : rea == "Duplicate Charge" ? 
                    structure.map((item) => <div className="bf-single-sub-reason bf-split-reason-row ">
                    <div>
                        {item.map((element,ind) => <>{ind !=1 ? getOperatorFields(element,index) : null}</>)}
                    </div>
                        {item.map((element,ind) => <>{ind ==1 ?getOperatorFields(element,index): null}</>)}
                    </div>)
                :
                    structure.map((item) => <div className="bf-single-sub-reason bf-split-reason-row ">
                        <div>
                            {item.map((element,ind) => <>{ind !=2 ? getOperatorFields(element,index) : null}</>)}
                        </div>
                        {item.map((element,ind) => <>{ind ==2 ?getOperatorFields(element,index): null}</>)}
                    </div>)
                }
            </div>
        )
    }
    return (<>
        {isBusy ? (
          (<Loader/>)
        ) : (<div className='bf-order-placement-home bf-disputes-container'>
                {(dispute.Status == "Open" || dispute.Status == "Reopen") && View ? <div className='bf-order-heading'>{reviewJson.reviewInformation.heading.label1 + dispData.orderid}</div> : ''}
                {(dispute.Status == "Open" || dispute.Status == "Reopen") && !View ? <div className='bf-order-heading'>{reviewJson.reviewInformation.heading.label + dispData.orderid}</div> : ''}
                {dispute.Status == "Resolved" ? <div className='bf-order-heading'>{reviewJson.reviewInformation.heading.label2 + dispData.orderid}</div> : ''}
                <div className='bf-order-admin-view'><div></div><a onClick={(e)=>{showHistory()}} className='bf-hyperlink bf-order-history'>{reviewJson.reviewInformation.link.label}</a></div>
                <div className='d-flex d-flex-row bf-review-dispute'>
                <div className={`bf-dispute-screen bf-${Status}`}>
                {reviewJson.reviewInformation.reasons.map((item,index)=>(
                    <div className='bf-dispute-section'>
                       <div>
                        {item.fields.map((val)=>(
                                val.component == "paragraph" ? <>
                                {getOperatorFields(val,index)}
                                </> : '')
                            )}
                        </div>
                        <div className='row'>
                            {item.fields.map((val)=>(
                                val.place == "right" ? <>
                                {getOperatorFields(val,index)}
                                </> : '')
                            )}
                        </div>

                        <>
                            {formatHtmlStructure(item.fields, index, item.fields[0].label)}
                        </>
                    </div>
            ))}
    {showModal && <CustomModal
        show={showModal}
        onHide={() => SuccessModal()}
        close={() => closeModal()}
        hide={() => closeModal()}
        size={''}
        isPrompt={true}
        modelBodyContent={modalText}
        buttonText={modalText == reviewJson.modal[0].message ? reviewJson.modal[0].text : reviewJson.modal[0].button1}
        secondbutton={modalText == reviewJson.modal[0].cancel ? reviewJson.modal[0].button2 : null}
    />}
    {history && <AccordionModal
        show={history}
        onHide={() => closeModal()}
        loading = {load}
        orderNumber = {dispute.Ordernumber}
        buttonText={"Dismiss"}
        modalId={"bf-modal-accordion"}
    />}
                <EditFormModal
         onHide={() => closeEditModal()}
         formErrors={DisputeError}
         formdata={DisputeFormData}
         show={editmodalShow}
         dispute={true}
         json={Cancel ? reviewJson.disputeManagement.editmodalBF : reviewJson.disputeManagement.editmodal}
         onHandleChange={handleDispChange}
         onHandleBlur={handleDisputeBlur}
         onClickSubmit={onModalSubmit}
         showError = {modalText}
         customOptions = {Cancel ? true:false}
         customButtons={true}
         primaryButtonText={"Submit"}
         secondbutton={"Cancel"}
         modalClassName={"bf-cancel-modal"}
         userOptions={requestedBy}
    />
            </div>
                <DisputeLogs
                dispute = {dispute}
                 Logs={reviewJson.disputeManagement}
                 handleChange={handleDispChange}
                 handleBlur={handleDisputeBlur}
                 onClickSubmit={onDisputeSubmit}
                 formDataSet={DisputeFormData}
                 formErrors={DisputeError}
                 DisputeVal={disputeVal}
                 review={Review}
                />
            </div>
            </div>
        )}
        </>
    );
}