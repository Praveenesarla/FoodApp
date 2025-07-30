import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { useAuth } from "../../context/AuthContext";

const MainLayout = () => {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href={"/(auth)"} />;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="dark" />
    </>
  );
};

export default MainLayout;

const styles = StyleSheet.create({});
