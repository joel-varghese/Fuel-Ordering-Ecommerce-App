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
import PrefferedFbo from './preferredFbo';
import FboResultPage from './fboResultPage';
import AirportResultPage from './airportResultPage';
import Loader from '../loader/loader';

export default function FuelResultPage(props) {
  let navigate = useNavigate()
  let {state} = useLocation()
  const [accountHomeData, setAccountHomeData] = useState(null);
  const [searchType, setsearchType] = useState('');
  const searchFuelOrderReducer = useSelector((state) => state.searchFuelOrderReducer);
  const jsonData = searchFuelOrderReducer && searchFuelOrderReducer.searchFuelOrderJson && searchFuelOrderReducer.searchFuelOrderJson;
  const searchFuelResult = searchFuelOrderReducer && searchFuelOrderReducer.searchFuelResult && searchFuelOrderReducer.searchFuelResult;
  const loading = searchFuelOrderReducer && searchFuelOrderReducer.loading;
   useEffect(()=>{
    setAccountHomeData(jsonData && jsonData.data && jsonData.data.data.aircraftData[0])
    setsearchType(props.searchType && props.searchType)
  },[jsonData,props]) 
  

  return (<>
    <div className='bf-fuel-search-result-container'>
      {loading ? (<Loader/>):(
        <div>
          {
            searchType=='icao'||searchType=='airportname'?<FboResultPage
              mobileFilter={props.mobileFilter}
              formDataSet={props.formDataSet}
              onFavouriteClick={props.onFavouriteClick}
              onRequestPartner={props.onRequestPartner}
              onOrderClick={props.onOrderClick}
              resultData={props.resultData}
              handleBack={props.handleBack}
              searchType={props.searchType}
              isMulti={props.isMulti}
              isSummary={props.isSummary}
              viewSummary = {props.viewSummary}
            />
            :searchType=='city'||searchType=='state'?
            <AirportResultPage
              mobileFilter={props.mobileFilter}
              formDataSet={props.formDataSet}
              onAirportClick={props.onAirportClick}
              resultData={props.resultData}
              handleBack={props.handleBack}
              searchType={searchType}     
              isMulti={props.isMulti}
              isSummary={props.isSummary}
              viewSummary = {props.viewSummary}        
            />
            :<PrefferedFbo
              resultData={props.resultData}
              onOrderClick={props.onOrderClick}
              formDataSet={props.formDataSet}
            />
          }
            
        </div>)}
    </div>
    </>)
}
