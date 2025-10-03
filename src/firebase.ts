import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAKsnULuwYs2avJ7weNIr2I6ErnhZRahak",
  authDomain: "abc-tezdev.firebaseapp.com",
  projectId: "abc-tezdev",
  storageBucket: "abc-tezdev.firebasestorage.app",
  messagingSenderId: "810569066209",
  appId: "1:810569066209:web:9e5aa228ee4068f680f9a0",
  measurementId: "G-7KF81DG606"
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
