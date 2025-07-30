import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../constants";

const LoginCard = ({ switchScreen, finalCall }) => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return regex.test(email);
  };

  const loginSubmit = () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = password.length >= 6;

    if (!isEmailValid && !isPasswordValid) {
      alert("Please enter a valid email and password (min 6 characters)");
    } else if (!isEmailValid) {
      alert("Please enter a valid email!");
    } else if (!isPasswordValid) {
      alert("Password must be at least 6 characters");
    } else {
      finalCall({ email, password });
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View>
        <Text style={styles.label}>Email address</Text>
        <TextInput
          style={styles.inputContainer}
          onChangeText={setEmail}
          value={email}
        />
      </View>
      <View>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={[styles.inputContainer, { letterSpacing: 6, fontSize: 13 }]}
          onChangeText={setPassword}
          value={password}
          secureTextEntry
        />
      </View>
      <TouchableOpacity style={styles.buttonContainer} onPress={loginSubmit}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <Text style={styles.alreadyText} onPress={switchScreen}>
        Already have an account? <Text style={styles.span}>Sign up</Text>{" "}
      </Text>
    </View>
  );
};

export default LoginCard;

const styles = StyleSheet.create({
  mainContainer: {
    gap: 20,
  },
  label: {
    color: colors.labelColor,
    fontFamily: "SemiBold",
    fontSize: 16,
  },
  inputContainer: {
    borderBottomWidth: 1,
    width: "auto",
    borderBottomColor: colors.inputBorder,
    height: "auto",
    color: colors.black,
    fontFamily: "Bold",
    fontSize: 15,
  },
  buttonContainer: {
    backgroundColor: colors.primary,
    borderRadius: 50,
    width: "auto",
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: { fontSize: 16, fontFamily: "Bold", color: colors.white },
  alreadyText: {
    color: colors.labelColor,
    fontFamily: "Medium",
    fontSize: 16,
    textAlign: "center",
  },
  span: {
    color: colors.primary,
    fontFamily: "Bold",
  },
});
