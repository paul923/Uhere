import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, CheckBox } from 'react-native';
import {Icon, Header, Avatar, ListItem} from 'react-native-elements'




export default class FriendCard extends Component {
  render(){
    const {...props} = this.props
    return (
        <ListItem
          title={this.props.displayName}
          subtitle={`@${this.props.userId}`}
          titleStyle={{fontSize: 20, fontWeight: "bold"}}
          leftAvatar={{
            rounded: true,
            size: 60,
            title: `${this.props.avatarTitle}`,
            source: {uri: `${this.props.avatarUrl}`}
          }}
          containerStyle={{
            backgroundColor: '#C4C4C4',
            borderRadius: 10,
            marginVertical: 7,
          }}
          bottomDivider
          {...this.props}
        />
    );
  }

}


