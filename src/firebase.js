// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB4hZM_FTXrLf9GVwC3pjtFaRGLoAoWM6Y",
  authDomain: "threat-intel-workshop-auth.firebaseapp.com",
  projectId: "threat-intel-workshop-auth",
  storageBucket: "threat-intel-workshop-auth.firebasestorage.app",
  messagingSenderId: "956850418713",
  appId: "1:956850418713:web:0f46db4e63e0b2e34ca688",
  measurementId: "G-MB8BDF35JJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Firestore with persistence
export const db = getFirestore(app);

// Enable offline persistence
try {
  enableIndexedDbPersistence(db)
    .then(() => {
      console.log('Offline persistence enabled');
    })
    .catch((err) => {
      console.error('Error enabling offline persistence:', err);
    });
} catch (error) {
  console.error('Error setting up persistence:', error);
}

// Initialize Analytics - only in browser environments
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}
export const firebaseAnalytics = analytics;
export default app;
