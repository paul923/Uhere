import * as React from 'react';
import { SectionList, FlatList, StyleSheet, View, ActivityIndicator, TouchableOpacity  } from 'react-native';
import { Image, Button, Text, ListItem, Divider, Icon, SearchBar } from 'react-native-elements';
import AuthContext from '../contexts/AuthContext';
import firebaseObject from '../config/firebase';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useSafeArea } from 'react-native-safe-area-context';
import EventCard from '../components/EventCard';

const Tab = createMaterialTopTabNavigator();

function PendingEvent(){

  return (
    <View style={styles.container}>
      <SectionList
        style={{marginLeft: 5, marginRight: 5}}
        sections={[
          {
            title: "Mar 20",
            data: [
              { key: 1, name: 'GAZUA', date: new Date(2020, 2, 20), location: 'Juilet Cafe', maximumNumberOfMembers: 5, members: [], prize: 'americano' },
              { key: 2, name: 'GAZUA', date: new Date(2020, 2, 20), location: 'Juilet Cafe', maximumNumberOfMembers: 5, members: [], prize: 'americano' }
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
        renderItem={({ item }) => <EventCard item={item} status="PENDING" />}
        keyExtractor={(item) => item.key.toString()}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        ListHeaderComponent={() => (
          <SearchBar
            placeholder="Search"
            lightTheme
            round
          />
        )}
        ItemSeparatorComponent={() => (<Divider style={{ height: 0.3, margin: 5, backgroundColor: 'black' }} />)}
      />
    </View>
  )
}

function OnGoingEvent(){
  return (
    <View style={styles.container}>
      <SectionList
        style={{marginLeft: 5, marginRight: 5}}
        sections={[
          {
            title: "Mar 20",
            data: [
              { key: 1, name: 'GAZUA', date: new Date(2020, 3, 20), location: 'Juilet Cafe', maximumNumberOfMembers: 5, members: [], prize: 'americano' },
              { key: 2, name: 'GAZUA', date: new Date(2020, 3, 20), location: 'Juilet Cafe', maximumNumberOfMembers: 5, members: [], prize: 'americano' }
            ]
          },
          {
            title: "Mar 19",
            data: [
              { key: 3, name: 'GAZUA', date: new Date(2020, 3, 19), location: 'Juilet Cafe', maximumNumberOfMembers: 5, members: [], prize: 'americano' },
              { key: 4, name: 'GAZUA', date: new Date(2020, 3, 19), location: 'Juilet Cafe', maximumNumberOfMembers: 5, members: [], prize: 'americano' }
            ]
          },
          {
            title: "Mar 18",
            data: [
              { key: 5, name: 'GAZUA', date: new Date(2020, 3, 18), location: 'Juilet Cafe', maximumNumberOfMembers: 5, members: [], prize: 'americano' }
            ]
          }
        ]}
        renderItem={({ item }) => <EventCard item={item} status="ON-GOING" />}
        keyExtractor={(item) => item.key.toString()}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        ListHeaderComponent={() => (
          <SearchBar
            placeholder="Search"
            lightTheme
            round
          />
        )}
        ItemSeparatorComponent={() => (<Divider style={{ height: 0.3, margin: 5, backgroundColor: 'black' }} />)}
      />
    </View>
  )
}
function EventHistory(){
  return (
    <View style={styles.container}>
      <Text>Pending Event</Text>
    </View>
  )
}

export default function EventScreen() {
  const insets = useSafeArea();
  const { signIn, signOut } = React.useContext(AuthContext);
  firebaseSignOut = async () => {
    firebaseObject.auth().signOut().then(() => {
      signOut();
    })
  }
  return (
    <Tab.Navigator
    tabBarOptions={{
      style: { paddingTop: insets.top },
    }}>
      <Tab.Screen name="Pending Event" component={PendingEvent} />
      <Tab.Screen name="On-Going Event" component={OnGoingEvent} />
      <Tab.Screen name="Event History" component={EventHistory} />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5FCFF'
    }
});
