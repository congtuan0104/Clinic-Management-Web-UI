// Import the functions you need from the SDKs you need
import * as firebase from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA98sO_BtFdpH4yl_TPo-DfNIa6Q3r_9co",
  authDomain: "login-6752e.firebaseapp.com",
  projectId: "login-6752e",
  storageBucket: "login-6752e.appspot.com",
  messagingSenderId: "931199521045",
  appId: "1:931199521045:web:37a2732ed858b675e0d91c",
  measurementId: "G-7JLRRQJENS"
};

// Initialize Firebase
const app = !firebase.getApps().length ? firebase.initializeApp(firebaseConfig) : firebase.getApps()[0];

const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account"
});

const fbProvider = new FacebookAuthProvider();
fbProvider.setCustomParameters({
  prompt: "select_account"
});

export { auth, provider, fbProvider };