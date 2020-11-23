import firebase from 'firebase';
import 'firebase/firestore';

if (!firebase.apps.length) {
  const firebaseConfig = {
    apiKey: 'AIzaSyDGm-psNe8QyQ_aSfqxIWU7n-NwmwAfap8',
    authDomain: 'fire-poker-e61f8.firebaseapp.com',
    databaseURL: 'https://fire-poker-e61f8.firebaseio.com',
    projectId: 'fire-poker-e61f8',
    storageBucket: 'fire-poker-e61f8.appspot.com',
    messagingSenderId: '105128322524',
    appId: '1:105128322524:web:ce4c48aa28dbd959541b19',
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.firestore().settings({});
}

export const fireDb = firebase.database();
