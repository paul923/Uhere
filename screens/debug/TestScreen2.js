import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button, Input, ListItem, Avatar } from 'react-native-elements'

//import AvatarScreen from '../AvatarScreen'
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import HistoryCard from '../../components/HistoryCard';
import UhereHeader from '../../components/UhereHeader';

import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import UhereSideMenu from '../../components/UhereSideMenu';
import ProfileMenuContent from '../../components/ProfileMenuContent'
import EventMenuContent from '../../components/EventMenuContent'

export default function TestScreen2({navigation}) {
  // drawerRef for side menu button
  const drawerRef = React.useRef(null);

  return (
    <UhereSideMenu
      drawerRef = {drawerRef}
      data = {
        <ProfileMenuContent
          navigation={navigation}
          //TODO: remove user data props (user object from components)
          userData={host}
        />

        // <EventMenuContent
        //   eventTitle="Event Title Goes Here"
        //   membersData= {data}
        //   hostData= {host}
        // />
      }
    >
      <View style={styles.container}>
        <UhereHeader
          showSideMenu
          showBackButton
          onPressBackButton={() => navigation.goBack()}
          onPressSideMenu={() => drawerRef.current.openDrawer()}
        />
        <HistoryCard onPress={() => alert("pressed!")}/>
      </View>
    </UhereSideMenu>
  )
}

const data = [
  {UserId: "1", Nickname: "User Nickname 1", AvatarColor: "#ff0000", IsHost: 0},
  {UserId: "2", Nickname: "User Nickname 2", AvatarColor: "#ff00ff", IsHost: 1},
  {UserId: "3", Nickname: "User Nickname 3", AvatarColor: "#00ff00", IsHost: 0},
  {UserId: "4", Nickname: "User Nickname 4", AvatarColor: "#ccff33", IsHost: 0},
  {UserId: "5", Nickname: "User Nickname 55", AvatarColor: "#000099", IsHost: 0},
  {UserId: "6", Nickname: "User Nickname 666", AvatarColor: "#800000", IsHost: 0},
]

const host = {
  UserId: "2", 
  Username: "Crescent1234",
  Nickname: "User Nickname 2", 
  AvatarColor: "#ff00ff", 
  IsHost: 1
}

const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: "center",
    },
});
