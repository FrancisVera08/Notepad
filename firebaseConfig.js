// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCXomDFa-rYrZ2TzxnSaV7L-TPRwTwHECQ",
  authDomain: "notepad-app-54ec1.firebaseapp.com",
  projectId: "notepad-app-54ec1",
  storageBucket: "notepad-app-54ec1.appspot.com",
  messagingSenderId: "954864087479",
  appId: "1:954864087479:web:174f45bf6f8650c45f7832"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
