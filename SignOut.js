import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  ToastAndroid,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { clearToken } from "./token";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function SignOut() {
  const navigation = useNavigation();

  useEffect(() => {
    ToastAndroid.show("ออกจากระบบสำเร็จ", ToastAndroid.SHORT);
    clearToken().then(() => {
      navigation.navigate("Sign In");
    });
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() =>
          clearToken().then(() => {
            navigation.navigate("Sign In");
          })
        }
      >
        <Text>ออกจากระบบสำเร็จ, กดที่นี่เพื่อเข้าสู่ระบบอีกครั้ง</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
