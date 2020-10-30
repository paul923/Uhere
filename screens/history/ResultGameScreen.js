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
import { updatePenaltyUser } from '../../api/event';

const countData = [
  {
    Nickname: "3",
    AvatarURI : "avatar-croco",
  },
  {
    Nickname: "2",
    AvatarURI : "avatar-bird",
  },
  {
    Nickname: "1",
    AvatarURI : "avatar-elephant",
  },
];

export default function ResultGameScreen({navigation, route}){
  const [ stopFlag, setStopFlag ] = React.useState(false);
  const [ pressedFlag, setPressedFlag ] = React.useState(false);
  const [ intervalId, setIntervalId ] = React.useState();
  const [ avatarHolder, setAvatarHolder ] = React.useState(null);
  const [ pickedUser, setPickedUser ] = React.useState(null);
  const [ userList, setUserList ] = React.useState(route && route.params);
  
  React.useEffect(() => {
    let index = 0;
    const id = setInterval(() => {
      setAvatarHolder(userList[index]);
      index = index + 1;
      if(index == userList.length) {
        index = 0;
      }
    }, 100)
    setIntervalId(id);
    pickRandomUser();
    // Random Image
    // const interval = setInterval(() => {
    //   let random = Math.floor(Math.random() * userList.length)
    //   setPickedUser(userList[random]);
    // }, 100)
    return () => clearInterval(id)
  }, []);

  async function updatePenaltyUserToDB(){
    let responseJson = await updatePenaltyUser(pickedUser.EventId, pickedUser.UserId);
    console.log(responseJson)
  }

  function pickRandomUser() {
    let random = Math.floor(Math.random() * userList.length)
    setPickedUser(userList[random]);
  }

  function countInterval() {
    let countIndex = 1;
    const countInterval = setInterval(() => {
      if(countIndex == countData.length) {
        setStopFlag(true);
        clearInterval(countInterval);
      }
      setAvatarHolder(countData[countIndex]);
      countIndex = countIndex + 1;
    }, 1000)
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Avatar
          size='large'
          rounded
          imageProps={{
            resizeMode: 'contain',
            style: {
              width: 50,
              alignItems: 'center',
              alignSelf: 'center',
              tintColor: 'white'
            },
          }}
          containerStyle={{
            alignSelf: 'center',
            alignItems: 'center',
            marginVertical: 10,
            backgroundColor: '#FA6969'
          }}
          placeholderStyle={{backgroundColor: 'transparent'}}
          source={require('../../assets/images/miscs/penalty.png')}
        />
        <Text style={styles.findOutText}>Let's find out</Text>
        <Text>Press Stop and it will stop after 3 sec</Text>
      </View>
      <View style={styles.gameContainer}>
        <View style={styles.avatarHolderContainer}>
          <Avatar
            overlayContainerStyle={styles.avatarStyle}
            size={130}
            source={stopFlag ? getAvatarImage(pickedUser.AvatarURI) : (avatarHolder ? getAvatarImage(avatarHolder.AvatarURI) : getAvatarImage("uhere"))}
            imageProps= {{
              style: {
                tintColor: stopFlag ? pickedUser.AvatarColor : (avatarHolder && avatarHolder.AvatarColor)
              }
            }}
          />
          <Text style={styles.pickedUserName}>{stopFlag ? pickedUser.Nickname : (avatarHolder ? avatarHolder.Nickname : "No user")}</Text>
        </View>
        {
          stopFlag &&
          <View style={styles.resultMessageContainer}>
            <Text style={styles.resultMessageText}>Everyone will be rewarded PENALTY from 
              {<Text style={{fontWeight: 'bold'}}> {pickedUser.Nickname}</Text>}.
            </Text>
            <Text>Don't be late next time!</Text>
          </View>
        }
      </View>
      <View style={styles.buttonContainer}>
        {
          stopFlag ? 
          <Button
            title="DONE"
            buttonStyle={styles.buttonStyle}
            onPress={() => {
              navigation.navigate('HistoryScreen');
            }}
          /> 
          :
          <Button
            title="STOP"
            onPress={() => {
              clearInterval(intervalId);
              countInterval();
              setPressedFlag(true);
              setAvatarHolder(countData[0])
              updatePenaltyUserToDB()
            }}
            disabled={pressedFlag}
            titleStyle={{fontWeight: 'bold'}}
            buttonStyle={styles.buttonStyle}
          />
        }
      </View>
    </View>
  );

  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: "#EDEDED",
  },
  headerContainer: {
    flex: 5,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 15
  },
  buttonContainer: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  gameContainer: {
    flex: 8,
    backgroundColor: "#ffffff",
    justifyContent: 'center',
    marginHorizontal: 24,
    padding: 15,
    borderRadius: 10
  },
  buttonStyle: {
    width: 89,
    height: 80,
    borderRadius: 25,
    backgroundColor: '#15CDCA'
  },
  avatarStyle: {
    borderRadius: 20,
  },
  avatarHolderContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems :'center',
  },
  resultMessageContainer: {
    flex: 1, 
    alignItems : 'center'
  },
  pickedUserName:{
    fontSize: 25, 
    marginVertical: 10
  },
  resultMessageText: {
    textAlign: 'center'
  },
  findOutText: {
    fontSize: 25, 
    color: '#15cdca', 
    fontWeight: 'bold',
    marginVertical: 3
  }
});
