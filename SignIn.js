import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ToastAndroid,
  Image,
  ImageBackground,
} from "react-native";
import axios from "axios";
import { getToken, storeToken } from "./token";
import { useNavigation } from "@react-navigation/native";
export default function SignIn() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    getToken().then((res) => {
      if (res) {
        navigation.navigate("AppDrawer");
      }
    });
  });
  const signIn = () => {
    if (!id || !password) {
      ToastAndroid.show(
        "โปรดใส่เลขประจำตัวประชาชน และรหัสผ่าน",
        ToastAndroid.SHORT
      );
    } else {
      axios
        .post(
          "https://cache111.com/todoapi/tokens",
          { id: id, password: password },
          {
            headers: {
              /* Authorization: 'Bearer ' + token */
            },
            timeout: 10 * 1000,
          }
        )
        .then((response) => {
          // save response.data.token
          // navigate to main page
          storeToken(response.data.token).then(() => {
            ToastAndroid.show("เข้าสู่ระบบสำเร็จ", ToastAndroid.SHORT);
            navigation.navigate("AppDrawer");
          });
        })
        .catch((error) => {
          ToastAndroid.show(
            "เข้าสู่ระบบล้มเหลวด้วยข้อผิดพลาด: HTTP ERROR " +
              error.response.status,
            ToastAndroid.SHORT
          );
        });
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("./assets/logo.png")}
        style={{
          height: 48,
          width: 240,
          alignItems: "center",
          bottom: "2.5%",
          left: "20%",
        }}
      />
      <TextInput
        style={styles.input}
        placeholder="เลขประจำตัวประชาชน"
        keyboardType="numeric"
        onChangeText={setId}
      />
      <TextInput
        type="password"
        secureTextEntry={true}
        style={styles.input}
        placeholder="รหัสผ่าน"
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={signIn}>
        <Text style={{ fontSize: 18, color: "white" }}>เข้าสู่ระบบ</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "stretch",
    justifyContent: "center",
  },
  input: {
    fontSize: 18,
    borderWidth: 1,
    padding: 10,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
  },
  button: {
    fontFamily: "Kanit Regular",
    fontSize: 18,
    alignItems: "center",
    backgroundColor: "black",
    padding: 10,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 20,
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "stretch",
    justifyContent: "center",
  },
});
