// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyAIlN3dwgBZ94dVrKoyPj7kJWlvAmL7cXY",
//   authDomain: "fir-2c175.firebaseapp.com",
//   projectId: "fir-2c175",
//   storageBucket: "fir-2c175.appspot.com",
//   messagingSenderId: "291757822275",
//   appId: "1:291757822275:web:5f7474ed67b57c3140dff6"
// };

const firebaseConfig = {
  apiKey: "AIzaSyAIlN3dwgBZ94dVrKoyPj7kJWlvAmL7cXY",
  authDomain: "fir-2c175.firebaseapp.com",
  projectId: "fir-2c175",
  storageBucket: "fir-2c175.appspot.com",
  messagingSenderId: "291757822275",
  appId: "1:291757822275:web:5f7474ed67b57c3140dff6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export {auth}
export const db = getFirestore(app)
