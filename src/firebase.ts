// firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyClEVVuGVz9Jj-1s13HzeWdXxnnH9fpC0w",
  authDomain: "esp32tcc-10c9a.firebaseapp.com",
  databaseURL: "https://esp32tcc-10c9a-default-rtdb.firebaseio.com/",
  projectId: "esp32tcc-10c9a",
  storageBucket: "esp32tcc-10c9a.appspot.com",
  messagingSenderId: "913192202444",
  appId: "SEU_VALOR_REAL"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);   // ← ESSA LINHA É CRUCIAL