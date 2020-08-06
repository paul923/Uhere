import * as React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, FlatList, Alert } from 'react-native';
import {Icon, Header, Avatar, Input, Button, ListItem, SearchBar} from 'react-native-elements';
import FriendCard from 'components/FriendCard';

import { getGroupById, deleteGroupById } from 'api/group'
import firebase from 'firebase';

import { GroupContext, GroupProvider, useStateValue } from 'contexts/GroupContext';


export default function GroupDetailScreen({ navigation, route }) {
  const [state, dispatch] = React.useContext(GroupContext);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    console.log("Groupdetailscreen state",state);
    route.params && retrieveGroupById(route.params.groupId)
  }, []);

  const createTwoButtonRemoveAlert = () =>{
    Alert.alert(
      `Remove ${state.groupData.GroupName}?`,
      `You cannot undo this action`,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => {
            console.log("OK Pressed");
            deleteGroup();
          }
        }
      ],
      { cancelable: false }
    );}

  async function retrieveGroupById(groupId){
    let userGroup = await getGroupById(groupId);
    dispatch({type: 'change group data', dataObject: userGroup})
  }

  function manageFriends(){
    navigation.navigate('Add Friend List')
  }

  async function deleteGroup(){
    console.log("Deleting group");
    let response = await deleteGroupById(state.groupData.GroupId)
    if(response.status === 200){
      navigation.goBack();
    } else {
      console.error("error has occurred")
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
        centerComponent={{ text: 'Group Name', style: { color: '#fff', fontSize: 20 } }}
        containerStyle={{zIndex:200}}
        statusBarProps={{translucent: true}}
      />

      <Button
        style={styles.button}
        buttonStyle={{
          padding: 13,
          backgroundColor: "#888888",
          borderRadius: 10
        }}
        titleStyle={{
          fontSize: 15,
        }}
        title="Manage Friends"
        onPress={() => manageFriends()}
      />

      <FlatList
        data={state.groupData.Members}
        renderItem={renderFriendsCard}
        keyExtractor={(item) => {item.GroupId + item.UserId}}
        contentContainerStyle={{
          paddingHorizontal: 20,
          backgroundColor: "white"
        }}
        bounces={false}
        scrollEnabled={false}
      />
      <Button
        style={styles.button}
        icon={
          <Icon
            name="delete"
            type="antdesign"
            color="white"
          />
        }
        buttonStyle={{
          padding: 10,
          backgroundColor: "#FF5B5B",
          borderRadius: 10
        }}
        onPress={() => createTwoButtonRemoveAlert()}
      />

    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    margin: 15
  },

})
