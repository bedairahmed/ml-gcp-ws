import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBYLiibKIgZ1Jl0migaQ3LWMjgSw1xXSoQ",
  authDomain: "ml-gcp-workshop-487117.firebaseapp.com",
  projectId: "ml-gcp-workshop-487117",
  storageBucket: "ml-gcp-workshop-487117.firebasestorage.app",
  messagingSenderId: "202948511064",
  appId: "1:202948511064:web:3dcf23fcb6085770f1d12d",
  measurementId: "G-DFSPPPBQ6P",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
