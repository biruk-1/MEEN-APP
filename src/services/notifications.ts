// import messaging from '@react-native-firebase/messaging';
// import * as Linking from 'expo-linking';
// import {createNavigationContainerRef } from '@react-navigation/native'
// // Set background message handler
// messaging().setBackgroundMessageHandler(async remoteMessage => {
//   console.log('Message handled in the background!', remoteMessage);
// });

// export const registerForPushNotificationsAsync = async () => {
//   if (!(await Device.isDevice)) {
//     console.log('Must use physical device for Push Notifications');
//     return null;
//   }

//   try {
//     const authStatus = await messaging().requestPermission();
//     const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//     if (!enabled) {
//       console.log('Failed to get push token: Permission denied');
//       return null;
//     }

//     const token = await messaging().getToken();
//     console.log('Raw FCM Token:', token);
//     return token; // Returns raw FCM token
//   } catch (error) {
//     console.error('Error getting FCM token:', error);
//     return null;
//   }
// };

// export const sendPushNotification = async (title: string, body: string, token: string) => {
//   const message = {
//     to: token,
//     sound: 'default',
//     title,
//     body,
//     data: { url: 'mennapp://' }, // Deep link data
//   };

//   try {
//     console.log('Notification data prepared for server:', message); // Log intent; server will send
//   } catch (error) {
//     console.error('Error preparing notification:', error);
//   }
// };

// // Handle notification response for deep linking
// messaging().onNotificationOpenedApp(remoteMessage => {
//   const url = remoteMessage.data?.url;
//   if (url) {
//     console.log('Opening URL:', url);
//     Linking.openURL(url);
//   }
// });

// messaging().getInitialNotification().then(remoteMessage => {
//   if (remoteMessage) {
//     const url = remoteMessage.data?.url;
//     if (url) {
//       console.log('Opening URL from initial notification:', url);
//       Linking.openURL(url);
//     }
//   }
// });

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import * as Linking from 'expo-linking';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const registerForPushNotificationsAsync = async () => {
  if (!Device.isDevice) {
    console.log('Must use physical device for Push Notifications');
    return null;
  }

  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    console.log('Failed to get push token: Permission denied');
    return null;
  }

  const projectId = 'menn-project'; // Your Firebase project ID
  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  console.log('Expo Push Token:', token);
  return token; // Returns full Expo token (e.g., ExponentPushToken[abc123...])
};

export const sendPushNotification = async (title: string, body: string, token: string) => {
  const message = {
    to: token,
    sound: 'default',
    title,
    body,
    data: { url: 'mennapp://' },
  };

  try {
    await Notifications.scheduleNotificationAsync({
      content: message,
      trigger: null, // Send immediately (local notification for testing)
    });
    console.log('Local notification scheduled');
  } catch (error) {
    console.error('Error sending local notification:', error);
  }
};

Notifications.addNotificationResponseReceivedListener(response => {
  const url = response.notification.request.content.data.url;
  if (url) {
    console.log('Opening URL:', url);
    Linking.openURL(url);
  }
});