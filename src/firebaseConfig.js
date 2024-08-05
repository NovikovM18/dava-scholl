// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCK51gyqHkDuUJPXABowAWGCUgT2i4NR2A",
  authDomain: "dava-school.firebaseapp.com",
  projectId: "dava-school",
  storageBucket: "dava-school.appspot.com",
  messagingSenderId: "533828497865",
  appId: "1:533828497865:web:79d9fa15581f9a5d5d7818",
  databaseURL: "https://dava-school-default-rtdb.europe-west1.firebasedatabase.app",
};

// Initialize Firebase
const appFire = initializeApp(firebaseConfig);
export default appFire;