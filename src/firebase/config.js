import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCG6O16MXN1E5jo7ToIHcaB7hoiZbvtjU",
  authDomain: "giftshop-ea77f.firebaseapp.com",
  projectId: "giftshop-ea77f",
  storageBucket: "giftshop-ea77f.appspot.com", // ✅ Fixed this line
  messagingSenderId: "645069051234",
  appId: "1:645069051234:web:14354e0f4935043552083b",
  measurementId: "G-ZXZFHXEFNF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
