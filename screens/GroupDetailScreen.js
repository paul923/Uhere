import * as React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, FlatList, TouchableWithoutFeedback } from 'react-native';
import {Icon, Header, Avatar, Input, Button, ListItem, SearchBar} from 'react-native-elements';
import FriendCard from '../components/FriendCard';

import {  } from '../API/FriendAPI'

import { GroupContext, GroupProvider, useStateValue } from 'contexts/GroupContext';


export default function GroupDetailScreen({ navigation, route }) {
  const [groupName, setGroupName] = React.useState("");
  const [state, dispatch] = React.useContext(GroupContext);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    console.log(state);
    dispatch({type: 'change group data', newValue:'Hello'})
  }, []);

  function manageFriends(){
    navigation.navigate('Add Friend List')
  }

  function deleteGroup(){

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

      {/**
       * TODO: display list of group members on Flatlist
       */}
      <FlatList/>
      <Text>{state.groupData.value}</Text>
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
        onPress={() => deleteGroup()}
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
