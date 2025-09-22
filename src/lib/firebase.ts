// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "studio-9735311338-6f07f",
  "appId": "1:300943494393:web:50064c5b70050839d8e628",
  "apiKey": "AIzaSyA8xeSepMiTRjvw41ksh4jGHwPVuIYD_JA",
  "authDomain": "studio-9735311338-6f07f.firebaseapp.com",
  "measurementId": "G-5512S4VEEJ",
  "messagingSenderId": "300943494393",
  "storageBucket": "studio-9735311338-6f07f.appspot.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
