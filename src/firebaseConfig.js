import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBhGfYzo1FfMWwqiKGzyidfiQlPnpSLgTo",
  authDomain: "draganddrop-478ec.firebaseapp.com",
  databaseURL: "https://draganddrop-478ec-default-rtdb.firebaseio.com",
  projectId: "draganddrop-478ec",
  storageBucket: "draganddrop-478ec.firebasestorage.app",
  messagingSenderId: "731423889044",
  appId: "1:731423889044:web:ae50c57e9ae1e547da8681"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);