import * as React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';
import {Icon, Header, Avatar, Input, Button, ListItem, SearchBar} from 'react-native-elements'
import { getUserByUsername, getUserByUserId, createRelationship, addBackRelationship, getRelationshipByUsername } from 'api/user'
import UhereHeader from '../../components/UhereHeader';
import { getAvatarImage } from '../../utils/asset'

import firebase from 'firebase';


export default function AddFriendByIdScreen({ navigation, route }) {

  const [searchUsername, setSearchUsername] = React.useState("");
  const [currentUser, setCurrentUser] = React.useState(null);
  const [resultUser, setResultUser] = React.useState(null);
  const [searchButtonClicked, setSearchButtonClicked] = React.useState(false);
  const [addedFlag, setAddedFlag] = React.useState(false);
  const [selfFlag, setSelfFlag] = React.useState(false);


  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    fetchCurrentUser();
  }, []);


  async function searchUserByUsername() {
    let formatName = searchUsername.trim();
    if (formatName === '') {
      alert('Not available Username')
    } else if (formatName.toUpperCase() !== currentUser.Username.toUpperCase()) {
      let resultUser = await getRelationshipByUsername(currentUser.UserId, formatName)
      console.log("Search Result: ", resultUser)
      setResultUser(resultUser);
      setAddedFlag(false)
    }
    setSearchButtonClicked(true);
  };



  async function fetchCurrentUser() {
    let user = await getUserByUserId(firebase.auth().currentUser.uid);
    console.log("Current User :", user)
    setCurrentUser(user);
  }

  async function addSearchedFriend() {
    if(!resultUser.HadRelationship){
      let response = await createRelationship(currentUser.UserId, resultUser.UserId);
      if(response){
        setAddedFlag(true);
      } else {
        alert("Failed to add. Please try again.")
      }
    }
    else{
      console.log("i'm here")
      let response = await addBackRelationship(currentUser.UserId, resultUser.UserId);
      if(response){
        setAddedFlag(true);
      } else {
        alert("Failed to add. Please try again.")
      }
    }
  }


  return (
    <View style={styles.container}>
      <UhereHeader
        showBackButton
        onPressBackButton={() => navigation.goBack()}
      />
      <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
        <View style={styles.contentContainer}>
          <View style={{borderBottomWidth: 1, borderBottomColor: "#15CDCA", paddingVertical: 5}}>
            <Text style={{color: '#15CDCA', fontWeight: '600'}}>Add by Username</Text>
          </View>
          <View style={styles.searchContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Search by Username"
                placeholderTextColor="#A8A8A8"
                style={{height: 30, color: 'black'}}
                value={searchUsername}
                onChangeText={(text)=> setSearchUsername(text)}
                onSubmitEditing={searchUserByUsername}
              />
            </View>
            <Button
              buttonStyle={styles.searchButton}
              onPress={searchUserByUsername}
              icon={
                <Icon
                  name="search"
                  color="white"
                />
              }
            />
          </View>
          <View style={styles.searchResultContainer}>
            {resultUser !== null ?
              (
                <View style={{flex: 1, justifyContent: 'space-between'}}>
                  <View style={styles.resultCard}>
                    <Avatar
                      size={45}
                      overlayContainerStyle={{backgroundColor:'white', borderWidth: 1, borderColor: '#909393', borderRadius: 10}}
                      containerStyle={{marginHorizontal: 15}}
                      imageProps= {{
                        style: {
                          tintColor: resultUser.AvatarColor
                        }
                      }}
                      source={getAvatarImage(resultUser.AvatarURI)}
                      placeholderStyle={{backgroundColor: 'transparent'}}
                    />
                    <View>
                      <Text style={{fontSize: 20, fontWeight: 'bold'}}>{resultUser && resultUser.Nickname}</Text>
                      <Text>@{resultUser.Username}</Text>
                    </View>
                  </View>
                  <Button
                    buttonStyle={{height: 50, backgroundColor: '#15CDCA'}}
                    title={resultUser.HasRelationship || addedFlag ? 'Already a Friend' : 'Add'}
                    onPress={addSearchedFriend}
                    disabled={resultUser.HasRelationship || addedFlag ? true : false}
                  />
                </View>
              )
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
    backgroundColor: '#F5F5F5'
  },
  contentContainer: {
    flex: 1,
    padding: 20
  },
  searchContainer: {
    height: 50,
    marginVertical: 30,
    flexDirection: 'row',
  },
  inputContainer: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    backgroundColor: '#FEFEFE',
    borderRadius: 5,
    marginRight: 10
  },
  searchResultContainer: {
    height: 230
  },
  searchButton: {
    width: 50,
    height: 50,
    backgroundColor:"#15CDCA"
  },
  myIdContainer: {
    marginVertical: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 70,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.2,
    shadowRadius: 2,  
    elevation: 2
  }
})
