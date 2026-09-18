import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAM5uSYvS-8ibY31fGw6tAugaekNSG3zHQ",
  authDomain: "ngadirejo-bc02c.firebaseapp.com",
  projectId: "ngadirejo-bc02c",
  storageBucket: "ngadirejo-bc02c.firebasestorage.app",
  messagingSenderId: "755485379012",
  appId: "1:755485379012:web:8d1b98e417c16ecb433c91"
};

const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true
});
