import * as React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import {Icon, Header, Avatar, Input, Button, ListItem, SearchBar} from 'react-native-elements'
import FriendCard from '../components/FriendCard';
import FriendTile from '../components/FriendTile';
import firebase from 'firebase';
import { backend } from '../constants/Environment';


export default class FriendScreen extends React.Component {
  state = {
    searchText: "",
    data: [],
    filteredData: [],
  };

  retrieveFriend = async () => {
    let response = await fetch(`http://${backend}:3000/relationship/${firebase.auth().currentUser.uid}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    let responseJson = await response.json();
    responseJson.response.sort((a,b) => a.Nickname.localeCompare(b.Nickname));
    this.setState({data: responseJson.response});
  }
  componentDidMount(){
    this.retrieveFriend();
  }



  search = (searchText) => {
    this.setState({searchText: searchText});

    let filteredData = this.state.data.filter(function (item) {
      return item.Nickname.toLowerCase().includes(searchText.toLowerCase()) || item.Username.toLowerCase().includes(searchText.toLowerCase())
    });

    this.setState({filteredData: filteredData})
  }




  renderFriendsCard = ({ item }) => (
    <FriendCard
      avatarUrl= {item.AvatarURI}
      avatarTitle= {!item.AvatarURI && item.Nickname.substr(0, 2).toUpperCase()}
      displayName = {item.Nickname}
      userId = {item.Username}
    />
  )

  render() {
    return (
      <View style={styles.container}>
        <Header
          centerComponent={{ text: 'FRIENDS', style: { color: '#fff', fontSize: 20 } }}
          statusBarProps={{translucent: true}}
        />


        <SearchBar
          round={true}
          lightTheme={true}
          placeholder="Search..."
          autoCapitalize='none'
          autoCorrect={false}
          onChangeText={this.search}
          value={this.state.searchText}
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
          data={this.state.filteredData && this.state.filteredData.length > 0 ? this.state.filteredData : (this.state.searchText.length === 0 && this.state.data)}
          renderItem={this.renderFriendsCard}
          keyExtractor={(item) => item.userId}
          contentContainerStyle={{
            paddingLeft: 20,
            paddingRight: 20,
            backgroundColor: "white"
          }}
          bounces={false}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white"
  },
});

const friendsData = [
  {
    displayName: "Justin Choi",
    userId : "Crescent1234",
    pictureUrl : "https://upload.wikimedia.org/wikipedia/commons/b/b8/Red_rose_flower_detailed_imge.jpg",
    userInitial : "",
  },
  {
    displayName: "Paul Kim",
    userId : "pk1234",
    pictureUrl : "https://upload.wikimedia.org/wikipedia/commons/b/b8/Red_rose_flower_detailed_imge.jpg",
    userInitial : "",
  },
  {
    displayName: "Jay Suhr",
    userId : "js1234",
    pictureUrl : "https://upload.wikimedia.org/wikipedia/commons/b/b8/Red_rose_flower_detailed_imge.jpg",
    userInitial : "",
  },
  {
    displayName: "Matthew Kim",
    userId : "mk1234",
    pictureUrl : "https://upload.wikimedia.org/wikipedia/commons/b/b8/Red_rose_flower_detailed_imge.jpg",
    userInitial : "",
  },
  {
    displayName: "JYP",
    userId : "andWondergirls",
    pictureUrl : "https://upload.wikimedia.org/wikipedia/commons/b/b8/Red_rose_flower_detailed_imge.jpg",
    userInitial : "",
  },
  {
    displayName: "You Hee Yeol",
    userId : "uhere",
    pictureUrl : "https://upload.wikimedia.org/wikipedia/commons/b/b8/Red_rose_flower_detailed_imge.jpg",
    userInitial : "",
  },
]
