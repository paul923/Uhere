import * as React from 'react';
import { BackHandler } from 'react-native';
import * as Font from 'expo-font';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import TabBarIcon from '../components/TabBarIcon';
import EventScreen from '../screens/EventScreen';
import EventNavigator from './EventNavigator';
import FriendScreen from '../screens/FriendScreen';
import JayTestScreen from '../screens/debug/JayTestScreen';
import JustinTestScreen from '../screens/debug/JustinTestScreen';
import PaulTestScreen from '../screens/debug/PaulTestScreen';

import PaulsTabNavigator from './PaulsTabNavigator'


const BottomTab = createBottomTabNavigator();

function showTab(route) {
  const routeName = route.state
    ? // Get the currently active route name in the tab navigator
      route.state.routes[route.state.index].name
    : // If state doesn't exist, we need to default to `screen` param if available, or the initial screen
      // In our case, it's "Feed" as that's the first screen inside the navigator
      route.params?.screen || 'Event';

  switch (routeName) {
    case 'Event':
      return true;
    case 'Create Event':
      return false;
    case 'Filter Event':
      return false;
    case 'FriendsTestScreen':
      return false;
  }

}

export default function MainAppNavigator({ navigation, route }) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp()
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );
  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
  }, []);

  return (
    <BottomTab.Navigator initialRouteName="Event" tabBarOptions={{keyboardHidesTabBar: true}}>
      <BottomTab.Screen
        name="Friend"
        component={FriendScreen}
        options={{
          title: 'Friend',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-person" />,
          header: null
        }}
      />
      <BottomTab.Screen
        name="Event"
        component={EventNavigator}
        options={({ route }) => ({
          title: 'Event',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-calendar" />,
          headerMode: 'none',
          tabBarVisible: showTab(route)
        })}
      />
      <BottomTab.Screen
        name="Justin"
        component={JustinTestScreen}
        options={{
          title: 'Justin',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-calendar" />,
          headerMode: 'none'
        }}
      /><BottomTab.Screen
        name="Jay"
        component={JayTestScreen}
        options={{
          title: 'Jay',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-calendar" />,
          headerMode: 'none'
        }}
      />
      <BottomTab.Screen
        name="Paul"
        component={PaulsTabNavigator}
        options={({ route }) => ({
          title: 'Paul',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-calendar" />,
          headerMode: 'none',
          tabBarVisible: showTab(route)
        })}
        
      />

    </BottomTab.Navigator>
  )
}
