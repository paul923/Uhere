import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import {Icon, Header, Avatar, Input, Button, ListItem, SearchBar} from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';
import FriendCard from '../components/FriendCard';
import FriendTile from '../components/FriendTile';
import Collapse from '../components/Collapse';
import firebase from 'firebase';
import { backend } from '../constants/Environment';



export default function AddFriendsScreen ({route, navigation}) {
  const [ searchText, setSearchText] = React.useState("");
  const [ friends, setFriends] = React.useState([]);
  const [ filteredData, setFilteredData] = React.useState([]);
  const [ selectedFriends, setSelectedFriends] = React.useState(route.params && route.params.selectedFriends);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
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

    retrieveFriend();

  }, []);


  function friendSearch(text) {
    setSearchText(text);

    let filtered = friends.filter(function (item) {
      return item.Nickname.toLowerCase().includes(text.toLowerCase()) || item.Username.toLowerCase().includes(text.toLowerCase())
    });

    setFilteredData(filtered)
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
        checked: selectedFriends.some(i => i.UserId === item.UserId),
        onPress: () => selectFriend(item)
      }}
    />
    )
  }

  function renderFriendsTile({ item }){
    return (
    <FriendTile
      avatarUrl= {item.AvatarURI}
      avatarTitle= {!item.AvatarURI && item.Nickname.substr(0, 2).toUpperCase()}
      displayName = {item.Nickname}
      userId = {item.Username}
      pressMinus = {() => selectFriend(item)}
    />
  )}

  function selectFriend (item) {
    if(!selectedFriends.includes(item)){
      setSelectedFriends([...selectedFriends, item])
    } else {
      setSelectedFriends(selectedFriends.filter(a => a !== item));
    }
    console.log(selectedFriends)
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
          <TouchableOpacity onPress={()=> navigation.navigate('Create Group', {selectedFriends: selectedFriends})}>
            <Text style={{color: 'white', marginHorizontal: 5}}>OK</Text>
          </TouchableOpacity>
        }
      />
      <View style={{
        width: "100%",
        minHeight: 100,
        backgroundColor: "#E1E1E1"
      }}>
        <FlatList
          data={selectedFriends}
          renderItem={renderFriendsTile}
          contentContainerStyle={{
            padding: 10,
          }}
          keyExtractor={(item) => item.UserId}
          horizontal
          bounces = {false}
        />
      </View>


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
        keyExtractor={(item) => item.userId}
        contentContainerStyle={{
          paddingLeft: 20,
          paddingRight: 20,
          backgroundColor: "white"
        }}
        bounces={false}
      />
    </View>
  );
}





const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white"
  },
});
