import * as React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, FlatList, TouchableWithoutFeedback } from 'react-native';
import {Icon, Header, Avatar, Input, Button, ListItem, SearchBar} from 'react-native-elements';
import FriendCard from '../components/FriendCard';

import { postGroup, updateGroup } from '../API/FriendAPI'
import firebase from 'firebase';



export default function CreateGroupScreen({ navigation, route }) {
  const [userGroup, setUserGroup] = React.useState(null);
  const [groupName, setGroupName] = React.useState(route.params ? route.params.group.GroupName : "");
  const [selectedFriends, setSelectedFriends] = React.useState(null);
  const [editMode, setEditMode] = React.useState(false);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    route.params && setUserGroup(route.params.group);
    route.params && setSelectedFriends(route.params.selectedFriends);
    route.params && setEditMode(route.params.editMode);
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

  async function editGroup(){
    let group = {
      UserId : firebase.auth().currentUser.uid,
      GroupId : userGroup.GroupId,
      GroupName : groupName
    }
    let response = await updateGroup(group, selectedFriends);
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
          <TouchableOpacity 
            disabled = { groupName.length !== 0 ? false : true}
            onPress={() => !editMode ? createGroup() : editGroup()}>
            <Text style={{color:  groupName.length !== 0 ? 'white' : 'black'}}>Done</Text>
          </TouchableOpacity>
        }
        centerComponent={{ text: !editMode ? 'Create Group' : 'Edit Group', style: { color: '#fff', fontSize: 20 } }}
        containerStyle={{zIndex:200}}
        statusBarProps={{translucent: true}}
      />
      <View style={styles.contentContainer}>
        <View style={styles.groupContainer}>
          <Text style={styles.fieldText}>Group Name</Text>
          <TextInput
            style={{borderWidth: 1, height: 50, color: 'black', borderRadius: 10}}
            value={groupName}
            onChangeText={(text)=> setGroupName(text)}
          />
        </View>
        <View style={styles.addFriendsContainer}>
          <Text style={styles.fieldText}>Add Friends</Text>
          {/**Friends FlatList */}
          <TouchableOpacity onPress={()=> {navigation.navigate('Add Friend List', {selectedFriends: selectedFriends}); console.log(selectedFriends)}}>
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
