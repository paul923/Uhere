import * as React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, FlatList, TouchableWithoutFeedback } from 'react-native';
import {Icon, Header, Avatar, Input, Button, ListItem, SearchBar} from 'react-native-elements';
import FriendCard from '../components/FriendCard';

import { postGroup } from '../API/FriendAPI'
import firebase from 'firebase';



export default function CreateGroupScreen({ navigation, route }) {
  const [groupName, setGroupName] = React.useState("");
  const [selectedFriends, setSelectedFriends] = React.useState(null);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    route.params && setSelectedFriends(route.params.selectedFriends);
    route.params && console.log('route is',route.params.selectedFriends);
  });

  async function createGroup(){
    let group = {
      UserId : firebase.auth().currentUser.uid,
      GroupName : groupName
    }
    let response = await postGroup(group, selectedFriends);
    if(response){
      navigation.goBack()
    }

  }

  function renderFriendsCard({ item }){
    return (
    <FriendCard
      avatarUrl= {item.AvatarURI}
      avatarTitle= {!item.AvatarURI && item.Nickname.substr(0, 2).toUpperCase()}
      displayName = {item.Nickname}
      userId = {item.Username}
    />
    )
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
        rightComponent={
          <TouchableOpacity onPress={() => createGroup()}>
            <Text style={{color: 'white'}}>Done</Text>
          </TouchableOpacity>
        }
        containerStyle={{zIndex:200}}
        centerComponent={{ text: 'FRIENDS', style: { color: '#fff', fontSize: 20 } }}
        statusBarProps={{translucent: true}}
      />
      <View style={styles.contentContainer}>
        <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
          <View style={styles.groupContainer}>
            <Text style={styles.fieldText}>Group Name</Text>
            <TextInput
              style={{borderWidth: 1, height: 50, color: 'black', borderRadius: 10}}
              value={groupName}
              onChangeText={(text)=> setGroupName(text)}
            />
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.addFriendsContainer}>
          <Text style={styles.fieldText}>Add Friends</Text>
          {/**Friends FlatList */}
          <TouchableOpacity onPress={()=> navigation.navigate('Add Friend List')}>
            <View style={styles.addButton}>
              <Icon
                name="plus"
                type="entypo"
              />
            </View>
          </TouchableOpacity>
          <View style={{flex: 1}}>
          <FlatList
            data={selectedFriends}
            renderItem={renderFriendsCard}
            keyExtractor={(item) => item.UserId}
            contentContainerStyle={{
            }}
            bounces={false}
          />
          </View>
        </View>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 20
  },
  groupContainer: {
    marginVertical: 30,
  },
  addFriendsContainer: {
    flex: 1,
  },
  fieldText:{
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20
  },
  addButton: {
    borderWidth: 1,
    height: 50,
    justifyContent: 'center',
    borderRadius: 10,
    borderStyle: 'dashed'
  }
})
