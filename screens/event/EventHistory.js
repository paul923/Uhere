import * as React from 'react';
import { SectionList, SafeAreaView, StyleSheet, View, TouchableOpacity, FlatList, Alert  } from 'react-native';
import { Image, Button, Text, ListItem, Divider, Icon, SearchBar, Header } from 'react-native-elements';
import EventCard from 'components/EventCard';
import { formatEventList } from 'utils/event';
import Constants from "expo-constants";
import firebase from "firebase";
import { getEvent } from 'api/event';
import { backend } from 'constants/Environment';
import Collapse from 'components/Collapse';

import { Appearance, useColorScheme } from 'react-native-appearance';
import FriendCard from 'components/FriendCard';
import Filter from 'contexts/Filter'
import Modal from 'react-native-modal';

import DateRange from 'react-native-date-ranges';
import { formatDate, formatTime } from "utils/date";
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const { manifest } = Constants;

export default function EventHistory({ navigation, route }) {
  const [events, setEvents] = React.useState([]);

  const [modalVisible, setModalVisible] = React.useState(false);

  const [fromDate, setFromDate] = React.useState();
  const [isFromDatePickerVisible, setFromDatePickerVisibility] = React.useState(false);

  const [toDate, setToDate] = React.useState();
  const [isToDatePickerVisible, setToDatePickerVisibility] = React.useState(false);

  const [friends, setFriends] = React.useState([]);
  const [searchFriendText, setSearchFriendText] = React.useState("");
  const [searchedFriends, setSearchedFriends] = React.useState([]);
  const [selectedFriends, setSelectedFriends] = React.useState([]);

  let colorScheme = useColorScheme();

  async function filterEvents(events, fromDate, toDate, friends){
    let filtered = [];
    for (let i = 0; i < events.length; i++) {
      // date
      let dateMatch = true;
      if (!(fromDate === undefined || fromDate === null || toDate === undefined || toDate === null)) {
        let check = new Date(events[i].DateTime);
        let from = new Date(fromDate);
        let to = new Date(toDate);
        dateMatch = check >= from && check <= to;
      }

      // friends
      let friendMatch = true;
      let eventMembers = await getEvent(events[i].EventId).eventUsers
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
      if(dateMatch && friendMatch){
        filtered.push(events[i]);
      }
    }
    return filtered;
  }

  async function fetchData() {
    try {
      let url = `http://${backend}:3000/event/history/${firebase.auth().currentUser.uid}`;
      let response = await fetch(url);
      let responseJson = await response.json();
      let filter = Filter.getFilter();
      let filteredEvents = await filterEvents(responseJson, filter.fromDate, filter.toDate, filter.friends);
      setEvents(formatEventList(filteredEvents))
    } catch (error) {
      console.error(error);
    }
  }

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
  }

  React.useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      fetchData();
      retrieveFriends();
    });
    return unsubscribeFocus;
  }, []);


  function friendSearch(text) {
    setSearchFriendText(text);
    let filtered = friends.filter(function (item) {
      return item.Nickname.toLowerCase().includes(text.toLowerCase()) || item.Username.toLowerCase().includes(text.toLowerCase())
    });
    setSearchedFriends(filtered)
  }

  function selectFriend(item) {
    if (selectedFriends.filter(friend => friend.UserId === item.UserId).length == 0) {
      setSelectedFriends([...selectedFriends, item])
    } else {
      setSelectedFriends(selectedFriends.filter(a => a.UserId !== item.UserId));
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

  function validate(){
    if (fromDate >= toDate){
      return false;
    } else {
      return true;
    }
  }

  function applyFilter() {
    if (fromDate !== 'undefined' && toDate !== 'undefined') {
      let valid = validate()
      if (valid) {
        _storeFilter()
        setModalVisible(false)
        fetchData()
      } else {
        Alert.alert("To Date cannot be before From Date");
      }
    } else {
      _storeFilter()
      setModalVisible(false)
      fetchData()
    }
  }

  async function _storeFilter() {

    let filter = {
      fromDate: fromDate,
      toDate: toDate,
      friends: selectedFriends,
    }
    Filter.setFilter(filter);
  };

  function resetFilters() {
    setFromDate();
    setToDate();
    setSelectedFriends([]);
  }

  const showFromDatePicker = () => {
    setFromDatePickerVisibility(true);
  };
  const showToDatePicker = () => {
    setToDatePickerVisibility(true);
  };

  const hideFromDatePicker = () => {
    setFromDatePickerVisibility(false);
  };
  const hideToDatePicker = () => {
    setToDatePickerVisibility(false);
  };

  const handleFromConfirm = date => {
    setFromDate(date);
    hideFromDatePicker();
  };
  const handleToConfirm = date => {
    setToDate(date);
    hideToDatePicker();
  };

  return (
    <View style={styles.container}>
      {/* Filter Modal*/}
      <Modal
        style={{margin: 0 , justifyContent: 'flex-end'}}
        isVisible={modalVisible}
        swipeDirection={['down']}
        onSwipeComplete={() => setModalVisible(false)}
        onBackdropPress={() => setModalVisible(false)}
        avoidKeyboard={true}
      >
        <SafeAreaView style={{backgroundColor:'white'}}>
          <Header
            containerStyle={{ paddingTop: 0, height: 56 }}
            leftComponent={
              <TouchableOpacity
                onPress={() => {
                  resetFilters()
                  setModalVisible(false)}
                }
              >
                <Text style={{ color: '#fff' }}>Cancel</Text>
              </TouchableOpacity>
            }
            centerComponent={{ text: 'Filters', style: { color: '#fff' } }}
            rightComponent={
              <TouchableOpacity onPress={() => resetFilters()}>
                <Text style={{ color: '#fff' }}>Reset</Text>
              </TouchableOpacity>
            }
          />
          {/* Date range Picker */}
          <View>
            <DateTimePickerModal
              date={fromDate === undefined ? new Date() : fromDate}
              isVisible={isFromDatePickerVisible}
              mode="date"
              onConfirm={handleFromConfirm}
              onCancel={hideFromDatePicker}
              isDarkModeEnabled={colorScheme === 'dark'}
            />
            <DateTimePickerModal
              date={toDate === undefined ? new Date() : toDate}
              isVisible={isToDatePickerVisible}
              mode="date"
              onConfirm={handleToConfirm}
              onCancel={hideToDatePicker}
              isDarkModeEnabled={colorScheme === 'dark'}
            />
            <Text style={{ margin: 10 }}>CHOOSE A DATE RANGE</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>

              <TouchableOpacity onPress={showFromDatePicker} style={{ flex: 1, backgroundColor:'white' }}>
                <View style={{ flexDirection: 'column', margin:10 }}>
                  <Text>From</Text>
                  {fromDate === undefined ? <Text>Pick a date</Text> : <Text>{formatDate(fromDate)}</Text>}
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={showToDatePicker} style={{ flex: 1, backgroundColor:'white' }}>
                <View style={{ flexDirection: 'column', margin:10 }}>
                  <Text>To</Text>
                  {toDate === undefined ? <Text>Pick a date</Text> : <Text>{formatDate(toDate)}</Text>}
                </View>
              </TouchableOpacity>
            </View>

          </View>

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
                ,height:300
              }}
              bounces={true}
            />
          </View>
          <Button
            style={{margin:5}}
            title="Apply Filters"
            onPress={applyFilter}
          />
        </SafeAreaView>
      </Modal>
      {/* Filter Button */}
      <Button title="Filter"
        buttonStyle={styles.listContainer}
        onPress={() => { setModalVisible(true) }}
      />
      {/* Event List */}
      <SectionList
        style={styles.listContainer}
        sections={events}
        renderItem={({ item }) => (
          <EventCard
            item={item}
            status="HISTORY"
            onPress={() => navigation.navigate('Event History', {
              EventId: item.EventId,
              EventType: "HISTORY"
            })}
          />
        )}
        keyExtractor={(item) => item.EventId.toString()}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        ItemSeparatorComponent={() => (<Divider style={{ height: 1, margin: 5, backgroundColor: 'black' }} />)}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
