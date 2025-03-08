import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../App';
import axios from 'axios';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const API_BASE_URL = "http://192.168.88.139:3000"; // ✅ Use the same IP everywhere

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/users`);
        const userNames = response.data.map((user: { name: string }) => user.name);
        setUsers(userNames);
      } catch (error) {
        console.error('Error fetching users:', error);
        Alert.alert('Error', 'Failed to fetch users. Check network or server.');
      }
    };
    fetchUsers();
  }, []);

  const handleNavigate = async () => {
    if (username.trim()) {
      // ✅ Instead of making another request, check users in state
      const userExists = users.includes(username.trim().toLowerCase());

      if (userExists) {
        navigation.navigate('User', { name: username.trim() });
      } else {
        Alert.alert('Error', 'User does not exist');
      }
    } else {
      Alert.alert('Error', 'Please enter a username');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to MennApp</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter username (e.g., chala)"
        value={username}
        onChangeText={setUsername}
      />
      <Button title="Go to User Page" onPress={handleNavigate} />
      <Text style={styles.subtitle}>Available Users:</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Text style={styles.userItem} onPress={() => setUsername(item)}>
            {item}
          </Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: '#eaeaea',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#222',
    marginBottom: 25,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#555',
    marginTop: 15,
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    padding: 15,
    width: '85%',
    marginBottom: 25,
    borderRadius: 12,
    fontSize: 18,
    color: '#222',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 20,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  userList: {
    width: '100%',
  },
  userItemContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  userItem: {
    fontSize: 18,
    color: '#0056b3',
    textAlign: 'center',
  },
});

export default HomeScreen;

// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, Button, StyleSheet, FlatList, Alert } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import type { StackNavigationProp } from '@react-navigation/stack';
// import { RootStackParamList } from '../../App';
// import axios from 'axios';

// type NavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

// const API_BASE_URL = "http://192.168.88.139:3000"; // ✅ Use the same IP everywhere

// const HomeScreen = () => {
//   const navigation = useNavigation<NavigationProp>();
//   const [username, setUsername] = useState('');
//   const [users, setUsers] = useState<string[]>([]);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/api/users`);
//         const userNames = response.data.map((user: { name: string }) => user.name);
//         setUsers(userNames);
//       } catch (error) {
//         console.error('Error fetching users:', error);
//         Alert.alert('Error', 'Failed to fetch users. Check network or server.');
//       }
//     };
//     fetchUsers();
//   }, []);

//   const handleNavigate = async () => {
//     if (username.trim()) {
//       const userExists = users.includes(username.trim().toLowerCase());

//       if (userExists) {
//         navigation.navigate('User', { name: username.trim() });
//       } else {
//         Alert.alert('Error', 'User does not exist');
//       }
//     } else {
//       Alert.alert('Error', 'Please enter a username');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Welcome to MennApp</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Enter username (e.g., chala)"
//         value={username}
//         onChangeText={setUsername}
//       />
//       <Button title="Go to User Page" onPress={handleNavigate} />
//       <Text style={styles.subtitle}>Available Users:</Text>
//       <FlatList
//         data={users}
//         keyExtractor={(item) => item}
//         renderItem={({ item }) => (
//           <Text style={styles.userItem} onPress={() => setUsername(item)}>
//             {item}
//           </Text>
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 25,
//     backgroundColor: '#eaeaea',
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: '700',
//     color: '#222',
//     marginBottom: 25,
//     textAlign: 'center',
//   },
//   subtitle: {
//     fontSize: 22,
//     fontWeight: '600',
//     color: '#555',
//     marginTop: 15,
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     backgroundColor: '#fff',
//     padding: 15,
//     width: '85%',
//     marginBottom: 25,
//     borderRadius: 12,
//     fontSize: 18,
//     color: '#222',
//     alignSelf: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   button: {
//     backgroundColor: '#007bff',
//     paddingVertical: 14,
//     paddingHorizontal: 30,
//     borderRadius: 8,
//     marginBottom: 20,
//     alignSelf: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.15,
//     shadowRadius: 5,
//     elevation: 6,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   userList: {
//     width: '100%',
//   },
//   userItemContainer: {
//     backgroundColor: '#fff',
//     padding: 15,
//     marginVertical: 8,
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 4,
//   },
//   userItem: {
//     fontSize: 18,
//     color: '#0056b3',
//     textAlign: 'center',
//   },
// });

// export default HomeScreen;