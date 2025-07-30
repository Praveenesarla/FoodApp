import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { AuthContextProvider } from "@/context/AuthContext";
import { LocationContextProvider } from "@/context/LocationContext";
import "@/global.css";
import store from "@/store/store";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { PaperProvider } from "react-native-paper";
import { Provider } from "react-redux";

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Bold: require("../assets/fonts/Quicksand-Bold.ttf"),
    Medium: require("../assets/fonts/Quicksand-Medium.ttf"),
    SemiBold: require("../assets/fonts/Quicksand-SemiBold.ttf"),
    Regular: require("../assets/fonts/Quicksand-Regular.ttf"),
    RubikB: require("../assets/fonts/Rubik-Bold.ttf"),
    RubikM: require("../assets/fonts/Rubik-Medium.ttf"),
    RubikSB: require("../assets/fonts/Quicksand-SemiBold.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  return (
    <PaperProvider>
      <GluestackUIProvider mode="light">
        <LocationContextProvider>
          <Provider store={store}>
            <AuthContextProvider>
              <StatusBar style="light" />
              <Stack screenOptions={{ headerShown: false }} />
            </AuthContextProvider>
          </Provider>
        </LocationContextProvider>
      </GluestackUIProvider>
    </PaperProvider>
  );
}
