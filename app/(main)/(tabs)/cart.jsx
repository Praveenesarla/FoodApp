import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "@/components/ui/actionsheet";
import {
  AntDesign,
  Feather,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, images } from "../../../constants";
import { useLocation } from "../../../context/LocationContext";

const Cart = () => {
  const [isChecked, setChecked] = useState(false);
  const [showActionsheet, setShowActionsheet] = useState(false);
  const handleClose = () => setShowActionsheet(false);
  const handleOpen = () => setShowActionsheet(true);
  const { location, home, work } = useLocation();
  const cartItems = [
    {
      id: 1,
      title: "Burger With Meat",
      image: images.burgerTwo,
      price: 235,
      quantity: 2,
    },
    {
      id: 2,
      title: "Burger With Meat",
      image: images.burgerTwo,
      price: 235,
      quantity: 2,
    },
    {
      id: 3,
      title: "Burger With Meat",
      image: images.burgerTwo,
      price: 235,
      quantity: 2,
    },
  ];
  return (
    <SafeAreaView style={{ paddingHorizontal: 10 }}>
      <View style={styles.headerContanier}>
        <Ionicons name="arrow-back" size={30} color="black" />
        <Feather name="search" size={30} color="black" />
      </View>
      <View style={styles.headerContanier}>
        <View>
          <Text style={styles.headerFirst}>Delivery location</Text>
          <Text style={styles.headerSec}>{location}</Text>
        </View>
        <TouchableOpacity style={styles.locationChange} onPress={handleOpen}>
          <Text style={styles.headerFirst}>Change Location</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        ListFooterComponentStyle={{ paddingBottom: 200 }}
        ListFooterComponent={
          <>
            <View
              style={{
                width: "auto",
                height: 257,
                backgroundColor: "#EDEDED",
                borderRadius: 16,
                borderWidth: 0.5,
                marginVertical: 30,

                padding: 20,
              }}
            >
              <Text
                style={{
                  color: colors.black,
                  fontSize: 20,
                  fontFamily: "Bold",
                }}
              >
                Payment Summary
              </Text>
              <View style={{ borderBottomWidth: 0.2, paddingVertical: 20 }}>
                <View style={styles.paymentSubContainer}>
                  <Text style={styles.paymentHead}>Total Items (3)</Text>
                  <Text style={styles.paymentValue}>$100</Text>
                </View>
                <View style={styles.paymentSubContainer}>
                  <Text style={styles.paymentHead}>Delivery Fee</Text>
                  <Text style={styles.paymentValue}>Free</Text>
                </View>
                <View style={styles.paymentSubContainer}>
                  <Text style={styles.paymentHead}>Discount</Text>
                  <Text style={[styles.paymentValue, { color: colors.green }]}>
                    $100
                  </Text>
                </View>
              </View>
              <View
                style={[styles.paymentSubContainer, { paddingVertical: 20 }]}
              >
                <Text style={[styles.paymentHead, { color: colors.black }]}>
                  Total
                </Text>
                <Text style={styles.paymentValue}>$842</Text>
              </View>
            </View>

            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                width: "auto",
                height: 48,
                backgroundColor: colors.primary,
                borderRadius: 100,
              }}
            >
              <Text
                style={{
                  fontFamily: "Bold",
                  color: colors.white,
                  fontSize: 16,
                }}
              >
                Order Now
              </Text>
            </View>
          </>
        }
        data={cartItems}
        contentContainerStyle={{ gap: 10 }}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              width: "auto",
              borderRadius: 12,
              height: 106,
              backgroundColor: colors.white,
              justifyContent: "space-between",
              padding: 13,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <Checkbox
                style={styles.checkbox}
                value={isChecked}
                onValueChange={setChecked}
                color={isChecked ? colors.primary : undefined}
              />
              <View
                style={{
                  width: 85,
                  height: 82,
                  backgroundColor: colors.primaryBackground,
                  opacity: 1,
                  borderRadius: 8,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={item.image}
                  style={{ width: 72, height: 62, resizeMode: "contain" }}
                />
              </View>
              <View style={{ justifyContent: "space-around", gap: 5 }}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={[styles.itemTitle, { color: colors.primary }]}>
                  ${item.price}
                </Text>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <View
                    style={{
                      backgroundColor: colors.primaryBackground,
                      width: 30,
                      height: 30,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <AntDesign name="minus" size={20} color={colors.primary} />
                  </View>
                  <Text style={styles.itemQuantity}>{item.quantity}</Text>
                  <View
                    style={{
                      backgroundColor: colors.primaryBackground,
                      width: 30,
                      height: 30,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <AntDesign name="plus" size={20} color={colors.primary} />
                  </View>
                </View>
              </View>
            </View>
            <AntDesign
              name="delete"
              size={24}
              color={colors.error}
              style={{ alignSelf: "flex-end" }}
            />
          </View>
        )}
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

export default Cart;

const styles = StyleSheet.create({
  headerContanier: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  locationChange: {
    borderWidth: 1,
    borderColor: colors.primary,
    width: 130,
    height: 40,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
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
  itemTitle: {
    fontSize: 16,
    fontFamily: "Bold",
    color: colors.black,
  },
  itemQuantity: {
    fontFamily: "Bold",
    fontSize: 20,
    color: colors.black,
  },
  paymentHead: {
    color: colors.paymetHead,
    fontFamily: "SemiBold",
    fontSize: 16,
  },
  paymentValue: {
    fontSize: 16,
    fontFamily: "Bold",
    color: colors.black,
  },
  paymentSubContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
});
