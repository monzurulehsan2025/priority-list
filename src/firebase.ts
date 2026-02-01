import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your actual Firebase configuration retrieved from the console
const firebaseConfig = {
    apiKey: "AIzaSyBA77zn1EC1nTiGTKJeKG-pTsI6SXl4T1w",
    authDomain: "priority-list-45180.firebaseapp.com",
    projectId: "priority-list-45180",
    storageBucket: "priority-list-45180.firebasestorage.app",
    messagingSenderId: "970115568085",
    appId: "1:970115568085:web:a4b7feee913054bfb36d5c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
