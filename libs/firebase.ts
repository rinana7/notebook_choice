import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";


// Firebaseコンソールからコピーしたあなたの設定値
const firebaseConfig = {
  apiKey: "AIzaSyAb_kcLOtiribsVFlK6GeMSc8S0XYhEfv0",
  authDomain: "textbook-choice.firebaseapp.com",
  projectId: "textbook-choice",
  storageBucket: "textbook-choice.firebasestorage.app",
  messagingSenderId: "661661767237",
  appId: "1:661661767237:web:7f51442191b6166ace752c",
  measurementId: "G-YGPB1262ZW"
};

// 1. Firebase App を初期化 ([DEFAULT] が作成される)
const app = initializeApp(firebaseConfig);

// 2. Storage インスタンスをエクスポート
export const storage = getStorage(app);
export const db = getFirestore(app, "notebook");
export const auth = getAuth(app);
export default app;