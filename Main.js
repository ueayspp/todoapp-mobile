import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  RefreshControl,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
  Vibration,
  TextInput,
  KeyboardAvoidingView,
  ToastAndroid,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getToken } from "./token";
import axios from "axios";
import moment from "moment";
// import "moment-timezone";
// import "moment-range";
import "moment/locale/th";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function Main() {
  const [data, setData] = useState([]);
  const [modalAdd, setModalAdd] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [itemID, setItemID] = useState(0);
  const [nameToAdd, setNameToAdd] = useState("");
  const [dateToAdd, setDateToAdd] = useState("");
  const [momentToAdd, setMomentToAdd] = useState(moment());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [date, setDate] = useState(moment());
  const [time, setTime] = useState(moment());
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const imgLnk = "https://newsystem.pagekite.me/appresource/";

  useEffect(() => {
    getToken().then((res) => {
      if (!res) {
        ToastAndroid.show(
          "เซสชันหมดอายุ โปรดเข้าสู่ระบบอีกครั้ง",
          ToastAndroid.SHORT
        );
        navigation.navigate("Sign In");
      } else {
        axios
          .get("https://cache111.com/todoapi/activities", {
            headers: { Authorization: "Bearer " + res },
            timeout: 10 * 1000,
          })
          .then((response) => {
            setData(response.data);
          })
          .catch((error) => {
            if (error.code === "ECONNABORTED") {
              ToastAndroid.show("หมดเวลาการเชื่อมต่อ", ToastAndroid.SHORT);
            } else {
              if (
                error.response.status === 401 ||
                error.response.status === 403
              )
                navigation.navigate("Sign Out");
              else ToastAndroid.show(error, ToastAndroid.SHORT);
            }
          });
      }
    });
  });

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleDateConfirm = (dateData) => {
    let dateTime = moment(
      moment(dateData).format("YYYY-MM-DD") +
        " " +
        moment(time).format("HH:mm"),
      "YYYY-MM-DD HH:mm",
      true
    );
    setDate(dateTime);
    setDateToAdd(dateTime.toISOString());
    setMomentToAdd(dateTime);
    momentToAdd.locale("th");
    hideDatePicker();
    showTimePicker();
  };

  const handleTimeConfirm = (timeData) => {
    let dateTime = moment(
      moment(date).format("YYYY-MM-DD") +
        " " +
        moment(timeData).format("HH:mm"),
      "YYYY-MM-DD HH:mm",
      true
    );
    setTime(dateTime);
    setDateToAdd(dateTime.toISOString());
    setMomentToAdd(dateTime);
    momentToAdd.locale("th");
    hideTimePicker();
  };

  const addActivity = () => {
    // เปิด modal ให้ add
    setMomentToAdd(moment());
    setDate(moment());
    setTime(moment());
    momentToAdd.locale("th");
    setDateToAdd(moment().toISOString());
    setModalAdd(true);
  };

  const editActivity = (item) => {
    // เปิด modal ให้ edit
    setItemID(item.id);
    setMomentToAdd(moment(item.when));
    setDate(moment(item.when));
    setTime(moment(item.when));
    momentToAdd.locale("th");
    setNameToAdd(item.name);
    setDateToAdd(item.when);
    setModalEdit(true);
  };

  const deleteActivity = (item) => {
    // เปิด modal ให้ delete (ยืนยัน)
    setItemID(item.id);
    setNameToAdd(item.name);
    setModalDelete(true);
  };

  const render = (data) => {
    let imgNo = data.item.id % 254;
    let when = moment(data.item.when + "Z");
    when.add(-7, "hour");
    when.locale("th");
    return (
      <TouchableNativeFeedback
        onPress={() => editActivity(data.item)}
        delayLongPress={500}
        onLongPress={() => {
          Vibration.vibrate(100);
          deleteActivity(data.item);
        }}
      >
        <View key={data.item.id} style={styles.flatListItems}>
          <Text style={styles.itemActivity}>
            {data.item.name}
            {"\n"}
            {when
              .format("LLLL")
              .split(" เวลา ")[0]
              .replace(
                when.format("YYYY"),
                (parseInt(when.format("YYYY")) + 543).toString()
              )}
            {"\n"}
            {when.format("HH:mm")}
          </Text>
        </View>
      </TouchableNativeFeedback>
    );
  };

  return (
    <View style={styles.container}>
      <View>
        <FlatList
          data={data}
          renderItem={render}
          style={styles.flatList}
          contentContainerStyle={styles.flatListContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                getToken().then((res) => {
                  if (!res) {
                    ToastAndroid.show(
                      "เซสชันหมดอายุ โปรดเข้าสู่ระบบอีกครั้ง",
                      ToastAndroid.SHORT
                    );
                    navigation.navigate("Sign In");
                  } else {
                    axios
                      .get("https://cache111.com/todoapi/activities", {
                        headers: { Authorization: "Bearer " + res },
                        timeout: 10 * 1000,
                      })
                      .then((response) => {
                        setData(response.data);
                      })
                      .catch((error) => {
                        if (error.code === "ECONNABORTED") {
                          ToastAndroid.show(
                            "หมดเวลาการเชื่อมต่อ",
                            ToastAndroid.SHORT
                          );
                        } else {
                          if (
                            error.response.status === 401 ||
                            error.response.status === 403
                          )
                            navigation.navigate("Sign Out");
                          else ToastAndroid.show(error, ToastAndroid.SHORT);
                        }
                      });
                  }
                });
                setRefreshing(false);
              }}
            />
          }
        />
        <TouchableOpacity onPress={() => addActivity()} style={styles.fab}>
          <Ionicons name="add-circle" style={styles.fabIcon} />
        </TouchableOpacity>
      </View>
      <Modal animationType="slide" transparent={true} visible={modalAdd}>
        <KeyboardAvoidingView>
          <View
            style={{ ...styles.modal, minHeight: 640, avoidKeyboard: true }}
          >
            <View style={{ ...styles.modalContainer, height: "45%" }}>
              {/* header */}
              <View>
                <View style={{ ...styles.modalHeader, height: "20%" }}>
                  <Text style={styles.title}>เพิ่มกิจกรรม</Text>
                  <View style={styles.divider}></View>
                </View>
                {/* body */}
                <View style={{ ...styles.modalBody, height: "60%" }}>
                  <View style={{ bottom: "5%" }}>
                    <Text
                      style={{
                        ...styles.bodyText,
                        fontWeight: "bold",
                        top: "0%",
                      }}
                    >
                      ชื่อกิจกรรม
                    </Text>
                    <TextInput
                      style={{
                        ...styles.input,
                        bottom: "10%",
                        avoidKeyboard: true,
                      }}
                      onChangeText={setNameToAdd}
                    />
                  </View>
                  <View
                    style={{
                      bottom: "10%",
                      flexDirection: "row-reverse",
                      margin: 8,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        showDatePicker();
                      }}
                      style={{ top: "2.5%", left: "50%" }}
                    >
                      <Ionicons name="calendar" style={{ fontSize: 48 }} />
                    </TouchableOpacity>
                    <View style={{ left: "100%" }}>
                      <Text
                        style={{
                          ...styles.bodyText,
                          fontWeight: "bold",
                          top: "0%",
                          fontSize: 18,
                        }}
                      >
                        เวลา
                      </Text>
                      <Text style={{ ...styles.bodyText }}>
                        {momentToAdd
                          .format("LLLL")
                          .split(" เวลา ")[0]
                          .replace(
                            momentToAdd.format("YYYY"),
                            (
                              parseInt(momentToAdd.format("YYYY")) + 543
                            ).toString()
                          )}
                      </Text>
                      <Text style={{ ...styles.bodyText }}>
                        {momentToAdd.format("LLLL").split(" เวลา ")[1]}
                      </Text>
                    </View>
                  </View>
                  <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleDateConfirm}
                    onCancel={hideDatePicker}
                    is24Hour={true}
                  />
                  <DateTimePickerModal
                    isVisible={isTimePickerVisible}
                    mode="time"
                    onConfirm={handleTimeConfirm}
                    onCancel={hideTimePicker}
                    is24Hour={true}
                  />
                </View>
                {/* footer */}
                <View style={{ ...styles.modalFooter, height: "20%" }}>
                  <View style={styles.divider}></View>
                  <View style={{ flexDirection: "row-reverse", margin: 8 }}>
                    <TouchableOpacity
                      style={{
                        ...styles.actions,
                        backgroundColor: "#db2828",
                      }}
                      onPress={() => {
                        setModalAdd(!modalAdd);
                        setNameToAdd("");
                        setDateToAdd("");
                      }}
                    >
                      <Text style={styles.actionText}>ยกเลิก</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        ...styles.actions,
                        backgroundColor: "#21ba45",
                      }}
                      onPress={() => {
                        if (!nameToAdd)
                          ToastAndroid.show(
                            "โปรดใส่ชื่อกิจกรรม",
                            ToastAndroid.SHORT
                          );
                        else {
                          getToken().then((res) => {
                            if (!res) {
                              ToastAndroid.show(
                                "เซสชันหมดอายุ โปรดเข้าสู่ระบบอีกครั้ง",
                                ToastAndroid.SHORT
                              );
                              navigation.navigate("Sign In");
                            } else {
                              let fixDate = moment(dateToAdd);
                              fixDate.add(+7, "hour");
                              axios
                                .post(
                                  "https://cache111.com/todoapi/activities",
                                  {
                                    name: nameToAdd,
                                    when: fixDate.toISOString(),
                                  },
                                  {
                                    headers: {
                                      Authorization: "Bearer " + res,
                                    },
                                    timeout: 10 * 1000,
                                  }
                                )
                                .then((response) => {})
                                .catch((error) => {
                                  if (error.code === "ECONNABORTED") {
                                    ToastAndroid.show(
                                      "หมดเวลาการเชื่อมต่อ",
                                      ToastAndroid.SHORT
                                    );
                                  } else {
                                    ToastAndroid.show(
                                      error,
                                      ToastAndroid.SHORT
                                    );
                                  }
                                });

                              axios
                                .get(
                                  "https://cache111.com/todoapi/activities",
                                  {
                                    headers: {
                                      Authorization: "Bearer " + res,
                                    },
                                    timeout: 10 * 1000,
                                  }
                                )
                                .then((response) => {
                                  setData(response.data);
                                })
                                .catch((error) => {
                                  if (error.code === "ECONNABORTED") {
                                    ToastAndroid.show(
                                      "หมดเวลาการเชื่อมต่อ",
                                      ToastAndroid.SHORT
                                    );
                                  } else {
                                    ToastAndroid.show(
                                      error,
                                      ToastAndroid.SHORT
                                    );
                                  }
                                });
                            }
                          });
                          setModalAdd(!modalAdd);
                          ToastAndroid.show(
                            "เพิ่มกิจกรรม " + nameToAdd + " แล้ว",
                            ToastAndroid.SHORT
                          );
                          setNameToAdd("");
                          setDateToAdd("");
                        }
                      }}
                    >
                      <Text style={styles.actionText}>ตกลง</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      <Modal animationType="slide" transparent={true} visible={modalEdit}>
        <KeyboardAvoidingView>
          <View
            style={{ ...styles.modal, minHeight: 640, avoidKeyboard: true }}
          >
            <View style={{ ...styles.modalContainer, height: "45%" }}>
              {/* header */}
              <View>
                <View style={{ ...styles.modalHeader, height: "20%" }}>
                  <Text style={styles.title}>แก้ไขกิจกรรม</Text>
                  <View style={styles.divider}></View>
                </View>
                {/* body */}
                <View style={{ ...styles.modalBody, height: "60%" }}>
                  <View style={{ bottom: "5%" }}>
                    <Text
                      style={{
                        ...styles.bodyText,
                        fontWeight: "bold",
                        top: "0%",
                        fontSize: 18,
                      }}
                    >
                      ชื่อกิจกรรม
                    </Text>
                    <TextInput
                      style={{
                        ...styles.input,
                        bottom: "10%",
                        avoidKeyboard: true,
                      }}
                      onChangeText={setNameToAdd}
                      value={nameToAdd}
                      defaultValue={nameToAdd}
                    />
                  </View>
                  <View
                    style={{
                      bottom: "10%",
                      flexDirection: "row-reverse",
                      margin: 8,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        showDatePicker();
                      }}
                      style={{ top: "2.5%", left: "50%" }}
                    >
                      <Ionicons name="calendar" style={{ fontSize: 48 }} />
                    </TouchableOpacity>
                    <View style={{ left: "100%" }}>
                      <Text
                        style={{
                          ...styles.bodyText,
                          fontWeight: "bold",
                          top: "0%",
                          fontSize: 18,
                        }}
                      >
                        เวลา
                      </Text>
                      <Text style={{ ...styles.bodyText }}>
                        {momentToAdd
                          .format("LLLL")
                          .split(" เวลา ")[0]
                          .replace(
                            momentToAdd.format("YYYY"),
                            (
                              parseInt(momentToAdd.format("YYYY")) + 543
                            ).toString()
                          )}
                      </Text>
                      <Text style={{ ...styles.bodyText }}>
                        {momentToAdd.format("LLLL").split(" เวลา ")[1]}
                      </Text>
                    </View>
                  </View>
                  <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleDateConfirm}
                    onCancel={hideDatePicker}
                    is24Hour={true}
                  />
                  <DateTimePickerModal
                    isVisible={isTimePickerVisible}
                    mode="time"
                    onConfirm={handleTimeConfirm}
                    onCancel={hideTimePicker}
                    is24Hour={true}
                  />
                </View>
                {/* footer */}
                <View style={{ ...styles.modalFooter, height: "20%" }}>
                  <View style={styles.divider}></View>
                  <View style={{ flexDirection: "row-reverse", margin: 8 }}>
                    <TouchableOpacity
                      style={{
                        ...styles.actions,
                        backgroundColor: "#db2828",
                      }}
                      onPress={() => {
                        setModalEdit(!modalEdit);
                        setNameToAdd("");
                        setDateToAdd("");
                        setItemID(0);
                      }}
                    >
                      <Text style={styles.actionText}>ยกเลิก</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        ...styles.actions,
                        backgroundColor: "#21ba45",
                      }}
                      onPress={() => {
                        if (!nameToAdd)
                          ToastAndroid.show(
                            "โปรดใส่ชื่อกิจกรรม",
                            ToastAndroid.SHORT
                          );
                        else {
                          getToken().then((res) => {
                            if (!res) {
                              ToastAndroid.show(
                                "เซสชันหมดอายุ โปรดเข้าสู่ระบบอีกครั้ง",
                                ToastAndroid.SHORT
                              );
                              navigation.navigate("Sign In");
                            } else {
                              let fixDate = moment(dateToAdd);
                              fixDate.add(+7, "hour");
                              axios
                                .put(
                                  "https://cache111.com/todoapi/activities/" +
                                    itemID,
                                  {
                                    name: nameToAdd,
                                    when: fixDate.toISOString(),
                                  },
                                  {
                                    headers: {
                                      Authorization: "Bearer " + res,
                                    },
                                    timeout: 10 * 1000,
                                  }
                                )
                                .then((response) => {})
                                .catch((error) => {
                                  if (error.code === "ECONNABORTED") {
                                    ToastAndroid.show(
                                      "หมดเวลาการเชื่อมต่อ",
                                      ToastAndroid.SHORT
                                    );
                                  } else {
                                    ToastAndroid.show(
                                      error,
                                      ToastAndroid.SHORT
                                    );
                                  }
                                });

                              axios
                                .get(
                                  "https://cache111.com/todoapi/activities",
                                  {
                                    headers: {
                                      Authorization: "Bearer " + res,
                                    },
                                    timeout: 10 * 1000,
                                  }
                                )
                                .then((response) => {
                                  setData(response.data);
                                })
                                .catch((error) => {
                                  if (error.code === "ECONNABORTED") {
                                    ToastAndroid.show(
                                      "หมดเวลาการเชื่อมต่อ",
                                      ToastAndroid.SHORT
                                    );
                                  } else {
                                    ToastAndroid.show(
                                      error,
                                      ToastAndroid.SHORT
                                    );
                                  }
                                });
                            }
                          });
                          setModalEdit(!modalEdit);
                          ToastAndroid.show(
                            "แก้ไขกิจกรรม " + nameToAdd + " แล้ว",
                            ToastAndroid.SHORT
                          );
                          setNameToAdd("");
                          setDateToAdd("");
                          setItemID(0);
                        }
                      }}
                    >
                      <Text style={styles.actionText}>ตกลง</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      <Modal animationType="slide" transparent={true} visible={modalDelete}>
        <View style={styles.modal}>
          <View style={styles.modalContainer}>
            {/* header */}
            <View>
              <View style={styles.modalHeader}>
                <Text style={styles.title}>ลบกิจกรรม</Text>
                <View style={styles.divider}></View>
              </View>
              {/* body */}
              <Text style={styles.bodyText}>
                คุณต้องการลบกิจกรรมนี้ใช่หรือไม่
              </Text>
              <Text style={styles.bodyText}>กิจกรรมที่กำลังจะถูกลบ:</Text>
              <Text style={{ ...styles.bodyText, fontWeight: "bold" }}>
                {nameToAdd}
              </Text>
              {/* footer */}
              <View style={{ ...styles.modalFooter, top: "10%" }}>
                <View style={styles.divider}></View>
                <View style={{ flexDirection: "row-reverse", margin: 10 }}>
                  <TouchableOpacity
                    style={{ ...styles.actions, backgroundColor: "#db2828" }}
                    onPress={() => {
                      setModalDelete(!modalDelete);
                      setNameToAdd("");
                      setItemID(0);
                    }}
                  >
                    <Text style={styles.actionText}>ไม่</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ ...styles.actions, backgroundColor: "#21ba45" }}
                    onPress={() => {
                      getToken().then((res) => {
                        if (!res) {
                          ToastAndroid.show(
                            "เซสชันหมดอายุ โปรดเข้าสู่ระบบอีกครั้ง",
                            ToastAndroid.SHORT
                          );
                          navigation.navigate("Sign In");
                        } else {
                          axios
                            .delete(
                              "https://cache111.com/todoapi/activities/" +
                                itemID,
                              {
                                headers: { Authorization: "Bearer " + res },
                                timeout: 10 * 1000,
                              }
                            )
                            .then((response) => {})
                            .catch((error) => {
                              if (error.code === "ECONNABORTED") {
                                ToastAndroid.show(
                                  "หมดเวลาการเชื่อมต่อ",
                                  ToastAndroid.SHORT
                                );
                              } else {
                                ToastAndroid.show(error, ToastAndroid.SHORT);
                              }
                            });

                          axios
                            .get("https://cache111.com/todoapi/activities", {
                              headers: { Authorization: "Bearer " + res },
                              timeout: 10 * 1000,
                            })
                            .then((response) => {
                              setData(response.data);
                            })
                            .catch((error) => {
                              if (error.code === "ECONNABORTED") {
                                ToastAndroid.show(
                                  "หมดเวลาการเชื่อมต่อ",
                                  ToastAndroid.SHORT
                                );
                              } else {
                                ToastAndroid.show(error, ToastAndroid.SHORT);
                              }
                            });
                        }
                      });
                      setModalDelete(!modalDelete);
                      ToastAndroid.show(
                        "ลบกิจกรรม " + nameToAdd + " แล้ว",
                        ToastAndroid.SHORT
                      );
                      setNameToAdd("");
                      setItemID(0);
                    }}
                  >
                    <Text style={styles.actionText}>ใช่</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatList: {
    height: "100%",
  },
  flatListContent: {},
  flatListItems: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    padding: 20,
    elevation: 1,
  },
  addActivity: {
    fontSize: 36,
    fontWeight: "bold",
    padding: 20,
  },
  itemActivity: {
    fontSize: 18,
  },
  itemWhen: {
    fontSize: 18,
  },
  fab: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    left: "77.5%",
    bottom: "12.5%",
  },
  fabIcon: {
    fontSize: 80,
  },
  modal: {
    backgroundColor: "#00000099",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
  },
  modalContainer: {
    backgroundColor: "#f9fafb",
    width: "80%",
    height: "25%",
    borderRadius: 5,
  },
  modalHeader: {},
  title: {
    fontWeight: "bold",
    fontSize: 20,
    padding: 15,
    color: "#000",
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "lightgray",
  },
  modalBody: {
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  modalFooter: {},
  actions: {
    borderRadius: 5,
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  bodyText: {
    whiteSpace: "pre-line",
    top: "5%",
    left: "5%",
  },
  actionText: {
    color: "#fff",
  },
  input: {
    fontSize: 18,
    borderWidth: 1,
    padding: "1%",
    margin: "5%",
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
