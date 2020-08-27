import * as React from 'react';
import { BackHandler } from 'react-native';
import * as Font from 'expo-font';
import firebase from 'firebase';
import socket from 'config/socket';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { Image } from 'react-native-elements';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import TabBarIcon from '../components/TabBarIcon';
import EventScreen from '../screens/event/EventScreen';
import EventNavigator from './EventNavigator';
import HistoryNavigator from './HistoryNavigator'
import FriendsTabNavigator from './FriendsTabNavigator';
import JayTestScreen from '../screens/debug/JayTestScreen';
import JustinTestScreen from '../screens/debug/JustinTestScreen';
import PaulTestScreen from '../screens/debug/PaulTestScreen';

import PaulsTabNavigator from './PaulsTabNavigator'
import JustinTabNavigator from './JustinTabNavigator'
import * as Permissions from 'expo-permissions';
import JaysTabNavigator from './JaysTabNavigator';


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
    case 'RegisterTestScreen':
      return false;
    case 'LoginTestScreen':
      return false;
  }

}

const LOCATION_TASK_NAME = 'background-location-task';

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    console.log(error.message);
    return;
  }
  console.log(socket.id);
  if (data) {
    const { locations } = data;
    const location = locations[0]
    if (firebase.auth().currentUser){
      let user = firebase.auth().currentUser.uid;
      let randomMovelat = Math.random() * (0.01 - (-0.01)) + (-0.01);
      let randomMovelon = Math.random() * (0.01 - (-0.01)) + (-0.01);
      let position = { latitude: location.coords.latitude += randomMovelat, longitude: location.coords.longitude += randomMovelon }
      socket.emit('position', {
          user,
          position
      })
      //console.log(user + ": " + JSON.stringify(position));
    }
  }
});

export default function MainAppNavigator({ navigation, route }) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  React.useEffect(() => {
    socket.connect();
    socket.emit('joinLobby', {userId: firebase.auth().currentUser.uid});
    console.log(socket.id);
    async function runBackgroundLocationTask() {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 5000,
        distanceInterval: 0,
      });
    }
    runBackgroundLocationTask();
  }, []);

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

  async function askNotificationPermission() {
    const { status, permissions } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    console.log(status);
  }

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    askNotificationPermission();
  }, []);

  return (
    <BottomTab.Navigator initialRouteName="Event" tabBarOptions={{
      keyboardHidesTabBar: true,
      activeTintColor: '#15cdca',
      inactiveTintColor: '#121212',
      tabStyle: {
        backgroundColor: "#f6f6f6",
      }
    }}>
      <BottomTab.Screen
        name="Friend"
        component={FriendsTabNavigator}
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
          title: 'Home',
          tabBarIcon: ({ focused, size  }) => <Image source={ require('assets/icons/home/Group11Copy.png') } style={{height:size , width:size}} resizeMode={'contain'} />,
          headerMode: 'none',
          tabBarVisible: showTab(route)
        })}
      />
      {/* Event History Screen */}
      <BottomTab.Screen
        name="History"
        component={HistoryNavigator}
        options={({ route }) => ({
          title: 'History',
          tabBarIcon: ({ focused, size  }) => <Image source={ require('assets/icons/history/HistoryIcon.png') } style={{height:size , width:size}} resizeMode={'contain'} />,
          headerMode: 'none',
          tabBarVisible: showTab(route)
        })}
      />
      {/* Test Screens */}
      <BottomTab.Screen
        name="Justin"
        component={JustinTabNavigator}
        options={{
          title: 'Justin',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-calendar" />,
          headerMode: 'none'
        }}
      />
      <BottomTab.Screen
        name="Jay"
        component={JaysTabNavigator}
        options={({ route }) => ({
          title: 'Jay',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-calendar" />,
          headerMode: 'none',
          tabBarVisible: showTab(route)
        })}
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
