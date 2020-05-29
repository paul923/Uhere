import * as React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import JustinTestScreen from '../screens/debug/JustinTestScreen'
import DatabaseTestScreen from '../screens/debug/DatabaseTestScreen';
import SocketTestScreen from '../screens/debug/SocketTestScreen';
import RouletteTestScreen from '../screens/debug/RouletteTestScreen';

const Stack = createStackNavigator();

export default function JustinTabNavigator({ navigation, route }) {
  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
  }, []);
  return (
    <Stack.Navigator initialRouteName="JustinTestScreen" headerMode="none">
      <Stack.Screen
        name="JustinTestScreen"
        component={JustinTestScreen}
      />
      <Stack.Screen
        name="DatabaseTestScreen"
        component={DatabaseTestScreen}
      />
      <Stack.Screen
        name="SocketTestScreen"
        component={SocketTestScreen}
      />
      <Stack.Screen
        name="RouletteTestScreen"
        component={RouletteTestScreen}
      />
    </Stack.Navigator>
  )
}
