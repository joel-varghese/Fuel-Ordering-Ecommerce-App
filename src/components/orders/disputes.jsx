import { getPath } from '@mui/system';
import { data } from 'jquery';
import React, { useState, useEffect } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { bfaJsonService } from '../../actions/BFAServices/BFAJsonService';
import { DispData, getDisputeData, prevScreen, ReviewScreen, viewScreen } from '../../actions/orderActions/disputeAction';
import CustomModal from '../customModal/customModal';
import EditFormModal from '../customModal/editModal';
import { fetchDisputeOrder, updateDispute } from '../../actions/orderActions/disputeOrderAction';
import Loader from '../loader/loader';
import BFTable from '../table/table'
import ReviewDispute from './reviewDispute';
import { getFormattedMMDDYY, getFormErrorRules } from '../../controls/validations';
import { filterDisputeTable, filterOrderTable, filterOrderTableByDate } from './orderFilter';
import { getIsMaxDate, getIsMinDate } from '../../actions/orderActions/orderCompletedAction';
import { getOperatorsByTailNum } from '../../actions/orderPlacementActions/orderPlacementService';
import { getFboUsers } from '../../actions/orderActions/activeOrderService';
import {saveAuditLogData } from '../../actions/auditLog/auditLogActions';
import { Storage} from '../../controls/Storage';
import { saveNotificationList } from '../../actions/notificationService/notificationAction';

export default function Dispute() {
    const [isBusy, setBusy] = useState(true)
    const [disputeJson , setDisputeJson] = useState(null)
    const [reviewShow, setreviewShow] = useState(null)
    const [path,setPath] = useState("")
    const [headCells, setheadCells] = useState(null);
    const [showModal,setShow] = useState(false)
    const [rows,setRows] = useState(null)
    const [mobileRows,setMobileRows] = useState([])
    const [refresh,setrefresh] = useState(0)
    const [updateReq,setupdateReq] = useState({})
    const [editmodalShow, seteditModalShow] = useState(false);
    const [modalText, setModalText] = useState('');
    const [formErrors , setFormErrors] = useState({});
    const [formData, setFormData] = useState({})
    const [originalRows, setoriginalRows] = useState([]);
    const [requestedBy, setRequestedBy] = useState([]);
    const [reopenOrg,setReopenOrg] = useState('')
    const [reopenOrder,setReopenOrder] = useState('')
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = {"blobname":"disputes.json"}
    const orderCompletedReducer = useSelector((state) => state.orderCompletedReducer);
    const searchValue = orderCompletedReducer?.searchValue?.data;
    const loginReducer = useSelector(state => state.loginReducer);
    const loginDetails = loginReducer && loginReducer.loginDetails &&loginReducer.loginDetails.data;
    const accessLvl = loginReducer?.loginAccessLevel?.data ? loginReducer?.loginAccessLevel?.data :[]
    const access =  JSON.parse(accessLvl)
    const activeOrderReducer = useSelector((state) => state.activeOrderReducer);
    const orderDates = activeOrderReducer?.orderDates?.data;
    const commonReducer = useSelector((state) => state.commonReducer);
    const company =  commonReducer?.loggedInCompany?.data;
    let loginDetls =  JSON.stringify(loginDetails) === '{}'?{}:JSON.parse(loginDetails);
    let userType = loginDetls.userType?loginDetls.userType:'';
    let userEmail = loginDetls.loginUserName?loginDetls.loginUserName:'';

    let payload = {
      "role":userType == "Barrel Fuel" ? "BFUser" : userType,
      "Loggedinuser":userEmail,
      "organizationName":userType == "Barrel Fuel" ? "" : company
    }

    useEffect(() => {
          bfaJsonService(params).then(response=>{
              setDisputeJson(response.data.disputes)
              getheadcells(response.data.disputes)
              setInitialState(response.data.disputes)
              fetchDisputeOrder(dispatch,payload).then(res=>{
                setBusy(false)
                let data = res && res.length && res[0].length && res[0][0]['JSON_UNQUOTE(@JSONResponse)']?JSON.parse(res[0][0]['JSON_UNQUOTE(@JSONResponse)']):[];
                getRowData(data)
                setoriginalRows(data)  
              })
              // getRows(userType)
              getPath()
              
          })

    },[refresh]);
    useEffect(()=>{
      let filter=filterDisputeTable(searchValue,originalRows)
      getRowData(filter)
      setMinMaxDate(originalRows)
    },[searchValue,originalRows])
    useEffect(() => {
      // return()=>{
      //   prevScreen(null,dispatch)
      // }
    }, []) 
    const setMinMaxDate = (data)=>{
      let dates=[];
      data && data.length && data.map((dispute)=>{
        if(dispute?.DateDisputed){
          dates.push(dispute?.DateDisputed)
        }
      })

      dates.length && dates.sort((a,b)=>{
        return new Date(getFormattedMMDDYY(a)) - new Date(getFormattedMMDDYY(b))
      })

      getIsMinDate(dates[0],dispatch)
      getIsMaxDate(dates[dates?.length-1],dispatch)
    }
     useEffect(()=>{
       let filter=filterOrderTableByDate(orderDates,originalRows,true)
       getRowData(filter)
     },[orderDates,originalRows])

    const getPath= () =>{
      let windowpath = window.location.pathname.toString()
      windowpath = windowpath.split("/")
      windowpath.splice(-2)
      windowpath.splice(1,1)
      let currpath=""
      windowpath.map((e)=>{
        currpath = currpath+e+'/'
      })
      setPath(currpath)
    }
    const setInitialState = (data) =>{
      const formDataSet = {};
      let formErrors = {};
      let validationObj = {
        "errorMessage":null
      };
      const fieldTypeArr = ['input', 'select', 'textarea'];
      setModalText('')
      if(userType == "Barrel Fuel"){
        data && data.editmodalBF.fields.forEach((item) => {
          if (fieldTypeArr.includes(item.component.toLowerCase())) {
              formDataSet[item.name] =formData && formData[item.name]? formData[item.name]: "";
              if(item.component.toLowerCase() == "textarea"){
                formErrors[item.name] = false
              }else{
                formErrors[item.name] = getFormErrorRules(item)
                formErrors[item.name].activeValidator = validationObj
              }
          }
      })
      }else{
      data && data.editmodal.fields.forEach((item) => {
          if (fieldTypeArr.includes(item.component.toLowerCase())) {
              formDataSet[item.name] =formData && formData[item.name]? formData[item.name]: "";
              if(item.component.toLowerCase() == "textarea"){
                formErrors[item.name] = false
              }else{
                formErrors[item.name] = getFormErrorRules(item)
              }
          }
      })
      }
      setFormErrors(formErrors);
      setFormData(formDataSet);
    }
    const handleChange =(e,field)=>{
      let target=e.target
      let formdataset={}
      let formerror = {...formErrors}
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
      if(field.name == "Notes"){
        formerror["Notes"] = false
        setModalText('')
      }
      if(field.name == "requestedBy"){
        formerror["requestedBy"].activeValidator.errorMessage = null
        setModalText('')
      }
      // if(isBtnValidate){
      //   validateField(
      //       field.name, target.value
      //   );
      // }
      formdataset = {
        ...formData,
        ...fields
      }  
      // let isValid=validateForm(formErrors);
      // if (isValid) {
      //   setModalText('');
      // }
      setFormErrors(formerror)
      setFormData(formdataset)
    }
    const handleBlur =(e,field)=>{
      let target=e.target
      let formerror = {...formErrors}
      if(field.name == "Notes"){
        formerror["Notes"] = false
      }
      if(field.name == "requestedBy"){
        formerror["requestedBy"].activeValidator.errorMessage = null
      }
      setFormErrors(formerror)

    }  
    const onClickSubmit =(e,item)=>{
      console.log("updateReq------", updateReq)
      let isValid = true
      let formerror = {...formErrors}
      if(userType == "Barrel Fuel"){
        if(formData["Notes"] == ""){
          isValid = false
          formerror["Notes"] = true
        }
        if(formData["requestedBy"] == ""){
          isValid = false
          formerror["requestedBy"].activeValidator.errorMessage = ""
        }
      }else{
        if(formData["Notes"] == ""){
          isValid = false
          formerror["Notes"] = true
        }
      }
      if(isValid){
        seteditModalShow(false)
        let payload = {...updateReq}
        payload.ReopenReason = formData["Notes"]
      document.getElementById('root').style.filter = 'none';
      updateDispute(dispatch,payload).then(res=>{
        let req = {}
        req.type = "create"
        req.notificationMessage = disputeJson?.notifyMessage.msg1+reopenOrder+disputeJson?.notifyMessage.msg2+"."
        req.organizationName = userType == "Barrel Fuel" ? reopenOrg : company
        req.loginUserName = userEmail
        req.sendNotificationTo = "ORG Internal"
        req.access_levels = ["Level 1 (Admin)","Level 2 (Standard)","Level 3 (Basic)"]
        req.levelOfAccess = access.includes('Super') ? "Level 1 (Admin)" : access.includes('Admin') ? "Level 2 (Standard)" : "Level 3 (Basic)"
        req.isActionable = false
        req.actionTaken = ""
        req.category = "account"
        req.readInd = false
        saveNotificationList(req,dispatch).then((res)=>{})
        
        let auditPayload = {"ModuleName":"Orders",
                  "TabName":"Dispute",
                  "Activity":"Dispute "+updateReq["Status"]+" For "+updateReq["OrderID"],
                  "ActionBy":Storage.getItem('email'),
                  "Role":JSON.parse(Storage.getItem('userRoles')),
                  "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
              saveAuditLogData(auditPayload, dispatch)
      }) 
      setrefresh(refresh+1)
    } else{
        setFormErrors(formerror)
        setModalText(disputeJson?.editmodal.validationMessage)
      }
      
  }
  const closeEditModal =()=>{
    seteditModalShow(false)
    setModalText('')
    let formerror = {...formErrors}
      formerror["Notes"] = false
      if(userType == "Barrel Fuel"){
      formerror["requestedBy"].activeValidator.errorMessage = null
      }
    setFormErrors(formerror)
    document.getElementById('root').style.filter = 'none';
  }
    const onRowClick= (data,row) =>{
      if(userType == "Operator"){
        if(row.status == "Open" || row.status == "Reopen"){
          prevScreen('viewopen',dispatch)
          DispData(data,dispatch)
          ReviewScreen(true,dispatch)
          navigate('/dashboard/viewopen',{state:{disp:data,review:true}})
        }else{
          prevScreen('viewopen',dispatch)
          DispData(data,dispatch)
          ReviewScreen(false,dispatch)
          navigate('/dashboard/viewopen',{state:{disp:data,review:false}})
        }
      }else if(userType == "FBO"){
        getDisputeData(row,dispatch)
        if(row["Buttons"][0].Label == "Review"){
          prevScreen('review',dispatch)
          viewScreen(true,dispatch)
          DispData(data,dispatch)
          ReviewScreen(true,dispatch)
          navigate('/dashboard/review',{state:{raisedUser:data.RaisedUser,review:true}})         
        }else if(row["Buttons"][0].Label == "View" && row.status == "Resolved"){
          prevScreen('review',dispatch)
          DispData(data,dispatch)
          ReviewScreen(false,dispatch)
          navigate('/dashboard/review',{state:{raisedUser:data.RaisedUser,review:false}})
        }else if(row["Buttons"][0].Label == "Cancel" && (row.status == "Open" || row.status == "Reopen")){
          prevScreen('viewopen',dispatch)
          DispData(data,dispatch)
          ReviewScreen(true,dispatch)
          navigate('/dashboard/viewopen',{state:{disp:data,review:true}})
        }else{
          prevScreen('viewopen',dispatch)
          ReviewScreen(false,dispatch)
          DispData(data,dispatch)
          navigate('/dashboard/viewopen',{state:{disp:data,review:false}})
        }
      }else{
        getDisputeData(row,dispatch)
        if(row["Buttons"][0].Label == "Review"){
          prevScreen('review',dispatch)
          viewScreen(true,dispatch)
          DispData(data,dispatch)
          ReviewScreen(true,dispatch)
          navigate('/dashboard/review',{state:{raisedUser:data.RaisedUser,review:true}})        
        }else if(row.status == "Resolved"){
          prevScreen('review',dispatch)
          DispData(data,dispatch)
          ReviewScreen(false,dispatch)
          navigate('/dashboard/review',{state:{raisedUser:data.RaisedUser,review:false}})
        }else{
          prevScreen('viewopen',dispatch)
          DispData(data,dispatch)
          ReviewScreen(false,dispatch)
          navigate('/dashboard/viewopen',{state:{disp:data,review:false}})
        }
      }
    }
    const getheadcells = (data) =>{
        let head = []
        data && data.content.headers.DisputeTab.map((item,index)=>{
            head[index] = item
        })
        setheadCells(head)
    }
    const getRowData=(data)=>{
      let i1=0
      let rowdata = []
      let mobileRowData = []
      data &&data.length&& data.forEach((item)=>{
        rowdata[i1] = getRows(item)
        mobileRowData[i1] = getMobileRows(item)
        i1++
      })
      setRows(rowdata)
      setMobileRows(mobileRowData)
    }

    const getMobileRows = (data) => {
        return{
          "orderid":data.Ordernumber,
          "date":new Date(data.DateDisputed).toLocaleDateString('en-US',{ year: 'numeric', month: '2-digit', day: '2-digit' }),
          "status":data.Status,
          "mobileButton":true
        }
     }
    const getRequestOption = (user,company,tail) =>{
      let requestedBy=[]
      let fboRequestedBy=[]
      if(user == "Operator"){
        getOperatorsByTailNum({"TailNumber":tail}).then((res)=>{
          if(res){
            let data = res && res.length && res[0].length && res[0][0]['JSON_UNQUOTE(@JSONResponse)']?JSON.parse(res[0][0]['JSON_UNQUOTE(@JSONResponse)']):[];
            data.map((value)=>{
              if(value.Operators[0].Operator==company){
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
      }else{
        let payload={"role":"FBO","FBO":company,"Loggedinuser":userEmail}
        getFboUsers(payload).then((res)=>{
          if(res){
            let data = res && res.length && res[0].length && res[0][0]['JSON_UNQUOTE(@JSONResponse)']?JSON.parse(res[0][0]['JSON_UNQUOTE(@JSONResponse)']):[];
            data.map((value)=>{
                  let obj={}
                  obj.title=value.RequestedBy
                  obj.value=value.RequestedBy
                  fboRequestedBy.push(obj)  
            })
          }
          setRequestedBy(fboRequestedBy)
        })
      }
      seteditModalShow(true)
    }
    const reviewClick = (row,data,btn,isMobile) =>{
      console.log("row----------", row)
      console.log("data----------", data)
      getDisputeData(row,dispatch)
      if(isMobile){
        row["Buttons"][0]=btn
      }
      if(row["Buttons"][0].Label == "Review"){
        prevScreen('review',dispatch)
        viewScreen(false,dispatch)
        DispData(data,dispatch)
        ReviewScreen(true,dispatch)
        navigate('/dashboard/review',{state:{raisedUser:data.RaisedUser,review:true}})
      }else if(row["Buttons"][0].Label == "View" && userType != "Operator"){
        if(row.status == "Canceled"){
          prevScreen('viewopen',dispatch)
          DispData(data,dispatch)
          ReviewScreen(false,dispatch)
          navigate('/dashboard/viewopen',{state:{disp:data,review:false}})
        }else if((row.status == "Open" || row.status == "Reopen") && data.RaisedUser=='Operator'){
          prevScreen('review',dispatch)
          viewScreen(true,dispatch)
          DispData(data,dispatch)
          ReviewScreen(true,dispatch)
          navigate('/dashboard/review',{state:{disp:data,review:false}})
        }else if((row.status == "Open" || row.status == "Reopen") && data.RaisedUser=='FBO'){
          prevScreen('viewopen',dispatch)
          DispData(data,dispatch)
          ReviewScreen(true,dispatch)
          navigate('/dashboard/review',{state:{disp:data,review:false}})
        }else{
          DispData(data,dispatch)
          ReviewScreen(false,dispatch)
          prevScreen('review',dispatch)
        navigate('/dashboard/review',{state:{disp:data,review:false}})
        }
      }else if(row["Buttons"][0].Label == "View" && userType == "Operator"){
        prevScreen('viewopen',dispatch)
        DispData(data,dispatch)
        if(data.Status=='Open' || data.Status=='Reopen'){
          ReviewScreen(true,dispatch)
        }else{
          ReviewScreen(false,dispatch)
        }
        navigate('/dashboard/viewopen',{state:{disp:data,review:false}})
      }else if(row["Buttons"][0].Label == "Cancel"){
        let payload = {
          "role":userType == "Barrel Fuel" ? "BFUser" : userType,
          "Loggedinuser":userEmail,
          "Status":"Canceled",
          "DisputeID":data.DisputeID,
          "OrderID":data.OrderID
        }
        setupdateReq(payload)
        setShow(true)
        document.getElementById('root').style.filter = 'blur(5px)';
      }else if(row["Buttons"][0].Label == "Reopen"){
        let payload = {
          "role":userType == "Barrel Fuel" ? "BFUser" : userType,
          "Loggedinuser":userEmail,
          "Status":"Reopen",
          "DisputeID":data.DisputeID,
          "ReopenReason":""
        }
        setReopenOrder(data.Ordernumber)
        if(userType == "Barrel Fuel"){
          getRequestOption(data.RaisedUser,data.OrganizationName,data.TailNumber)
          setReopenOrg(data.OrganizationName)
        }else{
          seteditModalShow(true)
        }
        document.getElementById('root').style.filter = 'blur(5px)';
        setupdateReq(payload)
      }
    }
    const onRow = () =>{
      
    }
    const SuccessModal = () =>{
      setShow(false)
      document.getElementById('root').style.filter = 'none';
      updateDispute(dispatch,updateReq).then(res=>{
        let auditPayload = {"ModuleName":"Orders",
                  "TabName":"Dispute",
                  "Activity":"Dispute "+updateReq["Status"]+" For "+updateReq["OrderID"],
                  "ActionBy":Storage.getItem('email'),
                  "Role":JSON.parse(Storage.getItem('userRoles')),
                  "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
              saveAuditLogData(auditPayload, dispatch)
      })
      document.getElementById('root').style.filter = 'none';
      setrefresh(refresh+1)

    }
    const closeModal = () => {
        setShow(false)
        document.getElementById('root').style.filter = 'none';
      }
    const getRows = (data) => {
      if(userType == "Barrel Fuel"){
        let button = []
        if(data.Status == "Open" || data.Status == "Reopen" || data.Status == "Escalated"){
          button = [{"name":"button","Label":"Review","method":reviewClick,"payload":data,"className":"btn btn-bf-primary"}]
        }else if(data.Status == "Resolved"){
          button = [{"name":"button","Label":"Reopen","method":"","payload":data,"className":"btn btn-bf-primary"}]
        }else{
          button = [{"name":"button","Label":"View","method":onRowClick,"payload":data,"className":"btn btn-bf-primary"}]
        }
        return{
          "orderid":data.Ordernumber,
          "date":new Date(data.DateDisputed).toLocaleDateString('en-US',{ year: 'numeric', month: '2-digit', day: '2-digit' }),
          "location":data.Location,
          "raised":data.RaisedBy,
          "dispReason":data.Reasons,
          "status":data.Status,
          "Buttons":button
        }

      }else if(userType == "FBO"){
        let button = []
        let MobileButton = []
        if(data.Status == "Open" || data.Status == "Reopen" || data.Status == "Escalated"){
          if(data.RaisedUser == "FBO"){
            button = [{"name":"button","Label":"Cancel","method":"","payload":data,"className":"btn btn-bf-primary"}]
            MobileButton = [{"name":"button","Label":"Cancel","method":"","payload":data,"className":"btn btn-bf-primary"},{"name":"button","Label":"View","method":"","payload":data,"className":"btn btn-bf-primary"}]
          }else{
            button = [{"name":"button","Label":"Review","method":reviewClick,"payload":data,"className":"btn btn-bf-primary"}]
            MobileButton = [{"name":"button","Label":"View","method":"","payload":data,"className":"btn btn-bf-primary"}]
          }
        }else if(data.Status == "Resolved"){
          if(data.RaisedUser == "FBO"){
            button = [{"name":"button","Label":"Reopen","method":"","payload":data,"className":"btn btn-bf-primary"}]
            MobileButton = [{"name":"button","Label":"Reopen","method":"","payload":data,"className":"btn btn-bf-primary"},{"name":"button","Label":"View","method":"","payload":data,"className":"btn btn-bf-primary"}]
          }else{
            button = [{"name":"button","Label":"View","method":reviewClick,"payload":data,"className":"btn btn-bf-primary"}]
          }
        }else if(data.Status == "Canceled"){
          button = [{"name":"button","Label":"View","method":onRowClick,"payload":data,"className":"btn btn-bf-primary"}]
        }
        return{
          "orderid":data.Ordernumber,
          "date":new Date(data.DateDisputed).toLocaleDateString('en-US',{ year: 'numeric', month: '2-digit', day: '2-digit' }),
          "location":data.Location,
          "raised":data.RaisedBy,
          "dispReason":data.Reasons,
          "status":data.Status,
          "Buttons":button,
          "MobileButtons":MobileButton
        }
      }else{
        let button = []
        let MobileButton = []
        if(data.Status == "Open" || data.Status == "Reopen"){
          button = [{"name":"button","Label":"Cancel","method":"","payload":data,"className":"btn btn-bf-primary"}]
          MobileButton = [{"name":"button","Label":"Cancel","method":"","payload":data,"className":"btn btn-bf-primary"},{"name":"button","Label":"View","method":"","payload":data,"className":"btn btn-bf-primary"}]
        }else if(data.Status == "Resolved"){
          button = [{"name":"button","Label":"Reopen","method":"","payload":data,"className":"btn btn-bf-primary"}]
          MobileButton = [{"name":"button","Label":"Reopen","method":"","payload":data,"className":"btn btn-bf-primary"},{"name":"button","Label":"View","method":"","payload":data,"className":"btn btn-bf-primary"}]
        }else if(data.Status == "Canceled"){
          button = [{"name":"button","Label":"View","method":onRowClick,"payload":data,"className":"btn btn-bf-primary"}]
        }
        return{
          "orderid":data.Ordernumber,
          "date":new Date(data.DateDisputed).toLocaleDateString('en-US',{ year: 'numeric', month: '2-digit', day: '2-digit' }),
          "location":data.Location,
          "raised":data.RaisedBy,
          "dispReason":data.Reasons,
          "status":data.Status,
          "Buttons": button,
          "MobileButtons":MobileButton
        }
      }
     }
      return (
            <>  
        <div className={`bf-table-container bf-table-disputes-container bf-table-search-results bf-tax-table-container ${userType == 'Barrel Fuel' ? 'bf-internal-disputes-table-container': userType == 'FBO' ? 'bf-fbo-disputes-table-container' : 'bf-operator-disputes-table-container' }`}>
          <BFTable
            sortEnabled={true}
            searchEnabled={false}
            Data={rows && rows}
            heading={headCells}
            searchBy={[""]}
            onClick={reviewClick}
            rowClick={onRowClick}
            onRowClick={onRow}
            loading={isBusy}
          >
          </BFTable>
          <BFTable 
            sortEnabled = {false} 
            searchEnabled={false} 
            Data ={mobileRows && mobileRows} 
            heading={disputeJson?.content?.mobileHeadCells}
            onClick={reviewClick}
            isUserMobileTab = {true}
            isMobileTable = {true}
            viewLabels = {headCells && headCells}
            viewData = {rows && rows} 
            // jsonData = {jsonData}
            viewLabel = {disputeJson?.content?.mobileViewHeader}
          >
          </BFTable>
          {showModal && <CustomModal
        show={showModal}
        onHide={() => SuccessModal()}
        close={() => closeModal()}
        hide={() => closeModal()}
        isPrompt={true}
        modelBodyContent={disputeJson?.modal[0].message}
        buttonText={disputeJson?.modal[0].text}
        secondbutton={disputeJson?.modal[0].text2}
    />}
            <EditFormModal
         onHide={() => closeEditModal()}
         formErrors={formErrors}
         formdata={formData}
         show={editmodalShow}
         json={userType == "Barrel Fuel" ? disputeJson?.editmodalBF : disputeJson?.editmodal}
         onHandleChange={handleChange}
         onHandleBlur={handleBlur}
         onClickSubmit={onClickSubmit}
         customOptions = {userType == "Barrel Fuel" ? true:false}
         showError = {modalText}
         customButtons={true}
         primaryButtonText={"Submit"}
         secondbutton={"Cancel"}
         modalClassName={"bf-cancel-modal"}
         userOptions={requestedBy}
    />
        </div>         
          
          
          
          
      </>
    
    );

}
