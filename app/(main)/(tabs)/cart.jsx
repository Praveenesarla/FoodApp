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
  MaterialIcons,
} from "@expo/vector-icons";
import { Menu, Modal } from "react-native-paper";

import RazorpayCheckout from "react-native-razorpay";

import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  getFirestore,
  Timestamp,
} from "firebase/firestore";
import LottieView from "lottie-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { colors } from "../../../constants";
import { useLocation } from "../../../context/LocationContext";
import { updateCartItemsInFirebase } from "../../../firebaseConfig";
import {
  removeAddOns,
  removeFromCart,
  updateCart,
} from "../../../store/cartSlice";

const Cart = () => {
  const [showActionsheet, setShowActionsheet] = useState(false);
  const [showDeliveryOptions, setShowDeliveryOptions] = useState(false);
  const handleCloseDeliveryOption = () => setShowDeliveryOptions(false);
  const handleClose = () => setShowActionsheet(false);
  const handleOpen = () => setShowActionsheet(true);
  const handleOpenDeliveryOption = () => setShowDeliveryOptions(true);
  const { location, home, work } = useLocation();
  const router = useRouter();
  const user = getAuth().currentUser;

  const [visible2, setVisible2] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  console.log("cartItems", cartItems);

  useEffect(() => {
    if (user?.uid) {
      console.log("data-updated");
      updateCartItemsInFirebase(user.uid, cartItems);
    }
  }, [cartItems]);

  const getTotal = useMemo(() => {
    const total = cartItems.reduce(
      (total, item) => total + parseInt(item.total),
      0
    );

    console.log("total", total);
    return total;
  }, [cartItems]);

  const getItemQuantity = (id) => {
    const item = cartItems.find((i) => i.id === id);
    return item ? item.quantity : 0;
  };

  const startPayment = () => {
    setVisible2(false);
    const options = {
      description: "Test Payment",
      image: "https://your-logo.png",
      currency: "INR",
      key: "rzp_test_veSkbEP0znG9Hc",
      amount: "5000",
      name: "MyApp",
      prefill: {
        email: "test@example.com",
        contact: "9999999999",
        name: "Test User",
      },
      theme: { color: "#F37254" },
    };

    RazorpayCheckout.open(options)
      .then(async (data) => {
        console.log(`Success: ${data.razorpay_payment_id}`);

        const db = getFirestore();

        const order = {
          cart: cartItems.length > 0 ? cartItems : [],
          total: getTotal - 10,
          paymentId: data.razorpay_payment_id,
          createdAt: Timestamp.now(),
          status: "paid",
          deliveryLocation: location,
        };

        try {
          await addDoc(collection(db, "users", user.uid, "orders"), order);
          console.log("Order saved successfully!");

          dispatch({ type: "cart/clearCart" });

          router.push("/order-success");
        } catch (error) {
          console.error("Failed to save order:", error);
        }
      })
      .catch((error) => {
        console.log(`Error: ${error.code} | ${error.description}`);
        setVisible2(true);
      })
      .finally(() => {
        setShowDeliveryOptions(false);
      });
  };

  return (
    <SafeAreaView style={{ paddingHorizontal: 10 }}>
      <View style={styles.headerContanier}>
        <Ionicons name="arrow-back" size={30} color="black" />
        <Feather
          name="search"
          size={30}
          color="black"
          onPress={() => router.push("/search")}
        />
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
      {cartItems.length > 0 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          ListFooterComponentStyle={{ paddingBottom: 200 }}
          ListFooterComponent={
            cartItems.length > 0 && (
              <View style={{ marginTop: 100 }}>
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
                      <Text style={styles.paymentHead}>
                        Total Items ({cartItems.length})
                      </Text>
                      <Text style={styles.paymentValue}>
                        ${getTotal.toFixed(2)}
                      </Text>
                    </View>
                    <View style={styles.paymentSubContainer}>
                      <Text style={styles.paymentHead}>Delivery Fee</Text>
                      <Text style={styles.paymentValue}>Free</Text>
                    </View>
                    <View style={styles.paymentSubContainer}>
                      <Text style={styles.paymentHead}>Discount</Text>
                      <Text
                        style={[styles.paymentValue, { color: colors.green }]}
                      >
                        $10
                      </Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.paymentSubContainer,
                      { paddingVertical: 20 },
                    ]}
                  >
                    <Text style={[styles.paymentHead, { color: colors.black }]}>
                      Total
                    </Text>
                    <Text style={styles.paymentValue}>${getTotal - 10}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => setShowDeliveryOptions(true)}
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
                </TouchableOpacity>
              </View>
            )
          }
          data={cartItems}
          contentContainerStyle={{ gap: 10 }}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                width: "auto",
                borderRadius: 12,
                height: 120,
                backgroundColor: colors.white,
                justifyContent: "space-between",
                padding: 25,
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 20 }}
              >
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
                    source={{ uri: item.imgUrl }}
                    style={{ width: 100, height: 100, resizeMode: "contain" }}
                  />
                </View>
                <View style={{ justifyContent: "space-around", gap: 5 }}>
                  <Text style={styles.itemTitle}>{item.name}</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <Text style={[styles.itemTitle, { color: colors.primary }]}>
                      ${item.total}
                    </Text>
                    {item.addOns.length > 0 && (
                      <Menu
                        visible={visible}
                        onDismiss={closeMenu}
                        anchor={
                          <Text
                            onPress={openMenu}
                            style={{
                              color: colors.green,
                              fontFamily: "Regular",
                            }}
                          >
                            (includes Addons price)
                          </Text>
                        }
                        anchorPosition="bottom"
                      >
                        {item.addOns.map((addOn) => (
                          <View
                            key={addOn.id}
                            style={{
                              width: 200,
                              height: 40,
                              padding: 5,
                              marginVertical: 5,
                              borderRadius: 15,
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 5,
                            }}
                          >
                            <View
                              style={{
                                backgroundColor: colors.primaryBackground,
                                width: 50,
                                height: 50,
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 10,
                              }}
                            >
                              <Image
                                source={{ uri: addOn.imgUrl }}
                                style={{ width: 40, height: 40 }}
                              />
                            </View>
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                flex: 1,
                              }}
                            >
                              <Text
                                style={{
                                  fontFamily: "Regular",
                                  color: colors.black,
                                }}
                              >
                                {addOn.name}
                              </Text>
                              <Text
                                style={{
                                  color: colors.green,
                                  fontFamily: "Medium",
                                }}
                              >
                                ${addOn.price}
                              </Text>
                            </View>
                            <MaterialIcons
                              name="cancel"
                              size={20}
                              color={colors.error}
                              onPress={() =>
                                dispatch(
                                  removeAddOns({
                                    productId: item.id,
                                    itemId: addOn.id,
                                  })
                                )
                              }
                            />
                          </View>
                        ))}
                      </Menu>
                    )}
                  </View>

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
                      <AntDesign
                        name="minus"
                        size={20}
                        color={colors.primary}
                        onPress={() =>
                          dispatch(
                            updateCart({
                              id: item.id,
                              quantity: getItemQuantity(item.id) - 1,
                            })
                          )
                        }
                      />
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
                      <AntDesign
                        name="plus"
                        size={20}
                        color={colors.primary}
                        onPress={() =>
                          dispatch(
                            updateCart({
                              id: item.id,
                              quantity: getItemQuantity(item.id) + 1,
                            })
                          )
                        }
                      />
                    </View>
                  </View>
                </View>
              </View>
              <AntDesign
                onPress={() => dispatch(removeFromCart(item.id))}
                name="delete"
                size={24}
                color={colors.error}
                style={{ alignSelf: "flex-end" }}
              />
            </View>
          )}
        />
      ) : (
        <>
          <LottieView
            autoPlay
            style={{
              width: 300,
              height: 300,
              alignSelf: "center",
            }}
            source={require("../../../assets/Cooking.json")}
          />
          <Text
            style={{
              fontFamily: "Bold",
              color: colors.primary,
              fontSize: 18,
              alignSelf: "center",
            }}
          >
            Hungry? Start adding delicious food!
          </Text>
        </>
      )}

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
      <Actionsheet
        isOpen={showDeliveryOptions}
        onClose={handleCloseDeliveryOption}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <View style={{ width: "100%", marginBottom: 5 }}>
            <Text
              style={{
                textAlign: "center",
                fontFamily: "RubikB",
                fontSize: 25,
                color: colors.primary,
              }}
            >
              Select Payment Mode
            </Text>
            <TouchableOpacity
              onPress={startPayment}
              style={{
                height: 60,
                borderWidth: 2,
                borderColor: colors.primary,
                borderRadius: 5,
                alignItems: "center",
                flexDirection: "row",
                paddingHorizontal: 10,
                marginBottom: 5,
                gap: 5,
              }}
            >
              <Image
                source={require("../../../assets/razorpay.png")}
                style={{ width: 40, height: 40 }}
                resizeMode="contain"
              />
              <Text
                style={{
                  fontFamily: "Bold",
                  color: colors.black,
                  fontSize: 20,
                }}
              >
                Online Payment
              </Text>
            </TouchableOpacity>
            <View
              style={{
                height: 60,
                borderWidth: 2,
                borderColor: colors.primary,
                borderRadius: 5,
                alignItems: "center",
                flexDirection: "row",
                paddingHorizontal: 10,
                gap: 5,
              }}
            >
              <Image
                source={require("../../../assets/note.png")}
                style={{ width: 40, height: 40 }}
                resizeMode="contain"
              />
              <Text
                style={{
                  fontFamily: "Bold",
                  color: colors.black,
                  fontSize: 20,
                }}
              >
                Pay On Delivery
              </Text>
            </View>
          </View>
        </ActionsheetContent>
      </Actionsheet>
      <Modal
        visible={visible2}
        onDismiss={hideModal}
        contentContainerStyle={{
          width: "85%",
          height: 250,
          margin: 30,
          borderRadius: 20,
          marginBottom: 190,
          backgroundColor: colors.white,
          alignItems: "center",
        }}
      >
        <AntDesign
          onPress={() => setVisible2(false)}
          name="closecircleo"
          size={24}
          color={colors.black}
          style={{ marginLeft: "auto", marginRight: 10 }}
        />
        <LottieView
          autoPlay
          resizeMode="cover"
          style={{
            width: 100,
            height: 100,
          }}
          source={require("../../../assets/ErrorOccurred!.json")}
        />
        <Text style={{ fontFamily: "Bold", fontSize: 20, color: colors.error }}>
          Payment Failed!!
        </Text>
        <TouchableOpacity
          onPress={() => {
            setVisible2((prev) => !prev);
            startPayment();
          }}
          style={{
            borderWidth: 1,
            borderRadius: 8,
            width: 200,
            height: 40,
            justifyContent: "center",
            alignItems: "center",
            borderColor: colors.green,
            marginVertical: 20,
          }}
        >
          <Text
            style={{ color: colors.black, fontFamily: "Medium", fontSize: 18 }}
          >
            Please Try Again
          </Text>
        </TouchableOpacity>
      </Modal>
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
