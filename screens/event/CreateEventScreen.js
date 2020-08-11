import * as React from 'react';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity, TouchableHighlight, Picker, SectionList, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import * as GoogleSignIn from 'expo-google-sign-in';
import * as Facebook from 'expo-facebook';
import * as Location from 'expo-location';
import qs from 'qs';
import { ListItem, Image, Button, Text, Input, Icon, Divider, Header, SearchBar, CheckBox } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import AuthContext from 'contexts/AuthContext';
import firebase from 'firebase';
import firebaseObject from 'config/firebase';
import Constants from "expo-constants";
import MapView, { AnimatedRegion, Marker } from 'react-native-maps';
const { manifest } = Constants;
import { backend } from 'constants/Environment';

import { createEvent } from 'api/event';
import { fetchLocation } from 'api/misc';

import FriendCard from 'components/FriendCard';
import FriendTile from 'components/FriendTile';
import CustomInput from 'components/CustomInput';

import {formatDate, formatTime, combineDateAndTime, createDateAsUTC} from 'utils/date';

import googleSignInImage from 'assets/images/google_signin_buttons/web/1x/btn_google_signin_dark_normal_web.png';
import penaltyImage from 'assets/images/penalty.png';

const SCREEN = Dimensions.get('window');
const ASPECT_RATIO = SCREEN.width / SCREEN.height;
const LATITUDE_DELTA_MAP = 0.0922;
const LONGITUDE_DELTA_MAP = LATITUDE_DELTA_MAP * ASPECT_RATIO;


export default function CreateEventScreen({navigation}) {
  const [ step, setStep] = React.useState("Location");
  const [ eventName, setEventName] = React.useState("");
  const [ eventDescription, setEventDescription] = React.useState("");
  const [ eventDate, setEventDate] = React.useState(new Date());
  const [ eventTime, setEventTime] = React.useState(new Date());
  const [ showDatePicker, setShowDatePicker] = React.useState(false);
  const [ showTimePicker, setShowTimePicker] = React.useState(false);
  const [ maximumNumberOfMembers, setMaximumNumberOfMembers] = React.useState(1);
  const [ reminder, setReminder] = React.useState(15);
  const [ locationQuery, setLocationQuery] = React.useState("");
  const [ location, setLocation] = React.useState(null);
  const [ locationSearching, setLocationSearching] = React.useState(false);
  const [ isOnline, setIsOnline] = React.useState(false);
  const [ locationResult, setLocationResult] = React.useState([
    {
      group: "This week",
      data: [{
        name: "Hey Hi Hello Cafe",
        address: "4501 North Rd #101a, Burnaby, BC V3N 4J5, Canada"
      }, {
        name: "Hey Hi Hello Cafe",
        address: "4501 North Rd #101a, Burnaby, BC V3N 4J5, Canada"
      }]
    }, {
      group: "Recent Search",
      data: [{
        name: "Hey Hi Hello Cafe",
        address: "4501 North Rd #101a, Burnaby, BC V3N 4J5, Canada"
      }, {
        name: "Hey Hi Hello Cafe",
        address: "4501 North Rd #101a, Burnaby, BC V3N 4J5, Canada"
      }, {
        name: "Hey Hi Hello Cafe",
        address: "4501 North Rd #101a, Burnaby, BC V3N 4J5, Canada"
      }, {
        name: "Hey Hi Hello Cafe",
        address: "4501 North Rd #101a, Burnaby, BC V3N 4J5, Canada"
      }, {
        name: "Hey Hi Hello Cafe",
        address: "4501 North Rd #101a, Burnaby, BC V3N 4J5, Canada"
      }, {
        name: "Hey Hi Hello Cafe",
        address: "4501 North Rd #101a, Burnaby, BC V3N 4J5, Canada"
      }]
    }
  ]);
  const [ penalty, setPenalty] = React.useState("cigarette");
  const [ penaltyGame, setPenaltyGame] = React.useState("roulette");
  const [ searchText, setSearchText] = React.useState("");
  const [ friends, setFriends] = React.useState([]);
  const [ filteredData, setFilteredData] = React.useState();
  const [ selectedFriends, setSelectedFriends] = React.useState([]);
  const [ mapRegion, setMapRegion ] = React.useState();
  const mapRef = React.useRef();

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

    async function fetchData() {
        let location = await Location.getCurrentPositionAsync();
        let region = { latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: LATITUDE_DELTA_MAP, longitudeDelta: LONGITUDE_DELTA_MAP }
        setMapRegion(region);
    }
    fetchData()

    // retrieveFriend();
    // Sorts friends list on initial load

  }, []);

  async function publish() {
    let date = eventDate.setHours(eventTime.getHours(), eventTime.getMinutes(), 0);
    let event = {
      Name: eventName,
      Description: eventDescription,
      DateTime: date,
      MaxMember: maximumNumberOfMembers + 1,
      Reminder: reminder,
      Penalty: penalty,
      Status: "PENDING",
    };
    if (isOnline){
      event = {
        IsOnline: true,
        ...event
      }
    } else {
      event = {
        IsOnline: false,
        LocationName: location.place_name.split(',')[0],
        LocationAddress: location.place_name.split(',')[1],
        LocationGeolat: location.geometry.coordinates[1],
        LocationGeolong: location.geometry.coordinates[0],
        ...event
      }
    }

    let responseJson = await createEvent(event, selectedFriends);
    alert(responseJson.response);
    navigation.navigate('Event')
  }

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
        checked: selectedFriends.includes(item),
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
    console.log(item);
    if(!selectedFriends.includes(item)){
      if (selectedFriends.length < maximumNumberOfMembers) {
        setSelectedFriends([...selectedFriends, item])
      }
    } else {
      setSelectedFriends(selectedFriends.filter(a => a !== item));
    }
    console.log(selectedFriends)
  }


  function Setup() {
    return (
        <ScrollView
          contentContainerStyle={{
            height: 600,
          }}>
          <View>
            <Image
              source={{ uri: 'https://media-cdn.tripadvisor.com/media/photo-s/19/15/a7/68/gazzi-cafe.jpg'}}
              style={styles.locationBanner}
            />
          </View>
          <View>
            <CustomInput
              placeholder='Name your event title'
              label="Event Title"
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            <CustomInput
              containerStyle={{flex: 4}}
              placeholder='Who will be joining event?'
              label="Participants"
            />
            <TouchableOpacity style={{flex: 1}}>
              <Icon name='add' color='#ffffff'
                containerStyle={{
                  borderRadius: 5,
                  backgroundColor: "#15cdca",
                  justifyContent: 'center',
                  flex: 1,
                  marginTop: 25,
                  marginRight: 20
                }}
              />
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row'}}>
            <CustomInput
              containerStyle={{flex: 1}}
              placeholder='MM/DD/YYYY'
              label="Date"
            />
            <CustomInput
              containerStyle={{flex: 1}}
              placeholder='00:00 AM/PM'
              label="Time"
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            <CustomInput
              containerStyle={{flex: 1}}
              placeholder='What is the bet on?'
              label="Penalty"
            />
          </View>

        </ScrollView>

    )
  }

  async function searchLocation() {
    if (locationQuery === ''){
      return;
    }
    let url = '';
    let location = await Location.getCurrentPositionAsync({});
    let locationResults = await fetchLocation(location);
    setLocationResult(locationResults);

  }
  function LocationSearch() {
    return (
      <View style={{flex: 1}}>
        {locationSearching ? (
          <View style={{flex: 1}}>
          <View style={styles.searchBoxAbsolute}>
            <CustomInput
              containerStyle={{flex: 5}}
              placeholder='Seach Location?'
              inputStyle={{color: '#000000'}}
            />
            <TouchableOpacity style={{flex: 1}}>
              <Icon name='search' color='#aeaeae'
                containerStyle={{
                  borderRadius: 5,
                  justifyContent: 'center',
                  flex: 1,
                }}
              />
            </TouchableOpacity>
          </View>
          <MapView
              ref={mapRef}
              style={styles.map}
              initialRegion={mapRegion}
          >
          </MapView>
          <View style={styles.selectedLocationBox}>
            <View style={{flexDirection: 'row'}}>
              <Text h4 style={styles.locationTitle}>Juilet Cafe</Text>
              <Text h5 style={styles.locationCategory}>Cafe | Dessert</Text>
            </View>
            <View style={{flexDirection: 'row', marginTop: 15}}>
              <Text style={styles.locationRowTitle}>Address: </Text>
              <Text style={styles.locationRowContent}>V3N 4N3, North Rd, Burnaby, BC, Canada</Text>
            </View>

          </View>
          </View>
        ) : (
          <View style={{flex: 1}}>
            <View style={styles.searchBox}>
              <CustomInput
                containerStyle={{flex: 5}}
                placeholder='Seach Location?'
                inputStyle={{color: '#000000'}}
              />
              <TouchableOpacity style={{flex: 1}}>
                <Icon name='search' color='#aeaeae'
                  containerStyle={{
                    borderRadius: 5,
                    justifyContent: 'center',
                    flex: 1,
                  }}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.locationSearchResultContainer}>
              <SectionList
                sections={locationResult}
                keyExtractor={(item, index) => item + index}
                renderItem={({ item }) => <ListItem
                  title={item.name}
                  subtitle={item.address}
                  titleStyle={styles.locationSearchResultTitle}
                  subtitleStyle={styles.locationSearchResultAddress}
                  leftAvatar={{ source: { uri: 'https://f0.pngfuel.com/png/816/649/map-computer-icons-flat-design-location-logo-location-icon-png-clip-art.png' } }}
                />}
                renderSectionHeader={({ section: { group } }) => (
                  <Text style={styles.locationSearchResultHeader}>{group}</Text>
                )}
              />
            </View>
          </View>
        )}
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
      <Icon name={name} color='#fff' underlayColor="transparent" onPress={onPress}/>
    )
  }

  function RightComponent() {
    let name = (step !== 'Penalty') && 'chevron-right';
    let text = (step === 'Penalty') && 'PUBLISH';
    let onPress;
    let condition;
    if (step === 'Event Detail') {
      condition = (eventName && eventDate && eventTime && reminder && maximumNumberOfMembers) ? true : false
      return (
        <Text style={{color: !condition ? 'black' : '#fff' }}
          disabled={!condition}
          disabledStyle={{'backgroundColor': 'transparent'}}
          onPress={() => { if(condition) setStep('Location') }}>
          NEXT
        </Text>
      )
    } else if (step === 'Location') {
      //Needs to be changed back to true: false
      condition = location || isOnline ? true : true;
      return (
        <Text style={{color: !condition ? 'black' : '#fff' }}
          disabled={!condition}
          disabledStyle={{'backgroundColor': 'transparent'}}
          onPress={() => { if(condition) setStep('Members') }}>
          NEXT
        </Text>
      )
    } else if (step === 'Members') {
      condition = true;
      return (
        <Text style={{color: !condition ? 'black' : '#fff' }}
          disabled={!condition}
          disabledStyle={{'backgroundColor': 'transparent'}}
          onPress={() => { if(condition) setStep('Penalty') }}>
          {selectedFriends.length > 0 ? 'NEXT' : 'SKIP'}
        </Text>
      )
    } else {
      condition = penalty ? true : false;
      onPress = () => publish();
      return (
        <Text style={{color: !condition ? 'black' : '#fff' }}
          disabled={!condition}
          disabledStyle={{'backgroundColor': 'transparent'}}
          onPress={() => { if(condition) publish() }}>
          PUBLISH
        </Text>
      )
    }
  }

  return (

    <View style={styles.container}>
      <Header
        backgroundColor="#ffffff"
        leftComponent={() => <Icon name="chevron-left" color='#000' underlayColor="transparent" onPress={() => navigation.navigate("Event")} />}
        centerComponent={{ text: step, style: { color: '#000' } }}
        />
        {step === "Location" && LocationSearch()}
        {step === "Setup" && Setup()}
        {step === "Members" && Members()}
        {step === "Penalty" && Penalty()}
    </View>

  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'stretch',
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
    locationBanner: {
      height: 200,
    },
    searchBoxAbsolute: {
      marginTop: 15,
      zIndex: 1,
      position: 'absolute',
      marginLeft: 20,
      marginRight: 20,
      backgroundColor: '#fefefe',
      borderRadius: 5,
      flexDirection: 'row'
    },
    searchBox: {
      marginTop: 15,
      marginLeft: 20,
      marginRight: 20,
      backgroundColor: '#fefefe',
      borderRadius: 5,
      flexDirection: 'row'
    },
    map: {
      flex: 2
    },
    selectedLocationBox: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1,
      borderRadius: 15,
      padding: 23,
      backgroundColor: "#fafafa",
    },
    locationTitle: {
      textAlignVertical: 'bottom'
    },
    locationCategory: {
      marginLeft: 10,
      textAlignVertical: 'bottom'
    },
    locationRowTitle: {
      fontFamily: "OpenSans_400Regular",
      fontSize: 16,
      fontWeight: "700",
      letterSpacing: 0,
      color: "#000000"
    },
    locationRowContent: {
      fontFamily: "OpenSans_400Regular",
      fontSize: 16,
      fontWeight: "300",
      letterSpacing: 0,
      color: "#808080"
    },
    locationSearchResultContainer: {
      flex: 1,
      borderRadius: 10,
      backgroundColor: "#fefefe",
      marginTop: 20,
      marginLeft: 20,
      marginRight: 20,
      marginBottom: 50
    },
    locationSearchResultHeader: {
      fontFamily: "OpenSans_400Regular",
      fontSize: 16,
      fontWeight: "300",
      letterSpacing: 0,
      color: "#15cdca",
      marginLeft: 10,
      marginTop: 10
    },
    locationSearchResultTitle: {
      fontFamily: "OpenSans_400Regular",
      fontSize: 14,
      fontWeight: "700",
      letterSpacing: 0,
      color: "#000000",
    },
    locationSearchResultAddress: {
      fontFamily: "OpenSans_400Regular",
      fontSize: 12,
      fontWeight: "300",
      letterSpacing: 0,
      color: "#4a4a4a",
    }
});
