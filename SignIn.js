import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import axios from "axios"; // npm i axios

export default function SignIn() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const signIn = () => {
    axios
      .post(
        "https://cache111.com/todoapi/tokens",
        {
          id: id,
          password: password,
        },
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
        Alert.alert("Ok: " + response.status);
      })
      .catch((error) => {
        Alert.alert("Error: " + error);
      });
  };
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="เลขประจำตัวบัตรประชาชน"
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
        <Text>เข้าสู่ระบบ</Text>
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
    borderWidth: 1,
    padding: 10,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    marginBottom: 10,
  },
});
