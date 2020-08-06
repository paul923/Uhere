import * as React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, FlatList, TouchableWithoutFeedback } from 'react-native';
import {Icon, Header, Avatar, Input, Button, ListItem, SearchBar} from 'react-native-elements';
import FriendCard from 'components/FriendCard';

import { postGroup } from 'api/group'
import firebase from 'firebase';
import { useIsFocused } from '@react-navigation/native'
import { GroupContext } from 'contexts/GroupContext';



export default function CreateGroupScreen({ navigation, route }) {
  const [groupName, setGroupName] = React.useState("");
  const [newSelectedFriends, setNewSelectedFriends] = React.useState([]);
  const [ state, dispatch] = React.useContext(GroupContext);

  const isFocused = useIsFocused();

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    route.params && setNewSelectedFriends(route.params.selectedFriends);
  }, [isFocused]);

  async function createGroup(){
    let group = {
      UserId : firebase.auth().currentUser.uid,
      GroupName : groupName
    }
    let response = await postGroup(group, newSelectedFriends);
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
            onPress={() => createGroup()}>
            <Text style={{color:  groupName.length !== 0 ? 'white' : 'black'}}>Done</Text>
          </TouchableOpacity>
        }
        centerComponent={{ text: 'Create Group', style: { color: '#fff', fontSize: 20 } }}
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
          <TouchableOpacity onPress={()=> {
            navigation.navigate('Add Friend List', {selectedFriends: newSelectedFriends});
            console.log(newSelectedFriends);
            dispatch({type: 'change group data', dataObject: []})
          }}>
            <View style={styles.addButton}>
              <Icon
                name="plus"
                type="entypo"
              />
            </View>
          </TouchableOpacity>
          <View style={{flex: 1}}>
          <FlatList
            data={newSelectedFriends}
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
