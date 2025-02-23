import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAyRqqUV_r5WQs6dTpnyGPDqp5e30t0n-Y",
    authDomain: "medicine-delivery-app-cb20a.firebaseapp.com",
    projectId: "medicine-delivery-app-cb20a",
    storageBucket: "medicine-delivery-app-cb20a.firebasestorage.app",
    messagingSenderId: "601325579182",
    appId: "1:601325579182:web:c51ac8bb12458c2eb2763f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
