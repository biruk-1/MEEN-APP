import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import UserScreen from '../components/UserScreen';
import { navigationRef } from '../services/notifications';

type RootStackParamList = {
  Home: undefined;
  User: { name: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
        <Stack.Screen name="User" component={UserScreen} options={({ route }) => ({ title: `User: ${route.params.name}` })} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}