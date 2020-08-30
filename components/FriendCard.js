import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, CheckBox } from 'react-native';
import {Icon, Header, Avatar, ListItem} from 'react-native-elements'




export default class FriendCard extends Component {
  render(){
    const {...props} = this.props
    return (
        <ListItem
          title={this.props.displayName}
          titleStyle={{fontSize: 17, fontFamily: "OpenSans_400Regular", fontWeight: "700"}}
          subtitle={`@${this.props.userId}`}
          subtitleStyle={{fontSize: 12, fontFamily: "OpenSans_400Regular", fontWeight: "500"}}
          leftAvatar={this.props.avatarUrl ? {
            rounded: false,
            avatarStyle: {
              borderRadius: 15,
            },
            containerStyle: {
              borderRadius: 15,
            },
            placeholderStyle: {
              borderRadius: 15,
            },
            overlayContainerStyle: {
              overflow: 'hidden',
              borderRadius: 15,
            },
            size: 40,
            source: {uri: `${this.props.avatarUrl}`}
          } : {
            rounded: false,
            avatarStyle: {
              borderRadius: 15,
            },
            containerStyle: {
              borderRadius: 15,
            },
            placeholderStyle: {
              borderRadius: 15,
            },
            overlayContainerStyle: {
              overflow: 'hidden',
              borderRadius: 15,
            },
            size: 40,
            title: `${this.props.avatarTitle}`,
          }}

          containerStyle={{
          }}
          {...this.props}
        />
    );
  }

}
