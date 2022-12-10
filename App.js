import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, View, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SignIn from "./SignIn";
import Main from "./Main";
import Credit from "./Credit";
import SignOut from "./SignOut";
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function SignOutPage() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Real Sign Out"
        component={SignOut}
        options={{
          headerLeft: () => {
            return null;
          },
        }}
      />
    </Stack.Navigator>
  );
}

function AppDrawer() {
  return (
    <Drawer.Navigator initialRouteName="Main">
      <Drawer.Screen
        name="Main"
        component={Main}
        options={{
          title: "รายการสิ่งที่ต้องทำ",
          headerRight: () => {
            return (
              <View>
                {/* <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      "วิธีใช้",
                      "1. กดเครื่องหมายบวกด้านมุมล่างขวา\n     เพื่อเพิ่มกิจกรรมใหม่\n2. กดที่กิจกรรมเพื่อแก้ไขกิจกรรม\n3. กดค้างที่กิจกรรมเพื่อลบกิจกรรม\n4. เลื่อนขึ้นจนสุดเพื่อรีเฟรซรายการกิจกรรม",
                      [{ text: "ตกลง", onPress: () => {} }]
                    );
                  }}
                  style={{}}
                >
                  <Ionicons
                    name="help-circle"
                    style={{
                      fontSize: 40,
                      alignItems: "center",
                      justifyContent: "center",
                      right: "10%",
                      top: "10%",
                    }}
                  />
                </TouchableOpacity> */}
              </View>
            );
          },
          drawerIcon: ({ tintColor }) => (
            <Ionicons
              name="list-circle"
              style={{ fontSize: 24, color: tintColor }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Credit"
        component={Credit}
        options={{
          title: "รายนามผู้จัดทำ",
          drawerIcon: ({ tintColor }) => (
            <Ionicons
              name="people"
              style={{ fontSize: 24, color: tintColor }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Sign Out"
        component={SignOutPage}
        options={{
          headerShown: false,
          title: "ออกจากระบบ",
          drawerIcon: ({ tintColor }) => (
            <Ionicons
              name="log-out"
              style={{ fontSize: 24, color: tintColor }}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Sign In">
        <Stack.Screen
          name="Sign In"
          component={SignIn}
          options={{
            title: "เข้าสู่ระบบ",
            headerLeft: () => {
              return null;
            },
          }}
        />
        <Stack.Screen
          name="AppDrawer"
          component={AppDrawer}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hamburgerIcon: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 20,
  },
  itemActivity: {
    fontSize: 18,
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
