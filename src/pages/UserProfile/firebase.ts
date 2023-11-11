// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { FacebookAuthProvider, getAuth, GoogleAuthProvider } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDLE4z4TMB5SsM9RqSxcqj6iUwTT6TFGus',
  authDomain: 'clinic-admin-e5eae.firebaseapp.com',
  projectId: 'clinic-admin-e5eae',
  storageBucket: 'clinic-admin-e5eae.appspot.com',
  messagingSenderId: '713822273863',
  appId: '1:713822273863:web:15b2f34ade2fb01ecf4c62',
  measurementId: 'G-JLE3CG0FJQ',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
//var provider = new firebase.auth.GoogleAuthProvider();

const provider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
provider.setCustomParameters({
  prompt: 'select_account',
});
export { auth, provider, facebookProvider };
