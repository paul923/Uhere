import * as React from 'react';
import { StyleSheet, Text, View, TextInput, SafeAreaView, FlatList, TouchableWithoutFeedback } from 'react-native';
import {Icon, Header, Avatar, Input, Button, ListItem, SearchBar} from 'react-native-elements'
import FriendCard from '../components/FriendCard';
import FriendTile from '../components/FriendTile';
import firebase from 'firebase';
import { backend } from '../constants/Environment';
import { SimpleAnimation } from 'react-native-simple-animations';
import { TouchableOpacity} from 'react-native-gesture-handler'




export default function FriendScreen({navigation}) {
  const [ searchText, setSearchText] = React.useState("");
  const [ friends, setFriends] = React.useState([]);
  const [ filteredData, setFilteredData] = React.useState([]);
  const [ selectedFriends, setSelectedFriends] = React.useState([]);
  const [ dropDownToggle, setDropDownToggle] = React.useState(false);

  React.useEffect(() => {
    retrieveFriend();
    // Sorts friends list on initial load

  }, []);

  async function retrieveFriend() {
    let response = await fetch(`http://${backend}:3000/relationship/${firebase.auth().currentUser.uid}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    let responseJson = await response.json();
    responseJson.response.sort((a,b) => a.Nickname.localeCompare(b.Nickname));
    setFriends(responseJson.response);
  }
  
  function renderFriendsCard({ item }){
    return (
    <FriendCard
      avatarUrl= {item.AvatarURI}
      avatarTitle= {!item.AvatarURI && item.Nickname.substr(0, 2).toUpperCase()}
      displayName = {item.Nickname}
      userId = {item.Username}
      checkBox={{
        size: 35,
        checkedIcon: 'dot-circle-o',
        uncheckedIcon: 'circle-o',
        checkedColor:'#ff8a8a',
        uncheckedColor: '#ff8a8a',
        checked: selectedFriends.includes(item),
        onPress: () => selectFriend(item)
      }}
    />
    )
  }
  
  function selectFriend (item) {
    console.log(item);
    if(!selectedFriends.includes(item)){
      setSelectedFriends([...selectedFriends, item])
    } else {
      setSelectedFriends(selectedFriends.filter(a => a !== item));
    }
    console.log(selectedFriends)
  }



  function friendSearch(text) {
    setSearchText(text);
  
    let filtered = friends.filter(function (item) {
      return item.Nickname.toLowerCase().includes(text.toLowerCase()) || item.Username.toLowerCase().includes(text.toLowerCase())
    });
  
    setFilteredData(filtered)
  }

   
  return (
    <View style={styles.container}>
      <Header
        containerStyle={{zIndex:200}}
        centerComponent={{ text: 'FRIENDS', style: { color: '#fff', fontSize: 20 } }}
        statusBarProps={{translucent: true}}
        rightComponent={
          <Icon
            name="user-plus"
            type="feather"
            color="white"
            underlayColor="transparent"
            onPress = {()=> {setDropDownToggle(!dropDownToggle)}}
          />
        }
      />

      {// Drop down menu when add user buttton clicked on header
      dropDownToggle && (
        <SimpleAnimation
          duration={500}
          distance={50}
          movementType="slide"
          direction="down"
          fade
          aim="in"
          style={{zIndex:100}}>
          <View
            style={{
              height: 120,
              backgroundColor: 'white',
              position: 'absolute',
              width: '100%',
              flex:1,
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center'
          }}>
            <TouchableOpacity onPress={()=> setDropDownToggle(false)}>
              <View style={styles.dropDownButton}>
                <Icon name="edit" type="entypo"/>
                <Text style={styles.dropDownButtonText}>Edit Friend</Text>
              </View>
            </TouchableOpacity>
            <View style={{height: '70%', borderWidth: 0.5, borderColor: '#EBEBEB'}}></View>
            <TouchableOpacity onPress={()=> {this.props.navigation.navigate('Add Friend Selection');setDropDownToggle(false)}}>
              <View style={styles.dropDownButton}>
                <Icon name="user" type="feather"/>
                <Text style={styles.dropDownButtonText}>Add Friend</Text>
              </View>
            </TouchableOpacity>
            <View style={{height: '70%', borderWidth: 0.5, borderColor: '#EBEBEB'}}></View>
            <TouchableOpacity onPress={()=> {this.props.navigation.navigate('Create Group');setDropDownToggle(false);}}>
              <View style={styles.dropDownButton}>
                <Icon name="users" type="feather"/>
                <Text style={styles.dropDownButtonText}>Create Group</Text>
              </View>
            </TouchableOpacity>
          </View>
        </SimpleAnimation>
        )
      }
      {// greyed out background when dropdown is toggled
        dropDownToggle && (
          <TouchableWithoutFeedback onPress={()=> {console.log("test");setDropDownToggle(false)}}>
          <View style={{
            flex: 1,
            zIndex: 20,
            height: "100%",
            width: '100%',
            position: 'absolute',
            backgroundColor: dropDownToggle ? 'black' : null,
            opacity: dropDownToggle ? 0.7 : null,
          }}>
          </View>
          </TouchableWithoutFeedback>
        )
      }

      <View style={{
        flex: 1,
        zIndex: 10
      }}>
        <SearchBar
          round={true}
          lightTheme={true}
          placeholder="Search..."
          autoCapitalize='none'
          autoCorrect={false}
          onChangeText={friendSearch}
          value={searchText}
          containerStyle={{
            backgroundColor:"white",
            margin: 10,
            borderColor: "#C4C4C4",
            borderWidth: 1,
            borderRadius: 10,
            padding: 3
          }}
          inputContainerStyle={{
            backgroundColor:"white"
          }}
          inputStyle={{
            backgroundColor:"white"
          }}
          leftIconContainerStyle={{
            backgroundColor:"white"
          }}
          rightIconContainerStyle={{
            backgroundColor:"white"
          }}
        />

        <FlatList
          data={filteredData && filteredData.length > 0 ? filteredData : (searchText.length === 0 && friends)}
          renderItem={renderFriendsCard}
          keyExtractor={(item) => item.UserId}
          contentContainerStyle={{
            paddingLeft: 20,
            paddingRight: 20,
            backgroundColor: "white"
          }}
          bounces={false}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
  },
  dropDownButton: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems:'center'
  },
  dropDownButtonText: {
    marginVertical: 5,
    fontSize: 10,
    fontWeight: 'bold'
  }
});
