// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
// import { useRoute } from '@react-navigation/native';
// import { registerForPushNotificationsAsync, sendPushNotification } from '../services/notifications';

// const API_BASE_URL = "http://192.168.88.139:3000"; // ✅ Replace localhost with your IP

// const UserScreen = () => {
//   const route = useRoute();
//   const { name } = route.params as { name: string };
//   const [rawToken, setRawToken] = useState<string | null>(null);
//   const [otherToken, setOtherToken] = useState('');

//   useEffect(() => {
//     registerForPushNotificationsAsync().then(setRawToken);
//   }, []);

//   const handleSendNotification = async () => {
//     if (rawToken && otherToken) {
//       try {
//         const response = await fetch(`${API_BASE_URL}/api/send-notification`, { // ✅ Fix localhost issue
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ name, token: otherToken }),
//         });
//         const data = await response.json();
//         if (response.ok) {
//           Alert.alert('Success', `Deep Link: ${data.deepLink}`);
//           await sendPushNotification(`Notification from ${name}`, `Check out ${data.deepLink}`, rawToken);
//         } else {
//           Alert.alert('Error', data.message);
//         }
//       } catch (error) {
//         console.error('Notification error:', error);
//         Alert.alert('Error', 'Failed to send notification');
//       }
//     } else {
//       Alert.alert('Error', 'No token available');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>This page is for {name}</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Enter another device's token"
//         value={otherToken}
//         onChangeText={setOtherToken}
//       />
//       <Button title="Send Notification" onPress={handleSendNotification} />
//       {rawToken && <Text style={styles.token}>Your Raw FCM Token: {rawToken}</Text>}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   title: { fontSize: 24, marginBottom: 20 },
//   input: { borderWidth: 1, borderColor: '#ccc', padding: 10, width: '80%', marginBottom: 20, borderRadius: 5 },
//   token: { marginTop: 10, fontSize: 12, color: 'gray', textAlign: 'center' },
// });

// export default UserScreen;

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { registerForPushNotificationsAsync, sendPushNotification } from '../services/notifications';

const API_BASE_URL = "http://192.168.88.139:3000"; // ✅ Replace with your IP

const UserScreen = () => {
  const route = useRoute();
  const { name } = route.params as { name: string };
  const [rawToken, setRawToken] = useState<string | null>(null);
  const [otherToken, setOtherToken] = useState('');

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        setRawToken(token);
      } else {
        Alert.alert('Error', 'Failed to generate FCM token');
      }
    });
  }, []);

  const handleSendNotification = async () => {
    if (rawToken && otherToken) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/send-notification`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, token: otherToken }),
        });
        const data = await response.json();
        if (response.ok) {
          Alert.alert('Success', `Deep Link: ${data.deepLink}`);
          await sendPushNotification(`Notification from ${name}`, `Check out ${data.deepLink}`, rawToken);
        } else {
          Alert.alert('Error', data.message);
        }
      } catch (error) {
        console.error('Notification error:', error);
        Alert.alert('Error', 'Failed to send notification');
      }
    } else {
      Alert.alert('Error', 'No token available');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {name}!</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter another device's token"
        placeholderTextColor="#888"
        value={otherToken}
        onChangeText={setOtherToken}
      />
      <TouchableOpacity style={styles.button} onPress={handleSendNotification}>
        <Text style={styles.buttonText}>Send Notification</Text>
      </TouchableOpacity>
      {rawToken && (
        <View style={styles.tokenContainer}>
          <Text style={styles.tokenLabel}>Your FCM Token:</Text>
          <Text style={styles.token}>{rawToken}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    padding: 12,
    width: '90%',
    marginBottom: 20,
    borderRadius: 10,
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  tokenContainer: {
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tokenLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 5,
  },
  token: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});

export default UserScreen;
// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// import { useRoute } from '@react-navigation/native';
// import { registerForPushNotificationsAsync, sendPushNotification } from '../services/notifications';

// const API_BASE_URL = "http://192.168.88.139:3000"; // ✅ Replace with your IP

// const UserScreen = () => {
//   const route = useRoute();
//   const { name } = route.params as { name: string };
//   const [rawToken, setRawToken] = useState<string | null>(null);
//   const [otherToken, setOtherToken] = useState('');

//   useEffect(() => {
//     registerForPushNotificationsAsync().then((token) => {
//       if (token) {
//         setRawToken(token);
//       } else {
//         Alert.alert('Error', 'Failed to generate FCM token');
//       }
//     });
//   }, []);

//   const handleSendNotification = async () => {
//     if (rawToken && otherToken) {
//       try {
//         const response = await fetch(`${API_BASE_URL}/api/send-notification`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ name, token: otherToken }),
//         });
//         const data = await response.json();
//         if (response.ok) {
//           Alert.alert('Success', `Deep Link: ${data.deepLink}`);
//           await sendPushNotification(`Notification from ${name}`, `Check out ${data.deepLink}`, rawToken);
//         } else {
//           Alert.alert('Error', data.message);
//         }
//       } catch (error) {
//         console.error('Notification error:', error);
//         Alert.alert('Error', 'Failed to send notification');
//       }
//     } else {
//       Alert.alert('Error', 'No token available');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Welcome, {name}!</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Enter another device's token"
//         placeholderTextColor="#888"
//         value={otherToken}
//         onChangeText={setOtherToken}
//       />
//       <TouchableOpacity style={styles.button} onPress={handleSendNotification}>
//         <Text style={styles.buttonText}>Send Notification</Text>
//       </TouchableOpacity>
//       {rawToken && (
//         <View style={styles.tokenContainer}>
//           <Text style={styles.tokenLabel}>Your FCM Token:</Text>
//           <Text style={styles.token}>{rawToken}</Text>
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//     padding: 20,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 30,
//     textAlign: 'center',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     backgroundColor: '#fff',
//     padding: 12,
//     width: '90%',
//     marginBottom: 20,
//     borderRadius: 10,
//     fontSize: 16,
//     color: '#333',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   button: {
//     backgroundColor: '#007bff',
//     paddingVertical: 12,
//     paddingHorizontal: 25,
//     borderRadius: 10,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//     textAlign: 'center',
//   },
//   tokenContainer: {
//     marginTop: 20,
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     padding: 15,
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   tokenLabel: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#555',
//     marginBottom: 5,
//   },
//   token: {
//     fontSize: 12,
//     color: '#666',
//     textAlign: 'center',
//     paddingHorizontal: 10,
//   },
// });

// export default UserScreen;