import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import CreateGroupScreen from '../screens/CreateGroupScreen'
import AddFriendSelectionScreen from '../screens/AddFriendSelectionScreen'
import AddFriendByIdScreen from '../screens/AddFriendByIdScreen'
import FriendScreen from '../screens/FriendScreen'
import AddFriendsScreen from '../screens/AddFriendsScreen'
import GroupDetailScreen from '../screens/GroupDetailScreen'
import { GroupProvider } from 'contexts/GroupContext';

const Stack = createStackNavigator();

export default function FriendsTabNavigator({ navigation, route }) {

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
  }, []);

  return (
    <GroupProvider>
    <Stack.Navigator initialRouteName="Friend Screen" headerMode="none">
      <Stack.Screen
        name="Add Friend Selection"
        component={AddFriendSelectionScreen}
      />
      <Stack.Screen
        name="Create Group"
        component={CreateGroupScreen}
      />
      <Stack.Screen
        name="Add Friend By Id"
        component={AddFriendByIdScreen}
      />
      <Stack.Screen
        name="Friend Screen"
        component={FriendScreen}
      />
      <Stack.Screen
        name="Add Friend List"
        component={AddFriendsScreen}
      />
      <Stack.Screen
        name="Group Detail"
        component={GroupDetailScreen}
      />
    </Stack.Navigator>
    </GroupProvider>

  )
}
