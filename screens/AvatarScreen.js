import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Button } from 'react-native';
import { Avatar, Header } from 'react-native-elements';
import ColorPalette from '../components/react-native-color-palette/src';


const colorList = ['#9599B3', '#D47FA6', '#8A56AC', '#241332', '#B4C55B', '#52912E', '#417623', '#253E12', '#4EBDEF', '#4666E5', '#132641', '#352641'];
let initColor = colorList[0];


export default class AvatarScreen extends Component {
  state = {
    avatarColor: initColor,
    uri: 'https://img.insight.co.kr/static/2018/05/01/700/f9v32iy7li764c61kj2k.jpg'
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
          rounded
          size="xlarge"
          source={{
            uri : this.state.uri
          }} 
          onPress={()=> this.props.navigation.navigate('AvatarImages')}
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
