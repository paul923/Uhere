import * as React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import {Icon, Header, Avatar, Input, Button, ListItem, SearchBar} from 'react-native-elements'
import FriendCard from '../components/FriendCard';
import FriendTile from '../components/FriendTile';




export default class FriendScreen extends React.Component {
  state = {
    searchText: "",
    data: friendsData,
    filteredData: [],
  };

  componentDidMount(){
    friendsData.sort((a,b) => a.displayName.localeCompare(b.displayName));
    this.setState({data: friendsData});
  }

  

  search = (searchText) => {
    this.setState({searchText: searchText});

    let filteredData = this.state.data.filter(function (item) {
      return item.displayName.toLowerCase().includes(searchText.toLowerCase()) || item.userId.toLowerCase().includes(searchText.toLowerCase())
    });

    this.setState({filteredData: filteredData})
  }




  renderFriendsCard = ({ item }) => (
    <FriendCard
      avatarUrl= {item.pictureUrl}
      avatarTitle= {item.userInitial}
      displayName = {item.displayName}
      userId = {item.userId}
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