import * as React from 'react';
import { StyleSheet, View, TouchableOpacity, TouchableHighlight } from 'react-native';
import { Text, Divider, Icon, Button, Image, Avatar } from 'react-native-elements';
import { backend } from '../constants/Environment';
import firebase from 'firebase';

export default function ProfileMenuContent(props) {
//TODO: retrieve current user data and populate
  return (
    <View style={styles.container}>
      <View style={styles.userContainer}>
        <Avatar
          style={[styles.avatarStyle, {borderColor: props.userData.AvatarColor}]}
        />
        <Text style={styles.displayName}>{props.userData.Nickname}</Text>
        <Text style={styles.userName}>@{props.userData.Username}</Text>
      </View>
      <View style={styles.menuContainer}>
        <View style={styles.spacer}></View>
        <View style={styles.menuList}>
          <MenuItem 
            title="PROFILE"
            menuOnPress={() => props.navigation.navigate("Profile Screen")}
          />
          <MenuItem 
            title="LOG OUT"
            menuOnPress={() => console.log("logged out!")}
          />
        </View>
      </View>
    </View>
  )
}

function MenuItem(props){
  return (
    <TouchableOpacity 
      style={styles.menuItemContainer}
      onPress={props.menuOnPress}
    >
      <Text style={styles.menuItemText}>{props.title}</Text>
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  userContainer: {
    width: '100%',
    aspectRatio: 1,
    justifyContent: 'center'
  },
  avatarStyle: {
    alignSelf: 'center',
    margin: 10,
    width: 100,
    height: 100,
    borderWidth: 4,
    borderRadius: 10,
    overflow:'hidden',
  },
  displayName: {
    fontSize: 14, 
    color: 'black', 
    textAlign: 'center',
    fontWeight: "bold",
  },
  userName: {
    fontSize: 10, 
    color: 'black', 
    textAlign: 'center'
  },
  menuContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  spacer: {
    flex: 1,
  },
  menuList: {
    flex: 2,
    justifyContent: "space-between"
  },
  menuItemText: {
    color: "#15cdca",
    fontWeight: "bold",
    fontSize: 16
  },
  menuItemContainer: {
    paddingVertical: 15,
    paddingLeft: 30,
    // backgroundColor: "#15cdca",
    borderBottomLeftRadius: 23,
    borderTopLeftRadius: 23,
    marginVertical: 2
  }
});
