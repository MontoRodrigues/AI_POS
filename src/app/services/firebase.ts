
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";
import { getDatabase, ref, set, onValue, update, remove, push } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDbqfL47AocdZSzSJMWqSUiCwJ5Jtan5p0",
  authDomain: "aistoremanager-3c891.firebaseapp.com",
  databaseURL: "https://aistoremanager-3c891-default-rtdb.firebaseio.com",
  projectId: "aistoremanager-3c891",
  storageBucket: "aistoremanager-3c891.firebasestorage.app",
  messagingSenderId: "1031236397402",
  appId: "1:1031236397402:web:71915923f7f2e72264eb63",
  measurementId: "G-KWXR9JSPWY"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const database = getDatabase(app);
