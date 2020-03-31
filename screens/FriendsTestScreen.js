import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import {Icon, Header, Avatar, Input, Button} from 'react-native-elements'
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import FriendCard from '../components/FriendCard';
import Collapse from '../components/Collapse';



export default class FriendsScreen extends Component {

  renderItem = ({ item }) => (
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
            <Input 
              placeholder="Search"
              leftIcon={{ type: 'antdesign', name: 'search1' }}
            />
          }
        />
        <View style={{flex:1}}>
        <FlatList
          data={friendsData}
          renderItem={this.renderItem}
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
