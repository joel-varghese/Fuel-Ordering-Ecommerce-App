import React, { useEffect,useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getIsEditMultiple, getIsEditSingle, getIsOrderAccept, getIsOrderClose, getIsPreviousScreen, getIsReorder, getIsSummary, getLegData, getLegLevel, getLegType, getMultiLegPricePending, getMultipleLeg } from '../../actions/orderPlacementActions/orderPlacementActions'
import { fetchOrderViewHomeJson } from '../../actions/orderPlacementActions/orderViewHomeActions'
import ButtonComponent from '../button/button'
import MultiLegSummary from './multiLegSummary'
import OrderSummary from './orderSummary'
import OrderView from './orderView';
import { FaCheckCircle } from "react-icons/fa";
import { getFormattedMMDDYY, phoneValidation,getFormatedDateforDisplay, getFormatedAmount, getFormErrorRules, getFieldIsValid, camelize } from '../../controls/validations'
import { getOrderRowData, getOrderTab } from '../../actions/orderActions/orderCompletedAction'
import EditFormModal from '../customModal/editModal'
import { cancelDeclineOrder } from '../../actions/orderActions/activeOrderService'
import { getOperatorsByTailNum } from '../../actions/orderPlacementActions/orderPlacementService'
import { getEditLegData } from '../../actions/orderPlacementActions/multiLegActions'
import {saveAuditLogData } from '../../actions/auditLog/auditLogActions';
import { Storage} from '../../controls/Storage';
import { sender_Email } from '../../controls/commonConstants'
import { SendMailToUsers } from '../../services/commonServices'
import AccordionModal from '../customModal/accordionModal'

export default function ViewMultiLegOrders(props) {
  const [jsonData, setJsonData] = useState()
  const [jsonPayload, setJsonPayload] = useState({ 'blobname': 'orderViewSummary.json' });
  const [formData, setFormData] = useState({})
  const [singleRowData, setSingleRowData] = useState({})
  const [sortedData, setSortedData] = useState({})
  const [gallonValue, setGallonValue] = useState(0);
  const [discounts, setDiscounts] = useState(0);
    const [allTaxes, setAllTaxes] = useState([]);
    const [services, setServices] = useState([]);
    const [fuelPrice, setFuelPrice] = useState(0);
    const [totalTaxValue, setTotalTaxValue] = useState(0);
    const [totalServiceValue, setTotalServiceValue] = useState(0);
    const [subTotal, setSubTotal] = useState(0);
    const [totalValue, setTotalValue] = useState();
    const [fuelCostSavings, setFuelCostSavings] = useState(0);
    const [orderDetails, setOrderDetails] = useState({});
    const [tailNumber, setTailNumber] = useState('');
    const [totalLegNumber, setTotalLegNumber] = useState('');
    const [orderNumber, setOrderNumber] = useState('');
    const [orderIndex, setOrderIndex] = useState();
    const [formDataSet, setFormDataSet] = useState({})
    const [formErrors , setFormErrors] = useState({});
    const [requestedBy, setRequestedBy] = useState([]);
    const [isBtnValidate,setbtnValidate]=useState(false);
    const [cardFee, setCardFee] = useState(0);
    const [history,setHistory] = useState(false)
    const [cancelAll,setCancelAll]=useState(false);
    const [editmodalShow, seteditModalShow] = useState(false);
    const [modalText, setModalText] = useState('');
    const [popUpJson , setpopUpJson] = useState();
    const [submittedForm,setsubmittedForm]=useState(false);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const commonReducer = useSelector((state) => state.commonReducer);
  const loggedInUserType =  commonReducer?.loggedInUserType?.data;
  const loggedInUser = commonReducer?.loggedInUser?.data
  const orderViewHomeReducer = useSelector((state)=>state.orderViewHomeReducer);
  const orderViewHomeJson = orderViewHomeReducer?.orderviewHomeJson?.data?.data;
  const orderPlacementReducer = useSelector((state)=>state.orderPlacementReducer);
  const orderCompletedReducer = useSelector((state) => state.orderCompletedReducer);
  const orderRowData = orderCompletedReducer?.orderMultiRowData?.data
  const isOrderAccept = orderPlacementReducer?.isOrderAccept?.data;
  const selectedTab = orderCompletedReducer?.selectedTabOrder?.data;
  const isPreviousScreen = orderPlacementReducer?.isPreviousScreen?.data;
  const isMulti = orderPlacementReducer?.isMultileg?.data;
  const isClickViewOrder = orderViewHomeReducer?.isClickViewOrder
//   const  legData = orderPlacementReducer?.multiLegData?.data;
const  legData= orderPlacementReducer?.orderedData?.data?.length && orderPlacementReducer?.orderedData?.data;
  useEffect(()=>{
    fetchOrderViewHomeJson(dispatch,jsonPayload)
  },[])
  useEffect(() => {
    let data = orderRowData
    // console.log(data)
    let legs=data?.OrderLegs
    legs?.length && legs?.sort((a,b)=>{
      return new Date(a?.FuellingDate) - new Date(b?.FuellingDate)
    })
    // console.log(legs)
    data.OrderLegs=legs;
    setSortedData(data)
    createSummary(data,0)
    setJsonData(orderViewHomeJson?.orderViewSummary)
  }, [orderViewHomeJson,orderRowData])

  const createSummary = (data,index) =>{
    let singleRowData={...sortedData}
    let arr=[]
    arr.push(data?.OrderLegs[index])
    singleRowData['OrderLegs']=arr;
    setSingleRowData(singleRowData)
    let oneComp=false;
    data?.OrderLegs?.map((leg)=>{
      if(leg?.OrderStatus=='Completed'){
        oneComp=true;
      }
    })
    let fieldData = data?.OrderLegs[index]
    fieldData["OrderDate"] = data?.OrderDate ?getFormattedMMDDYY(data.OrderDate) :""
      fieldData["OrderNumberDisplay"] = data?.OrderNumber_Display ? data?.OrderNumber_Display : data?.OrderNumber
      fieldData["OperatorName"] = data?.OperatorName ?data.OperatorName :""
      fieldData["OrderStatus"] = data?.OrderLegs[index]?.OrderStatus ?data?.OrderLegs[index].OrderStatus:""
      fieldData["CreatedBy"] = data?.CreatedBy?data.CreatedBy :""
      fieldData["PhoneNumber"] = data?.Operator_ContactNumber?phoneValidation(data.Operator_ContactNumber.toString()) : phoneValidation("7865435786")
      fieldData["RequestBy"] = data?.RequestBy?data.RequestBy :""
      fieldData["address"] =data?.OrderLegs[index]?.Address?data.OrderLegs[index].Address :""
      fieldData["FuellingDate"] =  data?.OrderLegs[index]?.FuellingDate?getFormattedMMDDYY(data.OrderLegs[index].FuellingDate) :""
      fieldData["FuelQuantity"] = parseFloat(data?.OrderLegs[index]?.FuelQuantity).toFixed(2)
      fieldData["IsMultiLeg"] = data?.IsMultiLeg
      if(oneComp){
        fieldData["IsSingleLegComp"]=true;
      }
      let formData={}
      formData['fuelservice'] = fieldData?.FuelType
      let orderData={}
      orderData["formData"] = formData
      setOrderDetails(orderData)
      setFormData(fieldData)
      if(fieldData?.Discounts && fieldData?.Discounts.length){
        setDiscounts(fieldData?.Discounts[0]?.Amount.toFixed(2))
      }
      setOrderIndex(index+1)
      setOrderNumber(data?.OrderNumber)
      setTailNumber(data?.OrderLegs[index]?.TailNumber)
      setTotalLegNumber(data?.OrderLegs?.length)
      setGallonValue(parseFloat(data?.OrderLegs[index]?.FuelQuantity).toFixed(2))
      setFuelPrice(fieldData?.BasePrice)
      setCardFee(fieldData?.CardFee)
      setTotalValue(fieldData?.FinalPrice)
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
    fieldData?.Services?.forEach((serv)=>{
      servs.push({
        "name":serv.ServiceName,
        "amount":serv.Amount
    })
      servAmount+=serv.Amount
    })
    setServices(servs)
    setTotalServiceValue(servAmount)
  }

  const setInitialState = (fboData,clear) => {
    let formData = {};
    let formErrors = {};
    const fieldTypeArr = ['input', 'select','textarea'];

    fboData && fboData.fields.forEach((item) => {
        if (fieldTypeArr.includes(item.component.toLowerCase())) {
            formData[item.name] =clear ? "" :formDataSet && formDataSet[item.name]? formDataSet[item.name]: "";
            formErrors[item.name] = getFormErrorRules(item);
        }
    })
    setFormErrors(formErrors);
    setFormDataSet(formDataSet);
  }

  const getoperators=()=>{
    let requestedBy=[]
    getOperatorsByTailNum({"TailNumber":tailNumber}).then((res)=>{
        if(res){
          let data = res && res.length && res[0].length && res[0][0]['JSON_UNQUOTE(@JSONResponse)']?JSON.parse(res[0][0]['JSON_UNQUOTE(@JSONResponse)']):[];
          data.map((value)=>{
            if(value.Operators[0].Operator==formData.OperatorName){
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
  const onLinkClick =(e,item,index)=>{
    if(e=='Cancel All Legs'){
      setCancelAll(true)
    }
    if(loggedInUserType.toLowerCase()=='barrel fuel'){
      getoperators()
    }
    let json={...jsonData}
    json['fields']=json.cancelOrder.fields.filter(m=>m?.users?.includes(loggedInUserType.toLowerCase()))
    setInitialState(json,true)
    setpopUpJson(json)
    seteditModalShow(true)

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

  const onHandleChange= (e,item)=>{
    let fieldName,fieldValue;
    let formfields={...formDataSet}
    fieldName = item.name;
    fieldValue = e.target.value;
    formfields[item.name]=fieldValue;
    setFormDataSet(formfields)
    
    if(isBtnValidate){
      validateField(fieldName,fieldValue)
    }
    let isValid=validateForm();
    if (isValid) {
      setModalText('');
    }
    
    
  }

  const validateField = (fieldName, value) => {
    const fieldValidationErrors = {
        ...formErrors
    };
    let fieldValidationError = fieldValidationErrors[fieldName];
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
    setFormErrors(fieldValidationErrors);
  }

  const onHandleBlur= (e,item)=>{
        
  }
  const onRowClick =(row,index)=>{
    createSummary(sortedData,index)
  }

  const closeEditModal =()=>{
    seteditModalShow(false)
    setbtnValidate(false)
    setCancelAll(false)
    setModalText('')
    setFormDataSet({})
    document.getElementById('root').style.filter = 'none';
  }

  const onClickSubmit = (e,item)=>{
    if(item?.name=='back'){
      // let tab = selectedTab ? selectedTab : 'active'
        if(isClickViewOrder){
          if(isPreviousScreen=='multiSummary'){
            getOrderTab('active',dispatch)
            navigate("/dashboard/order")
          }else{
            navigate("/dashboard/fuelorder/order")
          }

        }else{
          getOrderTab(selectedTab,dispatch)
          navigate("/dashboard/order")
        }
        
    }else if(e=="Submit"){
        setbtnValidate(true)

        Object.keys(formErrors).forEach((fieldName) => {
            validateField(
              fieldName,
              formDataSet[fieldName]
          );
        })
        
        let isValid=validateForm();
        if(isValid){
          setsubmittedForm(true)
            let payload={}
            payload.RequestedBy=loggedInUserType.toLowerCase()=='barrel fuel' ? formDataSet.requestedBy :loggedInUser
            payload.role=loggedInUserType
            payload.Loggedinuser=loggedInUser
            payload.Status="Canceled"
            payload.StatusReason=formDataSet.StatusReason
            payload.StatusNotes=formDataSet.StatusNotes?.replace("\n"," ");
            
            if(cancelAll){
              payload.OrderNumber=orderNumber
            }else{
              payload.OrderDetailid=formData.OrderDetailid;
            }
            cancelDeclineOrder(payload).then((res)=>{ //
              setsubmittedForm(false)
              if(res){
                if(res[0][0].Msg=="Record(s) process successfully"){
                  let emailData=jsonData?.cancelEmailBody
                  let userName=formData.CreatedBy;
                  let sendingTo=loggedInUserType.toLowerCase()=='barrel fuel' ? formDataSet.requestedBy : loggedInUser;
                  let orderNum = cancelAll ? orderNumber : formData.OrderNumber
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
                  seteditModalShow(false)
                  document.getElementById('root').style.filter = 'none';
                  getOrderTab('completed',dispatch)
                  let orderID = payload.OrderDetailid ? payload.OrderDetailid: payload.OrderNumber;
                  let auditPayload = {"ModuleName":"Orders",
                              "TabName":"Dispute",
                              "Activity":payload.Status+" orders "+orderID,
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
          setModalText(jsonData?.errorMessage)
        }
    }else if(formData.OrderStatus=='Processed' || formData.OrderStatus=='Escalated' || formData.orderStatus=='Price Pending'){
        getIsPreviousScreen(dispatch,'viewMultiOrder')
        getIsEditSingle(dispatch,true)
        getEditLegData(dispatch,formData)
        getLegType(dispatch,false)
        getIsEditMultiple(dispatch,true)
        getMultipleLeg(dispatch,false)
        getLegLevel(dispatch,0)
        navigate('/dashboard/fuelorder/order')
    }else if(formData.OrderStatus=='Pending'){
      getIsPreviousScreen(dispatch,'viewMultiOrder')
      getOrderRowData(singleRowData,dispatch)
      navigate('/dashboard/fuelorder/viewOrder')
  }
  }

  const closeModal = ()=>{
    setHistory(false)
    setModalText("")
    document.getElementById('root').style.filter = 'none';
  }

  const showHistory=()=>{
    setHistory(true)
    document.getElementById('root').style.filter = 'blur(5px)';
  }
  return (
    <div className='bf-order-placement-home'>
        <div className='bf-order-placement-home'>
            <div className='bf-order-heading'>View Order - {orderNumber}</div>
            <div className='bf-order-admin-view bf-multi-leg-order-history'>
              <div></div>
              <a href='javascript:void(0);' onClick={(e)=>{showHistory()}} style={{"marginBottom":"-5px"}} className={`bf-hyperlink bf-order-history`}>View Order History</a>
            </div>
            <div className='bf-order-management-home d-flex d-flex-row bf-multileg-order-summary-container-section'>
                <div className="bf-order-creation">
                        <MultiLegSummary
                            orderRowData={orderRowData}
                            viewMulti={true}
                            tailNumber={tailNumber}
                            totalLegs={totalLegNumber}
                            onRowClick={onRowClick}
                            onLink={onLinkClick}
                            onClickSubmit = {onClickSubmit}
                            orderPlaced={selectedTab=='completed' ? true : false}
                        />
                     
                </div>
                <div className="bf-order-summary">
                    <OrderSummary
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
                        orderStatus={formData.OrderStatus}
                        isEdit={true}
                        raiseDispute={false}
                        multiView={true}
                        userType={'operator'}
                        onLink={onLinkClick}
                        date={getFormattedMMDDYY(formData.Date)}
                        reason={formData?.StatusReason}
                        singleButton={formData.OrderStatus=='Canceled' || formData.OrderStatus=='Declined' || formData.OrderStatus=='Completed' ? true : false}
                    />
                </div>
            </div>
        </div>
        {history && <AccordionModal
        show={history}
        onHide={() => closeModal()}
        orderNumber = {formData?.OrderNumber}
        buttonText={"Dismiss"}
        modalId={"bf-modal-accordion"}
      />}
        {editmodalShow?<EditFormModal
         onHide={() => closeEditModal()}
         formErrors={formErrors}
         formdata={formDataSet}
         show={editmodalShow}
         json={popUpJson && popUpJson}
         onHandleChange={onHandleChange}
         onHandleBlur={onHandleBlur}
         onClickSubmit={onClickSubmit}
         showError = {modalText}
        submittedForms = {submittedForm}
        modalClassName={"bf-cancel-modal"}
        customButtons={true}
        primaryButtonText={"Submit"}
        secondbutton={"Back"}
        customOptions={true}
        userOptions={requestedBy}
        leg={orderIndex}
        cancelAll={cancelAll}
        orderNumber={orderNumber}
    />:""}
    </div>
    
  )
}
