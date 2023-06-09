// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDTqe2LSXi2kmyvvg8UkH7KzV9mv87o8F8",
    authDomain: "bookstore-75b94.firebaseapp.com",
    projectId: "bookstore-75b94",
    storageBucket: "bookstore-75b94.appspot.com",
    messagingSenderId: "1080237158627",
    appId: "1:1080237158627:web:8d00ce6fd4ee271f76d5d6",
    measurementId: "G-QLDHLJDPJH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);