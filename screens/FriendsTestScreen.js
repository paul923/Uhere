import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import {Icon, Header, Avatar, Input, Button, ListItem, SearchBar} from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';
import FriendCard from '../components/FriendCard';
import Collapse from '../components/Collapse';



export default class FriendsScreen extends Component {
  state = {
    searchText: "",
    data: friendsData,
    filteredData: []
  };

  search = (searchText) => {
    this.setState({searchText: searchText});

    let filteredData = this.state.data.filter(function (item) {
      return item.displayName.toLowerCase().includes(searchText.toLowerCase()) || item.userId.toLowerCase().includes(searchText.toLowerCase())
    });

    this.setState({filteredData: filteredData})
  }


  renderFriends = ({ item }) => (
    <FriendCard
      avatarUrl= {item.pictureUrl}
      avatarTitle= {item.userInitial}
      displayName = {item.displayName}
      userId = {item.userId}
    />
  )

  render(){
    return (
      <View style={styles.container}>
        <Header/>
        <Collapse
          title= "Search Bar (Click to expand)"
          content= {
            <SearchBar
              round={true}
              lightTheme={true}
              placeholder="Search..."
              autoCapitalize='none'
              autoCorrect={false}
              onChangeText={this.search}
              value={this.state.searchText}
            />
          }
        />
        
        <View style={{flex:1}}>
          <FlatList
            data={this.state.filteredData && this.state.filteredData.length > 0 ? this.state.filteredData : (this.state.searchText.length === 0 && this.state.data)}
            renderItem={this.renderFriends}
            keyExtractor={(item) => item.userId}
          />
        </View>
        <Button title="button"/>
      </View>
    );
  }

}

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



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    borderWidth: 5,
    borderColor: 'blue'
  },
});
