import * as React from 'react';
import * as Font from 'expo-font';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import TabBarIcon from 'components/TabBarIcon';
import NotificationScreen from 'screens/notification/NotificationScreen';

const Stack = createStackNavigator();

export default function NotificationNavigator({ navigation, route }) {

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
  }, []);

  return (
    <Stack.Navigator initialRouteName="Notification" headerMode="none">
      <Stack.Screen
        name="Notification"
        component={NotificationScreen}
      />
    </Stack.Navigator>
  )
}
