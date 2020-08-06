import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Avatar, Header, Button } from 'react-native-elements';
import ColorPalette from 'components/react-native-color-palette/src';

import firebase from 'firebase';


const colorList = ['#9599B3', '#D47FA6', '#8A56AC', '#241332', '#B4C55B', '#52912E', '#417623', '#253E12', '#4EBDEF', '#4666E5', '#132641', '#352641'];
let initColor = colorList[0];


export default class AvatarScreen extends Component {
  state = {
    avatarColor: initColor,
    user : firebase.auth().currentUser
  }

  componentDidUpdate(){
  }



  render() {
    return (
      <View>
        <Header
          centerComponent={{text: 'Avatar', style: {color: 'black', fontSize: 25}}}
          containerStyle={{backgroundColor: 'transparent'}}
        />
        <Avatar
          containerStyle={{
            borderWidth: 15,
            borderColor: this.state.avatarColor,
            borderStyle: "solid",
            alignSelf: 'center',
            margin: 20
           }}
          showEditButton
          editButton={{ name: 'mode-edit', type: 'material', color: 'white', underlayColor: 'white'}}
          onEditPress={()=> this.props.navigation.navigate('AvatarImages', {
            initial: this.state.user.email ? this.state.user.email.substr(0, 2).toUpperCase() : ''
          })}
          rounded
          size="xlarge"
          source={this.props.route.params && this.props.route.params.uri && {
              uri: this.props.route.params.uri
          }}
          title={this.props.route.params && this.props.route.params.uri ? undefined : this.state.user.email ? this.state.user.email.substr(0, 2).toUpperCase() : ''}
        />

        <ColorPalette
          onChange={color => this.setState({ avatarColor: color })}
          defaultColor={colorList[0]}
          colors={colorList}
          title={""}
        />

        <Button
          title="Next"
          color="grey"
        />

      </View>
    );
  }
}
