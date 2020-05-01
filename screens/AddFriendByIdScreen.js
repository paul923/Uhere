import * as React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';
import {Icon, Header, Avatar, Input, Button, ListItem, SearchBar} from 'react-native-elements'

import { getUserByUsername, getUserByUid, addFriend, getUserRelationship } from '../API/FriendAPI'

import firebase from 'firebase';



export default function AddFriendByIdScreen({ navigation, route }) {

  const [searchId, setSearchId] = React.useState("");
  const [currentUser, setCurrentUser] = React.useState(null);
  const [resultUser, setResultUser] = React.useState(null);
  const [relationship, setRelationship] = React.useState(null);
  const [usersFriends, setUsersFriends] = React.useState(null);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    fetchCurrentUser();
    fetchFriendList();
  }, []);


  async function searchUserByUsername() {
    let resultUser = await getUserByUsername(searchId);
    setResultUser(resultUser);
    //checks if user is friend with searched friend
    if(resultUser !== null){
      setRelationship(usersFriends.find(user => user.Username === resultUser.Username));
    }
  }

  async function fetchCurrentUser() {
    let user = await getUserByUid(firebase.auth().currentUser.uid);
    setCurrentUser(user);
  }

  async function fetchFriendList() {
    let usersFriends = await getUserRelationship(firebase.auth().currentUser.uid);
    setUsersFriends(usersFriends);
  }


  async function addSearchedFriend() {
    let userRelationship= {
      UserId1 : currentUser.UserId,
      UserId2 : resultUser.UserId,
      Type : "Friend"
    }
    await addFriend(userRelationship);
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
        centerComponent={{ text: 'Add Friend', style: { color: '#fff', fontSize: 20 } }}
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
              onSubmitEditing={searchUserByUsername}
            />
          </View>
          <Button
            title="Search"
            onPress={searchUserByUsername}
          />
          <View style={styles.searchResultContainer}>
            <Text>Search Result: </Text>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>{resultUser && resultUser.Nickname}</Text>
            {resultUser &&
              <Button
                title={relationship ? 'Already a Friend' : 'Add'}
                onPress={addSearchedFriend}
                disabled={relationship && true}
              />
            }
          </View>
          <View style={styles.myIdContainer}>
            <Text style={{marginHorizontal: 5, fontWeight: 'bold', fontSize: 18}}>My ID</Text>
            <Text style={{marginHorizontal: 5, fontWeight: 'bold', fontSize: 15}}>{currentUser && currentUser.Username}</Text>
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
