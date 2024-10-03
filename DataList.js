import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Platform,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import Constants from "expo-constants";
import axios from "axios";
import UserAvatar from "react-native-user-avatar";

const DataList = () => {
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsers = async (count = 10) => {
    try {
      const response = await axios.get(
        `https://random-data-api.com/api/v2/users?size=${count}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  };

  const loadInitialUsers = async () => {
    const initialUsers = await fetchUsers();
    setUsers(initialUsers);
  };

  useEffect(() => {
    loadInitialUsers();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    const newUsers = await fetchUsers();
    setUsers(newUsers);
    setRefreshing(false);
  };

  const addNewUser = async () => {
    const newUser = await fetchUsers(1);
    setUsers((prevUsers) => [newUser[0], ...prevUsers]);
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.item,
        Platform.OS === "ios" ? styles.iosItem : styles.androidItem,
      ]}
    >
      {Platform.OS === "android" && (
        <UserAvatar
          size={50}
          name={`${item.first_name} ${item.last_name}`}
          src={item.avatar}
        />
      )}
      <View style={styles.textContainer}>
        <Text style={styles.firstName}>{item.first_name}</Text>
        <Text style={styles.lastName}>{item.last_name}</Text>
      </View>
      {Platform.OS === "ios" && (
        <UserAvatar
          size={50}
          name={`${item.first_name} ${item.last_name}`}
          src={item.avatar}
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={(item) => item.uid}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <TouchableOpacity style={styles.fab} onPress={addNewUser}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingTop: Constants.statusBarHeight,
  },
  item: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    alignItems: "center",
  },
  iosItem: {
    justifyContent: "flex-end",
  },
  androidItem: {
    justifyContent: "flex-start",
  },
  textContainer: {
    flex: 1,
    marginHorizontal: 15,
  },
  firstName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  lastName: {
    fontSize: 16,
    color: "#666",
  },
  fab: {
    position: "absolute",
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    backgroundColor: "#007AFF",
    borderRadius: 28,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabIcon: {
    fontSize: 24,
    color: "white",
  },
});

export default DataList;
