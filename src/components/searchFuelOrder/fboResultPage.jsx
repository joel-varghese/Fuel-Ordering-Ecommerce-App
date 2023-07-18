import React, { useState, useEffect,useRef } from 'react';
import Select from '../select/select';
// import './accountHome.scss';
import Header from '../header/header';
import Input from '../input/input';
import { Row, Nav, Col, Form, Button } from 'react-bootstrap';
import { Storage, jsonStringify } from '../../controls/Storage';
import { Outlet, useNavigate,useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Paper } from '@mui/material';
import { fetchFuelLocations, fetchJSONData } from '../../actions/searchFuelOrder/searchFuelOrderActions';
import Checkbox from '../checkbox/checkbox';
import ButtonComponent from '../button/button';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import Radio from '../radio/radio';
import DatePicker from '../datePicker/datePicker';
import Subheading from '../subHeading/subHeading';
import Range from '../range/range';
import { BsStarFill,BsStar } from "react-icons/bs";
import fboCompanyIcon from '../../assets/images/bf-fbo-logo.png'
import { getFormattedMMDDYY, sortFbo } from '../../controls/validations';

import BackIcon from '../../assets/images/collapse_arrow.svg';
import filter from '../../assets/images/sort-filter-icon.svg';

export default function FboResultPage(props) {
  let navigate = useNavigate()
  let {state} = useLocation()
  const [accountHomeData, setAccountHomeData] = useState(null);
  const [finaldata, setfinaldata] = useState([]);
  const [formDataSet, setformDataSet] = useState({});
  const [sortValue, setsortValue] = useState('');
  const fuelType=props.formDataSet.fuelservice
  const [fuelQuantity, setfuelQuantity] = useState({});
  const searchFuelOrderReducer = useSelector((state) => state.searchFuelOrderReducer);
  const commonReducer = useSelector((state) => state.commonReducer);
  const loggedInUserType = commonReducer && commonReducer.loggedInUserType && commonReducer.loggedInUserType.data
  const jsonData = searchFuelOrderReducer && searchFuelOrderReducer.searchFuelOrderJson && searchFuelOrderReducer.searchFuelOrderJson;
  const searchFuelResult = searchFuelOrderReducer && searchFuelOrderReducer.searchFuelResult && searchFuelOrderReducer.searchFuelResult;
  const [mobileSearchItems, setMobileSearchItems] = useState({})

  const mobileFuelData = searchFuelOrderReducer?.orderMobileDetails?.data;
  
   useEffect(()=>{
    setAccountHomeData(jsonData?.data?.data?.aircraftData[0]?.aircraftInformation)
    cleanData(props.resultData)
    console.log(props.formDataSet)
    setMobileSearchItems(
        {
            searchType: props.searchType,
            searchFuel: props.formDataSet.searchFuel
        }
    )
  },[jsonData,props]) 
 
const cleanData = (data)=>{
    let quantity=props.formDataSet.quantity
    let bfPrice=props.formDataSet.bfPrice;
    if(quantity!==''){
        quantity=parseFloat(quantity);
        if(props.formDataSet.unit=='Pound'){
            quantity=quantity/8;
        }else if(props.formDataSet.unit=='Kilogram'){
            quantity=quantity/3.79;
        }else if(props.formDataSet.unit=='Liter'){
            quantity=quantity/3.785;
        }
    }
    setfuelQuantity(quantity)
    
    let finalData=[]
    data && data.map((val)=>{
        //console.log(val)
        let supplydName = val.AiportLocations &&val.AiportLocations.length && val.AiportLocations[0].SuppliedBy&&val.AiportLocations[0].SuppliedBy.toString().toLowerCase()
        let obj={}
        obj.fboName=val.FBOName &&val.FBOName
        obj.icao=val.ICAO
        obj.address=val.AiportLocations &&val.AiportLocations.length && val.AiportLocations[0].Address
        obj.RetailPrice=val.AiportLocations &&val.AiportLocations.length && val.AiportLocations[0].RetailPrice
        obj.IsPartner=val.IsPartner?'Partner':""
        obj.favourite=val.IsFavourite?true:false
        obj.isRequested=val.IsRequested?true:false
        obj.suppliedBy=supplydName&&supplydName.charAt(0).toUpperCase() + supplydName.slice(1)
        obj.airportLocations = val.AiportLocations
        obj.phoneNumber = val.FBO_ContactNumber
        let arr=[]
        val.AiportLocations && val.AiportLocations.length && val.AiportLocations[0].FuelTypes && val.AiportLocations[0].FuelTypes.map((type)=>{
            if(type.Name === 'Sustainable Aviation Fuel (SAF)'){
                arr.push('SAF')
            }else{
                arr.push(type.Name)
            }
            if(fuelType && fuelType==type.Name || (type.Name.includes(fuelType) && type.Name!='Jet A+ / Prist')){
                obj.tiers=type.Tiers
                obj.expiresOn=type.Expireson
                if(type.PricingType.toLowerCase()=='flat'){
                    obj.flat=true
                }
            } 
        })
        obj.fuelOffered=arr
        let pr;
        if(obj.flat){
            obj?.tiers?.map((val)=>{
                pr=val.Baseprice+val.costplus;
            })
        }else{
            if(bfPrice){
                obj?.tiers?.map((val)=>{
                    if(val.MaxRange){
                        if(bfPrice>=val.MinRange && bfPrice<=val.MaxRange ){
                            pr=val.Baseprice+val.costplus
                        }
                    }else{
                        if(bfPrice>val.MinRange){
                            pr=val.Baseprice+val.costplus
                        }
                    }
                })
            }else{
                let min=[]
                obj?.tiers?.map((val)=>{
                    min.push(val.Baseprice+val.costplus)
                })
                pr=Math.min(...min)
            }
        }
        obj.bfPrice=parseFloat(pr).toFixed(2);
        if(obj.tiers && obj.tiers.length){
            finalData.push(obj)
        }
    })
    setfinaldata(finalData)
    sortHandler(sortValue,finalData,quantity)
}

const onFavouriteClick = (item,index)=>{
    if(loggedInUserType=='Operator'){
         props.onFavouriteClick(item,index)
    }
}

const onRequestPartner = (item,index)=>{
    props.onRequestPartner(item,index)
    
}

const sortHandler = (val,data,quant)=>{
    let arr=data ? data : finaldata
    let fuelQuatity=quant ? quant : fuelQuantity
    arr=sortFbo(val,arr,fuelQuatity)
    setfinaldata(arr)
}

const onHandleChange = (e,item)=>{
    sortHandler(e.target.value)
    setsortValue(e.target.value)
}

const onHandleBlur = (e,item)=>{
    setsortValue(e.target.value)
}

const getOperatorFields = (item, index) => {
    switch (item.component.toUpperCase()) {

        case "SELECT":
            return (<Select
                colWidth={item.styles ? item.styles.colWidth : ""}
                className={'bf-sort-fuel'}
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
                dependentField = {item.dependentField}
                dependentFieldVal = {item.dependentFieldVal}
                formDataSet={sortValue ? sortValue : ''} 
                />)
    };
} 
  return (
    <div className='bf-fbo-fuel-results'>
      {accountHomeData && finaldata &&
        <>
        <div>
            <Button style={{display:'none'}} className='bf-btn-login' onClick={()=>props.mobileFilter()}>Filter</Button>
        </div>
        <div className='bf-sort-fbos'>
            {accountHomeData.sortFboBy && getOperatorFields(accountHomeData.sortFboBy)}
        </div>
        <div className='bf-mobile-fbo-back-section bf-show-mobile-view justify-content-between'>
            <img className='bf-back-icon' onClick={()=>props.handleBack('fboResult',props.formDataSet.searchFuel, props.searchType)} src={BackIcon}  alt="Back" /> 
            <div className='bf-fbo-search-details'>{props.formDataSet.searchFuel} | {props.formDataSet.fuelservice} | {getFormattedMMDDYY(props.formDataSet.dateOfOrder)}</div>
            <img className='bf-filter-icon' src={filter} onClick={()=>props.mobileFilter()} alt="Filter" /> 
        </div>
        {props.isMulti && !props.isSummary ? <div className='bf-view-multi-summary bf-show-mobile bf-results-summary' onClick={()=>props.viewSummary()}>
            <span>Order Summary</span>
        </div> : ""}
        <div className='bf-all-fbo-results-section'>
            {finaldata?.map((item,index)=>(
                <div className='bf-fuel-order-fbo-item'>
                    <div className='bf-fbo-company-sec'>
                        <img src={fboCompanyIcon} alt="fbo company"/>
                        {item.IsPartner && loggedInUserType.toLowerCase()=='operator'?item.favourite?(<BsStarFill onClick={()=>onFavouriteClick(item,index)} className="bf-fav-fbo bf-fav" />):(<BsStar onClick={()=>onFavouriteClick(item,index)} className="bf-fav-fbo"/>):""}
                        <div className='bf-mobile-fbo-details'>
                            <div className='bf-fbo-details'>
                                <div className='bf-fbo-name'>
                                    <span>{(item.fboName).toLowerCase()+'  '}</span>({(item.icao).toUpperCase()})
                                </div>
                                <div className='d-flex d-flex-column bf-fuel-exp-date-sec'>
                                    {item.RetailPrice ? (<span className='bf-mobile-retail-price'> Retail Price <span className='bf-mobile-price'>${item.RetailPrice?.toFixed(2)}</span></span>): ""}
                                    {item.IsPartner?(<span className='bf-mobile-parter'>BF Price <span className='bf-partner'>${item.bfPrice}</span></span>):""}
                                    {item.IsPartner?(<span className='bf-mobile-parter'>Expires On {item.expiresOn ? getFormattedMMDDYY(item.expiresOn) : ''}</span>):""}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='bf-order-details-section'>
                        <div className='bf-partner-section'> 
                            <span className={item.IsPartner ? 'bf-partner' : 'bf-partner-empty'}>{item.IsPartner}</span> 
                        </div>
                        <div className='bf-order-button'>
                            <span>{item.IsPartner?(<Button className='bf-btn-login' onClick={()=>props.onOrderClick(item)}>Order Now</Button>):item.isRequested?(<div className='bf-fboreq-submitted'>Submitted to Become a Partner</div>):(<a href='javascript:void(0);' onClick={()=>onRequestPartner(item,index)}>Request This FBO to Become a Partner</a>)}</span>
                        </div>
                        <div className='bf-fbo-name'>
                            <span>{(item.fboName).toLowerCase()+'  '}</span>({(item.icao).toUpperCase()})
                        </div>
                        <div className='bf-fbo-fuel-offered'>
                        Fuel Offered :  {item.fuelOffered.join(", ")} | Supplied By {item.suppliedBy}
                        </div>
                        <div className='bf-fbo-address'>
                        Address :  {item.address}
                        </div>
                        {item.RetailPrice ? <>
                        <div className='bf-gallons-price-sec'>
                        <div className='d-flex'>
                            <div>
                                Gallons                              
                            </div>
                            {item.tiers && item.tiers.length && item.tiers.map((val, index)=>{
                                if(index <= 6) {
                                    return (
                                        <div>
                                            {val.MaxRange?`${val.MinRange}-${val.MaxRange}`:`${val.MinRange}+`}
                                        </div>  
                                    )
                                }
                            })}
                    </div>
                    <div className='d-flex'>
                            <div>
                                Price
                            </div>
                            {item.tiers && item.tiers.length && item.tiers.map((val, index)=>{
                                if(index <= 6) {
                                    return (
                                        <div>
                                            ${parseFloat(val.Baseprice+val.costplus).toFixed(2)}
                                        </div>  
                                    )
                                }
                            })}
                        </div>
                    </div>
                    <div className='d-flex bf-fuel-exp-date-sec'>
                        <span>
                        {item.IsPartner?(<>Expires On {item.expiresOn ? getFormattedMMDDYY(item.expiresOn) : ''}</>):""}
                    </span>

                    <span>{item.RetailPrice ? `Retail Price ${item.RetailPrice?.toFixed(2)}`: ""}</span>
                    </div> </> : "" }
                        
                    </div>
                    <div className='bf-fbo-compay-mobile-sec'>
                        <div className='bf-fbo-gallons-section'>
                            <div className='bf-partner-section'> 
                                <span className={item.IsPartner ? 'bf-partner' : 'bf-partner-empty'}>{item.IsPartner}</span> 
                            </div>
                            <div className='d-flex d-flex-row'>
                                <div className='bf-galan-w70'>
                                    Gallons
                                </div>                            
                                <div className='bf-galan-w30'>
                                    Price
                                </div>
                            </div>
                            {item.RetailPrice ? 
                                <div className='bf-gallons-price-sec d-flex d-flex-column'>
                                        {item.tiers && item.tiers.length && item.tiers.map((val, index)=>{
                                            if(index <= 6) {
                                                return (
                                                    <div className='d-flex'>
                                                        <div className={`bf-galan-w70 ${val.Baseprice+val.costplus==item.bfPrice ? 'bf-bold' : ""}`}>
                                                            {val.MaxRange?`${val.MinRange}-${val.MaxRange}`:`${val.MinRange}+`}
                                                        </div>
                                                        <div className={`bf-galan-w30 ${val.Baseprice+val.costplus==item.bfPrice ? 'bf-bold' : ""}`}>
                                                            ${parseFloat(val.Baseprice+val.costplus).toFixed(2)}
                                                        </div>
                                                    </div>  
                                                )
                                            }
                                        })}
                                </div>: <div className='bf-gallons-price-sec d-flex d-flex-column'>
                                    <div className='d-flex'>
                                        <div className={`bf-galan-w70`}>
                                            All
                                        </div>
                                        <div className={`bf-galan-w30`}>
                                            -
                                        </div>
                                    </div>  
                                </div>                
                            }
                        </div>
                    </div>

                    <div className='bf-order-button bf-show-mobile-view bf-mobile-order-button'>
                            <span>{item.IsPartner?(<Button className='bf-btn-login' onClick={()=>props.onOrderClick(item, true, mobileSearchItems)}>Order Now</Button>):item.isRequested?(<div className='bf-fboreq-submitted'>Submitted to Become a Partner</div>):(<a href='javascript:void(0);' onClick={()=>onRequestPartner(item,index)}>Request This FBO to Become a Partner</a>)}</span>
                        </div>
                </div>
            ))}
        </div>
        </>}
    </div>
  )
}
