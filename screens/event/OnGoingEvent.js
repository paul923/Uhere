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

export default function OnGoingEvent({ navigation, route }) {
  const [events, setEvents] = React.useState([]);
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
});
