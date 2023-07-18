import React, { useEffect,useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getIsEditMultiple, getIsEditSingle, getIsOrderClose, getIsPricePending, getIsReorder, getIsSummary, getLegData, getLegLevel, getLegType, getMultiLegPricePending, getMultipleLeg } from '../../actions/orderPlacementActions/orderPlacementActions'
import { fetchOrderViewHomeJson, getClickViewOrder } from '../../actions/orderPlacementActions/orderViewHomeActions'
import ButtonComponent from '../button/button'
import MultiLegSummary from './multiLegSummary'
import OrderSummary from './orderSummary'
import OrderView from './orderView';
import { FaCheckCircle } from "react-icons/fa";
import { getFormattedMMDDYY, phoneValidation,getFormatedDateforDisplay, getFormatedAmount } from '../../controls/validations'
import { getOrderMultiRowData, getOrderRowData, getOrderTab } from '../../actions/orderActions/orderCompletedAction'
import AccordionModal from '../customModal/accordionModal'
import { getEditLegData, getIsEdit } from '../../actions/orderPlacementActions/multiLegActions'

export default function OrderViewHome(props) {
  const [jsonData, setJsonData] = useState()
  const [jsonPayload, setJsonPayload] = useState({ 'blobname': 'orderViewSummary.json' });
  const [formData, setFormData] = useState({})
  const [totalValue, setTotalValue] = useState(0)
  const [history,setHistory] = useState(false)
  const [orderNumber,setOrderNumber] = useState('')
  const [orderLegDetails,setOrderLegDetails] = useState({})
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const orderViewHomeReducer = useSelector((state)=>state.orderViewHomeReducer);
  const orderViewHomeJson = orderViewHomeReducer?.orderviewHomeJson?.data?.data;
  const orderPlacementReducer = useSelector((state)=>state.orderPlacementReducer);
  const isReorder = orderPlacementReducer?.isReorder?.data;
  const isEditSingle = orderPlacementReducer?.isEditSingle?.data;
  const isOrderClose = orderPlacementReducer?.isOrderClose?.data;

  const isMulti = orderPlacementReducer?.isMultileg?.data;
//   const  legData = orderPlacementReducer?.multiLegData?.data;
const  legData= orderPlacementReducer?.orderedData?.data?.length && orderPlacementReducer?.orderedData?.data;
  useEffect(()=>{
    fetchOrderViewHomeJson(dispatch,jsonPayload)
  },[])
  useEffect(() => {
    props.updateClearAll(false)
    getIsSummary(dispatch, true)
    let data = legData && legData[0] && legData[0][0]['JSON_UNQUOTE(@JSONResponse)'] ? JSON.parse(legData[0][0]['JSON_UNQUOTE(@JSONResponse)']) :{}
    setOrderLegDetails(data)
    setOrderNumber(data && data.length && data[0]?.OrderLegs[0]?.OrderNumber)
    let fieldData = data && data[0] ?.OrderLegs?.length && data[0].OrderLegs[0] ? data[0].OrderLegs[0] :{}
      fieldData["OrderDate"] = data && data.length && data[0]?.OrderDate ?getFormattedMMDDYY(data[0].OrderDate) :""
      fieldData["OperatorName"] = data && data.length && data[0]?.OperatorName ?data[0].OperatorName :""
      fieldData["OrderStatus"] = data && data.length && data[0].OrderStatus ?data[0].OrderStatus:""
      fieldData["CreatedBy"] = data && data.length && data[0].RequestByName?data[0].RequestByName :""
      fieldData["PhoneNumber"] = data && data.length && data[0].Operator_ContactNumber?phoneValidation(JSON.stringify(data[0].Operator_ContactNumber)) : phoneValidation("7865435786")
      fieldData["RequestBy"] = data && data.length && data[0]?.RequestBy?data[0].RequestBy :""
      fieldData["OrderNumber"] = data && data.length && data[0]?.OrderNumber? isMulti ? data[0].OrderNumber: data[0].OrderLegs[0].OrderNumber :""
      fieldData["address"] =props.fboDetails?.fboInfo?.address?props.fboDetails?.fboInfo?.address :""
      fieldData["FuellingDate"] = data && data.length && data[0]?.OrderLegs && data[0]?.OrderLegs.length && data[0]?.OrderLegs[0]?.FuellingDate?getFormattedMMDDYY(data[0].OrderLegs[0].FuellingDate) :""
      fieldData["FuelQuantity"] = data && data.length && data[0]?.OrderLegs && data[0]?.OrderLegs.length && data[0]?.OrderLegs[0]?.FuelQuantity?parseFloat( data[0]?.OrderLegs[0]?.FuelQuantity).toFixed(2):0
      setFormData(fieldData)
      setTotalValue(data && data.length && props.userType!=='fbo' ? data[0]?.OrderFinalPrice : data[0]?.OrderLegs[0]?.FinalPrice)
      setJsonData(orderViewHomeJson?.orderViewSummary)
  }, [orderViewHomeJson,legData])
  useEffect(() => {
    return()=>{
     document.getElementById('root').style.filter = 'none';
    }
 }, [])
  const showHistory=()=>{
    setHistory(true)
    document.getElementById('root').style.filter = 'blur(5px)';
  }
  const closeModal = ()=>{
    setHistory(false)
    document.getElementById('root').style.filter = 'none';
  }
  const onRowClick = (row,index)=>{
    setOrderNumber(row["orderNumber"])
  }
  const getSummaryData = (item,index)=>{
    switch (item.component.toLowerCase()) {
      case "header":
          return(
              <div className='bf-order-heading'>
                  {isOrderClose ? item.textClosed : isEditSingle? item.textEditOrder : item.text}
              </div>
          )
      case "data":
            return(
                <div className={`bf-order-summary-header ${item.styles ? item.styles.className : ''}`}>
                     <div>
                     {(item.name =="OrderDate")?`${item.text}${getFormatedDateforDisplay(formData[item.name])}`:`${item.name =="OrderNumber" && isOrderClose ? item.text2 :item.text} ${formData[item.name]}`}
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
                {item.name == "TotalOrderValue" ?(`${item.name == "TotalOrderValue"?"$":''}${totalValue? getFormatedAmount(totalValue) :props.totalOrderValue ? getFormatedAmount(props.totalOrderValue) : 0 }`) : formData[item.name]}
            </div>
          )
      case "link":
          return(
              <div className={`bf-padding-left-15 ${item.styles ? item.styles.className : ''}`} onClick={()=>{onLinkClick(item,index)}}>
                  {item.text}
              </div>
          )
      case "text":
          return(
              <div className={`bf-padding-left-15 ${item.styles ? item.styles.className : ''}`}>
                  <div>{(item.name=='endText' && isEditSingle && props.userType=='fbo') ? item.textPending : (item.name=='endText' && isOrderClose) ? item.textClose :item.text}</div>
              </div>
          )
      case"button":
          return(
              <ButtonComponent       
                  Label={isReorder || isEditSingle || isOrderClose ? item.labelDone : (!isMulti ? item.label : item.labelOkay)} 
                  Type={item.type} 
                  className={item.styles.className}
                  variant={item.variant}
                  disabled={false}
                  handleClick={(e)=>{onClickSubmit(e,item)}}
                  />
          )
      default:
          break;
    }
  }

  const onLinkClick =(e,item,index)=>{
    getClickViewOrder(dispatch,true)
    if (isMulti){
        getOrderMultiRowData(orderLegDetails[0],dispatch)
        navigate('/dashboard/fuelorder/viewMultiOrder')
    }else{
        getOrderRowData(orderLegDetails[0],dispatch)
        navigate('/dashboard/fuelorder/viewOrder')
    }
  }

  const onClickSubmit = ()=>{
    // getIsSummary(dispatch,false)
    // getLegData(dispatch,{})
    // getLegType(dispatch,false)
    // getMultiLegPricePending(dispatch,false)
    // getMultipleLeg(dispatch, false)
    // getIsPricePending(dispatch,false)
    // getLegLevel(dispatch,0)
    // getIsEdit(dispatch,false);
    // getIsReorder(dispatch,false)
    // getIsEditSingle(dispatch,false)
    // getIsOrderClose(dispatch,false)
    // getIsEditMultiple(dispatch,false)
    // getEditLegData(dispatch,{})
    if(isReorder || isEditSingle || isOrderClose){
        getOrderTab('active',dispatch)
        getIsEditSingle(dispatch,false)
        getIsEditMultiple(dispatch,false)
        getIsReorder(dispatch,false)
        getIsOrderClose(dispatch,false)
        navigate('/dashboard/order')
        
    }else{
        navigate('/dashboard/fuelorder')
    }
  }
  return (
    <div className='bf-order-placement-home'>
        <div className='bf-order-placement-home'>
            <div className='bf-order-heading'>{isOrderClose ? `${jsonData?.placeholder?.textClose} - ${formData?.OrderNumber}` : isEditSingle ? jsonData?.placeholder?.textUpdate : jsonData?.placeholder?.text}</div>
            <div className='bf-order-admin-view'>
                {isOrderClose || isEditSingle ? <><div></div><a href='javascript:void(0);' onClick={(e)=>{showHistory()}} className={`bf-hyperlink`}>View Order History</a> </>: ''}
            </div>            
            <div className='bf-order-management-home d-flex d-flex-row'>
                <div className="bf-order-creation bf-order-placed-view-container">
                    {isMulti?
                        <MultiLegSummary
                        viewSummary = {true}
                        orderPlaced = {true}
                        onRowClick = {onRowClick}
                        />
                        :<OrderView
                         formDataSet = {formData}
                        />
                    }
                </div>
                {history && <AccordionModal
            show={history}
            onHide={() => closeModal()}
            orderNumber = {orderNumber}
            buttonText={"Dismiss"}
            modalId={"bf-modal-accordion"}
                />}
                <div className="bf-order-summary">
                    <OrderSummary
                        viewSummary = {true}
                        fields= {jsonData && jsonData.fields}
                        summaryContent = {getSummaryData}/>
                </div>
            </div>
        </div>
    </div>
  )
}
