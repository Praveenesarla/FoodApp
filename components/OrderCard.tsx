import { colors } from "@/constants/index";
import { Entypo } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image, StyleSheet, Text, View } from "react-native";
import { Divider } from "react-native-paper";

interface OrderCardProps {
  restaurantName?: string;
  status?: string;
  addons?: string[];
  orderPlacedAt?: string;
  total?: number;
  image?: string; // optional (could be remote url)
}

const OrderCard = ({
  restaurantName,
  status,
  addons,
  orderPlacedAt,
  total,
  image,
}: OrderCardProps) => {
  return (
    <View style={styles.container}>
      {/* Gradient Header */}
      <LinearGradient
        colors={[colors.inputBorder, colors.white]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.background}
      >
        {/* Food Image */}
        <View style={styles.imageWrapper}>
          <Image
            source={
              image ? { uri: image } : require("../assets/list/ChickenWrap.png")
            }
            style={styles.image}
          />
        </View>

        {/* Restaurant + Status */}
        <View style={styles.headerRight}>
          <View style={{ paddingVertical: 10, gap: 10, paddingHorizontal: 10 }}>
            <Text style={{ fontFamily: "Bold", fontSize: 12 }}>
              {restaurantName}
            </Text>
            <Text style={{ color: colors.primary, fontFamily: "Medium" }}>
              Status :{" "}
              <Text
                style={{
                  color: status === "Paid" ? colors.green : colors.error,
                }}
              >
                {status}
              </Text>
            </Text>
          </View>
          <Text
            style={{ fontSize: 13, color: colors.green, fontFamily: "Bold" }}
          >
            Order Placed
          </Text>
        </View>
      </LinearGradient>

      {/* Addons */}
      <View>
        <Text style={{ fontFamily: "RubikB", marginLeft: 20 }}>AddOns</Text>
        {addons?.map((addon, index) => (
          <View key={index} style={{ flexDirection: "row" }}>
            <Entypo name="dot-single" size={24} color={colors.green} />
            <Text style={{ fontFamily: "Bold", color: colors.black }}>
              {addon}
            </Text>
          </View>
        ))}
        <Divider bold style={{ marginVertical: 10 }} />
      </View>

      {/* Order Date + Bill */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={{ color: colors.labelColor }}>
          Ordered : {orderPlacedAt}
        </Text>
        <Entypo name="dot-single" size={24} color={colors.labelColor} />
        <Text style={{ color: colors.labelColor }}>Bill Total : ₹{total}</Text>
      </View>
    </View>
  );
};

export default OrderCard;

const styles = StyleSheet.create({
  container: {
    width: "94%",
    height: 240,
    backgroundColor: colors.white,
    alignSelf: "center",
    borderColor: colors.labelColor,
    borderWidth: 2.5,
    borderRadius: 10,
    padding: 4,
    marginBottom: 20,
  },
  background: {
    width: "100%",
    height: 90,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    flexDirection: "row",
    padding: 14,
  },
  imageWrapper: {
    width: 70,
    height: 70,
    backgroundColor: colors.white,
    borderRadius: 10,
  },
  image: {
    width: 70,
    height: 70,
  },
  headerRight: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    alignItems: "center",
  },
});
