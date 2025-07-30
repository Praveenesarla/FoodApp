//@ts-ignore
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDMH-0_dp-566SflWGbWB7aUEDG_6e8Dg0",
  authDomain: "foodapp-f2177.firebaseapp.com",
  projectId: "foodapp-f2177",
  storageBucket: "foodapp-f2177.firebasestorage.app",
  messagingSenderId: "966915383668",
  appId: "1:966915383668:web:3ce6a779d9f9702b64cc21",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
