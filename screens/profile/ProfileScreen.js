import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { Avatar, Header, Button, Icon, Input } from 'react-native-elements';
import { SafeAreaView } from 'react-native';
import { getUserByUsername } from '../../api/user'
import { formatUsername } from '../../utils/user'
import UhereHeader from '../../components/UhereHeader';
import { ScrollView } from 'react-native-gesture-handler';



export default function ProfileSceen({navigation}) {
  const [ username, setUsername] = React.useState("");
  const [ nickname, setNickname] = React.useState("");
  const [ checkFlag, setCheckFlag] = React.useState(false);

  async function checkUsername() {
    // Input validation
    if (isEmpty(username) || username.indexOf(' ') >= 0) {
      alert("Invalid input")
    } else {
      let formatString = formatUsername(username)
      setUsername(formatString);
      let result = await getUserByUsername(formatString);
      if (result) {
        alert("Not available username")
      } else {
        setCheckFlag(true)
        alert("Available Username")
      }
    }
  }

  function navigateAvatarScreen() {
    navigation.navigate("AvatarImages", {Nickname: nickname, Username: username})
  }

  function isEmpty(name) {
    return !name || name.trim().length === 0
  }

  return (
    <View style={styles.container}>
      <UhereHeader
        title="Sign Up"
        titleStyle={styles.headerTitleStyle}
      />
      <ScrollView style={styles.contentWrapper}
        centerContent
        contentContainerStyle={styles.contentContainerStyle}
      >
        <Input 
          placeholder="Display Name"
          onChangeText={value => {
            setNickname(value);
          }}
          style={{height: 50}}
          containerStyle={styles.inputStyle} 
          inputContainerStyle={{borderBottomWidth:0}}
        />
        <Input
          placeholder="ID"
          value={username}
          autoCapitalize="none"
          onChangeText={value => {
            setUsername(value);
            setCheckFlag(false);
          }}
          style={{height: 50}}
          containerStyle={styles.inputStyle} 
          inputContainerStyle={{borderBottomWidth:0}}
          rightIcon={
            <TouchableOpacity 
              style={styles.checkContainerStyle} 
              hitSlop={{top: 20, bottom: 20, left: 30, right: 30}}
              onPress={()=> checkUsername()}
            >
              <Text style={styles.checkText}>Check</Text>
            </TouchableOpacity>
          }
        />
        <View><Text style={{color:"grey"}}>Your friends will be able to add you with your ID</Text></View>
        <View style={{height: 100}}></View>
        <Button
          title="Confirm"
          containerStyle={styles.buttonContainerStyle}
          buttonStyle={styles.buttonStyle}
          onPress={() => {
            if (!checkFlag) {
              alert("Please check your ID again")
            } else if (isEmpty(nickname)) {
              alert("Please fill out nickname")
            } else {
              navigateAvatarScreen()
            }
          }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentWrapper: {
    flex: 1,
  },
  headerTitleStyle: {
    fontSize: 20, 
    fontWeight: "bold"
  },
  contentContainerStyle: {
    flexGrow:1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15
  },
  inputStyle: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#E8E8E8",
    height: 50,
    backgroundColor: "#F6F6F6",
    margin: 10,
  },
  checkText: {
    color: "#15CDCA",
    fontWeight: '600'
  },
  checkContainerStyle: {
    padding: 4
  },
  buttonContainerStyle: {
    width: '100%',
    borderRadius: 100,
  },
  buttonStyle: {
    padding: 13, backgroundColor: '#15CDCA'
  }
});
