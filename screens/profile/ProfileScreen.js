import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, AsyncStorage, Image } from 'react-native';
import { Overlay, Icon, Avatar, Header, Button } from 'react-native-elements';
import ColorPalette from 'components/react-native-color-palette/src';
import { ScrollView } from 'react-native-gesture-handler';
import AuthContext from 'contexts/AuthContext';
import firebase from 'firebase';
import Constants from "expo-constants";
import UhereHeader from "../../components/UhereHeader"

const { manifest } = Constants;
import { backend } from 'constants/Environment';


const colorList = [
  '#f2994a', '#fe6060', '#50e14d', '#4687e9', 
  '#4f4f4f', '#bd5757', '#b030dd', '#975c5c', 
  '#f2c94c', '#38c1ec', '#6e09ef', '#cb9f9f'];
let initColor = colorList[0];


export default function ProfileScreen({navigation, route}){
  const [ username, setUsername] = React.useState("");
  const [ nickname, setNickname] = React.useState("");
  const [ avatarColor, setAvatarColor] = React.useState(initColor);
  const [ selectedAvatar, setAvatar] = React.useState();
  const [ user ] = React.useState(firebase.auth().currentUser);
  const [ showSuccessOverlay, setShowSuccessOverlay] = React.useState(false);
  const [ buttonIndex, setIndex] = React.useState(0);
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
      <View style={styles.topContainer}>
        <View style={styles.headerWrapper}>
          <TouchableOpacity style={styles.headerSection} onPress={() => navigation.goBack()}>
            <Text style={styles.headerLeftText}>Back</Text>
          </TouchableOpacity>

          <View style={styles.headerSection}>
            <Text style={styles.headerCenterText}>Profile</Text>
          </View>
          <TouchableOpacity style={styles.headerSection} onPress={() => console.log("save profile")}>
            <Text style={styles.headerRightText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.bottomContentWrapper}>
          <Avatar
            containerStyle={{
              borderWidth: 5,
              borderColor: avatarColor,
              borderStyle: "solid",
              alignSelf: 'center',
            }}
            editButton={{ name: 'mode-edit', type: 'material', color: 'white', underlayColor: 'white'}}
            rounded
            size="xlarge"
            source={selectedAvatar && selectedAvatar.uri}
            title={route.params && route.params.uri ? undefined : user.email ? user.email.substr(0, 2).toUpperCase() : ''}
          />
          <Text style={styles.displayName}>Display Name</Text>
          <Text style={styles.userName}>@username</Text>
          <View style={styles.tabView}>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity 
                style={[
                  styles.selectButton,
                  {
                    backgroundColor: buttonIndex != 0 ? "#f6f6f6" : "#ffffff",
                    borderTopLeftRadius: 10
                  }
                ]} 
                onPress={() => setIndex(0)}>
                <Text style={[
                  styles.buttonText,
                  {color: buttonIndex != 0 ? "#bdbdbd" : "#f79939"}
                ]}>Avatars</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.selectButton,
                  {
                    backgroundColor: buttonIndex != 1 ? "#f6f6f6" : "#ffffff",
                    borderTopRightRadius: 10
                  }
                ]} 
                onPress={() => setIndex(1)}>
                <Text style={[
                  styles.buttonText,
                  {color: buttonIndex != 1 ? "#bdbdbd" : "#f79939"}
                ]}>Colors</Text>
              </TouchableOpacity>
            </View>
            {(buttonIndex === 0) && renderAvatars()}
            {(buttonIndex === 1) && renderColors()}
          </View>
        </View>
      </View>
    </View>
  );

  function renderColors() {
    return (
      <View style={styles.colorsContainer}>
        <ColorPalette
          onChange={color => setAvatarColor(color)}
          defaultColor={colorList[0]}
          colors={colorList}
          title={""}
        />
      </View>
    );
  }
  function renderAvatars() {
    return (
      <View style={styles.avatarsContainer}>
        {data.map((icon, i)=> {
          return(
            <View style={styles.avatarWrapper} key={i}>
              <TouchableOpacity onPress={() => setAvatar(icon)}>
                <Image 
                  style={styles.avatarImage}
                  source={icon.uri}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          )
        })}
      </View>
    );
  }

  
}

const data = [
  {uri: require("../../assets/images/robot-dev.png")},
  {uri: require("../../assets/images/robot-dev.png")},
  {uri: require("../../assets/images/robot-dev.png")},
  {uri: require("../../assets/images/robot-dev.png")},
  {uri: require("../../assets/images/robot-dev.png")},
  {uri: require("../../assets/images/robot-dev.png")},
]

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: "#ffffff",
  },
  topContainer: {
    height: 200,
    width: "100%",
    backgroundColor: "#15cdca",
    padding: 15,
    paddingTop: 50,
  },
  bottomContainer: {
    backgroundColor: "#ffffff",
    alignItems: 'center',
    padding: 18,
  },
  headerWrapper: {
    flexDirection: "row", 
    height: 50,
  },
  headerSection: {
    flex: 1, 
    justifyContent:"center"
  },
  headerLeftText: {
    textAlign : "left", 
    color: "white", 
    fontSize: 16, 
    fontWeight: "500",
  },
  headerCenterText: {
    flex: 1,
    fontSize: 28,
    fontWeight: "600",
    color: "#ffffff",
    textAlign : "center",
  },
  headerRightText: {
    textAlign : "right", 
    color: "white", 
    fontSize: 16, 
    fontWeight: "500",
  },
  bottomContentWrapper: {
    top: -100
  },
  displayName: {
    textAlign: "center",
    fontSize: 27,
    fontWeight: "600",
  },
  userName: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    margin: 8
  },
  tabView: {
    height: 260,
    marginTop: 10,
    backgroundColor: "#f6f6f6",
    borderRadius: 10
  },
  buttonsContainer: {
    flexDirection: "row"
  },
  selectButton: {
    flex: 1,
    borderWidth: 1,
    height: 50,
    justifyContent: "center",
    borderColor: "#e8e8e8",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#f79939",
    textAlign: "center",
  },
  avatarWrapper: {
    width: "33.33%",
    height: 100,
    justifyContent: 'center',
    alignItems: "center"
  },
  selectionContainer: {
    width: 300,
  },
  avatarsContainer: {
    flex: 1,
    width: 300,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    borderWidth: 1,
    borderColor: "#e8e8e8",
  },
  colorsContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e8e8e8",
    alignContent: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 80
  }
});
