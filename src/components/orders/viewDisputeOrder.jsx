import React, { useState,useEffect,useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getFieldIsValid, getFormattedMMDDYY, getFormErrorRules, phoneValidation } from '../../controls/validations';
import { getJSONData, getOrderTab } from '../../actions/orderActions/orderCompletedAction';
import { filterOrderTable } from './orderFilter';
import Loader from '../loader/loader';
import { fetchCaseNotesDetails, fetchDisputeDetails, updateDispute } from '../../actions/orderActions/disputeOrderAction';
import OrderView from './orderView';
import DisputeLogs from './disputeLogs';
import { bfaJsonService } from '../../actions/BFAServices/BFAJsonService';
import { getDisputeOrder } from '../../actions/orderActions/disputeAction';
import CustomModal from '../customModal/customModal';
import AccordionModal from '../customModal/accordionModal';
import EditFormModal from '../customModal/editModal';
import {saveAuditLogData } from '../../actions/auditLog/auditLogActions';
import { Storage} from '../../controls/Storage';
import { saveNotificationList } from '../../actions/notificationService/notificationAction';

export default function ViewDisputeOrder() {
    let { state } = useLocation()
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({})
    const [isBusy, setBusy] = useState(true)
    const [reviewJson , setReviewJson] = useState(null)
    const [disputeVal, setdisputeVal] = useState({});
    const [DisputeFormData, setDisputeFormData] = useState({});
    const [updateReq,setupdateReq] = useState({})
    const [showModal,setShow] = useState(false)
    const [history,setHistory] = useState(false)
    const [DisputeError,setDisputeError] = useState({})
    const [modalText, setModalText] = useState('');
    const params = {"blobname":"reviewDispute.json"}
    const [editmodalShow, seteditModalShow] = useState(false);
    const [refresh,setRefresh] = useState(0)
    const raisedUser = state && state.data && state.data.RaisedUser != null ? state.data.RaisedUser : ""
    // const dispute = state && state.disp && state.disp != null ? state.disp : ""
    // const Review = state && state ? state.review : ""
    const disputeRed = useSelector((state) => state.disputeReducer)
    const dispData = disputeRed && disputeRed.disputeData && disputeRed.disputeData.data
    const dispute = disputeRed && disputeRed.DispData && disputeRed.DispData.data
    const Review = disputeRed && disputeRed.ReviewScreen && disputeRed.ReviewScreen.data
    const loginReducer = useSelector(state => state.loginReducer);
    const loginDetails = loginReducer && loginReducer.loginDetails &&loginReducer.loginDetails.data;
    const accessLvl = loginReducer?.loginAccessLevel?.data ? loginReducer?.loginAccessLevel?.data :[]
    const access =  JSON.parse(accessLvl)
    let loginDetls =  JSON.stringify(loginDetails) === '{}'?{}:JSON.parse(loginDetails);
    let userType = loginDetls.userType?loginDetls.userType:'';
    let userEmail = loginDetls.loginUserName?loginDetls.loginUserName:'';
    const payload = {
        "role":userType == "Barrel Fuel" ? "BFUser" : userType,
        "disputeid":dispute.DisputeID,
        "Loggedinuser":userEmail
    }
    useEffect(()=>{
        fetchDisputeDetails(dispatch,payload).then(res=>{
            let data = res && res.length && res[0].length && res[0][0]['JSON_UNQUOTE(@JSONResponse)']?JSON.parse(res[0][0]['JSON_UNQUOTE(@JSONResponse)']):[];
            callDispute(data)    
            getFormValues(data)
            setdisputeVal(data)
            })
        
    },[refresh]);
    useEffect(() => {
      bfaJsonService(params).then(response=>{
          setReviewJson(response.data.reviewData)
          setDisputeState(response.data.reviewData.disputeManagement)
      })
  },[]);
  useEffect(() => {
    return()=>{
     document.getElementById('root').style.filter = 'none';
    }
 }, [])
    const callDispute = (data) =>{
      getDisputeOrder(data,dispatch)
    }
    const setDisputeState = (data) => {
      const formDataSet = {};
      let formErrors = {};
      const fieldTypeArr = ['input', 'select','textarea'];
      setModalText('')
      data && data.editmodal.fields.forEach((item) => {
          if (fieldTypeArr.includes(item.component.toLowerCase())) {
              formDataSet[item.name] =DisputeFormData && DisputeFormData[item.name]? DisputeFormData[item.name]: "";
              formErrors[item.name] = false
          }
      })
      data && data.fields.forEach((item) => {
          if (fieldTypeArr.includes(item.component.toLowerCase())) {
              formDataSet[item.name] =DisputeFormData && DisputeFormData[item.name]? DisputeFormData[item.name]: "";
              formErrors[item.name] = false
          }
      })
      setDisputeFormData(formDataSet)
      setDisputeError(formErrors)
  } 
    const handleDispChange= (e, item) => {
      let formData = [];
      let fieldValue;
      let fieldName;
      let formerror = {...DisputeError}
      let fields = [];
      let target = e.target;

      fieldName = item.name;
      fieldValue = target.value;
      fields = JSON.parse(JSON.stringify(DisputeFormData));
      if(item.name == "Notes"){
        formerror["Notes"] = false
        setModalText('')
      }
      fields[fieldName] = fieldValue;
      setDisputeFormData(fields);
      setDisputeError(formerror)
  }
  const onModalSubmit =(e,item)=>{
    let formerror = {...DisputeError}
    let isValid = true
        if(DisputeFormData["Notes"] == ""){
          isValid = false
          formerror["Notes"] = true
        }
    if(isValid){
      seteditModalShow(false)
      document.getElementById('root').style.filter = 'none';
      let payload = {...updateReq}
      payload.ReopenReason = DisputeFormData["Notes"]
      updateDispute(dispatch,payload).then(res=>{
        let auditPayload = {"ModuleName":"Orders",
                  "TabName":"Dispute",
                  "Activity":updateReq["Status"]+" the dispute for disputed id "+updateReq["DisputeID"],
                  "ActionBy":Storage.getItem('email'),
                  "Role":JSON.parse(Storage.getItem('userRoles')),
                  "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
              saveAuditLogData(auditPayload, dispatch)
              let req = {}
              req.type = "create"
              req.notificationMessage = reviewJson.notifyMessage.msg12+disputeVal?.OrderDetails[0].OrderLegs[0].OrderNumber+reviewJson.notifyMessage.msg5+"."
              req.organizationName = raisedUser == "Operator" ? disputeVal?.OrderDetails[0].OperatorName : disputeVal?.OrderDetails[0].OrderLegs[0].FBO
              req.loginUserName = userEmail
              req.sendNotificationTo = "ORG Internal"
              req.access_levels = ["Level 1 (Admin)","Level 2 (Standard)","Level 3 (Basic)"]
              req.levelOfAccess = access.includes('Super') ? "Level 1 (Admin)" : access.includes('Admin') ? "Level 2 (Standard)" : "Level 3 (Basic)"
              req.isActionable = false
              req.actionTaken = ""
              req.category = "account"
              req.readInd = false
              saveNotificationList(req,dispatch).then((res)=>{})
      
      })
      getOrderTab('dispute',dispatch)
      navigate(`/dashboard/order/dispute`)
    }else{
      setModalText(reviewJson.disputeManagement.editmodal.validationMessage)
      setDisputeError(formerror)
    }
}
const closeEditModal =()=>{
  setModalText('')
  let formerror = {...DisputeError}
  formerror["Notes"] = false
  seteditModalShow(false)
  setDisputeError(formerror)
  document.getElementById('root').style.filter = 'none';
}
  const onDisputeSubmit=(e,item)=>{
      if(item.label == "Back"){
          getOrderTab('dispute',dispatch)
          navigate(`/dashboard/order/dispute`)
      }
      if(item.label == "Reopen"){
        seteditModalShow(true)
        document.getElementById('root').style.filter = 'blur(5px)';
        let payload = {
            "role":userType == "Barrel Fuel" ? "BFUser" : userType,
            "Loggedinuser":userEmail,
            "Status":"Reopen",
            "DisputeID":disputeVal.DisputeId,
            "ReopenReason":""
          }
          setupdateReq(payload)
      }
      if(item.label == "Submit"){
        if(DisputeFormData["action"] == "Cancel" && DisputeFormData["notesLog"] != ''){
          let payload = {
              "role":userType == "Barrel Fuel" ? "BFUser" : userType,
              "Loggedinuser":userEmail,
              "Status":"Canceled",
              "DisputeID":disputeVal.DisputeId,
              "Notes": DisputeFormData["notesLog"]
            }
            setupdateReq(payload)
            setShow(true)
            setModalText(reviewJson.modal[0].cancel)
        }else{
          if(DisputeFormData["action"] != '' && DisputeFormData["notesLog"] != ''){
          let payload = {}
          payload.role = userType == "Barrel Fuel" ? "BFUser" : userType
          payload.RaisedBy = disputeVal.RaisedBy
          payload.DisputeID = disputeVal.DisputeId
          payload.Action = DisputeFormData["action"]
          payload.Notes = DisputeFormData["notesLog"]
          fetchCaseNotesDetails(dispatch,payload).then((res=>{
            let auditPayload = {"ModuleName":"Orders",
                    "TabName":"Dispute",
                    "Activity":payload.Action+" action take on disputed id "+payload.DisputeID,
                    "ActionBy":Storage.getItem('email'),
                    "Role":JSON.parse(Storage.getItem('userRoles')),
                    "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
                saveAuditLogData(auditPayload, dispatch)
          }))
          let Disputefield = {...DisputeFormData}
          Disputefield["action"] = ""
          Disputefield["notesLog"] = ""
          setDisputeFormData(Disputefield)
          setRefresh(!refresh)
          }else{
            let disperror = {...DisputeError}
            if(DisputeFormData["action"] == ''){disperror["action"] = true}
            if(DisputeFormData["notesLog"] == ''){disperror["notesLog"] = true}
            setDisputeError(disperror)
            setShow(true)
            setModalText(reviewJson.modal[0].message)
          }
        }
      }
  }
  const closeModal = () => {
    setShow(false)
    setHistory(false)
    document.getElementById('root').style.filter = 'none';
  }
  const showHistory=()=>{
    setHistory(true)
    document.getElementById('root').style.filter = 'blur(5px)';
  }
  const SuccessModal = () =>{
    setShow(false)
    
    document.getElementById('root').style.filter = 'none';
    if(modalText == reviewJson.modal[0].cancel){
    updateDispute(dispatch,updateReq).then(res=>{
      let auditPayload = {"ModuleName":"Orders",
                  "TabName":"Dispute",
                  "Activity":updateReq["Status"]+" the dispute for disputed id "+updateReq["DisputeID"],
                  "ActionBy":Storage.getItem('email'),
                  "Role":JSON.parse(Storage.getItem('userRoles')),
                  "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
              saveAuditLogData(auditPayload, dispatch)

    })
    navigate(`/dashboard/order/dispute`)  
    }
  }
  const handleDisputeBlur= (e, item) => {

  }
    const getFormValues= (data) =>{
        let fieldData = data && data?.OrderDetails[0]?.OrderLegs[0]
        // let data = legData && legData
        // let fieldData = legData && legData.OrderLegs && legData.OrderLegs.length ?  legData?.OrderLegs[0] :{}
          fieldData["OrderDate"] = data?.OrderDetails[0].OrderDate ?getFormattedMMDDYY(data.OrderDetails[0].OrderDate) :""
          fieldData["OperatorName"] =data?.OrderDetails[0].OperatorName ?data.OrderDetails[0].OperatorName :""
          fieldData["OrderStatus"] = data?.OrderDetails[0].OrderLegs[0]?.OrderStatus ?data.OrderDetails[0].OrderLegs[0].OrderStatus :""
          fieldData["CreatedBy"] = data?.OrderDetails[0].RequestByName?data.OrderDetails[0].RequestByName :""
          fieldData["PhoneNumber"] = data?.OrderDetails[0].Operator_ContactNumber?phoneValidation(data.OrderDetails[0].Operator_ContactNumber.toString()) : phoneValidation("7865435786")
          fieldData["RequestBy"] = data?.OrderDetails[0].RequestBy?data.OrderDetails[0].RequestBy :""
          fieldData["address"] =data?.OrderDetails[0].OrderLegs[0]?.Address?data?.OrderDetails[0].OrderLegs[0].Address :""
          fieldData["FuellingDate"] =  data?.OrderDetails[0].OrderLegs[0]?.FuellingDate?getFormattedMMDDYY(data?.OrderDetails[0].OrderLegs[0].FuellingDate) :""
          setFormData(fieldData)
          setBusy(false)
        }

        return (<>
            {isBusy ? (
              (<Loader/>)
            ) : ( <div className='bf-order-placement-home bf-disputes-container bf-review-dispute'>
                <div className='bf-order-heading'>View {dispute.Status} Dispute - {dispute.Ordernumber}</div>
                <div className='bf-order-admin-view'>
                  <div></div>
                  <a onClick={(e)=>{showHistory()}} className='bf-hyperlink bf-order-history'>{reviewJson.reviewInformation.link.label}</a></div>
                <div className='bf-order-management-home d-flex d-flex-row bf-view-dispute-container'>
                  <div className="bf-order-creation">
                            <OrderView
                                  formDataSet = {formData && formData}
                                />
                            
                  </div>
                  {showModal && <CustomModal
                show={showModal}
                onHide={() => SuccessModal()}
                close={() => closeModal()}
                hide={() => closeModal()}
                size={''}
                isPrompt={true}
                modelBodyContent={modalText}
                buttonText={modalText == reviewJson.modal[0].message ? reviewJson.modal[0].text : reviewJson.modal[0].button1}
                secondbutton={modalText == reviewJson.modal[0].cancel ? reviewJson.modal[0].button2 : null}
    />}
        {history && <AccordionModal
        show={history}
        onHide={() => closeModal()}
        orderNumber = {dispute.Ordernumber}
        buttonText={"Dismiss"}
        modalId={"bf-modal-accordion"}
    />}
                    <EditFormModal
         onHide={() => closeEditModal()}
         formErrors={DisputeError}
         formdata={DisputeFormData}
         dispute={true}
         show={editmodalShow}
         json={reviewJson.disputeManagement.editmodal}
         onHandleChange={handleDispChange}
         onHandleBlur={handleDisputeBlur}
         onClickSubmit={onModalSubmit}
         showError = {modalText}
         customOptions = {false}
         customButtons={true}
         primaryButtonText={"Submit"}
         secondbutton={"Cancel"}
         modalClassName={"bf-cancel-modal"}
    />
                    <DisputeLogs
                    dispute = {dispute}
                    Logs={reviewJson.disputeManagement}
                    handleChange={handleDispChange}
                    handleBlur={handleDisputeBlur}
                    onClickSubmit={onDisputeSubmit}
                    formDataSet={DisputeFormData}
                    formErrors={DisputeError}
                    DisputeVal={disputeVal && disputeVal && disputeVal}
                    review={Review}
                    />
                  </div>
                </div>  
            )}
            </>)
}