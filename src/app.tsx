// import React, { useEffect } from "react";
// import { NavigationContainer, LinkingOptions } from "@react-navigation/native";
// import { createStackNavigator } from "@react-navigation/stack";
// import * as Notifications from "expo-notifications";
// import * as Device from "expo-device";
// import { Platform } from "react-native";
// import HomeScreen from "./screens/HomeScreen";
// import UserScreen from "./components/UserScreen";

// export type RootStackParamList = {
//   Home: undefined;
//   User: { name: string };
// };

// const Stack = createStackNavigator<RootStackParamList>();

// const API_BASE_URL = "http://192.168.88.139:3000"; // Replace with ngrok URL if needed

// const linking: LinkingOptions<RootStackParamList> = {
//   prefixes: ["mennapp://"],
//   config: {
//     screens: {
//       Home: "home",
//       User: "user/:name",
//     },
//   },
// };

// async function registerForPushNotificationsAsync() {
//   let token;
//   if (Device.isDevice) {
//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== "granted") {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus !== "granted") {
//       console.log("Failed to get push token!");
//       return;
//     }
//     token = (await Notifications.getExpoPushTokenAsync()).data;
//     console.log("Expo Push Token:", token);

//     await fetch(`${API_BASE_URL}/api/register-token`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ token }),
//     });
//   } else {
//     console.log("Must use physical device for Push Notifications");
//   }

//   if (Platform.OS === "android") {
//     Notifications.setNotificationChannelAsync("default", {
//       name: "default",
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: "#FF231F7C",
//     });
//   }

//   return token;
// }

// export default function App() {
//   useEffect(() => {
//     registerForPushNotificationsAsync().then((token) =>
//       console.log("Push token registered:", token)
//     );

//     const subscription = Notifications.addNotificationReceivedListener((notification) => {
//       console.log("Notification received:", notification);
//     });

//     const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
//       console.log("Notification tapped:", response);
//     });

//     return () => {
//       subscription.remove();
//       responseSubscription.remove();
//     };
//   }, []);

//   return (
//     <NavigationContainer linking={linking}>
//       <Stack.Navigator initialRouteName="Home">
//         <Stack.Screen name="Home" component={HomeScreen} options={{ title: "MennApp Home" }} />
//         <Stack.Screen name="User" component={UserScreen} options={({ route }) => ({ title: route.params.name })} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

import React, { useEffect } from "react";
import { NavigationContainer, LinkingOptions } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import HomeScreen from "./screens/HomeScreen";
import UserScreen from "./components/UserScreen";

// Firebase setup
import { getMessaging, getToken } from "firebase/messaging";
import { initializeApp } from "firebase/app";

// Your Firebase config (replace with your actual values)
const firebaseConfig = {
  apiKey: "AIzaSyDs0JYE2iHpXQRSjvg_FavpghvysJgIEuU",
  authDomain: "menn-project.firebaseapp.com",
  projectId: "menn-project",
  storageBucket: "menn-project.firebasestorage.app",
  messagingSenderId: "153495487060",
  appId: "1:153495487060:web:134cda431a6d18a34823c1",
  measurementId: "G-WPVEVKHRBN",
};

initializeApp(firebaseConfig);

export type RootStackParamList = {
  Home: undefined;
  User: { name: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const API_BASE_URL = "http://192.168.64.139:3000"; // Replace with ngrok URL if needed

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ["mennapp://"],
  config: {
    screens: {
      Home: "home",
      User: "user/:name",
    },
  },
};

async function registerForPushNotificationsAsync() {
  let token;

  // Check if the device is physical, otherwise return early
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // If permission not granted, ask the user for permission
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Failed to get push token!");
      return;
    }

    // Register the device for push notifications using Expo
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Expo Push Token:", token);

    // Send the token to your backend to store it and associate with the user
    await fetch(`${API_BASE_URL}/api/register-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    // Fetch the FCM token using Firebase SDK
    const messaging = getMessaging();
    const fcmToken = await getToken(messaging, { vapidKey: "YOUR_VAPID_KEY" });

    if (fcmToken) {
      console.log("Firebase Cloud Messaging Token:", fcmToken);
    } else {
      console.log("Failed to get FCM token");
    }

  } else {
    console.log("Must use physical device for Push Notifications");
  }

  // Set notification channel for Android
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

export default function App() {
  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      console.log("Push token registered:", token)
    );

    const subscription = Notifications.addNotificationReceivedListener((notification) => {
      console.log("Notification received:", notification);
    });

    const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("Notification tapped:", response);
    });

    return () => {
      subscription.remove();
      responseSubscription.remove();
    };
  }, []);

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "MennApp Home" }} />
        <Stack.Screen name="User" component={UserScreen} options={({ route }) => ({ title: route.params.name })} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
