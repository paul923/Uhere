import * as React from 'react';
import * as Font from 'expo-font';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import TabBarIcon from '../components/TabBarIcon';
import EventScreen from '../screens/EventScreen';
import FriendScreen from '../screens/FriendScreen';
import JayTestScreen from '../screens/debug/JayTestScreen';
import JustinTestScreen from '../screens/debug/JustinTestScreen';
import PaulTestScreen from '../screens/debug/PaulTestScreen';
const BottomTab = createBottomTabNavigator();

export default function MainAppNavigator({ navigation, route }) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return (
    <BottomTab.Navigator initialRouteName="Event">
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
        component={EventScreen}
        options={{
          title: 'Event',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-calendar" />,
          headerMode: 'none'
        }}
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
        component={PaulTestScreen}
        options={{
          title: 'Paul',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-calendar" />,
          headerMode: 'none'
        }}
      />
    </BottomTab.Navigator>
  )
}
