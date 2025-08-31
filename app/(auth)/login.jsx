import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "@/components/ui/actionsheet";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Modal } from "react-native-web";
import LoginCard from "../../components/LoginCard";
import SignUpCard from "../../components/SignUpCard";
import { colors } from "../../constants";
import { useAuth } from "../../context/AuthContext";
import { auth, db } from "../../firebaseConfig";

const { height } = Dimensions.get("screen");

const Login = () => {
  const { login, user } = useAuth();
  const [authScreen, setAuthScreen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [visible, setVisible] = useState(true);
  const [showActionsheet, setShowActionsheet] = useState(false);
  const handleClose = () => setShowActionsheet(false);
  const handleOpen = () => setShowActionsheet(true);
  const [authData, setAuthData] = useState();

  const furtherSteps = () => {
    login(authData);
  };

  const signIn = async (data) => {
    if (data) {
      console.log("data1", data);
    } else {
      return null;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      if (userCredential.user) {
        setAuthData(userCredential.user.uid);
        handleOpen();
      }
    } catch (error) {
      console.log(error);
      alert("Sign In Failed", error.message);
    }
  };

  const signUp = async (data) => {
    setLoader(true);
    if (data) {
      console.log("data2", data);
    } else {
      return null;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;
      if (!user.displayName) {
        await updateProfile(user, {
          displayName: data.name,
        });
        console.log("Display name set successfully", user.uid);
      }

      await setDoc(doc(db, "users", user.uid), {
        phone: "",
        address_home: "",
        address_work: "",
        cartItems: [],
      });

      setAuthData(user.uid);
      handleOpen();

      // login(user.uid);
    } catch (error) {
      console.log(error);
      alert("Sign In Failed", error.message);
    }
  };

  const getLoginData = (data) => {
    console.log("data", data);
  };

  const getSignUpData = (data) => {
    console.log("data", data);
  };

  const switchLoginScreen = () => {
    setAuthScreen(false);
  };

  const switchSignUpScreen = () => {
    setAuthScreen(true);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        <ImageBackground
          source={require("../../assets/images/authIcon.png")}
          style={styles.image}
          resizeMode="cover"
        >
          <View style={styles.overlay} />
          <View style={styles.textContainer}>
            <Image
              source={require("../../assets/images/appIcon.png")}
              style={{ width: 74, height: 74 }}
            />
            <View style={{ justifyContent: "center", flex: 1, gap: 5 }}>
              <Text
                style={{ fontFamily: "Bold", color: "#ffff", fontSize: 32 }}
              >
                Get Started now
              </Text>
              <Text
                style={{ fontFamily: "Medium", fontSize: 16, color: "#fff" }}
              >
                Create an account or log in to explore
              </Text>
            </View>
          </View>
        </ImageBackground>
      </View>
      <View style={styles.bottomSheet}>
        {/* Login or SignUp */}
        <View
          style={{
            backgroundColor: "#F5F6F9",
            width: "100%",
            alignSelf: "center",
            height: 50,
            marginVertical: 20,
            borderRadius: 2,
            padding: 3,
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            onPress={() =>
              setAuthScreen((prev) => (prev === false ? true : prev))
            }
            style={{
              backgroundColor: authScreen ? colors.white : "#F5F6F9",
              width: "50%",
              height: 44,
              borderRadius: 2,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: authScreen ? colors.primary : colors.labelColor,
                fontSize: 16,
                fontFamily: "Bold",
              }}
            >
              Log In
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              setAuthScreen((prev) => (prev === true ? false : prev))
            }
            style={{
              backgroundColor: authScreen ? "#F5F6F9" : colors.white,
              width: "50%",
              height: 44,
              borderRadius: 2,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: authScreen ? colors.labelColor : colors.primary,
                fontSize: 16,
                fontFamily: "Bold",
              }}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
        {authScreen ? (
          <LoginCard
            switchScreen={switchLoginScreen}
            finalCall={signIn}
            loaderData={{ loading: loader, setLoader: setLoader }}
          />
        ) : (
          <SignUpCard
            switchScreen={switchSignUpScreen}
            finalCall={signUp}
            loaderData={{ loading: loader, setLoader: setLoader }}
          />
        )}
      </View>
      <Modal
        transparent
        visible={visible}
        animationType="none"
        onRequestClose={() => setVisible(false)}
      >
        {/* Backdrop */}
        <Pressable style={styles.backdrop} onPress={() => setVisible(false)} />

        {/* Bottom Sheet */}
        <View style={styles.bottomSheet}>
          <Text style={styles.sheetText}>This is a simple bottom sheet</Text>
          <TouchableOpacity
            onPress={() => setVisible(false)}
            style={styles.closeButton}
          >
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <View
            style={{
              alignItems: "center",
              justifyContent: "space-around",

              gap: 10,
              marginBottom: 50,
            }}
          >
            <Image
              resizeMode="contain"
              style={{ width: 200, height: 200 }}
              source={require("../../assets/images/IllustrationSuccess.png")}
            />
            <Text
              style={{ fontFamily: "Bold", color: colors.black, fontSize: 24 }}
            >
              Login Successful
            </Text>
            <TouchableOpacity
              onPress={() => login(authData)}
              style={{
                width: 380,
                height: 48,
                borderRadius: 150,
                backgroundColor: colors.primary,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Bold",
                  color: colors.white,
                  fontSize: 18,
                }}
              >
                Go to Homepage
              </Text>
            </TouchableOpacity>
          </View>
        </ActionsheetContent>
      </Actionsheet>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    height: height * 0.35,
    width: "100%",
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  textContainer: {
    ...StyleSheet.absoluteFillObject,
    padding: 40,
  },
  text: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  bottomSheet: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -55,
    elevation: 5,
    padding: 15,
  },
  bottomSheet2: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height / 2, // 50% height
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
});
