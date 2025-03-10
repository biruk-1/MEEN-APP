import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, Linking, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import * as Notifications from "expo-notifications";

type NavigationProp = StackNavigationProp<RootStackParamList, "Home">;

// ✅ Make sure to use the correct API URL
const API_BASE_URL = "https://menn-app2-o2vnana02-biruk-1s-projects.vercel.app"; 
const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [users, setUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users`); // ✅ Fixed template literal issue
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        
        const data = await response.json();
        setUsers(data.map((user: { name: string }) => user.name)); 
      } catch (error) {
        console.error("Error fetching users:", error);
        Alert.alert("Error", "Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();

    // Handle deep linking from shared links
    Linking.getInitialURL().then((url) => {
      if (url && url.includes("mennapp://user/")) {
        const name = url.split("mennapp://user/")[1];
        navigation.navigate("User", { name });
      }
    });

    // Handle push notifications opening the app
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const url = response.notification.request.content.data.url;
      if (url && url.includes("mennapp://user/")) {
        const name = url.split("mennapp://user/")[1];
        navigation.navigate("User", { name });
      }
    });

    return () => subscription.remove();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌟 MennApp Home</Text>

      <Text style={styles.subtitle}>Registered Users:</Text>
      {loading ? <ActivityIndicator size="large" color="#FFD700" /> : null}

      {users.length === 0 ? (
        <Text style={styles.noUsersText}>No users found.</Text>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.userCard} onPress={() => navigation.navigate("User", { name: item })}>
              <Text style={styles.userText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#1E1E1E", alignItems: "center" },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 20, color: "#FFD700" },
  subtitle: { fontSize: 22, fontWeight: "bold", marginBottom: 10, color: "#FFF" },
  noUsersText: { fontSize: 16, color: "gray", textAlign: "center", marginVertical: 20 },
  userCard: { padding: 15, backgroundColor: "#FFD700", borderRadius: 12, marginBottom: 10, width: "90%", alignItems: "center" },
  userText: { fontSize: 18, fontWeight: "bold", color: "#333" },
});

export default HomeScreen;
