//@ts-ignore
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
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
// initalize Firestore DataBase
export const db = getFirestore(app);

// initialize Firebase Authentication
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const updateCartItemsInFirebase = async (uid, cartItems) => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      cartItems: cartItems,
    });
    console.log("✅ Cart updated in Firestore");
  } catch (error) {
    console.error("❌ Failed to update cart:", error);
  }
};

export const fetchCartItemsFromFirebase = async (uid) => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      return userData.cartItems || [];
    } else {
      console.log("User not found");
      return [];
    }
  } catch (error) {
    console.error("Error reading user cart items:", error);
    return [];
  }
};
