import React, { useState,useEffect,useRef } from 'react';
/* import Input from '../input/input';
import Select from '../select/select';
import Radio from '../radio/radio'; */
import { bfaJsonService } from '../../actions/BFAServices/BFAJsonService';
/* import ButtonComponent from '../button/button';
import MultiSelectCheckbox from '../multiSelect/multiSelectCheckbox'; */
//import * as xlsx from "xlsx";
import { useLocation, useNavigate } from 'react-router-dom';
import BFTable from '../table/table'
import Loader from '../loader/loader';
import CustomModal from '../customModal/customModal';
import ButtonComponent from '../button/button';
import EditFormModal from '../customModal/editModal';
import { camelize, getFieldIsValid, getFormatedAmount, getFormatedDateforDisplay, getFormattedMMDDYY, getFormattedYYMMDD, getFormErrorRules, phoneValidation } from '../../controls/validations';
import { adminAddUserSave } from "../../actions/adminAddUserService/adminAddUserService";
import {AdminAddUser} from "../admin/adminAddUser";
import  {AdminSignupForm} from "../admin/adminSignupForm";
import { getAccessLevel } from '../../controls/commanAccessLevel';
import { useDispatch, useSelector } from 'react-redux';
import { getIsResolveDispute, getJSONData, getOrderMultiRowData, getOrderRowData, getOrderTab } from '../../actions/orderActions/orderCompletedAction';
import { filterOrderTable } from './orderFilter';
import OrderView from './orderView';
import OrderSummary from './orderSummary';
import { fetchOrderViewHomeJson, getClickViewOrder } from '../../actions/orderPlacementActions/orderViewHomeActions';
import { FaCheckCircle } from 'react-icons/fa';
// import { raiseDispute } from '../../actions/orderActions/activeOrderService';
import { getOperatorsByTailNum, saveOrder } from '../../actions/orderPlacementActions/orderPlacementService';
import { getIsReorder, getIsSummary, getLegData, getLegLevel, getLegType, getMultipleLeg, getIsEditSingle, saveOrderData, getIsOrderAccept, getIsPreviousScreen, getIsOrderClose } from '../../actions/orderPlacementActions/orderPlacementActions';
import { cancelDeclineOrder, getFboLocationServices, getFboUsers, raiseDispute } from '../../actions/orderActions/activeOrderService';
// import { getOperatorsByTailNum } from '../../actions/orderPlacementActions/orderPlacementService';
// import { getIsEditSingle, getIsReorder, getLegLevel, getLegType, getMultipleLeg } from '../../actions/orderPlacementActions/orderPlacementActions';
import { getEditLegData } from '../../actions/orderPlacementActions/multiLegActions';
import Radio from '../radio/radio';
import { validateAmountForFive} from '../../controls/validations';
import { invoiceScreen, prevScreen } from '../../actions/orderActions/disputeAction';
import { sender_Email } from '../../controls/commonConstants';
import { SendMailToUsers } from '../../services/commonServices';
import AccordionModal from '../customModal/accordionModal';
import MultiLegSummary from './multiLegSummary';
import {saveAuditLogData } from '../../actions/auditLog/auditLogActions';
import { Storage} from '../../controls/Storage';
import BackIcon from '../../assets/images/collapse_arrow.svg';
import AddMoreIcon from '../../assets/images/icon-add-more.png';
import { saveNotificationList } from '../../actions/notificationService/notificationAction';
import { getMobileHeaderText } from '../../actions/commonActions/commonActions';

function ViewCompletedOrders() {
    let {state} = useLocation()
    const [jsonPayload, setJsonPayload] = useState({ 'blobname': 'orderViewSummary.json' });
    const [linkIndex, setlinkIndex] = useState([]);
    const [services, setServices] = useState([]);
    const [actualServices, setActualServices] = useState([]);
    const [allServices, setAllServices] = useState([]);
    const [DocumentArray, setDocumentArray] = useState([]);
    const [requestedBy, setRequestedBy] = useState([]);
    const [fboRequestedBy, setFboRequestedBy] = useState([]);
    const [operatorRequestedBy, setOperatorRequestedBy] = useState([]);
    const [discounts, setDiscounts] = useState(0);
    const [gallonValue, setGallonValue] = useState(0);
    const [allTaxes, setAllTaxes] = useState([]);
    const [fuelPrice, setFuelPrice] = useState(0);
    const [totalTaxValue, setTotalTaxValue] = useState(0);
    const [totalServiceValue, setTotalServiceValue] = useState(0);
    const [subTotal, setSubTotal] = useState(0);
    const [totalValue, setTotalValue] = useState();
    const [cardFee, setCardFee] = useState(0);
    const [fuelCostSavings, setFuelCostSavings] = useState(0);
    const [orderDetails, setOrderDetails] = useState({});
    const [viewType, setViewType] = useState('');
    const [formData, setFormData] = useState({})
    const [formDataSet, setFormDataSet] = useState({})
    const [isBtnValidate,setbtnValidate]=useState(false);
    const [isEdit,setIsEdit]=useState(false);
    const [dispIndex,setDuspIndex]=useState();
    const [acceptBack,setAcceptBack]=useState(false);
    const [accept,setAccept]=useState(false);
    const [isMulti,setIsMulti]=useState(false);
    const [submittedForm,setsubmittedForm]=useState(false);
    const [disputeDisable,setDisputeDisable]=useState(false);
    const [formFieldData , setFormFieldData] = useState([]);
    const [formErrors , setFormErrors] = useState({});
    const [formFieldErrors , setFormFieldErrors] = useState([]);
    const [uploadDocumentMsg, setUploadDocumentMsg] = useState([]);
    const [editmodalShow, seteditModalShow] = useState(false);
    const [linkClick, setLinkClick] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [isEditClose, setIsEditClose] = useState(false);
    const [multiSelectOptions , setmultiSelectOptions] = useState({});
    const [modalText, setModalText] = useState('');
    const [tab, setOrderTab] = useState('');
    const [history,setHistory] = useState(false)
    const [orderNumber, setOrderNumber] = useState('');
    const [multiNumber, setMultiNumber] = useState('');
    const [orderStatus, setorderStatus] = useState('');
    const [summaryJSON, setSummaryJSON] = useState(false);
    const [showSummary, setShowSummary] = useState(false);
    const [isDisputeShow, setIsDisputeShow] = useState(false);
    const [popUpJson , setpopUpJson] = useState();
    const [reviewJson , setReviewJson] = useState(null);
    const [mobileEditModalShow , setMobileEditModalShow] = useState(false);
    const [DisputesList , setDisputesList] = useState([]);
    const params = {"blobname":"reviewDispute.json"}
    const dispatch = useDispatch()
    const disputeRed = useSelector((state) => state.disputeReducer)
    const invoice = disputeRed && disputeRed.invoiceScreen && disputeRed.invoiceScreen.data
    const prevpage = disputeRed && disputeRed.prevScreen && disputeRed.prevScreen.data
    const dispData = disputeRed && disputeRed.disputeData && disputeRed.disputeData.data
    const loginReducer = useSelector(state => state.loginReducer);
    const accessLvl = loginReducer?.loginAccessLevel?.data ? loginReducer?.loginAccessLevel?.data :[]
    const access =  JSON.parse(accessLvl)
    const orderPlacementReducer = useSelector((state)=>state.orderPlacementReducer);
    const isOrderAccept = orderPlacementReducer?.isOrderAccept?.data;
    const commonReducer = useSelector((state) => state.commonReducer);
    const loggedInUser = commonReducer?.loggedInUser?.data
    const loggedInUserType = commonReducer?.loggedInUserType?.data
    const orderActiveReducer = useSelector((state) => state.orderActiveReducer);
    const orderCompletedReducer = useSelector((state) => state.orderCompletedReducer);
    const selectedTab = orderCompletedReducer?.selectedTabOrder?.data;
    const loader = orderCompletedReducer?.loading;
    const isPreviousScreen = orderPlacementReducer?.isPreviousScreen?.data;
    const activeJson = orderActiveReducer?.orderActiveJson?.data?.data?.active
    let jsonData
    if(selectedTab=='active'){
      let filteredJson = orderActiveReducer?.orderActiveJson?.data?.data?.active?.content?.declineData;
      let tp= filteredJson && filteredJson[0]?.fields.filter((m)=>m?.users.includes(loggedInUserType?.toLowerCase()))
      if(tp){
        filteredJson[0].fields=tp
      }
       jsonData = filteredJson;
    }else{
      let filteredJson = orderCompletedReducer?.orderCompletedJson?.data?.data?.orderCompletedData[0]?.raiseDisputeData[0];
      let tp=filteredJson?.sections[0].fields.filter((m)=>m?.users.includes(loggedInUserType?.toLowerCase()))
      if(tp){
        filteredJson.sections[0].fields=tp
      }
       jsonData = filteredJson;
    }
    
    const orderRowData = orderCompletedReducer?.orderRowData?.data
    const isResolveDispute = orderCompletedReducer?.isResolveDispute?.data
    const orderViewHomeReducer = useSelector((state)=>state.orderViewHomeReducer);
    const orderViewHomeJson = orderViewHomeReducer?.orderviewHomeJson?.data?.data?.orderViewSummary;
    const isClickViewOrder = orderViewHomeReducer?.isClickViewOrder

    
    let paylod = { 'blobname': 'orderCompleted.json' }
    let navigate = useNavigate();
    
    useEffect(() => {
      if(isOrderAccept){
        setSummaryJSON(true)
      }
      fetchOrderViewHomeJson(dispatch,jsonPayload)
      bfaJsonService(params).then(response=>{
        setReviewJson(response.data.reviewData)
    })
  }, []);


  useEffect(() => {
    let acc=JSON.parse(accessLvl)
    if(acc?.includes('Super') || acc?.includes('Admin') || loggedInUserType.toLowerCase()=='barrel fuel'){
      setDisputeDisable(false)
    }else{
      setDisputeDisable(true)
    }
    setOrderTab(selectedTab)
    let data = orderRowData
    if(orderRowData.IsMultiLeg=='true' && isOrderAccept){
      setIsMulti(true)
      setFormData(orderRowData)
      setMultiNumber(orderRowData?.OrderLegs[0]?.OrderNumber)
    }else{
      createFormData(data);
    } 
  }, [orderRowData])
  useEffect(() => {
    return()=>{
     document.getElementById('root').style.filter = 'none';
    }
 }, [])

  const createFormData=(data)=>{
    let fieldData = data?.OrderLegs[0]
    // let data = legData && legData
    // let fieldData = legData && legData.OrderLegs && legData.OrderLegs.length ?  legData?.OrderLegs[0] :{}
      fieldData["OrderDate"] = data?.OrderDate ?getFormattedMMDDYY(data.OrderDate) :""
      fieldData["OrderNumberDisplay"] = data?.OrderLegs[0].OrderNumber_Display ? data?.OrderLegs[0].OrderNumber_Display : data?.OrderLegs[0].OrderNumber
      fieldData["OperatorName"] = data?.OperatorName ?data.OperatorName :""
      fieldData["OrderStatus"] = data?.OrderLegs[0]?.OrderStatus ?data?.OrderLegs[0].OrderStatus:""
      fieldData["CreatedBy"] = data?.RequestByName?data.RequestByName :""
      fieldData["PhoneNumber"] = data?.Operator_ContactNumber?phoneValidation(data.Operator_ContactNumber.toString()) : phoneValidation("7865435786")
      fieldData["RequestBy"] = data?.RequestBy?data.RequestBy :""
      fieldData["address"] =data?.OrderLegs[0]?.Address?data.OrderLegs[0].Address :""
      fieldData["FuellingDate"] =  data?.OrderLegs[0]?.FuellingDate?getFormattedMMDDYY(data.OrderLegs[0].FuellingDate) :""
      fieldData["FuelQuantity"] = parseFloat(data?.OrderLegs[0]?.FuelQuantity).toFixed(2)
      fieldData["IsMultiLeg"] = data?.IsMultiLeg
      fieldData["MultiNumber"] = data?.IsMultiLeg == "true" ? data?.OrderNumber : ""
      fieldData["Date"] = data?.OrderLegs[0]?.Date?getFormattedMMDDYY(data.OrderLegs[0].Date) :getFormattedMMDDYY(data.OrderLegs[0].OrderDate)
      //console.log(fieldData)
      if(fieldData?.EditedValues && fieldData?.EditedValues.length){
        let edit=[]
        fieldData?.EditedValues.map((val)=>{
          Object.keys(val).forEach((name)=>{
            if(val[name]){
              edit.push(name)
            }
          }) 
        })
        fieldData["Edited"]=edit;
      }
      if(new Date() > new Date(fieldData?.FuellingDate) && loggedInUserType.toLowerCase()=='fbo' && selectedTab=='active'){
        setIsEditClose(true)
      }
      setorderStatus(data?.OrderLegs[0]?.OrderStatus)
      setGallonValue(parseFloat(data?.OrderLegs[0]?.FuelQuantity).toFixed(2))
      setOrderNumber(isResolveDispute ? fieldData?.OrderNumberDisplay : fieldData?.OrderNumber)
      if(fieldData?.Discounts && fieldData?.Discounts.length){
        setDiscounts(fieldData?.Discounts[0]?.Amount.toFixed(2))
      }
      setFormData(fieldData)
      let formData={}
      formData['fuelservice'] = fieldData?.FuelType
      let orderData={}
      orderData["formData"] = formData
      setOrderDetails(orderData)
      setFuelPrice(fieldData?.BasePrice)
      setTotalValue(fieldData?.FinalPrice)
      setCardFee(fieldData?.CardFee)
      setSubTotal(parseFloat(fieldData?.FinalPrice)-parseFloat(fieldData?.CardFee))
      setFuelCostSavings(fieldData?.FuelCostSavings)
      let taxdata = fieldData?.Taxes ? fieldData?.Taxes :[]
      let allFees = fieldData?.Fees? fieldData?.Fees :[]
      let allTaxes = [...taxdata, ...allFees]
      let taxes=[]
      let totalAmount=0;
      allTaxes && allTaxes.length && allTaxes.forEach((tax)=>{
        let taxValue = tax.Amount
        let Tdata = {
            "name": tax.FeeName? tax.FeeName : tax.TaxName,
            "amount" : taxValue?.toFixed(2),
            "unit": tax.Fees?tax.FeeTiers[0].unit :tax.Unit,
            "type": tax.Fees?"fees":"tax",
            "taxType": tax.Tax?( tax.TaxType?"Federal/State Tax" :"Custom Tax"):"",
        }
        totalAmount+= taxValue
        taxes.push(Tdata)
      })
      setAllTaxes(taxes)
      setTotalTaxValue(totalAmount)
      let servs  = []
      let servAmount=0;
      fieldData?.Services && fieldData?.Services.length && fieldData?.Services?.forEach((serv)=>{
        servs.push({
          "name":serv.ServiceName,
          "amount":serv.Amount
      })
        servAmount+=serv.Amount
      })
      setServices(servs)
      setTotalServiceValue(servAmount)
      setoptions(fieldData)
      let requestedBy=[]
    let fboRequestedBy=[]
    if(fieldData.OrderStatus=="Completed" || fieldData.OrderStatus=="Pending"){
      getOperatorsByTailNum({"TailNumber":fieldData?.TailNumber}).then((res)=>{
        if(res){
          let data = res && res.length && res[0].length && res[0][0]['JSON_UNQUOTE(@JSONResponse)']?JSON.parse(res[0][0]['JSON_UNQUOTE(@JSONResponse)']):[];
          data.map((value)=>{
            if(value.Operators && value.Operators.length && value.Operators[0].Operator==fieldData.OperatorName){
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
        setOperatorRequestedBy(requestedBy)
      })
      let payload={"role":"FBO","FBO":fieldData.FBO,"Loggedinuser":loggedInUser}
      getFboUsers(payload).then((res)=>{
        if(res){
          let data = res && res.length && res[0].length && res[0][0]['JSON_UNQUOTE(@JSONResponse)']?JSON.parse(res[0][0]['JSON_UNQUOTE(@JSONResponse)']):[];
          data.map((value)=>{
                let obj={}
                obj.title=value.RequestedBy
                obj.value=value.RequestedBy
                fboRequestedBy.push(obj)  
          })
        }
        setFboRequestedBy(fboRequestedBy)
      })
        
          
      }
  }
  const setoptions=(data)=>{
    let fees=[]
    let services=[]
    let tax=[]
    let discount=[]
    let option={}
    data?.Services?.forEach((serv)=>{
      let obj={}
      obj.value=serv.ServiceName
      obj.label=serv.ServiceName
      services.push(obj)
    })

    data?.Taxes?.forEach((taxes)=>{
      let obj={}
      obj.value=taxes.TaxName
      obj.label=taxes.TaxName
      tax.push(obj)
    })

    data?.Fees?.forEach((tax)=>{
      let obj={}
      obj.value=tax.FeeName
      obj.label=tax.FeeName
      fees.push(obj)
    })
    option.Services=services
    option.Fees=fees
    option.Taxes=tax
    setActualServices(services)
    setmultiSelectOptions(option)
  }
  useEffect(() => {
    let data= jsonData &&  JSON.parse(JSON.stringify(jsonData && jsonData))
    if(selectedTab=='active'){
      if(accept){
        setInitialState([activeJson?.content?.acceptFields])
        setpopUpJson(activeJson?.content?.acceptFields)
      }else{
        setpopUpJson(data && data[0])
        setInitialState(data)
      }
    }else{
      let json=data?.sections[1]?.fieldsArray[0]?.fields.filter((m)=>m?.dynamicValue?.includes('all') || m?.dynamicValue?.includes('fuel') || m?.dynamicValue?.includes('fuel quantity mismatch'))
      data?.sections[1]?.fieldsArray?.splice(0,1)
      let temp={}
      temp['fields']=json
      data?.sections[1]?.fieldsArray.push(temp)
      setpopUpJson(data?.sections)
      setInitialState(data?.sections)
    }
    
  }, [jsonData,editmodalShow]);

  const setInitialState= (json,fields)=> {
    let formErrors = {};
    
    
    const formData = {};
    let formdetails=[];
    let formFieldError = [];
    const fieldTypeArr = ['input', 'select','multiselectcheckbox','doc','date','textarea'];
    json?.forEach((items)=>{
        
        items?.fields?.forEach( (item) => {
            if (fieldTypeArr.includes(item.component.toLowerCase())) {
                formData[item.name] = formDataSet && formDataSet[item.name] ? formDataSet[item.name] :item.defaultValue?item.defaultValue:"";
                formErrors[item.name] = getFormErrorRules(item);
            }
        })

       items?.fieldsArray?.forEach( (item,index) => {
        let details = {};
        let errDetails = {};
            item.fields.forEach((item)=>{
                if (fieldTypeArr.includes(item?.component?.toLowerCase())) {
                  if(item.type=="file"){
                    errDetails[item.name] = formFieldErrors  && formFieldErrors.length>index && formFieldErrors[index][item.name] ? formFieldErrors[index][item.name] : getFormErrorRules(item);
                  }
                  else if(index==0 && !DisputesList.length){
                    details[item.name] =fields  && fields.length>index && fields[index][item.name] ? fields[index][item.name] :  formFieldData  && formFieldData.length>index && formFieldData[index][item.name]? formFieldData[index][item.name]: item.defaultValue?item.defaultValue:"";
                    errDetails[item.name] = formFieldErrors  && formFieldErrors.length>index && formFieldErrors[index][item.name] ? formFieldErrors[index][item.name] : getFormErrorRules(item);
                    
                  }else{
                    details[item.name] = fields  && fields.length>index && fields[index][item.name]? fields[index][item.name] : formFieldData  && formFieldData.length>index && formFieldData[index][item.name] ? formFieldData[index][item.name] :"";
                    errDetails[item.name] = formFieldErrors  && formFieldErrors.length>index && formFieldErrors[index][item.name] ? formFieldErrors[index][item.name] : getFormErrorRules(item);
                  
                  }
                    
                }
            })
            formdetails.push(JSON.parse(JSON.stringify(details)));
            formFieldError.push(JSON.parse(JSON.stringify(errDetails)));
        })
    });

    setFormFieldData(formdetails);
    setFormFieldErrors(formFieldError);
    setFormDataSet(formData);
    setFormErrors(formErrors);
  }

  const addMore = ()=>{
    let data=JSON.parse(JSON.stringify(jsonData && jsonData))
    let addNewFiled ={}
    let temp = data.sections[1].fieldsArray[0].fields;  
         
    temp=temp.filter((m)=>m?.dynamicValue?.includes("only"))
    addNewFiled['fields'] = temp
    let list=popUpJson
     list[1].fieldsArray.push(addNewFiled);
    setInitialState(list) 
    setpopUpJson(list)
    
  }

  const removeButton = (item,index) => {
    let fieldArr = popUpJson;
    fieldArr[1].fieldsArray.splice(index,1);
    setpopUpJson(fieldArr);
    let updatedFormFieldData = formFieldData;
    updatedFormFieldData.splice(index,1)
    setFormFieldData(updatedFormFieldData);
    let updatedFormFieldErrors = formFieldErrors;
    updatedFormFieldErrors.splice(index,1)
    setFormFieldErrors(updatedFormFieldErrors);
    let uploadMessage= uploadDocumentMsg;
    if(uploadMessage[index]){
      uploadMessage.splice(index,1)
      setUploadDocumentMsg(uploadMessage)
    }
    let j;
    let ind=linkIndex
      ind.length && ind.map((val,i)=>{
        if(val==index){
          j=i;
        }
      })
    ind.length && ind.splice(j,1)
    setInitialState(fieldArr);

  }

  const handleDisputeEdit = (item,index) => {
    let data= jsonData &&  JSON.parse(JSON.stringify(jsonData && jsonData))
    let json=data?.mobileSections[1]?.fieldsArray[0]?.fields.filter((m)=>m?.dynamicValue?.includes('all') || m?.dynamicValue?.includes(item?.IssueName?.toLowerCase()) || m?.dynamicValue?.includes(item?.Reason?.toLowerCase()))
      data?.mobileSections[1]?.fieldsArray?.splice(0,1)
      let temp={}
      temp['fields']=json
      data?.mobileSections[1]?.fieldsArray.push(temp)
    // let fieldsData=[item]
    //   console.log(fieldsData)
    //   setFormFieldData(fieldsData)  
      setpopUpJson(data?.mobileSections)
      setIsEdit(true)
      setDuspIndex(index)
      setInitialState(data?.mobileSections,[item])
      setMobileEditModalShow(true)
  }
  const handleRaiseDisputeSubmit = () => {
    if(DisputesList.length) {
      setFormFieldData(DisputesList)
      onClickSubmit("Submit",undefined,undefined,true)
    }
  }
  const handleRaiseDispute = () => {
    let data= jsonData &&  JSON.parse(JSON.stringify(jsonData && jsonData))
    let json=data?.mobileSections[1]?.fieldsArray[0]?.fields.filter((m)=>m?.dynamicValue?.includes('all') || m?.dynamicValue?.includes('fuel') || m?.dynamicValue?.includes('fuel quantity mismatch'))
    if(DisputesList.length){
      json=data?.mobileSections[1]?.fieldsArray[0]?.fields.filter((m)=>m?.dynamicValue?.includes('all'))
    }
      data?.mobileSections[1]?.fieldsArray?.splice(0,1)
      let temp={}
      temp['fields']=json
      data?.mobileSections[1]?.fieldsArray.push(temp)
      setpopUpJson(data?.mobileSections)
      setInitialState(data?.mobileSections)
      setMobileEditModalShow(true)
  }

  const createJson = (value,item,index,fields)=>{
    let data=JSON.parse(JSON.stringify(jsonData && jsonData))
    let popup=JSON.parse(JSON.stringify(popUpJson))
    let json;
    let field=popup[1].fieldsArray[index].fields
    if(value=="Cancel" || value=="Add Notes & Documents"){
      if(value=="Add Notes & Documents"){
        if(mobileEditModalShow) {
          json=data?.mobileSections[1]?.fieldsArray[0]?.fields.filter((m)=>m?.dynamicValue?.includes('add notes'))
        } else {
          json=data?.sections[1]?.fieldsArray[0]?.fields.filter((m)=>m?.dynamicValue?.includes('add notes'))
        }
        json.map((v)=>{
          field.push(v)
        })
      }else{
        field = field.filter((m)=>!m?.dynamicValue?.includes('add notes'))
      }
      json=field
    }else{
      if(mobileEditModalShow) {
        json=data?.mobileSections[1]?.fieldsArray[0]?.fields.filter((m)=>m?.dynamicValue?.includes('all') || m?.dynamicValue?.includes(value.toLowerCase()))
      } else {
        json=data?.sections[1]?.fieldsArray[0]?.fields.filter((m)=>m?.dynamicValue?.includes('all') || m?.dynamicValue?.includes(value.toLowerCase()))
      }
    }
    
    // data?.sections[1]?.fieldsArray?.splice(0,1)
    let temp={}
    temp['fields']=json
    popup[1].fieldsArray[index]=temp
    setInitialState(popup,fields)
    setpopUpJson(popup)
  }

  const isValidFileExtenstion = (fileName) => {

    if (fileName.toLowerCase().endsWith(".png") || fileName.toLowerCase().endsWith(".jpg") || fileName.toLowerCase().endsWith(".jpeg") || fileName.toLowerCase().endsWith("pdf") || fileName.toLowerCase().endsWith("doc") || fileName.toLowerCase().endsWith("docx")) {
      return true;
    } else {
      return false
    }

  }

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    })
  }

  const validateDocument = (file,field,index)=>{
    let fileSizeAndType='';
    let flag=true;
    let isValidType=isValidFileExtenstion(file.name)
    if(file.size <= 5242880 && isValidType){
      fileSizeAndType="Valid"
      let uploadMessage=uploadDocumentMsg;
      uploadMessage[index]=field.successMessage
      setUploadDocumentMsg(uploadMessage)
      let doc=DocumentArray
      getBase64(file).then((res)=>{
        let obj={}
        obj.name=file.name;
        obj.doc=res;
        doc.push(obj)
        //console.log(doc)
        setDocumentArray(doc)
      });
      validateField(field.name, fileSizeAndType, index, flag);
    }else{
      
      if (!isValidType) {
        fileSizeAndType = 'InvalidType'
      } else {
        fileSizeAndType = 'InvalidSize'
      }
      flag = true;
      validateField(field.name, fileSizeAndType,index, flag);
    }
  }
  const onHandleChange= (e,item,index,flag)=>{
    let fields = [];
    let fieldName,fieldValue;
    let multiSelects=multiSelectOptions
    fields = [...formFieldData];
    let formfields={...formDataSet}
    fieldName = item.name;
    let maxLength = 0
    if (item && item.maxLength) {
      maxLength = parseInt(item.maxLength);
  }
  if (maxLength > 0 && e.target.value.length > maxLength) {
      e.target.value = e.target.value.substring(0, maxLength);
      return;
  }
    if(flag){
      
        if(fieldName === "ActualTailNumber"){
          e.target.value = e.target.value.replace(/[^a-z0-9]/gi,'')
        }
        if(fieldName === "RelatedOrderId"){
          e.target.value = e.target.value.replace(/[^a-z0-9]/gi,'')
        }
        if(fieldName === "Unit"){
          //e.target.value = e.target.value.replace(/[^a-z0-9]/gi,'')
          if(fields[index]["QuotedDiscount"]){
            fields[index]["QuotedDiscount"] = "";
          }
        }

        if(fieldName == 'QuotedDiscount'){ 
          e.target.value = validateAmountForFive({unit:fields[index]["Unit"]},e.target.value)
        }
      
      if(item.type=="file"){
        fieldValue = e.target.files[0];
        fields[index]['DocumentName'] = e.target.files[0].name;
        fields[index]['DocumentType'] = e.target.files[0].type;
        validateDocument(fieldValue,item,index)   
      
      }else if(fieldName == 'ActualFuelQuantity'){
        let result = /^(?=.*\d)\d{0,5}(?:\.\d{0,2})?$/.test(e&&e.target &&e.target.value)
        if(result){
          fieldValue =  e?.target?.value;
          fields[index][fieldName] = fieldValue;
        }else if(e?.target?.value == ''){
          fieldValue=''
          fields[index][fieldName] = fieldValue;
        }else{
          return
        }
        
      }else if(fieldName == 'Unit'){
        if(fields[index]['QuotedDiscount']){
          fields[index]['QuotedDiscount'] = '';
        }
        fields[index][fieldName] = e.target.value;
      }else if(fieldName=='ActualFuelDate'){
        
        //if(fieldValue !== undefined){
        fieldValue = e&&e.$d&&e.$d
        if(fieldValue !== null){
        fields[index][fieldName] = getFormattedMMDDYY(new Date(fieldValue));
          // fieldValue=e?.$d
          // let selectedDate = e&&e.$d&&e.$d
          // let today = new Date(minDate);
          // let maxdate= new Date(maxDate);
          // let invalidDate;
          // today.setHours(0,0,0,0)
          // if( selectedDate == "Invalid Date" || new Date(selectedDate) < today || new Date(selectedDate)> maxdate) {
          //   invalidDate = true;
          //   fieldValue= "";
          // } else {
          //   invalidDate = false;
          // }
        //}
        }
        
      }else if(item.type == "multiselectcheckbox"){
          fieldValue = e.length ? e.map(i => i.value) : null;
          fields[index][fieldName] = fieldValue;
      }else{
            if(item.name=="IssueName"){
              fields[index]["Reason"]="";
            }
            if(item.name=="Reason"){
              if(fields[index]["Unit"]){
                fields[index]["Unit"]="";
              }
              if(e.target.value=="Additional Services Not Billed"){
                multiSelects["Services"]=allServices
                setmultiSelectOptions(multiSelects)
              }else if(e.target.value=="Additional Services Not Received"){
                multiSelects["Services"]=actualServices
                setmultiSelectOptions(multiSelects)
              }
            }
            fieldValue = e.target.value;
          
          
          fields[index][fieldName] = fieldValue;
      }
      if(item.fieldType){
        createJson(fieldValue,item,index,fields)
      }else{
        setFormFieldData(fields);
      }
    }else{
      if(item.name=='viewType'){
        setViewType(e.target.value)
        if(e.target.value=="FBO View"){
          setRequestedBy(fboRequestedBy)
        }else{
          setRequestedBy(operatorRequestedBy)
        }
      }else{
        fieldValue = e.target.value;
        formfields[item.name]=fieldValue;
        setFormDataSet(formfields)
      }
      
    }
    
    if(isBtnValidate){
      validateField(fieldName,fieldValue,index,flag)
    }
    let isValid=validateForm();
    if (isValid) {
      setModalText('');
    }
    
    
  }

  const validateField = (fieldName, value,index, flag, section,isDuplicate,isAircraftDuplicate) => {
    const fieldValidationErrors = {
        ...formErrors
    };
    let NewFieldValidationErrors = []; 
    NewFieldValidationErrors = [ ...formFieldErrors ];
    let fieldValidationError;

    if (flag) {
        fieldValidationError = NewFieldValidationErrors[index][fieldName];
    } else {
        fieldValidationError = fieldValidationErrors[fieldName];
    }
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
        setFormFieldErrors(NewFieldValidationErrors);
    } else {
        let errcount = validationObj.errcount;
        if (!errcount) {
            fieldValidationErrors[fieldName].isValid = true;
            fieldValidationErrors[fieldName].activeValidator = {};
        } else {
            fieldValidationErrors[fieldName].isValid = false;
            fieldValidationErrors[fieldName].activeValidator = validationObj.fieldValidationError.activeValidator;
        }
        setFormErrors(fieldValidationErrors);

    }
  }
  const onHandleBlur= (e,item)=>{
        
  }

  const onLinkClick =(e,item,index)=>{
    let ind=JSON.parse(JSON.stringify(linkIndex))
    if(item.name == "viewInvoice"){
      setLinkClick(true)
      getClickViewOrder(dispatch,true)
      if(isOrderAccept){
        getIsOrderAccept(dispatch,false)
        if(isMulti){
          getIsPreviousScreen(dispatch,'multiSummary')
          getOrderMultiRowData(formData,dispatch)
          navigate('/dashboard/fuelorder/viewMultiOrder')
        }else{
          setAcceptBack(true)
        }  
      }
      getIsResolveDispute(false,dispatch)
      setSummaryJSON(false)
    }else{
      if(e?.target?.name.toLowerCase()!="cancel"){
        if(ind.length==0 || !ind.includes(index)){
          ind.push(index)
        }  
      }else{
      let j;
      let msg=uploadDocumentMsg;
      ind.length && ind.map((val,i)=>{
        if(val==index){
          j=i;
        }
      })
      ind.length && ind.splice(j,1)
      msg.splice(index,1)
      setUploadDocumentMsg(msg)
    }
    setlinkIndex(ind)
    createJson(e.target.name,item,index)
    }
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

    formFieldErrors?.map((val, index) => {
        Object.keys(val).forEach((fieldname) => {
            if (!formFieldErrors[index][fieldname].isValid) {
              formValid = formFieldErrors[index][fieldname].isValid;
              return formValid;
            }
        })
    })

    return formValid;

  }

  const createPayload = (list) =>{
    let fieldDatas=JSON.parse(JSON.stringify(list ? list : formFieldData))
    let Documents=[...DocumentArray]
    let fdata={...formData}
    let taxes=fdata.Taxes
    let payload={}
    payload.RaisedBy=loggedInUserType.toLowerCase()=='barrel fuel' ? formDataSet.requestedBy : loggedInUser;
    payload.OrderNumber=orderNumber;
    fieldDatas.map((val,index)=>{
        let txt=[]
        if(val.Taxes){
          taxes.map((tax)=>{
            if(val.Taxes.includes(tax.TaxName)){
              let obj={}
              obj.TaxName=tax.TaxName
              obj.TaxType=tax.TaxType
              txt.push(obj)
            }
          })
          val.Taxes=txt
        }
        Object.keys(val).map((name)=>{
          if(name=="ActualFuelPrice" || name=="QuotedDiscount" || name=="ActualFuelQuantity"){
            val[name]=parseFloat(val[name])
          }
          if(name=="ActualFuelDate"){
            val[name]=getFormattedYYMMDD(new Date(val[name]))
          }
        })
        if(val.DocumentName){
          Documents && Documents.length && Documents.map((doc)=>{
            if(val.DocumentName==doc.name){
              val['DocumentUpload']=doc.doc;
            }
          })
        }
      }) 
    payload['DisputeReasons']=fieldDatas
    //console.log(payload)
    return payload;
  }
  const handleContinue = (val) => {
    setShowSummary(val)
  }
  const onClickSubmit= (e,item,index, isMobile)=>{
      if(item?.name=='addNew'){
        addMore();
      }else if(item?.name=='remove'){
        removeButton(item,index)
      }else if(e=="Submit" || e=="Yes" || e=="Save"){
        setbtnValidate(true)
        if(!isMobile) {
          Object.keys(formErrors).forEach((fieldName) => {
              validateField(
                fieldName,
                formDataSet[fieldName],
                index,
                false
            );
          })
        }
        if(!isMobile) {
          formFieldData?.forEach((val, index) => {
            Object.keys(val).forEach((fieldName) => {
              if(fieldName!="DocumentUpload" && fieldName!="DocumentType" && fieldName!="DocumentName"){
                validateField(
                  fieldName,
                  formFieldData[index][fieldName],
                  index,
                  true
              );
              }
            })
          })
        }
        
        let isValid= !isMobile ? validateForm() : true;
        if(isValid){
          if(e== "Save") {
            let Data = [...formFieldData]
            if(isEdit){
              let dispList=DisputesList
              dispList[dispIndex]=Data[0]
              setDisputesList(dispList)
            }else{
              setDisputesList([...DisputesList,...formFieldData])
            }
            closeEditModal()
            return;
          }
          setsubmittedForm(true)
          if(accept){
            successModal()
          }else if(tab=='active'){
            let payload={}
            payload.RequestedBy=loggedInUser
            payload.role=loggedInUserType
            payload.Loggedinuser=loggedInUser
            payload.Status="Declined"
            payload.StatusReason=formDataSet.StatusReason
            payload.StatusNotes=formDataSet.StatusNotes?.replace("\n"," ");
            payload.OrderDetailid=formData.OrderDetailid;
            console.log(formData)
            cancelDeclineOrder(payload).then((res)=>{ //
              let req = {}
              req.type = "create"
              if(formData.IsMultiLeg == "true"){
                req.notificationMessage = reviewJson.notifyMessage.msg7+formData.CreatedBy+reviewJson.notifyMessage.msg10+formData.OrderNumberDisplay+reviewJson.notifyMessage.msg13+formData.MultiNumber+reviewJson.notifyMessage.msg14+"."
              }else{
                req.notificationMessage = reviewJson.notifyMessage.msg7+formData.CreatedBy+reviewJson.notifyMessage.msg10+formData.OrderNumber+reviewJson.notifyMessage.msg11+"."
              }
              req.organizationName = formData.OperatorName
              req.loginUserName = loggedInUser
              req.sendNotificationTo = "ORG Internal"
              req.access_levels = ["Level 1 (Admin)","Level 2 (Standard)","Level 3 (Basic)"]
              req.levelOfAccess = access.includes('Super') ? "Level 1 (Admin)" : access.includes('Admin') ? "Level 2 (Standard)" : "Level 3 (Basic)"
              req.isActionable = false
              req.actionTaken = ""
              req.category = "order"
              req.readInd = false
              saveNotificationList(req,dispatch).then((res)=>{
          
              })
              setsubmittedForm(false)
              if(res){
                if(res[0][0].Msg=="Record(s) process successfully"){
                  let emailData=activeJson?.content?.declineEmailBody;
                  let userName=formData.CreatedBy;
                  let orderNum = orderNumber ? orderNumber : ""
                  let htmlText1 = emailData?.html1 ? emailData.html1+orderNum:'';
                  let htmlText2 = emailData?.html2 ? emailData.html2:''
                  let paragraph = `${emailData.paragraph} ${camelize(userName)},`
                  let body = `${paragraph} <br> <br>${ htmlText1+htmlText2}`
                  const emailPayload = {
                    "to":formData.RequestBy,
                    "from": sender_Email,
                    "subject": emailData?.title+orderNum+emailData?.title2,
                    "text": paragraph,
                    "html": body
                  }
                  SendMailToUsers(emailPayload);
                  seteditModalShow(false)
                  document.getElementById('root').style.filter = 'none';
                  getOrderTab('completed',dispatch)
                  let auditPayload = {"ModuleName":"Orders",
                              "TabName":"Complete",
                              "Activity":payload.Status+" orders "+payload.OrderDetailid,
                              "ActionBy":Storage.getItem('email'),
                              "Role":JSON.parse(Storage.getItem('userRoles')),
                              "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
                  saveAuditLogData(auditPayload, dispatch)
                  navigate("/dashboard/order")
                }
              }else{
                setModalText('Server Error')
              }
            })
          }else{
            let payload
            if(!isMobile) {
              payload = createPayload();
            } else {
              payload = createPayload(DisputesList);
            }
            
            raiseDispute(payload).then((res)=>{
              setsubmittedForm(false)
              if(res){
                console.log(formData)
                if(res[0][0].Msg=="Record(s) process successfully"){
                  let req = {}
                  if(loggedInUserType.toLowerCase()=='fbo'){
                  req.type = "create"
                  req.notificationMessage = reviewJson.notifyMessage.msg4+payload.OrderNumber+reviewJson.notifyMessage.msg6+"."
                  req.organizationName = formData.FBO
                  req.loginUserName = loggedInUser
                  req.sendNotificationTo = "ORG Internal"
                  req.access_levels = ["Level 1 (Admin)","Level 2 (Standard)","Level 3 (Basic)"]
                  req.levelOfAccess = access.includes('Super') ? "Level 1 (Admin)" : access.includes('Admin') ? "Level 2 (Standard)" : "Level 3 (Basic)"
                  req.isActionable = false
                  req.actionTaken = ""
                  req.category = "account"
                  req.readInd = false
                  }else{
                    req.type = "create"
                    req.notificationMessage = reviewJson.notifyMessage.msg4+payload.OrderNumber+reviewJson.notifyMessage.msg5+"."
                    req.organizationName = formData.OperatorName
                    req.loginUserName = loggedInUser
                    req.sendNotificationTo = "ORG Internal"
                    req.access_levels = ["Level 1 (Admin)","Level 2 (Standard)","Level 3 (Basic)"]
                    req.levelOfAccess = access.includes('Super') ? "Level 1 (Admin)" : access.includes('Admin') ? "Level 2 (Standard)" : "Level 3 (Basic)"
                    req.isActionable = false
                    req.actionTaken = ""
                    req.category = "order"
                    req.readInd = false
                  }
                  saveNotificationList(req,dispatch).then((res)=>{
      
                  })

                  seteditModalShow(false)
                  document.getElementById('root').style.filter = 'none';
                  getOrderTab('dispute',dispatch)
                  navigate("/dashboard/order")
                  let emailData=jsonData.emailBody;
                  let userName=res && res.length && res[1].length && res[1][0]?.RequesterName
                  let orderNum = orderNumber ? orderNumber : ""
                  let htmlText1 = emailData?.html1 ? emailData.html1+'['+orderNum+']':'';
                  let htmlText2 = loggedInUserType.toLowerCase()=='fbo' || viewType=='FBO View' ? emailData?.htmlFbo : emailData?.html2 ? emailData.html2:''
                  let paragraph = `${emailData.paragraph} ${camelize(userName)},`
                  let body = `${paragraph} <br> <br>${ htmlText1+htmlText2}`
                  const emailPayload = {
                    "to":payload?.RaisedBy,
                    "from": sender_Email,
                    "subject": emailData?.title+'['+orderNum+']',
                    "text": paragraph,
                    "html": body
                  }
                  SendMailToUsers(emailPayload);
                  let auditPayload = {"ModuleName":"Orders",
                  "TabName":"Dispute",
                  "Activity":"Raised the dispute for  orders "+orderNum,
                  "ActionBy":Storage.getItem('email'),
                  "Role":JSON.parse(Storage.getItem('userRoles')),
                  "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
              saveAuditLogData(auditPayload, dispatch)
                }else{
                  setModalText(res[0] && res[0][0].Msg)
                }
              }else{
                setModalText('Server Error')
              }
              
            });
          }
          
        }else{
          setModalText(tab=='active'? jsonData[0]?.errorMessage : jsonData?.errorMessage)
        }
      }else if(item.name=='back'){
        if(isMobile) {
          setShowSummary(false)
          return
        }
        if(prevpage == "review"){
          navigate("/dashboard/review")
        }else if(prevpage == "viewopen"){
          navigate("/dashboard/viewopen")
        }else{
        getOrderTab(selectedTab,dispatch)
        getIsResolveDispute(false,dispatch)
        if(isPreviousScreen=='viewMultiOrder'){
          navigate("/dashboard/fuelorder/viewMultiOrder")
        }else if(isClickViewOrder){
          if(linkClick){
            if(acceptBack){
              navigate("/dashboard/order")
            }else{
              setSummaryJSON(true)
            }
          }else{
          getIsSummary(dispatch,true)
          navigate("/dashboard/fuelorder/order")
          }
        }
        else{
          navigate("/dashboard/order")
        }  
      }
      }else if(isEditClose){
        getIsPreviousScreen(dispatch,'viewOrder')
        getIsOrderClose(dispatch,true)
        getEditLegData(dispatch,formData)
        getLegType(dispatch,false)
        getMultipleLeg(dispatch,false)
        getLegLevel(dispatch,0)
        navigate('/dashboard/fuelorder/order')
      }else if(orderStatus=="Processed" || (orderStatus=="Pending" && loggedInUserType.toLowerCase()=='fbo') || orderStatus=="Escalated" || orderStatus=='Price Pending'){
        getIsPreviousScreen(dispatch,'viewOrder')
        getIsEditSingle(dispatch,true)
        getEditLegData(dispatch,formData)
        getLegType(dispatch,false)
        getIsSummary(dispatch,false)
        getMultipleLeg(dispatch,false)
        getLegLevel(dispatch,0)
        navigate('/dashboard/fuelorder/order')
      }else if(orderStatus=="Pending"){
        if(loggedInUserType.toLowerCase()=='barrel fuel'){
          setAccept(true)
          seteditModalShow(true)
        }else{
          setModalText(jsonData[0]?.acceptMessage)
          setModalShow(true)
        }
        document.getElementById('root').style.filter = "blur(5px)"
      }else if(orderStatus!=="Completed"){
        getIsPreviousScreen(dispatch,'viewOrder')
        getIsReorder(dispatch,true)
        getEditLegData(dispatch,formData)
        getLegType(dispatch,false)
        getMultipleLeg(dispatch,false)
        getLegLevel(dispatch,0)
        navigate('/dashboard/fuelorder/order')
      }else{
        if(isResolveDispute){
          setModalText("All Changes Are Final, Are You Sure You Want To Save The Changes?")
          setModalShow(true)
          document.getElementById('root').style.filter = "blur(5px)"
        }
        else{
        
        let load={}
        load.role=loggedInUserType
        load.FBO=formData.FBO
        load.Location=formData.ICAO
        load.Loggedinuser=loggedInUser
        let allService=[]
        getFboLocationServices(load).then(res=>{
          if(res){
            let data = res && res.length && res[0].length && res[0][0]['JSON_UNQUOTE(@JSONResponse)']?JSON.parse(res[0][0]['JSON_UNQUOTE(@JSONResponse)']):[];
            data.map((value)=>{
              let obj={}
              obj.label=value.Service
              obj.value=value.Service
              allService.push(obj)
              
            })
            setAllServices(allService)
          }
        })
        if(isMobile) {
          setIsDisputeShow(true);
          getMobileHeaderText(dispatch, "Dispute Summary")
        } else {
          seteditModalShow(true)
        }
        
      }
    }
        
  }
  const onRowClick = (row,index)=>{
    setMultiNumber(row["orderNumber"])
  }
  const getSummaryData = (item,index)=>{
    switch (item.component.toLowerCase()) {
      case "header":
          return(
              <div className='bf-order-heading'>
                  {isResolveDispute? item.textResolve : isOrderAccept ? item.textAccepted : item.text}
              </div>
          )
      case "data":
            return(
                <div className={`bf-order-summary-header ${item.styles ? item.styles.className : ''}`}>
                     <div>
                     {(item.name =="OrderDate")?`${item.text}${getFormatedDateforDisplay(formData[item.name])}`:`${isResolveDispute?  item.text2 : item.text} ${isResolveDispute? formData["OrderNumberDisplay"] :formData[item.name]}`}
                     </div>
                </div>
            )
      case "icon":
        return(
            <FaCheckCircle className='bf-success-icon'/>
        )
      case "value":
          return(
            <div className={`bf-order-summary-header ${item.styles ? item.styles.className : ''}`}>
                {item.name == "TotalOrderValue" ?(`${item.name == "TotalOrderValue"?"$":''}${isMulti ? getFormatedAmount(formData['OrderFinalPrice']) : getFormatedAmount(totalValue)  }`) : formData[item.name]}
            </div>
          )
      case "link":
          return(
              <div className={`bf-padding-left-15 ${item.styles ? item.styles.className : ''}`} onClick={(e)=>onLinkClick(e,item,index)}>
                  {item.text}
              </div>
          )
      case "text":
          return(
              <div className={`bf-padding-left-15 ${item.styles ? item.styles.className : ''}`}>
                  <div>{isResolveDispute && item.name == "endText" ? "" : item.text}</div>
              </div>
          )
      case"button":
          return(
              <ButtonComponent       
                  Label={"Done"} 
                  Type={item.type} 
                  className={item.styles.className}
                  variant={item.variant}
                  disabled={false}
                  handleClick={(e)=>{onClickDone(e,item)}}
                  />
          )
      default:
          break;
    }
  }
  const handleDisputesBack = () => {

    getMobileHeaderText(dispatch, "Completed Order")
    setIsDisputeShow(false);
    setDisputesList([]);
    closeEditModal();
  }
  const onClickDone= ()=>{
    if(isOrderAccept){
      getOrderTab('active',dispatch)
    }else{
      getOrderTab('dispute',dispatch)
    }
    getIsOrderAccept(dispatch,false)
    invoiceScreen(false,dispatch)
    getIsResolveDispute(false,dispatch)
    navigate("/dashboard/order")
  }
  const successModal = ()=>{
    if(orderStatus=='Pending'){
      let payload={}
      payload.RequestedBy=loggedInUserType.toLowerCase()=='barrel fuel' ? formDataSet?.requestedBy : loggedInUser
      payload.role=loggedInUserType
      payload.Loggedinuser=loggedInUser
      payload.Status="Accept"
      payload.OrderDetailid=formData.OrderDetailid;
      cancelDeclineOrder(payload).then((res)=>{
        setsubmittedForm(false)
        if(res){
          // order accept
          let payload = {}
          payload.type = "create"
          payload.notificationMessage = formData.OrderNumber+ reviewJson.notifyMessage.msg1+"."
          payload.organizationName = formData.FBO
          payload.loginUserName = loggedInUser
          payload.sendNotificationTo = "ORG Internal"
          payload.access_levels = ["Level 1 (Admin)","Level 2 (Standard)","Level 3 (Basic)"]
          payload.levelOfAccess = access.includes('Super') ? "Level 1 (Admin)" : access.includes('Admin') ? "Level 2 (Standard)" : "Level 3 (Basic)"
          payload.isActionable = false
          payload.actionTaken = ""
          payload.category = "order"
          payload.readInd = false
          saveNotificationList(payload,dispatch).then((res)=>{
      
          })


          let data = res && res.length && res[0].length && res[0][0]['@JSONResponse']?JSON.parse(res[0][0]['@JSONResponse']):[];
          getIsOrderAccept(dispatch,true)
          if(data[0].IsMultiLeg=='true'){
            setFormData(data[0])
            setIsMulti(true)
          }else{
            createFormData(data?.length && data[0])
          }
          
          setModalShow(false)
          seteditModalShow(false)
          setModalText("")
          document.getElementById('root').style.filter = 'none';
          setSummaryJSON(true)
        }
        
      })
    }else{
      saveOrderData(dispatch,orderRowData).then((res)=>{
        let result = res[0] && res[0][0] && res[0][0]['JSON_UNQUOTE(@JSONResponse)'] ? JSON.parse(res[0][0]['JSON_UNQUOTE(@JSONResponse)']):[]
        setModalShow(false)
        setSummaryJSON(true)
        prevScreen('fuelOrder',dispatch)
        setModalText("")
        getLegData(dispatch,{})
        let payload = {}
        payload.type = "create"
        payload.notificationMessage = reviewJson.notifyMessage.msg7+orderRowData.RequestByName+reviewJson.notifyMessage.msg8+orderNumber+reviewJson.notifyMessage.msg9+"."
        payload.organizationName = loggedInUserType.toLowerCase()=='fbo' ? formData.OperatorName : formData.FBO
        payload.loginUserName = loggedInUser
        payload.sendNotificationTo = "ORG Internal"
        payload.access_levels = ["Level 1 (Admin)","Level 2 (Standard)","Level 3 (Basic)"]
        payload.levelOfAccess = access.includes('Super') ? "Level 1 (Admin)" : access.includes('Admin') ? "Level 2 (Standard)" : "Level 3 (Basic)"
        payload.isActionable = false
        payload.actionTaken = ""
        payload.category = "order"
        payload.readInd = false
        saveNotificationList(payload,dispatch).then((res)=>{
      
        })
          let emailData=reviewJson.emailBody;
                  let userName=res && res.length && res[1].length && res[1][0]?.RequesterName
                  let orderNum = orderNumber ? orderNumber : ""
                  let htmlText1 = emailData?.html1 ? emailData.html1+' ['+orderNum+']':'';
                  let htmlText2 = emailData?.html2 ? emailData.html2:''
                  let paragraph = `${emailData.paragraph} ${camelize(orderRowData.OrderLegs[0].CreatedBy)},`
                  let body = `${paragraph} <br> <br>${ htmlText1+htmlText2}`
                  const emailPayload = {
                    "to":orderRowData.CreatedBy,
                    "from": sender_Email,
                    "subject": emailData?.title+'['+orderNum+']'+emailData?.title2,
                    "text": paragraph,
                    "html": body
                  }
                  SendMailToUsers(emailPayload);
      }
      )
      document.getElementById('root').style.filter = 'none';
    }
    
  }
  const closeModal = ()=>{
    setModalShow(false)
    setHistory(false)
    setModalText("")
    document.getElementById('root').style.filter = 'none';
  }
  

  const onLink =(e,item)=>{
    seteditModalShow(true)
    
  }
  const showHistory=()=>{
    setHistory(true)
    document.getElementById('root').style.filter = 'blur(5px)';
  }
  const closeEditModal =(val)=>{
    if(val=="Delete"){
      if(dispIndex || dispIndex==0){
        let updatedFormFieldData = DisputesList;
        updatedFormFieldData.splice(dispIndex,1)
        setDisputesList(updatedFormFieldData);
      }
    }
    seteditModalShow(false)
    setIsEdit(false)
    setDuspIndex()
    setMobileEditModalShow(false)
    setbtnValidate(false)
    setAccept(false)
    setFormFieldData([])
    setDocumentArray([])
    setFormFieldErrors([])
    setUploadDocumentMsg([])
    setlinkIndex([])
    setFormDataSet({})
    setModalText('')
    document.getElementById('root').style.filter = 'none';
  }

  const getOperatorFields = (item) => {
    switch(item?.component?.toUpperCase()) {
        
      case "RADIO":
        return ( <Radio type={item.type} 
            Label={item.label} 
            Name={item.name}
            formDataSet={viewType ? viewType : item.defaultValue ? item.label : ''}
            colWidth={item.styles ? item.styles.colWidth : ''}
            options={item.options}
            className={item.styles? item.styles.className: ''}
            handleChange={(e) => onHandleChange(e, item)}
            handleBlur={(e) => onHandleBlur(e, item)}/>)  
    }        
  }

   return (
  <div className='bf-account-home-container w100i bf-search-fuel-order-container'>
      {orderViewHomeJson && <><div  className={`bf-order-placement-home ${'bf-'+orderStatus+'-view '}${(!isResolveDispute && (orderStatus=="Completed" || orderStatus=="Declined" || orderStatus=="Canceled"))? 'bf-raise-dispute-container-section' : ''}`}>
      <div className='bf-home-company-name bf-search-result-name'>{summaryJSON && !isOrderAccept ? `Dispute Resolved - ${orderNumber}` : invoice ? `View Invoice - ${orderNumber}` : isOrderAccept ? 'Order Accepted' : isResolveDispute ?`Verify Changes ${orderNumber}`:`View ${orderStatus=="Processed" || orderStatus=='Price Pending' || orderStatus=="Pending" || (orderStatus=='Escalated' && loggedInUserType.toLowerCase()=='operator') ?"":orderStatus} Order - ${orderNumber}`}</div>
        <div className='bf-order-admin-view'>
          <div>
            {loggedInUserType.toLowerCase()=='barrel fuel' && orderStatus=="Completed" && !invoice  && !isResolveDispute ? getOperatorFields(jsonData?.viewType) : ''}
          </div>
          <a href='javascript:void(0);' onClick={(e)=>{showHistory()}} className={`bf-hyperlink ${!(orderStatus=="Completed") ? 'bf-order-history' : ''}`}>View Order History</a>
        </div>
        {
        !isDisputeShow ?
        <div className={`bf-order-management-home bf-order-placed-view-container d-flex d-flex-row ${(!isResolveDispute && (orderStatus=="Completed" || orderStatus=="Declined" || orderStatus=="Canceled"))? 'bf-raise-dispute-container' : ''} ${showSummary ? 'bf-show-summary-container' : ''}`}>
          <div className="bf-order-creation bf-show-mobile-fields-container">
                    {isMulti?
                        <MultiLegSummary
                        orderPlaced = {true}
                        viewMulti={true}
                        orderRowData={formData}
                        viewSummary = {summaryJSON}
                        onRowClick = {onRowClick}
                        />:
                        <OrderView
                          formDataSet = {formData}
                          onClickSubmit = {onClickSubmit}
                          handleContinue = {handleContinue}
                        />
                    }              
                    
          </div>
          <div className="bf-order-summary">
                        <OrderSummary 
                          viewSummary = {summaryJSON}
                          fields= {orderViewHomeJson && orderViewHomeJson.fields}
                          summaryContent = {getSummaryData}
                            quantity = {gallonValue ? gallonValue: 0 }
                            fboData= {orderDetails}
                            taxesandFees = {allTaxes}
                            services= {services}
                            discountValue = {discounts}
                            price = {parseFloat(fuelPrice)}
                            totalTaxValue ={totalTaxValue}
                            totalServiceValue = {totalServiceValue}
                            subTotal = {subTotal}
                            finalPrice = {totalValue}
                            cardFee= {cardFee}
                            fuelCostSavings={fuelCostSavings}
                            onClickSubmit = {onClickSubmit}
                            handleContinue={handleContinue}
                            isEdit={true}
                            isResolveDispute={isResolveDispute}
                            orderStatus={orderStatus}
                            invoice = {invoice}
                            OrderDate = {formData["OrderDate"]}
                            raiseDispute={isResolveDispute? isResolveDispute:(orderStatus=="Completed"?true:false)}
                            tab={tab}
                            date={getFormattedMMDDYY(formData.Date)}
                            reason={formData?.StatusReason}
                            onLink={onLink}
                            disputeDisable={disputeDisable}
                            isEditClose={isEditClose}
                        />
          </div>
          </div>
         :
          <div className='bf-mobile-disputes-section'>
              <div className='bf-mobile-back'>
                <img src={BackIcon} onClick={()=>handleDisputesBack()}/> 
                <span>Dispute {DisputesList.length ? " - " + orderNumber: "Reasons" }</span>
              </div>
              <div className='bf-mobile-disputes-table'>
                {DisputesList && DisputesList.map((item,index) => (
                  <div className='bf-mobile-dispute-reasons'>
                    <div>
                      <div>{index + 1}</div> 
                      <div className='bf-dispute-reason' title={item.Reason}>{item.Reason}</div>
                    </div>
                    <span className="bf-edit-dispute" onClick={()=>handleDisputeEdit(item,index)}>Edit</span> 
                  </div>
                ))}
                <div onClick={()=>handleRaiseDispute()} className="bf-add-more-reasons">
                  <img src={AddMoreIcon} className="bf-add-more-icon"/> Add Reason
                </div>
              </div>
              <div className='bf-btns-container'>
                <button disabled={!DisputesList.length} className='bf-btn-imp btn bf-btn-login btn-primary' onClick={()=>handleRaiseDisputeSubmit()}>Submit</button>
                <button className='bf-btn-clear  btn btn-primary' onClick={()=>handleDisputesBack()}>Back</button>
              </div>
          </div>
        }
      </div>
      {modalShow?<CustomModal
        show={modalShow}
        onHide={() => successModal()}
        close={()=>closeModal()}
        hide={()=>closeModal()}
        size={''}
        modelBodyContent={modalText}
        buttonText={"Yes"}
        secondbutton={"Cancel"}
        />:null}
      {history && <AccordionModal
        show={history}
        onHide={() => closeModal()}
        orderNumber = {isMulti ? multiNumber : orderNumber}
        buttonText={"Dismiss"}
        modalId={"bf-modal-accordion"}
    />}
      {editmodalShow || mobileEditModalShow ?<EditFormModal
         onHide={closeEditModal}
         formErrors={tab=="completed"?formFieldErrors:formErrors}
         formdata={tab=="completed"?formFieldData:formDataSet}
         show={editmodalShow || mobileEditModalShow}
         json={popUpJson && popUpJson}
         onHandleChange={onHandleChange}
         modalWidth={accept ?'order-place': null}
         onHandleBlur={onHandleBlur}
         onClickSubmit={onClickSubmit}
         showError = {modalText}
        submittedForms = {submittedForm}
        // submittedForm = {serviceBusy}
        modalClassName={tab=="completed"?"bf-raise-disputes" : "bf-cancel-modal"}
        customButtons={true}
        formdataset={formDataSet}
        formerrorset={formErrors}
        primaryButtonText={accept ? "Yes" : mobileEditModalShow ? "Save": "Submit"}
        secondbutton={mobileEditModalShow ? "Delete" : "Cancel"}
         addReason = {tab=="completed"?true:false}
         onLinkClick = {onLinkClick}
         linkIndex={linkIndex}
         multiSelectOptions={multiSelectOptions}
         uploadDocumentMsg={uploadDocumentMsg}
         requestedBy={requestedBy}
         disputeDate = {true}
         customOptions={accept ? true : false}
         userOptions={requestedBy}
    />:""} </>}
    </div>);
  }
export default ViewCompletedOrders;