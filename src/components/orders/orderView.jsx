import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './orderData.scss'
import { fetchOrderDataJson } from '../../actions/orderPlacementActions/orderDataAction'
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { Col, Form, Row } from 'react-bootstrap'
import Subheading from '../subHeading/subHeading';
import Select from '../select/select';
import Input from '../input/input';
import DatePicker from '../datePicker/datePicker';
import { getFormattedMMDDYY, phoneValidation } from '../../controls/validations';
import { fetchOrderViewJson } from '../../actions/orderPlacementActions/orderViewActions';
import { IoLocationOutline, IoPhonePortraitOutline } from "react-icons/io5";
import PhoneIcon from '../../assets/images/icon_phone.svg';
import {getIsPricePending} from '../../actions/orderPlacementActions/orderPlacementActions';
import fboCompanyIcon from '../../assets/images/bf-fbo-logo.png';
import BackIcon from '../../assets/images/collapse_arrow.svg';

export default function OrderView(props) {
    const [jsonData, setJsonData] = useState({})
    const [jsonPayload, setJsonPayload] = useState({ 'blobname': 'orderView.json' });
    const [formData, setFormData] = useState({});
    const orderViewDataReducer = useSelector((state)=>state.orderViewDataReducer);
    const orderViewDataJson = orderViewDataReducer?.orderviewJson?.data?.data;
    const data = {
        "phoneNumber" : "456627898",
    };
    const dispatch = useDispatch()
    useEffect(() => {
        fetchOrderViewJson(dispatch, jsonPayload);
        
    }, []);
    useEffect(() => {
        setJsonData(orderViewDataJson)
        setFormData(props.formDataSet)
        //console.log("2023-02-09 00:00:00.000000",props && props.formDataSet)
        let expireDate = props.formDataSet.ActivePriceExpiryDate !== null?(new Date(props.formDataSet.ActivePriceExpiryDate))<new Date():false
        getIsPricePending(dispatch,expireDate)
    }, [orderViewDataJson, props.formDataSet])
    const getHeaders = (item,index)=>{
        switch (item.component.toLowerCase()) {
            case "header":
                return(
                    <div className='bf-order-placement-header'>{item.name == 'FBO' ?  props.formDataSet[item.name]&&(props.formDataSet[item.name]).toLowerCase() : props.formDataSet[item.name]}</div>
                )
            case "subheader":
                if(item.name == "FBO_ContactNumber"){
                    return(
                        <div className='bf-order-placement-subheader bf-operator-phone-number'>
                            <span><img src={PhoneIcon} alt="PhoneIcon" /> {phoneValidation(props.formDataSet[item.name]?.toString())}</span>
                        </div>
                    )} 
                else if(item.name === "phoneNumber"){
                    return(
                        <div className='bf-order-placement-subheader bf-operator-phone-number'>
                            <span><img src={PhoneIcon} alt="PhoneIcon" /> {phoneValidation(data[item.name])?.toString()}</span>
                        </div>
                    )}
                else {
                    return(
                        <div className='bf-order-placement-subheader'>
                            <span><IoLocationOutline /> {props.formDataSet[item.name]}</span>
                        </div>
                    )
                }
                
            default:
                break;
        } 
    }
    const camelize = (str) => {
        if(str){
        let string = str.toLowerCase();
        const arr = string.split(" ");
        for (var i = 0; i < arr.length; i++) {
          arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
      
      }
        return arr.join(" ");
        } else {
            return "";
        }
      }
    const getFields = (item,index)=>{
        switch (item.component.toLowerCase()) {
            case "checkbox" : 
            return (
                <div className='col-md-3 d-flex justify-content-between bf-checkbox-field'>
                    <div className='checkbox-container'>
                        <input className="form-check-input" type="checkbox" name={item.name} value={item.amount} onChange={(e)=>props.onHandleChange(e,item)}/> 
                        <label  htmlFor='checkbox' title={item.label}>{item.label}</label>
                    </div>
                    <span title={item.amount}>$ {item.amount}</span>
                </div>
            );
            case "asynctypeahead":
                return(
                    <Form.Group as={Col} md={item.styles.colWidth} className={` mb-4`} controlId={item.name}>
                        <div className='d-flex justify-content-between'>
                            <Form.Label>{item.label} {item.isRequired ? <span className='bf-required'>*</span> : ''}</Form.Label>
                        </div>
                        <AsyncTypeahead
                        id={item.id}
                        // filterBy={filterBy}
                        isLoading={props.tailLoading}
                        minLength={3}
                        defaultInputValue={props.formDataSet && props.formDataSet[item.name] ? props.formDataSet[item.name] : item.defaultValue ? item.defaultValue : ''}
                        label={item.label}
                        useCache={false}
                        onSearch={(e)=>props.searchAPI(e,item)}
                        inputProps={{
                            name: item.name,
                            maxLength: item.maxLength
                          }} 
                        ref={props.typeaheadRef}
                        // onKeyDown={(e)=>props.onKeyDown(e,item)}
                        onChange={(index) => props.searchHandler(index, item)}
                        options={props.tailResults}
                        placeholder = {item.placeholder}
                        onBlur={(e)=>props.onSearchBlur(e,item)}
                        selected={props.tailSelected}
                        //   onFocus={handleFocus}
                        renderMenuItemChildren={(option) => (
                            <>
                            <span>{option}</span>
                            </>
                        )}
                        />
                    </Form.Group> 
                )
            case "subheading":
                return(<Subheading label={item.label}/>)    
            case "select":
                return (<Select 
                    colWidth={item.styles ? item.styles.colWidth : ""} 
                    Type={item.type} 
                    Label={item.label}
                    borderRed={formData && formData?.Edited && formData?.Edited.length && formData?.Edited.includes(item.name) ? true : false}
                    isAdmin = {item.name=='accessLevel'?props.isAdmin:null}
                    Placeholder={item.placeholder}
                    isRequred={item.name ==="taxTemplate" ? (props.disabled ? !props.disabled : true) : item.isRequired}
                    disabled = {item.name ==="taxTemplate" ? props.disabled : false}
                    dynamicSelect={item.dynamicSelect}
                    lookupReference={item.dynamicSelect ? item.lookupReference : null}
                    Options={props.tempOptions && item.name==="taxTemplate" ? props.tempOptions : item.options}
                    tooltip={item.tooltip?item.tooltip:""}
                    Name={item.name}
                    dependentField = {item.dependentField}
                    dependentFieldVal = { item.userRole ? (props.userType ? props.userType : ''):item.dependentFieldVal?item.dependentFieldVal:'' }
                    handleChange={(e)=>props.onHandleChange(e,item)}
                    handleBlur={(e)=>props.onHandleBlur(e,item)}
                    formDataSet={props.formDataSet ? props.formDataSet[item.name]:""}
                    // fieldError={
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
                    />)   
                case "date": 
                    return (<>
                        <DatePicker
                            colWidth={item.styles ? item.styles.colWidth : ""}
                            styles = {item.styles}
                            Name={item.name}
                            Label={item.label}
                            borderRed={formData && formData?.Edited && formData?.Edited.length && formData?.Edited.includes(item.name) ? true : false}
                            handleChange = {(e)=>props.onHandleChange(e,item)}
                            isRequired={item.isRequired}
                            // MinDate = {item.name == 'endDate' && (props.minVal !== 'NaN/NaN/NaN' && props.minVal != null) ? props.minVal : null}
                            // MaxDate = {item.name == 'startDate' && (props.maxVal !== 'NaN/NaN/NaN' && props.minVal != null) ? props.maxVal : null}
                            // fieldError={
                            //     formErrors &&
                            //     formErrors[item.name] && !formErrors[item.name].isValid
                            //     && (
                            //         formErrors[item.name].isTouched
                            //     )
                            // }
                            // errorMessage={
                            //     formErrors
                            //     && formErrors[item.name]
                            //         .activeValidator
                            //         .errorMessage
                            // }
                            value={formData && formData[item.name] ? getFormattedMMDDYY(formData[item.name]) :""}
                        /></>
                            
                    )       
                case "input":
                    return (<Input
                        disabled = {item.disable?item.disable: true}
                        colWidth={item.styles ? item.styles.colWidth : ""} 
                        borderRed={formData && formData?.Edited && formData?.Edited.length && formData?.Edited.includes(item.name) ? true : false}
                        Type={item.type} 
                        Label={item.label}
                        data-label={item.label}
                        value={formData[item.name]}
                        onkeyDown={true}
                        styles={item.styles}
                        Accept={props.Accept?props.Accept:null}
                        Placeholder={item.placeholder}
                        isRequred={item.isRequired}
                        Name={item.name}
                        handleChange={(e)=>props.onHandleChange(e,item)}
                        handleBlur={(e)=>props.onHandleBlur(e,item)}
                        addinfo = {item.addinfo}
                        infoText = {item.infoText}
                        formDataSet={formData?item.name === "OperatorName"?camelize(formData[item.name]):formData[item.name]:""}
                        // fieldError={
                        //     formErrors
                        //     && !formErrors[item.name].isValid
                        //     //&& (
                        //     //    formErrors[item.name].isTouched
                        //     //)
                        // }
                        // errorMessage={
                        //     formErrors
                        //     && formErrors[item.name]
                        //         .activeValidator
                        //         .errorMessage
                        // }
                        />)
                case "box":
                    return(
                        <div className={`bf-services-details ${formData && formData?.Edited && formData?.Edited.length && formData?.Edited.includes('Services') ? 'bf-border-clr-red' : ""}`}>
                            {
                                formData[item.name]?.length ? 
                            <>{formData[item.name]?.length && formData[item.name].map((data,index)=>(
                               <>{`${data[item.key]}${index<((formData[item.name].length)-1 )? "," : ''} `}</> 
                            ))}</>:'No Services Selected.' }
                        </div>
                    )
            default:
                break;
        }
    }
  return (
    <>
        {jsonData &&
        <>
            <div className='bf-order-sub bf-show-mobile bf-relative'>
                    <div className='bf-sub-icon'>
                        <img className='bf-back-icon' onClick={(e)=>props.onClickSubmit(e,{"name":"back"},false,false)} src={BackIcon}  alt="Back" />
                    </div>
                    <div className='bf-sub-heading'>Order Details</div>
                </div>
            <div className='bf-show-mobile bf-mobile-order-placement-fbo-details'>
                <img src={fboCompanyIcon} />
                <div className='bf-fbo-details'>
                    <div className='bf-partner'>
                        {"Partner"}
                    </div>
                    <div className='bf-fbo-name'>
                        {formData?.FBO} ({formData?.ICAO})
                    </div>
                    <div className='bf-fbo-address'>
                        {formData?.Address}
                    </div>
                </div>
            </div>
            <div className='bf-orderplacement-scroll-section'>
                <div className='bf-order-placement-container bf-order-placed-summary-view'>
                    <div className='bf-order-placed-header'>
                        <div className='d-flex bf-orderd-operator'>
                            {jsonData?.orderViewData?.orderHeadersData?.fields?.map((item,index)=> {
                                if(item.component.toLowerCase() !== 'subheader') {
                                    return getHeaders(item,index)
                                }
                            })}
                        </div>
                        <div className='bf-order-plcde-fbo-address-section'>
                            {jsonData?.orderViewData?.orderHeadersData?.fields?.map((item,index)=> {
                                if(item.component.toLowerCase() === 'subheader') {
                                    return getHeaders(item,index)
                                }
                            })}
                        </div>
                    </div>
                    <div className='bf-order-placement-fields-container bf-mrgt25'>
                        <Row>
                            {jsonData?.orderViewData?.ordersFields?.fields?.map((item,index)=>(
                                getFields(item,index)
                            ))}
                        </Row>
                    </div>
                    <div className='bf-order-placement-fields-container'>
                        <Row>
                            {jsonData?.orderViewData?.orderPayments?.fields?.map((item,index)=>(
                                getFields(item,index)
                            ))}
                        </Row>
                    </div>
                    <div className='bf-order-placement-fields-container'>
                        <Row>
                            {jsonData?.orderViewData?.orderedServices?.fields?.map((item,index)=>(

                                getFields(item,index)
                            ))}
                        </Row>
                    </div>
                    <div className='bf-show-mobile'>
                        <button className='bf-btn-login bf-btn-imp  bf-btn-login btn btn-primary' onClick={(e)=>props.handleContinue(true)}>Continue</button>
                    </div>
                </div>
            </div>
        </>
        }
    </>
  )
}
