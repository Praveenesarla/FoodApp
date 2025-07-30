import { Entypo, Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CATEGORIES, colors, images } from "../../../constants";
import { db } from "../../../firebaseConfig";

const Search = () => {
  const [searchText, setSearchText] = useState("");
  const [foodItems, setFoodItems] = useState([]);
  const [load, setLoad] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const router = useRouter();

  console.log(selectedCategory);

  const filterCategory = () => {
    switch (selectedCategory) {
      case "All":
        setFilteredItems(foodItems);
        break;
      case "Burger":
        const BurgerItems = foodItems.filter(
          (item) => item.Category === selectedCategory
        );
        setFilteredItems(BurgerItems);
        break;
      case "Pizza":
        const PizzaItems = foodItems.filter(
          (item) => item.Category === selectedCategory
        );
        setFilteredItems(PizzaItems);
        break;
      case "Wrap":
        const WrapItems = foodItems.filter(
          (item) => item.Category === selectedCategory
        );
        setFilteredItems(WrapItems);
        break;
      case "Burrito":
        const BurritoItems = foodItems.filter(
          (item) => item.Category === selectedCategory
        );
        setFilteredItems(BurritoItems);
        break;
      case "Combo":
        const ComboItems = foodItems.filter(
          (item) => item.Category === selectedCategory
        );
        setFilteredItems(ComboItems);
        break;
      default:
        setFilteredItems(foodItems);
        break;
    }
  };

  useEffect(() => {
    filterCategory();
  }, [selectedCategory]);

  const onRefresh = () => {
    const getItems = async () => {
      try {
        const query = await getDocs(collection(db, "items"));
        const items = [];
        query.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
        });
        console.log("items", items);
        setFoodItems(items);
        setFilteredItems(items);
      } catch (error) {
        console.log("errr", error);
      } finally {
        setLoad(false);
      }
    };

    getItems();
  };

  useEffect(() => {
    if (searchText.trim() === "") {
      setFilteredItems(foodItems);
    } else {
      const filtered = foodItems.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [searchText, foodItems]);

  useEffect(() => {
    const getItems = async () => {
      try {
        const query = await getDocs(collection(db, "items"));
        const items = [];
        query.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
        });
        console.log("items", items);
        setFoodItems(items);
      } catch (error) {
        console.log("errr", error);
      } finally {
        setLoad(false);
      }
    };

    getItems();
  }, []);

  return (
    <SafeAreaView style={{ paddingHorizontal: 10 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View>
          <Text style={styles.headerFirst}>SEARCH</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
            <Text style={styles.headerSec}>Find your Favorite Food</Text>
            <Entypo name="arrow-with-circle-down" size={18} color="black" />
          </View>
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
      <View
        style={{
          width: "auto",
          height: 52,
          backgroundColor: colors.white,
          borderRadius: 30,
          marginVertical: 20,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20,
          elevation: 2,
        }}
      >
        <TextInput
          style={{ flex: 1, fontFamily: "Bold" }}
          placeholder="Search for any food"
          onChangeText={setSearchText}
          value={searchText}
        />
        <Ionicons name="search" size={28} color="black" />
      </View>
      <FlatList
        data={CATEGORIES}
        contentContainerStyle={{ gap: 15, marginBottom: 20 }}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedCategory(item.name)}
            style={{
              width: 98,
              height: 45,
              backgroundColor:
                selectedCategory === item.name ? colors.primary : colors.white,
              borderRadius: 40,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 24,
              paddingVertical: 12,
            }}
          >
            <Text
              style={{
                fontFamily: "Bold",
                fontSize: 14,
                color:
                  item.name === selectedCategory
                    ? colors.white
                    : colors.labelColor,
              }}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
      {!load ? (
        <>
          <FlatList
            data={filteredItems}
            refreshControl={
              <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <View style={{ alignItems: "center", gap: 10 }}>
                <Image
                  source={images.emptyState}
                  style={styles.emptyStateImg}
                />
                <Text style={styles.emptyStateTitle}>
                  Nothing matched your search
                </Text>
                <Text style={styles.emptyStateQuote}>
                  Try a different search term or check for typos.
                </Text>
              </View>
            }
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 50, paddingBottom: 300 }}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/(main)/details",
                    params: {
                      item: JSON.stringify(item),
                    },
                  })
                }
                style={{
                  width: 180,
                  height: 208,
                  borderRadius: 30,
                  backgroundColor: colors.white,
                  marginTop: index % 2 === 0 ? 0 : 70,
                  margin: 8,
                  elevation: 2,
                  alignItems: "center",
                }}
              >
                <Image source={{ uri: item.imgUrl }} style={styles.itemImage} />
                <View style={styles.itemContent}>
                  <Text style={styles.itemTitle}>{item.name}</Text>
                  <Text style={styles.itemPrice}>From ${item.price}</Text>
                  <View style={styles.addCartContainer}>
                    <Entypo name="plus" size={24} color={colors.primary} />
                    <Text style={styles.addToCartText}>Add to cart</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </>
      ) : (
        <View style={{ flex: 1, marginVertical: 100 }}>
          <ActivityIndicator
            size={"large"}
            color={colors.primary}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginVertical: 50,
            }}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default Search;

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
  itemTitle: {
    fontSize: 18,
    fontFamily: "Bold",
    color: colors.black,
  },
  itemImage: {
    width: 170,
    height: 130,
    position: "absolute",
    top: -40,
    resizeMode: "contain",
    zIndex: 1,
  },
  itemContent: {
    marginTop: 100,
    gap: 5,
  },
  itemPrice: {
    color: colors.labelColor,
    fontSize: 16,
    fontFamily: "SemiBold",
    textAlign: "center",
  },
  addCartContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  addToCartText: {
    color: colors.primary,
    fontFamily: "Bold",
    fontSize: 16,
  },
  emptyStateImg: {
    width: 172,
    height: 128,
  },
  emptyStateTitle: {
    fontFamily: "Bold",
    fontSize: 20,
    color: colors.black,
  },
  emptyStateQuote: {
    fontFamily: "Medium",
    fontSize: 16,
    color: colors.labelColor,
  },
});
