import * as React from 'react';
import * as Font from 'expo-font';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import TabBarIcon from '../components/TabBarIcon';
import EventScreen from '../screens/EventScreen';
import CreateEventScreen from '../screens/CreateEventScreen';
import FilterEventScreen from '../screens/FilterEventScreen';
import EventDetailScreen from '../screens/EventDetailScreen';
const Stack = createStackNavigator();

export default function EventNavigator({ navigation, route }) {

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
  }, []);

  return (
    <Stack.Navigator initialRouteName="Event" headerMode="none">
      <Stack.Screen
        name="Event"
        component={EventScreen}
      />
      <Stack.Screen
        name="Create Event"
        component={CreateEventScreen}
      />
      <Stack.Screen
        name="Filter Event"
        component={FilterEventScreen}
      />
      <Stack.Screen
        name="Event Detail"
        component={EventDetailScreen}
      />
    </Stack.Navigator>
  )
}
