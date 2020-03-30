import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import {Icon, Header, Avatar} from 'react-native-elements'



export default class FriendCard extends Component {

  render(){
    return (
      <View 
        style={{
          width: '90%',
          backgroundColor: "#C4C4C4",
          padding: 10,
          borderRadius: 10,
          flexDirection: "row",
        }}>
        <Avatar
          rounded
          size="large"
          avatarStyle= {{backgroundColor: 'white'}, this.props.avatarStyle}
          title= {this.props.avatarTitle}
          source= {{uri: `${this.props.avatarUrl}`}}
        />
        <View style={{marginLeft: 10, justifyContent: "center"}}>
          <Text style={{fontSize: 20, fontWeight: "bold", margin: 3}}>{this.props.displayName}</Text>
          <Text style={{ margin: 3}}>@{this.props.userId}</Text>
        </View>
      </View>
    );
  }

}


