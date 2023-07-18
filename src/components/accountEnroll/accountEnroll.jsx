import React, { useState,useEffect } from 'react';
import CustomModal from '../customModal/customModal';
//import { GoogleCaptcha } from '../../controls/GoogleCaptchaV3'
import { useSearchParams,useLocation , useNavigate,Route,Routes} from 'react-router-dom';
import logo from '../../assets/images/barrel_fuel_logo.png'
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import './accountEnroll.scss'
import { accountEnrolljson,enrollmentComplete,enrollmentNew,enrollmentPending } from '../../actions/accountEnrollService/accountEnrollService';
import Row from 'react-bootstrap/Row';
import Input from '../input/input';
import Select from '../select/select';
import Radio from '../radio/radio';
import ButtonComponent from '../button/button';
import FilterTable from '../table/filterTable'
import BFTable from '../table/table'
import { bfaJsonService} from '../../actions/BFAServices/BFAJsonService';
import Loader from '../loader/loader';
import { Storage} from '../../controls/Storage';
import { useDispatch, useSelector } from 'react-redux';
import FboSignupForm from '../fboSignup/FboSignupForm';
import OperatorSignupForm from '../operatorSignupForm/operatorSignupForm';
import { newEnrollmentList,pendingEnrollmentList,completeEnrollmentList, getOnboardingView } from '../../actions/accountEnrollService/accountEnrollAction';
import enrollmentReducer from '../../reducers/enrollmentReducer/enrollmentReducer';
import { phoneValidation } from '../../controls/validations';
import commonReducer from '../../reducers/commonReducer/commonReducer';
import { showClientscreen } from '../../actions/commonActions/commonActions';
import { saveNotificationList } from '../../actions/notificationService/notificationAction';
import {saveAuditLogData } from '../../actions/auditLog/auditLogActions';


export default function AccountEnroll(){


    // const [fetchoperatordata, setfetchoperatordata] = useState({})
    const [isBusy, setBusy] = useState(true)
    // const [modalShow, setModalShow] = React.useState(false);
    // const [modalText, setModalText] = React.useState('');
    const [formData , setFormData] = useState({});
    const [checked, setchecked] = useState(false)
    const [accountData , setaccountData] = useState(null);
    const [headCells, setheadCells] = useState(null);
    const [tabclick, settabclick] = useState('New');
    const [fborow,setfborow] = useState(null)
    const [operatorrow,setoperatorrow] = useState(null)
    const [pendfborow,setpendfborow] = useState([])
    const [pendoperatorrow,setpendoperatorrow] = useState([])
    const [compfborow,setcompfborow] = useState([])
    const [compoperatorrow,setcompoperatorrow] = useState([])
    const [signupShow, setsignupShow] = useState(null)
    const [fboprop, setfboprop] = useState({})
    const [fboJson, setfboJson] = useState({})
    const [operatorprop, setoperatorprop] = useState({})
    const [operatorJson, setoperatorJson] = useState({})
    const [modalShow, setModalShow] = useState(false);
    const [signup,setsignup] = useState(null)
    const loginName = Storage.getItem('email')
    const [refresh,setrefresh]=useState(0);
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const params = {"blobname":"accountEnrollment.json"}
    //const params = {"blobname":process.env.REACT_APP_READ_OPERATOR_ENROLLMENT_BLOBNAME}

    const enrollmentReducer = useSelector((state) => state.enrollmentReducer);
    const newEnroll = enrollmentReducer && enrollmentReducer.enrollmentNewData && enrollmentReducer.enrollmentNewData 
    const screenView = enrollmentReducer && enrollmentReducer.onboardingView && enrollmentReducer?.onboardingView?.data
    const clientReducer = useSelector((state) => state.commonReducer)
    const clienttable = clientReducer && clientReducer.clientScreen && clientReducer.clientScreen.data 
    useEffect(() => {
      setBusy(true)
      
        bfaJsonService(params).then(response=>{
            setaccountData(response.data.accountEnroll)
            setInitialState(response.data.accountEnroll)
            // getheadcells(tabclick,response.data.accountEnroll)
            
        })
        newEnrollmentList(dispatch).then(response=>{ // stared for on bording
            getrows('New',response.data.res)
        })
        pendingEnrollmentList(dispatch).then(response=>{ 
          getrows('Pending',response.data.res)
          //overdueEnrollment(response.data.res)
        })
        completeEnrollmentList(dispatch).then(response=>{         
          getrows('Completed',response.data.res)
        })

    }, [refresh])
    useEffect(()=>{
      let formd = formData
      if(screenView && screenView?.toLowerCase() == 'operator'){
        setchecked(true)
        getheadcells(tabclick,accountData,true)
        formd["organizationType"] = "Operator"
      }else{
        setchecked(false)
        getheadcells(tabclick,accountData,false)
        formd["organizationType"] = "FBO"
      }
      setFormData(formd)
    },[screenView,signupShow,accountData])
    useEffect(()=>{
      if(clienttable){
        setsignupShow(null)
      }
      console.log(clienttable)
    },[clienttable])

    const getrows = (tab,payload) =>{
      const fbo = [];
      const operator = [];
      const pendfbo = [];
      const pendoperator = [];
      const compfbo = [];
      const compoperator = [];
      let i1 = 0;
      let j1 = 0;
      let i2 = 0;
      let j2 = 0;
      let i3 = 0;
      let j3 = 0;
      if(tab == 'New'){
      payload && payload.forEach((item)=>{
        if(item.noOfAircrafts == 0){
          fbo[i1] = getrowdata(tab,item)
          i1++
        }else if(item.noOfAircrafts != 0){
          operator[j1] = getrowdata(tab,item)
          j1++
        }
      })
      setfborow(fbo)
      setoperatorrow(operator)
    }
    if(tab == 'Pending'){
      payload && payload.forEach((item)=>{
        if(item.noOfAircrafts == 0){
          pendfbo[i2] = getrowdata(tab,item)
          i2++
        }else if(item.noOfAircrafts != 0){
          pendoperator[j2] = getrowdata(tab,item)
          j2++
        }
      })
      setpendfborow(pendfbo)
      setpendoperatorrow(pendoperator)
      setBusy(false)
    }
    if(tab == 'Completed'){
      payload && payload.forEach((item)=>{
        if(item.noOfAircrafts == 0){
          compfbo[i3] = getrowdata(tab,item)
          i3++
        }else if(item.noOfAircrafts != 0){
          compoperator[j3] = getrowdata(tab,item)
          j3++
        }
      })
      setcompfborow(compfbo)
      setcompoperatorrow(compoperator)
    }
    }

    const setInitialState= (Data)=> {
        const formData = {};
        //let formErrors = {};
        let data = {};
        let fields = [];
        const  formDataSet = formData;
        const fieldTypeArr = ['input', 'radio', 'select'];
        fields = Data && Data.content.primaryFields;
        fields && fields.forEach( (item) => {
            if (fieldTypeArr.includes(item.fieldType.toLowerCase())) {
                formData[item.name] = formDataSet && formDataSet[item.name] ? formDataSet[item.name] : screenView;
            }
        })
        
        setFormData(formData);
        //setFormErrors(formErrors);
    }

    // const overdueEnrollment = (enroll) => {
    //     enroll && enroll.forEach((item)=>{
    //       let jsonpayload = JSON.parse(item.jsonNode)
    //       if(item.username == loginName && jsonpayload.hasOwnProperty('timestamp')){
    //         let diff = new Date().getTime() - new Date(jsonpayload.timestamp).getTime()
    //         let time = Math.floor(diff / (1000*60*60*24))
    //         if(time > 2){
    //           let payload = {}
    //           payload.type = "update"
    //           payload.notificationMessage = "Are you still there? You have a sign-up pending."
    //           payload.organizationName = null
    //           payload.loginUserName = loginName
    //           payload.sendNotificationTo = "Individual"
    //           payload.individualUser = loginName
    //           payload.isActionable = false
    //           payload.actionTaken = ""
    //           payload.category = "account"
    //           payload.readInd = false
    //           saveNotificationList(payload).then((res)=>{

    //           })
    //         }
    //       }
    //     })
    // }

    const changeTab = (title) =>{
      settabclick(title)
      getheadcells(title,accountData,checked)
    }

    const fboSignupClick = (row,jsonpayload,item) =>{
      setsignup('FBO')
      let rowdata = {
        "firstName":item.row.firstName,
        "lastName":item.row.lastName,
        "emailId":item.row.email,
        "mobileNumber":item.row.phoneNumber && phoneValidation(item.row.phoneNumber.toString()),
        "companyName":item.row.companyName
      }
      // Storage.setItem('fboRow',JSON.stringify(row))
      // jsonpayload ? Storage.setItem('fboJson',jsonpayload) : Storage.setItem('fboJson',null)
      // navigate('/fbo-onboarding')
      let activity = tabclick === "Pending" ?"Onboarding Continued For "+item.row.companyName:"Onboarding Started For "+item.row.companyName
      let auditPayload = {"ModuleName":"Client Onboarding",
      "TabName":"Client Onboarding",
      "Activity":activity,
      "ActionBy":Storage.getItem('email'),
      "Role":JSON.parse(Storage.getItem('userRoles')),
      "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
      saveAuditLogData(auditPayload, dispatch) 

      setfboprop(rowdata)
      setfboJson(JSON.parse(jsonpayload))
      if(jsonpayload != null){
        if(row.username != Storage.getItem('email')){
            setModalShow(true)
        }else{
          setsignupShow(1)
          showClientscreen(false,dispatch)
        }
      }else{
            setsignupShow(1)
            showClientscreen(false,dispatch)
      }
    }
    const operatorClick = (row,jsonpayload,item) =>{
      setsignup('Operator')
      // Storage.setItem('operatorRow',JSON.stringify(row))
      // jsonpayload ? Storage.setItem('operatorJson',jsonpayload) : Storage.setItem('operatorJson',null)
      // navigate('/operator-onboarding')
      let rowdata = {
        "numberOfAircrafts":item.row.noOfAircrafts,
        "firstName":item.row.firstName,
        "lastName":item.row.lastName,
        "emailId":item.row.email,
        "mobileNumber":item.row.phoneNumber && phoneValidation(item.row.phoneNumber.toString()),
        "companyName":item.row.companyName
      }
      setoperatorprop(rowdata)
      setoperatorJson(JSON.parse(jsonpayload))
      let activity = tabclick === "Pending" ?"Onboarding Continued For "+item.row.companyName:"Onboarding Started For "+item.row.companyName
      let auditPayload = {"ModuleName":"Client Onboarding",
          "TabName":"Client Onboarding",
          "Activity":activity,
          "ActionBy":Storage.getItem('email'),
          "Role":JSON.parse(Storage.getItem('userRoles')),
          "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
      saveAuditLogData(auditPayload, dispatch)
      if(jsonpayload != null){
        if(row.username != Storage.getItem('email')){
            setModalShow(true)
        }else{
          setsignupShow(2)
          showClientscreen(false,dispatch)
        }
      }else{
            setsignupShow(2)
            showClientscreen(false,dispatch)
      }
    }

    const getTabs = ()=>{
        return(
          <div className='bf-tabs-container bf-mrgt20'>
            {accountData && accountData.content.userTabs ? 
            <>
              {accountData.content.userTabs.tabs.map((tab)=>(
                
                <Nav variant="tabs" className='bf-tabs' >
                  <Nav.Item>
                    <Nav.Link className={tabclick == tab.title ? 'bf-active-tab' : ''}  onClick={(e)=>{changeTab(tab.title)}}>{tab.title}</Nav.Link>
                  </Nav.Item>
                </Nav>
              ))}
            </> : null}
          </div>
        )
      }

    const getrowdata = (tab,item)=>{
            if(item.noOfAircrafts == 0){
              if(tab == 'New'){
              return{
                "name" :item.firstName+" "+item.lastName,
                "company" :item.companyName,
                "mode" : item.communicationMode,
                "email" :item.email,
                "phone" :item.phoneNumber && phoneValidation(item.phoneNumber.toString()),
                "Buttons" : [{"name":"button","Label":"Sign Up", "method":fboSignupClick,"row":item,"data":item,"payload":null,"className":"btn btn-bf-primary"}]};
              }else if(tab == 'Pending'){
                return{
                  "name" :item.firstName+" "+item.lastName,
                  "company" :item.companyName,
                  "mode" : item.communicationMode,
                  "email" :item.email,
                  "phone" :item.phoneNumber && phoneValidation(item.phoneNumber.toString()),
                  "assign" :item.username,
                  "Buttons" :[{"name":"button","Label":"Continue", "method":fboSignupClick,"row":item,"data":item,"payload":item.jsonNode,"className":"btn btn-bf-primary"}]};
              }else if(tab == 'Completed'){
                return {
                "name" :item.firstName+" "+item.lastName,
                "company" :item.companyName,
                "mode" : item.communicationMode,
                "email" :item.email,
                "phone" :item.phoneNumber && phoneValidation(item.phoneNumber.toString()),
                "assign" : item.username
                };
              }
            }else if(item.noOfAircrafts != 0){
              if(tab == 'New'){
                return{
                "name" :item.firstName+" "+item.lastName,
                "company" :item.companyName,
                "aircraft" :item.noOfAircrafts,
                "mode" : item.communicationMode,
                "email" :item.email,
                "phone" :item.phoneNumber && phoneValidation(item.phoneNumber.toString()),
                "Buttons":[{"name":"button","Label":"Sign Up", "method":operatorClick,"row":item,"data":item,"payload":null,"className":"btn btn-bf-primary"}]};
              }else if(tab == 'Pending'){
                return{
                  "name" :item.firstName+" "+item.lastName,
                  "company" :item.companyName,
                  "mode" : item.communicationMode,
                  "email" :item.email,
                  "phone" :item.phoneNumber && phoneValidation(item.phoneNumber.toString()),
                  "assign" : item.username,
                  "Buttons":[{"name":"button","Label":"Continue", "method":operatorClick,"row":item,"data":item,"payload":item.jsonNode,"className":"btn btn-bf-primary"}]};
              }else if(tab == 'Completed'){
                return {
                  "name" :item.firstName+" "+item.lastName,
                  "company" :item.companyName,
                  "mode" : item.communicationMode,
                  "email" :item.email,
                  "phone" :item.phoneNumber && phoneValidation(item.phoneNumber.toString()),
                  "assign" : item.username
                };
              }
            }

    }

    const showModal = () => {
      document.getElementById('root').style.filter = 'blur(5px)';
      return(
          <CustomModal
          show={modalShow}
          hide={() => closeModal()}
          onHide={() => navigateSignUp()}
          size={''}
          close={() => closed()}
          modelBodyContent={"Sign Up in Progress, Would You Like To Override ?"}
          buttonText={"Yes"}
          secondbutton={"Cancel"}
        />
      )
  }
  const closed = () => {
    setModalShow(false)
    document.getElementById('root').style.filter = 'none';
  }
  const closeModal = () =>{
    setModalShow(false)
    document.getElementById('root').style.filter = 'none';
  }
  const navigateSignUp = () =>{// override operater on boarign stated
    setModalShow(false)
    document.getElementById('root').style.filter = 'none';
    let activity = "Onboarding Overridden For "
      let auditPayload = {"ModuleName":"FBO SignUp",
          "TabName":"FBO SignUp",
          "Activity":activity,
          "ActionBy":Storage.getItem('email'),
          "Role":JSON.parse(Storage.getItem('userRoles')),
          "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
      saveAuditLogData(auditPayload, dispatch)
    if(signup == 'FBO'){
      setsignupShow(1)
      showClientscreen(false,dispatch)
    }else if(signup == 'Operator'){
      setsignupShow(2)
      showClientscreen(false,dispatch)
    }
  }
    const getheadcells = (tab,Data,ch) =>{
         const head = []
         if(tab == 'New'){
            if(ch){
              Data && Data.content.headers.NewOperator.map((item,index)=>{
                head[index] = item
              })}else{
                Data && Data.content.headers.NewFBO.map((item,index)=>{
                  head[index] = item                
              })}
        }else if(tab == 'Pending'){
              Data && Data.content.headers.Pending.map((item,index)=>{
                head[index] = item
          })
        }else{
             Data && Data.content.headers.Completed.map((item,index)=>{
                head[index] = item
          })
        }
         setheadCells(head)
    }

    const handleBlur= (e, item) => {
        let formDataSet = {};
        const fields = {};
        
        
    }
 
    const handleChange= (e, item) => {
        let formDataSet = {};
        const fields = {};
        let target = e.target; 
        let fieldName, fieldValue;
        fieldName = item.name;
        fieldValue = target.value;
        fields[fieldName] = fieldValue;
        if(item.name == 'organizationType'){
          getOnboardingView(fieldValue, dispatch)
          if(fieldValue == 'Operator'){
          setchecked(true)
          getheadcells(tabclick,accountData,true)
          }else{
            setchecked(false)
            getheadcells(tabclick,accountData,false)
          }
        }
        formDataSet = {
            ...formData,
            ...fields
          };
          setFormData(formDataSet); 
    }
    const gettablefields = () =>{
      if(tabclick == 'New'){
        let data = checked ? operatorrow : fborow
        return (<div className={checked ? 'bf-operator-ernroll-new bf-operator-enroll-'+tabclick : 'bf-fbo-enroll-new bf-fbo-enroll-'+tabclick}> 
          <BFTable Data ={data} 
                  heading={headCells} 
                  searchBy={["name", "email", "mobileNumber"]} 
                  sortEnabled ={true} 
                  searchEnabled ={false}
                  onClick = {checked ? operatorClick : fboSignupClick}
                  />
          </div>
        );}else if(tabclick == 'Pending'){
          let data = checked ? pendoperatorrow : pendfborow
          return (<div className={checked ? 'bf-operator-enroll-pending bf-operator-enroll-'+tabclick : 'bf-fbo-enroll-pending bf-fbo-enroll-'+tabclick}> 
            <BFTable Data ={data} 
                    heading={headCells} 
                    searchBy={["name", "email", "mobileNumber"]} 
                    sortEnabled ={true} 
                    searchEnabled ={false}
                    onClick = {checked ? operatorClick : fboSignupClick}
                    />
            </div>
          );
          }else if(tabclick == 'Completed'){
            let data = checked ? compoperatorrow : compfborow
            return (<div className={checked ? 'bf-operator-enroll-completed bf-operator-enroll-'+tabclick : 'bf-fbo-enroll-completed bf-fbo-enroll-'+tabclick}> 
              <BFTable Data ={data} 
                      heading={headCells} 
                      searchBy={["name", "email", "mobileNumber"]} 
                      sortEnabled ={true} 
                      searchEnabled ={false}
                      />
              </div>
            );
          }
    }
    const onClickSubmit = (e) =>{
    }
    const showOnboard = () =>{
      setsignupShow(null) 
      showClientscreen(true,dispatch) 
      setrefresh(refresh+1)      
    }
    const getEnrollFields = (item) => {
        switch(item.fieldType.toUpperCase()) {
        case "RADIO":
            return (<Radio type={item.fieldType} 
                Label={item.label} 
                Name={item.name}
                formDataSet={formData && formData[item.name] ? formData[item.name] : item.defaultValue ? item.label : ''}
                colWidth={item.styles ? item.styles.colWidth : ''}
                options={item.options}
                handleChange={(e) => handleChange(e, item)}
                handleBlur={(e) => handleBlur(e, item)}/>)
        case "BUTTON":
            return (<Row className='mb-3'><ButtonComponent 
                    Label={item.fieldLabel} 
                    Type={item.type}
                    className={item.className}
                    variant = {item.variant}
                    handleClick = {(e) => onClickSubmit(e)} /></Row>)
        case "PARAGRAPH":
            return (<div>{item.fieldLabel}</div> )
        }

    }

  return (<>
      {isBusy ? (
        (<Loader/>)
      ) : ( 
          <> {signupShow ? signupShow==1 ? <FboSignupForm addNewCompany={true} rowdata={fboprop} jsondata={fboJson} onboard={showOnboard}/> :
          <OperatorSignupForm addNewCompany={true} rowdata={operatorprop} jsondata={operatorJson} onboard={showOnboard}/> : 
        <div className='bf-account-enroll-container'>
          
        <Form>
        {modalShow ? showModal() : ''}   
        
        <div className='bf-checkbox'>
                {accountData && accountData.content.primaryFields.map((item) => (
                        getEnrollFields(item)                                                            
                ))}
        </div>
        <div>
              {getTabs()}
        </div>  
        <div className="bf-table">
              {gettablefields()}
        </div> 
        </Form>   
    </div>}   
    </>   
      )}        
        
        
        
        
    </>
  
  );
}
