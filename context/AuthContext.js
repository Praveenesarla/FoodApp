import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { signOut } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebaseConfig";

const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadAuthState = async () => {
      const storedAuth = await SecureStore.getItemAsync("isAuthenticated");
      if (storedAuth) {
        setUser(storedAuth);
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    loadAuthState();
  }, []);

  const login = async (uid) => {
    await SecureStore.setItemAsync("isAuthenticated", uid);
    setUser(uid);
    router.replace("/(main)");
  };

  const logout = async () => {
    try {
      await signOut(auth);
      await SecureStore.deleteItemAsync("isAuthenticated");
      setUser(null);
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Auth Context Provider must wrap the component");
  }
  return context;
};
