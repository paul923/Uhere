import * as React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import PaulTestScreen from '../screens/debug/PaulTestScreen'
import AvatarScreen from '../screens/AvatarScreen'
import AvatarImageScreen from '../screens/AvatarImageScreen';

const Stack = createStackNavigator();

export default function AvatarNavigator({ navigation, route }) {
  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
  }, []);
  return (
    <Stack.Navigator initialRouteName="Avatar" headerMode="none">
      <Stack.Screen
        name="AvatarScreen"
        component={AvatarScreen}
      />
      <Stack.Screen
        name="AvatarImages"
        component={AvatarImageScreen}
      />
    </Stack.Navigator>
  )
}
