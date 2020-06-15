import * as React from 'react';
import { StyleSheet, Text, View, SectionList, SafeAreaView, FlatList, TouchableWithoutFeedback, Modal, Alert } from 'react-native';
import {Icon, Header, Avatar, Input, Button, ListItem, SearchBar} from 'react-native-elements'
import FriendCard from '../components/FriendCard';
import FriendTile from '../components/FriendTile';
import { getFriendsList, getUserGroup, deleteFriend } from '../API/FriendAPI'
import firebase from 'firebase';
import { backend } from '../constants/Environment';
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
    let list = await getFriendsList(firebase.auth().currentUser.uid);
    list.sort((a,b) => a.Nickname.localeCompare(b.Nickname));
    setFriends(list);

    let group = await getUserGroup(firebase.auth().currentUser.uid);
    setGroups(group);
    console.log(group)

    let data = [
      {
        title: "Groups",
        data: group
      },
      {
        title: "Friends",
        data: list
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

        {
         /**
          * Group section */
        }
        {
         /**
          
        <ScrollView>
          <View style={{paddingHorizontal: 20, paddingVertical: 8}}>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>Group</Text>
          </View>
          <FlatList
            data={ groups }
            renderItem={renderGroupsCard}
            keyExtractor={(item) => item.GroupId}
            contentContainerStyle={{
              paddingHorizontal: 20,
              backgroundColor: "white"
            }}
          />
          <View style={{paddingHorizontal: 20, paddingVertical: 8}}>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>Friends</Text>
          </View>
          <FlatList
            data={filteredData && filteredData.length > 0 ? filteredData : (searchText.length === 0 && friends)}
            renderItem={renderFriendsCard}
            keyExtractor={(item) => item.UserId}
            contentContainerStyle={{
              paddingHorizontal: 20,
              backgroundColor: "white"
            }}
            bounces={false}
            scrollEnabled={false}
          />
        </ScrollView>

        * Group section */
        }

        <SectionList
          sections={filteredData && filteredData.length > 0 ? filteredData : (searchText.length === 0 && combinedData)}
          keyExtractor={(item, index) => item + index}
          contentContainerStyle={{
            paddingHorizontal: 20,
            backgroundColor: "white"
          }}
          renderItem={({ item, section }) => {
            if(section.title === "Groups"){
              return (
                <TouchableOpacity onPress={()=> navigation.navigate('Group Detail', {
                  groupId: item.GroupId
                })}>
                  <FriendCard
                    displayName = {item.GroupName}
                    userId = {item.GroupName}
                  />
                </TouchableOpacity>
              )
            } else if(section.title === "Friends"){
              return (
                <FriendCard
                  avatarUrl= {item.AvatarURI}
                  avatarTitle= {!item.AvatarURI && item.Nickname.substr(0, 2).toUpperCase()}
                  displayName = {item.Nickname}
                  userId = {item.Username}
                  rightElement = {
                    <Button
                      title="Remove"
                      titleStyle= {{fontSize: 12}}
                      buttonStyle={{backgroundColor: 'red'}}
                      onPress={()=>createTwoButtonRemoveAlert(item)}
                    />
                  }
                />
              )
            }
          }}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>{title}</Text>
          )}
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
});
