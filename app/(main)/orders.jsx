import { Entypo, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Divider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../constants";
import { auth, db } from "../../firebaseConfig";
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const router = useRouter();
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const uid = auth.currentUser?.uid;
        if (!uid) return;

        const ordersRef = collection(db, "users", uid, "orders");
        const snapshot = await getDocs(ordersRef);

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrders(data);
        console.log("orders", data);
      } catch (error) {
        console.log("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <SafeAreaView style={{ paddingHorizontal: 13 }}>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}
      >
        <Ionicons
          name="arrow-back"
          size={30}
          color="black"
          onPress={() => router.back()}
        />
        <Text
          style={{
            color: colors.primary,
            fontFamily: "Bold",
            fontSize: 20,
            marginHorizontal: 130,
            // paddingHorizontal: 12,
          }}
        >
          Orders
        </Text>
      </View>

      <View
        style={{
          width: "94%",
          height: 240,
          backgroundColor: colors.white,
          alignSelf: "center",
          borderColor: colors.labelColor,
          borderWidth: 2.5,
          borderRadius: 10,
          padding: 4,
        }}
      >
        <LinearGradient
          // Background Linear Gradient
          colors={[colors.inputBorder, colors.white]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.background}
        >
          <View
            style={{
              width: 70,
              height: 70,
              backgroundColor: colors.white,
              borderRadius: 10,
            }}
          >
            <Image
              source={require("../../assets/list/ChickenWrap.png")}
              style={{ width: 70, height: 70 }}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              flex: 1,
              alignItems: "center",
            }}
          >
            <View
              style={{ paddingVertical: 10, gap: 10, paddingHorizontal: 10 }}
            >
              <Text style={{ fontFamily: "Bold", fontSize: 12 }}>
                Bismillah Biryani Point
              </Text>
              <Text style={{ color: colors.primary, fontFamily: "Medium" }}>
                Status : <Text style={{ color: colors.green }}>Paid</Text>
              </Text>
            </View>
            <Text
              style={{
                fontSize: 13,
                color: colors.green,
                fontFamily: "Bold",
              }}
            >
              Order Placed
            </Text>
          </View>
        </LinearGradient>
        <View>
          <Text style={{ fontFamily: "RubikB", marginLeft: 20 }}>AddOns</Text>
          <View style={{ flexDirection: "row" }}>
            <Entypo name="dot-single" size={24} color={colors.green} />
            <Text style={{ fontFamily: "Bold", color: colors.black }}>
              Onions
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Entypo name="dot-single" size={24} color={colors.green} />
            <Text style={{ color: colors.black, fontFamily: "Bold" }}>
              Cheese
            </Text>
          </View>

          <Divider bold style={{ marginVertical: 10 }} />
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ color: colors.labelColor }}>
            Ordered : July 11, 7:39PM
          </Text>
          <Entypo name="dot-single" size={24} color={colors.labelColor} />
          <Text style={{ color: colors.labelColor }}>Bill Total : ₹1171</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Orders;

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: 90,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    flexDirection: "row",
    padding: 14,
  },
});
