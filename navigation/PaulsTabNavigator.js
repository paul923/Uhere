import * as React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import PaulTestScreen from '../screens/debug/PaulTestScreen'
import AvatarNavigator from './AvatarNavigator'
import KeyboardTestScreen from '../screens/debug/KeyboardTestScreen';
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
        name="AvatarNavigator"
        component={AvatarNavigator}
      />
      <Stack.Screen
        name="KeyboardTestScreen"
        component={KeyboardTestScreen}
      />
      <Stack.Screen
        name="LoginTestScreen"
        component={LoginTestScreen}
      />
      <Stack.Screen
        name="RegisterTestScreen"
        component={RegisterTestScreen}
      />
      <Stack.Screen
        name="FriendsTestScreen"
        component={AddFriendsScreen}
      />

    </Stack.Navigator>
  )
}
