import React, { useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform, Alert } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import UserScreen from './components/UserScreen';

console.log("Running App.tsx - Current Version");

export type RootStackParamList = {
  Home: undefined;
  User: { name: string };
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;
  if (!Device.isDevice) {
    Alert.alert('Error', 'Push notifications require a physical device.');
    return;
  }
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync({
      ios: { allowAlert: true, allowSound: true, allowBadge: true },
    });
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    Alert.alert('Error', 'Permission for push notifications denied.');
    return;
  }
  try {
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Expo Push Token:', token);
    await fetch('http://localhost:3000/api/register-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, name: 'current-user' }), // Replace with actual username if needed
    });
  } catch (error) {
    console.error('Error getting Expo push token:', error);
    Alert.alert('Error', 'Failed to retrieve push token.');
  }
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  return token;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'Home' | 'User'>('Home');
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  const navigateToUser = (name: string) => {
    console.log('Navigating to UserScreen for:', name);
    setCurrentUserName(name);
    setCurrentScreen('User');
  };

  const navigateToHome = () => {
    console.log('Navigating to HomeScreen');
    setCurrentUserName(null);
    setCurrentScreen('Home');
  };

  useEffect(() => {
    console.log('App.tsx useEffect - Current Screen:', currentScreen, 'Current User:', currentUserName);

    registerForPushNotificationsAsync()
      .then(token => token && console.log('Registered push token:', token))
      .catch(error => console.error('Push notification setup failed:', error));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Foreground notification received:', notification.request.content);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification tapped:', response.notification.request.content);
      const { name, targetUser } = response.notification.request.content.data || {};
      const userToNavigate = name || targetUser;
      if (userToNavigate) {
        console.log('Notification redirecting to UserScreen for:', userToNavigate);
        navigateToUser(userToNavigate); // Stay on UserScreen
      } else {
        console.log('No valid user in notification data, staying put');
      }
    });

    return () => {
      if (notificationListener.current) Notifications.removeNotificationSubscription(notificationListener.current);
      if (responseListener.current) Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <>
      {currentScreen === 'Home' ? (
        <HomeScreen navigateToUser={navigateToUser} />
      ) : (
        <UserScreen name={currentUserName!} navigateToHome={navigateToHome} />
      )}
    </>
  );
}