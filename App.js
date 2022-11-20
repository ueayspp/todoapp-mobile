import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SignIn from "./SignIn";
import Main from "./Main";
import Credit from "./Credit";
import SignOut from "./SignOut";

export default function App() {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="main">
        <Stack.Screen name="sign-in" component={SignIn} />
        <Stack.Screen name="main" component={Main} />
        <Stack.Screen name="credit" component={Credit} />
        <Stack.Screen name="sign-out" component={SignOut} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
