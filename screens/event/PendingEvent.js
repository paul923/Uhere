import * as React from 'react';
import { SectionList, FlatList, StyleSheet, View, ActivityIndicator, TouchableOpacity  } from 'react-native';
import { Image, Button, Text, ListItem, Divider, Icon, SearchBar, Header } from 'react-native-elements';
import EventCard from 'components/EventCard';
import EventFilter from 'components/EventFilter';
import { formatEventList } from 'utils/event';
import Constants from "expo-constants";
import firebase from "firebase";

import { getEvents } from 'api/event';

const { manifest } = Constants;
import { backend } from 'constants/Environment';

export default function PendingEvent({ navigation, route }) {
  const [events, setEvents] = React.useState([]);
  const [isFetching, setIsFetching] = React.useState(false);
  React.useEffect(() => {
    async function fetchData() {
      let events = await getEvents('PENDING', false, 10, 0);
      setEvents(formatEventList(events))
    }
    const unsubscribeFocus = navigation.addListener('focus', () => {
      fetchData();
    });

    return unsubscribeFocus;

  }, []);

  async function onRefresh() {
    setIsFetching(true);
    let events = await getEvents('PENDING', false, 10, 0);
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
            status="PENDING"
            onPress={()=>navigation.navigate('Event Detail', {
              EventId: item.EventId,
              EventType: "PENDING"
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
    }
});
