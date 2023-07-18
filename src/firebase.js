import { initializeApp } from "firebase/app";
import { getToken, getMessaging, onMessage } from 'firebase/messaging';

// FIrebase Config
const firebaseConfig = {
    apiKey: "AIzaSyADT3rh9i6wKaadZNOxJxIdU75rGm-vHLw",
    authDomain: "bfalertnotifications.firebaseapp.com",
    projectId: "bfalertnotifications",
    storageBucket: "bfalertnotifications.appspot.com",
    messagingSenderId: "502011664771",
    appId: "1:502011664771:web:6ebdfbd0244ab40f7c7eb6"
};
const firebase = initializeApp(firebaseConfig);

const messaging = getMessaging(firebase);

export const getOrRegisterServiceWorker = () => {
    if ('serviceWorker' in navigator) {
        
      return navigator.serviceWorker.getRegistration(`./firebase-push-notification-scope`).then((serviceWorker) => {
            if(serviceWorker) {
                return serviceWorker
            }else{
                return navigator.serviceWorker.register('./firebase-messaging-sw.js', {
                    scope: './firebase-push-notification-scope',
                });
            }
        });
    }
    throw new Error('The browser doesn`t support service worker.');
  };
  
//   export const getFirebaseToken = () =>{
//     // const messaging = getMessaging();
//     // let servInt = getOrRegisterServiceWorker()
//     console.log(messaging)
//     getToken(messaging, { vapidKey: 'BAkqJIiH9s1YlzKIyqtFVGQ-qdXsbCLTWuDhJwOQw6Rum2yef7SRh112bxYv5lFECkQSsQDFoetFAkca430evn8' }).then((currentToken) => {
//     if (currentToken) {
//         // Send the token to your server and update the UI if necessary
//         console.log(currentToken)
//         // ...
//     } else {
//         // Show permission request UI
//         console.log('No registration token available. Request permission to generate one.');
//         // ...
//     }
//     }).catch((err) => {
//     console.log('An error occurred while retrieving token. ', err);
//     // ...
//     });
//     }
export const getFirebaseToken = () =>
  getOrRegisterServiceWorker().then((serviceWorkerRegistration) =>
      console.log(getToken(messaging, { vapidKey: "BAkqJIiH9s1YlzKIyqtFVGQ-qdXsbCLTWuDhJwOQw6Rum2yef7SRh112bxYv5lFECkQSsQDFoetFAkca430evn8", serviceWorkerRegistration })));

        
  export const onForegroundMessage = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => resolve(payload))});

export default firebase;