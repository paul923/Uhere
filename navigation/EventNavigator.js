import * as React from 'react';
import * as Font from 'expo-font';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import TabBarIcon from 'components/TabBarIcon';
import EventScreen from 'screens/event/EventScreen';
import CreateEventScreen from 'screens/event/CreateEventScreen';
import EventDetailScreenNew from 'screens/event/EventDetailScreenNew';
import EventEditScreen from 'screens/event/EventEditScreen';

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
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="Event Detail New"
        component={EventDetailScreenNew}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="Event Edit"
        component={EventEditScreen}
      />
    </Stack.Navigator>
  )
}
