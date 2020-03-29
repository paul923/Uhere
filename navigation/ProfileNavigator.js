import * as React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import AvatarImageScreen from '../screens/AvatarImageScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();

export default function ProfileNavigator({ navigation, route }) {
  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
  }, []);
  return (
    <Stack.Navigator initialRouteName="ProfileScreen" headerMode="none">
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
      />
      <Stack.Screen
        name="AvatarImages"
        component={AvatarImageScreen}
      />
    </Stack.Navigator>
  )
}
