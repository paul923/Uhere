import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, AsyncStorage } from 'react-native';
import { Overlay, Icon, Avatar, Header, Button } from 'react-native-elements';
import ColorPalette from 'components/react-native-color-palette/src';
import { ScrollView } from 'react-native-gesture-handler';
import AuthContext from 'contexts/AuthContext';
import firebase from 'firebase';
import Constants from "expo-constants";

const { manifest } = Constants;
import { backend } from 'constants/Environment';
const colorList = ['#9599B3', '#D47FA6', '#8A56AC', '#241332', '#B4C55B', '#52912E', '#417623', '#253E12', '#4EBDEF', '#4666E5', '#132641', '#352641'];
let initColor = colorList[0];


export default function ProfileScreen({navigation, route}){
  const [ username, setUsername] = React.useState("");
  const [ nickname, setNickname] = React.useState("");
  const [ avatarColor, setAvatarColor] = React.useState(initColor);
  const [ user ] = React.useState(firebase.auth().currentUser);
  const [ showSuccessOverlay, setShowSuccessOverlay] = React.useState(false);
  const { skipProfile } = React.useContext(AuthContext);



  async function register(){
    let user = {
      UserId: firebase.auth().currentUser.uid,
      Username: username,
      Nickname: nickname,
      AvatarURI: route.params && route.params.uri ? route.params.uri : undefined,
      AvatarColor: avatarColor
    };

    let response = await fetch(`http://${backend}:3000/users`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user,
      }),
    });
    let responseJson = await response.json();
    if (responseJson.status === 200){
      setShowSuccessOverlay(true)
      setTimeout(() => {skipProfile();}, 2000)
    }
  }

  return (
    <View style={styles.container}>
      <Header
        centerComponent={{text: 'Set Profile', style: {color: 'white', fontSize: 25, fontWeight: 'bold'}}}
        rightComponent={<Icon name="chevron-right" color='#fff' onPress={register}/>}
        containerStyle={{
          backgroundColor: 'transparent',
          borderBottomWidth: 0
        }}
      />
      <Overlay
        isVisible={showSuccessOverlay}
        overlayBackgroundColor="white"
        fullScreen
      >
        <View style={styles.successContainer}>
          <Icon name="check" size={100}/>
          <Text>GOOD</Text>
        </View>
      </Overlay>
      <ScrollView
        centerContent
        contentContainerStyle={{
          alignItems: 'center',
          padding: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Avatar
          containerStyle={{
            borderWidth: 15,
            borderColor: avatarColor,
            borderStyle: "solid",
            alignSelf: 'center',
            margin: 10
           }}
          showEditButton
          editButton={{ name: 'mode-edit', type: 'material', color: 'white', underlayColor: 'white'}}
          onEditPress={()=> navigation.navigate('AvatarImages', {
            initial: user.email ? user.email.substr(0, 2).toUpperCase() : ''
          })}
          rounded
          size="xlarge"
          source={route.params && route.params.uri && {
              uri: route.params.uri
          }}
          title={route.params && route.params.uri ? undefined : user.email ? user.email.substr(0, 2).toUpperCase() : ''}
        />
        <ColorPalette
          onChange={color => setAvatarColor(color)}
          defaultColor={colorList[0]}
          colors={colorList}
          title={""}
        />
        <View style={styles.bodyContainer}>
          <View style={styles.inputContainer}>
            <View style={styles.inputView}>
              <TextInput
                style={styles.inputText}
                placeholderTextColor="#003f5c"
                value={username}
                onChangeText={text => setUsername(text)}
                placeholder='Type Your Username'
              />
            </View>
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.inputView}>
              <TextInput
                style={styles.inputText}
                placeholderTextColor="#003f5c"
                value={nickname}
                onChangeText={text => setNickname(text)}
                placeholder='Type Your Nickname'
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    backgroundColor: '#003f5c',
    alignItems: 'center',
  },
  successContainer: {
    padding: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  bodyContainer:{
    paddingLeft: 20,
    paddingRight: 20,
    width: '100%',
    alignItems: 'center'
  },

  inputView: {
    backgroundColor: "#465881",
    borderRadius: 15,
    height: 50,
    marginBottom: 15,
    justifyContent: "center",
    padding: 20
  },

  inputText: {
    height: 50,
    color: 'white'
  },

  inputContainer: {
    width: "100%"
  },
});
