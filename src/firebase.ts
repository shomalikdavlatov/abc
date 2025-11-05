import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBe22t6Jdea-h2WulOj5hOc87TH-ZkG5p0",
    authDomain: "abc-tezdev-f5631.firebaseapp.com",
    projectId: "abc-tezdev-f5631",
    storageBucket: "abc-tezdev-f5631.firebasestorage.app",
    messagingSenderId: "892841549169",
    appId: "1:892841549169:web:66b2b7d8719ec07ccb6ad0",
    measurementId: "G-L0CHKRWC2W",
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
