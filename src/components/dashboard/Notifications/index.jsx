import React, { useState, useEffect,useRef } from 'react';
import { OverlayTrigger, Tab, Tabs, Button, Popover } from 'react-bootstrap';
import { propsWithBsClassName } from 'react-bootstrap-typeahead/types/utils';
import { FaBell } from "react-icons/fa";
import { Storage } from '../../../controls/Storage';
import { bfaJsonService } from '../../../actions/BFAServices/BFAJsonService';
import { notificationlist,updateNotification,updateAction } from '../../../actions/notificationService/notificationService';
import Loader from '../../loader/loader';
import './notifications.scss';
import { hideMenu } from 'react-bootstrap-typeahead/types/core/Typeahead';

const Notifications = (props) => {
	const [number,setnumber] = useState(null)
	const [total,settotal] = useState(null)
	const [isBusy, setBusy] = useState(true)
	const [show,setshow] = useState(false)
	const [refresh,setrefresh]=useState(0);
	const [sliceval,setsliceval]=useState(null)
	const [notificationsData, setnotificationsData] = useState([])
	const MINUTE_MS = 60000;
	const request = {
		"loginUserName" : Storage.getItem('email')
	}
	const [windowSize, setWindowSize] = useState(null);
	useEffect(() => {
		notificationlist(request).then(response => {
			let payload = JSON.parse(response.data[0][0]['@JSONResponse']);
			let num = 0;
			// let notify = [];
			// payload.forEach((item,index)=>{
			// 	notify[index] = {"message": item.message,
			// 					"action": item.isActionable,
			// 					"time": item.timestamp,}
			// })
			console.log(payload)
			let notifications = payload.notifications || payload.notifications !== null ?  payload.notifications : []
			num =  payload && payload.notifications && Array.isArray(payload.notifications)? payload.notifications.length : 0
			if(payload && payload.NotificationsCount.NewCount){setnumber(payload.NotificationsCount.NewCount)}
			else(setnumber(0))
			settotal(num)
			setnotificationsData(notifications)
			setBusy(false)
		});
	}, [refresh]);

	useEffect(() => {
		const interval = setInterval(() => {
			let num = 0
			let payload = []
			let notify = []
			notificationlist(request).then(response => {
				let payload = JSON.parse(response.data[0][0]['@JSONResponse']);
				num = payload && payload.notifications.length
				if(payload && payload.length && payload.NotificationsCount.NewCount != null){
					setnumber(payload.NotificationsCount.NewCount)
					settotal(num)
					setnotificationsData(payload.notifications)
					//setrefresh(refresh+1)
				}
			})
		}, MINUTE_MS);
	  
		return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
	  }, [])

	//   useEffect(() => {
	// 	function handleWindowResize() {
	// 	  const size = getWindowSize();
	// 	  setsliceval(size.innerHeight/100)
	// 	}	
	// 	window.addEventListener('resize', handleWindowResize);	
	// 	return () => {
	// 	  window.removeEventListener('resize', handleWindowResize);
	// 	};
		
	//   }, []);
	// const getWindowSize = () => {
	// 	const {innerWidth, innerHeight} = window;
	// 	return {innerWidth, innerHeight};
    // }
	const NotificationRow = ({data}) => {
		const date = new Date().toISOString()
		const stamp = data.timestamp.replace(" ","T") + "Z"
		let diff = new Date(date).getTime() - new Date(stamp).getTime()
		let time = Math.floor(diff / 1000)
		// console.log(date,stamp)
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
		return (
			<div>
				<div className='notification-info'>{data.message}</div>
				<div className='notification-time'>{duration}</div>
				{data.isActionable == "true" && (
					<div className='d-flex justify-content-end action-buttons bf-notifications-popover-buttons'>
						<Button className='bf-btn-imp' variant='dark' size='sm' onClick={(e)=>acceptClick(data)}>
							Accept
						</Button>
						<Button className='bf-btn-imp' variant='outline-dark' size='sm' onClick={(e)=>declineClick(data)}>
							Decline
						</Button>
					</div>
				)}
				<hr />
			</div>
		);
	};

    const acceptClick=(data)=>{
            const request = {
                "loginUserName" : Storage.getItem('email'),
                "actionTaken": "accept",
                "notificationId":  data.notificationId,
				"readInd": true       
            }
            updateAction(request).then(response =>{
                setrefresh(refresh+1)
            })
	}
    const declineClick=(data)=>{
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

	const NotificationsTabs = () => {

		let paylod = { 'blobname': process.env.REACT_APP_NOTIFICATION };
		const [notbusy, setnotbusy] = useState(true)
	
		const [jsonData, setJsonData] = useState({});
	
		const gotoNotify=()=>{
			props.onNotificationClick('notification')

		}
		
		useEffect(() => {
		 	setnotbusy(true)
		// 	notificationlist(request).then(response => {
		// 		let payload = response.data.notifications
		// 		let notify = [];
		// 		payload.forEach((item,index)=>{
		// 			notify[index] = {"message": item.message,
		// 										"action": item.isActionable,
		// 										"time": item.timestamp}
		// 		})
		// 		setnotificationsData(notify)
		// 	});
		 	setnotbusy(false)
		 }, []);
	
	
		// console.log('notificationsData', notificationsData)
	
		return (<>
			{notbusy ? (
				  (<Loader/>)
			) : (<>
			<Tabs defaultActiveKey='Notifications' id='uncontrolled-tab-example' className='mb-3'>
				<Tab
					eventKey='Notifications'
					title={
						<div className='tab-heading'>
							Notifications <span className='nav-item-count'>{total}</span>
						</div>
					}
				>
					{notificationsData ? notificationsData.slice(0,total).map((notification) => <NotificationRow  data={notification}/>) : ''}
				</Tab>
				{/* <Tab
					eventKey='Actionable'
					title={
						<div className='tab-heading'>
							Actionable <span className='nav-item-count'>4</span>
						</div>
					}
				>
					{notificationsData ? notificationsData.slice(0, 5).map((notification) => <NotificationRow data={notification} />) : ''}
					{notificationsData ? notificationsData.length > 5 && <div className='text-center notification-info'>View all</div> : ''}
				</Tab>
				<Tab
					eventKey='Informational'
					title={
						<div className='tab-heading'>
							Informational <span className='nav-item-count'>8</span>
						</div>
					}
				>
					{notificationsData ? notificationsData.slice(0, 3).map((notification) => <NotificationRow data={notification} />) : ''}
					{notificationsData ? notificationsData.length > 3 && <div className='text-center notification-info'>View all</div> : ''}
				</Tab> */}
			</Tabs>
				<div className='text-center notification-info bf-view-all' onClick={(e)=>gotoNotify()}>View all</div>
</>
			)}
		</>);
	};

	const showMenu = ()=>{
        setshow(true)
		if(number != 0){
			const payload = {
				"loginUserName" : Storage.getItem('email')
			}
			updateNotification(payload).then(response => {

			})
			setnumber(0)
		}
    }
    const hideMenu = ()=>{
        setshow(false)
    }
	return (<>
		{isBusy ? (
			  (<Loader/>)
		) : (<div onMouseOver={(e)=>showMenu()} onMouseOut={(e)=>hideMenu()} onFocus={(e)=>{showMenu()}} onBlur={(e)=>{hideMenu()}}>
		<OverlayTrigger
			trigger='manual'
			rootClose
			show={show}
			placement='bottom'
			// container={ref}
			overlay={
				<Popover id='popover-positioned-bottom' className='notifications-popover'
				onMouseOver={(e)=>showMenu()} onMouseOut={(e)=>hideMenu()} onFocus={(e)=>{showMenu()}} onBlur={(e)=>{hideMenu()}}> 
					<Popover.Header as='h3' />
					<Popover.Body>
						<NotificationsTabs />
					</Popover.Body>
				</Popover>
			}
		>
			<div className='position-relative'>
				<FaBell size='25' className='bell-icon' />
				{number != 0 ? <div className='notification-count'>{number > 99 ? (<>99+</>) : number}</div>
				: ''}
			</div>
		</OverlayTrigger>
		</div>
		)}
	</>);
};

export default Notifications;
