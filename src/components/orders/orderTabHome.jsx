import React, { useState, useEffect } from 'react';
import { Nav } from 'react-bootstrap';
import { IoIosSearch } from 'react-icons/io';
import { Outlet,useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { bfaJsonService } from '../../actions/BFAServices/BFAJsonService';
import { getIsMaxDate, getIsMinDate, getIsResolveDispute, getOrderTab, getSearchValue } from '../../actions/orderActions/orderCompletedAction';
import { fetchActiveOrder, getOrderDates } from '../../actions/orderActions/activeOrderAction';
import Loader from '../loader/loader';
import './dispute.scss'
import DatePicker from '../datePicker/datePicker';
import { getFormattedMMDDYY } from '../../controls/validations';
import ButtonComponent from '../button/button';
import { fetchDisputeOrder } from '../../actions/orderActions/disputeOrderAction';
import { getIsEditMultiple, getIsEditSingle, getIsMultiSummary, getIsOrderAccept, getIsOrderClose, getIsPreviousScreen, getIsPricePending, getIsReorder, getIsSummary, getLegData, getLegLevel, getLegType, getMultiLegPricePending, getMultipleLeg } from '../../actions/orderPlacementActions/orderPlacementActions';
import { invoiceScreen, prevScreen } from '../../actions/orderActions/disputeAction';
import { getClickViewOrder } from '../../actions/orderPlacementActions/orderViewHomeActions';
import { getEditLegData, getIsEdit } from '../../actions/orderPlacementActions/multiLegActions';
import Select from '../select/select';
import { getMobileHeaderText } from '../../actions/commonActions/commonActions';

export default function OrderTabHome() {
    const [orderTab, setOrderTab] = useState("");
    const [searchValue, setsearchValue] = useState("");
    const [orderJson , setOrderJson] = useState(null);
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')
    const [isBusy, setBusy] = useState(true)
    const [openDisp,setOpenDisp] = useState(0)
    const [pendingOrder,setPendingOrder] = useState(0)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loginReducer = useSelector(state => state.loginReducer);
    const orderCompletedReducer = useSelector((state) => state.orderCompletedReducer);
    const selectedTab = orderCompletedReducer?.selectedTabOrder?.data;
    const isMinDate = orderCompletedReducer?.isMinDate?.data;
    const isMaxDate = orderCompletedReducer?.isMaxDate?.data;
    const params = {"blobname":"orderHome.json"}
    const loginDetails = loginReducer && loginReducer.loginDetails &&loginReducer.loginDetails.data;
    let loginDetls =  JSON.stringify(loginDetails) === '{}'?{}:JSON.parse(loginDetails);
    let userType = loginDetls.userType?loginDetls.userType:'';
    let userEmail = loginDetls.loginUserName?loginDetls.loginUserName:'';
    //const orgName = loginDetls.organizationName?loginDetls.organizationName:'';
    const commonReducer = useSelector((state) => state.commonReducer);
    const orgName =  commonReducer?.loggedInCompany?.data;

    let payload = {
      "role":userType == "Barrel Fuel" ? "BFUser" : userType,
      "Loggedinuser":userEmail
    }
    let activePayload = {
      "Organization": orgName,
      "OrderType":"Active",
      "Loggedinuser":userEmail,
      "role":userType
    }

    useEffect(() => {
        bfaJsonService(params).then(response=>{
            setOrderJson(response.data)
            setOrderTab(selectedTab)
            setBusy(false)
            getMobileHeaderText(dispatch, (selectedTab == 'active' ? "Active" : selectedTab == 'dispute' ? "Disputes" : 'Completed'))
        })
      },[selectedTab]);
      useEffect(()=>{
        prevScreen('',dispatch)
        getIsOrderAccept(dispatch,false)
        getIsPreviousScreen(dispatch,'')
        getClickViewOrder(dispatch,false)
        invoiceScreen(false,dispatch)
        getIsResolveDispute(false,dispatch)
        getMultipleLeg(dispatch, false)
        getIsPricePending(dispatch,false)
        getMultiLegPricePending(dispatch,false)
        getLegData(dispatch,{})
        getLegType(dispatch, false)
        getLegLevel(dispatch,0)
        getIsEdit(dispatch,false);
        getIsReorder(dispatch,false)
        getIsEditSingle(dispatch,false)
        getIsOrderClose(dispatch,false)
        getIsEditMultiple(dispatch,false)
        getEditLegData(dispatch,{})
        getIsSummary(dispatch,false)
        getIsMultiSummary(dispatch,false)
        navigate(`./${orderTab}`)
      },[orderTab]) 
      useEffect(()=>{
        getSearchValue("",dispatch)
        getIsMinDate('',dispatch)
        getIsMaxDate('',dispatch)
        fetchDisputeOrder(dispatch,payload).then(res=>{
          let num = 0
          let data = res && res.length && res[0].length && res[0][0]['JSON_UNQUOTE(@JSONResponse)']?JSON.parse(res[0][0]['JSON_UNQUOTE(@JSONResponse)']):[];
          data &&data.length&& data.forEach((item)=>{
            if(item.Status == "Open"||item.Status == "Reopen"||item.Status == "Escalated"){num++}
          }) 
          setOpenDisp(num)
        })
        fetchActiveOrder(dispatch,activePayload).then(res=>{
          let pending=0
          let data = res && res.length && res[0].length && res[0][0]['JSON_UNQUOTE(@JSONResponse)']?JSON.parse(res[0][0]['JSON_UNQUOTE(@JSONResponse)']):[];
          data && data.length && data.map((order)=>{
            order?.OrderLegs?.map((val)=>{
              if(val.OrderStatus=='Pending' && userType.toLowerCase()=='operator'){
                pending++;
              }else if(val.OrderStatus=='Escalated' && userType.toLowerCase()=='fbo'){
                pending++;
              }else if((val.OrderStatus=='Escalated' || val.OrderStatus=='Pending') && userType.toLowerCase()=='barrel fuel'){
                pending++;
              }
            })
          })
          setPendingOrder(pending)
        })
      },[]) 
      const getAccountTabName = (tab) => {
        getOrderTab(tab,dispatch)
        setOrderTab(tab)
         setFromDate("")
         setToDate("")
      }
      const getAccountTab = (e) => {
        orderJson.tabs.map((tab) => {
          if(tab.name == e.target.value) {
            getAccountTabName(tab.name)
          }
        })
      }
      const getMobileOptions = ()=>{
        let options = []
        orderJson.tabs.map((tab) => (
          // <option value={tab.name}>{tab.title}</option>
          options.push({
            title:tab.title,
            value:tab.name
          })
        ))
        return options
      }

const getheadcount = (tabname) =>{
if(tabname == "Disputes"){
  return(<div>
          {tabname} <span className={openDisp ? `bf-notif-number` : ""}>{openDisp ? openDisp : ""}</span>
        </div>)
}else if(tabname == "Active"){
  return(<div>
          {tabname} <span className={pendingOrder ? `bf-notif-number` : ""}>{pendingOrder ? pendingOrder : ""}</span>
        </div>
  )
}else{
  return tabname
}
}
      const getTabs = () => {
        return (
          <div className='bf-tabs-container bf-mrgt20'>
            {orderJson &&  orderJson ?
              <>
                {orderJson.tabs.map((tab) => (
    
                  <Nav variant="tabs" className='bf-tabs' >
                    <Nav.Item>
                      <Nav.Link className={orderTab == tab.name ? "bf-active-tab" : ''} onClick={() => { getAccountTabName(tab.name) }}>{getheadcount(tab.title)}</Nav.Link>
                    </Nav.Item>
                  </Nav>
                ))}
              </> : null}
          </div>
        )
      }

      const getMobileDropDown = () => {
        return (
          <div className='bf-show-mobile d-flex d-flex-column bf-mrgb10 bf-mobile-tabs-dropdown bf-mobile-pad'>
            {orderJson &&  orderJson ?
              <>
                <Select className='bf-select-component' Label= {"Select View"} formDataSet = {selectedTab} handleChange={(e) => getAccountTab(e)} Options= {getMobileOptions()}/>
              </>: null
            }
          </div>
    
        )
      }

      const handleSearchChange = (e) => {
        setsearchValue(e.target.value)
        getSearchValue(e.target.value,dispatch)

      }
      const onDateChange = (e,item)=>{
        if(e !=null){
          if(item.name=="fromDate"){
            let date = new Date(getFormattedMMDDYY(e&&e.$d&&e.$d))
            setFromDate(date)
            getOrderDates({'orderDates':{orderFromDate:date,orderToDate:toDate}},dispatch)
          }else if(item.name=="toDate"){
            let date = new Date(getFormattedMMDDYY(e&&e.$d&&e.$d))
            setToDate(date)
            getOrderDates({'orderDates':{orderFromDate:fromDate,orderToDate:date}},dispatch)
          }
        }
      }

      const getDateFields =(item)=>{
        return item&&item.length&&item.map((ele)=>{
           switch (ele.component.toUpperCase()){
             case "DATE":
               return (
               <div className={'date-flds'}>
                  <DatePicker
                       colWidth={ele.styles ? ele.styles.colWidth : ""}
                       styles = {ele.styles}
                       Name={ele.name}
                       Label={ele.label}
                       placeholder={ele.placeholder}
                       handleChange = {(e)=>onDateChange(e,ele)}
                       value={ele.name == 'toDate'? toDate:ele.name == 'fromDate'? fromDate:""}
                       MinDate={fromDate !=='' && toDate=='' ? ele.name == 'toDate'? fromDate : isMinDate  : isMinDate}
                       MaxDate={toDate !=='' && fromDate=='' ? ele.name == 'fromDate'? toDate : isMaxDate : isMaxDate}
                   />
                 </div>
               )
             }
         })
       }
      const onRestClick = (e,ietm)=>{
         setFromDate("")
         setToDate("")
         getOrderDates({'orderDates':{orderFromDate:"",orderToDate:""}},dispatch)
      }
      const getResetButton = (item) =>{
        switch(item.type.toUpperCase()) {
          case "BUTTON":
           return (<ButtonComponent      
                   Label={item.label} 
                   Type={item.type} 
                   className={item.styles.className}
                   variant={item.variant}
                   handleClick={(e)=>onRestClick(e,item)}/>)
           };
      }
      return (<>
        {isBusy ? (
          (<Loader/>)
        ) : ( 
          <div className='bf-account-home-container'>
            <div className='bf-account-home bf-orders-home'>
             <div className='bf-userBar'>
             {getMobileDropDown()}
              <div className="search" >
                <IoIosSearch className='search-icon' />
                <input
                  type={orderJson.search.type}
                  name={orderJson.search.name}
                  placeholder={orderJson.search.placeholder}
                  className={"search-input form-control"}
                  value={searchValue}
                  onChange={(e) =>{handleSearchChange(e) }}
                />
              </div>
              </div>
              {getTabs()}
              <div className={`tab-details-container bf-relative`}>
                <div className={`bf-tabs-calender-filter ${userType.toLowerCase()=='fbo' ? 'bf-fbo-details-calender' : ''}`}>
                  <div className='bf-relative'>
                    <div className={'reset-button'}>{orderJson&&orderJson?.resetBttton?getResetButton(orderJson?.resetBttton):''}</div>
                    <div className={`${orderJson && orderJson?.dateFields ? 'bf-calender-container': ''} `}>
                      {orderJson&&orderJson?.dateFields ? getDateFields(orderJson?.dateFields) : ''}
                    </div>
                  </div>
                </div>
                <Outlet/>
              </div>
          </div>
          </div>
              )}        
          
          
          
          
      </>
    
    );
}