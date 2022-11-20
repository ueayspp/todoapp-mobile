import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function Main() {
  const [data, setData] = useState([
    { id: 0, activity: "add activity", when: "" },
    { id: 1, activity: "do homework", when: "2022-10-10T10:00:00" },
    { id: 2, activity: "have a dinner", when: "2022-10-10T18:00:00" },
  ]);

  const row = (item) => {
    Alert.alert(item.id.toString());
  };

  const render = (data) => {
    return (
      <TouchableOpacity onPress={() => row(data.item)}>
        <View key={data.item.id} style={styles.flatListItems}>
          <Text style={styles.itemActivity}>{data.item.activity}</Text>
          <Text style={styles.itemWhen}>{data.item.when}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={render}
        style={styles.flatList}
        contentContainerStyle={styles.flatListContent}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },
  flatList: {
    marginTop: 10,
  },
  flatListContent: {
    marginTop: 10,
    paddingBottom: 50,
  },
  flatListItems: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#cde",
    marginBottom: 8,
    padding: 10,
  },
  itemActivity: {
    fontSize: 18,
    fontWeight: "bold",
    color: "blue",
  },
  itemWhen: {
    fontSize: 18,
    fontWeight: "bold",
    color: "red",
  },
});
