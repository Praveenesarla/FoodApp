import { AntDesign, Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { Tooltip } from "@rneui/themed";
import { router, useLocalSearchParams } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import LottieView from "lottie-react-native";
import { Skeleton } from "moti/skeleton";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { colors, images } from "../../constants";
import StarRating from "../../constants/stars";
import { db } from "../../firebaseConfig";
import {
  addAddOns,
  addToCart,
  removeAddOns,
  removeFromCart,
  updateCart,
} from "../../store/cartSlice";

const ProductDetails = () => {
  const { item } = useLocalSearchParams();
  const [toppingsList, setToppingsList] = useState([]);
  const [optionsList, setOptionsList] = useState([]);
  const cartItems = useSelector((state) => state.cart.items);
  const [selectedQuantity, setSelectedQuantity] = useState(0);
  const [selectedTooltipId, setSelectedTooltipId] = useState(null);
  const dispatch = useDispatch();
  const [selectedAnimation, setSelectedAnimation] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState([]);

  console.log("cartITems", cartItems);

  const existedItem = () => {
    const foodItem = cartItems.find((item) => item?.id === parsedItem?.id);
    return <Text>Remove From Cart (${foodItem?.total})</Text>;
  };

  const notExistedItem = () => {
    const foodItemPrice = parsedItem?.price;
    const foodQuantity = selectedQuantity;
    const foodQuantityTotal = foodItemPrice * foodQuantity;
    const addOnsCheck = selectedAddOns?.reduce(
      (acc, curr) => acc + Number(curr?.price),
      0
    );
    console.log("add", addOnsCheck);
    const totalFoodItem = foodQuantityTotal + addOnsCheck;
    return <Text>Add to Cart (${totalFoodItem})</Text>;
  };

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

  const getItemQuantity = (id) => {
    const item = cartItems.find((item) => item?.id === id);

    return item ? item.quantity : 0;
  };

  const getMinusOrPlusExisted = (addItem) => {
    const checkItem = cartItems.find((k) => k?.id === parsedItem?.id);

    if (checkItem && Array.isArray(checkItem.addOns)) {
      const checkAddon = checkItem.addOns.find((i) => i?.id === addItem?.id);

      if (checkAddon) {
        return (
          <AntDesign
            name="minuscircle"
            size={14}
            color={colors.error}
            onPress={() =>
              dispatch(
                removeAddOns({ productId: parsedItem?.id, itemId: addItem.id })
              )
            }
          />
        );
      } else {
        return (
          <AntDesign
            name="pluscircle"
            size={14}
            color={colors.error}
            onPress={() =>
              dispatch(addAddOns({ productId: parsedItem?.id, item: addItem }))
            }
          />
        );
      }
    }

    return null;
  };

  const getMinusOrPlusNotExisted = (addItem) => {
    const checkItem = selectedAddOns.find((item) => item?.id === addItem?.id);
    if (checkItem) {
      return (
        <AntDesign
          name="minuscircle"
          size={14}
          color={colors.error}
          onPress={() => {
            setSelectedAddOns((prev) =>
              prev.filter((i) => i.id !== addItem.id)
            );
          }}
        />
      );
    } else {
      return (
        <AntDesign
          name="pluscircle"
          size={14}
          color={colors.error}
          onPress={() => setSelectedAddOns([...selectedAddOns, addItem])}
        />
      );
    }
  };

  const getExistingItemQuant = () => {
    const findingItem = cartItems.find((i) => i?.id === parsedItem.id);
    if (findingItem) {
      return findingItem.quantity;
    }
  };

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
              <Text style={styles.productCategory}>{parsedItem?.cat}</Text>
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
              <Text style={styles.medLabel}>
                {(parsedItem?.BunType && "Bun Type") ||
                  (parsedItem?.BaseType && "Base Type") ||
                  (parsedItem?.WrapType && "Wrap Type")}
              </Text>
              <Text style={styles.medValue}>
                {parsedItem?.BunType ||
                  parsedItem?.WrapType ||
                  parsedItem?.BaseType}
              </Text>
            </View>
          </View>
          {selectedAnimation ? (
            <LottieView
              loop={false}
              onAnimationFinish={() => setSelectedAnimation(false)}
              autoPlay
              resizeMode="contain"
              style={{
                width: 230,
                height: 250,
              }}
              source={{ uri: parsedItem.animation }}
            />
          ) : (
            <Pressable onPress={() => setSelectedAnimation(true)}>
              <Image
                source={{ uri: parsedItem?.imgUrl }}
                style={{ width: 200, height: 205 }}
              />
            </Pressable>
          )}
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
            data={toppingsList.length > 0 ? toppingsList : [1, 2, 3, 4, 5, 6]}
            keyExtractor={(item, index) =>
              typeof item === "object" ? item.id : index.toString()
            }
            renderItem={({ item }) =>
              toppingsList.length > 0 ? (
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
                  {/* Wrap tooltip around only the image section */}
                  <Tooltip
                    containerStyle={{ width: 145, height: 130 }}
                    visible={selectedTooltipId === item.id}
                    onOpen={() => setSelectedTooltipId(item.id)}
                    onClose={() => setSelectedTooltipId(null)}
                    width={200}
                    backgroundColor={colors.primary}
                    popover={
                      <>
                        <Text style={{ fontFamily: "Regular" }}>
                          {item.des}
                        </Text>
                        <Text
                          style={{ fontFamily: "Bold", color: colors.white }}
                        >
                          Price : ${item.price}
                        </Text>
                      </>
                    }
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
                        resizeMode="contain"
                        source={{ uri: item.imgUrl }}
                        style={{ width: 55, height: 55 }}
                      />
                    </View>
                  </Tooltip>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-around",
                      alignItems: "center",
                      flex: 1,
                    }}
                  >
                    <Text style={styles.addonsTitle}>{item.name}</Text>
                    {getItemQuantity(parsedItem.id) > 0
                      ? getMinusOrPlusExisted(item)
                      : getMinusOrPlusNotExisted(item)}
                  </View>
                </View>
              ) : (
                <Skeleton
                  height={99}
                  width={84}
                  radius={15}
                  colorMode="light"
                />
              )
            }
          />
        </View>
        {/* Side Options */}
        <View style={{ marginTop: 5 }}>
          <Text style={styles.headerTitle}>Side Options</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ marginVertical: 15, gap: 30 }}
            data={optionsList.length > 0 ? optionsList : [1, 2, 3, 4, 5]}
            keyExtractor={(item, index) =>
              typeof item === "object" ? item.id : index.toString()
            }
            renderItem={({ item }) =>
              optionsList.length > 0 ? (
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
                  {/* Wrap tooltip around only the image section */}
                  <Tooltip
                    containerStyle={{ width: 145, height: 130 }}
                    visible={selectedTooltipId === item.id}
                    onOpen={() => setSelectedTooltipId(item.id)}
                    onClose={() => setSelectedTooltipId(null)}
                    width={200}
                    backgroundColor={colors.primary}
                    popover={
                      <>
                        <Text style={{ fontFamily: "Regular" }}>
                          {item.des}
                        </Text>
                        <Text
                          style={{ fontFamily: "Bold", color: colors.white }}
                        >
                          Price : ${item.price}
                        </Text>
                      </>
                    }
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
                        resizeMode="contain"
                        source={{ uri: item.imgUrl }}
                        style={{ width: 55, height: 55 }}
                      />
                    </View>
                  </Tooltip>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-around",
                      alignItems: "center",
                      flex: 1,
                    }}
                  >
                    <Text style={styles.addonsTitle}>{item.name}</Text>
                    {getItemQuantity(parsedItem.id) > 0
                      ? getMinusOrPlusExisted(item)
                      : getMinusOrPlusNotExisted(item)}
                  </View>
                </View>
              ) : (
                <Skeleton
                  height={99}
                  width={84}
                  radius={15}
                  colorMode="light"
                />
              )
            }
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
              onPress={() =>
                getItemQuantity(parsedItem.id) > 0
                  ? dispatch(
                      updateCart({
                        id: parsedItem.id,
                        quantity: getItemQuantity(parsedItem.id) - 1,
                      })
                    )
                  : setSelectedQuantity((prev) => (prev !== 0 ? prev - 1 : 0))
              }
              name="minus-square"
              size={24}
              color={colors.primary}
              style={{ backgroundColor: colors.primaryBackground }}
            />
            <Text
              style={{ fontSize: 20, fontFamily: "Bold", color: colors.black }}
            >
              {getItemQuantity(parsedItem.id) > 0
                ? getExistingItemQuant()
                : selectedQuantity}
            </Text>
            <Feather
              onPress={() =>
                getItemQuantity(parsedItem.id) > 0
                  ? dispatch(
                      updateCart({
                        id: parsedItem.id,
                        quantity: getItemQuantity(parsedItem.id) + 1,
                      })
                    )
                  : setSelectedQuantity((prev) => prev + 1)
              }
              name="plus-square"
              size={24}
              color={colors.primary}
              style={{
                backgroundColor: colors.primaryBackground,
                overflow: "hidden",
              }}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              getItemQuantity(parsedItem.id) === 0
                ? dispatch(
                    addToCart({ ...parsedItem, quantity: selectedQuantity })
                  )
                : dispatch(removeFromCart(parsedItem.id));
            }}
            style={{
              width: 210,
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
            <Text style={styles.bottomContent}>
              <Text style={styles.bottomContent}>
                {getItemQuantity(parsedItem.id) > 0
                  ? existedItem()
                  : notExistedItem()}
              </Text>
            </Text>
          </TouchableOpacity>
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
