import * as React from 'react';
import { StyleSheet, Text, View, SectionList, SafeAreaView, FlatList, TouchableWithoutFeedback, Modal, Alert } from 'react-native';
import {Icon, Header, Avatar, Input, Button, ListItem, SearchBar} from 'react-native-elements'
import CustomInput from 'components/CustomInput';
import FriendCard from 'components/FriendCard';
import FriendTile from 'components/FriendTile';
import { getRelationships, getGroupsByUserId } from 'api/user'
import firebase from 'firebase';
import { backend } from 'constants/Environment';
import { SimpleAnimation } from 'react-native-simple-animations';
import { TouchableOpacity, ScrollView} from 'react-native-gesture-handler'
import { useIsFocused } from '@react-navigation/native'




export default function FriendScreen({navigation}) {
  const [ searchText, setSearchText] = React.useState("");
  const [ friends, setFriends] = React.useState([]);
  const [ groups, setGroups] = React.useState([]);
  const [ combinedData, setCombinedData] = React.useState([]);
  const [ filteredData, setFilteredData] = React.useState([]);
  const [ dropDownToggle, setDropDownToggle] = React.useState(false);
  const [ groupMembers, setGroupMembers] = React.useState([]);

  const isFocused = useIsFocused();

  React.useEffect(() => {
    retrieveData();
    // Sorts friends list on initial load
  }, [isFocused]);

  const createTwoButtonRemoveAlert = (user) =>{
    Alert.alert(
      `Remove ${user.Nickname}?`,
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
            removeFriend(user.UserId);
          }
        }
      ],
      { cancelable: false }
    );}


  async function retrieveData() {
    let friends = await getRelationships(firebase.auth().currentUser.uid);
    // list.sort((a,b) => a.Nickname.localeCompare(b.Nickname));
    // setFriends(list);
    if (!friends){
      friends = [];
    }
    console.log(friends);
    let groups = await getGroupsByUserId(firebase.auth().currentUser.uid);
    if (!groups){
      groups = []
    }
    console.log(groups)


    let data = [
      {
        title: "Groups",
        data: groups
      },
      {
        title: "Friends",
        data: friends
      }
    ]
    setCombinedData(data)
  }

  async function removeFriend(friendId){
    console.log(`Remove Friend Id ${friendId}`);

    let userRelationship= {
      UserId1 : firebase.auth().currentUser.uid,
      UserId2 : friendId,
    }
    await deleteFriend(userRelationship);
  }

  function friendSearch(text) {
    setSearchText(text);

    // let filtered = friends.filter(function (item) {
    //   return item.Nickname.toLowerCase().includes(text.toLowerCase()) || item.Username.toLowerCase().includes(text.toLowerCase())
    // });
    let filtered = combinedData.map(section => {
      if(section.title === "Friends"){
        let filteredFriends = section.data.filter(function(item){
          return item.Nickname.toLowerCase().includes(text.toLowerCase()) || item.Username.toLowerCase().includes(text.toLowerCase())
        })
        let filteredObject =
        {
          title: "Friends",
          data: filteredFriends
        };
        return filteredObject;
      } else if(section.title === "Groups"){
        let filteredGroups = section.data.filter(function(item){
          let flag = item.GroupName.toLowerCase().includes(text.toLowerCase()) || item.Members.some(function(item){
            return item.Nickname.toLowerCase().includes(text.toLowerCase()) || item.Username.toLowerCase().includes(text.toLowerCase())
          })
          return flag;
        })
        let filteredObject =
        {
          title: "Groups",
          data: filteredGroups
        };
        return filteredObject;
      }

    })
    console.log(filtered)
    setFilteredData(filtered)
  }


  function pressDropDownItem(destination){
    console.log('pressed')
    navigation.navigate(destination);
    setDropDownToggle(false);
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
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center'
          }}>
            <TouchableOpacity  onPress={()=> setDropDownToggle(false)}>
              <View style={styles.dropDownButton}>
                <Icon name="edit" type="entypo"/>
                <Text style={styles.dropDownButtonText}>Edit Friend</Text>
              </View>
            </TouchableOpacity>
            <View style={{height: '70%', borderWidth: 0.5, borderColor: '#EBEBEB'}}></View>

            <TouchableOpacity onPress={()=> pressDropDownItem('Add Friend Selection')}>
              <View style={styles.dropDownButton}>
                <Icon name="user" type="feather"/>
                <Text style={styles.dropDownButtonText}>Add Friend</Text>
              </View>
            </TouchableOpacity>
            <View style={{height: '70%', borderWidth: 0.5, borderColor: '#EBEBEB'}}></View>
            <TouchableOpacity onPress={()=> pressDropDownItem('Create Group')}>
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
        (dropDownToggle) && (
          <TouchableWithoutFeedback onPress={()=> {setDropDownToggle(false)}}>
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
        <Text style={styles.friendsHeader}>Friends</Text>
        <View style={styles.searchBoxAbsolute}>
        <CustomInput
          containerStyle={{flex: 1}}
          placeholder='Seach Friends?'
          inputStyle={{color: '#000000'}}
          onChangeText={friendSearch}
          value={searchText}
        />
        </View>

        <View style={styles.listContainer}>
        <SectionList
          sections={filteredData && filteredData.length > 0 ? filteredData : (searchText.length === 0 && combinedData)}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item, section }) => {
            if(section.title === "Groups"){
              return (
                <TouchableOpacity onPress={()=> navigation.navigate('Group Detail', {
                  groupId: item.GroupId
                })}>
                  <FriendCard
                    style={{paddingLeft: 20}}
                    displayName = {item.GroupName}
                    userId = {item.GroupName}
                  />
                </TouchableOpacity>
              )
            } else if(section.title === "Friends"){
              return (
                <FriendCard
                  style={{paddingLeft: 20}}
                  avatarUrl= {item.AvatarURI}
                  avatarTitle= {!item.AvatarURI && item.Nickname.substr(0, 2).toUpperCase()}
                  displayName = {item.Nickname}
                  userId = {item.Username}
                />
              )
            }
          }}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.headerStyle}>{title}</Text>
          )}
        />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
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
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  headerStyle: {
    fontFamily: "OpenSans_400Regular",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0,
    color: "#15cdca",
    marginLeft: 10,
    marginTop: 10
  },
  searchBoxAbsolute: {
    marginTop: 15,
    zIndex: 1,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: '#fefefe',
    borderRadius: 5,
    flexDirection: 'row'
  },
  listContainer: {
    flex: 1,
    marginTop: 20,
    borderRadius: 10,
    marginRight: 20,
  },
  friendsHeader: {
    fontFamily: "OpenSans_400Regular",
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: 0,
    color: "#15cdca",
    marginLeft: 10,
    marginTop: 10
  }
});
