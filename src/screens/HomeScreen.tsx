import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Linking, StyleSheet, ActivityIndicator } from 'react-native';
import * as Notifications from 'expo-notifications';

const API_BASE_URL = 'https://menn-app2-o2vnana02-biruk-1s-projects.vercel.app';

interface HomeScreenProps {
  navigateToUser: (name: string) => void;
}

const HomeScreen = ({ navigateToUser }: HomeScreenProps) => {
  const [users, setUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const handleUserSelection = async (name: string) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'User Selected',
          body: `You selected ${name} user`,
          data: { name },
        },
        trigger: null, // Immediate
      });
      navigateToUser(name); // Go to UserScreen and stay there
    } catch (error) {
      console.error('Error scheduling selection notification:', error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users`);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        setUsers(data.map((user: { name: string }) => user.name));
      } catch (error) {
        console.error('Error fetching users:', error);
        Alert.alert('Error', 'Failed to fetch users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();

    Linking.getInitialURL().then(url => {
      if (url && url.includes('mennapp://user/')) {
        const name = url.split('mennapp://user/')[1];
        navigateToUser(name);
      }
    });

    return () => {};
  }, [navigateToUser]);

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
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.userCard} onPress={() => handleUserSelection(item)}>
              <Text style={styles.userText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#1E1E1E', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#FFD700' },
  subtitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, color: '#FFF' },
  noUsersText: { fontSize: 16, color: 'gray', textAlign: 'center', marginVertical: 20 },
  userCard: { padding: 15, backgroundColor: '#FFD700', borderRadius: 12, marginBottom: 10, width: '90%', alignItems: 'center' },
  userText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
});

export default HomeScreen;