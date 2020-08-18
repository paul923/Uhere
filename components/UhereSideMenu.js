import * as React from 'react';
import { formatDate, formatTime, convertDateToLocalTimezone } from "../utils/date";
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, Divider, Icon, Button, Image, Avatar } from 'react-native-elements';
import { backend } from '../constants/Environment';
import firebase from 'firebase';
import { TouchableHighlight } from 'react-native-gesture-handler';
import FriendTile from './FriendTile'
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';

export default function UhereSideMenu(props) {
  
  function menuContent() {
    return (
      <View style={styles.container}>
        <Text>{props.data}</Text>
      </View>
    )
  }

  return (
    <DrawerLayout
      ref={props.drawerRef}
      renderNavigationView={menuContent}
      drawerWidth={250}
      drawerPosition={DrawerLayout.positions.Right}
      drawerType='front'
    >
      {props.children}
    </DrawerLayout>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    justifyContent: "center"
  },
});
