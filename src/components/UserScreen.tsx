// import React from "react";
// import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
// import { useRoute } from "@react-navigation/native";

// const API_BASE_URL = "http://192.168.64.139:3000"; // ✅ Use correct server IP

// const UserScreen = () => {
//   const route = useRoute();
//   const { name } = route.params as { name: string };

//   const handleSendNotification = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/send-notification`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ 
//           name, 
//           message: `📢 New Notification from ${name}!` 
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         Alert.alert("✅ Top-up Success", "Notification sent successfully!");

//         // Send notification to HomeScreen
//         fetch(`${API_BASE_URL}/api/push-notification`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ 
//             message: `${name} sent a notification...` 
//           }),
//         }).catch((err) => console.error("Push notification failed:", err));

//       } else {
//         Alert.alert("❌ Error", data.message);
//       }
//     } catch (error) {
//       console.error("Error sending notification:", error);
//       Alert.alert("❌ Error", "Failed to send notification");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Welcome, {name}! 🎉</Text>
//       <TouchableOpacity style={styles.button} onPress={handleSendNotification}>
//         <Text style={styles.buttonText}>📩 Send Notification to Everyone</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#222" },
//   title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, color: "#FFD700" },
//   button: { backgroundColor: "#FFD700", padding: 15, borderRadius: 10, marginTop: 20, width: "80%", alignItems: "center" },
//   buttonText: { fontSize: 18, fontWeight: "bold", color: "#333" },
// });

// export default UserScreen;

import React from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";

const API_BASE_URL = "https://menn-app2-o2vnana02-biruk-1s-projects.vercel.app"; 


const UserScreen = () => {
  const route = useRoute();
  const { name } = route.params as { name: string };

  const handleSendNotification = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/send-notification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          message: `📢 New Notification from ${name}!` 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("✅ Notification Success", "Notification sent successfully!");

        // Call the push notification API after the initial notification
        await fetch(`${API_BASE_URL}/api/push-notification`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            message: `${name} sent a notification...` 
          }),
        });

      } else {
        Alert.alert("❌ Error", data.message || "Failed to send notification");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      Alert.alert("❌ Error", "Failed to send notification");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {name}! 🎉</Text>
      <TouchableOpacity style={styles.button} onPress={handleSendNotification}>
        <Text style={styles.buttonText}>📩 Send Notification to Everyone</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#222" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, color: "#FFD700" },
  button: { backgroundColor: "#FFD700", padding: 15, borderRadius: 10, marginTop: 20, width: "80%", alignItems: "center" },
  buttonText: { fontSize: 18, fontWeight: "bold", color: "#333" },
});

export default UserScreen;

