import * as React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, FlatList, TouchableWithoutFeedback } from 'react-native';
import {Icon, Header, Avatar, Input, Button, ListItem, SearchBar} from 'react-native-elements'
import FriendCard from '../components/FriendCard';
import FriendTile from '../components/FriendTile';
import firebase from 'firebase';
import { backend } from '../constants/Environment';
import { SimpleAnimation } from 'react-native-simple-animations';


export default class FriendScreen extends React.Component {
  state = {
    searchText: "",
    data: [],
    filteredData: [],
    dropDownToggle: true
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
          containerStyle={{zIndex:200}}
          centerComponent={{ text: 'FRIENDS', style: { color: '#fff', fontSize: 20 } }}
          statusBarProps={{translucent: true}}
          rightComponent={
            <Icon
              name="user-plus"
              type="feather"
              color="white"
              underlayColor="translucent"
              onPress = {()=> {this.setState({dropDownToggle: !this.state.dropDownToggle})}}
            />
          }
        />

        {// Drop down menu when add user buttton clicked on header
        this.state.dropDownToggle && (
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
              <TouchableOpacity onPress={()=> {}}>
                <View style={{width: 100, height: 100, justifyContent: 'center', alignItems:'center'}}>
                  <Icon name="edit" type="entypo"/>
                  <Text style={{marginVertical: 5, fontSize: 10, fontWeight: 'bold'}}>Edit Friend</Text>
                </View>
              </TouchableOpacity>
              <View style={{height: '70%', borderWidth: 0.5, borderColor: '#EBEBEB'}}></View>
              <TouchableOpacity onPress={()=> {}}>
                <View style={{width: 100, height: 100, justifyContent: 'center', alignItems:'center'  }}>
                  <Icon name="user" type="feather"/>
                  <Text style={{marginVertical: 5, fontSize: 10, fontWeight: 'bold'}}>Add Friend</Text>
                </View>
              </TouchableOpacity>
              <View style={{height: '70%', borderWidth: 0.5, borderColor: '#EBEBEB'}}></View>
              <TouchableOpacity onPress={()=> {}}>
                <View style={{width: 100, height: 100, justifyContent: 'center', alignItems:'center' }}>
                  <Icon name="users" type="feather"/>
                  <Text style={{marginVertical: 5, fontSize: 10, fontWeight: 'bold'}}>Create Group</Text>
                </View>
              </TouchableOpacity>
            </View>
          </SimpleAnimation>
          )
        }
        {// greyed out background when dropdown is toggled
          this.state.dropDownToggle &&
          <TouchableWithoutFeedback onPress={()=>{this.setState({dropDownToggle: false})}}>
          <View style={{
            flex: 1,
            zIndex: 20,
            height: "100%", 
            width: '100%',
            position: 'absolute',
            backgroundColor: this.state.dropDownToggle ? 'black' : null, 
            opacity: this.state.dropDownToggle ? 0.4 : null,
          }}>
          </View>
          </TouchableWithoutFeedback>
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
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
  },
  friendsContent: {
    
  }
});
