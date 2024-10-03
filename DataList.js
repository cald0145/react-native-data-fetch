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
      //checking if response.data is an array, then wrap in array
      const userData = Array.isArray(response.data)
        ? response.data
        : [response.data];
      return userData.map((user) => ({
        // using map on array ensuring use of array of user objects, even when fetching a single user
        ...user,
        uid: user.uid || user.id || Math.random().toString(),
        // adding uid property if it doesn't exist for fallback!
      }));
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
    //fetching new users when refreshing
    const newUsers = await fetchUsers();
    setUsers(newUsers);
    setRefreshing(false);
  };

  const addNewUser = async () => {
    const newUser = await fetchUsers(1);
    //checking if new user has elements, ensuring only adding if received from api
    setUsers((prevUsers) => [newUser[0], ...prevUsers]);
    //using spread operator to add new user to the beginning of the list!!
    //using newuser[0] ensures adding a single user object
  };

  const renderItem = ({ item }) => {
    if (!item) return null; // Guard clause for undefined items

    return (
      //layout changes based on platform
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
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={renderItem}
        //ensuring that even if uid is missing or undefined that a unique key is created every time
        keyExtractor={(item) =>
          item?.uid?.toString() || Math.random().toString()
        }
        refreshControl={
          //refresh control for pull to refresh
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <TouchableOpacity style={styles.fab} onPress={addNewUser}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
    //fab button to add user
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8EBE4",
    paddingTop: Constants.statusBarHeight,
    //using constants to get status bar height so does not overlap with content
  },
  item: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#757780",
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
    color: "#373737",
  },
  lastName: {
    fontSize: 16,
    color: "#798071",
  },
  fab: {
    position: "absolute",
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    backgroundColor: "#454940",
    borderRadius: 28,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.75,
    shadowRadius: 4,
  },
  fabIcon: {
    fontSize: 24,
    color: "white",
  },
});

export default DataList;
