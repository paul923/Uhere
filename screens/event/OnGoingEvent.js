import * as React from 'react';
import { SectionList, AsyncStorage, StyleSheet, View, ActivityIndicator, TouchableOpacity  } from 'react-native';
import { Image, Button, Text, ListItem, Divider, Icon, SearchBar, Header } from 'react-native-elements';
import EventCard from '../../components/EventCard';
import EventFilter from '../../components/EventFilter';
import { formatEventList } from '../../utils/event';
import Constants from "expo-constants";
import firebase from "firebase";
import { getEventByID, getEventMembers } from '../../API/EventAPI'
const { manifest } = Constants;
import { backend } from '../../constants/Environment';


export default function OnGoingEvent({ navigation, route }) {
  const [events, setEvents] = React.useState([]);
  
  async function filterEvents(events, date, friends, locations){
    let filtered = [];
    for (let i = 0; i < events.length; i++) {
      // date
      let dateMatch = true;
      if (date !== undefined) {
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

  React.useEffect(() => {
    async function fetchData() {
      try {
        let url = `http://${backend}:3000/event/accepted/${firebase.auth().currentUser.uid}`;
        let response = await fetch(url);
        let responseJson = await response.json();
        /////////////////////////////////
        try {
          const value = await AsyncStorage.getItem('ongoingeventfilter');
          if (value !== null) {
            // We have data!!
            console.log(value);
            let filterDate = JSON.parse(value).date;
            let filterFriends = JSON.parse(value).friends;
            let filterLocations = JSON.parse(value).locations;
            let filteredEvents = await filterEvents(responseJson, filterDate, filterFriends, filterLocations); 
            setEvents(formatEventList(filteredEvents))
          }
        } catch (error) {
          // Error retrieving data
        }
        /////////////////////////////////
      } catch (error) {
        console.error(error);
      }
    }
    const unsubscribeFocus = navigation.addListener('focus', () => {
      fetchData();
    });

    return unsubscribeFocus;
  }, []);
  return (
    <View style={styles.container}>
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
        ListHeaderComponent={EventFilter}
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
    }
});
