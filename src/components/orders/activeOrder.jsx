import { getPath } from '@mui/system';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import uuid from 'react-uuid';
import { bfaJsonService } from '../../actions/BFAServices/BFAJsonService';
import { fetchActiveOrder, getActiveJSONData } from '../../actions/orderActions/activeOrderAction';
import { cancelDeclineOrder } from '../../actions/orderActions/activeOrderService';
import { getIsMaxDate, getIsMinDate, getOrderMultiRowData, getOrderRowData, getOrderTab } from '../../actions/orderActions/orderCompletedAction';
import { getEditLegData } from '../../actions/orderPlacementActions/multiLegActions';
import { getIsEditMultiple, getIsEditSingle, getIsOrderAccept, getIsOrderClose, getIsReorder, getLegData, getLegLevel, getLegType, getMultipleLeg, saveOrderData } from '../../actions/orderPlacementActions/orderPlacementActions';
import { getFieldIsValid, getFormatedAmount, getFormattedMMDDYY, getFormErrorRules, updateData, updateDataClose, validateAmountForFive, validateForm } from '../../controls/validations';
import CustomModal from '../customModal/customModal';
import EditFormModal from '../customModal/editModal';
import Loader from '../loader/loader';
import BFTable from '../table/table'
import logo from '../../assets/images/barrel_fuel_logo.png';
import { filterOrderTable, filterOrderTableByDate, sortOrder } from './orderFilter';
import html2pdf from 'html2pdf.js'
import { SendMailToUsers } from '../../services/commonServices';
import Invoice from './invoice';
import {getIsPricePending} from '../../actions/orderPlacementActions/orderPlacementActions'
import { getOperatorsByTailNum } from '../../actions/orderPlacementActions/orderPlacementService';
import {saveAuditLogData } from '../../actions/auditLog/auditLogActions';
import { Storage } from '../../controls/Storage';

import { sender_Email } from '../../controls/commonConstants';
import Arrow from '../../assets/images/down-arrow.png';
import { saveNotificationList } from '../../actions/notificationService/notificationAction';
export default function ActiveOrder() {
    const [isBusy, setBusy] = useState(true)
    const [activeJson , setActiveJson] = useState(null)
    const [path, setpath] = useState();
    const [submittedForm,setsubmittedForm]=useState(false);
    const [multiLegRow,setmultiLegRow]=useState(false);
    const [accept,setAccept]=useState(false);
    const [refresh,setrefresh]=useState(true);
    const [modalText, setModalText] = useState('');
    const [modalCustomText, setModalCustomText] = useState('');
    const [formData, setFormData] = useState({})
    const [formErrors , setFormErrors] = useState({});
    const [popUpJson , setPopupJson] = useState({});
    const [isBtnValidate,setbtnValidate]=useState(false);
    const [selectedRow,setSelectedRow] = useState({})
    const [editmodalShow, seteditModalShow] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [headCells, setheadCells] = useState(null);
    const [rows,setRows] = useState([])
    const [mobileRows,setMobileRows] = useState([])
    const [originalRows,setOriginalRows] = useState([])
    const [formDataSetRow,setformDataSetRow] = useState([])
    const [requestedBy,setRequestedBy] = useState([])
    const [invoiceData, setInvoiceData] = useState()
    const [generateInvoice, setGenerateInvoice] = useState(false)
    const navigate = useNavigate(); 
    const dispatch = useDispatch();
    const params = {"blobname":"activeOrder.json"}
    const loginReducer = useSelector(state => state.loginReducer);
    const orderCompletedReducer = useSelector((state) => state.orderCompletedReducer);
    const activeOrderReducer = useSelector((state) => state.activeOrderReducer);
    const orderDates = activeOrderReducer?.orderDates?.data;
    const searchValue = orderCompletedReducer?.searchValue?.data;
    const loginDetails = loginReducer && loginReducer.loginDetails &&loginReducer.loginDetails.data;
    let loginDetls =  JSON.stringify(loginDetails) === '{}'?{}:JSON.parse(loginDetails);
    const userType = loginDetls.userType?loginDetls.userType:'';
    const userEmail = loginDetls.loginUserName?loginDetls.loginUserName:'';
    //const orgName = loginDetls.organizationName?loginDetls.organizationName:'';
    let accessLvl = loginReducer && loginReducer.loginAccessLevel&&loginReducer.loginAccessLevel.data&&loginReducer.loginAccessLevel.data?loginReducer.loginAccessLevel.data:[]
    const access =  JSON.parse(accessLvl)
    const commonReducer = useSelector((state) => state.commonReducer);
    const loggedInUserType =  commonReducer?.loggedInUserType?.data;
    const orgName =  commonReducer?.loggedInCompany?.data;


    let payload = {
      "Organization": orgName,
      "OrderType":"Active",
      "Loggedinuser":userEmail,
      "role":userType
    }

    useEffect(() => {
      getPath()
              fetchActiveOrder(dispatch,payload).then(res=>{
                setBusy(false)
                let data = res && res.length && res[0].length && res[0][0]['JSON_UNQUOTE(@JSONResponse)']?JSON.parse(res[0][0]['JSON_UNQUOTE(@JSONResponse)']):[];
                //console.log(data)
                data=sortOrder(data)
                getRowsData(data)
                setOriginalRows(data)
              })

    },[refresh]);
    useEffect(() => {
      getIsPricePending(dispatch,false)
      getPath()
          getActiveJSONData(dispatch,params).then(response=>{
              setActiveJson(response.data.active)
              getheadcells(userType,response.data.active)
              if(loggedInUserType.toLowerCase()=='operator'){
                setInitialState(response.data.active.content)
              }else{
                setInitialState(response.data.active.content.declineData[0])
              }
          })

    },[]);
    useEffect(()=>{
      let filter=filterOrderTableByDate(orderDates,originalRows,false,userType?.toLowerCase())
      getRowsData(filter)
    },[orderDates,originalRows])

    useEffect(()=>{
      let filter=filterOrderTable(searchValue,originalRows)
      getRowsData(filter)
      setMinMaxDate(originalRows)
    },[searchValue,originalRows])

    const setMinMaxDate = (data)=>{
      let dates=[];
      data && data.length && data.map((order)=>{
        let legs= order.OrderLegs
        legs && legs.length && legs.map((val)=>{
          if(val?.FuellingDate){
            dates.push(val?.FuellingDate)
          }
        })
      })
      dates.length && dates.sort((a,b)=>{
        return new Date(getFormattedMMDDYY(a)) - new Date(getFormattedMMDDYY(b))
      })

      getIsMinDate(dates[0],dispatch)
      getIsMaxDate(dates[dates?.length-1],dispatch)
    }
    const setGallonData = (rowData)=>{
      const formDataSet = [];
      let fds={}
      rowData?.map((val,index)=>{
        fds['actualfuel'] = formDataSetRow && formDataSetRow.length>index && formDataSetRow[index]['actualfuel']? formDataSetRow[index]['actualfuel']: "";
        fds['orderid'] = val?.orderid;
        fds['errorMessage'] = null;
        formDataSet.push(JSON.parse(JSON.stringify(fds)))
      })
      setformDataSetRow(formDataSet)
    }
    const setInitialState = (fboData,clear) => {
      const formDataSet = {};
      let formErrors = {};
      const fieldTypeArr = ['input', 'select','textarea'];
  
      fboData && fboData.fields.forEach((item) => {
          if (fieldTypeArr.includes(item.component.toLowerCase())) {
              formDataSet[item.name] =clear ? "":formData && formData[item.name]? formData[item.name]: "";
              formErrors[item.name] = getFormErrorRules(item);
          }
      })
      setFormErrors(formErrors);
      setFormData(formDataSet);
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
    const sendInvoice=(email,operator,number)=>{
      //console.log(number)
        let data = document.getElementById('invoicePDF')
        let emailbody = activeJson?.emailInvoice
        html2pdf().from(data).outputPdf().then((url)=>{
            let data = {
                to: email,
                from: sender_Email,
                subject: emailbody.title + number,
                text: emailbody.paragraph + operator,
                html: `${emailbody.paragraph + camelize(operator)}, <br> <br> ${emailbody.html}`,
                attachments: [
                    {
                      content: btoa(url),
                      filename: "Invoice.pdf",
                      type: "application/pdf",
                      disposition: "attachment"
                    }
                  ]
            }
             SendMailToUsers(data);
          })
       
    }
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

    const getRowsData = (result)=>{
      let rowdata = []
      let mobileRowData = []
      result && result.forEach((item,index)=>{
        if(item.IsMultiLeg=='true' && userType.toLowerCase()!=='fbo'){
            rowdata.push(getRows(userType,item,null,true))
            mobileRowData.push(getMobileRows(userType,item,null,true))
            item.OrderLegs && item.OrderLegs.forEach(val=>{
              if(val.OrderStatus=='Processed' || val.OrderStatus=='Pending' || val.OrderStatus=='Escalated' || val.OrderStatus=='Price Pending'){
                rowdata.push(getRows(userType,item,val))
                mobileRowData.push(getMobileRows(userType,item,val))
              }  
            })
        }else{
          item.OrderLegs && item.OrderLegs.forEach(val=>{
            rowdata.push(getRows(userType,item,val))
            mobileRowData.push(getMobileRows(userType,item,val))
          })
        }
          
      })
      setRows(rowdata)
      //console.log(mobileRowData)
      setMobileRows(mobileRowData)
      if(loggedInUserType.toLowerCase()=='fbo'){
        setGallonData(rowdata)
      }
    }

    const getMobileRows = (access,row,leg,multi) => {
      let date=[]
      let status=[]
      let pending=false;
      let isRed=(new Date(leg?.FuellingDate) < new Date())
      let isToday = (getFormattedMMDDYY(new Date(leg?.FuellingDate)) == getFormattedMMDDYY(new Date()))
        if(multi){
          row?.OrderLegs?.map((val)=>{
            date.push(getFormattedMMDDYY(new Date(val?.FuellingDate)))
            status.push(val?.OrderStatus)
            if(val.OrderStatus=='Pending'){
              pending=true;
            }
          })
        }
        if(access == 'FBO'){
            return{
                "orderid":leg?.OrderNumber && leg?.OrderNumber,
                "date":new Date(leg?.FuellingDate).toLocaleDateString('en-US',{ year: 'numeric', month: '2-digit', day: '2-digit' }),
                "escalated": leg?.OrderStatus=="Escalated" || (isRed && !isToday) ? true : false,
                "mobileButton":true
              }
        }else{
          if(multi){
            return{
              "orderid":row?.OrderNumber,
              "date":date,
              "status":status,
              "pending": pending,
              "mobileButton":true
            }  
          }else{
            return{
              "orderid":leg?.OrderNumber,
              "date":new Date(leg?.FuellingDate).toLocaleDateString('en-US',{ year: 'numeric', month: '2-digit', day: '2-digit' }),
              "status":leg?.OrderStatus,
              "pending": leg?.OrderStatus=='Pending' ? true : false,
              "mobileButton":true
            }
          }
            
        }
     }
    const getheadcells = (access,data) =>{
        let head = []
        if(access == 'Barrel Fuel'){
            data && data.content.headers.InternalTab.map((item,index)=>{
                head[index] = item
            })
        }else if(access == 'FBO'){
            data && data.content.headers.FboTab.map((item,index)=>{
                head[index] = item
            })
        }else{
            data && data.content.headers.OperatorTab.map((item,index)=>{
                head[index] = item
            })
        }
        setheadCells(head)
    }

    const getrow=(row)=>{
      let sel;
      let i;
      let origiRows=JSON.parse(JSON.stringify(originalRows))
      origiRows && origiRows?.map((ogrows,index)=>{
        if(ogrows.IsMultiLeg=='true' && loggedInUserType.toLowerCase()!=='fbo' && row.orderid==ogrows.OrderNumber){
            sel=ogrows;
        }else{
          ogrows?.OrderLegs?.map((order,ind)=>{
            if(row.orderid==order.OrderNumber){
              sel=ogrows;
              i=ind
          }
          })
        }  
      })
      return {"sel":sel,"ind":i}
    }

    const editClick =(row)=>{
      let selectedRow=getrow(row);
      if(selectedRow.sel.IsMultiLeg=='true' && loggedInUserType.toLowerCase()!=='fbo' && !selectedRow.ind && selectedRow.ind!==0){
        getOrderMultiRowData(selectedRow.sel,dispatch)
        navigate('/dashboard/fuelorder/viewMultiOrder')
      }else{
        let oneComp=false;
        if(selectedRow.sel.IsMultiLeg=='true'){
          selectedRow.sel.OrderLegs?.map((leg)=>{
            if(leg?.OrderStatus=='Completed'){
              oneComp=true;
            }
          })
        }
        if(oneComp){
          selectedRow.sel.OrderLegs[selectedRow.ind].IsSingleLegComp=true;
        }
        selectedRow.sel.OrderLegs[selectedRow.ind].OperatorName=selectedRow.sel?.OperatorName
        selectedRow.sel.OrderLegs[selectedRow.ind].CreatedBy=selectedRow.sel?.RequestByName
        selectedRow.sel.OrderLegs[selectedRow.ind].RequestBy=selectedRow.sel?.RequestBy
        selectedRow.sel.OrderLegs[selectedRow.ind].IsMultiLeg=selectedRow.sel?.IsMultiLeg
        setSelectedRow(selectedRow)
        getIsEditSingle(dispatch,true)
        getEditLegData(dispatch,selectedRow.sel.OrderLegs[selectedRow.ind])
        getLegType(dispatch,false)
        getMultipleLeg(dispatch,false)
        getLegLevel(dispatch,0)
        navigate('/dashboard/fuelorder/order')
      }
    }
    const reviewClick = (row,data,button,mobile) =>{
      // setInvoiceData(row)
      setModalCustomText('')
      let selectedRow=getrow(row);
      if(selectedRow.sel.IsMultiLeg=='true'  && loggedInUserType.toLowerCase()!=='fbo' && !selectedRow.ind && selectedRow.ind!==0){
        setmultiLegRow(true)
      }else{
        setmultiLegRow(false)
        selectedRow.sel.OrderLegs[selectedRow.ind].OperatorName=selectedRow.sel?.OperatorName
        selectedRow.sel.OrderLegs[selectedRow.ind].CreatedBy=selectedRow.sel?.RequestByName
        selectedRow.sel.OrderLegs[selectedRow.ind].RequestBy=selectedRow.sel?.RequestBy
      }
      setSelectedRow(selectedRow)
      
      if(button.Label=="Cancel" || button.Label=="Decline"){
        if(loggedInUserType.toLowerCase()!=='fbo'){
          if(loggedInUserType.toLowerCase()=='barrel fuel'){
            getoperators(selectedRow)
          }
          let json={...activeJson?.content};
          json['fields']=json?.fields?.filter((m)=>m?.users?.includes(loggedInUserType.toLowerCase()))
          setInitialState(json)
          setPopupJson(json)
        }
        document.getElementById('root').style.filter = 'blur(5px)';
        seteditModalShow(true)
      }else if(button.Label=="Accept"){
        document.getElementById('root').style.filter = 'blur(5px)';
        if(loggedInUserType.toLowerCase()=='barrel fuel'){
          setAccept(true)
          getoperators(selectedRow)
          setInitialState(activeJson?.content?.acceptFields)
          setPopupJson(activeJson?.content?.acceptFields)
          seteditModalShow(true)
        }else{
          setModalCustomText(activeJson.content.acceptMessage.text)
          setModalShow(true)
        } 
      }else if(button.Label=="Edit & Close"){
        getIsOrderClose(dispatch,true)
        getEditLegData(dispatch,selectedRow.sel.OrderLegs[selectedRow.ind])
        getLegType(dispatch,false)
        getMultipleLeg(dispatch,false)
        getLegLevel(dispatch,0)
        navigate('/dashboard/fuelorder/order')
      }else if(button.Label=="Close"){
        if(loggedInUserType.toLowerCase()=='fbo'){
          let isValid=true;
          let i=0;
          let gallonVal=JSON.parse(JSON.stringify(formDataSetRow))
          gallonVal?.map((val,ind)=>{
            if(row?.orderid==val?.orderid){
              i= ind
            }
          })
          if(gallonVal[i]['actualfuel']==''){
            gallonVal[i]['errorMessage']=true
            isValid=false;
            setformDataSetRow(gallonVal)
          }
          
          if(isValid){
            let rw=rows
            selectedRow.sel.OrderLegs=[selectedRow.sel.OrderLegs[selectedRow.ind]]
            //console.log(selectedRow.sel)
            
            let data=updateData(parseFloat(gallonVal[i]['actualfuel']),1,selectedRow.sel,selectedRow.sel.TailNumber,userEmail)
            rw[i].Buttons[0].Label="Complete"
            rw[i].Buttons[0].className="btn bf-btn-success btn-bf-primary"
            rw[i].Buttons[1].disable=true;
            rw[i].totprice='$'+getFormatedAmount(data?.OrderLegs[0]?.FinalPrice)
            setRows(rw)
            data.OrderLegs[0].OrderNumber_Display=data?.OrderLegs[0]?.OrderNumber
            let multinumber = data.OrderNumber
            let uid=uuid()
            data.OrderNumber=uid;
            data.OrderLegs[0].OrderNumber=uid
            data.CreatedBy=userEmail
            data.Role=loggedInUserType
            data.OrderLegs[0].OrderStatus="Completed"
            data.OrderLegs[0].FuelQuantity=parseFloat(gallonVal[i]['actualfuel'])
            let name = data.CreatedBy
            let leg = data.IsMultiLeg
            saveOrderData(dispatch,data).then((res)=>{
              //Close order
              let payload = {}
              payload.type = "create"
              if(leg == "true"){
                payload.notificationMessage = activeJson.notifyMessage.msg4+name+activeJson.notifyMessage.msg5+rw[i].orderid+activeJson.notifyMessage.msg7+multinumber+activeJson.notifyMessage.msg8+"."
              }else{
                payload.notificationMessage = activeJson.notifyMessage.msg2+rw[i].orderid+activeJson.notifyMessage.msg3+"."
              }
              payload.organizationName = rw[i].operator
              payload.loginUserName = userEmail
              payload.sendNotificationTo = "ORG Internal"
              payload.access_levels = ["Level 1 (Admin)","Level 2 (Standard)","Level 3 (Basic)"]
              payload.levelOfAccess = access.includes('Super') ? "Level 1 (Admin)" : access.includes('Admin') ? "Level 2 (Standard)" : "Level 3 (Basic)"
              payload.isActionable = false
              payload.actionTaken = ""
              payload.category = "order"
              payload.readInd = false
              saveNotificationList(payload,dispatch).then((res)=>{
      
              })


              let data = res&& res.length && res[0].length && res[0][0] && res[0][0]['JSON_UNQUOTE(@JSONResponse)']
              // Audit log
              let auditPayload = {"ModuleName":"Orders",
                  "TabName":"Complete",
                  "Activity":"Closed the active orders "+uid,
                  "ActionBy":Storage.getItem('email'),
                  "Role":JSON.parse(Storage.getItem('userRoles')),
                  "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
              saveAuditLogData(auditPayload, dispatch)

              data = JSON.parse(data)[0]
              let orderLegs = data.OrderLegs.filter((leg,index)=> index == selectedRow.ind)
              data.orderLegs = orderLegs
              // console.log(data, data.OrderLegs[0].OrderNumber)
              setInvoiceData(data)
              getLegData(dispatch,{})
              setTimeout(()=>{
                sendInvoice(data.RequestBy, data.RequestByName, data.OrderLegs[selectedRow.ind].OrderNumber)
        
              },25)
              
            })
          }else{
            if(mobile){

            }else{
              document.getElementById('root').style.filter = 'blur(5px)';
              setModalShow(true)
            }
            setModalCustomText(activeJson.content.validationCancelMessage)
          }
        }else{
          getIsOrderClose(dispatch,true)
          getEditLegData(dispatch,selectedRow.sel.OrderLegs[selectedRow.ind])
          getLegType(dispatch,false)
          getMultipleLeg(dispatch,false)
          getLegLevel(dispatch,0)
          navigate('/dashboard/fuelorder/order')
        }
        
      }
    }

    const getoperators=(row)=>{
      let requestedBy=[]
      getOperatorsByTailNum({"TailNumber":row?.sel?.OrderLegs[0]?.TailNumber}).then((res)=>{
          if(res){
            let data = res && res.length && res[0].length && res[0][0]['JSON_UNQUOTE(@JSONResponse)']?JSON.parse(res[0][0]['JSON_UNQUOTE(@JSONResponse)']):[];
            data.map((value)=>{
              if(value?.Operators && value?.Operators.length && value?.Operators[0].Operator==row?.sel?.OperatorName){
                value.Operators[0].Users.map((user)=>{
                  let obj={}
                  obj.title=user
                  obj.value=user
                  requestedBy.push(obj)
                })
              }
              
            })
          }
          setRequestedBy(requestedBy)
        })
    }

    const getRows = (access,row,leg,multi) => {
      let fbo=[]
      let icao=[]
      let date=[]
      let pending=false;
      //let isClose=false;
      let isClose=(new Date(leg?.FuellingDate) > new Date())
      let isRed=(new Date(leg?.FuellingDate) < new Date())
      let isToday = (getFormattedMMDDYY(new Date(leg?.FuellingDate)) == getFormattedMMDDYY(new Date()))
        if(multi){
          row?.OrderLegs?.map((val)=>{
            if(fbo.length==0 || !fbo.includes(camelize(val?.FBO))){
              fbo.push(camelize(val?.FBO))
            }
            if(icao.length==0 || !icao.includes(val?.ICAO?.toUpperCase())){
              icao.push(val?.ICAO?.toUpperCase())
            }
            if(date.length==0 || !date.includes(getFormattedMMDDYY(new Date(val?.FuellingDate)))){
              date.push(getFormattedMMDDYY(new Date(val?.FuellingDate)))
            }
            if(val.OrderStatus=='Pending'){
              pending=true;
            }
          })
        }
        if(access == 'Barrel Fuel'){
          if(multi){
            return{
              "orderid":row.OrderNumber,
              "date":date,
              "location":icao,
              "fbo":fbo,
              "operator":row.OperatorName,
              "pending": pending,
              "totprice":'$'+getFormatedAmount(row.OrderFinalPrice),
              "Buttons":[{"name":"button1","Label":"Edit","method":reviewClick,"className":"btn btn-bf-primary"},{"name":"button2","Label":"Cancel","method":"","className":"btn-bf-secondary bf-mrgl20"}]
            }  
          }else{
            return{
              "orderid":leg.OrderNumber,
              "date":[new Date(leg?.FuellingDate).toLocaleDateString('en-US',{ year: 'numeric', month: '2-digit', day: '2-digit' })],
              "location":[leg?.ICAO.toUpperCase()],
              "fbo":[camelize(leg?.FBO)],
              "operator":row.OperatorName,
              "totprice":'$'+getFormatedAmount(leg.FinalPrice),
              "pending": leg?.OrderStatus=="Pending" ? true : false,
              "escalated": leg?.OrderStatus=="Escalated" ? true : false,
              "Buttons":leg?.OrderStatus=="Pending" ? 
              [{"name":"button1","Label":"Accept","method":"","className":"btn btn-bf-primary"},{"name":"button2","Label":"Cancel","method":"","className":"btn-bf-secondary bf-mrgl20"}] 
              :[{"name":"button1","Label":"Close","method":reviewClick,"className":"btn btn-bf-primary","disable":isClose ? true : false},{"name":"button2","Label":"Edit","method":"","className":"btn-bf-secondary bf-mrgl20"}]
            }
          }    
        }else if(access == 'FBO'){
            return{
                "orderid":leg?.OrderNumber && leg?.OrderNumber,
                "aircraft":leg?.TailNumber,
                "date":new Date(leg?.FuellingDate).toLocaleDateString('en-US',{ year: 'numeric', month: '2-digit', day: '2-digit' }),
                "location":leg?.ICAO.toUpperCase(),
                "operator":row.OperatorName,
                "estfuel":leg?.FuelQuantity,
                "actualfuel":isClose ? true :"",
                "escalated": leg?.OrderStatus=="Escalated" || (isRed && !isToday) ? true : false,
                "totprice":'$'+getFormatedAmount(leg?.FinalPrice),
                "Buttons":leg?.OrderStatus=="Pending" ? 
                    [{"name":"button1","Label":"Edit","method":"","className":"btn btn-bf-primary"},{"name":"button2","Label":"Decline","method":"","className":"btn-bf-secondary bf-mrgl20"}] 
                    :[{"name":"button1","Label":"Close","method":"","className":"btn btn-bf-primary","disable":isClose ? true :false},{"name":"button2","Label":"Edit & Close","method":"","className":"btn-bf-secondary bf-mrgl20","disable":isClose ? true :false}]
              }
        }else{
          if(multi){
            return{
              "orderid":row?.OrderNumber,
              "date":date,
              "location":icao,
              "fbo":fbo,
              "pending": pending,
              "aircraft":row?.OrderLegs && row?.OrderLegs[0]?.TailNumber,
              "totprice":'$'+getFormatedAmount(row.OrderFinalPrice),
              "Buttons":[{"name":"button1","Label":"Edit","method":"","className":"btn btn-bf-primary"},{"name":"button2","Label":"Cancel","method":"","className":"btn-bf-secondary bf-mrgl20"}] 
            }  
          }else{
            return{
              "orderid":leg?.OrderNumber,
              "date":[new Date(leg?.FuellingDate).toLocaleDateString('en-US',{ year: 'numeric', month: '2-digit', day: '2-digit' })],
              "location":[leg?.ICAO.toUpperCase()],
              "fbo":[camelize(leg?.FBO)],
              "aircraft":leg?.TailNumber,
              "totprice":leg?.OrderStatus=="Price Pending" ? '$'+getFormatedAmount(leg?.FinalPrice)+'*' :'$'+getFormatedAmount(leg?.FinalPrice),
              "pending": leg?.OrderStatus=="Pending" ? true : false,
              "Buttons":leg?.OrderStatus=="Pending" ? 
                [{"name":"accept","Label":"Accept","method":"","className":"btn btn-bf-primary"},{"name":"cancel","Label":"Cancel","method":"","className":"btn-bf-secondary bf-mrgl20"}] 
                :leg?.OrderStatus=="Escalated" ?[{"name":"edit","Label":"Edit","method":"","className":"btn btn-bf-primary"},{"name":"cancel","disable":true,"Label":"Cancel","method":"","className":"btn-bf-secondary bf-mrgl20"}]
                 : [{"name":"edit","Label":"Edit","method":"","className":"btn btn-bf-primary"},{"name":"cancel","Label":"Cancel","method":"","className":"btn-bf-secondary bf-mrgl20"}]
            }
          }
            
        }
     }

     const onRowClick =(button,row)=>{
      let selectedRow;
      selectedRow=getrow(row)
      if(selectedRow.sel.IsMultiLeg=='true' && loggedInUserType.toLowerCase()!=='fbo' && !selectedRow.ind && selectedRow.ind!==0){
        getOrderMultiRowData(selectedRow.sel,dispatch)
        navigate('/dashboard/fuelorder/viewMultiOrder')
      }else{
        let oneComp=false;
        if(selectedRow.sel.IsMultiLeg=='true'){
          selectedRow.sel.OrderLegs?.map((leg)=>{
            if(leg?.OrderStatus=='Completed'){
              oneComp=true;
            }
          })
        }
        if(oneComp){
          selectedRow.sel.OrderLegs[selectedRow.ind].IsSingleLegComp=true;
        }
        let newRow=selectedRow.sel;
        let arr=[];
        arr.push(selectedRow.sel.OrderLegs[selectedRow.ind])
        newRow.OrderLegs=arr;
        getOrderRowData(newRow,dispatch)
        navigate('/dashboard/fuelorder/viewOrder')
      }
      
    } 

    const onHandleChangeRow=(e,item,index)=>{
      let gallonVal=[...formDataSetRow]
      e.target.value=validateAmountForFive({"unit":"$"},e.target.value)
      gallonVal[index][item]=e.target.value;
      if(e.target.value==''){
        gallonVal[index]['errorMessage']=true
      }else{
        setModalCustomText('')
        gallonVal[index]['errorMessage']=null
      }
      setformDataSetRow(gallonVal)
    }

    const onHandleChange =(e,field)=>{
      let target=e.target
      let formdataset={}
      let fields = {};
      let maxLength = 0;

      if (field && field.maxLength) {
        maxLength = parseInt(field.maxLength);
      }
      if (maxLength > 0 && target.value.length > maxLength) {
          target.value = target.value.substring(0, maxLength);
          return;
      }
      fields[field.name] = target.value;
      if(isBtnValidate){
        validateField(
            field.name, target.value
        );
      }
      formdataset = {
        ...formData,
        ...fields
      }  
      let isValid=validateForm(formErrors);
      if (isValid) {
        setModalText('');
      }
      setFormData(formdataset)
    }

    const validateField = (fieldName, value, fields, isTouched) => {
      const fieldValidationErrors = {
          ...formErrors
      };
      let fieldValidationError;
      fieldValidationError = fieldValidationErrors[fieldName];
      let validationObj = {};
      validationObj = getFieldIsValid(value, fieldValidationError, fieldName);
      let errcount = validationObj.errcount;
      if (!errcount) {
          fieldValidationErrors[fieldName].isValid = true;
          fieldValidationErrors[fieldName].activeValidator = {};
      } else {
          fieldValidationErrors[fieldName].isValid = false;
          fieldValidationErrors[fieldName].activeValidator = validationObj.fieldValidationError.activeValidator;
      }
      setFormErrors(fieldValidationErrors)
    }

    const onHandleBlur =()=>{
    }  

    const onClickSubmit =(e,item)=>{
        setbtnValidate(true)
        Object.keys(formErrors).forEach((fieldName, index) => { 
          validateField(
            fieldName,
            formData[fieldName]
          );
        });

        let isValid=validateForm(formErrors)
        if(isValid){
          if(accept){
            successModal()
          }else{
            let payload={}
            payload.RequestedBy=loggedInUserType.toLowerCase()=='barrel fuel' ? formData.requestedBy : userEmail
            payload.role=loggedInUserType
            payload.Loggedinuser=userEmail
            payload.Status=loggedInUserType?.toLowerCase()!=='fbo'?"Canceled":"Declined"
            payload.StatusReason=formData.StatusReason
            payload.StatusNotes=formData.StatusNotes?.replace("\n"," ");
            if(multiLegRow){
              payload.OrderNumber=selectedRow.sel.OrderNumber;
            }else{
              payload.OrderDetailid=selectedRow.sel.OrderLegs[selectedRow.ind].OrderDetailid;
            }
            setsubmittedForm(true)
            cancelDeclineOrder(payload).then((res)=>{ //
              let req = {}
              req.type = "create"
              if(multiLegRow){
                req.notificationMessage = activeJson.notifyMessage.msg4+selectedRow?.sel?.RequestByName+activeJson.notifyMessage.msg5+selectedRow?.sel?.OrderLegs[selectedRow?.ind]?.OrderNumber+activeJson.notifyMessage.msg7+selectedRow?.sel?.OrderNumber+activeJson.notifyMessage.msg6+"."
              }else{
                req.notificationMessage = activeJson.notifyMessage.msg4+selectedRow?.sel?.OrderLegs[selectedRow?.ind]?.CreatedBy+activeJson.notifyMessage.msg5+selectedRow?.sel?.OrderNumber+activeJson.notifyMessage.msg6+"."
              }
              req.organizationName = selectedRow.sel.OrderLegs[selectedRow.ind].OperatorName
              req.loginUserName = userEmail
              req.sendNotificationTo = "ORG Internal"
              req.access_levels = ["Level 1 (Admin)","Level 2 (Standard)","Level 3 (Basic)"]
              req.levelOfAccess = access.includes('Super') ? "Level 1 (Admin)" : access.includes('Admin') ? "Level 2 (Standard)" : "Level 3 (Basic)"
              req.isActionable = false
              req.actionTaken = ""
              req.category = "order"
              req.readInd = false
              saveNotificationList(req,dispatch).then((res)=>{
          
              })
              setsubmittedForm(false)
              if(res){
                if(res[0][0].Msg=="Record(s) process successfully"){
                  let emailData=loggedInUserType?.toLowerCase()!=='fbo'? activeJson?.content?.cancelEmailBody :activeJson?.content?.declineEmailBody;
                  let userName=selectedRow.sel.RequestByName;
                  let sendingTo=loggedInUserType.toLowerCase()=='barrel fuel' ? formData.requestedBy : loggedInUserType?.toLowerCase()=='fbo'? selectedRow.sel.RequestBy : userEmail
                  let orderNum = multiLegRow ? selectedRow.sel.OrderNumber : selectedRow.sel.OrderLegs[selectedRow.ind].OrderNumber
                  let htmlText1 = emailData?.html1 ? emailData.html1+orderNum:'';
                  let htmlText2 = emailData?.html2 ? emailData.html2:''
                  let paragraph = `${emailData.paragraph} ${camelize(userName)},`
                  let body = `${paragraph} <br> <br>${ htmlText1+htmlText2}`
                  const emailPayload = {
                    "to":sendingTo,
                    "from": sender_Email,
                    "subject": emailData?.title+orderNum+emailData?.title2,
                    "text": paragraph,
                    "html": body
                  }
                  SendMailToUsers(emailPayload);
                  seteditModalShow(false)
                  document.getElementById('root').style.filter = 'none';
                  getOrderTab('completed',dispatch)
                  // audit log
                  let orderID = payload.OrderDetailid ? payload.OrderDetailid: payload.OrderNumber;
                  let auditPayload = {"ModuleName":"Orders",
                              "TabName":"Complete",
                              "Activity":payload.Status+" orders "+orderID,
                              "ActionBy":Storage.getItem('email'),
                              "Role":JSON.parse(Storage.getItem('userRoles')),
                              "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
                  saveAuditLogData(auditPayload, dispatch)
                  //
                  navigate("/dashboard/order")
                }
              }else{
                setModalText("Server Error")
              }
              
            })
          }
        }else{
          setModalText(activeJson?.content?.validationMessage)
        }

    }

    const successModal =()=>{
      let payload={}
      payload.RequestedBy=loggedInUserType.toLowerCase()=='barrel fuel' ? formData.requestedBy : userEmail
      payload.role=loggedInUserType
      payload.Loggedinuser=userEmail
      payload.Status="Accept"
      payload.OrderDetailid=selectedRow.sel.OrderLegs[selectedRow.ind].OrderDetailid;
      cancelDeclineOrder(payload).then((res)=>{
        
        if(res){
          // order accepted
          let payload = {}
          payload.type = "create"
          payload.notificationMessage = selectedRow.sel.OrderLegs[selectedRow.ind].OrderNumber+activeJson.notifyMessage.msg1+"."
          payload.organizationName = selectedRow.sel.OrderLegs[selectedRow.ind].FBO
          payload.loginUserName = userEmail
          payload.sendNotificationTo = "ORG Internal"
          payload.access_levels = ["Level 1 (Admin)","Level 2 (Standard)","Level 3 (Basic)"]
          payload.levelOfAccess = access.includes('Super') ? "Level 1 (Admin)" : access.includes('Admin') ? "Level 2 (Standard)" : "Level 3 (Basic)"
          payload.isActionable = false
          payload.actionTaken = ""
          payload.category = "order"
          payload.readInd = false
          saveNotificationList(payload,dispatch).then((res)=>{
      
          })

          let data = res && res.length && res[0].length && res[0][0]['@JSONResponse']?JSON.parse(res[0][0]['@JSONResponse']):[];
          getIsOrderAccept(dispatch,true)
          getOrderRowData(data[0],dispatch)
          setModalShow(false)
          document.getElementById('root').style.filter = 'none';
          navigate("/dashboard/fuelorder/viewOrder")
        }
        
      })
    }

     const closeEditModal =()=>{
      seteditModalShow(false)
      setbtnValidate(false)
      setAccept(false)
      setModalText('')
      setFormData({})
      document.getElementById('root').style.filter = 'none';
      if(loggedInUserType.toLowerCase()=='operator'){
        setInitialState(activeJson.content,true)
      }else{
        setInitialState(activeJson.content.declineData[0],true)
      }
    }

    const closeModal =()=>{
      setModalShow(false)
      setModalText('')
      document.getElementById('root').style.filter = 'none';
    }

    const closeMobilePopUp =()=>{
      setModalCustomText('')
    }

  const getFuelTiers = (row)=>{
    let selectedRow;
    selectedRow=getrow(row)
    if(selectedRow.sel.IsMultiLeg=='true' && loggedInUserType.toLowerCase()!=='fbo' && !selectedRow.ind && selectedRow.ind!==0){
      
    }else{
      let leg=selectedRow?.sel?.OrderLegs[selectedRow?.ind];
      //console.log(leg)
      let oldPrice=leg?.EditedValues && leg?.EditedValues.length && leg?.EditedValues[0]?.OldPrice;
      let oldBasePrice=leg?.EditedValues && leg?.EditedValues.length && leg?.EditedValues[0]?.OldBasePrice;
      let oldCostPlus=leg?.EditedValues && leg?.EditedValues.length && leg?.EditedValues[0]?.OldCostplus;
      let newPrice=leg?.FinalPrice;
      let oldGalPrice=parseFloat(oldBasePrice+oldCostPlus).toFixed(2);
      let newGalPrice=parseFloat(leg?.BasePrice+leg?.CostPlus).toFixed(2);
      return(
          <div className=' bf-order-total-price'>
            <div className='bf-order-total-price-popup'>
              <div className='d-flex bf-gallons'>
                <div className='bf-order-total-price-text'>
                  <div>Previous </div>
                      <div>${getFormatedAmount(oldPrice)} @ {oldGalPrice}/gal</div>
                </div>
              </div>
              <div className='d-flex bf-price'>
              <div className='bf-order-total-price-text'>
                  <div>Current </div>
                      <div>${getFormatedAmount(newPrice)} @ {newGalPrice}/gal</div>
              </div>
              </div>
            </div>
              <img src={Arrow} className="bf-tiers-arrow"/>
          </div>)
    }  
  } 

      return (
            <> 
        <div className={`bf-table-container bf-table-search-results bf-orders-active-table-container ${loggedInUserType.toLowerCase()== 'operator' ? 'bf-operator-activeorder-table-container' :  loggedInUserType.toLowerCase()== 'fbo' ? 'bf-fbo-activeorder-table-container' : 'bf-internal-activeorder-table-container'}`}>
          <div style={{"height":"0","width":"0","overflow":"hidden"}}>
                <div style={{"height":"100%","width":"100%"}}id="invoicePDF">
                  <Invoice sendEmail={generateInvoice} isInvoice={true} isOrderClose={true}invoiceData={invoiceData} />
                </div>
            </div>
          <BFTable
            sortEnabled={true}
            searchEnabled={false}
            Data={rows && rows}
            heading={headCells}
            searchBy={[""]}
            onClick={reviewClick}
            loading={isBusy}
            rowClick={onRowClick}
            onHandleChangeRow={onHandleChangeRow}
            formDataSetRow={formDataSetRow}
            primaryClick={editClick}
            className="bf-first-table"
            hoverFunction={getFuelTiers}
            pricePending={loggedInUserType.toLowerCase()=='operator' ? true : false}
            pricePendingText={activeJson?.content?.fuelPricePending?.text}
          >
          </BFTable>
          <BFTable 
            sortEnabled = {false} 
            searchEnabled={false} 
            Data ={mobileRows && mobileRows} 
            heading={activeJson?.content?.mobileHeadCells?.filter((m)=>m?.users?.includes?.(loggedInUserType.toLowerCase()))}
            primaryClick = {editClick}
            onClick={reviewClick}
            isUserMobileTab = {true}
            isMobileTable = {true}
            viewLabels = {headCells && headCells}
            viewData = {rows && rows} 
            onHandleChangeRow={onHandleChangeRow}
            formDataSetRow={formDataSetRow}
            modalCustomText={modalCustomText}
            // jsonData = {jsonData}
            closeMobile={closeMobilePopUp}
             viewLabel = {activeJson?.content?.mobileViewHeader}
        >
        </BFTable>
        </div> 
        <EditFormModal
         onHide={() => closeEditModal()}
         formErrors={formErrors}
         modalWidth={accept ?'order-place': null}
         formdata={formData}
         show={editmodalShow}
         json={loggedInUserType.toLowerCase()!=='fbo'? popUpJson : activeJson?.content?.declineData[0]}
         onHandleChange={onHandleChange}
         onHandleBlur={onHandleBlur}
         onClickSubmit={onClickSubmit}
         showError = {modalText}
         customButtons={true}
         primaryButtonText={accept ? "Yes" :"Submit"}
         submittedForms={submittedForm}
         customOptions={true}
         userOptions={requestedBy}
         secondbutton={accept ?"Cancel":"Back"}
         modalClassName={!accept ? "bf-cancel-modal" : ""}
    />
    <CustomModal
    show={modalShow}
    onHide={modalCustomText==activeJson?.content?.acceptMessage?.text ?()=>successModal() :() => closeModal()}
    hide={() => closeModal()}
    modelBodyContent={modalCustomText}
    buttonText={modalCustomText==activeJson?.content?.acceptMessage.text ? activeJson?.content?.acceptMessage.button1 :"Ok"}
    secondbutton={modalCustomText==activeJson?.content?.acceptMessage.text ?activeJson?.content?.acceptMessage.button2 : null}
    />
            </> 
    );

}
