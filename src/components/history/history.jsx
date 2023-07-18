import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import Loader from '../loader/loader';
import { fetchHistory } from '../../actions/orderActions/disputeOrderAction';
import { disputeAmount,getFormatedAmount } from '../../controls/validations';
import AddMoreIcon from '../../assets/images/icon-add-more.png';
import CustomProfileModal from '../myProfile/customProfileModal';
import BackIcon from '../../assets/images/collapse_arrow.svg';
import { getMobileHeaderText } from '../../actions/commonActions/commonActions';


const History = props => {
    const dispatch = useDispatch();
    const [isBusy, setBusy] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [modalContent, setModalContent] = useState('')
    const [sectionHead, setSectionHead] = useState('')
    const [historyTitle, setHistoryTitle] = useState('')
    const [history,setHistory] = useState({})
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
        setSectionHead(props.sectionHead)
        getMobileHeaderText(dispatch,"Order History")
        fetchHistory(dispatch,historyReq).then(res=>{
            let data = res && res.length && res[0].length && res[0][0]['JSON_UNQUOTE(@JSONResponse)']?JSON.parse(res[0][0]['JSON_UNQUOTE(@JSONResponse)']):[];
            setHistory(data)
            data && data.OrderHistory.map((val,index)=>{
                dropdown[index] = false
            })
            setBusy(false)
        })
    },[])  
    const closeModal = () => {
        setShowModal(false);
        document.getElementById('root').style.filter = 'none';
    }
    const showMoreDetails = (item) => {
        setModalContent(getModalContent(item))
        setShowModal(true);
        document.getElementById('root').style.filter = 'blur(5px)';
    }
    const getModalContent = (item) => {
        let title = new Date(item.ActionDate).toLocaleDateString('en-US',{ year: 'numeric', month: '2-digit', day: '2-digit' }) + ' - ' + (item.Action.substring(0,14) == "Order Disputed" ? item.Action.substring(0,14) : item.Action)
        // item.Action.substring(0,14) == "Order Disputed" ? item.Action.substring(0,14) : item.Action 
        setHistoryTitle(title)

        let viewModalContent = '';
        let button = <div className='bf-history-popup-button'><button className='bf-btn-login btn btn-primary bf-btn-imp' onClick={() => closeModal()}>OK</button></div>
        if(item.Action == "Order Completed") {
        viewModalContent = (
                <div className='bf-history-popup-section'>
                    <div className='d-flex'>
                        <p>Fuel Quantity : {item.fuelquantity}gal</p>
                        <p>Order Value : ${item.finalprice}</p>
                        <p>Flight Type : {item.flighttype}</p>
                        <p>Arriving From : {item.arrivingfrom}</p>
                        {button}
                    </div>
                </div>
            )
        } else if (item.Action == "Order Placed") {
            viewModalContent = (
                <div className='bf-history-popup-section'>
                    <div className='wrapper'>
                        <div className='left'><p>Fuel Quantity : {getFormatedAmount(item.fuelquantity,2)}gal</p></div>
                        <div className='center'><p>Order Value : {disputeAmount(item.finalprice)}</p></div>
                        <div className='right'><p>Flight Type : {item.flighttype}</p></div>
                    </div>
                    <div className='wrapper'>
                        <div className='left'><p>Tail Number : {item.TailNumber}</p></div>
                        <div className='center'><p>Fuel Upon : {item.FuelUpon}</p></div>
                        <div className='right'><p>Fueling Date : {new Date(item.FuellingDate).toLocaleDateString('en-US',{ year: 'numeric', month: '2-digit', day: '2-digit' }) }</p></div>
                    </div>
                    <div className='d-flex'>
                        <p>Arriving From : {item.arrivingfrom}</p>
                    </div>
                    <div className='d-flex'>
                        <div className='bf-services'><span>Additional Services Added : </span></div>
                        {item.ServicesAdded && item.ServicesAdded.map((val,index)=>(<>
                            <span> {index == item.ServicesAdded.length-1 ? val : val+','} </span>
                        </>))}
                    </div>
                    {button}
                </div>
            )
        } else if (item.Action == "Dispute Resolved" && item?.EditedValues && item?.EditedValues.length) {
            viewModalContent = (
                <div className='bf-history-popup-section'>
                    <div className='d-flex'>
                        <p>{item?.EditedValues[0].Unit != "0" ? <>Quantity Units : {item.EditedValues[0].Unit}</> : ''}</p>
                        <p>{item.EditedValues[0].TailNumber != "" ? <>TailNumber : {item.EditedValues[0].TailNumber}</> : ''}</p>
                        <p>{item.EditedValues[0].Arrivingfrom != "" ? <>Arriving From : {item.EditedValues[0].Arrivingfrom}</> : ''}</p>
                    </div>
                    <div className='d-flex'>
                        <p>{item.EditedValues[0].flighttype && item.EditedValues[0].flighttype != "" ? <>Flight Type : {item.EditedValues[0].flighttype}</> : ''}</p>
                        <p>{item.EditedValues[0].FuelQuantity != 0 ? <>Fuel Quantity : {item.EditedValues[0].FuelQuantity} gal</> : ''}</p>
                        <p>{item.EditedValues[0].FuellingDate != "" ? <>Fuelling Date : {item.EditedValues[0].FuellingDate}</> : ''}</p> 
                    </div>
                    {button}
                </div>
            )
        } else if (item.Action == "Order Declined" ) {
            viewModalContent = (
                <div className='bf-history-popup-section'>
                    <div className='d-flex'>
                        <p>Reason : {item.DeclineReason}</p>
                    </div>
                    {button}
                </div>
            )
        } else if(item.Action == "Order Canceled" ) {
            viewModalContent = (
                <div className='bf-history-popup-section'>
                    <div className='d-flex'>
                        <p>Reason : {item.CanceledReason}</p>
                    </div>
                    {button}
                </div>
            )
        } else if(item.Action == "Order Updated") {
            viewModalContent = ''
            if(item?.EditedValues && item?.EditedValues.length) {
                viewModalContent = viewModalContent +  (
                    <div className='bf-history-popup-section'>
                        <div className='d-flex'>
                            <p>{item?.EditedValues[0].Unit != "0" ? <>Quantity Units : {item.EditedValues[0].Unit}</> : ''}</p>
                            <p>{item.EditedValues[0].TailNumber != "" ? <>TailNumber : {item.EditedValues[0].TailNumber}</> : ''}</p>
                            <p>{item.EditedValues[0].Arrivingfrom != "" ? <>Arriving From : {item.EditedValues[0].Arrivingfrom}</> : ''}</p>
                        </div>
                        <div className='d-flex'>
                            <p>{item.EditedValues[0].FuelQuantity != 0 ? <>Fuel Quantity : {item.EditedValues[0].FuelQuantity} gal</> : ''}</p>
                            <p>{item.EditedValues[0].flighttype != "" ? <>Flight Type : {item.EditedValues[0].flighttype}</> : ''}</p>
                            <p>{item.EditedValues[0].FuellingDate != "" ? <>Fuelling Date : {item.EditedValues[0].FuellingDate}</> : ''}</p>                        
                        </div>
                    </div>
                )
            }
            if (item?.ServicesAdded != null) {
                viewModalContent = viewModalContent + (
                    <div className='d-flex bf-history-popup-section'>
                        <div className='bf-services'><span>Additional Services Added : </span></div>
                        {item.ServicesAdded && item.ServicesAdded.map((val,index)=>(<>
                            <span> {index == item.ServicesAdded.length-1 ? val : val+','} </span>
                        </>))}
                    </div>
                )
            }
            if (item?.ServicesRemoved != null) {
                viewModalContent = viewModalContent + (
                    <div className='d-flex bf-history-popup-section'>
                        <div className='bf-services'><span>Additional Services Removed : </span></div>
                        {item.ServicesRemoved && item.ServicesRemoved.map((val,index)=>(<>
                            <span style={{textDecoration: 'line-through'}}> {index == item.ServicesRemoved.length-1 ? val : val+','} </span>
                        </>))}
                    </div>
                )
            }
            viewModalContent = viewModalContent + button
        } else if (item.Action.substring(0,14) == "Order Disputed") {
            viewModalContent = (
                <div className='bf-history-popup-section'>
                    <div className='d-flex'>
                        <p>Reason : {item.Action.substring(27,item.Action.length)}</p>
                    </div>
                    {button}
                </div>
            )
        } else if(item.Action == "Dispute Reopen") {
            viewModalContent = (
                <div className='bf-history-popup-section'>
                    <div className='d-flex'>
                        <p>Reason : {item.CanceledReason}</p>
                    </div>
                    {button}
                </div>
            )
        }
        return viewModalContent
    }
    const getHistoryFields = (item,index) => {
        return (
            <div className='d-flex justify-content-between bf-mobile-history-element'>
                <div className='d-flex bf-history-heading'>
                    <div className='bf-history-date'>{new Date(item.ActionDate).toLocaleDateString('en-US',{ year: 'numeric', month: '2-digit', day: '2-digit' }) + " - "}</div>
                    <div className='bf-mobile-history-data'> {item.Action.substring(0,14) == "Order Disputed" ? item.Action.substring(0,14) + " By "+item.ActionBy: item.Action + " By "+item.ActionBy}</div>
                </div>
                <div className="bf-veiw-more-history" onClick={()=>showMoreDetails(item)}><img src={AddMoreIcon} /></div>
            </div>
        )
    }

    return (<>
        {isBusy ? (
          (<Loader/>)
        ) : (<>
                <div className='bf-mobile-history-container'>
                    <div className='text-center bf-order-details'><img src={BackIcon} onClick={(e)=> props.handlemobileHistoryBack(sectionHead)}/> {"Order "} {props.orderNumber}</div>
                    <div className='bf-mobile-history-section'>
                        {history && history.OrderHistory.map((val,index)=>(
                            getHistoryFields(val,index)
                        ))}
                    </div>
                </div>
                {showModal ? 
                <CustomProfileModal 
                    show={showModal}
                    onHide={() => closeModal()}
                    hide={() => closeModal()}
                    title={historyTitle}
                    size={"md"}
                    hideFooter = {true}
                    modelBodyContent={modalContent}
                    className="bf-mobile-view-modal bf-mobile-history"
                    />
                : null}
            </>
            )
        }
    </>)
}




export default History;