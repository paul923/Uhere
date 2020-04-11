import * as React from 'react';
import { SectionList, FlatList, StyleSheet, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Image, Button, Text, ListItem, Divider, Icon, SearchBar, Header } from 'react-native-elements';
import AuthContext from '../contexts/AuthContext';
import firebaseObject from '../config/firebase';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useSafeArea } from 'react-native-safe-area-context';
import EventCard from '../components/EventCard';
import EventFilter from '../components/EventFilter';

const Tab = createMaterialTopTabNavigator();

const testMembers = [
  {
    name: 'Matthew Kim',
    initial: 'MK',
    color: '#fc0f03',
    location: { latitude: 49.3049901, longitude: -122.8332702 },
  },
  {
    name: 'Paul Kim',
    initial: 'PK',
    color: '#0362fc',
    location: { latitude: 49.2620402, longitude: -122.8763948 },
  },
  {
    name: 'Justin Choi',
    initial: 'JC',
    color: '#fcba03',
    location: { latitude: 49.2509886, longitude: -122.8920569 },
  },
]

function PendingEvent({ navigation }) {

  return (
    <View style={styles.container}>
      <SectionList
        style={styles.listContainer}
        sections={[
          {
            title: "Mar 20",
            data: [
              { key: 1, name: 'GAZUA', date: new Date(2020, 2, 20), location: 'Juilet Cafe', maximumNumberOfMembers: 5, members: [], prize: 'americano' },
              { key: 2, name: 'StartCraft', date: new Date(2020, 2, 20), location: 'Juilet Cafe', maximumNumberOfMembers: 5, members: [], prize: 'americano' }
            ]
          },
          {
            title: "Mar 19",
            data: [
              { key: 3, name: 'GAZUA', date: new Date(2020, 2, 19), location: 'Juilet Cafe', maximumNumberOfMembers: 5, members: [], prize: 'americano' },
              { key: 4, name: 'GAZUA', date: new Date(2020, 2, 19), location: 'Juilet Cafe', maximumNumberOfMembers: 5, members: [], prize: 'americano' }
            ]
          },
          {
            title: "Mar 18",
            data: [
              { key: 5, name: 'GAZUA', date: new Date(2020, 2, 18), location: 'Juilet Cafe', maximumNumberOfMembers: 5, members: [], prize: 'americano' }
            ]
          }
        ]}
        renderItem={({ item }) => <EventCard item={item} status="PENDING" onPress={() => navigation.navigate('Event Detail', { item: item })} />}
        keyExtractor={(item) => item.key.toString()}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        ListHeaderComponent={EventFilter}
        ItemSeparatorComponent={() => (<Divider style={{ height: 1, margin: 5, backgroundColor: 'black' }} />)}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

function OnGoingEvent({ navigation }) {
  return (
    <View style={styles.container}>
      <SectionList
        style={styles.listContainer}
        sections={[
          {
            title: "Apr 20",
            data: [
              { key: 1, name: 'GAZUA', date: new Date(2020, 3, 11, 13, 30), timer: 30, location: 'Juilet Cafe', maximumNumberOfMembers: 5, members: testMembers, prize: 'americano' },
              { key: 2, name: 'StartCraft', date: new Date(2020, 3, 11, 14, 0), timer: 30, location: 'Juilet Cafe', maximumNumberOfMembers: 5, members: testMembers, prize: 'americano' }
            ]
          },
          {
            title: "Apr 19",
            data: [
              { key: 3, name: 'GAZUA', date: new Date(2020, 3, 19), location: 'Juilet Cafe', maximumNumberOfMembers: 5, members: [], prize: 'americano' },
              { key: 4, name: 'GAZUA', date: new Date(2020, 3, 19), location: 'Juilet Cafe', maximumNumberOfMembers: 5, members: [], prize: 'americano' }
            ]
          },
          {
            title: "Apr 18",
            data: [
              { key: 5, name: 'GAZUA', date: new Date(2020, 3, 18), location: 'Juilet Cafe', maximumNumberOfMembers: 5, members: [], prize: 'americano' }
            ]
          }
        ]}
        renderItem={({ item }) =>
          <EventCard
            item={item}
            status="ON-GOING"
            onPress={() => {
              if ((item.date - new Date()) < (item.timer * 60000)) {
                navigation.navigate('Event Detail Map', { item: item })
              }
              else {
                navigation.navigate('Event Detail', { item: item })
              }
            }
            }
          />
        }
        keyExtractor={(item) => item.key.toString()}
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
function EventHistory() {
  return (
    <View style={styles.container}>
      <Text>Pending Event</Text>
    </View>
  )
}

export default function EventScreen({ navigation, route }) {
  const insets = useSafeArea();
  const { signIn, signOut } = React.useContext(AuthContext);
  firebaseSignOut = async () => {
    firebaseObject.auth().signOut().then(() => {
      signOut();
    })
  }
  return (
    <View style={styles.container}>
      <Header
        leftComponent={{ icon: 'notifications', color: '#fff' }}
        centerComponent={{ text: 'EVENT', style: { color: '#fff' } }}
        rightComponent={{ icon: "add", color: "#fff", onPress: () => navigation.navigate("Create Event") }}
      />
      <Tab.Navigator>
        <Tab.Screen name="Pending Event" component={PendingEvent} />
        <Tab.Screen name="On-Going Event" component={OnGoingEvent} />
        <Tab.Screen name="Event History" component={EventHistory} />
      </Tab.Navigator>
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
