import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './orderData.scss'
import { fetchOrderDataJson } from '../../actions/orderPlacementActions/orderDataAction'
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { Col, Form, Row } from 'react-bootstrap'
import Subheading from '../subHeading/subHeading';
import Select from '../select/select';
import Input from '../input/input';
import DatePicker from '../datePicker/datePicker';
import { getFormattedMMDDYY, phoneValidation } from '../../controls/validations';
import Arrow from '../../assets/images/down-arrow.png';
import StripeIcon from '../../assets/images/powered_stripe.png';
import fboCompanyIcon from '../../assets/images/bf-fbo-logo.png';
import BackIcon from '../../assets/images/collapse_arrow.svg';
import { getIsPricePending, getIsSummary, getLegData, getLegLevel, getLegType, getMultiLegPricePending, getMultipleLeg } from '../../actions/orderPlacementActions/orderPlacementActions';
import { useNavigate } from 'react-router-dom';
import { getMobileHeaderText } from '../../actions/commonActions/commonActions';
import CustomModal from '../customModal/customModal';

export default function Orderdata(props) {
    const [waiveoffmsg, setwaiveoffmsg] = useState(false)
    const [jsonData, setJsonData] = useState({})
    const [jsonFields, setJsonFields] = useState([])
    const [jsonPayload, setJsonPayload] = useState({ 'blobname': 'orderPlacement.json' });
    const [servicesList, setServicesList] = useState();
    const [formData, setFormData] = useState();
    const [fboData, setFboData] = useState({});
    const [formErrors, setFormErrors] = useState({});
    const [multiLeg, setMultiLeg] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [serviceList, setServiceList] = useState([]);
    const [thresholdValue, setThresholdValue] = useState('');
    const orderPlacementReducer = useSelector((state)=>state.orderPlacementReducer);
    const orderPlacementDataReducer = useSelector((state)=>state.orderPlacementDataReducer);
    const orderPlacementDataJson = orderPlacementDataReducer?.orderPlacementJson?.data?.data;
    const isMulti = orderPlacementReducer?.isMultileg?.data;
    const orderLegLevel = orderPlacementReducer?.legLevel?.data;
    const multipleLeg = orderPlacementReducer?.multipleLeg?.data;
    const legData = orderPlacementReducer?.multiLegData?.data;
    const commonReducer = useSelector((state) => state.commonReducer);
    const loggedInUser = commonReducer?.loggedInUser?.data;
    const loggedInUserType =  commonReducer?.loggedInUserType?.data;
    const multiLegReducer = useSelector(state => state.multiLegReducer);
    const editLegData = multiLegReducer?.editLegData?.data;
    const isEdit = multiLegReducer?.isEdit?.data;
    const navigate = useNavigate()
    const data = {
        "phoneNumber" : "9532970297",
    };
    const dispatch = useDispatch()
    useEffect(() => { 
      fetchOrderDataJson(dispatch, jsonPayload);
      getMobileHeaderText(dispatch, "New Fuel Order")
      props.isOrderClose ? getMobileHeaderText(dispatch, "Edit And Close") : props.isCancelDecline ? getMobileHeaderText(dispatch, "Canceld Order"): getMobileHeaderText(dispatch, "New Fuel Order")
        
    }, []);
    useEffect(()=>{
        setFormErrors(props.formErrors)
        setMultiLeg(multipleLeg)
    },[props.formErrors,multipleLeg])
    useEffect(()=>{
        if(props.formDataSet.legType=="Multiple Leg" && orderLegLevel + 1) {
            let heading = (isEdit? "Edit " : '' )+ "Leg " + ( orderLegLevel == 0 ? '1' : orderLegLevel)
            getMobileHeaderText(dispatch, heading)
        }
    },[orderLegLevel, isEdit])
    useEffect(() => {
        console.log(props?.fboData)
        setJsonData(orderPlacementDataJson);
        setServicesList(getservicesList(props.quantity))
        setFboData(props?.fboData?.fboInfo)
        let userType = ""
        let jsonFields = {}
        if(loggedInUserType == "Barrel Fuel"){
            userType = "internal"
        }else{
            userType = "operator" 
        }
        let jsonData = orderPlacementDataJson?.orderPlacementData?.ordersFields?.fields?.filter((item)=>item&&item.users&&item.users.includes(userType))
        jsonFields["fields"]= jsonData
        setJsonFields(jsonFields)
        setInitialState(jsonFields,false,props.formDataSet)
    }, [orderPlacementDataJson,props.formDataSet,props.fboData,props.taxesandFees])

    useEffect(()=>{
        setServicesList(getservicesList(props.quantity))
    },[props.fboData,props.quantity])
    const getservicesList = (quantity) => {
        let addServicesList = [];
        let minQuantity = 0
        let minValue = 0 
        let createServiceList = props.fboData?.fboInfo?.airportLocations[0]?.Services
        createServiceList && createServiceList.forEach((item) => {
            let field = {
                "name": item.Service,
                "label": item.Service,
                "unit": item.Unit,
                "givenAmount":item.Amount,
                "amount": getAmount(item,"service").toFixed(2),
                "actualAmount": item.ActualAmount,
                "waiverType": item.ThresholdtoWaive,
                "isSelected": true,
                "component": "checkbox",
                "waiveOffType":getWaiveOff(item)
            }
            if(item.ThresholdtoWaive == 'FuelGallons'){
                if(minQuantity == 0 || minQuantity >item.mingallons){
                    minQuantity = item.mingallons
                }
            }
            else if(item.ThresholdtoWaive == 'OrderValue'){
                if(minValue == 0 || minValue >item.minordervalue){
                    minValue = item.minordervalue
                }
            }
            addServicesList.push(field)
        })
        let orderValue = minQuantity * props.fuelPrice
        let threshold = 0
        if(minValue && orderValue > minValue){
            threshold = `$${minValue}`
        }else{
            if(minQuantity){
                threshold = `${minQuantity} Gal`
            }
        }
        setThresholdValue(threshold)
        return addServicesList;
    }
    const setInitialState = (fieldData,clear,editdata) => {
        const formDetails = {};
        let formErrors = {};
        const fieldTypeArr = ['input', 'select','id','multiselectcheckbox','asynctypeahead','date'];
    
        fieldData && fieldData.fields&&fieldData.fields.length&&fieldData.fields.forEach((item) => {
            if (fieldTypeArr.includes(item.component.toLowerCase())) {
              // if(item.name == 'accessLevel' && editdata && Array.isArray(editdata[item.name])) {
              //   formDetails[item.name] = editdata[item.name].length ? editdata[item.name][0].accessLevels : ''
              // } else 
              // if(item.name == 'roles' && editdata && Array.isArray(editdata[item.name])) {
              //   formDetails[item.name] = editdata[item.name].length ? editdata[item.name][0].roleType : ''
              // } else
              if(item.name == 'quantity'){
                let quantity = ((editdata[item.name] && editdata[item.name] != ''? parseFloat(editdata[item.name]):0) * editdata['unit']&& editdata['unit']).toFixed(2)
                props.updateState(item.name,quantity)
            }
            if(item.name == 'unit'){
                let unit = 1
                switch (editdata[item.name]) {
                    case "Pounds":
                    unit = 0.12
                    break;
            
                    case "Kilograms":
                        unit =  0.26
                        break;
                
                    case "Liters":
                        unit = 0.264172
                        break;
                
                    default:
                        break;
                }
                let quantity = ((editdata['quantity'] && editdata['quantity'] != '' ? parseFloat(editdata['quantity']) :0) * unit).toFixed(2)
                props.updateState("quantity",quantity)
                props.updateState(item.name,unit)

            }
            if(item.component === "checkbox"){
                // let adServices = [...services]
                // adServices.push({"name":item.name, "amount":e.target.value})
                // setServices(adServices)
            }
               if(item.name == 'location' && editdata && editdata[item.name]){
                formDetails[item.name] = editdata[item.name].length ? editdata[item.name].toString(',') : ''
              }else {
                formDetails[item.name] = editdata && editdata[item.name] ?(typeof editdata[item.name] == 'number' ? editdata[item.name].toString() : editdata[item.name]): item.defaultValue? item.defaultValue: "";
              }
              
               formErrors[item.name] = getFormErrorRules(item);
            }
        })
        if(!props.errorsCaptured) {
            if(Object.keys(formErrors).length>0){
                setFormErrors(formErrors);
                formErrors['unit']['isValid'] = true;
                if(props.formDataSet['fuelingDate'] != '') {
                    formErrors['fuelingDate']['isValid'] = true;
                }
                if(props.formDataSet['arrivingFrom'] != '') {
                    formErrors['arrivingFrom']['isValid'] = true;
                }
                if(isMulti){
                    formErrors['tailNumber']['isValid'] = true;
                }
                props.setFlightFormErrors(formErrors)
            }
         
        } else {
            setFormErrors(props.formErrors);
        }
        setFormData(formDetails);
      }
      const getFormErrorRules = (item) => {
        return {
            isValid: item.isRequired  ? false : true,
            isTouched: false,
            activeValidator: {},
            validations: item.validations,
            isRequired: item.isRequired,
            minLength: item.minLength,
            maxLength: item.maxLength
        };
    }
    const getFuelTiers = ()=>{
        
        return(
            <div className='bf-more-tiers'>
                <div className='d-flex bf-gallons'>
                    <div>Gallons</div>
                    {props.fuelTiers.map((item)=>(
                        <div>{`${item.MinRange}${item.MaxRange ? '-'+item.MaxRange : '+' }`}</div>
                    ))}
                </div>
                <div className='d-flex bf-price'>
                    <div>Price</div>
                    {props.fuelTiers.map((item)=>(
                        <div>{`$${parseFloat(parseFloat(item.costplus) + parseFloat(item.Baseprice)).toFixed(2)}`}</div>
                    ))}
                </div>
                <img src={Arrow} className="bf-tiers-arrow"/>
            </div>)
    }   
    const getAmount = (data,type)=>{ 
        let amount = data.Amount
        if(type == "tax"){
            let unit = "%"
            if(unit == "%"){
                amount = parseFloat((10*8.23) * (parseFloat(data.Amount)/100))
            }
        }
        if(type= "service"){
            if(props.quantity){
                let orderValue = (props.quantity * props.fuelPrice)
                if(data.ThresholdtoWaive == 'OrderValue'){
                    if(orderValue>= data.minordervalue){
                        if(data.Unit == "%"){
                            amount = parseFloat((data.Amount) -((data.Amount) * (parseFloat(data.ActualAmount)/100)))
                        }else{
                            amount =  data.ActualAmount
                        }
                    }else{
                        amount =  data.Amount
                    }
                }
                else if(data.ThresholdtoWaive == 'FuelGallons'){
                    if(props.quantity>= data.mingallons){
                        if(data.Unit == "%"){
                            amount = parseFloat((data.Amount) -((data.Amount) * (parseFloat(data.ActualAmount)/100)))
                        }else{
                            amount =  data.ActualAmount
                        }
                    }else{
                        amount =  data.Amount
                    }
                }else{
                    amount =  data.Amount
                }
            }
        }
        return parseFloat(amount)
    }
    const getWaiveOff = (data)=>{
        let amount = data.Amount;
        let className = '';
        if(props.quantity){
            let orderValue = (props.quantity * props.fuelPrice)
            if(data.ThresholdtoWaive == 'OrderValue'){
                if(orderValue>=  data.minordervalue){
                    setwaiveoffmsg(true)
                    if(data.Unit == "%"){
                        if(data.ActualAmount == 100 || data.ActualAmount == 100.00){
                            className = "full"
                        }else{
                            className = "partial"

                            
                        }
                    }else{
                        if(data.ActualAmount == 0 || data.ActualAmount == "00.00" ||data.ActualAmount == "0.00" ){
                            className = "full"
                        }else{
                            className = "partial"
                        }
                    }
                }else{
                    setwaiveoffmsg(false)
                }
            }
            else if(data.ThresholdtoWaive == 'FuelGallons'){
                if(props.quantity>= data.mingallons){
                    setwaiveoffmsg(true)
                    if(data.Unit == "%"){
                        if(data.ActualAmount == 100 || data.ActualAmount == 100.00){
                            className = "full"
                        }else{
                            className = "partial"
                        }
                    }else{
                        if(data.ActualAmount == 0 || data.ActualAmount == "00.00" ||data.ActualAmount == "0.00" ){
                            className = "full"
                        }else{
                            className = "partial"
                        }
                    }
                }
                else{
                    setwaiveoffmsg(false)
                }
            }
        }
        return className
    }

    const addTail = () => {
        props.addTail()
    }
    const getHeaders = (item,index)=>{
        switch (item.component.toLowerCase()) {
            case "header":
                return(
                    <div className='bf-order-placement-header'>{item.name == "icao" && isMulti && isEdit && !multipleLeg ? `${fboData && (fboData[item.name]).toUpperCase()} - Leg ${orderLegLevel+1}` :multipleLeg && item.name == "icao"? `${fboData && (fboData[item.name]).toUpperCase()} - Leg ${orderLegLevel}` :item.name == "icao" ? fboData && (fboData[item.name]).toUpperCase() : fboData && (fboData[item.name]).toLowerCase()}</div>
                )
            case "subheader":
                if(item.name == "phoneNumber"){
                    return(
                        <div className='bf-order-placement-subheader'>
                            <span>{`${item.label} : ${phoneValidation((fboData && fboData[item.name] ? fboData[item.name].toString() :data[item.name]))}`}</span>
                        </div>
                    )}
                else {
                    return(
                        <div className='bf-order-placement-subheader'>
                            
                            <span>{fboData && fboData[item.name]}</span>
                        </div>
                    )
                }
                
            default:
                break;
        } 
    }

    const getMobileFuelData = () => {
        return(
            props.showMobileFuelTiers(
                <div className='bf-more-tier'> 
                <div className='flex-bf'>        
                    <div className='bf-popup-company-left'>           
                        <img src={fboCompanyIcon} />
                        <div className='bf-fbo-detail'>
                                <div className='bf-details-fbo'>
                                    <div className='bf-fbo-names'>
                                        {fboData?.fboName} ({fboData?.icao})                             
                                    </div> 
                                    <div className='bf-name-fbos'>
                                        <div className='bf-name-fb'>
                                        Retail Price
                                        <span className='bf-fb'>${fboData?.RetailPrice}</span>                            
                                    </div>
                                    <div className='bf-names'>
                                        BF Price
                                        <span className='bf-fbo'>${fboData?.bfPrice}</span>                             
                                    </div>
                                    <div className='bf-name'>
                                        Expires On {getFormattedMMDDYY(fboData?.expiresOn)}                              
                                    </div>                                                                               
                                </div> 
                            </div>                                             
                        </div>    
                    </div>
                    {/* <div className='bf-partners'>
                                {fboData?.IsPartner}
                            </div>  */}
                    <div className='bf-flex-both bf-popup-company-right'>
                            <div className='bf-partners'>
                                {fboData?.IsPartner}
                            </div> 
                                                          
                        <div ClassName='bf-both-flex'>  
                            <div className='bf-both'>                
                                <div className='bf-sub-gallon'>Gallons</div>
                                <div>Price</div>
                            </div> 
                            </div>  
                                                
                            {props.fuelTiers.map((item)=>(
                                <div className={`bf-both-price ${fboData?.bfPrice == item.costplus +  item.Baseprice ? "bf-bold" : ""}`}>
                                    <div className='bf-gallons'>{`${item.MinRange}${item.MaxRange ? '-'+item.MaxRange : '+' }`}</div>   
                                    <div>{`$${parseFloat(parseFloat(item.costplus) + parseFloat(item.Baseprice)).toFixed(2)}`}</div>    
                                </div>                   
                            ))}                   
                        </div> 
                                                             
                    </div>                                     
            </div>   
            )
        )
    }
  
    const getFields = (item,index)=>{
        switch (item.component.toLowerCase()) {
            case "checkbox" : 
            return (
                <div className='col-md-3 d-flex justify-content-between bf-checkbox-field'>
                    <div className='checkbox-container'>
                        <input disabled={props.multipleLeg ? true : false} className="form-check-input" type="checkbox" name={item.name} checked={props.selectedServices && props.selectedServices.includes(item.name)?true:false} value={item.amount} onChange={(e)=>props.onHandleChange(e,item)}/> 
                        <label  htmlFor='checkbox' title={item.label}>{item.label}</label>
                    </div>
                    <span className='bf-service-amount'>
                        <span className={`${item.waiveOffType == 'partial' ? 'bf-stars' : item.waiveOffType == 'full' ? 'bf-strike-stars':''}`} title={item.amount}><span>${Math.round((parseFloat(item.amount) >0)?item.amount :item.givenAmount)}</span></span> {item.waiveOffType == 'partial' || item.waiveOffType == 'full' ? <span>**</span> : null}
                    </span>
                </div>
            );
            case "asynctypeahead":
                return(
                    <Form.Group as={Col} md={item.styles.colWidth} className={`mb-4 ${ formErrors &&
                        formErrors[item.name] && formErrors[item.name]
                            .activeValidator
                            .errorMessage != null ? 'bf-error-class' : ''
                    } mb-4`} controlId={item.name}>
                        <div className='d-flex justify-content-between'>
                            <Form.Label>{item.label} { props.multipleLeg ?'': item.isRequired ? <span className='bf-required'>*</span> : ''}</Form.Label>
                            {item.addinfo && loggedInUserType != "Barrel Fuel" ? <span className='bf-more-info bf-pointer' onClick={addTail}>{item.infoText}</span> : ''}
                        </div>
                        <AsyncTypeahead
                        id={item.name}
                        // filterBy={filterBy}
                        isLoading={item.name=='arrivingFrom'?props.isAddress1Loading:props.tailLoading}
                        minLength={3}
                        disabled={(((isMulti && orderLegLevel != 0) || props.multiTailEdit) && item.name == "tailNumber" )|| props.multipleLeg || (item.isFboDisable && props.isEditSingle && props.userType=='fbo') ? true : false}
                        defaultInputValue={formData && formData[item.name] ? formData[item.name] : item.defaultValue ? item.defaultValue : ''}
                        label={item.label}
                        useCache={false}
                        onSearch={(e)=>props.searchAPI(e,item)}
                        inputProps={{
                            name: item.name,
                            maxLength: item.maxLength,
                            disabled: props.multipleLeg ? true : false
                          }} 
                        ref={props.typeaheadRef}
                        onKeyDown={props.onKeyDown?(e)=>props.onKeyDown(e,item):''}
                        onChange={(index) => props.searchHandler(index, item)}
                        options={item.name=='arrivingFrom'? props.results : props.tailResults}
                        placeholder = {item.placeholder} 
                        onBlur={(e)=>props.onSearchBlur(e,item)}
                        selected={item.name=='arrivingFrom'?props.address1Selected:props.tailSelected}
                        //   onFocus={handleFocus}
                        renderMenuItemChildren={(option) => (
                            <>
                            <span>{option}</span>
                            </>
                        )}
                        {...formErrors &&
                            formErrors[item.name] && !formErrors[item.name].isValid &&
                                <div className='d-flex justify-content-end '>
                                    <small class="bf-error-message form-text"><span>
                                    {formErrors[item.name]
                                        .activeValidator
                                        .errorMessage}
                                        </span></small>
                                    </div>
                            }
                        />
                    </Form.Group> 
                )
            case "subheading":
                return(<Subheading isRequired={props.multipleLeg ? false : item.isRequired} tooltip={item.tooltip} styles={item.styles ? item.styles : null} label={item.label}/>)    
            case "select":
                return (<Select 
                    colWidth={item.styles ? item.styles.colWidth : ""} 
                    Type={item.type} 
                    Label={item.label}
                    isAdmin = {item.name=='accessLevel'?props.isAdmin:null}
                    Placeholder={item.placeholder}
                    isRequred={item.name ==="taxTemplate" ? (props.disabled ? !props.disabled : true) : props.multipleLeg?false:item.isRequired}
                    disabled = {props.multipleLeg || (item.isFboDisable && props.isEditSingle && props.userType=='fbo') ? true :(item.name == "tailNumber" && ((isMulti && orderLegLevel != 0) || props.multiTailEdit) ? true : false)}
                    dynamicSelect={item.dynamicSelect}
                    lookupReference={item.dynamicSelect ? item.lookupReference : null}
                    Options={props.tempOptions && item.name==="taxTemplate" ? props.tempOptions : (item.name == "tailNumber" && props.tailOptions? props.tailOptions: item.options)}
                    tooltip={item.tooltip?item.tooltip:""}
                    Name={item.name}
                    dependentField = {item.dependentField}
                    dependentFieldVal = { item.userRole ? (props.userType ? props.userType : ''):item.dependentFieldVal?item.dependentFieldVal:'' }
                    handleChange={(e)=>props.onHandleChange(e,item)}
                    handleBlur={(e)=>props.onHandleBlur(e,item)}
                    formDataSet={formData ? formData[item.name]:""}
                    addinfo = {item.addinfo ? addTail : null}
                    infoText = {item.infoText ? props.multipleLeg || props.userType=='fbo' ? '' : isMulti && orderLegLevel != 0?'':  item.infoText : null}
                    fieldError={
                        formErrors && formErrors[item.name]
                        && !formErrors[item.name].isValid
                       && (
                           formErrors[item.name].isTouched
                        )
                    }
                    errorMessage={
                        formErrors && formErrors[item.name]
                        && formErrors[item.name]
                            .activeValidator
                            .errorMessage
                    }
                    />)   
                case "date": 
                    return (<>
                        <DatePicker
                            colWidth={item.styles ? item.styles.colWidth : ""}
                            styles = {item.styles}
                            Name={item.name}
                            Label={item.label}
                            disabled = {props.multipleLeg ? true : false}
                            handleChange = {(e)=>props.onHandleChange(e,item)}
                            isRequired={props.multipleLeg ? false : item.isRequired}
                            MaxDate={ (formData['fuelingDate'] !== 'NaN/NaN/NaN' && formData['fuelingDate'] != null) ? new Date().setDate(new Date().getDate() + 90) : new Date().setDate(new Date().getDate() + 90) }
                            //MinDate = {(formData['fuelingDate'] !== 'NaN/NaN/NaN' && formData['fuelingDate'] != null) ? formData['fuelingDate'] : new Date() }
                            // MaxDate = {item.name == 'startDate' && (props.maxVal !== 'NaN/NaN/NaN' && props.minVal != null) ? props.maxVal : null}
                            fieldError={
                                formErrors &&
                                formErrors[item.name] && !formErrors[item.name].isValid
                                // && (
                                //     formErrors[item.name].isTouched
                                // )
                            }
                            errorMessage={
                                formErrors && formErrors[item.name]
                                && formErrors[item.name]
                                    .activeValidator
                                    .errorMessage
                            }
                            value={formData? formData[item.name]:""}
                        /></>
                            
                    )   
                case "stripe" : 
                    return(
                        <img src={StripeIcon} className="bf-powerby-stripe" />
                    )
                case "input":
                    return (<Input
                        disabled = {item.disable || (props.multipleLeg ? true : false) }
                        colWidth={item.styles ? item.styles.colWidth : ""} 
                        Type={item.type} 
                        Label={item.label}
                        data-label={item.label}
                        value={formData}
                        onkeyDown={true}
                        styles={item.styles}
                        Accept={props.Accept?props.Accept:null}
                        Placeholder={item.placeholder}
                        isRequred={props.multipleLeg ? false : item.isRequired}
                        Name={item.name}
                        handleChange={(e)=>props.onHandleChange(e,item)}
                        handleBlur={(e)=>props.onHandleBlur(e,item)}
                        addinfo = {item.addinfo}
                        fuelTiers= {item.name =='quantity' ? getFuelTiers : null}
                        infoText = {props.multipleLeg ?'':item.infoText}
                        mobileInfoText = {props.multipleLeg ?'': item.mobileInfoText ? item.mobileInfoText : null}
                        formDataSet={formData?formData[item.name]:""}
                        mobileFuelPopup = {item.mobileInfoText ? getMobileFuelData : null}
                        fieldError={
                            formErrors && formErrors[item.name]
                            && !formErrors[item.name].isValid
                            //&& (
                            //    formErrors[item.name].isTouched
                            //)
                        }
                        errorMessage={
                            formErrors &&  formErrors[item.name]
                            && formErrors[item.name]
                                .activeValidator
                                .errorMessage
                        }
                        />)
            default:
                break;
        }
    }
    const deleteLeg = (e) => {
        console.log(legData)
        console.log(orderLegLevel)
        let multiLegData = legData
        let newData = multiLegData.OrderLegs.filter((row)=>row.LegID != parseFloat(orderLegLevel + 1));
        newData.sort((a, b) => {
            return a.FuellingDateEpoch - b.FuellingDateEpoch;
        });
        newData.forEach((leg,index)=>{
            leg['LegID'] = index + 1;
            leg['Name'] = index + 1;
        })

        multiLegData['OrderLegs'] = newData;
        // setUpdatedRows(newData)
        getLegData(dispatch,multiLegData)
        // setUpdate(!update)
        // setDeleteShow(false)
        getLegLevel(dispatch,multiLegData?.OrderLegs.length)
        // document.getElementById('root').style.filter = 'none';
        // if(isMultiSummary){
        // getIsMultiSummary(dispatch,false)
        // }
        if(!newData.length){
            getMultipleLeg(dispatch, false)
            getIsSummary(dispatch, false)
            getIsPricePending(dispatch,false)
            getMultiLegPricePending(dispatch,false)
            getLegData(dispatch,{})
            getLegType(dispatch, false)
            getLegLevel(dispatch,0)
            navigate('/dashboard/fuelorder')
            closeModal();
        } else {
            closeModal();
            props.onClickSubmit(e,{"name":"back"})
        }
    }
    const deleteLegData = (e) => {
        setShowModal(true);
    }
    const closeModal = () => {
        setShowModal(false)
        document.getElementById('root').style.filter = 'none';
    }
    const renderModal = () => {
        let modalData = "Wait! Are You Sure You Want To Delete Leg " + (orderLegLevel + 1);
        document.getElementById('root').style.filter = 'blur(5px)';
        return (
            <CustomModal
                show={showModal}
                modelBodyContent={modalData}
                onHide={(e) => deleteLeg(e)}
                close={()=>closeModal()}
                hide={()=>closeModal()}
                modalId={"bf-delete-leg-mobile"}
                buttonText={"Yes"}
                secondbutton={"Cancel"}
            />
        );
    };
  return (
    <>
        {jsonData &&
            <div className='bf-order-placement-home'>
                <div className='bf-order-sub bf-relative'>
                    <div className='bf-sub-icon'>
                        <img className='bf-back-icon' onClick={(e)=>props.onClickSubmit(e,{"name":"back"},false,false)} src={BackIcon}  alt="Back" />
                    </div>
                    <div className='bf-sub-heading'>{props.isEditSingle || props.isOrderClose ? "Order Details" : isEdit ? "Fuel Order Leg " + (orderLegLevel+1) :"Confirm Fuel Order"} </div>
                    {isEdit ?
                        <div className='bf-delete-leg-data' onClick={(e)=>deleteLegData(e)}>Delete</div> : null
                    }
                </div>
                <div className={`bf-order-placement-container ${props.multipleLeg ? 'bf-multiple-leg-data' : ''}`} >
                    <div className='bf-show-mobile-view bf-show-mobile bf-mobile-order-placement-fbo-details'>
                        <img src={fboCompanyIcon} />
                        <div className='bf-fbo-details'>
                            <div className='bf-partner'>
                                Partner
                            </div>
                            <div className='bf-fbo-name'>
                                {fboData?.fboName} ({fboData?.icao})
                            </div>
                            <div className='bf-fbo-address'>
                                {fboData?.address}
                            </div>

                        </div>
                    </div>
                    <div className='bf-orderplacement-scroll-section'>
                    <div className='bf-order-placement-header-container'>
                        {jsonData?.orderPlacementData?.orderHeadersData?.fields?.map((item,index)=> {
                            if(item.component.toLowerCase() !== 'subheader') {
                                return getHeaders(item,index)
                            }
                        })}
                        <div className='bf-order-plcde-fbo-address-section'>
                            {jsonData?.orderPlacementData?.orderHeadersData?.fields?.map((item,index)=> {
                                if(item.component.toLowerCase() === 'subheader') {
                                    return getHeaders(item,index)
                                }
                            })}
                        </div>
                    </div>
                    <div className='bf-order-placement-fields-container mb-3'>
                        <Row>
                            {jsonFields?.fields?.map((item,index)=>(
                                getFields(item,index)
                            ))}
                        </Row>
                    </div>
                    <div className='bf-order-placement-fields-container mb-3 bf-services-input-section'>
                        <Row>
                            {servicesList?.map((item,index)=>(
                                getFields(item,index)
                            ))}
                            { props.quantity != 0.00 &&  waiveoffmsg  && <div className='bf-order-msg'>** Waived Fully Or Partially Due To Minimum Fuel Purchased ({thresholdValue})</div>}
                        </Row>
                    </div>
                    <div className='bf-order-placement-fields-container mb-3 bf-order-payment-container'>
                        <Row>
                            {jsonData?.orderPlacementData?.orderPayments?.fields?.map((item,index)=>(
                                getFields(item,index)
                            ))}
                        </Row>
                    </div>
                    <div className='bf-show-mobile'>
                        <button className='bf-btn-login bf-btn-imp  bf-btn-login btn btn-primary' onClick={(e)=>props.onClickSubmit(e,{"name":"placeOrder","view":"mobile"})}>Continue</button>
                    </div>
                    </div>
                </div>
                {showModal ? renderModal() : null}
            </div>
        }
    </>
  )
}
