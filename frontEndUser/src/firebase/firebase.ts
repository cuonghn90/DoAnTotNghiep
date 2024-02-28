// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
    apiKey: "AIzaSyDHsSHzHMS4lnkZ_UbvikjmIac5booB6e4",
    authDomain: "datn-d873c.firebaseapp.com",
    projectId: "datn-d873c",
    storageBucket: "datn-d873c.appspot.com",
    messagingSenderId: "973983071063",
    appId: "1:973983071063:web:60e763d5b8e37008d15c12"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();