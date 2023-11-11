import * as firebase from 'firebase/app';
import { getAuth, FacebookAuthProvider } from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: 'AIzaSyDLE4z4TMB5SsM9RqSxcqj6iUwTT6TFGus',
  authDomain: 'clinic-admin-e5eae.firebaseapp.com',
  projectId: 'clinic-admin-e5eae',
  storageBucket: 'clinic-admin-e5eae.appspot.com',
  messagingSenderId: '713822273863',
  appId: '1:713822273863:web:15b2f34ade2fb01ecf4c62',
  measurementId: 'G-JLE3CG0FJQ',
};

// Initialize Firebase
export const firebaseApp = firebase.initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);

export const facebookAuth = new FacebookAuthProvider();
