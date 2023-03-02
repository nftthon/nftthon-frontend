import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

function getApp() {
    // Your web app's Firebase configuration
    const firebaseConfig = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: "nft-contest-v2.firebaseapp.com",
        projectId: "nft-contest-v2",
        storageBucket: "nft-contest-v2.appspot.com",
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID
    };
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    return app
}

export function fetchDb() {
  const app = getApp();
  const db = getFirestore(app);

  return db  
}

export function fetchStorage() {
  const app = getApp();
  const storage = getStorage(app);
  
  return storage  
}