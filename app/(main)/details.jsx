import { AntDesign, Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, images } from "../../constants";
import StarRating from "../../constants/stars";
import { db } from "../../firebaseConfig";

const ProductDetails = () => {
  const { item } = useLocalSearchParams();
  const [toppingsList, setToppingsList] = useState([]);
  const [optionsList, setOptionsList] = useState([]);

  console.log("toppingsList", toppingsList);

  console.log("optionsList", optionsList);

  useEffect(() => {
    getToppings();
    getSideOptions();
  }, []);

  let parsedItem = null;
  try {
    parsedItem = JSON.parse(item);
    console.log("trt", parsedItem);
  } catch (e) {
    console.error("❌ JSON parsing error:", e);
    return <Text>Error loading item details</Text>;
  }

  const getToppings = async () => {
    try {
      const data = await getDocs(collection(db, "toppings"));

      const items = [];

      data.forEach((item) => {
        items.push({ id: item.id, ...item.data() });
      });

      setToppingsList(items);
      console.log("topings", items);
    } catch (error) {
      console.log("err", error);
    }
  };

  const getSideOptions = async () => {
    try {
      const data = await getDocs(collection(db, "options"));

      const items = [];

      data.forEach((item) => {
        items.push({ id: item.id, ...item.data() });
      });
      setOptionsList(items);
      console.log("options", items);
    } catch (error) {
      console.log("err", error);
    }
  };

  const toppings = [
    {
      id: "1",
      title: "Tomato",
      image: images.tomatoes,
    },
    {
      id: "2",
      title: "Tomato",
      image: images.tomatoes,
    },
    {
      id: "3",
      title: "Tomato",
      image: images.tomatoes,
    },
    {
      id: "4",
      title: "Tomato",
      image: images.tomatoes,
    },
    {
      id: "5",
      title: "Tomato",
      image: images.tomatoes,
    },
  ];
  return (
    <SafeAreaView style={{ paddingHorizontal: 10 }}>
      <View style={styles.headerContanier}>
        <Ionicons
          name="arrow-back"
          size={30}
          color="black"
          onPress={() => router.back()}
        />
        <Feather name="search" size={30} color="black" />
      </View>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flexDirection: "row" }}>
          <View>
            <View style={{ marginBottom: 8 }}>
              <Text style={styles.productTitle}>{parsedItem?.name}</Text>
              <Text style={styles.productCategory}>{parsedItem?.category}</Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                marginBottom: 8,
              }}
            >
              <StarRating
                rating={parsedItem?.rating}
                color={colors.primary}
                size={20}
              />
              <Text style={styles.ratingText}>{parsedItem?.rating}/5</Text>
            </View>
            <Text
              style={{
                fontSize: 24,
                fontFamily: "Bold",
                color: colors.primary,
                marginBottom: 8,
              }}
            >
              $ <Text style={{ color: colors.black }}>{parsedItem?.price}</Text>
            </Text>
            <View style={{ flexDirection: "row", gap: 10, marginBottom: 8 }}>
              <View>
                <Text style={styles.medLabel}>Calories</Text>
                <Text style={styles.medValue}>{parsedItem?.calories} Cal</Text>
              </View>
              <View>
                <Text style={styles.medLabel}>Protein</Text>
                <Text style={styles.medValue}>{parsedItem?.proteins}g</Text>
              </View>
            </View>
            <View style={{ marginBottom: 8 }}>
              <Text style={styles.medLabel}>Bun Type</Text>
              <Text style={styles.medValue}>
                {parsedItem?.BunType || parsedItem?.WrapType}
              </Text>
            </View>
          </View>
          <Image
            source={{ uri: parsedItem?.imgUrl }}
            style={{ width: 200, height: 205 }}
          />
        </View>
        <View
          style={{
            width: "auto",
            height: 47,
            backgroundColor: colors.primaryBackground,
            borderRadius: 30,
            marginVertical: 15,
            justifyContent: "space-around",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <View style={styles.flexRow}>
            <FontAwesome name="dollar" size={18} color={colors.primary} />
            <Text style={styles.highlights}>{parsedItem?.delivery}</Text>
          </View>
          <View style={styles.flexRow}>
            <AntDesign name="clockcircle" size={18} color={colors.primary} />
            <Text style={styles.highlights}>{parsedItem?.time} mins</Text>
          </View>
          <View style={styles.flexRow}>
            <AntDesign name="star" size={18} color={colors.primary} />
            <Text style={styles.highlights}>{parsedItem?.rating}</Text>
          </View>
        </View>
        <Text style={styles.productDescription}>{parsedItem?.description}</Text>
        {/* toppings */}
        <View style={{ marginTop: 5 }}>
          <Text style={styles.headerTitle}>Toppings</Text>
          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal
            contentContainerStyle={{ marginVertical: 15, gap: 30 }}
            data={toppingsList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={{
                  width: 84,
                  height: 99,
                  borderRadius: 15,
                  backgroundColor: colors.addOns,
                  flex: 1,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    width: "auto",
                    height: 61,
                    backgroundColor: colors.white,
                    borderBottomEndRadius: 15,
                    borderBottomStartRadius: 15,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={{ uri: item.imgUrl }}
                    style={{ width: 55, height: 55 }}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <Text style={styles.addonsTitle}>{item.name}</Text>
                  <AntDesign name="pluscircle" size={14} color={colors.error} />
                </View>
              </View>
            )}
          />
        </View>
        {/* Side Options */}
        <View style={{ marginTop: 5 }}>
          <Text style={styles.headerTitle}>Side Options</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ marginVertical: 15, gap: 30 }}
            data={optionsList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={{
                  width: 84,
                  height: 99,
                  borderRadius: 15,
                  backgroundColor: colors.addOns,
                  flex: 1,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    width: "auto",
                    height: 61,
                    backgroundColor: colors.white,
                    borderBottomEndRadius: 15,
                    borderBottomStartRadius: 15,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={{ uri: item.imgUrl }}
                    style={{ width: 55, height: 55 }}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <Text style={styles.addonsTitle}>{item.name}</Text>
                  <AntDesign name="pluscircle" size={14} color={colors.error} />
                </View>
              </View>
            )}
          />
        </View>
        <View
          style={{
            height: 78,
            width: "auto",
            backgroundColor: colors.white,
            borderRadius: 20,
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: 112,
              height: 30,
              alignItems: "center",
            }}
          >
            <Feather
              name="minus-square"
              size={24}
              color={colors.primary}
              style={{ backgroundColor: colors.primaryBackground }}
            />
            <Text
              style={{ fontSize: 20, fontFamily: "Bold", color: colors.black }}
            >
              2
            </Text>
            <Feather
              name="plus-square"
              size={24}
              color={colors.primary}
              style={{
                backgroundColor: colors.primaryBackground,
                overflow: "hidden",
              }}
            />
          </View>
          <View
            style={{
              width: 190,
              height: 46,
              backgroundColor: colors.primary,
              borderRadius: 100,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
            }}
          >
            <Feather name="shopping-bag" size={24} color={colors.white} />
            <Text style={styles.bottomContent}>Add to cart ($26)</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  headerContanier: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  productTitle: {
    fontSize: 24,
    fontFamily: "Bold",
    color: colors.black,
  },
  productCategory: {
    fontSize: 16,
    fontFamily: "Medium",
    color: colors.labelColor,
  },
  ratingText: {
    fontSize: 16,
    fontFamily: "SemiBold",
    color: colors.labelColor,
  },
  medLabel: {
    fontFamily: "Medium",
    fontSize: 14,
    color: colors.labelColor,
  },
  medValue: {
    fontFamily: "SemiBold",
    fontSize: 16,
    color: colors.black,
  },
  highlights: {
    fontFamily: "SemiBold",
    color: colors.black,
    fontSize: 16,
  },
  flexRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  productDescription: {
    fontSize: 16,
    fontFamily: "Medium",
    color: colors.labelColor,
  },
  headerTitle: {
    fontSize: 16,
    color: colors.black,
    fontFamily: "Bold",
  },
  addonsTitle: {
    fontFamily: "SemiBold",
    fontSize: 12,
    color: colors.white,
  },
  bottomContent: {
    fontFamily: "Bold",
    color: colors.white,
    fontSize: 14,
  },
});
