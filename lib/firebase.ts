// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA-4NDeAqLVkUmR2zSWs1k8prWR_HPt2OQ",
  authDomain: "tp-gsb-database.firebaseapp.com",
  projectId: "tp-gsb-database",
  storageBucket: "tp-gsb-database.firebasestorage.app",
  messagingSenderId: "721989656714",
  appId: "1:721989656714:web:e1748b22a8125736820d73",
  measurementId: "G-YPCY4JBV94"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);