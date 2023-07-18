import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { bfaJsonService } from '../../actions/BFAServices/BFAJsonService';
import Loader from '../loader/loader';
import './dispute.scss'
import BFTable from '../table/table'
import disputeReducer from '../../reducers/orderReducer/disputeReducer';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../input/input';
import Radio from '../radio/radio';
import Subheading from '../subHeading/subHeading';
import ButtonComponent from '../button/button';
import Select from '../select/select';
import { Row } from 'react-bootstrap';
import { Box } from '@mui/material';
import { getOrderRowData, getOrderTab } from '../../actions/orderActions/orderCompletedAction';
import TextArea from '../textArea/textArea';
import { invoiceScreen } from '../../actions/orderActions/disputeAction';
import BackIcon from '../../assets/images/collapse_arrow.svg';
import { getMobileHeaderText } from '../../actions/commonActions/commonActions';


export default function DisputeLogs(props) {
    const [formDataSet, setformDataSet] = useState({});
    const [disputeLog , setDisputeLog] = useState(null)
    const [isBusy, setBusy] = useState(true)
    const [reasons,setReasons] = useState([])
    const [time,setTime] = useState([])
    const disputeRed = useSelector((state) => state.disputeReducer)
    const dispData = disputeRed && disputeRed.disputeData && disputeRed.disputeData.data
    const dispute = disputeRed && disputeRed.DispData && disputeRed.DispData.data
    const disputeVal = disputeRed && disputeRed.disputeOrder && disputeRed.disputeOrder.data
    const View = disputeRed && disputeRed.viewScreen && disputeRed.viewScreen.data
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loginReducer = useSelector(state => state.loginReducer);
    const loginDetails = loginReducer && loginReducer.loginDetails &&loginReducer.loginDetails.data;
    let loginDetls =  JSON.stringify(loginDetails) === '{}'?{}:JSON.parse(loginDetails);
    let userType = loginDetls.userType?loginDetls.userType:'';
    //const timeLog = {"log1":["MM/DD/YYYY Dispute raised by Admin","Reason1","Reason2"]}
    
    const commonReducer = useSelector((state) => state.commonReducer);
    const loggedInUserType =  commonReducer?.loggedInUserType?.data;
    const box ={ 
        component: "box",
        name: "logbox",
        type: "box",
        label: "Log Box",
        text: "bold",
        content: []
        }
    useEffect(() => {
        setInitialState(disputeVal)
        setBusy(false)
        let reasonarray = disputeVal?.CaseNotes[0].Value.split(',')
        setReasons(reasonarray)
    },[disputeVal]);
    useEffect(() => {
        getMobileHeaderText(dispatch,"Dispute Log")
    },[]);

    const setInitialState = (dispute) => {

        setDisputeLog(props.Logs)
    }
    const viewOrder = () =>{
        let windowpath = window.location.pathname.toString()
        windowpath = windowpath.split("/")
        windowpath.splice(-1)
        windowpath.splice(1,1)
        let currpath=""
        windowpath.map((e)=>{
          currpath = currpath+e+'/'
        })
        getOrderRowData(disputeVal.OrderDetails[0],dispatch)
        invoiceScreen(true,dispatch)
        navigate(currpath+'/fuelorder/viewOrder')
    }
    const getOperatorFields = (item, index) => {
        switch (item.component.toUpperCase()) {
            case "INPUT":
                return (item.name == "notesLog" && props.review ? <Input
                   
                    colWidth={item.styles ? item.styles.colWidth : ""}
                    Type={item.type}
                    Label={item.label}
                    styles = {item.styles}
                    Placeholder={item.placeholder}
                    isRequred={item.isRequired}
                    Name={item.name}
                    handleChange={(e) => props.handleChange(e, item,index)}
                    handleBlur={(e) => props.handleBlur(e, item, index)} 
                    formDataSet={props.formDataSet && props.formDataSet[item.name] ? props.formDataSet[item.name] : item.defaultValue ? item.defaultValue : ''}
                      /> : '')  
            case "SELECT":
                let BFoption = []
                let FBOption = []
                if(userType=="Barrel Fuel" && View){
                    BFoption = item.optionsBFView
                }else{
                    BFoption = item.optionsBF
                }
                if(userType=="FBO" && View){
                    FBOption = item.optionsFBOView
                }else if(userType=="FBO" && dispData.Buttons[0].Label == "Cancel"){
                    FBOption = item.optionsOperator
                }else{
                    FBOption = item.optionsFBO
                }
            return (item.name == "action" && props.review ? <Select
                colWidth={item.styles ? item.styles.colWidth : ""}
                Type={item.type}
                Label={item.label}
                Placeholder={item.placeholder}
                dynamicSelect={item.dynamicSelect}
                lookupReference={item.dynamicSelect ? item.lookupReference : null}
                isRequred={item.isRequired}
                Options={userType=="Barrel Fuel" ? BFoption : userType=="FBO" ? FBOption : item.optionsOperator}
                Name={item.name}
                handleChange={(e) => props.handleChange(e, item)}
                handleBlur={(e) => props.handleBlur(e, item)}
                dependentField = {item.dependentField}
                dependentFieldVal = {item.dependentFieldVal}
                errorMessage = {props.formErrors[item.name] ? '' : null}
                formDataSet={props.formDataSet && props.formDataSet[item.name] ? props.formDataSet[item.name] :item.defaultValue ? item.defaultValue : ''} 
                /> : '')           
            case "PARAGRAPH":
              return (<Subheading label={item.label} />) 
            case "SPAN":
                return (<div className='heading'><span> {item.label} </span> <a onClick={(e)=>{viewOrder()}} className='bf-order-link bf-disputes-order-link'>{dispute.Ordernumber}</a></div>)  
            case "SPANBOLD":
                if(item.label == "Case Notes"){
                return (props.review ? <Row className={item.styles ? item.styles.className : ''}><span><b>{item.label} </b></span></Row> : '') 
                }else{
                    return (<Row className={item.styles ? item.styles.className : ''}><span><b>{item.label} </b></span></Row>)     
                }
            case "BOX":
                return (<div className="bf-dispute-reasons">
        {disputeVal?.CaseNotes?.length && disputeVal.CaseNotes.map((item,index)=>(<div>
            <div><b>{index == 0 ? new Date(item.Date).toLocaleDateString('en-US',{ year: 'numeric', month: '2-digit', day: '2-digit' }) + " - Disputed By " + item.AddedBy : item.Value == "Dispute Reopened" ? new Date(item.Date).toLocaleDateString('en-US',{ year: 'numeric', month: '2-digit', day: '2-digit' }) + " - Dispute Reopened By " + item.AddedBy : new Date(item.Date).toLocaleDateString('en-US',{ year: 'numeric', month: '2-digit', day: '2-digit' }) + " - Notes Added By " + item.AddedBy}</b></div>
            <div>{index == 0 ? (<>Reason :</>) : ''}</div>
            <div>{index == 0 ? (
            reasons && reasons.map((item,ind)=>(<div>
                {ind+1+". "+item}
            </div>))
            ) : ''}</div>
            <div>{index != 0 ? item.Value : ''}</div>
        </div>))} 
                </div>)       
            case "BUTTON":
                if(item.name == "submit" && props.dispute.Status == "Canceled"){

                }else if(item.name == "submit" && props.dispute.Status == "Resolved" && userType == "Operator"){
                    item.label = item.lables[1]
                    return (<ButtonComponent
                        Label={item.label}
                        Type={item.type}
                        className={item.styles.className}
                        variant={item.variant}
                        disabled={false}
                        handleClick={(e) => props.onClickSubmit(e,item)}
                         />)
                }else if(item.name == "submit" && props.dispute.Status == "Resolved" && userType == "FBO" && props.dispute.RaisedUser == "Operator"){
                    
                }else if(item.name == "submit" && props.dispute.Status == "Resolved" && userType == "FBO" && props.dispute.RaisedUser == "FBO"){
                    item.label = item.lables[1]
                    return (<ButtonComponent
                    Label={item.label}
                    Type={item.type}
                    className={item.styles.className}
                    variant={item.variant}
                    disabled={false}
                    handleClick={(e) => props.onClickSubmit(e,item)}
                     />)
                }else if(item.name == "submit" && props.dispute.Status == "Resolved" && userType == "Barrel Fuel"){
                    item.label = item.lables[2]
                    return (<ButtonComponent
                        Label={item.label}
                        Type={item.type}
                        className={item.styles.className}
                        variant={item.variant}
                        disabled={false}
                        handleClick={(e) => props.onClickSubmit(e,item)}
                         />)
                }else{
                    item.label = item.lables[0]
                    return (<ButtonComponent
                        Label={item.label}
                        Type={item.type}
                        className={item.styles.className}
                        variant={item.variant}
                        disabled={false}
                        handleClick={(e) => props.onClickSubmit(e,item)}
                         />)
                }

        case "TEXTAREA" :
                return( item.name == "notesLog" && props.review ?
                    <TextArea
                              Name={item.name?item.name:''}
                              Label={item.label?item.label:''}
                              colWidth={item.styles ? item.styles.colWidth : ""} 
                              Type={item.type} 
                              Placeholder={item.placeholder}
                              textLength={props.formDataSet[item.name]? props.formDataSet[item.name].length : "0"}
                              maxLength={item.maxLength}
                              isRequred={item.isRequired}
                              onChange={(e)=>props.handleChange(e,item)}
                              Rows={item.rows ? item.rows : 3}
                              restriction={item.lengthRestriction}
                              errorMessage = {props.formErrors[item.name] ? '' : null}
                              value={props.formDataSet[item.name]? props.formDataSet[item.name] : ""}
                            />
                    : '') 
        };
    } 
    return (<>
        {isBusy ? (
          (<Loader/>)
        ) : (<>
                <div className={`bf-dispute-log ${props.dispute && props.dispute.Status == 'Open' ? 'bf-operator-dispute' : props.dispute.Status == "Resolved" && userType == "FBO" && props.dispute.RaisedUser == "Operator" ? 'bf-operator-dispute bf-operator-dispute-fboresolve' : 'bf-operator-dispute bf-operator-dispute-' + (props.dispute.Status).toLowerCase()}`}>
                    <div className='bf-show-mobile bf-relative'>
                        <img src={BackIcon} className="bf-disputes-back" onClick={(e) => props.onClickSubmit(e, {"label" :"Back"})} />
                        <div className='bf-dispute-heading'>
                            {disputeLog.mobileFields.disputeHeadingText }
                        </div>
                        <div className='bf-order-details'>
                            {disputeLog.mobileFields.originalDetailsText } {<a onClick={(e)=>{viewOrder()}} className='bf-order-link'>{dispute.Ordernumber}</a>}
                        </div>
                    </div>
                    <div className='bf-order-summary-container bf-order-place-summary'>
                        <div className='bf-view-section'>
                            {disputeLog.fields.map((val)=>{
                                {
                                    if(val.show != 'below' && val.component != 'button') 
                                        return getOperatorFields(val)
                                    }
                                }
                            )}
                        </div>
                        <div className='actions-section'>
                            <div>
                                {disputeLog.fields.map((val)=>{
                                    {
                                        if(val.show == 'below') 
                                            return getOperatorFields(val)
                                        }
                                    }
                                )}
                            </div>
                            <div className='bf-btn-section'>
                            {disputeLog.fields.map((val)=>{
                                    {
                                        if(val.component == 'button') 
                                            return getOperatorFields(val)
                                        }
                                    }
                                )}
                            </div>
                        </div>
                    </div>
                </div>
        </>)}
    </>
    );





}