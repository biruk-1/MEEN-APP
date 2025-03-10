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

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
}