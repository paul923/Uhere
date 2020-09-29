import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, AsyncStorage, Image } from 'react-native';
import { Overlay, Icon, Avatar, Header, Button } from 'react-native-elements';
import ColorPalette from 'components/react-native-color-palette/src';
import { ScrollView } from 'react-native-gesture-handler';
import AuthContext from 'contexts/AuthContext';
import firebase from 'firebase';
import Constants from "expo-constants";
import UhereHeader from "../../components/UhereHeader";
import { getAvatarImage, avatarData } from "../../utils/asset.js";

const { manifest } = Constants;
import { backend } from 'constants/Environment';
import { updateUser } from '../../api/user'


const colorList = [
  '#f2994a', '#fe6060', '#50e14d', '#4687e9', 
  '#4f4f4f', '#bd5757', '#b030dd', '#975c5c', 
  '#f2c94c', '#38c1ec', '#6e09ef', '#cb9f9f'];
let initColor = colorList[0];


export default function ProfileScreen({navigation, route}){
  const [ username, setUsername] = React.useState("");
  const [ nickname, setNickname] = React.useState("");
  const [ currentUser, setCurrentUser ] = React.useState();
  const [ buttonIndex, setIndex] = React.useState(0);
  const [ buttonFlag, setFlag] = React.useState(true);
  const { skipProfile, getUserInfo } = React.useContext(AuthContext);

  React.useEffect(() => {
    getUserInfo(firebase.auth().currentUser.uid).then(user => setCurrentUser(user));
  }, []);

  async function saveUser() {
    let response = await updateUser(currentUser);
    response ? alert("Saved!") : alert("Failed to save...")
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
          <TouchableOpacity style={styles.headerSection} onPress={() => {saveUser()}} disabled={buttonFlag}>
            <Text style={[styles.headerRightText, buttonFlag && {color: "#0B6968"}]}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.bottomContentWrapper}>
          <Avatar
            containerStyle={{
              borderWidth: 5,
              borderColor: currentUser && currentUser.AvatarColor,
              borderStyle: "solid",
              alignSelf: 'center',
            }}
            overlayContainerStyle= {{
              backgroundColor: 'white',
            }}
            imageProps={{
              resizeMode: 'contain',
              style: {
                width: 130,
                alignItems: 'center',
                alignSelf: 'center'
              }
            }}
            rounded
            size="xlarge"
            source={currentUser && getAvatarImage(currentUser.AvatarURI)}
            title={currentUser ? currentUser.Nickname.substr(0, 2).toUpperCase() : ''}
          />
          <Text style={styles.displayName}>{currentUser && currentUser.Nickname}</Text>
          <Text style={styles.userName}>@{currentUser && currentUser.Username}</Text>
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
          onChange={color => {
            let user = {...currentUser, AvatarColor: color}
            setCurrentUser(user);
            setFlag(false);
          }}
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
        {avatarData.map((avatar, i)=> {
          return(
            <View style={styles.avatarWrapper} key={i}>
              <TouchableOpacity onPress={() => {
                let user = {...currentUser, AvatarURI: avatar.AvatarURI}
                setCurrentUser(user);
                setFlag(false);
              }}>
                <Image 
                  style={styles.avatarImage}
                  source={getAvatarImage(avatar.AvatarURI)}
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
