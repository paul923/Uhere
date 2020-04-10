import * as React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import PaulTestScreen from '../screens/debug/PaulTestScreen'
import AvatarNavigator from './AvatarNavigator'
import TestScreen2 from '../screens/debug/TestScreen2';
import DrawerLayoutScreen from '../screens/debug/DrawerLayoutScreen';
import LoginTestScreen from '../screens/debug/LoginTestScreen'
import RegisterTestScreen from '../screens/debug/RegisterTestScreen'
import AddFriendsScreen from '../screens/AddFriendsScreen'


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
        component={RegisterTestScreen}
      />
      <Stack.Screen
        name="Test Screen 5"
        component={AddFriendsScreen}
      />

    </Stack.Navigator>
  )
}
