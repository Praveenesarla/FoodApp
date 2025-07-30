import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "@/components/ui/actionsheet";
import {
  AntDesign,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import { useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, offers } from "../../../constants";
import { useAuth } from "../../../context/AuthContext";
import { useLocation } from "../../../context/LocationContext";
const Index = () => {
  const { user, login, logout } = useAuth();
  const { location, home, work } = useLocation();
  const [showActionsheet, setShowActionsheet] = useState(false);
  const handleClose = () => setShowActionsheet(false);
  const handleOpen = () => setShowActionsheet(true);
  return (
    <SafeAreaView style={{ paddingHorizontal: 15 }}>
      {/* Header */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ paddingBottom: 10 }}>
          <Text style={styles.headerFirst}>Deliver to</Text>
          <Pressable
            style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
            onPress={handleOpen}
          >
            <Text style={styles.headerSec}>{location}</Text>
            <Entypo name="arrow-with-circle-down" size={18} color="black" />
          </Pressable>
        </View>
        <View
          style={{
            width: 48,
            height: 48,
            backgroundColor: colors.black,
            borderRadius: 24,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Feather name="shopping-bag" size={24} color={colors.white} />
        </View>
      </View>
      {/* <Text onPress={logout}>Logout</Text> */}
      <FlatList
        showsVerticalScrollIndicator={false}
        data={offers}
        contentContainerStyle={{ gap: 15, paddingBottom: 150 }}
        renderItem={({ item, index }) => {
          const isEven = index % 2 === 0;
          return (
            <View
              style={{
                backgroundColor: item.color,
                width: "100%",
                height: 225,
                borderRadius: 20,
                flexDirection: isEven ? "row-reverse" : "row",
                alignItems: "center",
                justifyContent: "space-between",
                position: "relative",
              }}
            >
              <Image
                source={item.image}
                style={{
                  width: 210,
                  height: "100%",
                  borderRadius: 20,
                }}
                resizeMode={index === 2 ? "cover" : "contain"}
              />
              <View
                style={{
                  position: "absolute",

                  right: index % 2 === 0 ? 180 : 0,
                  gap: 20,
                }}
              >
                <Text
                  style={[
                    styles.bannerTitle,
                    {
                      textAlign: isEven ? "left" : "right",
                      alignSelf: "center",

                      flex: 1,
                    },
                  ]}
                >
                  {item.title}
                </Text>
                {index !== 0 ? (
                  <View
                    style={{
                      width: 55,
                      height: 26,
                      borderWidth: 2,
                      borderRadius: 20,
                      borderColor: colors.white,
                      justifyContent: "center",
                      alignItems: "center",
                      marginLeft: index % 2 === 0 ? 0 : 20,
                    }}
                  >
                    <FontAwesome
                      name="long-arrow-right"
                      size={24}
                      color={colors.white}
                    />
                  </View>
                ) : (
                  <Text style={styles.price}>$10.88</Text>
                )}
              </View>
            </View>
          );
        }}
      />
      <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <View>
            <Text
              style={{
                textAlign: "center",
                fontFamily: "RubikB",
                fontSize: 20,
                color: colors.primary,
              }}
            >
              Select Delivery Address
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginVertical: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => home()}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 1,
                  borderRadius: 15,
                  borderColor: colors.inputBorder,
                  padding: 20,
                  marginHorizontal: 20,
                }}
              >
                <FontAwesome name="home" size={24} color={colors.primary} />
                <Text
                  style={{
                    fontFamily: "Regular",
                    fontSize: 18,
                    color: colors.black,
                  }}
                >
                  Home
                </Text>
                {location === "Home" && (
                  <AntDesign
                    name="checkcircle"
                    size={24}
                    style={{ position: "absolute", top: -5, right: -9 }}
                    color={colors.primary}
                  />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => work()}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 1,
                  borderRadius: 15,
                  borderColor: colors.inputBorder,
                  padding: 20,
                  marginHorizontal: 20,
                }}
              >
                <MaterialCommunityIcons
                  name="office-building-marker"
                  size={24}
                  color={colors.primary}
                />
                <Text
                  style={{
                    fontFamily: "Regular",
                    fontSize: 18,
                    color: colors.black,
                  }}
                >
                  Work
                </Text>
                {location === "Work" && (
                  <AntDesign
                    name="checkcircle"
                    size={24}
                    style={{ position: "absolute", top: -5, right: -9 }}
                    color={colors.primary}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ActionsheetContent>
      </Actionsheet>
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({
  headerFirst: {
    fontFamily: "Bold",
    fontSize: 12,
    color: colors.primary,
  },
  headerSec: {
    fontFamily: "SemiBold",
    fontSize: 16,
    color: colors.black,
  },
  bannerTitle: {
    fontSize: 36,
    fontFamily: "RubikB",
    color: colors.white,
    marginRight: 10,
    fontWeight: "heavy",
    width: 182,
  },
  price: {
    fontSize: 24,
    fontFamily: "RubikB",
    color: colors.white,
  },
});
