import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import {Icon, Header, Avatar, ListItem, Badge, withBadge } from 'react-native-elements';

export default class FriendCard extends Component {

  render(){
    return (
      <ListItem
        title={this.props.displayName}
        titleStyle={{fontSize: 10, fontWeight: "bold", overflow: "hidden"}}
        leftAvatar={{
          rounded: true,
          size: 50,
          title: `${this.props.avatarTitle}`,
          source: {uri: `${this.props.avatarUrl}`}
        }}
        containerStyle={{
          backgroundColor: '#686868',
          borderRadius: 10,
          marginHorizontal: 10,
          flexDirection: "column",
          width: 90,
          minHeight: 90,
        }}
        leftElement={
          <Icon 
            type= "entypo" 
            name= "circle-with-minus"
            color= "#ff3333"
            containerStyle={{
              position: "absolute",
              right: -5,
              top: -5
            }}
            onPress={this.props.pressMinus}
          />
        }
        {...this.props}
      />
    );
  }

}


