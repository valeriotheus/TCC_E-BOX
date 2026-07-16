import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyClEVVuGVz9Jj-1s13HzeWdXxnnH9fpC0w",
  authDomain: "esp32tcc-10c9a.firebaseapp.com",
  databaseURL: "https://esp32tcc-10c9a-default-rtdb.firebaseio.com",
  projectId: "esp32tcc-10c9a",
  storageBucket: "esp32tcc-10c9a.firebasestorage.app",
  messagingSenderId: "913192202444",
  appId: "1:913192202444:web:756583b8f658212d329269",
  measurementId: "G-T9EBF5G8QJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Exporta o serviço de autenticação
export const auth = getAuth(app);