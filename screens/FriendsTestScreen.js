import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import {Icon, Header, Avatar, Input} from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';
import FriendCard from '../components/FriendCard';



export default class FriendsScreen extends Component {

  render(){
    return (
      <View style={styles.container}>
        <Header/>
        <Input 
          placeholder="Search"
          leftIcon={{ type: 'antdesign', name: 'search1' }}
        />
        <ScrollView
          centerContent
          contentContainerStyle={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
          }}
        >
          <FriendCard
            avatarUrl= "https://upload.wikimedia.org/wikipedia/commons/b/b8/Red_rose_flower_detailed_imge.jpg"
            avatarTitle= ""
            displayName = "Justin Choi"
            userId = "Crescent9723"
          />
        </ScrollView>
      </View>
    );
  }

}

const DATA = [
  {
    displayName: "Justin Choi",
    userId : "Crescent1234",
    pictureUrl : "",
    userInitial : ""
  },
  {
    displayName: "Paul Kim",
    userId : "pk1234",
    pictureUrl : "",
    userInitial : ""
  },
  {
    displayName: "Jay Suhr",
    userId : "js1234",
    pictureUrl : "",
    userInitial : ""
  },
  {
    displayName: "Matthew Kim",
    userId : "mk1234",
    pictureUrl : "",
    userInitial : ""
  },
  {
    displayName: "JYP",
    userId : "and wondergirls",
    pictureUrl : "",
    userInitial : ""
  },
  {
    displayName: "You Hee Yeol",
    userId : "uhere",
    pictureUrl : "",
    userInitial : ""
  },
]



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent : 'center'
  },
});
