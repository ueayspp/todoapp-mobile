import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { getToken } from "./token";
import { useState } from "react";
export default function Credit() {
  const navigation = useNavigation();
  const [imgNo, setImgNo] = useState(1 + Math.floor(Math.random() * 5));
  const imgLnk = "https://newsystem.pagekite.me/appresource/Credit";
  useEffect(() => {
    getToken().then((res) => {
      if (!res) {
        navigation.navigate("Sign Out");
      }
    });
  });
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{ alignItems: "center", justifyContent: "center" }}
        onPress={() => {
          setImgNo(1 + Math.floor(Math.random() * 5));
        }}
      >
        <Text style={styles.textHeader}>จัดทำโดย</Text>
        <Text style={styles.textContent}>6234464123 ศุภาเพ็ญ แก้วลี</Text>
        <Text style={styles.textContent}>6234466423 สุภาพร จารัตน์</Text>
        <Text style={styles.textContent}>6234469323 อรจิรา แกล้วเดชศรี</Text>
        <Text style={styles.textContent}>6234471523 อรุษา ธนโกไสย</Text>
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
  textHeader: {
    fontWeight: "bold",
    fontSize: 20,
    top: "-1.25%",
  },
  textContent: {
    fontSize: 16,
    buttom: "-2.5%",
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
