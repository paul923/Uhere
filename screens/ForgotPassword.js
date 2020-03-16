import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Button } from 'react-native';
import { Avatar } from 'react-native-elements';
import ColorPalette from 'react-native-color-palette';



export default class ForgotPassword extends Component {
  state = {
    avatarColor: "#ffffff"
  }


  render() {
    return (
      <View>
        <Text>Forgot Password Screen</Text>
        <Button
          title="Go to Details... again"
          onPress={() => this.props.navigation.push('Forgot Password')}
        />
        <Avatar
          containerStyle={{ borderWidth: 10, borderColor: this.state.avatarColor, borderStyle: "solid" }}
          rounded
          size="xlarge"
          title="TS" />

        <ColorPalette
          onChange={color => this.setState({ avatarColor: color })}
          defaultColor={'#C0392B'}
          colors={['#C0392B', '#E74C3C', '#9B59B6', '#8E44AD', '#2980B9']}
          title={"Color Palette:"}
        />

      </View>
    );
  }
}
