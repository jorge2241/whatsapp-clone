import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBCQUMFu3b9bQ72JTgjZPYfLQOE6--TWHE",
  authDomain: "whatsapp-clone-29b8e.firebaseapp.com",
  projectId: "whatsapp-clone-29b8e",
  storageBucket: "whatsapp-clone-29b8e.firebasestorage.app",
  messagingSenderId: "346320360006",
  appId: "1:346320360006:web:c7b34c1edc145a3b9eb047",
  measurementId: "G-TVJ4E5JFDY"
};

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;