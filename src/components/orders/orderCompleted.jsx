import React, { useState,useEffect,useRef } from 'react';
/* import Input from '../input/input';
import Select from '../select/select';
import Radio from '../radio/radio'; */
import { bfaJsonService } from '../../actions/BFAServices/BFAJsonService';
/* import ButtonComponent from '../button/button';
import MultiSelectCheckbox from '../multiSelect/multiSelectCheckbox'; */
//import * as xlsx from "xlsx";
import { useLocation, useNavigate } from 'react-router-dom';
import BFTable from '../table/table'
import Loader from '../loader/loader';
import CustomModal from '../customModal/customModal';
import ButtonComponent from '../button/button';
import EditFormModal from '../customModal/editModal';
import { getFieldIsValid, getFormatedAmount, getFormattedMMDDYY, phoneValidation } from '../../controls/validations';
import { adminAddUserSave } from "../../actions/adminAddUserService/adminAddUserService";
import {AdminAddUser} from "../admin/adminAddUser";
import  {AdminSignupForm} from "../admin/adminSignupForm";
import { getAccessLevel } from '../../controls/commanAccessLevel';
import { useDispatch, useSelector } from 'react-redux';
import { getCompletedOrderData, getIsMaxDate, getIsMinDate, getJSONData, getOrderMultiRowData, getOrderRowData } from '../../actions/orderActions/orderCompletedAction';
import { filterOrderTable,filterOrderTableByDate, sortOrder } from './orderFilter';
import { getIsReorder, getLegLevel, getLegType, getMultipleLeg } from '../../actions/orderPlacementActions/orderPlacementActions';
import { getEditLegData, getIsEdit } from '../../actions/orderPlacementActions/multiLegActions';
import { prevScreen } from '../../actions/orderActions/disputeAction';
function OrderCompleted() {
    let {state} = useLocation()
    const [fieldList, setFieldList] = useState(null);
    const [rows, setRows] = useState([]);
    const [mobileRows,setMobileRows] = useState([])
    const [originalRows, setoriginalRows] = useState([]);
    const [path, setpath] = useState();
    const dispatch = useDispatch()
    const commonReducer = useSelector((state) => state.commonReducer);
    const loggedInUser = commonReducer?.loggedInUser?.data
    const loggedInUserType = commonReducer?.loggedInUserType?.data
    const company = commonReducer?.loggedInCompany?.data
    const orderCompletedReducer = useSelector((state) => state.orderCompletedReducer);
    const activeOrderReducer = useSelector((state) => state.activeOrderReducer);
    const orderDates = activeOrderReducer?.orderDates?.data;
    const searchValue = orderCompletedReducer?.searchValue?.data;
    const loader = orderCompletedReducer?.loading;
    const jsonData = orderCompletedReducer?.orderCompletedJson?.data?.data?.orderCompletedData;
    const orderCompletedData =  orderCompletedReducer?.orderCompletedData?.data;
    const mobileCells = jsonData && jsonData.length && jsonData[0].mobileHeadCells;
    const cells = jsonData && jsonData.length && jsonData[0].headCells && jsonData[0].headCells.filter((m)=>
		  m?.users?.includes(loggedInUserType.toLowerCase()))
    let paylod = { 'blobname': 'orderCompleted.json' }
    let navigate = useNavigate();
    let completedPayload = {
      "Organization": company,
      "OrderType":"Completed",
      "Loggedinuser":loggedInUser,
      "role":loggedInUserType
    }
    
    function createData(orderId,date, location,fbo,operator,aircraft,actualPrice,status, buttons,isMulti) {
      buttons=jsonData && jsonData.length && jsonData[0].Buttons
      let mobButtons=jsonData && jsonData.length && jsonData[0].mobileButtons
      let obj={
        "orderId":orderId,
        "date":getFormattedMMDDYY(date),
        "location":isMulti ? location : [location]
      }
      if(loggedInUserType.toLowerCase()=='fbo'){
        obj.operator=operator;
        obj.aircraft=aircraft;
        obj.actualPrice=`$${actualPrice}`;
      }else if(loggedInUserType.toLowerCase()=='operator'){
        obj.fbo=isMulti ? fbo : [fbo];
        obj.aircraft=aircraft;
        obj.actualPrice=`$${actualPrice}`;
      }else{
        obj.fbo=isMulti ? fbo : [fbo];
        obj.operator=operator;
      }
      obj.status=isMulti ? status : [status]
      if(isMulti){
        obj.Buttons=buttons && buttons.filter((f)=>f?.users?.includes("isMulti"))
        obj.MobileButtons=mobButtons && mobButtons.filter((f)=>f?.users?.includes("isMulti"))
      }else{
        obj.Buttons=buttons && buttons.filter((f)=>f?.users?.includes(loggedInUserType.toLowerCase()))
        obj.MobileButtons=mobButtons && mobButtons.filter((f)=>f?.users?.includes(loggedInUserType.toLowerCase()))
      }
      
      return obj
    }

    function createMobileData(orderId,date,isMulti) {
      let obj={
        "orderId":orderId,
        "date":getFormattedMMDDYY(date),
        "mobileButton":true
      }
      return obj
    }
    
    useEffect(() => {
      getJSONData(dispatch,paylod)
      getCompletedOrderData(dispatch,completedPayload)
      prevScreen(null,dispatch)
  }, []);

  useEffect(()=>{
    let data=jsonData && jsonData.length && jsonData[0]
    setFieldList(data)
    let res=orderCompletedData
    res = res && res.length && res[0].length && res[0][0]['JSON_UNQUOTE(@JSONResponse)']?JSON.parse(res[0][0]['JSON_UNQUOTE(@JSONResponse)']):[];
    //console.log(res)
    res=sortOrder(res)
    create(res)
    getPath()
    setoriginalRows(res)  
  },[jsonData,orderCompletedData])

  const getPath= () =>{
    let windowpath = window.location.pathname.toString()
    windowpath = windowpath.split("/")
    windowpath.splice(-2)
    windowpath.splice(1,1)
    let currpath=""
    windowpath.map((e)=>{
      currpath = currpath+e+'/'
    })
    setpath(currpath)
  }

  const create = (data) =>{
    let orderData=[]
    let mobileOrderData=[]
    jsonData && jsonData.length && jsonData[0] && data  && data.map((item,index)=>{
      if(item.IsMultiLeg=='true' && loggedInUserType.toLowerCase()!=='fbo' && item.MultiOrderCompleted){
        let fbo=[]
        let icao=[]
        let status=[]
          item?.OrderLegs?.map((val)=>{
            if(fbo.length==0 || !fbo.includes(camelize(val?.FBO))){
              fbo.push(camelize(val?.FBO))
            }
            if(icao.length==0 || !icao.includes(val?.ICAO?.toUpperCase())){
              icao.push(val?.ICAO?.toUpperCase())
            }
            if(status.length==0 || !status.includes(val?.OrderStatus)){
              status.push(val?.OrderStatus)
            }
          })
        orderData.push(createData(item.OrderNumber,item.OrderDate, icao, fbo,item.OperatorName, item.OrderLegs[0].TailNumber,getFormatedAmount(item.OrderFinalPrice?.toFixed(2)),status,data.Buttons,true))
        mobileOrderData.push(createMobileData(item.OrderNumber,item.OrderDate,true))
        item.OrderLegs && item.OrderLegs.forEach(order=>{
          orderData.push(createData(order.OrderNumber,order.Date, order.ICAO, camelize(order.FBO),item.OperatorName, order.TailNumber,getFormatedAmount(order.FinalPrice?.toFixed(2)),order.OrderStatus,data.Buttons))  
          mobileOrderData.push(createMobileData(order.OrderNumber,order.Date))  
        })
      }else{
        item?.OrderLegs?.map((order)=>{
          orderData.push(createData(order.OrderNumber,order.Date, order.ICAO, camelize(order.FBO),item.OperatorName, order.TailNumber,getFormatedAmount(order.FinalPrice?.toFixed(2)),order.OrderStatus,data.Buttons))
          mobileOrderData.push(createMobileData(order.OrderNumber,order.Date))  
        })
      }   
    })
    setRows(orderData)
    setMobileRows(mobileOrderData)
  }

  const camelize = (str) => {
    if(str !== undefined && str!== null){
    let string = str.toLowerCase();
    const arr = string.split(" ");
    for (var i = 0; i < arr.length; i++) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  
  }
    return arr.join(" ");
  }
  }

  useEffect(()=>{
    let filter=filterOrderTableByDate(orderDates,originalRows,false,loggedInUserType,'completed')
    create(filter)
  },[orderDates,originalRows])

  useEffect(()=>{
    let filter=filterOrderTable(searchValue,originalRows)
    create(filter)
    setMinMaxDate(originalRows)
  },[searchValue,originalRows])
  
  const setMinMaxDate = (data)=>{
    let dates=[];
    data && data.length && data.map((order)=>{
      let legs= order.OrderLegs
      legs && legs.length && legs.map((val)=>{
        if(val?.Date){
          dates.push(val.Date)
        }
      })
    })

    dates.length && dates.sort((a,b)=>{
      return new Date(getFormattedMMDDYY(a)) - new Date(getFormattedMMDDYY(b))
    })

    getIsMinDate(dates[0],dispatch)
    getIsMaxDate(dates[dates?.length-1],dispatch)
  }

  const buttonClick = (row,payload,button) => {
    let selectedRow;
    selectedRow=getrow(row)
    if(button.name=='view'){
      if(selectedRow.sel.IsMultiLeg=='true' && loggedInUserType.toLowerCase()!=='fbo' && !selectedRow.ind && selectedRow.ind!==0){
        getOrderMultiRowData(selectedRow.sel,dispatch)
        navigate('/dashboard/fuelorder/viewMultiOrder')
      }else{
        let newRow=selectedRow.sel;
        let arr=[];
        arr.push(selectedRow.sel.OrderLegs[selectedRow.ind])
        newRow.OrderLegs=arr;
        getOrderRowData(newRow,dispatch)
        navigate('/dashboard/fuelorder/viewOrder')
      }
    }else if(button.name=='reorder'){
      getIsReorder(dispatch,true)
      getEditLegData(dispatch,selectedRow.sel.OrderLegs[selectedRow.ind])
      getLegType(dispatch,false)
      getMultipleLeg(dispatch,false)
      getLegLevel(dispatch,0)
      navigate('/dashboard/fuelorder/order')
    }
  }

  const getrow=(row)=>{
    let sel;
    let i;
    originalRows && originalRows?.map((ogrows)=>{
      if(ogrows.IsMultiLeg=='true' && loggedInUserType.toLowerCase()!=='fbo' && row.orderId==ogrows.OrderNumber){
        sel=ogrows;
      }else{
        ogrows?.OrderLegs?.map((order,index)=>{
          if(row.orderId==order.OrderNumber){
            sel=ogrows;
            i=index;
          }
        })
      }  
    })
    return {"sel":sel,"ind":i};
  }

  const onRowClick = (e,row)=>{
    let selectedRow;
    selectedRow=getrow(row)
    if(selectedRow.sel.IsMultiLeg=='true' && loggedInUserType.toLowerCase()!=='fbo' && !selectedRow.ind && selectedRow.ind!==0){
      getOrderMultiRowData(selectedRow.sel,dispatch)
      navigate('/dashboard/fuelorder/viewMultiOrder')
    }else{
      let newRow=selectedRow.sel;
      let arr=[];
      arr.push(selectedRow.sel.OrderLegs[selectedRow.ind])
      newRow.OrderLegs=arr;
      getOrderRowData(newRow,dispatch)
      navigate('/dashboard/fuelorder/viewOrder')
    }
    
  }
   return (<>
  {fieldList && 
    <div className={`bf-table-container bf-table-completed-container bf-table-search-results bf-activeorder-table-container ${loggedInUserType.toLowerCase()== 'operator' ? 'bf-operator-completedorder-table-container' :  loggedInUserType.toLowerCase()== 'fbo' ? 'bf-fbo-completedorder-table-container' : 'bf-internal-completedorder-table-container'}`}>
      <BFTable 
      sortEnabled = {true}
      Data ={rows} 
      heading={cells && cells}
      loading={loader && loader}
      onClick={buttonClick}
      rowClick={onRowClick}
      >
      </BFTable>
      <BFTable 
            sortEnabled = {false} 
            searchEnabled={false} 
            Data ={mobileRows && mobileRows} 
            heading={mobileCells && mobileCells}
            onClick={buttonClick}
            isUserMobileTab = {true}
            isMobileTable = {true}
            viewLabels = {cells && cells}
            viewData = {rows && rows} 
            // jsonData = {jsonData}
            viewLabel = {jsonData && jsonData.length && jsonData[0]?.mobileViewHeader}
        >
        </BFTable>
    </div>
    }
    </>);
  }
export default OrderCompleted;