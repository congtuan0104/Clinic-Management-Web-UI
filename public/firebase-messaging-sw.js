// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
/* eslint-env es6 */
/* eslint-disable no-console */
const firebaseConfig = {
  apiKey: 'AIzaSyBUjR_LpKzbeLaBANVXDN84BDLPLRn6VhM',
  authDomain: 'clinus-1d1d1.firebaseapp.com',
  databaseURL: 'https://clinus-1d1d1-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'clinus-1d1d1',
  storageBucket: 'clinus-1d1d1.appspot.com',
  messagingSenderId: '698964272341',
  appId: '1:698964272341:web:f8e27c1489c69dbf6cee5c',
  measurementId: 'G-13Z9189280',
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);
 // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});