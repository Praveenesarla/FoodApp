import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Tabs } from "expo-router";
import { colors } from "../../../constants";

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarLabelStyle: {
          fontFamily: "Bold",
          fontSize: 14,
        },
        tabBarInactiveTintColor: "#878787",
        tabBarActiveTintColor: colors.primary,
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 25,
          left: 16,
          right: 16,
          height: 70,
          borderRadius: 35,
          backgroundColor: "#fff",
          elevation: 5,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          paddingTop: 8,
          width: "auto",
          marginHorizontal: 15,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="search" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color }) => (
            <Feather name="shopping-bag" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="user-circle" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
