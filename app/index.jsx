import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useDispatch } from "react-redux";

export default function Index() {
  const { user } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();
  const userAuth = getAuth().currentUser;

  useEffect(() => {
    if (user) {
      router.replace("/(main)");
    } else {
      router.replace("/(auth)/login");
    }
  }, [user]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
