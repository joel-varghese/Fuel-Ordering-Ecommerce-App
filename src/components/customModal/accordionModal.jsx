import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { IoIosArrowDropdownCircle, IoIosArrowDropupCircle } from 'react-icons/io';
import closeIcon from '../../assets/images/close-icon.svg';
import parse from 'html-react-parser';
import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import Loader from '../loader/loader';
import { fetchHistory } from '../../actions/orderActions/disputeOrderAction';
import Subheading from '../subHeading/subHeading';
import { disputeAmount,getFormatedAmount } from '../../controls/validations';


const AccordionModal = props => {
    const [collapse, setCollapse] = useState([]);
    const dispatch = useDispatch();
    const [isBusy, setBusy] = useState(true)
    const [accordion,setAccordion] = useState({})
    const [Default,setDefault] = useState("Expand All")
    const loginReducer = useSelector(state => state.loginReducer);
    const loginDetails = loginReducer && loginReducer.loginDetails &&loginReducer.loginDetails.data;
    let loginDetls =  JSON.stringify(loginDetails) === '{}'?{}:JSON.parse(loginDetails);
    let userType = loginDetls.userType?loginDetls.userType:'';
    let userEmail = loginDetls.loginUserName?loginDetls.loginUserName:'';
    const historyReq = {
        "OrderNumber":props.orderNumber,
        "Loggedinuser":userEmail
    }


    useEffect(()=>{
        let dropdown = []
        fetchHistory(dispatch,historyReq).then(res=>{
            let data = res && res.length && res[0].length && res[0][0]['JSON_UNQUOTE(@JSONResponse)']?JSON.parse(res[0][0]['JSON_UNQUOTE(@JSONResponse)']):[];
            setAccordion(data)
            data && data.OrderHistory.map((val,index)=>{
                dropdown[index] = false
            })
            setBusy(false)
            setCollapse(dropdown)
        })
    },[])  

    const handleAccordion = (index) =>{
        let accordions = {...collapse}
        accordions[index] = !accordions[index]
        setCollapse(accordions)
    }
    const accordionState = () =>{
        let accordions = {...collapse}
        accordion.OrderHistory.map((val,index)=>{
            Default == "Expand All" ? accordions[index] = true : accordions[index] = false
        })
        setCollapse(accordions)
        Default == "Expand All" ? setDefault("Collapse All") : setDefault("Expand All")
    }
    const getSubField = (data) =>{
        return(
            <>
                {Object.keys(data).forEach((val)=>(
                    <div className='d-flex justify-content-between'>
                        <div>{val}</div>
                    </div>
                ))}
            </>
        );
    }

    const getAccordionFields = (item,index) =>{
        return(
            <>                
                <div className='d-flex'>
                    <div onClick={()=>{handleAccordion(index)}}>
                        {collapse[index] ?
                            <IoIosArrowDropupCircle className='bf-primary-color'/> :
                            <IoIosArrowDropdownCircle className='bf-primary-color'/> 
                        }
                    </div>
                    <div className='bf-history-date'>{new Date(item.ActionDate).toLocaleDateString('en-US',{ year: 'numeric', month: '2-digit', day: '2-digit' }) + " - "}</div>
                    <Subheading label={item.Action.substring(0,14) == "Order Disputed" ? item.Action.substring(0,14) + " By "+item.ActionBy: item.Action + " By "+item.ActionBy}/>
                </div>
                {collapse[index] ? 
                    <div className='bf-history-actions'>
                        {item.Action == "Order Completed" ? (<div className='d-flex'>
                        <p>Fuel Quantity : {item.fuelquantity}gal</p>
                        <p>Order Value : ${item.finalprice}</p>
                        <p>Flight Type : {item.flighttype}</p>
                        <p>Arriving From : {item.arrivingfrom}</p>
                        </div>) : ''}
                        {item.Action == "Dispute Resolved" && item?.EditedValues && item?.EditedValues.length ? (<div className='d-flex'>
                        <p>{item?.EditedValues[0].Unit != "0" ? <>Quantity Units : {item.EditedValues[0].Unit}</> : ''}</p>
                        <p>{item.EditedValues[0].TailNumber != "" ? <>TailNumber : {item.EditedValues[0].TailNumber}</> : ''}</p>
                        <p>{item.EditedValues[0].Arrivingfrom != "" ? <>Arriving From : {item.EditedValues[0].Arrivingfrom}</> : ''}</p>
                        </div>) : ''}
                        {item.Action == "Dispute Resolved" && item?.EditedValues && item?.EditedValues.length ? (<div className='d-flex'>
                        <p>{item.EditedValues[0].flighttype && item.EditedValues[0].flighttype != "" ? <>Flight Type : {item.EditedValues[0].flighttype}</> : ''}</p>
                        <p>{item.EditedValues[0].FuelQuantity != 0 ? <>Fuel Quantity : {item.EditedValues[0].FuelQuantity} gal</> : ''}</p>
                        <p>{item.EditedValues[0].FuellingDate != "" ? <>Fueling Date : {item.EditedValues[0].FuellingDate}</> : ''}</p> 
                        </div>) : ''}
                        {item.Action == "Order Declined" ? (<div className='d-flex'>
                        <p>Reason : {item.DeclineReason}</p>
                        </div>) : ''}
                        {item.Action == "Order Placed" ? (<div className='wrapper'>
                        <div className='left'><p>Fuel Quantity : {getFormatedAmount(item.fuelquantity,2)}gal</p></div>
                        <div className='center'><p>Order Value : {disputeAmount(item.finalprice)}</p></div>
                        <div className='right'><p>Flight Type : {item.flighttype}</p></div>
                        </div>) : ''}
                        {item.Action == "Order Placed" ? (<div className='wrapper'>
                        <div className='left'><p>Tail Number : {item.TailNumber}</p></div>
                        <div className='center'><p>Fuel Upon : {item.FuelUpon}</p></div>
                        <div className='right'><p>Fueling Date : {new Date(item.FuellingDate).toLocaleDateString('en-US',{ year: 'numeric', month: '2-digit', day: '2-digit' }) }</p></div>
                        </div>) : ''}
                        {item.Action == "Order Placed" ? (<div className='d-flex'>
                        <p>Arriving From : {item.arrivingfrom}</p>
                        </div>) : ''}
                        {item.Action == "Order Canceled" ? (<div className='d-flex'>
                        <p>Reason : {item.CanceledReason}</p>
                        </div>) : ''}
                        {item.Action == "Order Updated" && item?.EditedValues && item?.EditedValues.length ? (<div className='d-flex'>
                        <p>{item?.EditedValues[0].Unit != "0" ? <>Quantity Units : {item.EditedValues[0].Unit}</> : ''}</p>
                        <p>{item.EditedValues[0].TailNumber != "" ? <>TailNumber : {item.EditedValues[0].TailNumber}</> : ''}</p>
                        <p>{item.EditedValues[0].Arrivingfrom != "" ? <>Arriving From : {item.EditedValues[0].Arrivingfrom}</> : ''}</p>
                        </div>) : ''}
                        {item.Action == "Order Updated" && item?.EditedValues && item?.EditedValues.length ? (<div className='d-flex'>
                        <p>{item.EditedValues[0].FuelQuantity != 0 ? <>Fuel Quantity : {item.EditedValues[0].FuelQuantity} gal</> : ''}</p>
                        <p>{item.EditedValues[0].flighttype != "" ? <>Flight Type : {item.EditedValues[0].flighttype}</> : ''}</p>
                        <p>{item.EditedValues[0].FuellingDate != "" ? <>Fueling Date : {item.EditedValues[0].FuellingDate}</> : ''}</p>                        
                        </div>) : ''}
                        {item.Action == "Order Updated" && item?.ServicesAdded != null ? (<div className='d-flex'>
                        <div className='bf-services'><span>Additional Services Added : </span></div>
                            {item.ServicesAdded && item.ServicesAdded.map((val,index)=>(<>
                                <span> {index == item.ServicesAdded.length-1 ? val : val+','} </span>
                            </>))}
                        </div>) : ''}
                        {item.Action == "Order Updated" && item?.ServicesRemoved != null ? (<div className='d-flex'>
                        <div className='bf-services'><span>Additional Services Removed : </span></div>
                            {item.ServicesRemoved && item.ServicesRemoved.map((val,index)=>(<>
                                <span style={{textDecoration: 'line-through'}}> {index == item.ServicesRemoved.length-1 ? val : val+','} </span>
                            </>))}
                        </div>) : ''}
                        {item.Action == "Order Placed" ? (<div className='d-flex'>
                            <div className='bf-services'><span>Additional Services Added : </span></div>
                            {item.ServicesAdded && item.ServicesAdded.map((val,index)=>(<>
                                <span> {index == item.ServicesAdded.length-1 ? val : val+','} </span>
                            </>))}
                        </div>) : ''}
                        {item.Action.substring(0,14) == "Order Disputed" ? (<div className='d-flex'>
                        <p>Reason : {item.Action.substring(27,item.Action.length)}</p>
                        </div>) : ''}
                        {item.Action == "Dispute Reopen" ? (<div className='d-flex'>
                        <p>Reason : {item.CanceledReason}</p>
                        </div>) : ''}
                    </div>
                : ''}
            </>
        );
    } 
    return (<>
    {isBusy ? (
      (<Loader/>)
    ) : (<>
        <Modal
      {...props}
      size={props.size ? props.size : "lg"}
      aria-labelledby="contained-modal-title-vcenter"
      backdrop="static"
      centered
      id={props.modalId ? props.modalId : ''}
    >
    <Modal.Header>
        <div className='d-flex justify-content-end'>
            <a onClick={(e)=>accordionState()} className='bf-expand-all'>{Default}</a>
        </div>
        <Button className='bf-close-icon' onClick={props.secondbutton ? props.close : props.onHide} ><img src={closeIcon} alt='closeIcon'/></Button>
      </Modal.Header>
      <Modal.Body>
          {accordion && accordion.OrderHistory.map((val,index)=>(
            getAccordionFields(val,index)
          ))}
      </Modal.Body>
      {!props.isHtmlContent &&
        <Modal.Footer className={props.className ? props.className : ''}>
          <Button onClick={props.onHide}>{props.buttonText}</Button>
          {props.secondbutton ? <Button className='bf-btn-secondary' onClick={props.hide}>{props.secondbutton}</Button> : ''}
        </Modal.Footer>
      }
    </Modal>
    </>)}</>);
}
export default AccordionModal;