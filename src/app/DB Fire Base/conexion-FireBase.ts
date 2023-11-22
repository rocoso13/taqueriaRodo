// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAEWnlQKR4T1Bj-txwWFyYUtwOoG6GhJ4I",
  authDomain: "negociokevin-52bda.firebaseapp.com",
  projectId: "negociokevin-52bda",
  storageBucket: "negociokevin-52bda.appspot.com",
  messagingSenderId: "350374123072",
  appId: "1:350374123072:web:17a65ebd52127c8fe1b1a5",
  measurementId: "G-BYB8TCN5PX"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const analytics = getAnalytics(app);