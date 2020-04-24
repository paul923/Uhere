import * as React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';
import {Icon, Header, Avatar, Input, Button, ListItem, SearchBar} from 'react-native-elements'

import { getUserByUsername, getUserByUid } from '../API/FriendAPI'

import firebase from 'firebase';



export default function AddFriendByIdScreen({ navigation, route }) {

  const [searchId, setSearchId] = React.useState("");
  const [currentUserId, setCurrentUserId] = React.useState("");
  const [resultUserId, setResultUserId] = React.useState("");

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    fetchCurrentUser();
  }, []);

  
  async function fetchUserByUsername() {
    let resultUser = await getUserByUsername(searchId);
    setResultUserId(resultUser.Nickname)
  }

  async function fetchCurrentUser() {
    let resultUser = await getUserByUid(firebase.auth().currentUser.uid);
    setCurrentUserId(resultUser.Username)
  }

  return (
    <View style={styles.container}>
      <Header
        leftComponent={
          <Icon
            name="arrow-left"
            type="entypo"
            color= "white"
            size={30}
            underlayColor= "transparent"
            onPress={()=> navigation.goBack()}
          />
        }
        containerStyle={{zIndex:200}}
        centerComponent={{ text: 'FRIENDS', style: { color: '#fff', fontSize: 20 } }}
        statusBarProps={{translucent: true}}
      />
      <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
        <View style={styles.contentContainer}>
          <View style={styles.searchContainer}>
            <Text>User ID</Text>
            <TextInput
              style={{borderBottomWidth: 1, height: 30, color: 'black'}}
              value={searchId}
              onChangeText={(text)=> setSearchId(text)}
              onSubmitEditing={fetchUserByUsername}
            />
          </View>
          <Button
            title="Search"
            onPress={fetchUserByUsername}
          />
          <View style={styles.searchResultContainer}>
            <Text>Search Result (User Nickname): {resultUserId}</Text>
          </View>
          <View style={styles.myIdContainer}>
            <Text style={{marginHorizontal: 5, fontWeight: 'bold', fontSize: 18}}>My ID</Text>
            <Text style={{marginHorizontal: 5, fontWeight: 'bold', fontSize: 15}}>{currentUserId}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20
  },
  searchContainer: {
    marginVertical: 30,
  },
  searchResultContainer: {
    marginVertical: 50,
    height: 100,
    borderWidth: 1
  },
  myIdContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
})
