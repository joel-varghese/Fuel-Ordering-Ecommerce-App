import React, { useState, useEffect,useRef } from 'react';
import Select from '../select/select';
// import './accountHome.scss';
import Header from '../header/header';
import Input from '../input/input';
import { Row, Nav, Col, Form } from 'react-bootstrap';
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
import PrefferedImage from '../../assets/images/bf-fbo-preffered.png';

export default function PrefferedFbo(props) {
  let navigate = useNavigate()
  let {state} = useLocation()
  const [accountHomeData, setAccountHomeData] = useState(null);
  const [data, setdata] = useState([]);
  const formDataSet = props.formDataSet;
  const searchFuelOrderReducer = useSelector((state) => state.searchFuelOrderReducer);
  const jsonData = searchFuelOrderReducer && searchFuelOrderReducer.searchFuelOrderJson && searchFuelOrderReducer.searchFuelOrderJson;
  
   useEffect(()=>{
    setAccountHomeData(jsonData && jsonData.data && jsonData.data.data.aircraftData[0])
    cleanData(props.resultData)
  },[jsonData,props]) 
  

  const cleanData = (data)=>{
    let finalData=[]
    data && data.map((val)=>{
        let obj={}
        obj.fboName=val.FBOName &&val.FBOName
        obj.icao=val.ICAO
        obj.address=val.AiportLocations &&val.AiportLocations.length && val.AiportLocations[0].Address
        obj.partner=val.IsPartner?'Partner':""
        obj.favourite=val.IsFavourite?true:false
        obj.isRequested=val.IsRequested?true:false
        obj.suppliedBy=val.AiportLocations &&val.AiportLocations.length && val.AiportLocations[0].SuppliedBy
        obj.airportLocations = val.AiportLocations
        let arr=[]
        val.AiportLocations && val.AiportLocations.length && val.AiportLocations[0].FuelTypes && val.AiportLocations[0].FuelTypes.map((type)=>{
            arr.push(type.Name)
            obj.tiers=type.Tiers
            obj.expiresOn=type.Expireson
        })
        obj.fuelOffered=arr
        if(obj.tiers && obj.tiers.length){
            finalData.push(obj)
        }
    })
    setdata(finalData)
}

  return (
    <div>
      {accountHomeData && 
        <div className='bf-preffered-fbo-sction'>
            <div className='bf-preffered-heading'>{accountHomeData?.aircraftInformation?.fuelordersheader?.preferredfboheading}</div>
            <div className='bf-preffered-heading-favorite'>{accountHomeData?.aircraftInformation?.fuelordersheader?.favoritefboheading}</div>

            <div className='bf-preffered-fbo-list'>
              
                {data && data.map((item)=>(
                  <div className='bf-preffed-fbo'>
                    <img src={PrefferedImage} onClick={()=>props.onOrderClick(item)}/>
                    <div className='bf-fbo-preffered-name'>{(item.fboName).toLowerCase()}</div>
                    <div className='bf-fbo-preffered-city'>{item.icao}</div>
                  </div>
                ))}
                
            </div>
        </div>
      }
    </div>
  )
}
