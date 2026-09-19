// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCXCcQbN4WZYzSBVymH_P68mFZKAYXRiyY",
  authDomain: "lapak-ngadirejo.firebaseapp.com",
  projectId: "lapak-ngadirejo",
  storageBucket: "lapak-ngadirejo.firebasestorage.app",
  messagingSenderId: "399879062009",
  appId: "1:399879062009:web:6c28e24f71d6ab3131bd28",
  measurementId: "G-5JYD1Z848X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

import { getStorage } from "firebase/storage";
export const db = initializeFirestore(app, {});
export const storage = getStorage(app);