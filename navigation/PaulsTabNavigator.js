import * as React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import PaulTestScreen from '../screens/debug/PaulTestScreen'
import ProfileScreen from '../screens/profile/ProfileScreen'
import TestScreen2 from '../screens/debug/TestScreen2';
import DrawerLayoutScreen from '../screens/debug/DrawerLayoutScreen';
import LoginTestScreen from '../screens/login/LoginScreen'
import AddFriendByIdScreen from '../screens/friend/AddFriendByIdScreen'
import DetailEditPage from '../screens/event/DetailEditPage'
import AddFriendSelectionScreen from '../screens/friend/AddFriendSelectionScreen'
import NotificationPermissionScreen from '../screens/NotificationPermissionScreen'
import NotificationCardScreen from '../screens/debug/NotificationCardScreen'
import ResultGameScreen from '../screens/history/ResultGameScreen'


const Stack = createStackNavigator();

export default function PaulsTabNavigator({ navigation, route }) {
  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
  }, []);
  return (
    <Stack.Navigator initialRouteName="PaulTestScreen" headerMode="none">
      <Stack.Screen
        name="PaulTestScreen"
        component={PaulTestScreen}
      />
      <Stack.Screen
        name="Test Screen 1"
        component={DrawerLayoutScreen}
      />
      <Stack.Screen
        name="Test Screen 2"
        component={TestScreen2}
      />
      <Stack.Screen
        name="Test Screen 3"
        component={LoginTestScreen}
      />
      <Stack.Screen
        name="Test Screen 4"
        component={DetailEditPage}
      />
      <Stack.Screen
        name="Test Screen 5"
        component={AddFriendSelectionScreen}
      />
      <Stack.Screen
        name="Test Screen 6"
        component={AddFriendByIdScreen}
      />
      <Stack.Screen
        name="Profile Screen"
        component={ProfileScreen}
      />
      <Stack.Screen
        name="Notification Permission Screen"
        component={NotificationPermissionScreen}
      />
      <Stack.Screen
        name="Notification Card Screen"
        component={NotificationCardScreen}
      />
      <Stack.Screen
        name="Game Screen"
        component={ResultGameScreen}
      />

    </Stack.Navigator>
  )
}
