// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
   apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
   authDomain: "second-brain-a0a5f.firebaseapp.com",
   projectId: "second-brain-a0a5f",
   storageBucket: "second-brain-a0a5f.firebasestorage.app",
   messagingSenderId: "1038997230846",
   appId: "1:1038997230846:web:ffe6e721d9611a98c1c1af",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
