// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import HomeScreen from './screens/HomeScreen';
// import UserScreen from './components/UserScreen';

// export type RootStackParamList = {
//   Home: undefined;
//   User: { name: string };
// };

// const Stack = createStackNavigator<RootStackParamList>();

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Home">
//         <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Welcome to MennApp' }} />
//         <Stack.Screen name="User" component={UserScreen} options={({ route }) => ({ title: `User: ${route.params.name}` })} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Linking from 'expo-linking';
import HomeScreen from './screens/HomeScreen';
import UserScreen from './components/UserScreen';

const Stack = createStackNavigator();
const linking = {
  prefixes: ['mennapp://'],
  config: { screens: { User: 'user/:name' } },
};

export default function App() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="User" component={UserScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
