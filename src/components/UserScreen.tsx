import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';

const API_BASE_URL = 'https://menn-app2-o2vnana02-biruk-1s-projects.vercel.app';

interface UserScreenProps {
  name: string;
  navigateToHome: () => void;
}

const UserScreen = ({ name, navigateToHome }: UserScreenProps) => {
  const [targetUser, setTargetUser] = useState('');
  const [timeInSeconds, setTimeInSeconds] = useState('');

  const handleSendNotification = async () => {
    if (!targetUser) {
      Alert.alert('Error', 'Please enter a target username.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/send-notification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: name,
          targetUser,
          message: `${name} sent you a notification!`,
          timeInSeconds: 0,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('✅ Success', `Notification sent to ${targetUser}!`);
      } else {
        Alert.alert('❌ Error', data.message || 'Failed to send notification');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      Alert.alert('❌ Error', 'Failed to send notification');
    }
  };

  const handleSetReminder = async () => {
    const seconds = parseInt(timeInSeconds, 10);
    if (!targetUser || isNaN(seconds) || seconds <= 0) {
      Alert.alert('Error', 'Please enter a valid username and time in seconds.');
      return;
    }

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Reminder Set',
          body: `Reminder for ${targetUser} set by ${name}!`,
          data: { name: targetUser },
        },
        trigger: { seconds },
      });

      const response = await fetch(`${API_BASE_URL}/api/send-notification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: name,
          targetUser,
          message: `${name} has set a reminder for you!`,
          timeInSeconds: seconds,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('✅ Success', `Reminder set for ${targetUser} in ${seconds} seconds!`);
      } else {
        Alert.alert('❌ Error', data.message || 'Failed to set reminder');
      }
    } catch (error) {
      console.error('Error setting reminder:', error);
      Alert.alert('❌ Error', 'Failed to set reminder');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {name}! 🎉</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter target username"
        placeholderTextColor="#999"
        value={targetUser}
        onChangeText={setTargetUser}
      />
      <TextInput
        style={styles.input}
        placeholder="Time in seconds (for reminder)"
        placeholderTextColor="#999"
        value={timeInSeconds}
        onChangeText={setTimeInSeconds}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={handleSendNotification}>
        <Text style={styles.buttonText}>Send Notification</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleSetReminder}>
        <Text style={styles.buttonText}>Set Reminder</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={navigateToHome}>
        <Text style={styles.buttonText}>Go to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#222' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#FFD700' },
  input: { 
    width: '80%', 
    padding: 10, 
    marginVertical: 10, 
    backgroundColor: '#333', 
    color: '#FFF', 
    borderRadius: 8, 
    fontSize: 16 
  },
  button: { 
    backgroundColor: '#FFD700', 
    padding: 15, 
    borderRadius: 10, 
    marginTop: 20, 
    width: '80%', 
    alignItems: 'center' 
  },
  buttonText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
});

export default UserScreen;