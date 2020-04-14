import * as React from 'react';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity, TouchableHighlight, Picker, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import * as GoogleSignIn from 'expo-google-sign-in';
import * as Facebook from 'expo-facebook';
import * as Location from 'expo-location';
import qs from 'qs';
import { ListItem, Image, Button, Text, Input, Icon, Divider, Header, SearchBar } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import AuthContext from '../contexts/AuthContext';
import firebase from 'firebase';
import firebaseObject from '../config/firebase';


import FriendCard from '../components/FriendCard';
import FriendTile from '../components/FriendTile';

import {formatDate, formatTime, combineDateAndTime} from '../utils/date';

import googleSignInImage from '../assets/images/google_signin_buttons/web/1x/btn_google_signin_dark_normal_web.png';
import penaltyImage from '../assets/images/robot-dev.png';


export default function CreateEventScreen({navigation}) {
  const [ step, setStep] = React.useState("Event Detail");
  const [ eventName, setEventName] = React.useState("");
  const [ eventDate, setEventDate] = React.useState(new Date());
  const [ eventTime, setEventTime] = React.useState(new Date());
  const [ showDatePicker, setShowDatePicker] = React.useState(false);
  const [ showTimePicker, setShowTimePicker] = React.useState(false);
  const [ maximumNumberOfMembers, setMaximumNumberOfMembers] = React.useState(1);
  const [ reminder, setReminder] = React.useState(15);
  const [ locationQuery, setLocationQuery] = React.useState("");
  const [ location, setLocation] = React.useState(null);
  const [ locationResult, setLocationResult] = React.useState([]);
  const [ penalty, setPenalty] = React.useState("cigarette");
  const [ penaltyGame, setPenaltyGame] = React.useState("roulette");
  const [ searchText, setSearchText] = React.useState("");
  const [ friends, setFriends] = React.useState(friendsData);
  const [ filteredData, setFilteredData] = React.useState([]);
  const [ selectedFriends, setSelectedFriends] = React.useState([]);


  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    // Sorts friends list on initial load
    friendsData.sort((a,b) => a.displayName.localeCompare(b.displayName));
    setFriends(friendsData);
  }, []);

  async function publish() {
    let date = eventDate.setHours(eventTime.getHours(), eventTime.getMinutes(), eventTime.getSeconds());
    let response = await fetch('http://192.168.1.73:3000/event/insert', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Name: eventName,
        Description: "",
        LocationName: location.place_name.split(',')[0],
        LocationAddress: location.place_name.split(',')[1],
        LocationGeolat: location.geometry.coordinates[1],
        LocationGeolong: location.geometry.coordinates[0],
        DateTime: date,
        MaxMember: maximumNumberOfMembers,
        Reminder: reminder,
        Penalty: penalty,
        Status: "PENDING"
      }),
    });
    let responseJson = await response.json();
    alert("Added record");
    navigation.navigate('Event')
  }

  function cancel() {

  }

  function friendSearch(text) {
    setSearchText(text);

    let filtered = friends.filter(function (item) {
      return item.displayName.toLowerCase().includes(text.toLowerCase()) || item.userId.toLowerCase().includes(text.toLowerCase())
    });

    setFilteredData(filtered)
  }

  function renderFriendsCard({ item }){
    return (
    <FriendCard
      avatarUrl= {item.pictureUrl}
      avatarTitle= {item.userInitial}
      displayName = {item.displayName}
      userId = {item.userId}
      checkBox={{
        size: 35,
        checkedIcon: 'dot-circle-o',
        uncheckedIcon: 'circle-o',
        checkedColor:'#ff8a8a',
        uncheckedColor: '#ff8a8a',
        checked: selectedFriends.includes(item),
        onPress: () => selectFriend(item)
      }}
    />
    )
  }

  function renderFriendsTile({ item }){
    return (
    <FriendTile
      avatarUrl= {item.pictureUrl}
      avatarTitle= {item.userInitial}
      displayName = {item.displayName}
      userId = {item.userId}
      pressMinus = {() => selectFriend(item)}
    />
  )}

  function selectFriend (item) {
    if(!selectedFriends.includes(item)){
      setSelectedFriends([...selectedFriends, item])
    } else {
      setSelectedFriends(selectedFriends.filter(a => a !== item));
    }
  }


  function EventDetail() {
    return (
      <ScrollView
        contentContainerStyle={{
          height: 600
        }}>
        <View style={styles.row}>
          <View>
            <View style={styles.row}>
              <Text h4>Event Name</Text>
            </View>
            <View style={styles.row}>
              <Input
                  onChangeText={text => setEventName(text)}
                  value={eventName}
                  inputContainerStyle={{
                    borderWidth: 1,
                  }}
                />
            </View>
          </View>
        </View>
        <View style={styles.row}>
          <View>
            <View style={styles.row}>
              <Text h4>Event Date</Text>
            </View>
            <View style={styles.row}>
              <TouchableOpacity style={styles.onePicker} onPress={() => {setShowDatePicker(true); setShowTimePicker(false)}}>
                <Text style={styles.textCenter}>{formatDate(eventDate)}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.row}>
              <TouchableOpacity style={styles.onePicker} onPress={() => {setShowDatePicker(false); setShowTimePicker(true)}}>
                <Text style={styles.textCenter}>{formatTime(eventTime)}</Text>
              </TouchableOpacity>
            </View>
            {showDatePicker && <DateTimePicker
              value={eventDate}
              mode="date"
              display="default"
              onChange={(event, date) => {setShowDatePicker(false); date && setEventDate(date)}}
            />}
            {showTimePicker && <DateTimePicker
              value={eventTime}
              mode="time"
              display="default"
              onChange={(event, date) => {setShowTimePicker(false); date && setEventTime(date)}}
            />}
          </View>
        </View>
        <View style={styles.row}>
          <View>
            <View style={styles.row}>
              <Text h4>How many friends are coming</Text>
              </View>
            <View style={styles.row}>
              <TouchableOpacity style={styles.columnButton} onPress={() => setMaximumNumberOfMembers(maximumNumberOfMembers+1)}>
                <Icon name="plus" type="antdesign" color="black"/>
              </TouchableOpacity>
              <View style={styles.column}>
                <Text h4 style={styles.textCenter}>{maximumNumberOfMembers}</Text>
              </View>
              <TouchableOpacity style={styles.columnButton} onPress={() => maximumNumberOfMembers > 0 && setMaximumNumberOfMembers(maximumNumberOfMembers-1)}>
                <Icon name="minus" type="antdesign" color="black"/>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View>
            <View style={styles.row}>
            <Text h4>Reminder</Text>
            </View>
            <View style={styles.row}>
              <Picker
                style={styles.onePicker}
                selectedValue={reminder}
                onValueChange={(itemValue) => setReminder(itemValue)}
              >
                <Picker.Item label="Before 15 min" value="15" />
                <Picker.Item label="Before 30 min" value="30" />
                <Picker.Item label="Before 45 min" value="45" />
                <Picker.Item label="Before 60 min" value="60" />
              </Picker>
            </View>
          </View>
        </View>
      </ScrollView>
    )
  }

  async function searchLocation() {
    let url = '';
    let location = await Location.getCurrentPositionAsync({});
    try {
      url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURI(locationQuery) + '.json?' + qs.stringify({
        proximity: location.coords.longitude + ',' + location.coords.latitude,
        access_token: 'pk.eyJ1IjoiY3Jlc2NlbnQ5NzIzIiwiYSI6ImNrOGdtbzhjZjAxZngzbHBpb3NubnRwd3gifQ.wesLzeTF2LjrYjgmrfrySQ',
        limit: 10
      });
      let response = await fetch(url);
      let responseJson = await response.json();
      setLocationResult(responseJson.features);
    } catch (error) {
      console.error(error);
    }
  }
  function LocationSearch() {
    return (
      <View style={{flex: 1}}>
        <View style={{flexDirection: 'row'}}>
          <Input
            containerStyle={{flex: 1}}
            value={locationQuery}
            onChangeText={setLocationQuery}
            placeholder="Type Address..."
            />
          <Button
            icon={
              <Icon name="search" size={25} color="white" />
            }
            onPress={searchLocation}
          />
        </View>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          {locationResult.map((item, index) => (
            <ListItem
              key={index}
              title={item.text}
              subtitle={item.properties.address}
              onPress={() => {console.log(item); setLocation(item)}}
              rightIcon={location && item.id === location.id ? { name: 'check' } : null}
              bottomDivider
            />
          ))}
        </ScrollView>
      </View>
    )
  }

  function Members() {
    return (
        <View style={{flex: 1, justifyContent: "center", backgroundColor: "white"}}>
          <View style={{
            minHeight: 90,
            backgroundColor: "#E1E1E1",
          }}>
            <FlatList
              data={selectedFriends}
              renderItem={renderFriendsTile}
              contentContainerStyle={{
                padding: 10,
              }}
              keyExtractor={(item) => item.userId}
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
    )
  }

  function Penalty() {
    return (
      <View style={styles.formContainer}>
        <View style={styles.row}>
          <Text h4>Choose the penalty</Text>
        </View>
        <View style={styles.row}>
          <Image
            source={penaltyImage}
            style={{ width: 200, height: 200 }}
          />
        </View>
        <View style={styles.row}>
          <Picker
            style={styles.onePicker}
            selectedValue={penalty}
            onValueChange={(itemValue) => setPenalty(itemValue)}
          >
            <Picker.Item label="Buys cig" value="cigarette" />
            <Picker.Item label="Buys americano" value="americano" />
            <Picker.Item label="Money" value="money" />
          </Picker>
        </View>
        <View style={styles.row}>
          <Picker
            style={styles.onePicker}
            selectedValue={penaltyGame}
            onValueChange={(itemValue) => setPenaltyGame(itemValue)}
          >
            <Picker.Item label="ROULETTE" value="roulette" />
          </Picker>
        </View>
      </View>
    )
  }


  function LeftComponent() {
    let name = (step === 'Event Detail') ? 'close' : 'chevron-left';
    let onPress;
    if (step === 'Event Detail') {
      onPress = () => navigation.navigate("Event");
    } else if (step === 'Location') {
      onPress = () => setStep('Event Detail');
    } else if (step === 'Members') {
      onPress = () => setStep('Location');
    } else {
      onPress = () => setStep('Members');
    }
    return (
      <Icon name={name} color='#fff' onPress={onPress}/>
    )
  }

  function RightComponent() {
    let name = (step !== 'Penalty') && 'chevron-right';
    let text = (step === 'Penalty') && 'PUBLISH';
    let onPress;
    let condition;
    if (step === 'Event Detail') {
      condition = (eventName && eventDate && eventTime && reminder && maximumNumberOfMembers) ? true : false
      onPress = () => setStep('Location');
      return (
        <Icon name="chevron-right" color={!condition ? 'black' : '#fff'} disabled={!condition} disabledStyle={{'backgroundColor': 'transparent'}} onPress={condition && onPress}/>
      )
    } else if (step === 'Location') {
      //Needs to be changed back to true: false
      condition = location ? true : true;
      onPress = () => setStep('Members');
      return (
        <Icon name="chevron-right" color={!condition ? 'black' : '#fff'} disabled={!condition} disabledStyle={{'backgroundColor': 'transparent'}} onPress={condition && onPress}/>
      )
    } else if (step === 'Members') {
      condition = true;
      onPress = () => setStep('Penalty');
      return (
        <Icon name="chevron-right" color={!condition ? 'black' : '#fff'} disabled={!condition} disabledStyle={{'backgroundColor': 'transparent'}} onPress={condition && onPress}/>
      )
    } else {
      condition = penalty ? true : false;
      onPress = () => publish();
      return (
        <Text style={{color: !condition ? 'black' : '#fff' }} disabled={!condition} disabledStyle={{'backgroundColor': 'transparent'}} onPress={condition && onPress}>PUBLISH</Text>
      )
    }
  }

  return (
    <View style={styles.container}>
      <Header
        leftComponent={LeftComponent}
        centerComponent={{ text: 'CREATE EVENT', style: { color: '#fff' } }}
        rightComponent={RightComponent}
        />

        <View style={styles.stepContainer}>
          <View style={styles.stepComplete}>
            <Text style={styles.stepText}>Event Detail</Text>
          </View>
          <View style={step !== 'Event Detail' ? styles.stepComplete : styles.step}>
            <Text style={styles.stepText}>Location</Text>
          </View>
          <View style={step === 'Members' || step === 'Penalty' ? styles.stepComplete : styles.step}>
            <Text style={styles.stepText}>Members</Text>
          </View>
          <View style={step === 'Penalty' ? styles.stepComplete : styles.step}>
            <Text style={styles.stepText}>Penalty</Text>
          </View>
        </View>

        {step === "Event Detail" && EventDetail()}
        {step === "Location" && LocationSearch()}
        {step === "Members" && Members()}
        {step === "Penalty" && Penalty()}
    </View>

  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'stretch'
    },
    stepContainer: {
      flexDirection: 'row',
    },
    stepComplete: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,1)',
      height: 30
    },
    step: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.6)',
      height: 30
    },
    stepText: {
      flex: 1,
      color: 'white',
      textAlign: 'center',
      height: 30,
      lineHeight: 30,
      fontWeight: 'bold',
    },
    formContainer: {
      margin: 0,
      flex: 10,
      justifyContent: 'center',
    },
    row: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    column: {
      flex: 1
    },
    columnButton: {
      flex: 1,
      borderWidth: 1,
      borderColor: 'black',
      marginLeft: 5,
      marginRight: 5
    },
    onePicker: {
      width: 200,
      backgroundColor: '#FFF0E0',
    },
    textCenter: {
      textAlign: 'center'
    },
    locationSearch: {
      flex: 1
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
