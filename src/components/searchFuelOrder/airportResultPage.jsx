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
import { FaPlaneDeparture } from "react-icons/fa";
import { getFormattedMMDDYY, sortFbo } from '../../controls/validations';
import BackIcon from '../../assets/images/collapse_arrow.svg';
import filter from '../../assets/images/sort-filter-icon.svg';

export default function AirportResultPage(props) {
  let navigate = useNavigate()
  let {state} = useLocation()
  const [accountHomeData, setAccountHomeData] = useState(null);
  const [finaldata, setfinaldata] = useState([]);
  const fuelType=props.formDataSet.fuelservice
  const [fuelQuantity, setfuelQuantity] = useState({});
  const [sortValue, setsortValue] = useState('');
  const searchFuelOrderReducer = useSelector((state) => state.searchFuelOrderReducer);
  const jsonData = searchFuelOrderReducer && searchFuelOrderReducer.searchFuelOrderJson && searchFuelOrderReducer.searchFuelOrderJson;
  const searchFuelResult = searchFuelOrderReducer && searchFuelOrderReducer.searchFuelResult && searchFuelOrderReducer.searchFuelResult;

   useEffect(()=>{
    setAccountHomeData(jsonData && jsonData.data && jsonData.data.data.aircraftData[0])
    // let res=searchFuelResult.data
    // let data = res && res.length && res[0].length && res[0][0]['JSON_UNQUOTE(@JSONResponse)']?JSON.parse(res[0][0]['JSON_UNQUOTE(@JSONResponse)']):[];
    cleanData(props.resultData)
  },[jsonData,props]) 
  
  const cleanData = (data)=>{
    let finalData=[]
    let flag=false;
    data && data.map((val)=>{
        let obj={}
        let price=[]
        obj.city=val.City
        obj.icao=val.icao
        obj.latitude=val.Latitude
        obj.longitude=val.Longitude
        obj.airportName=val.AirportName
        if(val.FBO){
          obj.noFbo=false
        }else{
          obj.noFbo=true
        }
        val.FBO && val.FBO.map((fbo)=>{
          fbo.AiportLocations && fbo.AiportLocations.length && fbo.AiportLocations[0].FuelTypes && fbo.AiportLocations[0].FuelTypes.map((type)=>{
       
            if(fuelType && fuelType==type.Name || (type.Name.includes(fuelType) && type.Name!='Jet A+ / Prist')){
                type.Tiers && type.Tiers.map((tier)=>{
                  price.push(tier.Baseprice+tier.costplus)
                })
            } 
        })
        })
        obj.lowPrice=Math.min(...price).toFixed(2)
        obj.upperPrice=Math.max(...price).toFixed(2)
        finalData.push(obj)
    })
    setfinaldata(finalData)
}

  return (
    <div className='bf-airport-results-section'>
      {accountHomeData && finaldata && <>
        <div>
        <Button style={{display:'none'}} className='bf-btn-login' onClick={()=>props.mobileFilter()}>Filter</Button>
        </div>
       
        <div className='bf-airport-mobile-fbo-back-section bf-show-mobile-view justify-content-between'>
            <img className='bf-back-icon' onClick={()=>props.handleBack('airportResult', props.formDataSet.searchFuel)} src={BackIcon}  alt="Back" />
             <div className='bf-mobile-content'>{props.formDataSet.searchFuel} | {props.formDataSet.fuelservice} | {getFormattedMMDDYY(props.formDataSet.dateOfOrder)}</div>
            <img  className='bf-mobile-filter' src={filter} onClick={()=>props.mobileFilter()} alt="Filter" /> 
        </div>
        {props.isMulti && !props.isSummary ? <div className='bf-view-multi-summary bf-show-mobile bf-results-summary' onClick={()=>props.viewSummary()}>
            <span>Order Summary</span>
        </div> : ""}
        <div className='bf-airport-scroll-section'>
            {finaldata?.map((item)=>(
            <div className='d-flex bf-airport-flight-details' onClick={!item.noFbo?()=>props.onAirportClick(item,props.searchType):null}>
                <div className='bf-airport-flight-location-details'>
                  <FaPlaneDeparture className='bf-flight-icon' />
                  <div className='bf-airport-location'>
                    {item.icao}
                  </div>
                  <div className='bf-lat-lan'>
                    {item.latitude},
                  </div>
                  <div className='bf-lat-lan'>
                    {item.longitude}
                  </div>
                </div>
                <div className='bf-airport-flight-information'>
                  <div>
                    {item.airportName}
                  </div>
                  <div>
                    {item.city}
                  </div>
                  <div>
                    {item.noFbo ? `No FBOs Found` : item.lowPrice==item.upperPrice ? `$${item.upperPrice} Per Gallon` : item.lowPrice ? `$${item.lowPrice}-$${item.upperPrice} Per Gallon` : ''}
                  </div>
                </div>
            </div>
            ))}
        </div></>}
    </div>
  )
}
