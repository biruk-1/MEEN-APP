import React, { useEffect, useState, useRef } from "react";
import { NavigationContainer, LinkingOptions } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform, Alert } from "react-native";
import HomeScreen from "./screens/HomeScreen";
import UserScreen from "./components/UserScreen";
import registerNNPushToken from "native-notify"; // Corrected import

// Firebase setup
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { initializeApp } from "firebase/app";

// Your Firebase config (replace with your actual values)
const firebaseConfig = {
  apiKey: "AIzaSyDs0JYE2iHpXQRSjvg_FavpghvysJgIEuU",
  authDomain: "menn-project.firebaseapp.com",
  projectId: "menn-project",
  storageBucket: "menn-project.appspot.com",
  messagingSenderId: "153495487060",
  appId: "1:153495487060:web:134cda431a6d18a34823c1",
  measurementId: "G-WPVEVKHRBN",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

// Define navigation stack
export type RootStackParamList = {
  Home: undefined;
  User: { name: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ["mennapp://"],
  config: {
    screens: {
      Home: "home",
      User: "user/:name",
    },
  },
};

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    // Register for Expo push notifications
    registerForPushNotificationsAsync().then((token) => {
      if (token) setExpoPushToken(token);
    });

    // Fetch Firebase Cloud Messaging Token
    getToken(messaging, { vapidKey: "YOUR_VAPID_KEY" })
      .then((token) => {
        if (token) {
          console.log("FCM Token:", token);
          setFcmToken(token);
        } else {
          console.log("Failed to get FCM token");
        }
      })
      .catch((err) => console.error("FCM Token Error:", err));

    // Listen for incoming foreground notifications
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Received Notification:", notification);
      }
    );

    // Handle notification interactions (when tapped)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log("User tapped on notification:", response);
        const { name } = response.notification.request.content.data || {};
        if (name) {
          // Navigate to the corresponding screen
          console.log("Navigating to user:", name);
          Linking.openURL(`mennapp://user/${name}`);
        }
      }
    );

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // Register Native Notify Push Token (if needed)
  registerNNPushToken(28141, "ZuM0PDgb6f28h3mcubONTD");

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "MennApp Home" }} />
        <Stack.Screen
          name="User"
          component={UserScreen}
          options={({ route }) => ({ title: route.params.name })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Request push notification permissions and get Expo Push Token
async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      Alert.alert("Failed to get push token for push notifications!");
      return null;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Expo Push Token:", token);
  } else {
    Alert.alert("Must use physical device for push notifications!");
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}



// import React from 'react';
// import { NavigationContainer, LinkingOptions } from "@react-navigation/native";
// import { createStackNavigator } from "@react-navigation/stack";
// import * as Notifications from "expo-notifications";
// import * as Device from "expo-device";
// import { Platform } from "react-native";
// import HomeScreen from "./screens/HomeScreen";
// import UserScreen from "./components/UserScreen";
// import registerNNPushToken from 'native-notify'; // Corrected import

// // Firebase setup
// import { getMessaging, getToken } from "firebase/messaging";
// import { initializeApp } from "firebase/app";

// // Your Firebase config (replace with your actual values)
// const firebaseConfig = {
//   apiKey: "AIzaSyDs0JYE2iHpXQRSjvg_FavpghvysJgIEuU",
//   authDomain: "menn-project.firebaseapp.com",
//   projectId: "menn-project",
//   storageBucket: "menn-project.appspot.com",
//   messagingSenderId: "153495487060",
//   appId: "1:153495487060:web:134cda431a6d18a34823c1",
//   measurementId: "G-WPVEVKHRBN",
// };

// initializeApp(firebaseConfig);

// export type RootStackParamList = {
//   Home: undefined;
//   User: { name: string };
// };

// const Stack = createStackNavigator<RootStackParamList>();

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

//     // Register Expo push token
//     token = (await Notifications.getExpoPushTokenAsync()).data;
//     console.log("Expo Push Token:", token);

//     // Fetch the FCM token
//     const messaging = getMessaging();
//     const fcmToken = await getToken(messaging, { vapidKey: "YOUR_VAPID_KEY" });

//     if (fcmToken) {
//       console.log("Firebase Cloud Messaging Token:", fcmToken);
//     } else {
//       console.log("Failed to get FCM token");
//     }
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
//   // Register Native Notify Push Token outside of useEffect
//   registerNNPushToken(28141, 'ZuM0PDgb6f28h3mcubONTD'); // Replace with your actual App ID and Token

//   return (
//     <NavigationContainer linking={linking}>
//       <Stack.Navigator initialRouteName="Home">
//         <Stack.Screen name="Home" component={HomeScreen} options={{ title: "MennApp Home" }} />
//         <Stack.Screen name="User" component={UserScreen} options={({ route }) => ({ title: route.params.name })} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
