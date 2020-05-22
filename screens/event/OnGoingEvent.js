import * as React from 'react';
import { SectionList, AsyncStorage, StyleSheet, View, Modal, TouchableOpacity, FlatList  } from 'react-native';
import { Image, Button, Text, CheckBox, Divider, Icon, SearchBar, Header } from 'react-native-elements';
import EventCard from '../../components/EventCard';
import EventFilter from '../../components/EventFilter';
import { formatEventList } from '../../utils/event';
import { formatDate, formatTime } from '../../utils/date';
import Constants from "expo-constants";
import firebase from "firebase";
import { getEventByID, getEventMembers } from '../../API/EventAPI'
const { manifest } = Constants;
import { backend } from '../../constants/Environment';
import Collapse from '../../components/Collapse';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Appearance, useColorScheme } from 'react-native-appearance';
import FriendCard from '../../components/FriendCard';
import Filter from '../../contexts/Filter'

export default function OnGoingEvent({ navigation, route }) {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [events, setEvents] = React.useState([]);
  
  const [date, setDate] = React.useState();
  const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);

  const [friends, setFriends] = React.useState([]);
  const [searchFriendText, setSearchFriendText] = React.useState("");
  const [searchedFriends, setSearchedFriends] = React.useState([]);
  const [selectedFriends, setSelectedFriends] = React.useState([]);

  const [locations, setLocations] = React.useState([]);
  const [searchLocationText, setSearchLocationText] = React.useState("");
  const [searchedLocations, setSearchedLocations] = React.useState([]);
  const [selectedLocations, setSeletedLocations] = React.useState([]);


  let colorScheme = useColorScheme();

  async function filterEvents(events, date, friends, locations){
    let filtered = [];
    for (let i = 0; i < events.length; i++) {
      // date
      let dateMatch = true;
      if (!(date === undefined || date === null)) {
        let eventDate = new Date(events[i].DateTime);
        let filterDate = new Date(date);
        dateMatch = filterDate.getFullYear() == eventDate.getFullYear() && filterDate.getMonth() == eventDate.getMonth() && filterDate.getDate() == eventDate.getDate()
      }
      
      // location
      let locationMatch = true;
      if (!(locations === undefined || locations.length == 0)){
        locationMatch = locations.filter(location => location === events[i].LocationName).length > 0;
      }

      // friends
      let friendMatch = true;
      let eventMembers = await getEventMembers(events[i].EventId)
      const memberIds = [...new Set(eventMembers.map(member => member.UserId))];
      // if non of the friends were found in memberIds then filter out this event
      if (!(friends === undefined || friends.length == 0)){
        for(let friend of friends){
          let memberFound = memberIds.filter(memberId => memberId === friend.UserId).length > 0;
          if (memberFound) {
            break;
          } else {
            friendMatch = false;
          }
        }
      }
      // final aggregate filter
      if(dateMatch && locationMatch && friendMatch){
        filtered.push(events[i]);
      }
    }
    return filtered;
  }

  async function fetchData() {
    try {
      let url = `http://${backend}:3000/event/accepted/${firebase.auth().currentUser.uid}`;
      let response = await fetch(url);
      let responseJson = await response.json();
      let filter = Filter.getFilter();
      let filteredEvents = await filterEvents(responseJson, filter.date, filter.friends, filter.locations); 
      setEvents(formatEventList(filteredEvents))
    } catch (error) {
      console.error(error);
    }
  }
  React.useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      fetchData();
    });
    return unsubscribeFocus;
  }, []);

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
      if (responseJson.status !== 204) {
        responseJson.response.sort((a, b) => a.Nickname.localeCompare(b.Nickname));
        setFriends(responseJson.response);
      }
      let eventResponse = await fetch(`http://${backend}:3000/event/accepted/${firebase.auth().currentUser.uid}`);
      let eventJson = await eventResponse.json();
      const uniqueLocations = [...new Set(eventJson.map(event => event.LocationName))];
      setLocations(uniqueLocations);
    }
    retrieveFriends();
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
    _storeFilter()
    setModalVisible(false)
    fetchData()
  }

  async function _storeFilter() {

    let filter = {
      date: date,
      friends: selectedFriends,
      locations: selectedLocations,
    }
    Filter.setFilter(filter);
  };

  function resetFilters() {
    setDate();
    setSelectedFriends([]);
    setSeletedLocations([]);
  }

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    setDate(date);
    hideDatePicker();
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
      >
        <View>
          <Header
            leftComponent={
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: '#fff' }}>Cancel</Text>
              </TouchableOpacity>
            }
            centerComponent={{ text: 'Filters', style: { color: '#fff' } }}
            rightComponent={
              <TouchableOpacity
                onPress={() => resetFilters()}
              >
                <Text style={{ color: '#fff' }}>Reset</Text>
              </TouchableOpacity>
            }
          />
          <Collapse
            title="Date"
            collapsed={true}
            content={
              <View>
                <DateTimePickerModal
                  date={date === undefined ? new Date() : date}
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                  isDarkModeEnabled={colorScheme === 'dark'}
                />
                <TouchableOpacity onPress={showDatePicker} style={{ minHeight: 30 }}>
                  {date === undefined ? <Text>Select Date you want to filter</Text> : <Text>{formatDate(date)}</Text>}
                </TouchableOpacity>
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
          <Button
            title="Apply Filters"
            onPress={applyFilter}
          />
        </View>
      </Modal>

      <Button title="Filter"
        buttonStyle={styles.listContainer}
        onPress={() => { setModalVisible(true) }}
      />
      <SectionList
        style={styles.listContainer}
        sections={events}
        renderItem={({ item }) => (
          <EventCard
            item={item}
            status="ON-GOING"
            onPress={()=>navigation.navigate('Event Detail', {
              EventId: item.EventId,
              EventType: "ON-GOING"
            })}
            />
        )}
        keyExtractor={(item) => item.EventId.toString()}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        ItemSeparatorComponent={() => (<Divider style={{ height: 0.3, margin: 5, backgroundColor: 'black' }} />)}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5FCFF'
    },
    listContainer: {
      marginLeft: 15,
      marginRight: 15
    },
    sectionHeader: {
      color: 'white',
      fontWeight: 'bold',
      backgroundColor: 'gray',
      paddingLeft: 5,
      zIndex: 99
    },
    openButton: {
      backgroundColor: "#F194FF",
      borderRadius: 20,
      padding: 10,
      elevation: 2
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },

});
