import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQDhmraBb_Sdy5UOtagVUPSowS9E7JvEk",
  authDomain: "cuc-deporte.firebaseapp.com",
  projectId: "cuc-deporte",
  storageBucket: "cuc-deporte.appspot.com",
  messagingSenderId: "608041222742",
  appId: "1:608041222742:web:efcdea5575a8248281f1f7"
  };

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);