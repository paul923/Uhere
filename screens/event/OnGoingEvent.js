import * as React from 'react';
import { SectionList, SafeAreaView, StyleSheet, View, TouchableOpacity, FlatList  } from 'react-native';
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
import Modal from 'react-native-modal';

export default function OnGoingEvent({ navigation, route }) {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [events, setEvents] = React.useState([]);
  
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
      if(dateMatch && friendMatch){
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
      let filteredEvents = await filterEvents(responseJson, filter.fromDate, filter.toDate, filter.friends); 
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

  function applyFilter() {
    _storeFilter()
    setModalVisible(false)
    fetchData()
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
      <Modal
        style={{margin: 0 , justifyContent: 'flex-end',}}
        isVisible={modalVisible}
        swipeDirection={['down']}
        onSwipeComplete={() => setModalVisible(false)}
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
              <TouchableOpacity
                onPress={() => resetFilters()}
              >
                <Text style={{ color: '#fff' }}>Reset</Text>
              </TouchableOpacity>
            }
          />
          <Collapse
            title="CHOOSE A DATE RANGE"
            collapsed={false}
            content={
              <View>
                <DateTimePickerModal
                  date={fromDate === undefined ? new Date() : fromDate}
                  isVisible={isFromDatePickerVisible}
                  mode="date"
                  onConfirm={handleFromConfirm}
                  onCancel={hideFromDatePicker}
                  isDarkModeEnabled={colorScheme === 'dark'}
                />
                <TouchableOpacity onPress={showFromDatePicker} style={{ minHeight: 30 }}>
                  {fromDate === undefined ? <Text>Select From Date</Text> : <Text>From: {formatDate(fromDate)}</Text>}
                </TouchableOpacity>


                <DateTimePickerModal
                  date={toDate === undefined ? new Date() : toDate}
                  isVisible={isToDatePickerVisible}
                  mode="date"
                  onConfirm={handleToConfirm}
                  onCancel={hideToDatePicker}
                  isDarkModeEnabled={colorScheme === 'dark'}
                />
                <TouchableOpacity onPress={showToDatePicker} style={{ minHeight: 30 }}>
                  {toDate === undefined ? <Text>Select To Date</Text> : <Text>To: {formatDate(toDate)}</Text>}
                </TouchableOpacity>
              </View>
            }
          />
          <Collapse
            title="Friends"
            collapsed={false}
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
          <Button
            style={{margin:5}}
            title="Apply Filters"
            onPress={applyFilter}
          />
        </SafeAreaView>
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
