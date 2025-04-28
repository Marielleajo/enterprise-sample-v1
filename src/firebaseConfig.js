
import firebase from "firebase/compat/app";
import "firebase/compat/messaging";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object

const firebaseConfig = {
    // apiKey: "AIzaSyBUEI1kZUrBteltlaDLUKcIQXM2B4kYciM",
    // authDomain: "omni-mm-407507.firebaseapp.com",
    // projectId: "omni-mm-407507",
    // storageBucket: "omni-mm-407507.appspot.com",
    // messagingSenderId: "621118023682",
    // appId: "1:621118023682:web:0d686134bad04b01391f1b"
    apiKey: "AIzaSyBSF30zVJx39lr0XqSciRsdI5p48EUP_vE",
    authDomain: "testomni-c6111.firebaseapp.com",
    projectId: "testomni-c6111",
    storageBucket: "testomni-c6111.appspot.com",
    messagingSenderId: "984493252281",
    appId: "1:984493252281:web:e59a88b692178f246b8568",
    measurementId: "G-WNW3P75E3C"
}; 

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
export const messaging = firebase.messaging();