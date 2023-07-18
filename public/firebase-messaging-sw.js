importScripts('https://www.gstatic.com/firebasejs/9.10.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.10.0/firebase-messaging-compat.js');


const firebaseConfig = {
    apiKey: "AIzaSyADT3rh9i6wKaadZNOxJxIdU75rGm-vHLw",
    authDomain: "bfalertnotifications.firebaseapp.com",
    projectId: "bfalertnotifications",
    storageBucket: "bfalertnotifications.appspot.com",
    messagingSenderId: "502011664771",
    appId: "1:502011664771:web:6ebdfbd0244ab40f7c7eb6"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();
messaging.onBackgroundMessage(function(payload) {
    console.log('Received background message ', payload);
  
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
    };
  
    self.registration.showNotification(notificationTitle,
      notificationOptions);
  });

// const messaging = firebase.messaging();

// messaging.onBackgroundMessage((payload) => {
//   console.log('Received background message: ', payload);

//   const notificationTitle = payload.notification.title;
//   const notificationOptions = { body: payload.notification.body };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });