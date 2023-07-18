import React, { useState,useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import NotifyModal from '../customModal/notifyModal';
import Loader from '../loader/loader';
import './notifications.scss'
import { Storage } from '../../controls/Storage';
import BFTable from '../table/table'
import { notificationJson, notificationlist, updateAction,notificationUser } from '../../actions/notificationService/notificationService';
import SideMenu from '../dashboard/SideMenu';
import { bfaJsonService } from '../../actions/BFAServices/BFAJsonService';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotificationList } from '../../actions/notificationService/notificationAction';
import { phoneValidation } from '../../controls/validations';
import { getMobileHeaderText } from '../../actions/commonActions/commonActions';
//import notificationReducer from '../../reducers/notificationReducer/notificationReducer';

export default function Notifications(){

    const [isBusy, setBusy] = useState(true)
    const [notificationData , setnotificationData] = useState(null);
    const [payload,setpayload] = useState({})
    const [headCells, setheadCells] = useState(null);
    const [dismissMap,setdismissMap] = useState({});
    const [UserMap,setUserMap] = useState({});
    const [notifyrow, setnotifyrow] = useState(null);
    const [notifyModal, setnotifyModal] = useState(false);
    const [Modaldata, setModaldata] = useState([]);
    const [refresh,setrefresh]=useState(0);
    const dispatch = useDispatch()
    const params = {"blobname":"notifications.json"}
    const request = {
        "loginUserName" : Storage.getItem('email')
    }
    const notificationReducer = useSelector((state) => state.notificationReducer);
    const Listnotification = notificationReducer && notificationReducer.notificationData && notificationReducer.notificationData
    //const payload = [{"message":"User created","category":"Account","Buttons" : [{"Label":"Dismiss","className":"btn btn-bf-primary"}]}]
    const navigate = useNavigate();

    useEffect(() => {
        notificationlist(request).then(response =>{
            let payload = JSON.parse(response.data[0][0]['@JSONResponse']);
            setpayload(payload.notifications)
            getrows(payload.notifications)
            setBusy(false)
        })
        bfaJsonService(params).then(response =>{
            setnotificationData(response.data.notifications)
            setInitialState(response.data.notifications)
        })
    }, [refresh])

    const getHeaderText=(Jsonpagename)=>{
        let finalHeader;
        if(finalHeader=Jsonpagename){
            getMobileHeaderText(dispatch,finalHeader)
            return finalHeader
        }

    }

    const setInitialState= (Data)=> {
        const head = []
        Data && Data.content.headers.map((item,index)=>{
            head[index] = item
        })
        setheadCells(head)
    }
    const getrows=(payload)=>{
        const rows = []
        const dismiss = {}
        payload && payload.forEach((item,index)=>{
            if(item.notificationId != null){
                rows[index] = getrowdata(item)
                dismiss[item.notificationId] = index
            }
        })
        setnotifyrow(rows)
        setdismissMap(dismiss)
    }
    const getrowdata=(item)=>{
        const date = new Date().toISOString()
        const stamp = item.timestamp.replace(" ","T") + "Z"
        let diff = new Date(date).getTime() - new Date(stamp).getTime()
		let time = Math.floor(diff / 1000)
		let duration=""
		if(time < 60)
			duration = time + " secs ago"
		else if(time >= 60 && time < 3600){
			if(time < 120)
				duration = Math.floor(time / 60) + " min ago"
			else
				duration = Math.floor(time / 60) + " mins ago"
		}else if(time >= 3600 && time < 86400){
			if(time < 7200)
				duration = Math.floor(time / 3600) + " hour ago"
			else
				duration = Math.floor(time / 3600) + " hours ago"
		}else{
			if(time < 86400*2)
				duration = Math.floor(time / 86400) + " day ago"
			else
				duration = Math.floor(time / 86400) + " days ago"
		}
        if(item.isActionable == "true"){
            return{
                "message":item.message,
                "category":item.category,
                "Buttons" : [{"Label":"Accept", "method":dismissRow,"payload":item,"className":"btn btn-bf-primary","time":duration}]
            }
        }else if(item.actionTaken == null){
        return{
            "message":item.message,
            "category":item.category,
            "Buttons" : [{"Label":"Dismiss", "method":dismissRow,"payload":item,"className":"btn btn-bf-primary","time":duration}]
        }}else{
            return{
                "message":item.message,
                "category":item.category,
                "Buttons" : [{"Label":"", "method":dismissRow,"payload":item,"className":"btn btn-bf-primary","time":duration}]
            }
        }
    }
    const dismissModal=(data)=>{
        setnotifyModal(false)
        document.getElementById('root').style.filter = 'none';
        
        //notificationlist
    }
    const actionClick=(data)=>{
        setnotifyModal(false)
        document.getElementById('root').style.filter = 'none';
        if(data.label == 'Accept'){
            const request = {
                "loginUserName" : Storage.getItem('email'),
                "actionTaken": "accept",
                "notificationId":  data.notificationId,
				"readInd": true      
            }
            updateAction(request).then(response =>{
                setrefresh(refresh+1)
            })
        }else if(data.label == 'Decline'){
            const request = {
                "loginUserName" : Storage.getItem('email'),
                "actionTaken": "decline",
                "notificationId":  data.notificationId,
				"readInd": true        
            }
            updateAction(request).then(response =>{
                setrefresh(refresh+1)
            })
        }
    }
    const dismissRow=(row,data)=>{
        if(row.Buttons[0].Label == "Accept"){
            const request = {
                "loginUserName" : Storage.getItem('email'),
                "actionTaken": "accept",
                "notificationId":  data.notificationId,
				"readInd": true        
            }
            updateAction(request).then(response =>{
                setrefresh(refresh+1)
            })
        }else {
            delete notifyrow[dismissMap[data.notificationId]]
            const request = {
                "loginUserName" : Storage.getItem('email'),
                "actionTaken": "dismiss",
                "notificationId":  data.notificationId,
				"readInd": true          
            }
            updateAction(request).then(response =>{
            })
        }
    }
    const onRowClick=(data)=>{
        const Modal=[]
        let i = 0
        if(data.type == "create" || data.type == "update" || data.type == "delete"){
        notificationData.content.modalField.User.map((item)=>{
            if(item.name == 'email'){
                Modal[i] =  {"name":item.name, 
                            "label": item.label,
                            "field": data.actionDoneBy}
                i++
            }else if(item.name == 'mobile'){
                Modal[i] =  {"name":item.name, 
                            "label": item.label,
                            "field": phoneValidation(data.mobileNumber.toString()) }
                i++
            }else if(item.name == 'access'){
                Modal[i] =  {"name":item.name, 
                            "label": item.label,
                            "field": data.levelOfAccess? data.levelOfAccess?.split("(")[0] : ""}
                i++
            }else if(item.name == 'message'){
                Modal[i] =  {"name":item.name, 
                            "label": item.label,
                            "field": data.message}
                i++
            }else if(item.name == 'header'){
                
                Modal[i] =  {"name":item.name, 
                            "label": item.label,
                            "field": new Date(data.timestamp).toLocaleDateString('en-US',{ year: 'numeric', month: '2-digit', day: '2-digit' })+" |"+data.timestamp.substring(11,16)
                            }
                i++
            }else if(item.name == 'button'){
                if(data.isActionable == "false"){
                Modal[i] =  {"name":item.name, 
                            "label": item.label,
                            "styles":item.styles,
                            "notificationId":data.notificationId
                            }
                i++}
            }else if(item.name == 'action'){
                if(data.isActionable == "true"){
                Modal[i] =  {"name":item.type, 
                            "label": item.label1,
                            "styles":item.styles,
                            "notificationId":data.notificationId
                            }
                        i++
                Modal[i] =  {"name":item.type, 
                        "label": item.label2,
                        "styles":item.styles,
                        "notificationId":data.notificationId
                        }
                    i++
                }
            }

        })
        }
       else if(data.action == "profile"){
         notificationData.content.modalField.Update.map((item)=>{
            if(item.name == 'email'){
                Modal[i] =  {"name":item.name, 
                            "label": item.label,
                            "field": data.actionDoneBy}
                i++
            }else if(item.name == 'header'){
                
                Modal[i] =  {"name":item.name, 
                            "label": item.label,
                            "field": new Date(data.timeStamp).toLocaleDateString('en-US',{ year: 'numeric', month: '2-digit', day: '2-digit' })+" |"+data.timestamp.substring(11,16)
                            }
                i++
            }else if(item.name == 'oldemail'){
                
                Modal[i] =  {"name":item.name, 
                            "label": item.label,
                            "field": data.actionDoneBy
                            }
                i++
            }else if(item.name == 'newemail'){
                
                Modal[i] =  {"name":item.name, 
                            "label": item.label,
                            "field": data.actionDoneFor
                            }
                i++
            }else if(item.name == 'action'){
                if(data.actionable){
                Modal[i] =  {"name":item.type, 
                            "label": item.label1,
                            "styles":item.styles,
                            "notificationId":data.notificationId
                            }
                        i++
                Modal[i] =  {"name":item.type, 
                        "label": item.label2,
                        "styles":item.styles,
                        "notificationId":data.notificationId
                        }
                    i++
                }
            }
            })
        }
        setModaldata(Modal)
        setnotifyModal(true)
        
        document.getElementById('root').style.filter = 'blur(5px)';
    }
    const closeNotifyModal = () => {
        setnotifyModal(false)
        document.getElementById('root').style.filter = 'none';
      }
    const gettablefields=()=>{
        return (<>
        <BFTable Data ={notifyrow} 
        heading={headCells} 
        sortEnabled ={true} 
        rowClick = {onRowClick}
        onClick = {dismissRow}
        ></BFTable>
        </>
);
    }
    return (<>
              {isBusy ? (
        (<Loader/>)
      ) : (
        <div className='bf-notification-container'>
            <h1 className='bf-header'>{getHeaderText(notificationData && notificationData.content.primaryFields[0].label)}</h1>
            <div className="bf-table bf-notifications-table">
              {gettablefields()}
            </div> 
            {notifyModal?<NotifyModal
          onHide={() => closeNotifyModal()}
          show={notifyModal}
          json={Modaldata}
          onClickSubmit={dismissModal}
          onActionClick={actionClick}
      />:""}
        </div>
      )}
    </>);
}