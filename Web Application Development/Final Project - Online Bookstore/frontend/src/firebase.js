// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3UKRway7KAEjFvZsg3UtIk6GKaMzC30w",
  authDomain: "web-ae132.firebaseapp.com",
  projectId: "web-ae132",
  storageBucket: "web-ae132.appspot.com",
  messagingSenderId: "473322362666",
  appId: "1:473322362666:web:e379e0cd762adb188c3053",
  measurementId: "G-422EVE3V31"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Initialize Firebase Analytics
getAnalytics(app);

export { app, auth };
