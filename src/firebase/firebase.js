import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDNasQVvdm23a0GNq5lIek0t4bpkHB0g00",
  authDomain: "ai-personal-finance-assi-ca1fe.firebaseapp.com",
  projectId: "ai-personal-finance-assi-ca1fe",
  storageBucket: "ai-personal-finance-assi-ca1fe.firebasestorage.app",
  messagingSenderId: "604548384098",
  appId: "1:604548384098:web:70c3c56b36081f65b1983b",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);