import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, CheckBox } from 'react-native';
import {Icon, Header, Avatar, ListItem} from 'react-native-elements'




export default class FriendCard extends Component {
  render(){
    const {...props} = this.props
    return (
        <ListItem
          title={this.props.displayName}
          titleStyle={{fontSize: 17, fontWeight: "bold"}}
          subtitle={`@${this.props.userId}`}
          subtitleStyle={{fontSize: 12}}
          leftAvatar={{
            rounded: true,
            size: 50,
            title: `${this.props.avatarTitle}`,
            source: {uri: `${this.props.avatarUrl}`}
          }}
          containerStyle={{
            backgroundColor: '#C4C4C4',
            borderRadius: 10,
            marginVertical: 3,
            padding: 10
          }}
          bottomDivider
          {...this.props}
        />
    );
  }

}


