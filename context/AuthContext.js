import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";

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
    await SecureStore.deleteItemAsync("isAuthenticated");
    setUser(null);
    router.replace("/(auth)/login");
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
