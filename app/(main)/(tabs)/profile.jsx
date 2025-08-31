import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "@/components/ui/actionsheet";
import {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import {
  getAuth,
  PhoneAuthProvider,
  RecaptchaVerifier,
  reload,
  signInWithPhoneNumber,
  signOut,
  updateEmail,
  updatePhoneNumber,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, images } from "../../../constants";
import { useAuth } from "../../../context/AuthContext";
import { db, auth as firebaseAuth } from "../../../firebaseConfig";

const Profile = () => {
  const [showModal, setShowModal] = useState(false);
  const [options, setOptions] = useState("3");
  const { logout } = useAuth();
  const [showActionsheet, setShowActionsheet] = useState(false);
  const [userData, setUserData] = useState({});
  const handleClose = () => setShowActionsheet(false);
  const handleOpen = () => setShowActionsheet(true);
  const [profile, setProfile] = useState([
    {
      id: "1",
      label: "Full Name",
      icon: "user",
      value: "",
    },
    {
      id: "2",
      label: "Email",
      icon: "email",
      value: "",
    },
    {
      id: "3",
      label: "Phone number",
      icon: "old-phone",
      value: "",
    },
    {
      id: "4",
      label: "Address 1 - (Home)",
      icon: "location-pin",
      value: "",
    },
    {
      id: "5",
      label: "Address 2 - (Work)",
      icon: "location-pin",
      value: "",
    },
  ]);

  const [editShow, setEditShow] = useState([
    {
      id: "1",
      editShow: false,
    },
    {
      id: "2",
      editShow: false,
    },
    {
      id: "3",
      editShow: false,
    },
    {
      id: "4",
      editShow: false,
    },
    {
      id: "5",
      editShow: false,
    },
  ]);
  const [fullName, setFullName] = useState(profile[0].value);

  const [imgUrl, setImgUrl] = useState();

  const [email, setEmail] = useState(profile[1].value);

  const [phoneNumber, setPhoneNumber] = useState(profile[2].value);

  const [home, setHome] = useState(profile[3].value);

  const [work, setWork] = useState(profile[4].value);

  const auth = getAuth();

  const user = auth.currentUser;

  console.log("uid", user.uid);

  const signingOut = async () => {
    try {
      await signOut(firebaseAuth);
      await logout;
    } catch (error) {}
  };

  useEffect(() => {
    if (!user) return;
    const { displayName, email, phoneNumber } = user;

    const fetchUserData = async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const userDetails = docSnap.data();
          console.log("✅ User Data:", userDetails);
          setUserData(userDetails);
          return userDetails;
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };

    fetchUserData();

    setProfile((prev) =>
      prev.map((item) => {
        switch (item.id) {
          case "1":
            return { ...item, value: displayName ?? "some" };

          case "2":
            return { ...item, value: email };

          case "3":
            return { ...item, value: userData.phone || "Add Phone" };
          case "4":
            return {
              ...item,
              value: userData?.address_work || "Add Work Address",
            };
          case "5":
            return {
              ...item,
              value: userData?.address_home || "Add Home Address",
            };
          default:
            return item;
        }
      })
    );
  }, [user]);

  const updateProfilePic = async (url) => {
    if (user) {
      try {
        await updateProfile(user, {
          photoURL: url,
        });

        await reload(user);
        console.log("✅ Updated photoURL:", user.photoURL);

        setImgUrl(user.photoURL);
      } catch (error) {
        console.error("❌ Failed to update profile picture:", error);
      }
    }
  };

  const cancelFun = (id) => {
    switch (id) {
      case "1":
        setFullName(profile[0].value);
        setEditShow(
          editShow.map((item) =>
            item.id === "1" ? { ...item, editShow: !item.editShow } : item
          )
        );
        break;
      case "2":
        setEmail(profile[1].value);
        setEditShow(
          editShow.map((item) =>
            item.id === "2" ? { ...item, editShow: !item.editShow } : item
          )
        );
        break;
      case "3":
        setPhoneNumber(profile[2].value);
        setEditShow(
          editShow.map((item) =>
            item.id === "3" ? { ...item, editShow: !item.editShow } : item
          )
        );
        break;
      case "4":
        setWork(profile[3].value);
        setEditShow(
          editShow.map((item) =>
            item.id === "4" ? { ...item, editShow: !item.editShow } : item
          )
        );
        break;
      case "5":
        setHome(profile[4].value);
        setEditShow(
          editShow.map((item) =>
            item.id === "5" ? { ...item, editShow: !item.editShow } : item
          )
        );
        break;
      default:
        break;
    }
  };

  const settingFunction = (id) => {
    switch (id) {
      case "1":
        return fullName;
      case "2":
        return email;
      case "3":
        return phoneNumber;
      case "4":
        return work;
      case "5":
        return home;
      default:
        break;
    }
  };

  const changeFun = (id) => {
    switch (id) {
      case "1":
        return setFullName;
      case "2":
        return setEmail;
      case "3":
        return setPhoneNumber;
      case "4":
        return setWork;
      case "5":
        return setHome;

      default:
        break;
    }
  };

  const openingModal = (option) => {
    setShowModal(true);

    setOptions(option);
  };

  const CLOUD_NAME = "dyoxhpkbu";
  const UPLOAD_PRESET = "ml_default";

  const uploadToCloudinary = async (uri) => {
    const formData = new FormData();

    formData.append("file", {
      uri,
      type: "image/jpeg",
      name: "photo.jpg",
    });
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      console.log("Cloudinary URL:", data.secure_url);
      Alert.alert("Uploaded!", data.secure_url);
      updateProfilePic(data?.secure_url);
      return data.secure_url;
    } catch (err) {
      console.error("Upload failed:", err);
      Alert.alert("Upload failed");
    }
  };

  const updateUserPhoneNumber = async (user, verificationId, code) => {
    try {
      const credential = PhoneAuthProvider.credential(verificationId, code);
      await updatePhoneNumber(user, credential);
      console.log("✅ Phone number updated");
    } catch (error) {
      console.error("❌ Failed to update phone:", error.message);
    }
  };

  const sendOtp = async (newPhoneNumber) => {
    try {
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        newPhoneNumber,
        RecaptchaVerifier
      );
      return confirmationResult;
    } catch (error) {
      console.error("Failed to send OTP:", error.message);
    }
  };

  const saveFn = async (id) => {
    switch (id) {
      case "1":
        setProfile((prev) =>
          prev.map((item) =>
            item.id === "1" ? { ...item, value: fullName } : item
          )
        );
        await updateProfile(user, {
          displayName: fullName,
        });
        setEditShow((prev) =>
          prev.map((item) =>
            item.id === "1" ? { ...item, editShow: false } : item
          )
        );
        break;
      case "2":
        setProfile((prev) =>
          prev.map((item) =>
            item.id === "2" ? { ...item, value: email } : item
          )
        );
        await updateEmail(user, email);
        setEditShow((prev) =>
          prev.map((item) =>
            item.id === "2" ? { ...item, editShow: false } : item
          )
        );

        break;
      case "3":
        setProfile((prev) =>
          prev.map((item) =>
            item.id === "3" ? { ...item, value: phoneNumber } : item
          )
        );
        await updateDoc(doc(db, "users", user.uid), {
          phone: phoneNumber,
        });
        setEditShow((prev) =>
          prev.map((item) =>
            item.id === "3" ? { ...item, editShow: false } : item
          )
        );
        break;
      case "4":
        setProfile((prev) =>
          prev.map((item) =>
            item.id === "4" ? { ...item, value: work } : item
          )
        );
        await updateDoc(doc(db, "users", user.uid), {
          address_work: work,
        });
        setEditShow((prev) =>
          prev.map((item) =>
            item.id === "4" ? { ...item, editShow: false } : item
          )
        );
        break;
      case "5":
        setProfile((prev) =>
          prev.map((item) =>
            item.id === "5" ? { ...item, value: home } : item
          )
        );
        await updateDoc(doc(db, "users", user.uid), {
          address_home: home,
        });
        setEditShow((prev) =>
          prev.map((item) =>
            item.id === "5" ? { ...item, editShow: false } : item
          )
        );
        break;
      default:
        break;
    }
  };

  const pickImage = async (fromCamera = false) => {
    const permission = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permission.status !== "granted") {
      Alert.alert("Permission required to access media.");
      return;
    }

    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({ quality: 1, allowsEditing: true })
      : await ImagePicker.launchImageLibraryAsync({
          quality: 1,
          allowsEditing: true,
        });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setImgUrl(uri);
      await uploadToCloudinary(uri);
    }
  };

  const choosingOption = (optionId) => {
    setEditShow((prev) =>
      prev.map((item) =>
        item.id === optionId ? { ...item, editShow: !item.editShow } : item
      )
    );
  };

  return (
    <SafeAreaView style={{ paddingHorizontal: 12 }}>
      <View style={styles.headerContanier}>
        <Ionicons name="arrow-back" size={30} color="black" />
        <Text style={styles.profileTitle}>Profile</Text>
        <Feather
          name="search"
          size={30}
          color="black"
          onPress={() => router.push("/search")}
        />
      </View>
      <Pressable
        style={{ alignItems: "center" }}
        onPress={() => openingModal()}
      >
        {user?.photoURL ? (
          <Image
            source={{ uri: user?.photoURL }}
            style={{ width: 100, height: 100, borderRadius: 61 }}
          />
        ) : (
          <Image
            source={images.avatar}
            style={{ width: 100, height: 100, borderRadius: 61 }}
          />
        )}

        <EvilIcons
          name="pencil"
          onPress={handleOpen}
          size={24}
          color={colors.white}
          style={{
            backgroundColor: colors.primary,
            width: 28,
            height: 28,
            borderRadius: 18,
            justifyContent: "center",
            alignItems: "center",
            padding: 2,
            position: "absolute",
            top: 65,
            right: 140,
          }}
        />
      </Pressable>
      <View
        style={{
          width: "auto",
          height: 500,
          backgroundColor: colors.white,
          borderRadius: 20,
          marginVertical: 24,
        }}
      >
        <FlatList
          data={profile}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            gap: 15,
            marginVertical: 20,
            marginHorizontal: 8,
            paddingBottom: 40,
          }}
          ListFooterComponent={
            <TouchableOpacity
              onPress={() => router.push("../orders")}
              style={{
                flexDirection: "row",
                flex: 1,
                paddingHorizontal: 14,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <View
                  style={{
                    width: 58,
                    height: 58,
                    backgroundColor: colors.primaryBackground,
                    borderRadius: 34,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <AntDesign
                    name="shoppingcart"
                    size={26}
                    color={colors.primary}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 15,
                    color: colors.black,
                    fontFamily: "Bold",
                  }}
                >
                  Orders
                </Text>
              </View>
              <AntDesign name="right" size={24} color={colors.primary} />
            </TouchableOpacity>
          }
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  flexDirection: "row",
                  gap: 15,
                  alignItems: "center",
                  padding: 10,
                }}
              >
                {/* Icon */}
                <View
                  style={{
                    backgroundColor: colors.primaryBackground,
                    width: 58,
                    height: 58,
                    borderRadius: 34,
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <Entypo color={colors.primary} size={24} name={item.icon} />
                </View>
                {/* text Items  */}
                <View
                  style={{
                    flex: 1, // allow it to fill remaining space
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View style={{ gap: 3, flexShrink: 1 }}>
                    <Text style={styles.profileLabel}>{item.label}</Text>

                    {editShow[parseInt(item.id) - 1].editShow ? (
                      <TextInput
                        style={styles.profileValue}
                        numberOfLines={2}
                        value={settingFunction(item.id)}
                        onChangeText={(text) => changeFun(item.id)(text)}
                      />
                    ) : (
                      <Text
                        style={styles.profileValue}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      >
                        {item.value}
                      </Text>
                    )}
                  </View>

                  {/* Edit icons */}
                  <View style={{ flexDirection: "row", gap: 8, flexShrink: 0 }}>
                    {editShow[parseInt(item.id) - 1].editShow ? (
                      <>
                        <Entypo
                          name="save"
                          size={24}
                          color={colors.primary}
                          onPress={() => saveFn(item.id)}
                        />
                        <MaterialIcons
                          name="cancel"
                          size={24}
                          color={colors.primary}
                          onPress={() => cancelFun(item.id)}
                        />
                      </>
                    ) : (
                      <FontAwesome
                        name="pencil-square"
                        size={24}
                        color={colors.primary}
                        onPress={() => choosingOption(item.id)}
                      />
                    )}
                  </View>
                </View>
              </View>
            );
          }}
        />
      </View>
      <Pressable
        onPress={logout}
        style={{
          width: "auto",
          height: 48,
          backgroundColor: "rgba(241, 65, 65, 0.05)",
          borderWidth: 1,
          borderRadius: 24,
          borderColor: colors.primary,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Entypo name="log-out" size={24} color={colors.error} />
        <Text style={[styles.editProfile, { color: colors.error }]}>
          Log Out
        </Text>
      </Pressable>
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
              Edit Profile Photo
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginVertical: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => pickImage(true)}
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
                <Entypo name="camera" size={24} color={colors.primary} />
                <Text
                  style={{
                    fontFamily: "Regular",
                    fontSize: 18,
                    color: colors.black,
                  }}
                >
                  Camera
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => pickImage(false)}
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
                <FontAwesome name="photo" size={24} color={colors.primary} />
                <Text
                  style={{
                    fontFamily: "Regular",
                    fontSize: 18,
                    color: colors.black,
                  }}
                >
                  Gallery
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ActionsheetContent>
      </Actionsheet>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  headerContanier: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  profileTitle: {
    fontSize: 18,
    color: colors.black,
    fontFamily: "SemiBold",
  },
  profileLabel: {
    fontSize: 14,
    fontFamily: "Medium",
    color: colors.labelColor,
  },
  profileValue: {
    fontFamily: "SemiBold",
    fontSize: 16,
    color: colors.black,
    minWidth: 200,
  },
  editProfile: {
    color: colors.primary,
    fontFamily: "Bold",
    fontSize: 16,
  },
  containerStyle: {
    backgroundColor: "white",
    padding: 20,
    width: "90%",
    alignSelf: "center",
    borderColor: colors.primaryBackground,
    borderWidth: 5,
  },
});
