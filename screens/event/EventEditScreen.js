import * as React from 'react';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity, AsyncStorage, TouchableHighlight, Picker, FlatList, SectionList, Dimensions, Keyboard } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import * as GoogleSignIn from 'expo-google-sign-in';
import * as Facebook from 'expo-facebook';
import * as Location from 'expo-location';
import qs from 'qs';
import { ListItem, Image, Button, Text, Slider, Input, Icon, Divider, Header, SearchBar, CheckBox } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import AuthContext from 'contexts/AuthContext';
import firebase from 'firebase';
import firebaseObject from 'config/firebase';
import Constants from "expo-constants";
import MapView, { AnimatedRegion, Marker } from 'react-native-maps';
const { manifest } = Constants;
import { backend } from 'constants/Environment';

import { createEvent,getEvent } from 'api/event';

import FriendCard from 'components/FriendCard';
import FriendTile from 'components/FriendTile';
import CustomInput from 'components/CustomInput';
import NextStep from 'components/NextStep';
import PreviousStep from 'components/PreviousStep';

import {formatDate, formatTime, formatDateFormat, combineDateAndTime, createDateAsUTC} from 'utils/date';

import googleSignInImage from 'assets/images/buttons/google_signin_buttons/web/1x/btn_google_signin_dark_normal_web.png';
import penaltyImage from 'assets/images/miscs/penalty.png';

const SCREEN = Dimensions.get('window');
const ASPECT_RATIO = SCREEN.width / SCREEN.height;
const LATITUDE_DELTA_MAP = 0.0922;
const LONGITUDE_DELTA_MAP = LATITUDE_DELTA_MAP * ASPECT_RATIO;

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const SetupStack = createStackNavigator();

export default function EventEditScreen({navigation, route}) {
  const [ step, setStep] = React.useState("Location");
  const [ eventName, setEventName] = React.useState("");
  const [ eventDescription, setEventDescription] = React.useState("");
  const [ eventMembers, setEventMembers] = React.useState([]);
  const [ invitedMembers, setInvitedMembers] = React.useState([]);
  const [ eventDate, setEventDate] = React.useState(new Date());
  const [ eventTime, setEventTime] = React.useState(new Date());
  const [ showDatePicker, setShowDatePicker] = React.useState(false);
  const [ showTimePicker, setShowTimePicker] = React.useState(false);
  const [ maximumNumberOfMembers, setMaximumNumberOfMembers] = React.useState(1);
  const [ locationQuery, setLocationQuery] = React.useState("");
  const [ location, setLocation] = React.useState(null);
  const [ locationSearching, setLocationSearching] = React.useState(false);
  const [ isOnline, setIsOnline] = React.useState(false);
  const [ locationResult, setLocationResult] = React.useState([]);
  const [ locationHistory, setLocationHistory] = React.useState([]);
  const [ penalty, setPenalty] = React.useState("cigarette");
  const [ friends, setFriends] = React.useState([
    {
      title: "Group",
      data: []
    },
    {
      title: "All Contacts",
      data: [{
        UserId: "eIsb3yMPlScSy5QAtpnqfqzON8r1",
        Username: "Crescent9723",
        Nickname: "Crescent9723",
        AvatarURI: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80",
        AvatarColor: "#D47FA6"
      },
      {
        UserId: "dKnJbXjjXwg13Bfkb4jBUcwKzGU2",
        Username: "chiyy1231",
        Nickname: "chiyy1231",
        AvatarURI: "https://lh3.googleusercontent.com/proxy/ajInWbANUxvZ5pd4vjow2p-d1pHN7NYKQBn5Z3gXmOGbMaLoD_SdskZxl9gEiWV7gsB-mnAuuVsfOlNpz9_g7K8GlFSn3SwRTr9pbwthUj6qV4IL-rKsJBbnhK966_hNbUxviIAV6XJ0rdzOuU9k6vv4LjS-fYPnDg",
        AvatarColor: "#D47FA6"
      }]
    }
  ]);
  const [ friendQuery, setFriendQuery] = React.useState("");
  const [ filteredData, setFilteredData] = React.useState();
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

    async function fetchRecentLocation() {
      let locations = await AsyncStorage.getItem("recentLocation");
      if (locations) {
        locations = JSON.parse(locations);
        setLocationHistory([{
          group: "Recent Location",
          data: locations
        }])
      } else {
        setLocationHistory([{
          group: "Recent Location",
          data: []
        }])
      }


    }
    async function fillEvent(){
      let event = await getEvent(route.params.EventId);
      setEventName(event.Name);
      setEventDescription(event.Description);
      setEventMembers(event.eventUsers.filter(users => !users.IsHost));
      setEventDate(new Date(event.DateTime));
      setEventTime(new Date(event.DateTime));
      setMaximumNumberOfMembers(event.MaxMemeber);
      let location = { name:event.LocationName, geolat:event.LocationGeolat, geolong:event.LocationGeolong, address:event.LocationAddress}
      setLocation(location);
      setStep("Review");
    }
    fillEvent()
    fetchData()
    fetchRecentLocation()

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
      Penalty: penalty,
    };
    if (isOnline){
      event = {
        IsOnline: true,
        ...event
      }
    } else {
      event = {
        LocationName: location.name,
        LocationAddress: location.address.split(',')[1],
        LocationGeolat: location.geolat,
        LocationGeolong: location.geolong,
        ...event
      }
    }

    let responseJson = await createEvent(event, eventMembers);
    console.log(responseJson);
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
      avatarTitle= {item.Nickname.substr(0, 2).toUpperCase()}
      displayName = {item.Nickname}
      userId = {item.Username}
      checkBox={{
        size: 20,
        checkedIcon: 'dot-circle-o',
        uncheckedIcon: 'circle-o',
        checkedColor:'#d3d3d3',
        uncheckedColor: '#d3d3d3',
        checked: invitedMembers.includes(item),
        onPress: () => selectFriend(item)
      }}
    />
    )
  }

  function selectFriend (item) {
    if(!invitedMembers.includes(item)){
      if (invitedMembers.length < maximumNumberOfMembers) {
        setInvitedMembers([...invitedMembers, item])
      }
    } else {
      setInvitedMembers(invitedMembers.filter(a => a !== item));
    }
  }

  function FinalReview() {
    return (
      <View style={{flex: 1}}>
      <Header
        backgroundColor="#ffffff"
        leftComponent={() => <Icon name="chevron-left" color='#000' underlayColor="transparent" onPress={() => navigation.navigate('Event Detail New', {
            EventId: route.params.EventId
          })} />}
        centerComponent={{ text: "Final Review", style: { color: '#000' } }}
        />
        <View style={{flex: 2}}>
          <Text style={styles.reviewHeader}>Do we have a go?</Text>
          <Text style={styles.reviewDescription}>Please make sure you have the correct information.{"\n"}You can also edit after inviting.</Text>
        </View>
        <View style={styles.reviewInformationContainer}>
          <Text style={styles.reviewLocationTitle}>{location.name}</Text>
          <Text style={styles.reviewLocationAddress}>{location.address}</Text>
          <View style={styles.reviewDateSectionContainer}>
            <View style={styles.reviewDateIconContainer}>
              <Image source={ require('assets/icons/create/calendar.png') }
              style={styles.reviewDateIcon} resizeMode={'contain'} />
            </View>
            <View style={styles.reviewDateInformationContainer}>
              <Text style={styles.reviewDateInformationTime}>Arrive by {formatTime(eventTime)}</Text>
              <Text style={styles.reviewDateInformationDate}>{formatDateFormat(eventDate, 'iiii, LLLL d')}</Text>
            </View>
          </View>
          <View style={styles.reviewPenaltySectionContainer}>
            <View style={styles.reviewPenaltyIconContainer}>
            </View>
            <View style={styles.reviewPenaltyInformationContainer}>
              <Text style={styles.reviewPenaltyInformationPenalty}>{penalty}</Text>
              <Text style={styles.reviewPenaltyInformationDescription}>Loser's penalty</Text>
            </View>
          </View>
          <View style={styles.reviewParticipantSectionContainer}>
            <Text style={styles.reviewParticipantHeader}>Participants</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.reviewParticipantList}>
                {eventMembers.map((member, index) => {
                    return (
                      <View style={styles.reviewParticipantContainer}>
                        <Image
                          key={index}
                          source={{uri: member.AvatarURI}}
                          style={styles.reviewParticipantAvatar}
                          containerStyle={styles.reviewParticipantAvatarContainer}
                          placeholderStyle={styles.reviewParticipantAvatar}
                          overlayContainerStyle={styles.reviewParticipantAvatarContainer}
                          resizeMode='contain'
                        />
                        <Text style={styles.reviewParticipantName}>{member.Nickname}</Text>
                      </View>
                    )
                })}
            </ScrollView>
          </View>
          {returnNextStep()}
        </View>

      </View>
    )
  }

  function SetupMember() {
    return (
      <View style={{flex: 1}}>
      <Header
        backgroundColor="#ffffff"
        leftComponent={() => <Icon name="chevron-left" color='#000' underlayColor="transparent" onPress={() => navigation.navigate('Event Detail New', {
            EventId: route.params.EventId
          })} />}
        centerComponent={{ text: "Add Members", style: { color: '#000' } }}
        rightComponent={() => <Icon name="check" color='#000' underlayColor="transparent" onPress={() => {setEventMembers(invitedMembers); setStep("Setup")}} />}
        />
      <View style={{flex: 1}}>
        <View style={styles.searchBoxAbsolute}>
          <CustomInput
            containerStyle={{flex: 5}}
            placeholder='Seach by name or phone number'
            inputStyle={{color: '#000000'}}
            onChangeText={(text) => {
              setFriendQuery(text)
            }}
          />
          <TouchableOpacity onPress={() => setFriendQuery("")} style={{flex: 1}}>
            <Icon name='close' color='#aeaeae'
              containerStyle={{
                borderRadius: 5,
                justifyContent: 'center',
                flex: 1,
              }}
            />
          </TouchableOpacity>
        </View>
        <View style={{flex: 1}}>
          <View style={styles.searchResultContainer}>
            <SectionList
              sections={friends}
              keyExtractor={(item, index) => item + index}
              renderItem={renderFriendsCard}
              renderSectionHeader={({ section: { title } }) => (
                <Text style={styles.locationSearchResultHeader}>{title}</Text>
              )}
            />
          </View>
        </View>
      </View>
      </View>
    )
  }

  function SetupMain() {
    return (
      <View style={{flex: 1}}>
      <Header
        backgroundColor="#ffffff"
        leftComponent={() => <Icon name="chevron-left" color='#000' underlayColor="transparent" onPress={() => navigation.navigate('Event Detail New', {
            EventId: route.params.EventId
          })} />}
        centerComponent={{ text: "Setup", style: { color: '#000' } }}
        />

        <ScrollView
          contentContainerStyle={{
            height: 700,
          }}>

          <View>
            <Image
              source={{ uri: 'https://media-cdn.tripadvisor.com/media/photo-s/19/15/a7/68/gazzi-cafe.jpg'}}
              style={styles.locationBanner}
            />
          </View>

          <View style={{flexDirection: 'row'}}>
            <Text style={styles.label}>Event Title</Text>
          </View>
          <View>
            <CustomInput
              placeholder='Name your event title'
              value={eventName}
              onChangeText={(text) => setEventName(text)}
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.label}>Maximum Number of Participants (excluding host): {maximumNumberOfMembers}</Text>
          </View>
          <View style={{ marginLeft: 20, marginRight: 20, flex: 1, alignItems: 'stretch', justifyContent: 'center' }}>
            <Slider
              value={maximumNumberOfMembers}
              onValueChange={(value) => { setEventMembers([]); setMaximumNumberOfMembers(value);}}
              step={1}
              minimumValue={0}
              maximumValue={9}
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.label}>Participants</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View style={{
              flex: 3,
              flexDirection: 'row',
              alignContent: 'stretch',
              borderRadius: 5,
              backgroundColor: "#ffffff",
              marginLeft: 20
            }}>
              {eventMembers.map((member, index) => {
                if (index < 3) {
                  return (
                      <Image
                        key={index}
                        source={{uri: member.AvatarURI}}
                        style={styles.memberAvatar}
                        containerStyle={styles.memberAvatarContainer}
                        placeholderStyle={styles.memberAvatar}
                        overlayContainerStyle={styles.memberAvatarContainer}
                        resizeMode='contain'
                      />
                  )
                }
              })}
              <View style={styles.memberAvatarPlaceholder}>
                <Text style={styles.memberCount}>+{eventMembers.length-4 < 0 ? 0 : eventMembers.length-4}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => { setInvitedMembers(eventMembers); setStep("SetupMember")}} style={{flex: 1}}>
              <Icon name='add' color='#ffffff'
                containerStyle={{
                  borderRadius: 5,
                  backgroundColor: "#15cdca",
                  justifyContent: 'center',
                  flex: 1,
                  marginLeft: 20,
                  marginRight: 20,
                }}
              />
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              <Text style={styles.label}>Date</Text>
              <CustomInput
                placeholder='MM/DD/YYYY'
                value={eventDate ? formatDate(eventDate) : ''}
                onFocus={() => setShowDatePicker(true)}
                onBlur={() => setShowDatePicker(false)}
              />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.label}>Time</Text>
              <CustomInput
                placeholder='00:00 AM/PM'
                value={eventTime ? formatTime(eventTime) : ''}
                onFocus={() => setShowTimePicker(true)}
                onBlur={() => setShowTimePicker(false)}
              />
            </View>
          </View>
          {showDatePicker && (
            <DateTimePicker
              value={eventDate}
              mode={"date"}
              is24Hour={true}
              display="default"
              onChange={(event, date) => {
                setShowDatePicker(false);
                setEventDate(date);
                Keyboard.dismiss();
              }}
            />
          )}
          {showTimePicker && (
            <DateTimePicker
              value={eventTime}
              mode={"time"}
              is24Hour={true}
              display="default"
              onChange={(event, date) => {
                setShowTimePicker(false);
                setEventTime(date);
                Keyboard.dismiss();
              }}
            />
          )}

          <View style={{flexDirection: 'row'}}>
            <Text style={styles.label}>Penalty</Text>
          </View>
          <View style={{alignItems: 'stretch'}}>
            <RNPickerSelect
              style={pickerSelectStyles}
              useNativeAndroidPickerStyle={false}
              onValueChange={(value) => setPenalty(value)}
              items={[
                  { label: 'Cigarette', value: 'cigarette' },
                  { label: 'Americano', value: 'americano' },
              ]}
            />
          </View>
          {returnNextStep()}
        </ScrollView>

        </View>
    )
  }

  async function searchLocation() {
    if (locationQuery === ''){
      return;
    }
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
      let results = responseJson.features.map(feature => {
        if (feature.properties.category){
          return {
            name: feature.text,
            address: feature.place_name,
            geolat: feature.geometry.coordinates[1],
            geolong: feature.geometry.coordinates[0],
            category: feature.properties.category.replace(", ", " | ")
          }
        } else {
          return {
            name: feature.text,
            address: feature.place_name,
            geolat: feature.geometry.coordinates[1],
            geolong: feature.geometry.coordinates[0]
          }
        }

      })
      setLocationResult(results);
    } catch (error) {
      console.error(error);
    }

  }

  function selectLocation(item) {
    setLocation(item);
    setLocationSearching(false);
    addRecentLocation(item);
    setMapRegion({
      latitude: item.geolat,
      longitude: item.geolong,
      latitudeDelta: LATITUDE_DELTA_MAP,
      longitudeDelta: LONGITUDE_DELTA_MAP,
    })
    Keyboard.dismiss();
  }
  function LocationSearch() {
    return (
      <View style={{flex: 1}}>
      <Header
        backgroundColor="#ffffff"
        leftComponent={() => <Icon name="chevron-left" color='#000' underlayColor="transparent" onPress={() => navigation.navigate('Event Detail New', {
            EventId: route.params.EventId
          })} />}
        centerComponent={{ text: "Location", style: { color: '#000' } }}
        />

      <View style={{flex: 1}}>

        <View style={styles.searchBoxAbsolute}>
          {locationSearching && (
            <TouchableOpacity onPress={() => {setLocationSearching(false); Keyboard.dismiss()}} style={{flex: 1}}>
              <Icon name='arrow-back' color='#aeaeae'
                containerStyle={{
                  borderRadius: 5,
                  justifyContent: 'center',
                  flex: 1,
                }}
              />
            </TouchableOpacity>
          )}
          <CustomInput
            containerStyle={{flex: 5}}
            placeholder='Seach Location?'
            inputStyle={{color: '#000000'}}
            onFocus={() => setLocationSearching(true)}
            onChangeText={(text) => {
              if (text === "") {
                setLocationResult([]);
              }
              setLocationQuery(text)
            }}
          />
          <TouchableOpacity onPress={searchLocation} style={{flex: 1}}>
            <Icon name='search' color='#aeaeae'
              containerStyle={{
                borderRadius: 5,
                justifyContent: 'center',
                flex: 1,
              }}
            />
          </TouchableOpacity>
        </View>

        {!locationSearching ? (
        <View style={{flex: 1, backgroundColor: '#fafafa'}}>
          <MapView
              ref={mapRef}
              style={styles.map}
              region={mapRegion}
          >
          {location && (
            <Marker
              coordinate={{
                latitude: location.geolat,
                longitude: location.geolong
              }}
              title={location.name}
            />
          )}
          </MapView>
          {location && (
            <View style={styles.selectedLocationBox}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.locationTitle}>{location.name}</Text>
              </View>
              {
                location.category && (
                  <View style={{flexDirection: 'row'}}>
                    <Text h5 style={styles.locationCategory}>{location.category}</Text>
                  </View>
                )
              }
              <View style={{flexDirection: 'row', marginTop: 15}}>
                <Text style={styles.locationRowTitle}>Address: </Text>
                <Text style={styles.locationRowContent}>{location.address}</Text>
              </View>
              <View style={{flexDirection: 'row', marginTop: 15}}>
                <Text style={styles.locationRowTitle}>Coordinates: </Text>
                <Text style={styles.locationRowContent}>{location.geolat + " " + location.geolong}</Text>
              </View>
            </View>
          )}
          {returnNextStep()}
          </View>
        ) : (
          <View style={{flex: 1}}>
            <View style={styles.searchResultContainer}>
              {locationResult.length > 0 ? (
                <FlatList
                  data={locationResult}
                  keyExtractor={(item, index) => item + index}
                  renderItem={({ item }) => <ListItem
                    onPress={() => {selectLocation(item);}}
                    title={item.name}
                    subtitle={item.address}
                    titleStyle={styles.locationSearchResultTitle}
                    subtitleStyle={styles.locationSearchResultAddress}
                    leftAvatar={{ source: { uri: 'https://f0.pngfuel.com/png/816/649/map-computer-icons-flat-design-location-logo-location-icon-png-clip-art.png' } }}
                  />}
                />
              ) : (
                <SectionList
                  sections={locationHistory}
                  keyExtractor={(item, index) => item + index}
                  renderItem={({ item }) => <ListItem
                    onPress={() => {selectLocation(item);}}
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
              )}

            </View>
          </View>
        )}
      </View>
      </View>
    )
  }

  async function addRecentLocation(item) {
    let locations = await AsyncStorage.getItem("recentLocation");
    locationHistory[0].data.unshift(item);
    if (locations) {
      locations = JSON.parse(locations);
      if (locations.length < 10) {
        locations.unshift(item);
      } else {
        locationHistory[0].data.pop();
        locations.unshift(item);
        locations.pop();
      }
      return await AsyncStorage.setItem("recentLocation", JSON.stringify(locations));

    } else {
      return await AsyncStorage.setItem("recentLocation", JSON.stringify([item]));
    }
    setLocationHistory(locationHistory)

  }

  function RightComponent() {
    let name = (step !== 'Penalty') && 'chevron-right';
    let text = (step === 'Penalty') && 'PUBLISH';
    let onPress;
    let condition;
    if (step === 'Event Detail') {
      condition = (eventName && eventDate && eventTime && maximumNumberOfMembers) ? true : false
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

  function returnNextStep() {
    if (step === "Location") {
      return <NextStep disabled={location ? false : true} onPress={() => setStep("Setup")} />
    } else if (step === "Setup") {
      return (
          <View style={styles.temp}>
              <PreviousStep disabled={false} onPress={() => setStep("Location")} />
              <NextStep disabled={false} onPress={() => setStep("Review")} />
          </View>
      )
    } else if (step === "Review") {
      return (
      <View style={styles.temp}>
          <PreviousStep disabled={false} onPress={() => setStep("Setup")} />
          <NextStep confirm onPress={() => publish()} />
      </View>
      )
    }
  }

  return (

    <View style={styles.container}>

        {step === "Location" && LocationSearch()}
        {step === "Setup" && SetupMain()}
        {step === "SetupMember" && SetupMember()}
        {step === "Review" && FinalReview()}
    </View>

  )
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
  },
  inputAndroid: {
    paddingLeft: 10,
    height: 40,
    borderRadius: 5,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: "#ffffff",
    fontFamily: "OpenSans_400Regular",
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 0,
    color: "#000000",
  },
});


const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'stretch',
      backgroundColor: '#f1f1f1'
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
      flex: 2,
      borderRadius: 15,
      padding: 30,
      paddingRight: 70,
    },
    locationTitle: {
      fontFamily: "OpenSans_400Regular",
      fontSize: 20,
      fontWeight: "700",
      letterSpacing: 0,
      color: "#000000",
    },
    locationCategory: {
      fontFamily: "OpenSans_400Regular",
      fontSize: 12,
      fontWeight: "300",
      letterSpacing: 0,
      color: "#000000",
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
      paddingRight: 40,
      color: "#808080"
    },
    searchResultContainer: {
      flex: 1,
      borderRadius: 10,
      backgroundColor: "#fefefe",
      marginTop: 70,
      marginLeft: 20,
      marginRight: 20,
      marginBottom: 10
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
    },
    memberAvatarPlaceholder: {
      width: 45,
      height: 45,
      borderRadius: 10,
      borderColor: '#15cdca',
      borderWidth: 2,
      margin: 5,
      backgroundColor: "#d8d8d8",
      justifyContent: 'center',
      alignItems: 'center'
    },
    memberAvatar: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    memberAvatarContainer: {
      borderRadius: 10,
      margin: 5,
      overflow: 'hidden',
      borderColor: '#15cdca',
      borderWidth: 2,
    },
    memberCount: {
      fontFamily: "OpenSans_400Regular",
      fontSize: 14,
      fontWeight: "700",
      fontStyle: "normal",
      letterSpacing: 0,
      color: "#000000"
    },
    label: {
      marginLeft: 20,
      marginRight: 10,
      paddingTop: 10,
      paddingBottom: 10,
      fontFamily: "OpenSans_400Regular",
      fontSize: 14,
      fontWeight: "700",
      fontStyle: "normal",
      letterSpacing: 0,
      color: "#5d5d5d"
    },
    reviewHeader: {
      fontFamily: "OpenSans_400Regular",
      fontSize: 24,
      fontWeight: "700",
      fontStyle: "normal",
      letterSpacing: 0,
      color: "#15cdca",
      marginLeft: 40,
      marginTop: 40
    },
    reviewDescription: {
      fontFamily: "OpenSans_400Regular",
      fontSize: 16,
      fontWeight: "500",
      fontStyle: "normal",
      letterSpacing: 0,
      color: "#9b9b9b",
      marginLeft: 40,
      marginTop: 20
    },
    reviewInformationContainer: {
      flex: 5,
      borderRadius: 42,
      backgroundColor: '#fafafa'
    },
    reviewLocationTitle: {
      fontFamily: "OpenSans_400Regular",
      fontSize: 20,
      fontWeight: "700",
      fontStyle: "normal",
      letterSpacing: 0,
      color: "#000000",
      marginLeft: 30,
      marginTop: 30
    },
    reviewLocationAddress: {
      fontFamily: "OpenSans_400Regular",
      fontSize: 14,
      fontWeight: "500",
      fontStyle: "normal",
      letterSpacing: 0,
      color: "#aeaeae",
      marginLeft: 30,
      marginTop: 10
    },
    reviewDateSectionContainer: {
      flexDirection: 'row',
      marginTop: 20,
    },
    reviewPenaltySectionContainer: {
      flexDirection: 'row',
      marginTop: 15,
    },
    reviewParticipantSectionContainer: {
      marginTop: 15,
    },
    reviewDateIconContainer: {
      backgroundColor: '#15cdca',
      height: 50,
      width: 50,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 30,
    },
    reviewPenaltyIconContainer: {
      backgroundColor: '#d8d8d8',
      height: 50,
      width: 50,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 30,
    },
    reviewDateIcon: {
      height: 24,
      width: 24
    },
    reviewDateInformationContainer: {
      marginLeft: 30
    },
    reviewPenaltyInformationContainer: {
      marginLeft: 30
    },
    reviewDateInformationTime: {
      fontFamily: "OpenSans_400Regular",
      fontSize: 16,
      fontWeight: "700",
      fontStyle: "normal",
      letterSpacing: 0,
      color: "#000000",
    },
    reviewPenaltyInformationPenalty: {
      fontFamily: "OpenSans_400Regular",
      fontSize: 16,
      fontWeight: "700",
      fontStyle: "normal",
      letterSpacing: 0,
      color: "#000000",
    },
    reviewDateInformationDate: {
      fontFamily: "OpenSans_400Regular",
      fontSize: 14,
      fontWeight: "500",
      fontStyle: "normal",
      letterSpacing: 0,
      color: "#aeaeae",
    },
    reviewPenaltyInformationDescription: {
      fontFamily: "OpenSans_400Regular",
      fontSize: 14,
      fontWeight: "500",
      fontStyle: "normal",
      letterSpacing: 0,
      color: "#aeaeae",
    },
    reviewParticipantHeader: {
      fontFamily: "OpenSans_400Regular",
      fontSize: 16,
      fontWeight: "700",
      fontStyle: "normal",
      letterSpacing: 0,
      color: "#000000",
      marginLeft: 30
    },
    reviewParticipantList: {
      marginTop: 10,
      marginLeft: 30,
      flexDirection: 'row'
    },
    reviewParticipantContainer: {
      flexDirection: 'row',
      marginRight: 15,
      borderRadius: 8,
      backgroundColor: "#ffffff",
      justifyContent: 'center',
      alignItems: 'center'
    },
    reviewParticipantAvatar: {
      height: 50,
      width: 50,
    },
    reviewParticipantAvatarContainer: {
      margin: 15,
      overflow: 'hidden',
      borderRadius: 15,
    },
    reviewParticipantName: {
      fontFamily: "OpenSans_400Regular",
      fontSize: 14,
      fontWeight: "600",
      fontStyle: "normal",
      letterSpacing: 0,
      color: "#000000",
      marginLeft: 15,
      marginRight: 15,
    },
    temp: {
        flexDirection:"row",
    }
});
