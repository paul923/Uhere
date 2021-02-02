import * as React from 'react';
import { StyleSheet, Text, View, SectionList, SafeAreaView, FlatList, TouchableWithoutFeedback, Modal, Alert } from 'react-native';
import {Icon, Header, Avatar, Input, Button, SearchBar} from 'react-native-elements'
import FriendCard from 'components/FriendCard';
import FriendTile from 'components/FriendTile';
import { getRelationships, getUserByUserId, deleteRelationship } from 'api/user'
import firebase from 'firebase';
import { backend } from 'constants/Environment';
import { SimpleAnimation } from 'react-native-simple-animations';
import { TouchableOpacity, ScrollView} from 'react-native-gesture-handler'
import { useIsFocused } from '@react-navigation/native'
import UhereHeader from '../../components/UhereHeader';
import { FloatingAction } from "react-native-floating-action";


export default function FriendScreen({navigation}) {
  const [ currentUser, setCurrentUser] = React.useState(null);
  const [ searchText, setSearchText] = React.useState("");
  const [ friendsData, setFriendsData] = React.useState([]);
  const [ filteredData, setFilteredData] = React.useState([]);
  const [ editToggle, setEditToggle] = React.useState(false);
  const [ isLoading, setIsLoading] = React.useState(true);

  const isFocused = useIsFocused();

  React.useEffect(() => {
    retrieveData();
    setEditToggle(false);
    // Sorts friends list on initial load
  }, [isFocused]);

  const createTwoButtonRemoveAlert = (user) =>{
    Alert.alert(
      `Delete ${user.Nickname}?`,
      `You cannot undo this action`,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "OK",
          onPress: async () => {
            let result = await deleteRelationship(firebase.auth().currentUser.uid, user.UserId)
            if (result) {
              let newData = friendsData.filter(friend => friend.UserId !== user.UserId);
              setFriendsData(newData);
            } else {
              alert("Delete failed. Something went wrong.")
            }
          }
        }
      ],
      { cancelable: false }
    );}


  async function retrieveData() {
    let user = await getUserByUserId(firebase.auth().currentUser.uid);
    Object.assign(user, {Type : "Friend"})
    setCurrentUser(user);
    let friends = await getRelationships(firebase.auth().currentUser.uid);
    friends.sort((a,b) => a.Nickname.localeCompare(b.Nickname));
    let combinedFriends = [
      user,
      ...friends
    ]
    setFriendsData(combinedFriends);
    setIsLoading(false)
  }

  function refresh() {
    console.log('refreshing')
    setIsLoading(true)
    retrieveData()
  }

  function friendSearch(text) {
    setSearchText(text);

    let filtered = friendsData.filter(function (item) {
      return item.Nickname.toLowerCase().includes(text.toLowerCase()) || item.Username.toLowerCase().includes(text.toLowerCase())
    });
    setFilteredData(filtered)
  }


  function pressDropDownItem(action){
    switch(action) {
      case 'Add Friend By Id' : 
        navigation.navigate(action);
        break;
      case 'Edit Friend':
        setEditToggle(!editToggle);
        break;
    }
  }


  return (
    <TouchableWithoutFeedback onPress={() => setEditToggle(false)}>
    <View style={styles.container}>
      <UhereHeader
        title={editToggle && "Edit Friends"}
        rightComponent={ editToggle &&
          <TouchableOpacity onPress={() => setEditToggle(false)}>
            <Text style={{color: '#808080'}}>Done</Text>
          </TouchableOpacity>
        }
      />
      <View style={{flex: 1, paddingTop: 30}}>
        <Text style={styles.friendsHeader}>Friends</Text>
        <SearchBar
          lightTheme
          placeholder='Seach Friends'
          inputContainerStyle={{height: 30, backgroundColor: '#FEFEFE'}}
          containerStyle={styles.searchBarContainer}
          onChangeText={friendSearch}
          value={searchText}
        />
        <View style={styles.listContainer}>
          <FlatList
            data={filteredData && filteredData.length > 0 ? filteredData : (searchText.length === 0 && friendsData)}
            keyExtractor={item => item.UserId}
            onRefresh={() => refresh()}
            refreshing={isLoading}
            renderItem={({item}) => (
              (item.Type === "Friend" || item.UserId === currentUser.UserId) && 
              <FriendCard
                key={item.UserId}
                avatarUrl= {item.AvatarURI}
                avatarColor= {item.AvatarColor}
                displayName = {item.Nickname}
                userId= {item.Username}
                bottomDivider= {item.UserId === currentUser.UserId}
                meIcon= {item.UserId === currentUser.UserId}
                editToggle= {editToggle}
                onPressDelete={() => createTwoButtonRemoveAlert(item)}
              />
            )}
          />
        </View>
        <FloatingAction
          actions={actions}
          onPressItem={name => {
            pressDropDownItem(name)
          }}
          color="#15CDCA"
        />
      </View>
    </View></TouchableWithoutFeedback>
  )
}

const actions = [
  {
    text: "Add Friend",
    icon: <Icon type= "antdesign" name= "adduser" color="white" size={18}/>,
    name: "Add Friend By Id",
    position: 2,
    color: "#15CDCA",
    buttonSize: 40
  },
  {
    text: "Edit Friend",
    icon: <Icon type= "entypo" name= "edit" color="white" size={18}/>,
    name: "Edit Friend",
    position: 1,
    color: "#15CDCA",
    buttonSize: 40
  },
];

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
  listContainer: {
    flex: 1,
    borderRadius: 10,
  },
  friendsHeader: {
    fontSize: 24,
    fontWeight: "500",
    letterSpacing: 0,
    color: "#15cdca",
    marginHorizontal: 15, 
  },
  floatingButton: {
    bottom: 10,
    right: 10,
  },
  searchBarContainer: {
    alignContent: 'center', 
    backgroundColor: '#FEFEFE', 
    marginHorizontal: 15, 
    borderRadius: 5, 
    borderTopColor: "#fff",
    borderBottomColor: "#fff",
    marginVertical: 10
  }
});
