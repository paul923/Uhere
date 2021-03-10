import * as React from 'react';
import { StyleSheet, View, Platform, TouchableOpacity, TouchableHighlight, FlatList, SectionList, Dimensions, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import * as GoogleSignIn from 'expo-google-sign-in';
import * as Facebook from 'expo-facebook';
import * as Location from 'expo-location';
import qs from 'qs';
import { ListItem, Image, Button, Text, Slider, Avatar, Icon, Divider, Header, SearchBar, CheckBox } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import AuthContext from 'contexts/AuthContext';
import Spinner from 'react-native-loading-spinner-overlay';
import firebase from 'firebase';
import firebaseObject from 'config/firebase';
import Constants from "expo-constants";
import MapView, { AnimatedRegion, Marker } from 'react-native-maps';
const { manifest } = Constants;
import { backend } from 'constants/Environment';
import { getRelationships, getUserByUserId, deleteRelationship } from 'api/user'
import { createEvent } from 'api/event';

import FriendCard from 'components/FriendCard';
import FriendTile from 'components/FriendTile';
import CustomInput from 'components/CustomInput';
import NextStep from 'components/NextStep';
import { getAvatarImage } from 'utils/asset';
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

export default function CreateEventScreen({navigation}) {
  const [ step, setStep] = React.useState("Location");
  const [ eventName, setEventName] = React.useState("");
  const [ eventDescription, setEventDescription] = React.useState("");
  const [ eventMembers, setEventMembers] = React.useState([]);
  const [ selectedMembers, setSelectedMembers] = React.useState([]);
  const [ eventDate, setEventDate] = React.useState(new Date(new Date().getTime() + 30*60000));
  const [ eventTime, setEventTime] = React.useState(new Date(new Date().getTime() + 30*60000));
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
  const [ isLoading, setIsLoading] = React.useState(false);
  const [ loadingMessage, setLoadingMessage] = React.useState("");
  const [ friends, setFriends] = React.useState([]);
  const [ friendQuery, setFriendQuery] = React.useState("");
  const [ filteredData, setFilteredData] = React.useState();
  const [ mapRegion, setMapRegion ] = React.useState();
  const mapRef = React.useRef();

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function retrieveFriend() {
      let friends = await getRelationships(firebase.auth().currentUser.uid);
      friends.sort((a,b) => a.Nickname.localeCompare(b.Nickname));
      setFriends(friends);
    }

    async function fetchData() {
        let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
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
    retrieveFriend()
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
    setFriendQuery(text);
    let filtered = friends.filter(function (item) {
      return item.Nickname.toLowerCase().includes(text.toLowerCase()) || item.Username.toLowerCase().includes(text.toLowerCase())
    });
    setFilteredData(filtered)
  }

  function renderFriendsCard({ item }){
    return (
    <FriendCard
      avatarUrl= {item.AvatarURI}
      avatarColor= {item.AvatarColor}
      avatarTitle= {item.Nickname.substr(0, 2).toUpperCase()}
      displayName = {item.Nickname}
      userId = {item.Username}
      checkBox={{
        size: 20,
        checkedIcon: 'dot-circle-o',
        uncheckedIcon: 'circle-o',
        checkedColor:'#15CDCA',
        uncheckedColor: '#15CDCA',
        checked: selectedMembers.includes(item),
        onPress: () => selectFriend(item)
      }}
    />
    )
  }

  function selectFriend (item) {
    if(!selectedMembers.includes(item)){
      if (selectedMembers.length < maximumNumberOfMembers) {
        setSelectedMembers([...selectedMembers, item])
      }
    } else {
      setSelectedMembers(selectedMembers.filter(a => a !== item));
    }
  }

  function FinalReview() {
    return (
      <View style={{flex: 1}}>
      <Header
        backgroundColor="#ffffff"
        leftComponent={() => <Icon name="chevron-left" color='#000' underlayColor="transparent" onPress={() => setStep("Setup")} />}
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
                      <View key ={index} style={styles.reviewParticipantContainer}>
                        <Avatar
                          key={index}
                          size={55}
                          source={getAvatarImage(member.AvatarURI)}
                          overlayContainerStyle={styles.memberAvatar}
                          imageProps={{
                            style: {
                              tintColor: `${member.AvatarColor}`,
                            }
                          }}
                          placeholderStyle={{ backgroundColor: "transparent" }}
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
        leftComponent={() => <Icon name="chevron-left" color='#000' underlayColor="transparent" onPress={() => setStep("Setup")} />}
        centerComponent={{ text: "Add Members", style: { color: '#000' } }}
        rightComponent={() => <Icon name="check" color='#000' underlayColor="transparent" onPress={() => {setEventMembers(selectedMembers); setStep("Setup")}} />}
        />
      <View style={{flex: 1}}>
          <SearchBar
            lightTheme
            placeholder='Seach Friends'
            inputContainerStyle={{ height: 30, backgroundColor: '#FEFEFE' }}
            containerStyle={styles.searchBarContainer}
            onChangeText={friendSearch}
            value={friendQuery}
          />
        <View style={{flex: 1}}>
          <View style={styles.friendsearchResultContainer}>
            <FlatList
              data={filteredData && filteredData.length > 0 ? filteredData : (friendQuery.length === 0 && friends)}
              keyExtractor={(item, index) => item + index}
              renderItem={renderFriendsCard}
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
        leftComponent={() => <Icon name="chevron-left" color='#000' underlayColor="transparent" onPress={() => setStep("Location")} />}
        centerComponent={{ text: "Setup", style: { color: '#000' } }}
        />

        <ScrollView
          contentContainerStyle={{

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
              minimumValue={1}
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
              marginLeft: 20,
              height: 50,
            }}>
              {eventMembers.map((member, index) => {
                if (index < 3) {
                  return (
                    <Avatar
                      key={index}
                      size={55}
                      source={getAvatarImage(member.AvatarURI)}
                      overlayContainerStyle={styles.memberAvatar}
                      imageProps={{
                        style: {
                          tintColor: `${member.AvatarColor}`,
                        }
                      }}
                      placeholderStyle={{ backgroundColor: "transparent" }}
                    />
                  )
                }
              })}
              {
                eventMembers.length > 4 && (
                  <View style={styles.memberAvatarPlaceholder}>
                    <Text style={styles.memberCount}>+{eventMembers.length-4}</Text>
                  </View>
                )
              }
            </View>
            <TouchableOpacity onPress={() => { setSelectedMembers(eventMembers); setStep("SetupMember")}} style={{flex: 1}}>
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
              {Platform.OS === 'ios' ? (
                <DateTimePicker
                  style={styles.label}
                  value={eventDate}
                  mode={"date"}
                  is24Hour={false}
                  display="default"
                  onChange={(event, date) => {
                    setEventDate(date);
                  }}/>
                ) : (
                  <CustomInput
                    placeholder='MM/DD/YYYY'
                    value={eventDate ? formatDateFormat(eventDate, 'dd MMM yyyy') : ''}
                    onFocus={() => setShowDatePicker(true)}
                    onBlur={() => setShowDatePicker(false)}
                  />
                )}
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.label}>Time</Text>
              {Platform.OS === 'ios' ? (
                <DateTimePicker
                  style={styles.label}
                  value={eventTime}
                  mode={"time"}
                  is24Hour={true}
                  display="default"
                  onChange={(event, date) => {
                    setEventTime(date);
                  }}
                />
              ) : (
                  <CustomInput
                    placeholder='00:00 AM/PM'
                    value={eventTime ? formatTime(eventTime) : ''}
                    onFocus={() => setShowTimePicker(true)}
                    onBlur={() => setShowTimePicker(false)}
                  />
              )}
            </View>
          </View>
          {Platform.OS === 'android' && showDatePicker && (
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
          {Platform.OS === 'android' && showTimePicker && (
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
    setIsLoading(true);
    setLoadingMessage("Searching Location...");
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
      setIsLoading(false);
      setLoadingMessage("");
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
        leftComponent={() => <Icon name="chevron-left" color='#000' underlayColor="transparent" onPress={() => navigation.navigate("Event")} />}
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
            onSubmitEditing={searchLocation}
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
    locations = JSON.parse(locations);
    if (locations) {
      let isExist = locations.some(location => location.address === item.address);
      if (isExist) {
        if (locations.length < 10) {
          locations = locations.filter(location => location.address !== item.address);
          locations.unshift(item);
        } else {
          locations = locations.filter(location => location.address !== item.address);
          locations.unshift(item);
          locations.pop();
        }
        return await AsyncStorage.setItem("recentLocation", JSON.stringify(locations));
      } else {
        locationHistory[0].data.unshift(item);
        if (locations.length < 10) {
          locations.unshift(item);
        } else {
          locationHistory[0].data.pop();
          locations.unshift(item);
          locations.pop();
        }
        return await AsyncStorage.setItem("recentLocation", JSON.stringify(locations));
      }
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
      return <NextStep disabled={false} onPress={() => setStep("Review")} />
    } else if (step === "Review") {
      return <NextStep confirm onPress={() => publish()} />
    }
  }

  return (

    <View style={styles.container}>
      <Spinner
        color="white"
        overlayColor="#15CDCA"
        visible={isLoading}
        textContent={loadingMessage}
        textStyle={styles.spinnerTextStyle}
      />
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
    spinnerTextStyle: {
      color: 'white'
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
    searchBarContainer: {
      alignContent: 'center',
      backgroundColor: '#FEFEFE',
      marginHorizontal: 15,
      borderRadius: 5,
      borderTopColor: "#fff",
      borderBottomColor: "#fff",
      marginVertical: 10
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
    friendsearchResultContainer: {
      flex: 1,
      borderRadius: 10,
      backgroundColor: "#fefefe",
      marginTop: 20,
      marginLeft: 20,
      marginRight: 20,
      marginBottom: 10
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
      borderRadius: 10,
      borderColor: '#15cdca',
      borderWidth: 2,
      margin: 5,
      justifyContent: 'center',
      alignItems: 'center'
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
    avatarOverlayContainer: {
      overflow: 'hidden',
      borderRadius: 15,
      borderColor: "#d8d8d8",
      borderWidth: 1,
      backgroundColor: "#fff"
    },
});
