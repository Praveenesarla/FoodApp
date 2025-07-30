import { Button, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../context/AuthContext";

const Logout = () => {
  const { user, login, logout } = useAuth();

  return (
    <View>
      <Button title="logout" onPress={() => logout()} />
      <Text>Logout</Text>
    </View>
  );
};

export default Logout;

const styles = StyleSheet.create({});
