import * as React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';
import {Icon, Header, Avatar, Input, Button, ListItem, SearchBar} from 'react-native-elements'

import { getUserByUsername, getUserByUid, addFriend, addFriendByFlag, getUserRelationship, getRelationshipType } from '../API/user'

import firebase from 'firebase';


export default function AddFriendByIdScreen({ navigation, route }) {

  const [searchUsername, setSearchUsername] = React.useState("");
  const [currentUser, setCurrentUser] = React.useState(null);
  const [resultUser, setResultUser] = React.useState(null);
  const [searchButtonClicked, setSearchButtonClicked] = React.useState(false);
  const [addedFlag, setAddedFlag] = React.useState(false);


  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    fetchCurrentUser();
  }, []);


  async function searchUserByUsername() {
    let resultUser = await getRelationshipType(firebase.auth().currentUser.uid, searchUsername);
    console.log(resultUser)
    setResultUser(resultUser);
    setSearchButtonClicked(true);
    setAddedFlag(false)
  };



  async function fetchCurrentUser() {
    let user = await getUserByUid(firebase.auth().currentUser.uid);
    setCurrentUser(user);
  }

  async function addSearchedFriend() {
    if(!resultUser.WasDeleted){
      let newRelationship= {
        UserId1 : currentUser.UserId,
        UserId2 : resultUser.UserId,
        Type : "Friend"
      }
      let response = await addFriend(newRelationship);
      if(response.status === 200){
        setAddedFlag(true);
      }
    }
    else{
      let userRelationship= {
        UserId1 : currentUser.UserId,
        UserId2 : resultUser.UserId,
      }
      
      let response = await addFriendByFlag(userRelationship);
      if(response.status === 200){
        setAddedFlag(true);
      }
    } 
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
              value={searchUsername}
              onChangeText={(text)=> setSearchUsername(text)}
              onSubmitEditing={searchUserByUsername}
            />
          </View>
          <Button
            title="Search"
            onPress={searchUserByUsername}
          />
          <View style={styles.searchResultContainer}>
            <Text>Search Result: </Text>
            
            {resultUser !== null ? 
            (<View>
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>{resultUser && resultUser.Nickname}</Text>
              <Button
                title={resultUser.HasRelationship || addedFlag ? 'Already a Friend' : 'Add'}
                onPress={addSearchedFriend}
                disabled={resultUser.HasRelationship || addedFlag ? true : false}
              />
            </View>) 
            : searchButtonClicked && (<View><Text style={{fontSize: 20, fontWeight: 'bold'}}>User not found</Text></View>)
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
