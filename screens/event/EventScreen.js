import * as React from 'react';
import { SectionList, SafeAreaView, StyleSheet, View, TouchableOpacity, FlatList  } from 'react-native';
import { Image, Button, Text, CheckBox, Divider, Icon, SearchBar, Header } from 'react-native-elements';
import EventCard from 'components/EventCard';
import { formatEventList } from 'utils/event';
import { formatDate, formatTime } from 'utils/date';
import Constants from "expo-constants";
import firebase from "firebase";
const { manifest } = Constants;
import { backend } from 'constants/Environment';
import { getEvents } from 'api/event';


export default function EventScreen({ navigation, route }) {
  const [events, setEvents] = React.useState([]);
  const [upcomingEvents, setUpcomingEvents] = React.useState([]);
  const [isFetching, setIsFetching] = React.useState(false);
  React.useEffect(() => {
    async function fetchData() {
      let events = await getEvents('ACCEPTED', false, 10, 0);
      setEvents(formatEventList(events))
    }
    const unsubscribeFocus = navigation.addListener('focus', () => {
      fetchData();
    });
    return unsubscribeFocus;
  }, []);

  async function onRefresh() {
    setIsFetching(true);
    let events = await getEvents('ACCEPTED', false, 10, 0);
    setEvents(formatEventList(events))
    setIsFetching(false);
  }
  return (
    <View style={styles.container}>
      <Header
        leftComponent={{ icon: 'notifications', color: '#fff' }}
        centerComponent={{ text: 'EVENT', style: { color: '#fff' } }}
        rightComponent={{icon: "add", color: "#fff", onPress: () => navigation.navigate("Create Event")}}
        statusBarProps={{translucent: true}}
        />
      <View style={styles.container}>
        <SectionList
        style={styles.listContainer}
          sections={events}
          onRefresh={() => onRefresh()}
          refreshing={isFetching}
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
            <Text h3 style={styles.sectionHeader}>{section.title}</Text>
          )}
          ItemSeparatorComponent={() => (<Divider style={{ height: 0, margin: 10, backgroundColor: 'black' }} />)}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
    marginLeft: 15,
    marginRight: 15
  },
  sectionHeader: {
    marginTop: 15,
    marginBottom: 15,
    fontFamily: "OpenSans_400Regular",
    fontSize: 20,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    color: "#15cdca"
  },
});
