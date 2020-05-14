import * as React from 'react';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity, Picker } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import * as GoogleSignIn from 'expo-google-sign-in';
import * as Facebook from 'expo-facebook';
import { Image, Button, Text, Input, Icon, CheckBox, Header, SearchBar } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import AuthContext from '../contexts/AuthContext';
import firebase from 'firebase';
import firebaseObject from '../config/firebase';
import { formatDate, formatTime } from '../utils/date';
import Collapse from '../components/Collapse';
import { AsyncStorage, FlatList } from 'react-native';
import { backend } from '../constants/Environment';
import FriendCard from '../components/FriendCard';
import googleSignInImage from '../assets/images/google_signin_buttons/web/1x/btn_google_signin_dark_normal_web.png';
import penaltyImage from '../assets/images/robot-dev.png';

export default function FilterEventScreen({ navigation }) {

  const [date, setDate] = React.useState(new Date());

  const [friends, setFriends] = React.useState([]);
  const [searchFriendText, setSearchFriendText] = React.useState("");
  const [searchedFriends, setSearchedFriends] = React.useState([]);
  const [selectedFriends, setSelectedFriends] = React.useState([]);

  const [locations, setLocations] = React.useState([]);
  const [searchLocationText, setSearchLocationText] = React.useState("");
  const [searchedLocations, setSearchedLocations] = React.useState([]);
  const [selectedLocations, setSeletedLocations] = React.useState([]);



  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function retrieveFriends() {
      let response = await fetch(`http://${backend}:3000/relationship/${firebase.auth().currentUser.uid}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      let responseJson = await response.json();
      responseJson.response.sort((a, b) => a.Nickname.localeCompare(b.Nickname));
      setFriends(responseJson.response);

      let eventResponse = await fetch(`http://${backend}:3000/event/accepted/${firebase.auth().currentUser.uid}`);
      let eventJson = await eventResponse.json();
      let arry = [];
      eventJson.forEach(event => {
        if (locations.filter(location => location === event.LocationName).length == 0) {
          arry.push(event.LocationName);
        }
      });
      setLocations(arry);
    }
    retrieveFriends();
    _retrieveFilter();
  }, []);


  function friendSearch(text) {
    setSearchFriendText(text);
    let filtered = friends.filter(function (item) {
      return item.Nickname.toLowerCase().includes(text.toLowerCase()) || item.Username.toLowerCase().includes(text.toLowerCase())
    });
    setSearchedFriends(filtered)
  }

  function locationSearch(text) {
    setSearchLocationText(text);
    let filtered = locations.filter(function (item) {
      return item.toLowerCase().includes(text.toLowerCase())
    });
    setSearchedLocations(filtered)
  }

  function selectFriend(item) {
    if (selectedFriends.filter(friend => friend.UserId === item.UserId).length == 0) {
      setSelectedFriends([...selectedFriends, item])
    } else {
      setSelectedFriends(selectedFriends.filter(a => a.UserId !== item.UserId));
    }
  }

  function selectLocation(item) {
    if (selectedLocations.filter(location => location === item).length == 0) {
      setSeletedLocations([...selectedLocations, item])
    } else {
      setSeletedLocations(selectedLocations.filter(a => a !== item));
    }
  }

  function renderFriendsCard({ item }) {
    return (
      <FriendCard
        avatarUrl={item.AvatarURI}
        avatarTitle={!item.AvatarURI && item.Nickname.substr(0, 2).toUpperCase()}
        displayName={item.Nickname}
        userId={item.Username}
        checkBox={{
          size: 35,
          checkedIcon: 'dot-circle-o',
          uncheckedIcon: 'circle-o',
          checkedColor: '#ff8a8a',
          uncheckedColor: '#ff8a8a',
          checked: selectedFriends.filter(friend => friend.UserId === item.UserId).length > 0,
          onPress: () => selectFriend(item)
        }}
      />
    )
  }

  function renderLocations({ item }) {
    return (
      <CheckBox
        right
        iconRight
        title={item}
        checkedIcon='dot-circle-o'
        uncheckedIcon='circle-o'
        bottomDivider
        checked={selectedLocations.filter(location => location === item).length > 0}
        onPress={() => selectLocation(item)}
      />
    )
  }

  function applyFilter() {
    _storeData()
  }

  async function _storeData() {

    let filter = {
      date: date,
      friends: selectedFriends,
      locations: selectedLocations,
    }
    console.log(filter);
    try {
      await AsyncStorage.setItem('ongoingeventfilter', JSON.stringify(filter));
    } catch (error) {
      // Error saving data
    }
  };

  async function _retrieveFilter() {
    try {
      const value = await AsyncStorage.getItem('ongoingeventfilter');
      if (value !== null) {
        setDate(new Date(JSON.parse(value).date));
        setSelectedFriends(JSON.parse(value).friends);
        setSeletedLocations(JSON.parse(value).locations);
      }
    } catch (error) {
      // Error retrieving data
    }
  };


  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  return (
    <View style={styles.container}>
      <Header
        leftComponent={{ icon: 'chevron-left', color: '#fff', onPress: () => navigation.navigate('Event') }}
        centerComponent={{ text: 'FILTER EVENT', style: { color: '#fff' } }}
        rightComponent={{ icon: 'check', color: '#fff', onPress: () => applyFilter() }}
      />
      <Collapse
        title="Date"
        collapsed={true}
        content={
          <View>
            <DateTimePicker
              timeZoneOffsetInMinutes={0}
              value={date}
              mode={'date'}
              display="default"
              onChange={onChange}
            />
          </View>
        }
      />
      <Collapse
        title="Friends"
        collapsed={true}
        content={
          <View>
            <SearchBar
              round={true}
              lightTheme={true}
              placeholder="Search..."
              autoCapitalize='none'
              autoCorrect={false}
              onChangeText={friendSearch}
              value={searchFriendText}
              containerStyle={{
                backgroundColor: "white",
                margin: 10,
                borderColor: "#C4C4C4",
                borderWidth: 1,
                borderRadius: 10,
                padding: 3
              }}
              inputContainerStyle={{
                backgroundColor: "white"
              }}
              inputStyle={{
                backgroundColor: "white"
              }}
              leftIconContainerStyle={{
                backgroundColor: "white"
              }}
              rightIconContainerStyle={{
                backgroundColor: "white"
              }}
            />
            <FlatList
              data={searchedFriends && searchedFriends.length > 0 ? searchedFriends : (searchFriendText.length === 0 && friends)}
              renderItem={renderFriendsCard}
              keyExtractor={(item) => item.UserId}
              contentContainerStyle={{
                backgroundColor: "white"
              }}
              bounces={false}
            />
          </View>
        }
      />
      <Collapse
        title="Location"
        collapsed={true}
        content={
          <View>
            <SearchBar
              round={true}
              lightTheme={true}
              placeholder="Search..."
              autoCapitalize='none'
              autoCorrect={false}
              onChangeText={locationSearch}
              value={searchLocationText}
              containerStyle={{
                backgroundColor: "white",
                margin: 10,
                borderColor: "#C4C4C4",
                borderWidth: 1,
                borderRadius: 10,
                padding: 3
              }}
              inputContainerStyle={{
                backgroundColor: "white"
              }}
              inputStyle={{
                backgroundColor: "white"
              }}
              leftIconContainerStyle={{
                backgroundColor: "white"
              }}
              rightIconContainerStyle={{
                backgroundColor: "white"
              }}
            />
            <FlatList
              data={searchedLocations && searchedLocations.length > 0 ? searchedLocations : (searchLocationText.length === 0 && locations)}
              renderItem={renderLocations}
              keyExtractor={(item) => item}
              contentContainerStyle={{
                backgroundColor: "white"
              }}
              bounces={false}
            />
          </View>
        }
      />
    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch'
  },
});
