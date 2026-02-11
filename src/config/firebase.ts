import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBYLiibKIgZ1Jl0migaQ3LWMjgSw1xXSoQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ml-gcp-workshop-487117.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ml-gcp-workshop-487117",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ml-gcp-workshop-487117.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "202948511064",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:202948511064:web:3dcf23fcb6085770f1d12d",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-DFSPPPBQ6P",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
