import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAMFHej17QsOY1KZFn-R4K1KcgCMlJIEiY",
  authDomain: "sampeyan-9fdc6.firebaseapp.com",
  projectId: "sampeyan-9fdc6",
  storageBucket: "sampeyan-9fdc6.appspot.com",
  messagingSenderId: "121984951624",
  appId: "1:121984951624:web:d0afce63f68911ed50bf7d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
