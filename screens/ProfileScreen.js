import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, AsyncStorage } from 'react-native';
import { Overlay, Icon, Avatar, Header, Button } from 'react-native-elements';
import ColorPalette from '../components/react-native-color-palette/src';
import { ScrollView } from 'react-native-gesture-handler';
import AuthContext from '../contexts/AuthContext';
import firebase from 'firebase';


const colorList = ['#9599B3', '#D47FA6', '#8A56AC', '#241332', '#B4C55B', '#52912E', '#417623', '#253E12', '#4EBDEF', '#4666E5', '#132641', '#352641'];
let initColor = colorList[0];


export default function ProfileScreen({navigation, route}){
  const [ username, setUsername] = React.useState("");
  const [ nickname, setNickname] = React.useState("");
  const [ avatarColor, setAvatarColor] = React.useState(initColor);
  const [ user ] = React.useState(firebase.auth().currentUser);
  const [ showSuccessOverlay, setShowSuccessOverlay] = React.useState(false);
  const { skipProfile } = React.useContext(AuthContext);



  React.useEffect(() => {
    async function checkIfSkip() {
      try {
        //TODO: Check Database instead of AsyncStorage
        let skipProfileFlag = await AsyncStorage.getItem('skipProfile') === 'true' ? true : false;
        if (skipProfileFlag){
          console.log("skipProfile");
          skipProfile();
        }
      } catch (e) {
      }
    }
    checkIfSkip();
  }, [showSuccessOverlay]);

  function setProfile(){
    setShowSuccessOverlay(true)
    setTimeout(() => {skipProfile(); AsyncStorage.setItem('skipProfile', 'true')}, 3000)
  }

  return (
    <View style={styles.container}>
      <Header
        centerComponent={{text: 'Set Profile', style: {color: 'white', fontSize: 25, fontWeight: 'bold'}}}
        rightComponent={<Icon name="chevron-right" color='#fff' onPress={setProfile}/>}
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
