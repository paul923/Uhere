import * as React from 'react';
import { StyleSheet, Text, View, SectionList, SafeAreaView, FlatList, TouchableWithoutFeedback, Modal, Alert } from 'react-native';
import {Icon, Header, Avatar, Input, Button, SearchBar} from 'react-native-elements'
import FriendCard from 'components/FriendCard';
import FriendTile from 'components/FriendTile';
import { getRelationships, getUserByUserId } from 'api/user'
import firebase from 'firebase';
import { backend } from 'constants/Environment';
import { SimpleAnimation } from 'react-native-simple-animations';
import { TouchableOpacity, ScrollView} from 'react-native-gesture-handler'
import { useIsFocused } from '@react-navigation/native'
import UhereHeader from '../../components/UhereHeader';
import { FloatingAction } from "react-native-floating-action";
import AuthContext from 'contexts/AuthContext';


export default function FriendScreen({navigation}) {
  const [ currentUser, setCurrentUser] = React.useState(null);
  const [ searchText, setSearchText] = React.useState("");
  const [ friendsData, setFriendsData] = React.useState([]);
  const [ filteredData, setFilteredData] = React.useState([]);
  const { getUserInfo } = React.useContext(AuthContext);

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
    let user = await getUserByUserId(firebase.auth().currentUser.uid);
    setCurrentUser(user);
    let friends = await getRelationships(firebase.auth().currentUser.uid);
    friends.sort((a,b) => a.Nickname.localeCompare(b.Nickname));
    let combinedFriends = [
      user,
      ...friends
    ]
    console.log('friends:', combinedFriends);
    setFriendsData(combinedFriends);
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

    let filtered = friendsData.filter(function (item) {
      return item.Nickname.toLowerCase().includes(text.toLowerCase()) || item.Username.toLowerCase().includes(text.toLowerCase())
    });
    setFilteredData(filtered)
  }


  function pressDropDownItem(destination){
    console.log('pressed')
    navigation.navigate(destination);
  }


  return (
    <View style={styles.container}>
      <UhereHeader/>
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
            renderItem={({item}) => (
              <FriendCard
                key={item.UserId}
                avatarUrl= {item.AvatarURI}
                avatarColor= {item.AvatarColor}
                displayName = {item.Nickname}
                userId= {item.Username}
                bottomDivider= {item.UserId === currentUser.UserId}
                meIcon= {item.UserId === currentUser.UserId}
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
    </View>
  )
}

const actions = [
  {
    text: "Add Friend",
    icon: require('../../assets/images/avatars/avatar_bird/avatar_bird.png'),
    name: "Add Friend By Id",
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
