import * as firebase from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { MessagePayload, getMessaging, getToken, onMessage } from 'firebase/messaging';
import { getAnalytics } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';

import {
  getAuth,
  FacebookAuthProvider,
  GoogleAuthProvider,
  GithubAuthProvider,
  OAuthProvider,
} from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: 'AIzaSyBUjR_LpKzbeLaBANVXDN84BDLPLRn6VhM',
  authDomain: 'clinus-1d1d1.firebaseapp.com',
  databaseURL: 'https://clinus-1d1d1-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'clinus-1d1d1',
  storageBucket: 'clinus-1d1d1.appspot.com',
  messagingSenderId: '698964272341',
  appId: '1:698964272341:web:f8e27c1489c69dbf6cee5c',
  measurementId: 'G-13Z9189280',
};

// Initialize Firebase
export const firebaseApp = !firebase.getApps().length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.getApps()[0];

export const analytics = getAnalytics(firebaseApp);
export const firebaseAuth = getAuth(firebaseApp);
export const realtimeDB = getDatabase(firebaseApp);
export const firebaseMessaging = getMessaging(firebaseApp);
export const firebaseStorage = getStorage(firebaseApp);

export const FirebaseAuthProvider = {
  Google: new GoogleAuthProvider(),
  Facebook: new FacebookAuthProvider(),
  Github: new GithubAuthProvider(),
  Microsoft: new OAuthProvider('microsoft.com'),
  Apple: new OAuthProvider('apple.com'),
};

/**
 * Lấy device token để nhận thông báo tức thời từ firebase
 */
export const requestForToken = () => {
  return getToken(firebaseMessaging, {
    vapidKey:
      'BPq0Cn7VHMLHhi1BuOCLKVYbbJcR2zTl0b5J6bU0nm9tyXE8KZSzerwUj9GU6h11G4Yx4MtbkO88EzXaSSwKcQs',
  });
  // .then(currentToken => {
  //   if (currentToken) {
  //     console.log('Device token: ', currentToken);
  //     // Perform any other neccessary action with the token
  //   } else {
  //     // Show permission request UI
  //     console.log('Chưa cấp quyền nhận thông báo');
  //   }
  // })
  // .catch(err => {
  //   console.log('Lỗi trong khi lấy device token từ firbase', err);
  // });
};

/**
 * Lắng nghe sự kiện nhận thông báo từ firebase
 */
export const onMessageListener = (): Promise<MessagePayload> =>
  new Promise(resolve => {
    onMessage(firebaseMessaging, payload => {
      console.log('payload', payload);
      resolve(payload);
    });
  });
