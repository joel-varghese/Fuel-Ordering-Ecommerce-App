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
import { IoIosArrowDropdownCircle, IoIosArrowDropupCircle, IoIosSearch } from 'react-icons/io';

export default function SearchFuelHome(props) {
  let navigate = useNavigate()
  let {state} = useLocation()
  const [accountHomeData, setAccountHomeData] = useState(null);
  const formDataSet = props.formDataSet;
  const addServices = props.addServices;
  const checkedServices=props.checkedServices;
  const [hideServices, sethideServices] = useState(false);
  const [disable, setdisable] = useState(false);
  const [orderCriteria, setordercriteria] = useState();
  const searchFuelOrderReducer = useSelector((state) => state.searchFuelOrderReducer);
  const jsonData = searchFuelOrderReducer && searchFuelOrderReducer.searchFuelOrderJson && searchFuelOrderReducer.searchFuelOrderJson;

   useEffect(()=>{
    let json= jsonData?.data?.data?.aircraftData[0]
    setAccountHomeData(json)
    setordercriteria(json?.aircraftInformation?.orderCriteriaFields.filter((m)=>m?.users?.includes(props.userType.toLowerCase())))
    if(props.searchType=='city' || props.searchType=='state'){
      setdisable(true)
    }else{
      setdisable(false)
    }
  },[jsonData,props]) 
  
  const filterBy = () => true;

  const setServices = () => {
    sethideServices(!hideServices)
  }

  const getOperatorFields = (item, index) => {
    switch (item.component.toUpperCase()) {
        case "INPUT":
            return (<Input
               
                colWidth={item.styles ? item.styles.colWidth : ""}
                Type={item.type}
                Label={item.label}
                data-label={item.label}
                disabled={item.name=='quantity' && disable? true : false}
                Placeholder={item.placeholder}
                callback={item.callback}
                // onselect={(index, item) => onHandleSelect(index, item)}
                isRequred={item.isRequired}
                Name={item.name}
                handleChange={(e) => props.onHandleChange(e, item)}
                handleBlur={(e) => props.onHandleBlur(e, item, index)} 
                formDataSet={formDataSet && formDataSet[item.name] ? formDataSet[item.name] : item.defaultValue ? item.defaultValue : ''}
                  />)
        case "RADIO":
            return ( <Radio type={item.type} 
                Label={item.label} 
                Name={item.name}
                disabled={props.radioDisable}
                formDataSet={formDataSet && formDataSet[item.name] ? formDataSet[item.name] :item.defaultValue ? item.label : ''}
                colWidth={item.styles ? item.styles.colWidth : ''}
                options={item.options}
                className={item.styles? item.styles.className: ''}
                handleChange={(e) => props.onHandleChange(e, item)}
                handleBlur={(e) => props.onHandleBlur(e, item)}/>)          
        case "CHECKBOX":
            return (<Checkbox Label={item.label} colWidth={item.styles ? item.styles.colWidth : ''} 
            Placeholder={item.placeholder}
            type={item.type}
            ischeck={item.ischeck}
                isRequred={item.isRequired}
                Name={item.name}
                handleChange={(e) => props.onHandleChange(e, item)}
                handleBlur={(e) => props.onHandleBlur(e, item)}
                className={item.styles} 
            />)
        case "DATE":
            return (<>
            <DatePicker
            colWidth={item.styles ? item.styles.colWidth : ""}
            styles = {item.styles}
            MaxDate ={props.maxDate && props.maxDate}
            MinDate = {props.minDate}
            handleChange={(e) => props.onHandleChange(e, item)}
            value = {props.date}
            Name={item.name}
            isRequred={item.isRequired}
            errorMessage={props.invalidDate ? accountHomeData?.dateError?.message : null}
            fieldError={props.invalidDate ? true : false}
            /></>)
        case "RANGE":
          return (<>
          <Range
          colWidth={item.styles ? item.styles.colWidth : ""}
          styles = {item.styles}
          value={formDataSet && formDataSet[item.name] ? formDataSet[item.name] : props.maxRange ? props.maxRange : 0}
          handleChange={(e) => props.onHandleChange(e, item)}
          onAfterChange={(e) => props.onAfterChange(e, item)}
          Name={item.name}
          Label={item.label}
          isRequred={item.isRequired}
          minRange={props.minRange}
          maxRange={props.maxRange}
          rangeUnit="$"
          step={0.01}
          /></>
              
              )        
            case "ASYNCTYPEAHEAD":
                return(
                    <Form.Group as={Col} md={item.styles.colWidth} className={` mb-4 ${props.fuelLocationError && item.name=='searchFuel' ? 'bf-error-class' : ''} ${item.name=='searchFuel' ? 'bf-search-fuel' : ''}`} controlId={item.name}
                    >
                        <Form.Label>{item.label} {item.isRequired ? <span className='bf-required'>*</span> : ''}</Form.Label>
                        {item.name=='searchFuel' ? 
                          <IoIosSearch className='search-icon'/> : 
                          null}
                        <AsyncTypeahead
                        id={item.id}
                        filterBy={filterBy}
                        isLoading={item.name=='searchFuel'?props.isAddress1Loading:props.tailLoading}
                        minLength={3}
                        disabled={item.name=='searchFuel'?false:props.radioDisable}
                        defaultInputValue={formDataSet && formDataSet[item.name] ? formDataSet[item.name] : item.defaultValue ? item.defaultValue : ''}
                        label={item.label}
                        useCache={false}
                        onSearch={(e)=>props.searchAPI(e,item)}
                        inputProps={{
                            name: item.name,
                            maxLength: item.maxLength
                          }} 
                        ref={props.typeaheadRef}
                        onKeyDown={(e)=>props.onKeyDown(e,item)}
                        onChange={(index) => props.searchHandler(index, item)}
                        options={item.name=='searchFuel'?props.results:props.tailResults}
                        placeholder = {item.placeholder}
                        onBlur={(e)=>props.onSearchBlur(e,item)}
                        selected={item.name=='searchFuel'?props.address1Selected:props.tailSelected}
                        onFocus={props.handleFocus}
                        renderMenuItemChildren={(option) => (
                            <>
                            <span>{option}</span>
                            </>
                        )}
                        />
                    </Form.Group> 
                )

        case "SELECT":
            return (<Select
                colWidth={item.styles ? item.name=='sortFboBy' ? item.styles.colWidth2 :item.styles.colWidth : ""}
                Type={item.type}
                Label={item.label}
                Placeholder={item.placeholder}
                dynamicSelect={item.dynamicSelect}
                filterfuel={item.name=='fuelservice' && formDataSet &&  formDataSet[item.name]!='100LL' && props.radioDisable ? true : false}
                disabled={(item.name=='fuelservice' && formDataSet &&  formDataSet[item.name]=='100LL') || (item.name=='tailNumber') ? props.radioDisable : (item.name=='unit' || item.name=='sortFboBy') && disable? true : false}
                lookupReference={item.dynamicSelect ? item.lookupReference : null}
                isRequred={item.isRequired}
                Options={item.name=='fboBrand'?props.brandOptions:item.name=='tailNumber'?props.tailResults:item.options}
                Name={item.name}
                handleChange={(e) => props.onHandleChange(e, item)}
                handleBlur={(e) => props.onHandleBlur(e, item)}
                dependentField = {item.dependentField}
                dependentFieldVal = {item.dependentFieldVal}
                formDataSet={formDataSet && formDataSet[item.name] ? formDataSet[item.name] :item.defaultValue ? item.defaultValue : ''} 
                />)
        case "PARAGRAPH":
          return (<Subheading label={item.label} />)    
        case "LINK":
          return(
            <a href='javascript:void(0);' className='bf-clear-filters' onClick={()=>props.clearAll()}>{item.label}</a>
          )    
        case "BUTTON":
            if(!item.shouldNotRender){
            return (<ButtonComponent
                Label={item.label}
                Type={item.type}
                className={item.styles.className}
                variant={item.variant}
                disabled={false}
                // handleClick={(e) => onClickSubmit(e,item)}
                 />)
            }
    };
} 


  return (
    <div className='bf-fuel-search-container'>
      {accountHomeData && 
        <div className='row'>
                {props.fuelLocationError && 
                  <div className='bf-show-on-mobile bf-required bf-fuel-search-error'>
                    {accountHomeData.aircraftInformation.searchErrorMsg}
                  </div>
                }
                {props.isMulti && !props.isSummary ? <div className='bf-view-multi-summary bf-show-mobile'>
                   <div onClick={()=>props.viewSummary()}>Order Summary</div>
                </div> : ""}
                { !props.isMobile && orderCriteria.map((item, sectionIndex) => (<>
                  {getOperatorFields(item)}
                </>)
                )}
                <div className='align-items-center justify-content-center bf-search-fuel-submit-button'>
                  <ButtonComponent 
                      Label={"Submit"}
                      Type={'button'}
                      variant={"primary"}
                      disabled={false}
                      className={"bf-btn-primary bf-btn-left bf-btn-imp"}
                      handleClick={(e) => props.ValidateFuelLocation()} />
                </div>
                <div className='row bf-relative bf-search-filters'>
                  { accountHomeData.aircraftInformation.filterByFields.map((item, sectionIndex) => (<>
                                  {getOperatorFields(item)}
                                  </>)
                  )}
                </div>
                <div className='bf-primary-color bf-additional-services-label' onClick={()=>setServices()}>
                <span className='bf-mrgr5'>Additional Services</span> {
                    hideServices 
                    ? <IoIosArrowDropupCircle className='bf-primary-color'/>
                    : <IoIosArrowDropdownCircle className='bf-primary-color'/> 
                  } 
                </div>
                <div className='bf-additional-services-list'>
                  {hideServices ? addServices.map((val,ind)=>(
                    <Checkbox Name={val}  
                    Label={val} 
                    ischeck={checkedServices.length ? checkedServices.includes(val) ? true : false : false}
                    onClick={(e)=>props.onClick(e,val)}/>
                  )):""}
                </div>
                <div>
                  {props.isMobile ?<>
                    <div>
                      {getOperatorFields(accountHomeData?.aircraftInformation?.sortFboBy)}
                    </div>
                    <Button className='bf-btn-login' onClick={()=>props.applyFilter()}>Apply</Button>
                    </>
                  :""}
                </div>
        </div>
              }
    </div>
  )
}
