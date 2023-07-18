import React, { useState, useEffect,useRef } from 'react';
import { getAccountHomeJson } from '../../actions/accountServices/accountHomeService';
import Select from '../select/select';
import './searchFuelOrder.scss';
import Header from '../header/header';
import Input from '../input/input';
import { Row, Nav, Col, Form } from 'react-bootstrap';
import { IoIosSearch } from 'react-icons/io'
// import Company from './company';
// import User from './user';
// import Payment from './payment';
// import Locations from './locations';
import { fetchCompanyDetails } from '../../actions/accountServices/accountCompanyService';
import { bfaJsonService } from '../../actions/BFAServices/BFAJsonService';
// import Aircraft from './aircraft';
// import Banking from './banking';
import CompanyDetailsForm from '../fboSignup/companyDetails';
import { Storage, jsonStringify } from '../../controls/Storage';
// import Documents from './document';
import OperatorSignupForm from '../operatorSignupForm/operatorSignupForm';
import FboSignupForm from '../fboSignup/FboSignupForm';
import AdminAddUser from "../admin/adminAddUser";
import  AdminSignupForm from "../admin/adminSignupForm";
import { lookupService } from '../../services/commonServices';
import arrowDownIcon from '../../assets/images/arrow-down_icon.svg';
import { Outlet, useNavigate,useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Paper } from '@mui/material';
import { fetchFuelLocations, fetchFuelResult, fetchJSONData, fetchPrefferedFbo, setMobileOrderDetails, getOrderDetails } from '../../actions/searchFuelOrder/searchFuelOrderActions';
import Checkbox from '../checkbox/checkbox';
import ButtonComponent from '../button/button';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import Radio from '../radio/radio';
import DatePicker from '../datePicker/datePicker';
import Subheading from '../subHeading/subHeading';
import { getTailNumbersList } from '../../actions/clientPortal/discountAction';
import Range from '../range/range';
import SearchFuelHome from './searchFuelHome';
import FuelResultPage from './fuelResultPage';
import { getFuelLocations, requestPartnerFbo, setFavouriteFbo } from '../../actions/searchFuelOrder/searchFuelOrderService';
import { getIsEditMultiple, getIsEditSingle, getIsMultiSummary, getIsOrderClose, getIsPreviousScreen, getIsPricePending, getIsReorder, getIsSummary, getLegData, getLegLevel, getLegType, getMultiLegPricePending, getMultipleLeg } from '../../actions/orderPlacementActions/orderPlacementActions';
import { getEditLegData, getIsEdit } from '../../actions/orderPlacementActions/multiLegActions';
import CustomProfileModal from '../myProfile/customProfileModal';
import { sortFbo } from '../../controls/validations';
import PrefferedFbo from './preferredFbo';
import { getMobileFavoriteFbo, getMobileHeaderText } from '../../actions/commonActions/commonActions';
import CustomModal from '../customModal/customModal';
import ReactRouterPrompt from "react-router-prompt";

export default function NewFuelOrderHome(props) {
  let navigate = useNavigate()
  let {state} = useLocation()
  const [accountHomeData, setAccountHomeData] = useState(null);
  const typeaheadRef = useRef(null);
  const [formDataSet, setformDataSet] = useState({});
  const [resultData, setresultData] = useState([]);
  const [originalResultData, setoriginalResultData] = useState([]);
  const [date, setdate] = useState(new Date());
  const [minDate, setminDate] = useState(new Date());
  const [navigatePage, setNavigatePage] = useState(true);
  const [maxDate, setMaxDate] = useState();
  const [legNumber, setlegNumber] = useState(1);
  const [radioDisable, setradioDisable] = useState(false);
  const [maxRange, setMaxRange] = useState();
  const [minRange, setMinRange] = useState();
  const [results, setresults] = useState([]);
  const [tailResults, settailResults] = useState([]);
  const [multiLeg ,setmultiLeg] = useState(false);
  const [modalShow ,setModalShow] = useState(false);
  const [isMobile,setIsMobile] = useState(false);
  const [isAddress1Loading, setAddress1Loading] = useState(false);
  const [tailLoading, settailLoading] = useState(false);
  const [invalidDate, setinvalidDate] = useState(false);
  const [fuelLocationError, setFuelLocationError] = useState(false);
  const [showMobileResults, setShowMobileResults] = useState(false);
  const [address1Selected, setAddress1Selected] = useState([]);
  const [tailSelected, settailSelected] = useState([]);
  const [originalFuelList, setoriginalFuelList] = useState([])
  const [searchType, setsearchType] = useState('')
  const [searchType2, setsearchType2] = useState('')
  const [multiIcao, setmultiIcao] = useState('')
  const [brandOptions, setbrandOptions] = useState([])
  const [addServices, setaddServices] = useState([]);
  const [checkedServices, setcheckedServices] = useState([]);
  const [mobileuseState, setMobileuseState] = useState(false);
  const dispatch = useDispatch()
  const multiLegReducer = useSelector(state => state.multiLegReducer);
  const editLegData = multiLegReducer?.editLegData?.data;
  const orderPlacementReducer = useSelector((state)=>state.orderPlacementReducer);
  const fromLocation = orderPlacementReducer?.fromLocation?.data;
  const isMulti = orderPlacementReducer?.isMultileg?.data;
  const fuelInfo = orderPlacementReducer?.fuelInfo?.data;
  const multiLegData = orderPlacementReducer?.multiLegData?.data;
  const mdata= multiLegData?.OrderLegs?.length && multiLegData?.OrderLegs[multiLegData?.OrderLegs?.length - 1]
  const orderLegLevel = orderPlacementReducer?.legLevel?.data;
  const searchFuelOrderReducer = useSelector((state) => state.searchFuelOrderReducer);
  const searchFuelResult = searchFuelOrderReducer?.searchFuelResult?.data;
  const prefferedFboResult = searchFuelOrderReducer?.prefferedFboResult?.data;
  const mobileFuelData = searchFuelOrderReducer?.orderMobileDetails?.data;
  const commonReducer = useSelector((state) => state.commonReducer);
  const loggedInUser = commonReducer?.loggedInUser?.data
  const loggedInUserType = commonReducer?.loggedInUserType?.data
  const mobileFavoriteFbo = commonReducer?.mobileFavoriteFbo?.data
  const company=loggedInUserType && loggedInUserType.toLowerCase()=='barrel fuel'?'':commonReducer?.loggedInCompany?.data
  const jsonData = searchFuelOrderReducer?.searchFuelOrderJson;
  const isSummary = orderPlacementReducer?.isSummary?.data;
  let paylod = { 'blobname': 'searchFuelOrder.json' };
  const [preferredFboData, setPreferredFboData]=useState([]);
  useEffect(() => {
    setmultiIcao(mdata?.ICAO)
    let res;
    if(searchType==''){
      res=prefferedFboResult
    }else{
      res=searchFuelResult
    }
    let data = res && res.length && res[0].length && res[0][0]['JSON_UNQUOTE(@JSONResponse)']?JSON.parse(res[0][0]['JSON_UNQUOTE(@JSONResponse)']):[];
    cleanData(data)
    
  },[searchFuelResult,prefferedFboResult,formDataSet?.fuelservice]);
  
  // useEffect(()=>{
  //   if(originalFuelList.length && mobileFuelData.isMobile) {
  //     getsearchResults(mobileFuelData?.searchDetails?.searchFuel) 
  //   }
  // },[originalFuelList])
  useEffect(()=>{
    let res=prefferedFboResult
    let data = res && res.length && res[0].length && res[0][0]['JSON_UNQUOTE(@JSONResponse)']?JSON.parse(res[0][0]['JSON_UNQUOTE(@JSONResponse)']):[];
    setPreferredFboData(data)
  },[prefferedFboResult])
  useEffect(()=>{ 
    let dt=new Date().toLocaleString("en-US", {
      timeZone: "America/Los_Angeles"
    })
    if(new Date(dt).getHours()>=18){
      dt=new Date(dt)
      dt.setDate(dt.getDate()+1)
    }
    setdate(dt)
    setmaxdate(dt);
    loggedInUser && fetchPrefferedFbo(dispatch,{"LoggedinUser":loggedInUser})
    fetchJSONData(dispatch,paylod)
    
    if(loggedInUserType.toLowerCase()=='operator'){
      let payload ={"Operator":company,"IsRequestedFor":"OrderManagement","TailNumber":""}
      getTailNumbersList(payload,dispatch).then((res)=>{
        let tailNumbersList = [];
        let data = res && res.length && res[0].length?JSON.parse(res[0][0]['@JSONResponse']):[];
        if(data.length>0){
          data.map((i) =>{
            let obj={}
            obj.title=i.TailNumbers;
            obj.value=i.TailNumbers;
            tailNumbersList.push(obj);
          })
        }
          settailResults(tailNumbersList);
        })
    }
  },[]) 

   useEffect(()=>{
    getIsMultiSummary(dispatch,false)
    if(isMulti && !isSummary){
      setlegNumber(orderLegLevel+1)
      setradioDisable(true)
      setmultiLeg(true)
      setdate(new Date(fuelInfo?.dateOfOrder))
      setminDate(new Date(fuelInfo?.dateOfOrder))
      setmaxdate(fuelInfo?.dateOfOrder)
    }else{
      getMultipleLeg(dispatch, false)
      getIsSummary(dispatch, false)
      getIsPricePending(dispatch,false)
      getMultiLegPricePending(dispatch,false)
      getLegData(dispatch,{})
      getLegType(dispatch, false)
      getLegLevel(dispatch,0)
      getIsEdit(dispatch,false)
      getIsEditSingle(dispatch,false)
      getIsOrderClose(dispatch,false)
      getIsReorder(dispatch,false)
      getIsEditMultiple(dispatch,false)
      getIsPreviousScreen(dispatch,'')
    }
    setAccountHomeData(jsonData?.data?.data?.aircraftData[0])
    setInitialState(jsonData?.data?.data?.aircraftData[0]?.aircraftInformation,false,isMulti)
    
    if(mobileFavoriteFbo == true){
      getMobileHeaderText(dispatch,jsonData?.data?.data?.aircraftData[0]?.aircraftInformation?.fuelordersheader?.favoriteslabel)
      
      }else{
        getMobileHeaderText(dispatch,jsonData?.data?.data?.aircraftData[0]?.aircraftInformation?.fuelordersheader?.newfuelorderlabel)

      }
  },[jsonData,isMulti,mobileFavoriteFbo]) 

  const setInitialState = (jsonData,clear,isMulti) => {
    const formData = {};
    const fieldTypeArr = ['input', 'select','date','range','asynctypeahead','radio'];
    jsonData && jsonData.orderCriteriaFields.forEach((item) => {
        if (fieldTypeArr.includes(item.component.toLowerCase())) {
          if(item.name=='dateOfOrder'){
            formData[item.name] =formDataSet && formDataSet[item.name]?formDataSet[item.name]:date?date:""
          }else if(item.name=='legType'){
            formData[item.name] =isMulti && !isSummary ? 'Multiple Leg': formDataSet && formDataSet[item.name]?formDataSet[item.name]:item.defaultValue?item.defaultValue:""
          }else{
            formData[item.name] =isMulti && !isSummary && fuelInfo ? fuelInfo[item.name] && fuelInfo[item.name]: formDataSet && formDataSet[item.name]?formDataSet[item.name]:item.defaultValue?item.defaultValue:""
          } 
        }
    })
    jsonData && jsonData.filterByFields.forEach((item) => {
      if (fieldTypeArr.includes(item.component.toLowerCase())) {
          formData[item.name] =clear? item.name=='unit' ? 'Gallon': "":formDataSet && formDataSet[item.name]?formDataSet[item.name]:item.defaultValue?item.defaultValue:""
      }
  })
    setMobileuseState(true)
    setformDataSet(formData);
  }

  useEffect(()=> {
    console.log("Mobile Fuel Data",mobileFuelData, searchFuelOrderReducer)
    if(mobileFuelData.isMobile && mobileuseState) {
      console.log("formDataSet",formDataSet)
      if(mobileFuelData?.searchDetails?.searchType == 'icao') {
        setsearchType('icao')
        searchAPI((mobileFuelData?.searchDetails?.searchFuel),{name:'searchFuel'})
        // getsearchResults(mobileFuelData?.searchDetails?.searchFuel) 
        console.log(mobileFuelData?.searchDetails?.searchFuel)
        setAddress1Selected([mobileFuelData?.searchDetails?.searchFuel])
        setShowMobileResults(true)
        setformDataSet(searchFuelOrderReducer.orderDetails.data.formData)
        setsearchtypes(mobileFuelData.searchTypes)
      } else {
        setShowMobileResults(false)
      }
    }
  },[mobileFuelData,mobileuseState])


  const cleanData = (data)=>{
    let finalData=[]
    let fuelType=formDataSet && formDataSet['fuelservice']
    if(searchType=='icao' || searchType=='airportname' || searchType==''){
      data && data.map((val)=>{
        val.AiportLocations && val.AiportLocations.length && val.AiportLocations[0].FuelTypes && val.AiportLocations[0].FuelTypes.map((type)=>{
            if(fuelType && fuelType==type.Name || (type.Name.includes(fuelType) && type.Name!='Jet A+ / Prist')){
              if(finalData.length==0 || !finalData.includes(val)){
                finalData.push(val)
              }
            }
        })
      })
    }else{
      data && data.map((airport)=>{
        if(airport.FBO){
           airport.FBO.map((val)=>{
            val.AiportLocations && val.AiportLocations.length && val.AiportLocations[0].FuelTypes && val.AiportLocations[0].FuelTypes.map((type)=>{
              if(fuelType && fuelType==type.Name || (type.Name.includes(fuelType) && type.Name!='Jet A+ / Prist')){
                if(finalData.length==0 || !finalData.includes(airport)){
                  finalData.push(airport)
                }
              }
          })
          })
        }else{
          finalData.push(airport)
        }
        
    })
    }
   
    setresultData(finalData)
    setoriginalResultData(finalData)
    setbrandoption(finalData)
    setranges(finalData)
    setservices(finalData)
  }
  const setservices = (data)=>{
    let service=[]
    if(searchType=='icao' || searchType=='airportname' || searchType==''){
      data && data.map((val)=>{
        val.AiportLocations && val.AiportLocations.length && val.AiportLocations[0].Services && val.AiportLocations[0].Services.map((type)=>{
          if(!service.includes(type.Service) || service.length==0){
            service.push(type.Service)
          } 
        })
      })
      
    }else if(searchType=='city' || searchType=='state'){
      data && data.map((airport)=>{
        airport && airport.FBO && airport.FBO.map((val)=>{
          val.AiportLocations && val.AiportLocations.length && val.AiportLocations[0].Services && val.AiportLocations[0].Services.map((type)=>{
            if(!service.includes(type.Service) || service.length==0){
              service.push(type.Service)
            } 
          })
        })
      })
      
    }
    if(data){
      setaddServices(service)
    }
  }

  const setbrandoption = (data)=>{
    let opt=[]
    if(searchType=='icao' || searchType=='airportname' || searchType==''){
      data && data.map((val)=>{
        
        if(opt.length==0 || !opt.includes(val.FBOName)){
          opt.push(val.FBOName)
        }
        
      })
    }else if(searchType=='city' || searchType=='state'){
      data && data.map((airport)=>{
        airport && airport.FBO && airport.FBO.map((val)=>{
          if(opt.length==0 || !opt.includes(val.FBOName)){
            opt.push(val.FBOName)
          }
        })
      })
    }
    let arr=[]
      opt && opt.length && opt.map((val)=>{
        let obj={}
          obj.value= val && val
          obj.title= val && val
          arr.push(obj)
      })
      setbrandOptions(arr)
  }

  const setranges = (data,dataSet)=>{
    let fuelType=formDataSet && formDataSet['fuelservice'];
    let fields=dataSet?dataSet:{...formDataSet}
    let minlist=[]
    if(searchType=='icao' || searchType=='airportname' || searchType==''){
      data && data.map((val)=>{
        val.AiportLocations && val.AiportLocations.length && val.AiportLocations[0].FuelTypes && val.AiportLocations[0].FuelTypes.map((type)=>{
            if(fuelType && fuelType==type.Name){
                let min=[];
                type.Tiers && type.Tiers.map((tier)=>{
                  let price=tier.Baseprice && tier.Baseprice+tier.costplus
                  min.push(price && price)
                })
                minlist.push(Math.min(...min))
            }
        })
      })
    }else if(searchType=='city' || searchType=='state'){
      data && data.map((airport)=>{
        airport && airport.FBO && airport.FBO.map((val)=>{
          val.AiportLocations && val.AiportLocations.length && val.AiportLocations[0].FuelTypes && val.AiportLocations[0].FuelTypes.map((type)=>{
            if(fuelType && fuelType==type.Name){
                let min=[];
                type.Tiers && type.Tiers.map((tier)=>{
                  let price=tier.Baseprice && tier.Baseprice+tier.costplus
                  min.push(price && price)
                })
                minlist.push(Math.min(...min))
            }
        })
        })
      })
    }
    if(minlist.length){
      fields['priceRange']=''
      setformDataSet(fields)
      setMinRange(Math.min(...minlist))
      setMaxRange(Math.max(...minlist))
    }else{
      fields['priceRange']=''
      setformDataSet(fields)
      setMinRange(0)
      setMaxRange(0)
    }
  }
  const onHandleChange = (e,field)=>{
    let fields={...formDataSet}
    let fieldValue=e?.target?.value
    let fieldName=field.name
    if(field.name=='dateOfOrder'){
      setdate(e?.$d)
      fieldValue=e?.$d
      let selectedDate = e&&e.$d&&e.$d
      let today = new Date(minDate);
      let maxdate= new Date(maxDate);
      let invalidDate;
      today.setHours(0,0,0,0)
      if( selectedDate == "Invalid Date" || new Date(selectedDate) < today || new Date(selectedDate)> maxdate) {
        invalidDate = true;
        fieldValue= "";
      } else {
        invalidDate = false;
      }
      setinvalidDate(invalidDate)
    }
    if(fieldName=='legType'){
        if(fieldValue=='Multiple Leg'){
            setmultiLeg(true)
        }else{
            setmultiLeg(false)
        }
        fields[fieldName]= fieldValue
    }else if(fieldName == 'quantity'){
      let result = /^(?=.*\d)\d{0,5}(?:\.\d{0,2})?$/.test(e&&e.target &&e.target.value)
      if(result){
        fieldValue = e&&e.target &&e.target.value;
        fields[fieldName]= fieldValue
      }else if(fieldValue == ''){
        fields[fieldName]= fieldValue
      }
    }else{
      fields[fieldName]=fieldValue
    }
    setformDataSet(fields)
    if(field.group=='filter' && !isMobile){
      filterBy(e,field,fields)
    }

  }

  const onHandleBlur = ()=>{
    
  }

  const onClick = (e,val)=>{
    let arr=JSON.parse(JSON.stringify(checkedServices))
    let ind
    if(arr.length==0 || !arr.includes(val)){
      arr.push(val)
    }else{
      arr.map((value,i)=>{
        if(e.target.name==value){
          ind=i
        }
      })
      arr.splice(ind,1)
    }
    if(!isMobile){
      filterBy(e,{'name':'addService','value':val},arr)
    }
    setcheckedServices(arr)
  }

  const filterBy = (e,field,fields)=>{
    let filterarr=[]
    let data=[]
    if(field.name=='fboBrand'){
      data=originalResultData
      if(searchType=='icao' || searchType=='airportname' || searchType==''){
        filterarr=data && data.filter((val)=>
        val.FBOName==e.target.value
        )
      }else{
        data && data.map((airport)=>
          airport && airport.FBO && airport.FBO.map((val) => {
            if(val.FBOName==e.target.value){
              filterarr.push(airport)
            }
          })
          )
      } 
      setranges(filterarr,fields)
      setservices(filterarr)
    }else if(field.name=='priceRange'){
      let fuelType=formDataSet && formDataSet['fuelservice']
      if(formDataSet['fboBrand']=="" && checkedServices.length==0){
        data=originalResultData
      }else{
        data=resultData
      }
      if(searchType=='icao' || searchType=='airportname' || searchType==''){
        data && data.map((val)=>{
          val.AiportLocations && val.AiportLocations.length && val.AiportLocations[0].FuelTypes && val.AiportLocations[0].FuelTypes.map((type)=>{
            if(fuelType && fuelType==type.Name){
                type.Tiers && type.Tiers.map((tier)=>{
                  let price=parseFloat(tier.Baseprice && tier.Baseprice+tier.costplus)
                  if(parseFloat(minRange) <= price && price <= parseFloat(e.target.value)){
                    if(!filterarr.includes(val) || filterarr.length==0){
                      filterarr.push(val)
                    }
                  }
                })
            }
          })
        })
      }else{
        data && data.map((airport)=>{
          airport && airport.FBO && airport.FBO.map((val)=>{
            val.AiportLocations && val.AiportLocations.length && val.AiportLocations[0].FuelTypes && val.AiportLocations[0].FuelTypes.map((type)=>{
              if(fuelType && fuelType==type.Name){
                  type.Tiers && type.Tiers.map((tier)=>{
                    let price=parseFloat(tier.Baseprice && tier.Baseprice+tier.costplus)
                    if(parseFloat(minRange) <= price && price <= parseFloat(e.target.value)){
                      if(!filterarr.includes(airport) || filterarr.length==0){
                        filterarr.push(airport)
                      }
                    }
                  })
              }
            })
          })
        })
      }
      
      setbrandoption(filterarr)
      setservices(filterarr)
    }else if(field.name=='addService'){
      if(formDataSet['fboBrand']=="" && formDataSet['priceRange']==""){
        data=originalResultData
      }else{
        data=resultData
      }
      if(searchType=='icao' || searchType=='airportname' || searchType==''){
        data && data.map((val)=>{
          let services=[]
          let flag=true
          if(fields.length==0){
            filterarr.push(val)
          }else{
            val.AiportLocations && val.AiportLocations.length && val.AiportLocations[0].Services && val.AiportLocations[0].Services.map((type)=>{
              services.push(type.Service)    
            })
            fields.map((s)=>{
              if(!services.includes(s)){
                flag=false
              }
            })
            if(flag){
              if(!filterarr.includes(val) || filterarr.length==0){
                filterarr.push(val)
              }
            }
          } 
      })
      }else{
        data && data.map((airport)=>{
          if(fields.length==0){
            filterarr.push(airport)
          }else{
            let services=[]
            let flag=true
            airport && airport.FBO && airport.FBO.map((val)=>{
              val.AiportLocations && val.AiportLocations.length && val.AiportLocations[0].Services && val.AiportLocations[0].Services.map((type)=>{
                services.push(type.Service)    
              })
            })
            fields.map((s)=>{
              if(!services.includes(s)){
                flag=false
              }
            })
            if(flag){
              if(!filterarr.includes(airport) || filterarr.length==0){
                filterarr.push(airport)
              }
            }
          }
      })
      }
      
      setranges(filterarr)
      setbrandoption(filterarr)
    }
    setresultData(filterarr)
  }

  const onAfterChange = (e,item)=>{

  }

  const clearAll = ()=>{
    setcheckedServices([])
    setresultData(originalResultData)
    setbrandoption(originalResultData)
    setranges(originalResultData)
    setservices(originalResultData)
    setInitialState(accountHomeData.aircraftInformation,true)
  }

  const setmaxdate = (val)=>{
    let max=new Date(val)
    max.setDate(max.getDate()+90)
    setMaxDate(max)
  }

  const onSearchBlur = (evt,field) => {
  }

  const onOrderClick = (item, isMobile, searchDetails) => {
    setNavigatePage(false)
    setTimeout(()=>{
      let orderDetails={}
      orderDetails.fboInfo=item
      orderDetails.formData=formDataSet
      getOrderDetails(orderDetails,dispatch)
      if(isMobile) {
        let data = {
          isMobile,
          searchDetails,
          searchTypes
        }
        setMobileOrderDetails(data,dispatch)  
      }
      navigate('./order')
    },200)
  }

  const onKeyDown = (e,field) => {
    if(e.keyCode === 13){
      if(field.name=='searchFuel'){
        let list=JSON.parse(JSON.stringify(originalFuelList))
        if(list.length){
          searchHandler([list[0].Result],field)
          // setAddress1Selected([list[0].Result])
          // getsearchResults(list[0].Result)
        }else{
          setAddress1Selected([''])
        }
        
      }
    }
    
  }

  const onRequestPartner = (item,index) => {
    let data=JSON.parse(JSON.stringify(resultData));
    let ogdata=JSON.parse(JSON.stringify(originalResultData));
    if(data[index].IsRequested){
    
    }else{
      data[index].IsRequested=1
      ogdata.map((val)=>{
        if(item.fboName==val.FBOName){
          val.IsRequested=1
        }
      })
      
    }
    setresultData(data)
    setoriginalResultData(ogdata)
    let payload={
      "ICAO":item.icao,
      "FBO":item.fboName,
      "CreatedBy":loggedInUser && loggedInUser
    }
    requestPartnerFbo(payload).then((res)=>{
      
    })
  }
  const [searchTypes,setsearchtypes]=useState('')
  const onAirportClick = (item,searchTypes) => {
    let form={...formDataSet}
    form['searchFuel']=item.icao
    setformDataSet(form)
    setAddress1Selected([item.icao])
    let payload={"SearchString":item.icao,"SearchType":"ICAO","LoggedinUser":loggedInUser}
            fetchFuelResult(dispatch,payload)
            setsearchType('icao')
            clearAll()
            setsearchtypes(searchTypes)
  }

  const onFavouriteClick = (item,index) => {
    let data=JSON.parse(JSON.stringify(resultData));
    let ogdata=JSON.parse(JSON.stringify(originalResultData));
    if(data[index].IsFavourite){
      data[index].IsFavourite=0
      ogdata.map((val)=>{
        if(item.fboName==val.FBOName){
          val.IsFavourite=0
        }
      })
    }else{
      data[index].IsFavourite=1
      ogdata.map((val)=>{
        if(item.fboName==val.FBOName){
          val.IsFavourite=1
        }
      })
    }
    setresultData(data)
    setoriginalResultData(ogdata)
    let payload={
      "ICAO":item.icao,
      "FBO":item.fboName,
      "IsOperatorUser":1,
      "IsFavourite":data[index].IsFavourite,
      "CreatedBy":loggedInUser
    }
    setFavouriteFbo(payload).then((res)=>{

    })
  }

  const getsearchResults = (val)=>{
    let originalList=[...originalFuelList]
    let resultType;
    originalList && originalList.map((value)=>{
        if(value.Result==val){
            resultType=value.ResultType
        }
    })
    if(resultType=='ICAO'){
      val=val.substring(0,4)
    }
    let payload={"SearchString":val,
                  "SearchType":resultType,
                  "LoggedinUser":loggedInUser
                }
            fetchFuelResult(dispatch,payload)
            setsearchType(resultType.toLowerCase())
            setsearchType2(resultType.toLowerCase())
            clearAll()
  }

  const handleFocus = () => {
    // setAddress1Selected(['']);
  }
  const searchHandler = (items,field) => {
    let fieldName=field.name
    try {
    let formData = {...formDataSet};
    formData[fieldName]= items && items.length ?items[0] :items
    if(fieldName=='searchFuel'){
        setAddress1Selected(items)
        setFuelLocationError(false)
        originalFuelList.map((val)=>{
          if(items[0]==val.Result){
            getsearchResults(items[0])
          }
        })
        setresults(items)
    }else if(fieldName=='tailNumber'){
        settailSelected(items)
        settailResults(items)
    }
    setformDataSet(formData);
    } catch( err ) {
        console.error(' unexpected error caught in  search')
    }
}

  const searchAPI =(e,item)=>{
    let fields={...formDataSet}
    let fieldName=item.name
    let payload={}
    
    if(item.name=='searchFuel'){
        setAddress1Loading(true)
        if(e?.length<4){
          setsearchType2('')
        }
        if(searchType2=='icao'){
          e=e.substring(0,4)
        }
      payload ={"SearchString":e && e,"SearchType":"All","LoggedinUser":loggedInUser}
      fetchFuelLocations(dispatch,payload).then((res)=>{
        let data = res && res.length && res[0].length && res[0][0]['JSON_UNQUOTE(@JSONResponse)']?JSON.parse(res[0][0]['JSON_UNQUOTE(@JSONResponse)']):[];
        let list=[]
        let originalList=[]
        data && data.map((val)=>{
          list.push(val.Result)
          originalList.push(val)
        })
        setresults(list)
        setoriginalFuelList(originalList)
        setAddress1Loading(false)
      })
    }else if(item.name=='tailNumber'){
        settailLoading(true)
      payload ={"Operator":company,"IsRequestedFor":"OrderManagement","TailNumber":e && e}
      getTailNumbersList(payload,dispatch).then((res)=>{
        let tailNumbersList = [];
        let data = res && res.length && res[0].length?JSON.parse(res[0][0]['@JSONResponse']):[];
        if(data.length>0){
          data.map((i) =>{
            tailNumbersList.push(i.TailNumbers);
          })
        }
          settailResults(tailNumbersList);
          settailLoading(false)
        })
    }
    fields[fieldName]=e && e
    // setformDataSet(fields)
  }

  const applyFilter=()=>{
    filterMobile()
  }
  const getModal = () => {
    // let data = fieldList.length && fieldList[0].sections && fieldList[0].sections.modal.filter((d) => d.name === modalName);
    return (
      <div>
        <SearchFuelHome
                isMobile={true}
                searchType={searchType}
                onHandleChange={onHandleChange}
                onHandleBlur={onHandleBlur}
                formDataSet={formDataSet}
                onAfterChange={onAfterChange}
                onClick={onClick}
                clearAll={clearAll}
                brandOptions={brandOptions}
                minRange={minRange? minRange:0}
                maxRange={maxRange? maxRange:99999}
                addServices={addServices}
                checkedServices={checkedServices}
                userType={loggedInUserType}
                applyFilter={applyFilter}
            />
      </div>
    )
  }

  const filterMobile = ()=>{
    let filterarr=[]
    let data=originalResultData
    let form={...formDataSet}
    form['bfPrice']=form?.quantity;
    let flagt=false;
    if(form['fboBrand']){
      if(searchType=='icao' || searchType=='airportname' || searchType==''){
        filterarr=data && data.filter((val)=>
        val.FBOName==form['fboBrand']
        )
      }else{
        data && data.map((airport)=>
          airport && airport.FBO && airport.FBO.map((val) => {
            if(val.FBOName==form['fboBrand']){
              filterarr.push(airport)
            }
          })
          )
      }
      flagt=true;
    }
    if(form['priceRange']){
      let fuelType=formDataSet && formDataSet['fuelservice']
      let subArray=[]
      if(filterarr.length==0 && !flagt){
        data=originalResultData
      }else{
        data=filterarr
      }
      if(searchType=='icao' || searchType=='airportname' || searchType==''){
        data && data.map((val)=>{
          val.AiportLocations && val.AiportLocations.length && val.AiportLocations[0].FuelTypes && val.AiportLocations[0].FuelTypes.map((type)=>{
            if(fuelType && fuelType==type.Name){
                type.Tiers && type.Tiers.map((tier)=>{
                  let price=parseFloat(tier.Baseprice && tier.Baseprice+tier.costplus)
                  if(parseFloat(minRange) <= price && price <= parseFloat(form['priceRange'])){
                    if(!subArray.includes(val) || subArray.length==0){
                      subArray.push(val)
                    }
                  }
                })
            }
          })
        })
      }else{
        data && data.map((airport)=>{
          airport && airport.FBO && airport.FBO.map((val)=>{
            val.AiportLocations && val.AiportLocations.length && val.AiportLocations[0].FuelTypes && val.AiportLocations[0].FuelTypes.map((type)=>{
              if(fuelType && fuelType==type.Name){
                  type.Tiers && type.Tiers.map((tier)=>{
                    let price=parseFloat(tier.Baseprice && tier.Baseprice+tier.costplus)
                    if(parseFloat(minRange) <= price && price <= parseFloat(form['priceRange'])){
                      if(!subArray.includes(airport) || subArray.length==0){
                        subArray.push(airport)
                      }
                    }
                  })
              }
            })
          })
        })
      }
      filterarr=subArray;
      flagt=true;
    }
    if(checkedServices.length){
      let subArray=[]
      if(filterarr.length==0 && !flagt){
        data=originalResultData
      }else{
        data=filterarr
      }
      if(searchType=='icao' || searchType=='airportname' || searchType==''){
        data && data.map((val)=>{
          let services=[]
          let flag=true
          val.AiportLocations && val.AiportLocations.length && val.AiportLocations[0].Services && val.AiportLocations[0].Services.map((type)=>{
            services.push(type.Service)    
          })
          checkedServices.map((s)=>{
            if(!services.includes(s)){
              flag=false
            }
          })
          if(flag){
            if(!subArray.includes(val) || subArray.length==0){
              subArray.push(val)
            }
          }
      })
      }else{
        data && data.map((airport)=>{
          let services=[]
          let flag=true
          airport && airport.FBO && airport.FBO.map((val)=>{
            val.AiportLocations && val.AiportLocations.length && val.AiportLocations[0].Services && val.AiportLocations[0].Services.map((type)=>{
              services.push(type.Service)    
            })
          })
          checkedServices.map((s)=>{
            if(!services.includes(s)){
              flag=false
            }
          })
          if(flag){
            if(!subArray.includes(airport) || subArray.length==0){
              subArray.push(airport)
            }
          }
      })
      }
      filterarr=subArray;
      flagt=true
    }
    if(!flagt){
        filterarr=originalResultData;
    }
    if(form['sortFboBy'] && filterarr.length){
      filterarr=sortFbo(form['sortFboBy'],filterarr,form['quantity'])
    }
    setformDataSet(form)
    setresultData(filterarr)
    
    setModalShow(false)
    document.getElementById('root').style.filter = 'none';
  }
  const mobileFilter = () =>{
    setIsMobile(true)
    setModalShow(true)
    document.getElementById('root').style.filter = 'blur(5px)';
  }
  const closeModal = () =>{
    setModalShow(false)
    document.getElementById('root').style.filter = 'none';
  }  
  const ValidateFuelLocation = () => {
    setsearchtypes(searchType)
    if(address1Selected.length == 0) {
       setFuelLocationError(true) 
      }
    else { 
      if(formDataSet.legType == "Multiple Leg") {
        getMobileHeaderText(dispatch, "Leg " + legNumber)
      }
      setFuelLocationError(false); 
      setShowMobileResults(true);
      if(searchType == '') {
        setsearchType('icao')
      }
    }
  }
  const viewSummary=()=>{
    setNavigatePage(false)
    setTimeout(()=>{
      getIsMultiSummary(dispatch,true)
      getIsEdit(dispatch,true)
      getEditLegData(dispatch,mdata)
      getMultipleLeg(dispatch,true)
      getLegLevel(dispatch,legNumber-1)
      navigate('./order')
    },200)
  }

  const HandleBack = (a,b,c) => {
    if(a == 'fboResult') {
      if(searchTypes == 'city' || searchTypes == 'state') {
        setsearchType(searchTypes)
        searchAPI(b,{name:'searchFuel'})
        getsearchResults(b)   
      } else {
        setsearchType('')
        setAddress1Selected([b])
        setShowMobileResults(false)
        getMobileHeaderText(dispatch,jsonData?.data?.data?.aircraftData[0]?.aircraftInformation?.fuelordersheader?.newfuelorderlabel)
      }
    } else {  
      setAddress1Selected([b])
      setShowMobileResults(false)
    }
  }

  const confirmNavigating = (confirm)=>{
    confirm()
    document.getElementById('root').style.filter = 'none'
  }

  const allowRouting = ()=>{
    let flag = false;
    if(isMulti && !isSummary && navigatePage){
      flag=true;
    }
    return flag
  }

  return (
    <div className='bf-account-home-container w100i bf-search-fuel-order-container '>
      {accountHomeData && <div className='bf-account-home'>
        <div className='bf-home-company-name bf-search-result-name'>New Fuel Order {multiLeg ? `- Leg ${legNumber.toString()}` : ''}</div>
        {isMulti && !isSummary ? <div className='bf-push-right'>
          Arriving From {multiIcao} - <a href='javascript:void(0);' className='' onClick={()=>viewSummary()}>View Current Trip</a>
        </div> : ""}
        <div className={`d-flex d-flex-row w100 bf-fuel-searh-section ${showMobileResults ? 'bf-show-mobile-results' : ''} ${ mobileFavoriteFbo  ? 'bf-favorite-mobile-fbo' : ''}`}>   
            <SearchFuelHome
                searchType={searchType}
                onHandleChange={onHandleChange}
                onHandleBlur={onHandleBlur}
                searchAPI={searchAPI}
                address1Selected={address1Selected}
                tailSelected={tailSelected}
                tailResults={tailResults}
                onSearchBlur={onSearchBlur}
                typeaheadRef={typeaheadRef}
                formDataSet={formDataSet}
                isAddress1Loading={isAddress1Loading}
                tailLoading={tailLoading}
                date={date}
                minDate={minDate}
                maxDate={maxDate}
                results={results}
                onKeyDown={onKeyDown}
                searchHandler={searchHandler}
                handleFocus={handleFocus}
                onAfterChange={onAfterChange}
                onClick={onClick}
                clearAll={clearAll}
                ValidateFuelLocation={ValidateFuelLocation}
                fuelLocationError = {fuelLocationError}
                brandOptions={brandOptions}
                minRange={minRange? minRange:0}
                maxRange={maxRange? maxRange:99999}
                addServices={addServices}
                checkedServices={checkedServices}
                radioDisable={radioDisable}
                userType={loggedInUserType}
                invalidDate={invalidDate}
                isMulti={isMulti}
                isSummary={isSummary}
                viewSummary = {viewSummary}
            />   
            <div className='bf-show-mobile-preffered-fbos'>
              <PrefferedFbo
                resultData={preferredFboData}
                onOrderClick={onOrderClick}
                formDataSet={formDataSet}
              />
            </div>
            <FuelResultPage
                mobileFilter={mobileFilter}
                searchType={searchType}
                formDataSet={formDataSet}
                onAirportClick={onAirportClick}
                onFavouriteClick={onFavouriteClick}
                onRequestPartner={onRequestPartner}
                onOrderClick={onOrderClick}
                resultData={resultData}
                handleBack={HandleBack}
                isMulti={isMulti}
                isSummary={isSummary}
                viewSummary = {viewSummary}
            />
        </div>
      </div> }
      {modalShow ? <CustomProfileModal
        show={modalShow}
        onHide={() => closeModal()}
        hide={() => closeModal()}
        title={''}
        size={"md"}
        modalClass={"bf-filters-modal"}
        modelBodyContent={getModal()}
      /> : ""}
      <ReactRouterPrompt when={allowRouting()}>
                {({ isActive, onConfirm, onCancel }) => (
                    <>
                   <CustomModal
                    show={isActive}
                    isPrompt = {isActive}
                    onHide={() => confirmNavigating(onConfirm)}
                    close={()=>{
                        document.getElementById('root').style.filter = 'none';onCancel()}}
                    hide={()=>{
                        document.getElementById('root').style.filter = 'none';onCancel()}}
                    classStyles={"bf-mrgtb20"}
                    modalId={"bf-place-order"}
                    modelBodyContent={"Wait! All Order Progress Will Be Lost, Are You Sure You Want To Proceed? "}
                    buttonText={"Yes"}
                    secondbutton={"Cancel"}
                />
                </>
                )}
            </ReactRouterPrompt>
    </div>
  )
}
