import React, { useEffect, useState } from 'react';
import { Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { IoIosArrowDropdownCircle, IoIosArrowDropupCircle } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderSummaryJson } from '../../actions/orderPlacementActions/orderSummaryActions';
import ButtonComponent from '../button/button';
import parse from 'html-react-parser';
import logo from '../../assets/images/barrel_fuel_logo.png';
import './orderSummary.scss';

import iIcon from '../../assets/images/info-icon.png'
import CustomModal from '../customModal/customModal';
import { getFormatedAmount } from '../../controls/validations';
import BackIcon from '../../assets/images/collapse_arrow.svg';
import Input from '../input/input';
import Select from '../select/select';
import Loader from '../loader/loader';
import { getMobileHeaderText } from '../../actions/commonActions/commonActions';
export default function OrderSummary(props) {
    const [jsonPlayload, setJsonPlayload] = useState({'blobname':'orderSummary.json'});
    const [jsonData, setJsonData] = useState({});
    const [finalAmount, setFinalAmount] = useState(0);
    const [productDetails, setProductDetails] = useState({});
    const [collapseTaxes, setCollapseTaxes] = useState(true);
    const [collapseServices, setCollapseServices] = useState(true);
    const dispatch = useDispatch()
    const formDataSet = props.formDataSet;
    const formErrors=props.formErrors;
    const commonReducer = useSelector((state) => state.commonReducer);
    const loggedInUser = commonReducer?.loggedInUser?.data
    const loggedInUserType = commonReducer?.loggedInUserType?.data
    const orderSummaryReducer = useSelector((state)=>state.orderPlacementSummaryReducer);
    const json = orderSummaryReducer?.orderPlacementSummaryJson?.data?.data;
    const orderPlacementReducer = useSelector((state)=>state.orderPlacementReducer);
    const isMulti = orderPlacementReducer?.isMultileg?.data;
    const isPricePending = orderPlacementReducer?.isPricePending?.data;
    const [show, setShow] = useState(false);
    const [modalText, setModalText] = useState();
    const [title,setModalTitle] = useState();
    useEffect(() => {
        fetchOrderSummaryJson(dispatch, jsonPlayload)
        if(props.isEditSingle) {
            getMobileHeaderText(dispatch, "Edit Order")
        } else if(props.isReorder) {
            getMobileHeaderText(dispatch, "Reorder")
        }
    }, [])
    useEffect(()=>{
        setFinalAmount((parseFloat(props.quantity) * parseFloat(props.price)).toFixed(2))
        if(props.isOrderClose && json){
            props.setInitialState(json.orderSummary)
        }
    },[props.quantity, props.price,props.taxesAndFees,json])
    useEffect(() => {
        let fboData = props?.fboData?.fboInfo
        let selectedData = props?.fboData?.formData
        let productData = {
            "fuelservice": selectedData?.fuelservice ? selectedData.fuelservice : "" ,
            "quantity":parseFloat(props.quantity).toFixed(2), 
            "price" : `$${parseFloat(props.price)?.toFixed(2)} / Gal`,
            "taxesAndFees" : props.taxesandFees,
            "additionalServices": props.services,
        }
        setJsonData(json?.orderSummary )
        setProductDetails(productData)
        if(document.getElementById('termsAndCondition')!== null){
        document.getElementById('termsAndCondition').onclick = function(e){
            setModalText(json.orderSummary.term)
            setShow(true);
            setModalTitle('Terms and Conditions')
          }
        }
        if(document.getElementById('fairRules')!== null){
        document.getElementById('fairRules').onclick = function(e){
            setModalText(json.orderSummary.rule)
            setModalTitle('Fare Rules')
            setShow(true);
          }
        }
    }, [json,props, finalAmount,props.services,props.taxesandFees])
    const getAmount = (data,type)=>{
        let amount = 0
        if(type == "tax"){
            let unit = "%"
            if(unit == "%"){
                amount = finalAmount * (parseFloat(data.Amount)/100)}
        }
        return amount
    }
    const getTaxesAndFees = ()=>{
        let taxdata = props.fboData.fboInfo.airportLocations[0].Taxes
        let taxes =  []
        taxdata && taxdata.length && taxdata.forEach((tax)=>{
            let Tdata = {
                "name": tax.Tax,
                "amount" : getAmount(tax,"tax")
            }
            taxes.push(Tdata)
        })
        return taxes
    }
    const getExtraCosts = (item)=>{
        let data  = productDetails[item]
        return(
            <>
                {data && data.length && data.map((val,index)=>(
                    <div className='d-flex justify-content-between'>
                        <div>{val.name}   {props.isOrderClose && val?.taxType !== "Federal/State Tax" && item=='taxesAndFees' ? <a href='javascript:void(0)' className='bf-hyperlink' onClick={(e)=>props.removeTaxFee(e,val,index)}>Remove</a> : ""}</div>
                        <div>{`$${getFormatedAmount(val.amount)}`}</div>
                    </div>
                ))}
            </>
        )

    }
    const handleTaxesAccordion = (item) => {
        if(item.name == "taxesAndFees"){
            setCollapseTaxes(!collapseTaxes)

        }
        else{
            setCollapseServices(!collapseServices)
        }
    }
    const renderTooltip = (tooltipInfo) => (
        <Tooltip  id="button-tooltip" {...tooltipInfo}>
          {parse(tooltipInfo.text)}
        </Tooltip>
      );
    const getOrderSummary = (item)=>{
        switch (item.component.toLowerCase()) {
            case "header":
                return(
                    <div className='bf-order-heading'>
                        {item.text}
                    </div>
                )
            case "link":
                if(props.isOrderClose && item.name!='declineOrder'){
                    return(
                    <a href='javascript:void(0);' className="d-flex bf-hyperlink" onClick={(e)=>props.onRemoveLink(e,item)}>{item.text}</a>
                    ) 
                }else{
                    return(<>{(props.multiView && (props.orderStatus=='Processed' || props.orderStatus=='Pending' || props.orderStatus=='Price Pending')) || ((props.orderStatus=='Processed' || props.orderStatus=='Escalated' || props.orderStatus=='Price Pending') && loggedInUserType.toLowerCase()=='fbo') || (props.isEditSingle && loggedInUserType=="Barrel Fuel" && !props.isEditMultiple)? 
                    <a href='javascript:void(0);' className="d-flex justify-content-center bf-hyperlink" onClick={(e)=>props.onLink(e,item)}>{props.userType=='operator' ? (props.multiView && (props.orderStatus=='Processed' || props.orderStatus=='Pending' || props.orderStatus=='Price Pending'))?item.text3:item.text2 : item.text}</a>:""}
                    </>) 
                }
                
                    
            case "input":
                if(props.isOrderClose){
                    return (<Input
                    
                        colWidth={item.styles ? item.styles.colWidth : ""}
                        Type={item.type}
                        Label={item.label}
                        data-label={item.label}
                        disabled={false}
                        Placeholder={item.placeholder}
                        isRequred={item.isRequired}
                        Name={item.name}
                        handleChange={(e) => props.onHandleChangeCustom(e,item)}
                        handleBlur={(e) => props.onHandleBlurCustom(e,item)} 
                        fieldError={
                            formErrors && formErrors[item.name]
                            && !formErrors[item.name].isValid
                           && (
                               formErrors[item.name].isTouched
                            )
                        }
                        errorMessage={
                            formErrors && formErrors[item.name]
                            && formErrors[item.name]
                                .activeValidator
                                .errorMessage
                        }
                        formDataSet={formDataSet && formDataSet[item.name] ? formDataSet[item.name] : item.defaultValue ? item.defaultValue : ''}
                            />)
                }
            case "select":
                if(props.isOrderClose){
                    return (<Select
                        colWidth={item.styles ? item.styles.colWidth : ""}
                        Type={item.type}
                        Label={item.label}
                        Placeholder={item.placeholder}
                        dynamicSelect={item.dynamicSelect}
                        disabled={false}
                        lookupReference={item.dynamicSelect ? item.lookupReference : null}
                        isRequred={item.isRequired}
                        Options={item.options}
                        Name={item.name}
                        handleChange={(e) => props.onHandleChangeCustom(e, item)}
                        handleBlur={(e) => props.onHandleBlurCustom(e, item)}
                        dependentField = {item.dependentField}
                        dependentFieldVal = {item.dependentFieldVal}
                        formDataSet={formDataSet && formDataSet[item.name] ? formDataSet[item.name] :item.defaultValue ? item.defaultValue : ''} 
                        />)
                }      

            case "table":
                return(
                    <div className='bf-order-summary-header'>
                        <Row>
                            {item?.headCells?.map((header)=>(
                                <Col className='bf-font-600'>{header}</Col>
                            ))}
                        </Row>
                        <Row>
                            {item?.values?.map((value)=>(
                                <Col>{productDetails && productDetails[value]}</Col>
                            ))}
                        </Row>
                    </div>
                )
            case "line":
                return(
                    <hr />
                )
            case "price":
                return(
                   <> {item.name == "discount" && !props.discountValue ?"":<div className={`d-flex justify-content-between bf-padding-left-15 ${item.styles ? item.styles.className : ''}`}>
                        <div>{item.text} 
                            {item.tooltip && item.tooltip.text ? 
                            <OverlayTrigger 
                                placement={"right"}
                                delay={{ show: 250, hide: 400 }}
                                overlay={renderTooltip(item.tooltip)}
                                text={"abcd"}
                                >
                                    <img className='bf-mrgl5' src={iIcon} tabIndex="" alt="Tooltip icon"/>
                            </OverlayTrigger> : ""}
                        </div>
                        <div>{`${item.name == "discount" ? '($'+getFormatedAmount(parseFloat(props.discountValue).toFixed(2))+')' :
                        item.name=='costSaving' ? '$'+getFormatedAmount(parseFloat(props.fuelCostSavings).toFixed(2)) :
                        item.name=='cardFee' ? '$'+getFormatedAmount(parseFloat(props.cardFee).toFixed(2)) :
                        '$'+getFormatedAmount(parseFloat(finalAmount).toFixed(2))}`}</div>
                    </div>}</>

                )
            case "accordian":
                    return(
                        <div className={`bf-padding-left-15 bf-accordion-height bf-${item.name}`}>
                            {item.name == "taxesAndFees" ? <>
                            <div className='d-flex justify-content-between bf-mrgleft-n15'>
                                <div className='d-flex'>
                                    <div className={`${!productDetails[item.name].length ? 'bf-tax-services-empty' : ''}`}  onClick={productDetails[item.name].length ? ()=>{handleTaxesAccordion(item)} : null}>
                                        {collapseTaxes ?
                                            <IoIosArrowDropupCircle className='bf-primary-color'/> :
                                            <IoIosArrowDropdownCircle className='bf-primary-color'/> 
                                        }
                                    </div>
                                    <div>{item.text}</div>
                                </div>
                                <div>{`$${getFormatedAmount(parseFloat(props.totalTaxValue)?.toFixed(2))}`}</div>
                                </div>
                                {collapseTaxes ? 
                                <div className={`bf-accordion-container bf-accordion-length-${productDetails[item.name].length == '2' || productDetails[item.name].length == '3' ? productDetails[item.name].length : productDetails[item.name].length>3 ? 'more' : 'less'}`}>
                                    {productDetails[item.name].length ? getExtraCosts(item.name) : null}
                                </div> : ''}</>
                            :
                            <>
                            <div className='d-flex justify-content-between bf-mrgleft-n15'>
                            <div className='d-flex'>
                                <div className={`${!productDetails[item.name].length ? 'bf-tax-services-empty' : ''}`} onClick={productDetails[item.name].length ? ()=>{handleTaxesAccordion(item)}: null}>
                                    {collapseServices ?
                                        <IoIosArrowDropupCircle className='bf-primary-color'/> :
                                        <IoIosArrowDropdownCircle className='bf-primary-color'/> 
                                    }
                                </div>
                                <div>{item.text}</div>
                            </div>
                            <div>{`$${getFormatedAmount(parseFloat(props.totalServiceValue).toFixed(2))}`}</div>
                            </div>
                            {collapseServices ? 
                            <div className={`bf-accordion-container bf-accordion-length-${productDetails && productDetails[item.name] && (productDetails[item.name].length == '2' || productDetails[item.name].length == '3') ? productDetails[item.name].length : productDetails && productDetails[item.name] && productDetails[item.name].length>3 ? 'more' : 'less'}`}>
                                {productDetails[item.name].length ? getExtraCosts(item.name) : null}
                             </div>: ''}</>}
                        </div>
                    )
            case "subheader":
                return(
                    <div className={`d-flex justify-content-between bf-padding-left-15 ${item.styles ? item.styles.className : ''}`}>
                        <div>{item.name == "finalPrice" && isPricePending && !props.isOrderClose ? item.label : item.text}</div>
                        <div class>{item.name == "subTotal" ? `$${getFormatedAmount(props.subTotal)}`: `$${getFormatedAmount(props.finalPrice)}`}</div>
                    </div>
                )
            case "info":
                return(<>
                    <div className={`d-flex justify-content-between ${item.styles ? item.styles.className : ''}`}>
                        <div>{props.orderStatus=="Completed" ? props.invoice ? `${item.textCompletedOrder} ${props.OrderDate}` : props.isResolveDispute ? '' : `${item.textCompletedOrder} ${props.date}` 
                        : props.orderStatus=="Declined" ? `${item.textDeclinedOrder} ${props.date}` 
                        : props.orderStatus=="Canceled" ? `${item.textCanceledOrder} ${props.date}`
                        : props.orderStatus=="Pending" && loggedInUserType.toLowerCase()=='fbo' ? `${item.textLastEdited} ${props.date}` 
                        :props.isResolveDispute || props.orderStatus || props.isOrderClose || props.isEditSingle || props.isMulti ? "" : parse(item.text)}</div>
                        
                    </div>
                    {!props.raiseDispute && !props.isResolveDispute && (props.orderStatus=='Declined' || props.orderStatus=="Canceled" ) &&
                    <div className="d-flex justify-content-center">
                      {item.reasonText} {props.reason}
                    </div>}
                    </>)
            case "infotext":
                return(
                    isPricePending && !props.isOrderClose &&
                    <div className={`d-flex justify-content-between ${item.styles ? item.styles.className : ''}`}>
                        <div><span className='bf-required'>!! </span>{parse(item.text)}</div>
                    </div>
            )
            case"buttongroup":
                return(
                    <>
                        <div className={`d-flex justify-content-between bf-hide-mobile bf-summary-buttons ${props.singleButton || props.invoice || (props.orderStatus != 'Completed' && props.tab=='completed'&& loggedInUserType.toLowerCase()=='fbo')? 'bf-button-center' : ""} ${isMulti && !props.isEdit ? 'bf-multi-leg-summary' : ''}`}>
                            {
                            
                            item.list.map((listItem) => (
                                // listItem.name == 'back'?
                                (props.singleButton && listItem.name=="placeOrder") || (props.invoice && listItem.name=="placeOrder") || (props.orderStatus != 'Completed' && props.tab=='completed' && loggedInUserType.toLowerCase()=='fbo' && listItem.name == "placeOrder")? "" :
                                <ButtonComponent       
                                Label={listItem.name == "placeOrder" && props.isEditClose ? listItem.labelEditClose  :listItem.name == "placeOrder" && (props.isOrderClose || (props.multiView && props.orderStatus=='Pending')) ? listItem.labelProceed :listItem.name == "placeOrder" && props.isResolveDispute?"Confirm" :listItem.name == "placeOrder" && props.raiseDispute ?listItem.labelRaiseDispute : listItem.name == "placeOrder" && props.raiseDispute==false? props.orderStatus=="Processed" || props.orderStatus=="Price Pending" || (props.orderStatus=="Pending" && loggedInUserType.toLowerCase()=='fbo') || props.orderStatus=="Escalated" ? listItem.labelEdit : props.orderStatus=="Pending" ? listItem.labelAccept : listItem.labelReorder
                                :listItem.name == "placeOrder"&& (isMulti ||props.isEditSingle) ? (props.isEdit || props.isEditSingle )? listItem.labelSubmit
                                : listItem.label2: listItem.label} 
                                Type={listItem.type} 
                                className={listItem.styles.className}
                                variant={listItem.variant}
                                disabled={listItem.name == "placeOrder" && props.disputeDisable && props.orderStatus != 'Completed' ? props.disputeDisable : props.disable? props.disable : false}
                                    handleClick={(e)=>props.onClickSubmit(e,listItem)}/>
                                // :
                                // (props.singleButton && listItem.name=="placeOrder") || (props.invoice && listItem.name=="placeOrder") || (props.orderStatus != 'Completed' && props.tab=='completed' && loggedInUserType.toLowerCase()=='fbo' && listItem.name == "placeOrder")? "" :
                                // !props.loader ?
                                // <ButtonComponent       
                                // Label={listItem.name == "placeOrder" && props.isEditClose ? listItem.labelEditClose  :listItem.name == "placeOrder" && (props.isOrderClose || (props.multiView && props.orderStatus=='Pending')) ? listItem.labelProceed :listItem.name == "placeOrder" && props.isResolveDispute?"Confirm" :listItem.name == "placeOrder" && props.raiseDispute ?listItem.labelRaiseDispute : listItem.name == "placeOrder" && props.raiseDispute==false? props.orderStatus=="Processed" || (props.orderStatus=="Pending" && loggedInUserType.toLowerCase()=='fbo') || props.orderStatus=="Escalated" ? listItem.labelEdit : props.orderStatus=="Pending" ? listItem.labelAccept : listItem.labelReorder
                                // :listItem.name == "placeOrder"&& (isMulti ||props.isEditSingle) ? (props.isEdit || props.isEditSingle )? listItem.labelSubmit
                                // : listItem.label2: listItem.label} 
                                // Type={listItem.type} 
                                // className={listItem.styles.className}
                                // variant={listItem.variant}
                                // disabled={listItem.name == "placeOrder" && props.disputeDisable && props.orderStatus != 'Completed' ? props.disputeDisable : props.disable? props.disable : false}
                                // handleClick={(e)=>props.onClickSubmit(e,listItem)}/>
                                // :<Loader height='auto'/>
                            ))
                            
                            }
                        </div>
                        <div className={`d-flex bf-show-mobile justify-content-between bf-summary-buttons ${props.singleButton || props.invoice || (props.orderStatus != 'Completed' && props.tab=='completed'&& loggedInUserType.toLowerCase()=='fbo')? 'bf-button-center' : ""} ${isMulti && !props.isEdit ? 'bf-multi-leg-summary' : ''}`}>
                        {
                        item.list.map((listItem) => (
                            (props.singleButton && listItem.name=="placeOrder") || (props.invoice && listItem.name=="placeOrder") || (props.orderStatus != 'Completed' && props.tab=='completed' && loggedInUserType.toLowerCase()=='fbo' && listItem.name == "placeOrder")? "" :
                            <ButtonComponent       
                            Label={listItem.name == "placeOrder" && props.isEditClose ? listItem.labelEditClose  :listItem.name == "placeOrder" && (props.isOrderClose || (props.multiView && props.orderStatus=='Pending')) ? listItem.labelProceed :listItem.name == "placeOrder" && props.isResolveDispute?"Confirm" :listItem.name == "placeOrder" && props.raiseDispute ?listItem.labelRaiseDispute : listItem.name == "placeOrder" && props.raiseDispute==false? props.orderStatus=="Processed" || (props.orderStatus=="Pending" && loggedInUserType.toLowerCase()=='fbo') || props.orderStatus=="Escalated" ? listItem.labelEdit : props.orderStatus=="Pending" ? listItem.labelAccept : listItem.labelReorder
                            :listItem.name == "placeOrder"&& (isMulti ||props.isEditSingle) ? (props.isEdit || props.isEditSingle )? listItem.labelSubmit
                            : listItem.label2: listItem.label} 
                            Type={listItem.type} 
                            className={listItem.styles.className}
                            variant={listItem.variant}
                            disabled={listItem.name == "placeOrder" && props.disputeDisable && props.orderStatus != 'Completed' ? props.disputeDisable : props.disable? props.disable : false}
                            handleClick={(e)=>props.onClickSubmit(e,listItem,false,true)}/>
                        ))}
                    </div>
                </>
                )
            default:
                break;
        }
    }
    const handleClose = () => {
        setShow(false);
        document.getElementById('root').style.filter = 'none';
        
    }
    
    const renderModal = (modal) => {
        let modalData = modalText;
        document.getElementById('root').style.filter = 'blur(5px)';
        return (
            <CustomModal
                show={show}
                title={title}
                onHide={handleClose}
                modelBodyContent={modalData}
                buttonText={"Dismiss"}
            />
        );
    };

    return (
        <div className={`bf-order-summary-container ${props.viewSummary ? 'bf-order-paced-summary' : 'bf-order-place-summary'}`}>
            {/* <button className='bf-show-mobile' onClick={(e)=>props.showMobileOrderFields()}>Order Summary</button> */}
            <div className='bf-summary-sub bf-show-mobile'>
                <div><img className='bf-icon-back' onClick={(e)=>props.onClickSubmit(e,{"name":"back"}, false, props.prevScreen ? true : false)} src={BackIcon}  alt="Back" /></div>
                <div className='bf-heading-sub'>Order Summary {props.isEditMobile ? ("Leg " +  (props.orderLegLevel + 1)) : ''}</div>
            </div>
            {props.viewSummary?
            <div className='bf-placed-order-summary-container'>
                <div className='order-summary-logo-container'>
                    <img src={logo} alt="bf-logo" className='bf-order-logo'/>
                </div>
                <div className='bf-order-placed-summary-details'>
                    {props?.fields?.map((item,index)=>(
                            ((item.name != 'contactInfo' &&  item.type != 'button')?
                                props.summaryContent(item,index) : null
                            )
                        )
                    )}
                </div>
                <div className='bf-order-placed-summary-button-details'>
                    {props?.fields?.map((item,index)=>(
                            (item.name == 'contactInfo'  || item.type == 'button'?
                                props.summaryContent(item,index) : null
                            )
                        )
                    )}
                </div>
            </div>:
            <>
                <div className='bf-place-order-summary-container'>
                    {props.isOrderClose ? (<div>
                        {jsonData?.fields?.map((item,index)=>{
                            if (item.name !== 'info' &&  item.name !== 'pricePending' && item.name !== 'buttonGroup' && item.name !== 'declineOrder' && item.name !== 'cardFee' && item.name !== 'subTotal' && item.name !== 'finalPrice' && item.name !== 'costSaving') {   
                                return (
                                    getOrderSummary(item,index)
                                )   
                            }
                        })}
                        {jsonData?.closeOrderFields && 
                        <div className='bf-close-order-input-fields'>
                            <div className='d-flex d-flex-100p'>
                                <div>
                                    {jsonData?.closeOrderFields?.map((item,index)=>{ 
                                        if(item.part1 && index < 2){
                                            return (
                                                getOrderSummary(item,index)
                                            ) 
                                        }          
                                    })}
                                </div>
                                <div>
                                {jsonData?.closeOrderFields?.map((item,index)=>{ 
                                    if(item.part1 && index >= 2){
                                        return (
                                            getOrderSummary(item,index)
                                        ) 
                                    }          
                                })}
                                </div>

                            </div>
                            <div className='d-flex d-flex-100p'>
                                <div>
                                    {jsonData?.closeOrderFields?.map((item,index)=>{ 
                                        if(item.part2 && (index == 4 || index == 5)){
                                            return (
                                                getOrderSummary(item,index)
                                            ) 
                                        }          
                                    })}
                                </div>
                                <div>
                                    {jsonData?.closeOrderFields?.map((item,index)=>{ 
                                        if(item.part2 && index > 5){
                                            return (
                                                getOrderSummary(item,index)
                                            ) 
                                        }          
                                    })}
                                </div>
                            </div>
                        </div>
                        }
                        {jsonData?.fields?.map((item,index)=>{
                            if (item.name == 'cardFee' || item.name == 'subTotal' || item.name == 'finalPrice' || item.name == 'costSaving') {   
                                return (
                                    getOrderSummary(item,index)
                                )   
                            }
                        })}
                        

                        </div>): 
                    
                    jsonData?.fields?.map((item,index)=>{
                        if (item.name !== 'info' &&  item.name !== 'pricePending' && item.name !== 'buttonGroup' && item.name !== 'declineOrder') {   
                            return (
                                getOrderSummary(item,index)
                            )   
                        }
                    })}
                </div>
                <div className={`bf-buttons-order-container ${props.raiseDispute ? ' bf-show-mobile-desktop' : ''}`}>
                    {jsonData?.fields?.map((item,index)=>{
                        if (item.name == 'pricePending' || item.name == 'info' || item.name == 'buttonGroup' || item.name=='declineOrder') {
                            return (
                                getOrderSummary(item,index)
                            )
                        }
                    })}
                </div>
            </>}
            {show ? renderModal() : null}
        </div>
        
    )
}
