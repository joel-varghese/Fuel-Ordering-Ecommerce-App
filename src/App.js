import React, { Fragment, useEffect, useState } from 'react';
import Menubar from './components/Menubar';
import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss'
import { getFirebaseToken, onForegroundMessage } from './firebase';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from 'react-toastify';
function App() {
	useEffect(() => {
		firebaseMessagingInit()
		onForegroundMessage().then((payload) => {
        const { notification: { title, body } } = payload;
        toast(<ToastifyNotification title={title} body={body} />);
      })
      .catch(err => console.log('An error occured while retrieving foreground message. ', err));
	}, [])

	 const firebaseMessagingInit = async () => {
		if(!("Notification" in window)) {
		  console.log("Browser doesn't support Notification")

		} else if (Notification.permission === "granted") {
			getFirebaseToken()
			// generateFCMToken()

		  // next steps for notifications
		} else if (Notification.permission !== "denied") {
		  try {
			const permission = await Notification.requestPermission();
			if(permission === "granted") {
				getFirebaseToken()

			}
  
		  } catch(error) {
			console.log(error);
		  }
		}
	  
	  }
	const ToastifyNotification = ({ title, body }) => (
		<div className="push-notification">
		<h2 className="push-notification-title">{title}</h2>
		<p className="push-notification-text">{body}</p>
		</div>
	);
	return (
		<Fragment>
	  		<ToastContainer/>
			<Menubar/>
		</Fragment>
	);
}
	
export default App;